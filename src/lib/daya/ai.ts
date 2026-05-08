import type {
  BehavioralInsight,
  ChatRequestMessage,
  ChildProfile,
  DailyCheckIn,
  SafetyAssessment,
  SupportSnippet,
} from "@/types";
import { getSnippetText } from "@/lib/support-snippets";
import {
  computeBehavioralWeights,
  type BehavioralWeights,
} from "@/lib/daya/behavioral-weights";
import {
  buildLongitudinalProfile,
  predictNextDay,
} from "@/lib/daya/longitudinal";
import type { SupportedLanguage } from "@/lib/daya/i18n";
import { buildParentProfile } from "@/lib/daya/parent-intelligence";


type StreamInput = {
  system: string;
  messages: ChatRequestMessage[];
  child?: ChildProfile;
  checkIns?: DailyCheckIn[];
  insights?: BehavioralInsight[];
  supportSnippets?: SupportSnippet[];
  safety: SafetyAssessment;
  language?: SupportedLanguage;
  intent?: string;
};


type ProviderName = "anthropic" | "openai" | "demo";

export async function createDayaResponseStream(input: StreamInput): Promise<{
  stream: ReadableStream<Uint8Array>;
  provider: ProviderName;
}> {
  if (input.safety.blocked && input.safety.response) {
    return {
      stream: createTextStream(input.safety.response, 10),
      provider: "demo",
    };
  }

  const preferredProvider = process.env.DAYA_AI_PROVIDER;

  if (preferredProvider !== "openai" && process.env.ANTHROPIC_API_KEY) {
    try {
      return {
        stream: await streamFromAnthropic(input),
        provider: "anthropic",
      };
    } catch (error) {
      console.error("Anthropic stream failed", error);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      return {
        stream: await streamFromOpenAI(input),
        provider: "openai",
      };
    } catch (error) {
      console.error("OpenAI stream failed", error);
    }
  }

  return {
    stream: createTextStream(createDemoReply(input), 12),
    provider: "demo",
  };
}

export function createTextStream(text: string, delayMs = 0) {
  const encoder = new TextEncoder();
  const chunks = text.match(/.{1,18}(\s|$)/g) ?? [text];

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const chunk of chunks) {
        if (delayMs > 0) await wait(delayMs);
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

async function streamFromAnthropic(input: StreamInput) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
      max_tokens: Number(process.env.DAYA_MAX_TOKENS ?? 900),
      system: input.system,
      messages: normalizeMessages(input.messages),
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Anthropic request failed with ${response.status}`);
  }

  return transformSSE(response.body, (event) => {
    if (event.type !== "content_block_delta") return "";
    const delta = event.delta as { type?: string; text?: string } | undefined;
    return delta?.type === "text_delta" ? delta.text ?? "" : "";
  });
}

async function streamFromOpenAI(input: StreamInput) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5-chat-latest",
      messages: [
        { role: "system", content: input.system },
        ...normalizeMessages(input.messages),
      ],
      max_completion_tokens: Number(process.env.DAYA_MAX_TOKENS ?? 900),
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`OpenAI request failed with ${response.status}`);
  }

  return transformSSE(response.body, (event) => {
    const choices = event.choices as
      | Array<{ delta?: { content?: string } }>
      | undefined;
    const choice = choices?.[0];
    return choice?.delta?.content ?? "";
  });
}

function transformSSE(
  body: ReadableStream<Uint8Array>,
  pickText: (event: Record<string, unknown>) => string
) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = body.getReader();
  let buffer = "";
  let closed = false;
  const pending: string[] = [];

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const queued = pending.shift();
      if (queued) {
        controller.enqueue(encoder.encode(queued));
        return;
      }

      while (!closed) {
        const { value, done } = await reader.read();
        if (done) {
          closed = true;
          controller.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const dataLines = event
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.replace(/^data:\s?/, "").trim());

          for (const dataLine of dataLines) {
            if (!dataLine || dataLine === "[DONE]") {
              closed = true;
              controller.close();
              return;
            }

            try {
              const parsed = JSON.parse(dataLine) as Record<string, unknown>;
              const text = pickText(parsed);
              if (text) pending.push(text);
            } catch {
              continue;
            }
          }
        }

        const next = pending.shift();
        if (next) {
          controller.enqueue(encoder.encode(next));
          return;
        }
      }
    },
    cancel() {
      closed = true;
      reader.cancel().catch(() => undefined);
    },
  });
}

function normalizeMessages(messages: ChatRequestMessage[]) {
  const recent = messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(-14)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 4000),
    }));

  return squashConsecutiveRoles(recent);
}

function squashConsecutiveRoles(
  messages: Array<{ role: "user" | "assistant"; content: string }>
) {
  return messages.reduce<Array<{ role: "user" | "assistant"; content: string }>>(
    (acc, message) => {
      const last = acc.at(-1);
      if (last?.role === message.role) {
        last.content = `${last.content}\n\n${message.content}`;
      } else {
        acc.push({ ...message });
      }
      return acc;
    },
    []
  );
}

function createDemoReply({
  child,
  checkIns = [],
  insights = [],
  supportSnippets = [],
  messages,
  safety,
  language = "en",
  intent = "general_support",
}: StreamInput) {
  const childName = child?.name ?? "your child";
  const latest = messages.at(-1)?.content.toLowerCase() ?? "";
  const msgCount = messages.filter((m) => m.role === "user").length;

  if (safety.category !== "none" && safety.category !== "medical") {
    return safety.response ?? "I want to keep DAYA safely inside parent-support scope.";
  }

  // Build the longitudinal profile for personalised responses
  const profile = checkIns.length >= 3
    ? buildLongitudinalProfile(checkIns, insights)
    : null;

  const weights: BehavioralWeights | undefined =
    checkIns.length > 0
      ? computeBehavioralWeights(checkIns, insights)
      : undefined;

  const parts: string[] = [];

  // ── Personalised opening ─────────────────────────────────────────────────
  parts.push(pickDynamicOpening(latest, childName, msgCount, intent, weights, profile));

  const showNoticed = msgCount % 3 === 1; // Only show every 3rd message so it doesn't get repetitive
  const showIdea = msgCount % 2 === 0;

  // ── What DAYA Noticed (longitudinal-aware) ───────────────────────────────
  if (showNoticed && profile && checkIns.length >= 5) {
    const noticeLines: string[] = [];
    noticeLines.push(`🧠 What DAYA Noticed`);

    if (profile.knownTriggers.length > 0 && /(hard|meltdown|rough|difficult|upset)/i.test(latest)) {
      noticeLines.push(`Based on ${profile.checkInCount} logged days, recurring triggers for ${childName} include: ${profile.knownTriggers.slice(0, 2).join(" and ")}. Today sounds like it may have touched one of these.`);
    } else if (profile.sleepMoodLag < -0.4 && checkIns.at(-1)?.sleep_quality && checkIns.at(-1)!.sleep_quality <= 2) {
      noticeLines.push(`DAYA has noticed that ${childName}'s days tend to feel heavier after lower-sleep nights. The pattern across ${profile.checkInCount} check-ins shows an average mood dip of ${Math.abs(profile.sleepMoodLag).toFixed(1)} points. Tomorrow may benefit from a gentler start.`);
    } else if (profile.sensoryMeltdownRate >= 0.5) {
      noticeLines.push(`Across ${profile.checkInCount} logged days, ${Math.round(profile.sensoryMeltdownRate * 100)}% of high-sensory days have led to difficult moments for ${childName}. DAYA is building a clearer picture of these sensory thresholds.`);
    } else if (profile.difficultPeriodPattern) {
      noticeLines.push(`DAYA has noticed ${profile.difficultPeriodPattern}s are frequently the hardest part of the day for ${childName}. Building a buffer before that window may be worth trying.`);
    } else {
      const insight = insights[msgCount % Math.max(insights.length, 1)] ?? insights[0];
      if (insight) {
        noticeLines.push(insight.description);
      }
    }
    
    if (noticeLines.length > 1) {
       parts.push(noticeLines.join("\n"));
    }
  }

  // ── One Gentle Idea (calming-activity-aware) ─────────────────────────────
  if (showIdea || intent === "sensory_overload" || intent === "meltdown_crisis") {
    if (profile && profile.knownCalming.length > 0 &&
        /(hard|meltdown|rough|difficult|need|try|help|idea)/i.test(latest)) {
      const topCalming = profile.knownCalming[0];
      parts.push(`🌱 One Gentle Idea\nBased on what's helped ${childName} before, ${topCalming} has appeared on calmer days. If the energy allows, this might be a gentle option to try — familiar rather than new.`);
    } else {
      const snippetIdx = msgCount % Math.max(supportSnippets.length, 1);
      const support = supportSnippets[snippetIdx] ?? supportSnippets[0];
      if (support) {
        parts.push(`🌱 One Gentle Idea\n${getSnippetText(support)}`);
      }
    }
  }

  // ── Specific Intent Handlers ───────────────────────────────────
  if (intent === "planning_request" || latest.includes("tomorrow") || latest.includes("plan")) {
    if (profile && checkIns.at(-1)) {
      const prediction = predictNextDay(checkIns.at(-1)!, profile, childName);
      if (prediction.riskLevel !== "low" && prediction.recommendedFocus.length > 0) {
        const focusText = prediction.recommendedFocus.slice(0, 2).join(" ");
        parts.push(`🗓️ Tomorrow's Support Flow\n${focusText}\nHead to the Daily Plan tab for a morning/afternoon/evening flow built from ${childName}'s recent patterns.`);
      } else {
        parts.push(`🗓️ Tomorrow's Support Flow\nThe patterns look manageable for tomorrow. Head to the Daily Plan tab for a personalised morning/afternoon/evening flow.`);
      }
    } else {
      parts.push(`🗓️ Tomorrow's Support Flow\nHead to the Daily Plan tab for a personalised morning/afternoon/evening flow based on ${childName}'s recent patterns.`);
    }
  }

  if (intent === "food_concern" || latest.includes("food") || latest.includes("eat")) {
     parts.push(`🍽️ Gentle Meal Ideas\nSince food has been tricky today, let's keep tomorrow's meals very low-demand. Offer only preferred, familiar "safe foods" in their usual presentation. If ${childName} is sensory-avoidant right now, smooth textures (like yogurt or blended soups) might be easier to process.`);
  }

  // ── Parent support (advanced tracking) ────────────────────────────────────
  const parentProfile = buildParentProfile(checkIns);
  const isHighStress = (weights?.parent_support_priority ?? 0) >= 0.6 || parentProfile.avgStressLevel >= 3.5;
  const isBurnoutRisk = parentProfile.burnoutRiskScore >= 0.6;
  const isIsolated = parentProfile.burnoutIndicators.isolationRisk;

  if (
    /(exhaust|tired|overwhelm|can't|burned|stress|guilt|awful|hopeless)/i.test(latest) ||
    isHighStress || isBurnoutRisk
  ) {
    let parentMsg = "";
    
    if (isBurnoutRisk) {
      parentMsg = `🤍 For You\nWhat you're feeling isn't a lack of strength — it's the biological reality of caregiver burnout. Across ${parentProfile.daysTracked} days, you've carried a consistent weight. Today, your wellbeing is the priority. Please find ONE moment to step away, even for 5 minutes. You matter as much as the support you give.`;
    } else if (isIsolated) {
      parentMsg = `🤍 For You\nIt can feel like you're on an island doing this alone. DAYA sees the ${parentProfile.daysTracked} days of work you've put in. Please know that many parents in the community feel this same isolation — you aren't failing because it feels hard. Connection is a need, not a luxury.`;
    } else {
      parentMsg = profile && profile.checkInCount >= 5
        ? `🤍 For You\nYou've shown up for ${childName} across ${profile.checkInCount} days of careful observation. That consistency is one of the most powerful things a parent can offer — even when the days are hard. What you're carrying is real, and noticing it is a strength.`
        : `🤍 For You\nWhat you're carrying is real, and noticing it is a strength. You don't have to solve everything today. Even logging this check-in is an act of care.`;
    }
    parts.push(parentMsg);
  }

  // ── Contextual disclaimer ─────────────────────────────────────────────────
  if (safety.category === "medical") {
    parts.push(`Because this touches health, it is worth sharing these observations with a pediatrician or specialist too.`);
  }

  const englishReply = parts.join("\n\n");
  return language === "en" ? englishReply : localiseDemoReply(englishReply, language, childName);
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO LANGUAGE WRAPPER
// In demo mode (no API key), we can't call an LLM to translate.
// Instead we produce a fully localised frame with the core content embedded,
// so the parent sees their chosen language immediately.
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_LANG_FRAMES: Record<string, {
  greeting: string;
  noticed: string;
  idea: string;
  forYou: string;
  plan: string;
  note: string;
}> = {
  hi: {
    greeting: "नमस्ते 💛",
    noticed: "🧠 DAYA ने क्या देखा",
    idea: "🌱 एक सौम्य सुझाव",
    forYou: "🤍 आपके लिए",
    plan: "🗓️ कल की योजना",
    note: "_(नोट: पूरी हिन्दी में जवाब के लिए अपनी `.env.local` फाइल में API key जोड़ें।)_",
  },
  ta: {
    greeting: "வணக்கம் 💛",
    noticed: "🧠 DAYA கண்டறிந்தது",
    idea: "🌱 ஒரு மென்மையான யோசனை",
    forYou: "🤍 உங்களுக்காக",
    plan: "🗓️ நாளைய திட்டம்",
    note: "_(குறிப்பு: முழு தமிழ் பதிலுக்கு `.env.local`-ல் API key சேர்க்கவும்.)_",
  },
  te: {
    greeting: "నమస్కారం 💛",
    noticed: "🧠 DAYA గమనించింది",
    idea: "🌱 ఒక మృదువైన సూచన",
    forYou: "🤍 మీకోసం",
    plan: "🗓️ రేపటి ప్లాన్",
    note: "_(గమనిక: పూర్తి తెలుగు సమాధానానికి `.env.local`లో API key జోడించండి.)_",
  },
  bn: {
    greeting: "নমস্কার 💛",
    noticed: "🧠 DAYA যা লক্ষ্য করেছে",
    idea: "🌱 একটি মৃদু পরামর্শ",
    forYou: "🤍 আপনার জন্য",
    plan: "🗓️ আগামীকালের পরিকল্পনা",
    note: "_(দ্রষ্টব্য: সম্পূর্ণ বাংলায় উত্তরের জন্য `.env.local`-এ API key যোগ করুন।)_",
  },
  mr: {
    greeting: "नमस्कार 💛",
    noticed: "🧠 DAYA ने काय पाहिले",
    idea: "🌱 एक सौम्य सूचना",
    forYou: "🤍 तुमच्यासाठी",
    plan: "🗓️ उद्याची योजना",
    note: "_(टीप: संपूर्ण मराठीत उत्तरासाठी `.env.local` मध्ये API key जोडा.)_",
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ 💛",
    noticed: "🧠 DAYA ಗಮನಿಸಿದ್ದು",
    idea: "🌱 ಒಂದು ಸೌಮ್ಯ ಸಲಹೆ",
    forYou: "🤍 ನಿಮಗಾಗಿ",
    plan: "🗓️ ನಾಳೆಯ ಯೋಜನೆ",
    note: "_(ಸೂಚನೆ: ಸಂಪೂರ್ಣ ಕನ್ನಡ ಉತ್ತರಕ್ಕೆ `.env.local`-ನಲ್ಲಿ API key ಸೇರಿಸಿ.)_",
  },
  gu: {
    greeting: "નમસ્તે 💛",
    noticed: "🧠 DAYA એ શું જોયું",
    idea: "🌱 એક સૌમ્ય સૂચન",
    forYou: "🤍 તમારા માટે",
    plan: "🗓️ કાલ માટે યોજના",
    note: "_(નોંધ: સંપૂર્ণ ગુજરાતીમાં જવાબ માટે `.env.local`માં API key ઉમેરો.)_",
  },
};

function localiseDemoReply(
  englishReply: string,
  language: string,
  childName: string
): string {
  const frame = DEMO_LANG_FRAMES[language];
  if (!frame) return englishReply;

  // Split reply into sections by emoji headers and extract content
  const extractSection = (emoji: string): string => {
    const idx = englishReply.indexOf(emoji);
    if (idx === -1) return "";
    const afterEmoji = englishReply.slice(idx);
    const lineEnd = afterEmoji.indexOf("\n");
    if (lineEnd === -1) return "";
    const content = afterEmoji.slice(lineEnd + 1);
    // Stop at the next emoji section
    const nextSection = content.search(/[🧠🌱🗓️🤍]/u);
    return (nextSection === -1 ? content : content.slice(0, nextSection)).trim();
  };

  const noticedContent = extractSection("🧠");
  const ideaContent = extractSection("🌱");
  const planContent = extractSection("🗓");
  const forYouContent = extractSection("🤍");

  const parts: string[] = [];

  // Opening in target language
  parts.push(frame.greeting);

  // Noticed section
  if (noticedContent) {
    parts.push(`${frame.noticed}\n${noticedContent}`);
  }

  // Idea section
  if (ideaContent) {
    parts.push(`${frame.idea}\n${ideaContent}`);
  }

  // Plan section
  if (planContent) {
    parts.push(`${frame.plan}\n${planContent}`);
  }

  // For you section
  if (forYouContent) {
    parts.push(`${frame.forYou}\n${forYouContent}`);
  }

  // Demo mode note
  parts.push(frame.note);

  return parts.join("\n\n");
}

function pct(v: number): string {
  return `${Math.round(v * 100)}%`;
}

function pickDynamicOpening(
  message: string,
  childName: string,
  msgCount: number,
  intent: string,
  weights?: BehavioralWeights,
  profile?: ReturnType<typeof buildLongitudinalProfile> | null
): string {
  
  if (intent === "celebration" || /( great|amazing|wonderful|good day|progress|milestone|proud|new word|first time)/i.test(message)) {
    const list = [
      `💛 I love hearing this! These moments deserve to be truly noticed and celebrated.`,
      `💛 What a beautiful update. ${childName}'s progress is really showing — and your patience is paying off.`,
      `💛 That's fantastic! Make sure you take a moment to soak this in. You've both worked hard for this.`
    ];
    return list[msgCount % list.length];
  }

  if (intent === "meltdown_crisis" || /( hard|rough|terrible|awful|meltdown|difficult|crying|upset)/i.test(message)) {
    const list = [
      `💛 That sounds like a genuinely exhausting stretch. You're paying such close attention, and that matters so much right now.`,
      `💛 I can feel how heavy today was. You showed up for ${childName} through something really difficult. Please take a deep breath.`,
      `💛 Hard days like this don't erase all the careful parenting you've been doing. They're just hard. Let's just focus on settling their nervous system tonight.`
    ];
    return list[msgCount % list.length];
  }

  if (intent === "school_struggle" || message.includes("school")) {
    const list = [
      `💛 School transitions can demand so much of ${childName}'s sensory battery. Let's focus on creating a low-demand safe space now that they are home.`,
      `💛 It's so common for the demands of the classroom to overflow when they get home. You are their safe harbor.`
    ];
    return list[msgCount % list.length];
  }

  if (intent === "sleep_issue" || /( sleep|tired|bedtime|night|exhausted|wake)/i.test(message)) {
    const list = [
      `💛 Sleep shapes so much of the next day's regulatory capacity. Let's see what ${childName}'s sleep patterns are telling us.`,
      `💛 A rough night makes everything else harder. Let's aim to lower all non-essential demands for both of you today.`
    ];
    return list[msgCount % list.length];
  }

  if (intent === "planning_request" || /( plan|tomorrow)/i.test(message)) {
    const list = [
      `💛 Let's look ahead. Based on today's energy, we can structure tomorrow to feel a bit more predictable for ${childName}.`,
      `💛 Planning ahead is a great way to reduce anxiety for everyone. I've prepared a flow based on their recent patterns.`
    ];
    return list[msgCount % list.length];
  }

  // Default varied conversational pool
  const defaultList = [
    `💛 Thank you for sharing that. Every observation helps DAYA understand ${childName} more deeply.`,
    `💛 I hear you. It's so helpful that you're tracking these moments.`,
    `💛 You're building such a meaningful picture by noticing these details. Let's look at what stands out.`,
    `💛 Got it. I'm keeping track of these patterns so we can find what works best for ${childName}.`,
    `💛 Let's gently see what we can learn from this moment.`,
  ];
  return defaultList[msgCount % defaultList.length];
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
