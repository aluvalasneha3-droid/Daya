import type { DailyCheckIn, BehavioralInsight } from "@/types";

export type DayaIntent =
  | "sensory_overload"
  | "hyperactivity"
  | "emotional_stress"
  | "food_concern"
  | "sleep_issue"
  | "transition_difficulty"
  | "communication_struggle"
  | "routine_disruption"
  | "meltdown_recovery"
  | "activity_request"
  | "planning_request"
  | "parent_anxiety"
  | "celebration"
  | "general";

export type ResponseMode =
  | "emotional_support"
  | "pattern_observation"
  | "sensory_support"
  | "routine_planning"
  | "food_meal_support"
  | "activity_suggestion"
  | "parent_support"
  | "daily_planning";

type IntentResult = {
  primary: DayaIntent;
  secondary: DayaIntent[];
  responseMode: ResponseMode;
  confidence: number;
};

const INTENT_RULES: Array<{
  intent: DayaIntent;
  patterns: RegExp[];
  keywords: string[];
  weight: number;
}> = [
  {
    intent: "sensory_overload",
    patterns: [
      /\b(sensory|overstimulat|overwhelm|too (loud|bright|much)|cover.*(ears|eyes))\b/i,
      /\b(noise|crowd|party|loud|bright light|fluorescent)\b/i,
      /\b(meltdown.*(party|crowd|noise|store|mall))\b/i,
    ],
    keywords: ["sensory", "overwhelm", "loud", "bright", "noise", "crowd", "overstimulated", "covering ears", "too much"],
    weight: 1.2,
  },
  {
    intent: "hyperactivity",
    patterns: [
      /\b(hyperactiv|can't sit still|bouncing|running around|high energy|stimm)\b/i,
      /\b(won't stop moving|so much energy|wired|restless)\b/i,
    ],
    keywords: ["hyper", "energy", "bouncing", "running", "restless", "stimming", "fidgeting", "wired"],
    weight: 1.0,
  },
  {
    intent: "emotional_stress",
    patterns: [
      /\b(crying|tearful|upset|anxious|worried|scared|clingy|tantrum)\b/i,
      /\b(emotional|meltdown|distress|freaking out|falling apart)\b/i,
    ],
    keywords: ["crying", "upset", "anxious", "scared", "clingy", "tearful", "emotional", "distressed", "angry", "frustrated"],
    weight: 1.1,
  },
  {
    intent: "food_concern",
    patterns: [
      /\b(eat|food|meal|dinner|lunch|breakfast|snack|picky|texture|won't eat|refused food)\b/i,
      /\b(hunger|hungry|feeding|nutrition|diet|hydrat)\b/i,
    ],
    keywords: ["food", "eat", "meal", "dinner", "lunch", "breakfast", "snack", "picky", "texture", "hungry", "feeding", "hydration", "water", "drink"],
    weight: 1.0,
  },
  {
    intent: "sleep_issue",
    patterns: [
      /\b(sleep|bedtime|wake|night|tired|exhausted|nap|insomnia|restless night)\b/i,
      /\b(didn't sleep|barely slept|up all night|trouble sleeping|won't sleep)\b/i,
    ],
    keywords: ["sleep", "bedtime", "tired", "exhausted", "nap", "night", "wake", "insomnia", "restless"],
    weight: 1.1,
  },
  {
    intent: "transition_difficulty",
    patterns: [
      /\b(transition|change|switch|new (school|place|class)|moved|moving|leaving)\b/i,
      /\b(won't leave|doesn't want to go|resistant to|refusing to)\b/i,
    ],
    keywords: ["transition", "change", "switch", "leaving", "new place", "moved", "different", "won't go"],
    weight: 1.0,
  },
  {
    intent: "communication_struggle",
    patterns: [
      /\b(communication|speak|talk|words|verbal|non.?verbal|language|express)\b/i,
      /\b(can't tell me|won't say|stopped talking|quiet today|echola)\b/i,
    ],
    keywords: ["communication", "talk", "speak", "words", "verbal", "non-verbal", "express", "language", "echolalia", "quiet"],
    weight: 1.0,
  },
  {
    intent: "routine_disruption",
    patterns: [
      /\b(routine|schedule|different today|unusual|out of order|disrupted|unexpected)\b/i,
      /\b(doctor.*(visit|appointment)|holiday|vacation|visitor|guests)\b/i,
    ],
    keywords: ["routine", "schedule", "different", "unusual", "disrupted", "unexpected", "appointment", "holiday", "vacation"],
    weight: 1.0,
  },
  {
    intent: "meltdown_recovery",
    patterns: [
      /\b(meltdown|after.*(meltdown|tantrum)|recover|calm(ed|ing) down)\b/i,
      /\b(hard (day|evening|morning|afternoon)|rough|terrible|awful day)\b/i,
    ],
    keywords: ["meltdown", "recover", "calm down", "hard day", "rough day", "terrible", "awful", "difficult day"],
    weight: 1.2,
  },
  {
    intent: "activity_request",
    patterns: [
      /\b(activit|what (can|should) (we|i) do|ideas? for|suggest|game|play)\b/i,
      /\b(calming activit|sensory activit|indoor|outdoor|rainy day)\b/i,
    ],
    keywords: ["activity", "activities", "ideas", "suggest", "game", "play", "calming", "what to do", "bored"],
    weight: 1.0,
  },
  {
    intent: "planning_request",
    patterns: [
      /\b(plan|tomorrow|next (day|week)|prepare|getting ready|schedule|structure)\b/i,
      /\b(how (should|can) (we|i) (plan|prepare|structure))\b/i,
      /\b(support (plan|flow|routine))\b/i,
    ],
    keywords: ["plan", "tomorrow", "next day", "prepare", "schedule", "structure", "routine", "organize", "support flow"],
    weight: 1.3,
  },
  {
    intent: "parent_anxiety",
    patterns: [
      /\b(i('m| am) (worried|scared|anxious|tired|exhausted|overwhelmed|burned out))\b/i,
      /\b(i can't (cope|handle|do this)|breaking point|so hard|hopeless)\b/i,
      /\b(am i doing (enough|right|okay))\b/i,
    ],
    keywords: ["worried", "scared", "exhausted", "overwhelmed", "burned out", "can't cope", "hopeless", "breaking point", "doing enough"],
    weight: 1.3,
  },
  {
    intent: "celebration",
    patterns: [
      /\b(great day|amazing|wonderful|breakthrough|progress|new word|first time|proud)\b/i,
      /\b(good (day|news)|milestone|smiled|laughed|played with|tried new)\b/i,
    ],
    keywords: ["great", "amazing", "wonderful", "progress", "breakthrough", "proud", "milestone", "new word", "first time", "good day"],
    weight: 1.0,
  },
];

const INTENT_TO_MODE: Record<DayaIntent, ResponseMode> = {
  sensory_overload: "sensory_support",
  hyperactivity: "activity_suggestion",
  emotional_stress: "emotional_support",
  food_concern: "food_meal_support",
  sleep_issue: "routine_planning",
  transition_difficulty: "routine_planning",
  communication_struggle: "activity_suggestion",
  routine_disruption: "routine_planning",
  meltdown_recovery: "emotional_support",
  activity_request: "activity_suggestion",
  planning_request: "daily_planning",
  parent_anxiety: "parent_support",
  celebration: "pattern_observation",
  general: "emotional_support",
};

export function detectIntent(
  message: string,
  checkIns: DailyCheckIn[] = [],
  insights: BehavioralInsight[] = []
): IntentResult {
  const text = message.toLowerCase();
  const recent = checkIns.at(-1);

  const scores = INTENT_RULES.map((rule) => {
    let score = 0;

    for (const pattern of rule.patterns) {
      if (pattern.test(message)) score += 3 * rule.weight;
    }
    for (const kw of rule.keywords) {
      if (text.includes(kw)) score += 1.5 * rule.weight;
    }

    if (recent) {
      if (rule.intent === "sleep_issue" && recent.sleep_quality <= 2) score += 2;
      if (rule.intent === "food_concern" && recent.meal_quality <= 2) score += 2;
      if (rule.intent === "sensory_overload" && (recent.sensory_load ?? 0) >= 4) score += 2;
      if (rule.intent === "routine_disruption" && recent.routine_adherence <= 2) score += 2;
      if (rule.intent === "meltdown_recovery" && recent.meltdowns > 0) score += 2;
      if (rule.intent === "communication_struggle" && recent.communication_level <= 2) score += 2;
      if (rule.intent === "emotional_stress" && (recent.mood === "difficult" || recent.mood === "very_difficult")) score += 2;
    }

    for (const insight of insights) {
      const tags = insight.support_tags ?? [];
      if (rule.intent === "sleep_issue" && tags.includes("sleep")) score += 1;
      if (rule.intent === "sensory_overload" && tags.includes("overstimulation")) score += 1;
      if (rule.intent === "routine_disruption" && tags.includes("routine")) score += 1;
      if (rule.intent === "food_concern" && tags.includes("food_and_eating")) score += 1;
    }

    return { intent: rule.intent, score };
  });

  const sorted = scores.sort((a, b) => b.score - a.score);
  const primary = sorted[0]?.score > 0 ? sorted[0].intent : "general";
  const secondary = sorted
    .slice(1, 4)
    .filter((s) => s.score > 0)
    .map((s) => s.intent);

  const maxScore = sorted[0]?.score ?? 0;
  const confidence = Math.min(maxScore / 8, 1);

  return {
    primary,
    secondary,
    responseMode: INTENT_TO_MODE[primary],
    confidence,
  };
}

export function describeResponseMode(mode: ResponseMode): string {
  const descriptions: Record<ResponseMode, string> = {
    emotional_support:
      "Lead with empathy and emotional acknowledgment. Validate feelings first, then gently offer one observation and one small next step.",
    pattern_observation:
      "Focus on celebrating what's working. Highlight positive patterns from the data, reinforce routines that seem to help, and gently note what to keep watching.",
    sensory_support:
      "Focus on practical sensory regulation. Suggest environmental adjustments, calming sensory activities, and ways to reduce overwhelm. Be concrete and specific.",
    routine_planning:
      "Help structure calmer days. Offer specific, time-anchored routine suggestions. Think about transitions, predictability, and recovery periods.",
    food_meal_support:
      "Offer gentle food and meal structure ideas. Focus on predictability, comfort foods, sensory-friendly presentation, timing, and hydration. Never prescribe diets.",
    activity_suggestion:
      "Suggest specific, practical activities matched to the child's current energy, sensory needs, and interests. Include calming, movement, and communication activities.",
    parent_support:
      "Prioritize the parent's emotional state. Validate exhaustion, normalize difficulty, remind them of their strengths. Only offer practical help if it reduces their load.",
    daily_planning:
      "Generate a structured next-day support flow with morning, afternoon, and evening sections. Base it on recent patterns, known triggers, and what has worked before.",
  };
  return descriptions[mode];
}
