// ─────────────────────────────────────────────────────────────────────────────
// DAYA PARENT INTELLIGENCE ENGINE
//
// Tracks the parent as a first-class participant in the support system.
// Research shows parent wellbeing directly affects child regulation outcomes.
// DAYA monitors caregiver burnout risk, stress trajectory, emotional health,
// and generates personalised parent-specific support recommendations.
// ─────────────────────────────────────────────────────────────────────────────

import type { DailyCheckIn } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// PARENT PROFILE TYPE
// ─────────────────────────────────────────────────────────────────────────────

export type ParentProfile = {
  // Stress metrics
  avgStressLevel: number;           // 1-5 average across recent check-ins
  stressTrend: "worsening" | "improving" | "stable";
  peakStressDays: string[];         // dates of stress ≥ 4
  burnoutRiskScore: number;         // 0-1 composite score

  // Burnout sub-indicators
  burnoutIndicators: {
    chronicHighStress: boolean;       // avg stress ≥ 3.5 over 7+ days
    exhaustionPattern: boolean;       // parent notes contain exhaustion language
    isolationRisk: boolean;           // no mention of support in notes
    helplessnessPattern: boolean;     // hopeless/can't cope language detected
    compassionFatigue: boolean;       // consistently low empathy language
  };

  // Resilience signals
  resilienceFactors: string[];        // things that are helping the parent cope
  supportSystemHealth: "strong" | "moderate" | "fragile" | "unknown";

  // Parent emotional state
  lastEmotionalState: "calm" | "stressed" | "exhausted" | "hopeful" | "overwhelmed" | "unknown";
  emotionalTrajectory: "improving" | "declining" | "stable";

  // Data depth
  daysTracked: number;
  dataMaturity: "early" | "building" | "established";
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILD PARENT PROFILE
// ─────────────────────────────────────────────────────────────────────────────

export function buildParentProfile(checkIns: DailyCheckIn[]): ParentProfile {
  const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));
  const count = sorted.length;
  const recent = sorted.slice(-14);

  const stressValues = recent.map((c) => c.parent_stress ?? 3).filter((v) => v > 0);
  const avgStressLevel = avg(stressValues);

  const stressTrend = computeStressTrend(sorted);
  const peakStressDays = sorted
    .filter((c) => (c.parent_stress ?? 0) >= 4)
    .map((c) => c.date)
    .slice(-5);

  const burnoutIndicators = assessBurnoutIndicators(sorted, avgStressLevel);
  const burnoutRiskScore = computeBurnoutRisk(burnoutIndicators, avgStressLevel, stressTrend);

  const resilienceFactors = extractResilienceFactors(sorted);
  const supportSystemHealth = assessSupportSystem(sorted);

  const lastEmotionalState = detectLastEmotionalState(sorted.at(-1));
  const emotionalTrajectory = computeEmotionalTrajectory(sorted);

  const dataMaturity: ParentProfile["dataMaturity"] =
    count < 7 ? "early" : count < 20 ? "building" : "established";

  return {
    avgStressLevel,
    stressTrend,
    peakStressDays,
    burnoutRiskScore,
    burnoutIndicators,
    resilienceFactors,
    supportSystemHealth,
    lastEmotionalState,
    emotionalTrajectory,
    daysTracked: count,
    dataMaturity,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BURNOUT INDICATORS
// ─────────────────────────────────────────────────────────────────────────────

function assessBurnoutIndicators(
  sorted: DailyCheckIn[],
  avgStress: number
): ParentProfile["burnoutIndicators"] {
  const recent = sorted.slice(-10);
  const notes = recent
    .map((c) => `${c.parent_notes ?? ""} ${c.notes ?? ""}`.toLowerCase())
    .join(" ");

  const chronicHighStress =
    avgStress >= 3.5 &&
    sorted.slice(-7).filter((c) => (c.parent_stress ?? 0) >= 3).length >= 5;

  const exhaustionPattern =
    /exhausted|drained|burned.?out|can't do|no energy|running on empty|depleted|so tired/i.test(notes);

  const isolationRisk =
    !/partner|husband|wife|family|friend|therapist|support group|helped me|talked to/i.test(notes) &&
    sorted.length >= 5;

  const helplessnessPattern =
    /can't cope|hopeless|giving up|don't know what to do|nothing works|failed|useless|not helping/i.test(notes);

  const compassionFatigue =
    /frustrated with|angry at|can't stand|fed up|resent/i.test(notes) &&
    avgStress >= 3.5;

  return {
    chronicHighStress,
    exhaustionPattern,
    isolationRisk,
    helplessnessPattern,
    compassionFatigue,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BURNOUT RISK SCORE (0–1)
// ─────────────────────────────────────────────────────────────────────────────

function computeBurnoutRisk(
  indicators: ParentProfile["burnoutIndicators"],
  avgStress: number,
  trend: ParentProfile["stressTrend"]
): number {
  let score = 0;

  // Base from stress level
  score += (avgStress - 1) / 4 * 0.35;

  // Indicator contributions
  if (indicators.chronicHighStress) score += 0.2;
  if (indicators.exhaustionPattern) score += 0.15;
  if (indicators.isolationRisk) score += 0.12;
  if (indicators.helplessnessPattern) score += 0.15;
  if (indicators.compassionFatigue) score += 0.1;

  // Worsening trend multiplier
  if (trend === "worsening") score *= 1.2;
  if (trend === "improving") score *= 0.85;

  return Math.min(Math.round(score * 100) / 100, 1.0);
}

// ─────────────────────────────────────────────────────────────────────────────
// STRESS TREND
// ─────────────────────────────────────────────────────────────────────────────

function computeStressTrend(sorted: DailyCheckIn[]): ParentProfile["stressTrend"] {
  if (sorted.length < 4) return "stable";
  const mid = Math.floor(sorted.length / 2);
  const earlier = avg(sorted.slice(0, mid).map((c) => c.parent_stress ?? 3));
  const later = avg(sorted.slice(mid).map((c) => c.parent_stress ?? 3));
  const diff = later - earlier;
  if (diff >= 0.4) return "worsening";
  if (diff <= -0.4) return "improving";
  return "stable";
}

// ─────────────────────────────────────────────────────────────────────────────
// RESILIENCE FACTORS
// Things that appear to be helping the parent, extracted from notes.
// ─────────────────────────────────────────────────────────────────────────────

function extractResilienceFactors(sorted: DailyCheckIn[]): string[] {
  const goodDays = sorted.filter((c) => (c.parent_stress ?? 5) <= 2);
  const factors: string[] = [];

  const text = goodDays
    .map((c) => `${c.parent_notes ?? ""} ${c.notes ?? ""}`.toLowerCase())
    .join(" ");

  if (/partner|husband|wife|helped|support/i.test(text)) factors.push("partner/family support");
  if (/sleep|rested|slept well/i.test(text)) factors.push("parent got good sleep");
  if (/walk|exercise|yoga|gym|run/i.test(text)) factors.push("physical activity");
  if (/friend|talked|called|chatted/i.test(text)) factors.push("social connection");
  if (/quiet time|me time|alone|break|rest/i.test(text)) factors.push("personal time/breaks");
  if (/routine|predictable|smooth|calm/i.test(text)) factors.push("predictable child routine");
  if (/good day|great|happy|progress|milestone/i.test(text)) factors.push("child's positive progress");

  return factors.slice(0, 4);
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORT SYSTEM HEALTH
// ─────────────────────────────────────────────────────────────────────────────

function assessSupportSystem(sorted: DailyCheckIn[]): ParentProfile["supportSystemHealth"] {
  const notes = sorted
    .slice(-10)
    .map((c) => `${c.parent_notes ?? ""} ${c.notes ?? ""}`.toLowerCase())
    .join(" ");

  if (!notes.trim() || sorted.length < 3) return "unknown";

  const supportSignals = [
    /partner|spouse|husband|wife/i.test(notes),
    /family|parents|in-law|grandparent/i.test(notes),
    /friend|community|support group/i.test(notes),
    /therapist|counsellor|psychologist/i.test(notes),
    /respite|break|helped out/i.test(notes),
  ].filter(Boolean).length;

  if (supportSignals >= 3) return "strong";
  if (supportSignals >= 2) return "moderate";
  if (supportSignals >= 1) return "fragile";
  return "fragile";
}

// ─────────────────────────────────────────────────────────────────────────────
// LAST EMOTIONAL STATE DETECTION
// ─────────────────────────────────────────────────────────────────────────────

function detectLastEmotionalState(
  latest: DailyCheckIn | undefined
): ParentProfile["lastEmotionalState"] {
  if (!latest) return "unknown";

  const text = `${latest.parent_notes ?? ""} ${latest.notes ?? ""}`.toLowerCase();
  const stress = latest.parent_stress ?? 3;

  if (/hopeful|proud|happy|amazing|great day|wonderful/i.test(text)) return "hopeful";
  if (/calm|peaceful|okay|managed|fine|handled/i.test(text)) return "calm";
  if (/overwhelmed|too much|can't handle|breaking/i.test(text)) return "overwhelmed";
  if (/exhausted|drained|no energy|worn out/i.test(text)) return "exhausted";
  if (stress >= 4) return "stressed";
  if (stress <= 2) return "calm";
  return "unknown";
}

// ─────────────────────────────────────────────────────────────────────────────
// EMOTIONAL TRAJECTORY
// ─────────────────────────────────────────────────────────────────────────────

function computeEmotionalTrajectory(sorted: DailyCheckIn[]): ParentProfile["emotionalTrajectory"] {
  if (sorted.length < 4) return "stable";
  const mid = Math.floor(sorted.length / 2);
  const earlierStress = avg(sorted.slice(0, mid).map((c) => c.parent_stress ?? 3));
  const laterStress = avg(sorted.slice(mid).map((c) => c.parent_stress ?? 3));
  const diff = earlierStress - laterStress; // positive = improving
  if (diff >= 0.5) return "improving";
  if (diff <= -0.5) return "declining";
  return "stable";
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMAT PARENT PROFILE FOR SYSTEM PROMPT
// ─────────────────────────────────────────────────────────────────────────────

export function formatParentProfileForPrompt(profile: ParentProfile): string {
  if (profile.daysTracked < 2) return "";

  const lines: string[] = ["PARENT WELLBEING PROFILE (critical — inform every response):"];

  lines.push(`- Average stress level: ${profile.avgStressLevel.toFixed(1)}/5 (trend: ${profile.stressTrend})`);
  lines.push(`- Current emotional state: ${profile.lastEmotionalState}`);
  lines.push(`- Emotional trajectory: ${profile.emotionalTrajectory}`);
  lines.push(`- Burnout risk: ${profile.burnoutRiskScore >= 0.7 ? "🔴 HIGH" : profile.burnoutRiskScore >= 0.4 ? "🟡 MODERATE" : "🟢 LOW"} (score: ${(profile.burnoutRiskScore * 100).toFixed(0)}%)`);
  lines.push(`- Support system: ${profile.supportSystemHealth}`);

  // Flag active burnout indicators
  const activeIndicators: string[] = [];
  if (profile.burnoutIndicators.chronicHighStress) activeIndicators.push("chronic high stress");
  if (profile.burnoutIndicators.exhaustionPattern) activeIndicators.push("exhaustion language detected");
  if (profile.burnoutIndicators.isolationRisk) activeIndicators.push("isolation risk — no support mentions");
  if (profile.burnoutIndicators.helplessnessPattern) activeIndicators.push("helplessness language detected");
  if (profile.burnoutIndicators.compassionFatigue) activeIndicators.push("compassion fatigue signals");

  if (activeIndicators.length > 0) {
    lines.push(`- Active burnout signals: ${activeIndicators.join(", ")}`);
  }

  if (profile.resilienceFactors.length > 0) {
    lines.push(`- Known resilience factors: ${profile.resilienceFactors.join(", ")}`);
  }

  if (profile.peakStressDays.length > 0) {
    lines.push(`- Recent high-stress days: ${profile.peakStressDays.slice(-3).join(", ")}`);
  }

  lines.push("");
  lines.push("PARENT SUPPORT RULES:");

  if (profile.burnoutRiskScore >= 0.7) {
    lines.push("⚠️  HIGH BURNOUT RISK: Address the parent first, before the child. Validate deeply. Normalise the struggle. Suggest ONE concrete self-care action. Recommend professional support gently if appropriate.");
  } else if (profile.burnoutRiskScore >= 0.4) {
    lines.push("Parent showing stress accumulation. Include a 'For You' section with genuine acknowledgment. Do not make the parent feel guilty.");
  } else {
    lines.push("Parent currently managing reasonably well. Brief, warm acknowledgment is appropriate.");
  }

  if (profile.burnoutIndicators.isolationRisk) {
    lines.push("Parent may feel alone. Explicitly acknowledge that many parents feel this way. Gently mention peer support groups or respite care if natural.");
  }

  if (profile.burnoutIndicators.helplessnessPattern) {
    lines.push("Parent may feel nothing is working. Anchor to specific small wins from recent check-in data. Even tiny progress is real progress.");
  }

  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// PARENT SUPPORT RECOMMENDATIONS
// Context-specific parent support suggestions based on their profile.
// ─────────────────────────────────────────────────────────────────────────────

export type ParentSupportRecommendation = {
  priority: "urgent" | "high" | "moderate" | "low";
  title: string;
  message: string;
  actionStep: string;
};

export function generateParentSupportRecommendations(
  profile: ParentProfile
): ParentSupportRecommendation[] {
  const recs: ParentSupportRecommendation[] = [];

  if (profile.burnoutRiskScore >= 0.7) {
    recs.push({
      priority: "urgent",
      title: "Caregiver Burnout Risk",
      message: "The pattern of data suggests you may be approaching caregiver burnout. This is a medical reality — not a weakness — and it's very common among autism parents.",
      actionStep: "Please speak with your own GP or a counsellor this week. You cannot pour from an empty cup, and your child needs YOU to be okay too.",
    });
  }

  if (profile.burnoutIndicators.isolationRisk) {
    recs.push({
      priority: "high",
      title: "Social Connection",
      message: "Raising an autistic child can be deeply isolating. You don't appear to have mentioned much support around you lately.",
      actionStep: "Consider connecting with an autism parent support group (online or local). Even one hour of talking to people who truly understand can shift things significantly.",
    });
  }

  if (profile.burnoutIndicators.exhaustionPattern) {
    recs.push({
      priority: "high",
      title: "Rest as Medicine",
      message: "Rest is not a luxury for a caregiver — it is a clinical necessity. Your body and mind are running a marathon every day.",
      actionStep: "Identify ONE window this week where someone else takes over for 2+ hours. Rest in that window. Completely.",
    });
  }

  if (profile.burnoutIndicators.helplessnessPattern) {
    recs.push({
      priority: "moderate",
      title: "Anchoring Progress",
      message: "When you're in the thick of it, it's hard to see how far you've come. The fact that you are here, logging, observing, and seeking support — that is evidence of extraordinary parenting.",
      actionStep: "Write down 3 things that are slightly better than they were 3 months ago. Even micro-improvements count.",
    });
  }

  if (profile.supportSystemHealth === "fragile" || profile.supportSystemHealth === "unknown") {
    recs.push({
      priority: "moderate",
      title: "Building Your Support Net",
      message: "Every autism parent needs at least one person who can step in during hard moments — a partner, parent, friend, or neighbour.",
      actionStep: "Think of one person you could call today and be honest with about how things have been. You don't need to have all the answers — just to not carry it alone.",
    });
  }

  if (profile.resilienceFactors.length > 0 && profile.burnoutRiskScore < 0.5) {
    recs.push({
      priority: "low",
      title: "What's Working for You",
      message: `DAYA noticed that ${profile.resilienceFactors[0]} seems to appear on your lower-stress days.`,
      actionStep: `Can you protect time for this in the next few days? The things that help you cope are worth treating as non-negotiable.`,
    });
  }

  return recs;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────

function avg(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
