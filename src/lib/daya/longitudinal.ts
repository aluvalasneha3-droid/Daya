import type { DailyCheckIn, BehavioralInsight, MoodValue } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// LONGITUDINAL BEHAVIORAL PROFILE
// This is the core data structure of DAYA's intelligence.
// It summarises everything DAYA has learned about ONE specific child.
// ─────────────────────────────────────────────────────────────────────────────

export type LongitudinalProfile = {
  // Core child-specific memory
  knownCalming: string[];        // Activities that genuinely helped this child
  knownTriggers: string[];       // Recurring triggers extracted from check-in data
  knownSensitivities: string[];  // Sensory-specific patterns identified over time
  knownStrengths: string[];      // Observed positive behavioral traits

  // Temporal correlations
  sleepMoodLag: number;          // avg mood delta the day after low sleep (-)
  sensoryMeltdownRate: number;   // % of high-sensory days leading to meltdowns
  routineRecoveryDays: number;   // avg days needed to stabilise after disruption
  difficultPeriodPattern: string | null; // most recurring hard time-of-day

  // Adaptive learning signals
  activitySuccessMap: Map<string, number>;  // activity → avg mood next day
  triggerFrequencyMap: Map<string, number>; // trigger → occurrence count
  mealSuccessPattern: "morning_better" | "afternoon_better" | "no_pattern";

  // Longitudinal progress signals
  communicationTrajectory: "improving" | "declining" | "stable";
  meltdownFrequencyTrend: "improving" | "declining" | "stable";
  overallTrajectory: "improving" | "declining" | "stable";

  // Data depth
  checkInCount: number;
  daysTracked: number;
  dataMaturity: "early" | "building" | "established"; // < 7, 7-20, > 20
};

const MOOD_SCORES: Record<MoodValue, number> = {
  great: 5, good: 4, okay: 3, difficult: 2, very_difficult: 1,
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILD LONGITUDINAL PROFILE
// The central function that turns raw check-in history into a child-specific
// behavioural intelligence profile.
// ─────────────────────────────────────────────────────────────────────────────

export function buildLongitudinalProfile(
  checkIns: DailyCheckIn[],
  insights: BehavioralInsight[]
): LongitudinalProfile {
  const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));
  const count = sorted.length;

  const dataMaturity: LongitudinalProfile["dataMaturity"] =
    count < 7 ? "early" : count < 20 ? "building" : "established";

  const knownTriggers = extractRecurringTriggers(sorted);
  const knownCalming = extractCalmingActivities(sorted);
  const knownSensitivities = extractSensoryPatterns(sorted);
  const knownStrengths = extractStrengths(sorted);

  const sleepMoodLag = computeSleepMoodLag(sorted);
  const sensoryMeltdownRate = computeSensoryMeltdownRate(sorted);
  const routineRecoveryDays = computeRoutineRecoveryDays(sorted);
  const difficultPeriodPattern = computeDifficultPeriodPattern(sorted);

  const activitySuccessMap = buildActivitySuccessMap(sorted);
  const triggerFrequencyMap = buildTriggerFrequencyMap(sorted);
  const mealSuccessPattern = detectMealSuccessPattern(sorted);

  const communicationTrajectory = computeTrajectory(sorted, (c) => c.communication_level);
  const meltdownFrequencyTrend = computeMeltdownTrend(sorted);
  const overallTrajectory = computeTrajectory(sorted, (c) => MOOD_SCORES[c.mood]);

  const daysTracked = sorted.length > 1
    ? Math.round((new Date(sorted.at(-1)!.date).getTime() - new Date(sorted[0].date).getTime()) / 86400000)
    : 0;

  return {
    knownCalming,
    knownTriggers,
    knownSensitivities,
    knownStrengths,
    sleepMoodLag,
    sensoryMeltdownRate,
    routineRecoveryDays,
    difficultPeriodPattern,
    activitySuccessMap,
    triggerFrequencyMap,
    mealSuccessPattern,
    communicationTrajectory,
    meltdownFrequencyTrend,
    overallTrajectory,
    checkInCount: count,
    daysTracked,
    dataMaturity,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACT RECURRING TRIGGERS
// Parses meltdown_triggers text across all check-ins.
// ─────────────────────────────────────────────────────────────────────────────

function extractRecurringTriggers(sorted: DailyCheckIn[]): string[] {
  const triggerText = sorted
    .filter((c) => c.meltdown_triggers)
    .map((c) => c.meltdown_triggers!.toLowerCase());

  const counts = new Map<string, number>();

  const knownPatterns: [RegExp, string][] = [
    [/noise|loud|music|sound/i, "loud/unexpected noises"],
    [/crowd|people|party|gathering/i, "crowded or social gatherings"],
    [/routine|different|change|unusual|unexpected/i, "routine disruption"],
    [/school|class|teacher/i, "school-related transitions"],
    [/food|eat|meal|hungry/i, "mealtime difficulties"],
    [/texture|shirt|clothes|wearing/i, "clothing/texture sensitivity"],
    [/tired|sleep|exhausted/i, "fatigue-related dysregulation"],
    [/rush|hurry|late|waiting/i, "being rushed or waiting"],
    [/transition|stop|finish|end/i, "activity transitions"],
    [/doctor|hospital|appointment/i, "medical appointments"],
  ];

  for (const text of triggerText) {
    for (const [pattern, label] of knownPatterns) {
      if (pattern.test(text)) {
        counts.set(label, (counts.get(label) ?? 0) + 1);
      }
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count >= 1)
    .slice(0, 6)
    .map(([label]) => label);
}

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACT CALMING ACTIVITIES
// Finds activities reported on low-meltdown or good-mood days.
// ─────────────────────────────────────────────────────────────────────────────

function extractCalmingActivities(sorted: DailyCheckIn[]): string[] {
  const goodDays = sorted.filter(
    (c) => c.meltdowns === 0 && (MOOD_SCORES[c.mood] >= 4) && c.activities
  );

  const activityCounts = new Map<string, number>();

  const activityPatterns: [RegExp, string][] = [
    [/water|bath|splash|pool/i, "water play"],
    [/dinosaur|puzzle|block|lego/i, "construction/interest-based play"],
    [/draw|colour|paint|art/i, "drawing/art activities"],
    [/walk|outdoor|outside|park/i, "outdoor time"],
    [/blanket|pressure|deep|hug/i, "deep pressure / comfort item"],
    [/music|sing|song/i, "calm music"],
    [/reading|book|story/i, "quiet reading"],
    [/sand|playdough|sensory bin/i, "sensory play"],
    [/swing|trampoline|jump|bounce/i, "heavy movement activities"],
  ];

  for (const day of goodDays) {
    const text = day.activities!.toLowerCase();
    for (const [pattern, label] of activityPatterns) {
      if (pattern.test(text)) {
        activityCounts.set(label, (activityCounts.get(label) ?? 0) + 1);
      }
    }
  }

  return [...activityCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label]) => label);
}

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACT SENSORY PATTERNS
// Parses sensory_issues field across check-ins.
// ─────────────────────────────────────────────────────────────────────────────

function extractSensoryPatterns(sorted: DailyCheckIn[]): string[] {
  const sensoryText = sorted
    .filter((c) => c.sensory_issues)
    .map((c) => c.sensory_issues!.toLowerCase());

  const patterns: [RegExp, string][] = [
    [/ear|sound|noise|loud/i, "sound/auditory sensitivity"],
    [/light|bright|sun/i, "light sensitivity"],
    [/texture|clothes|shirt|fabric|wear/i, "texture/clothing sensitivity"],
    [/crowd|people|space/i, "social/spatial overwhelm"],
    [/smell|scent|food/i, "smell sensitivity"],
    [/touch|hug|hold/i, "tactile sensitivity"],
  ];

  const counts = new Map<string, number>();
  for (const text of sensoryText) {
    for (const [pattern, label] of patterns) {
      if (pattern.test(text)) {
        counts.set(label, (counts.get(label) ?? 0) + 1);
      }
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .filter(([, c]) => c >= 1)
    .slice(0, 4)
    .map(([label]) => label);
}

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACT STRENGTHS
// Identifies consistent positive behavioral dimensions.
// ─────────────────────────────────────────────────────────────────────────────

function extractStrengths(sorted: DailyCheckIn[]): string[] {
  if (sorted.length < 3) return [];
  const recent = sorted.slice(-7);
  const strengths: string[] = [];

  if (avg(recent.map((c) => c.routine_adherence)) >= 4)
    strengths.push("consistent routine adherence");
  if (avg(recent.map((c) => c.communication_level)) >= 4)
    strengths.push("strong verbal communication");
  if (recent.filter((c) => c.meltdowns === 0).length >= Math.ceil(recent.length * 0.7))
    strengths.push("sustained meltdown-free periods");
  if (avg(recent.map((c) => c.sleep_quality)) >= 4)
    strengths.push("healthy sleep patterns");
  if (avg(recent.map((c) => c.social_interaction ?? 3)) >= 4)
    strengths.push("positive social engagement");
  if (avg(recent.map((c) => c.meal_quality)) >= 4)
    strengths.push("consistent meal acceptance");

  return strengths;
}

// ─────────────────────────────────────────────────────────────────────────────
// SLEEP → MOOD LAG CORRELATION
// Computes the average mood-score delta on the day AFTER a low-sleep day.
// ─────────────────────────────────────────────────────────────────────────────

function computeSleepMoodLag(sorted: DailyCheckIn[]): number {
  const deltas: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].sleep_quality <= 2) {
      const baseMood = MOOD_SCORES[sorted[i].mood];
      const nextMood = MOOD_SCORES[sorted[i + 1].mood];
      deltas.push(nextMood - baseMood);
    }
  }
  return deltas.length > 0 ? avg(deltas) : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// SENSORY → MELTDOWN RATE
// ─────────────────────────────────────────────────────────────────────────────

function computeSensoryMeltdownRate(sorted: DailyCheckIn[]): number {
  const highSensory = sorted.filter((c) => (c.sensory_load ?? 0) >= 4);
  if (highSensory.length === 0) return 0;
  const withMeltdown = highSensory.filter((c) => c.meltdowns > 0);
  return withMeltdown.length / highSensory.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTINE RECOVERY
// After a disrupted-routine day, how many days until routine adherence ≥ 4?
// ─────────────────────────────────────────────────────────────────────────────

function computeRoutineRecoveryDays(sorted: DailyCheckIn[]): number {
  const recoveries: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].routine_adherence <= 2) {
      let days = 0;
      for (let j = i + 1; j < sorted.length; j++) {
        days++;
        if (sorted[j].routine_adherence >= 4) break;
      }
      recoveries.push(days);
    }
  }
  return recoveries.length > 0 ? Math.round(avg(recoveries)) : 2;
}

// ─────────────────────────────────────────────────────────────────────────────
// DIFFICULT PERIOD PATTERN
// ─────────────────────────────────────────────────────────────────────────────

function computeDifficultPeriodPattern(sorted: DailyCheckIn[]): string | null {
  const counts: Record<string, number> = {};
  for (const c of sorted) {
    if (c.difficult_period && c.difficult_period !== "none") {
      counts[c.difficult_period] = (counts[c.difficult_period] ?? 0) + 1;
    }
  }
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!entries.length || entries[0][1] < 2) return null;
  return entries[0][0]; // "morning" | "afternoon" | "evening" | "night"
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY SUCCESS MAP
// Maps each activity keyword → avg mood score the SAME day.
// ─────────────────────────────────────────────────────────────────────────────

function buildActivitySuccessMap(sorted: DailyCheckIn[]): Map<string, number> {
  const map = new Map<string, { total: number; count: number }>();

  const activityPatterns: [RegExp, string][] = [
    [/water|bath|splash/i, "water play"],
    [/dinosaur|dino/i, "dinosaur activities"],
    [/puzzle|block|lego/i, "construction play"],
    [/draw|colour|art|paint/i, "art activities"],
    [/walk|outdoor|park/i, "outdoor time"],
    [/blanket|pressure|blue/i, "comfort item"],
    [/reading|book|story/i, "quiet reading"],
    [/swing|jump|bounce/i, "movement play"],
    [/music|song|sing/i, "music"],
  ];

  for (const c of sorted) {
    if (!c.activities) continue;
    const moodScore = MOOD_SCORES[c.mood];
    for (const [pattern, label] of activityPatterns) {
      if (pattern.test(c.activities)) {
        const existing = map.get(label) ?? { total: 0, count: 0 };
        map.set(label, { total: existing.total + moodScore, count: existing.count + 1 });
      }
    }
  }

  const result = new Map<string, number>();
  for (const [label, { total, count }] of map.entries()) {
    if (count >= 1) result.set(label, Math.round((total / count) * 10) / 10);
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIGGER FREQUENCY MAP
// ─────────────────────────────────────────────────────────────────────────────

function buildTriggerFrequencyMap(sorted: DailyCheckIn[]): Map<string, number> {
  const map = new Map<string, number>();
  const patterns: [RegExp, string][] = [
    [/noise|loud/i, "loud sounds"],
    [/crowd|party/i, "crowded spaces"],
    [/routine|change|different/i, "routine changes"],
    [/texture|clothes|shirt/i, "clothing textures"],
    [/rush|hurry/i, "being rushed"],
    [/doctor|appointment/i, "appointments"],
    [/school|class/i, "school situations"],
    [/food|eat|meal/i, "food-related stress"],
  ];
  for (const c of sorted) {
    if (!c.meltdown_triggers) continue;
    for (const [pattern, label] of patterns) {
      if (pattern.test(c.meltdown_triggers)) {
        map.set(label, (map.get(label) ?? 0) + 1);
      }
    }
  }
  return map;
}

// ─────────────────────────────────────────────────────────────────────────────
// MEAL SUCCESS PATTERN
// ─────────────────────────────────────────────────────────────────────────────

function detectMealSuccessPattern(
  sorted: DailyCheckIn[]
): LongitudinalProfile["mealSuccessPattern"] {
  const morning = sorted.filter((c) => c.difficult_period === "morning" && c.meal_quality <= 2);
  const afternoon = sorted.filter((c) => c.difficult_period === "afternoon" && c.meal_quality <= 2);
  if (morning.length > afternoon.length && morning.length >= 2) return "afternoon_better";
  if (afternoon.length > morning.length && afternoon.length >= 2) return "morning_better";
  return "no_pattern";
}

// ─────────────────────────────────────────────────────────────────────────────
// TRAJECTORY DETECTION
// ─────────────────────────────────────────────────────────────────────────────

function computeTrajectory(
  sorted: DailyCheckIn[],
  getValue: (c: DailyCheckIn) => number
): "improving" | "declining" | "stable" {
  if (sorted.length < 4) return "stable";
  const mid = Math.floor(sorted.length / 2);
  const earlier = avg(sorted.slice(0, mid).map(getValue));
  const later = avg(sorted.slice(mid).map(getValue));
  const diff = later - earlier;
  if (diff >= 0.4) return "improving";
  if (diff <= -0.4) return "declining";
  return "stable";
}

function computeMeltdownTrend(sorted: DailyCheckIn[]): "improving" | "declining" | "stable" {
  if (sorted.length < 4) return "stable";
  const mid = Math.floor(sorted.length / 2);
  const earlierRate = avg(sorted.slice(0, mid).map((c) => c.meltdowns));
  const laterRate = avg(sorted.slice(mid).map((c) => c.meltdowns));
  const diff = earlierRate - laterRate; // positive = improving (fewer meltdowns)
  if (diff >= 0.3) return "improving";
  if (diff <= -0.3) return "declining";
  return "stable";
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMAT PROFILE FOR PROMPT
// Turns the profile into a high-quality system prompt segment.
// This is the "DAYA knows your child" section injected into every response.
// ─────────────────────────────────────────────────────────────────────────────

export function formatLongitudinalProfile(
  profile: LongitudinalProfile,
  childName: string
): string {
  if (profile.checkInCount < 3) {
    return `DAYA LEARNING STATUS: Early stage (${profile.checkInCount} check-ins). DAYA is still building its understanding of ${childName}. Acknowledge this warmly and encourage continued logging.`;
  }

  const lines: string[] = [
    `DAYA LONGITUDINAL PROFILE FOR ${childName.toUpperCase()} (${profile.checkInCount} check-ins across ${profile.daysTracked} days — ${profile.dataMaturity} stage):`,
    "",
  ];

  // Trajectory summary
  lines.push(`Overall trajectory: ${profile.overallTrajectory}`);
  lines.push(`Communication trajectory: ${profile.communicationTrajectory}`);
  lines.push(`Meltdown frequency trend: ${profile.meltdownFrequencyTrend}`);
  lines.push("");

  // Personalised knowledge
  if (profile.knownTriggers.length > 0) {
    lines.push(`Known triggers for ${childName} (from parent logs):`);
    for (const t of profile.knownTriggers) lines.push(`  - ${t}`);
    lines.push("");
  }

  if (profile.knownSensitivities.length > 0) {
    lines.push(`Observed sensory sensitivities:`);
    for (const s of profile.knownSensitivities) lines.push(`  - ${s}`);
    lines.push("");
  }

  if (profile.knownCalming.length > 0) {
    lines.push(`Activities that have helped ${childName} on calmer days:`);
    for (const a of profile.knownCalming) lines.push(`  - ${a}`);
    lines.push("");
  }

  if (profile.knownStrengths.length > 0) {
    lines.push(`Current observed strengths:`);
    for (const s of profile.knownStrengths) lines.push(`  - ${s}`);
    lines.push("");
  }

  // Temporal insights
  if (Math.abs(profile.sleepMoodLag) >= 0.5) {
    const direction = profile.sleepMoodLag < 0 ? "harder" : "easier";
    lines.push(`Sleep-mood pattern: days following low sleep tend to feel ${direction} (avg delta: ${profile.sleepMoodLag.toFixed(1)} mood points).`);
  }

  if (profile.sensoryMeltdownRate >= 0.5) {
    lines.push(`Sensory-meltdown rate: ${Math.round(profile.sensoryMeltdownRate * 100)}% of high-sensory days result in meltdowns for ${childName}.`);
  }

  if (profile.routineRecoveryDays > 0) {
    lines.push(`Routine recovery: ${childName} typically needs ~${profile.routineRecoveryDays} day(s) to stabilise after a disrupted routine.`);
  }

  if (profile.difficultPeriodPattern) {
    lines.push(`Most recurring difficult period: ${profile.difficultPeriodPattern}. Building a buffer before this window may help.`);
  }

  if (profile.mealSuccessPattern !== "no_pattern") {
    const better = profile.mealSuccessPattern === "morning_better" ? "mornings" : "afternoons";
    lines.push(`Meal pattern: mealtimes tend to go better in ${better} for ${childName}.`);
  }

  // Activity success map
  if (profile.activitySuccessMap.size > 0) {
    const top = [...profile.activitySuccessMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    if (top.length > 0) {
      lines.push(`Highest-mood activities for ${childName}:`);
      for (const [label, score] of top) {
        lines.push(`  - ${label} (avg mood: ${score}/5)`);
      }
    }
  }

  lines.push("");
  lines.push(
    `CRITICAL INSTRUCTION: Use this profile to personalise every single response. ` +
    `Reference ${childName}'s specific patterns naturally. ` +
    `Do NOT be generic. DAYA should sound like it genuinely knows this child's history.`
  );

  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// ADAPTIVE NEXT-PREDICTION
// Given the current check-in, predicts what tomorrow might look like.
// ─────────────────────────────────────────────────────────────────────────────

export type DayPrediction = {
  riskLevel: "low" | "moderate" | "high";
  likelyDifficultPeriod: string | null;
  recommendedFocus: string[];
  warningMessage: string | null;
};

export function predictNextDay(
  latestCheckIn: DailyCheckIn,
  profile: LongitudinalProfile,
  childName: string
): DayPrediction {
  const riskFactors: number[] = [];
  const focus: string[] = [];

  // Sleep lag risk
  if (latestCheckIn.sleep_quality <= 2 && profile.sleepMoodLag < -0.5) {
    riskFactors.push(0.4);
    focus.push("Protect tomorrow's morning — low sleep often leads to heavier days for " + childName + ".");
  }

  // Sensory risk
  if ((latestCheckIn.sensory_load ?? 0) >= 4 && profile.sensoryMeltdownRate >= 0.5) {
    riskFactors.push(0.35);
    focus.push("Keep tomorrow sensory-light — overstimulating days often need a quieter follow-up.");
  }

  // Routine disruption recovery
  if (latestCheckIn.routine_adherence <= 2) {
    riskFactors.push(0.3);
    focus.push(`${childName} may need ${profile.routineRecoveryDays} day(s) to resettle after today's routine disruption.`);
  }

  // High meltdown day
  if (latestCheckIn.meltdowns >= 2) {
    riskFactors.push(0.3);
    focus.push("After a high-meltdown day, keeping tomorrow predictable and low-demand helps recovery.");
  }

  const totalRisk = riskFactors.length > 0
    ? Math.min(riskFactors.reduce((a, b) => a + b, 0), 1.0)
    : 0;

  const riskLevel = totalRisk >= 0.65 ? "high" : totalRisk >= 0.35 ? "moderate" : "low";

  const warningMessage =
    riskLevel === "high"
      ? `DAYA predicts tomorrow carries some risk based on today's patterns. Prioritise a calm, predictable start.`
      : null;

  return {
    riskLevel,
    likelyDifficultPeriod: profile.difficultPeriodPattern,
    recommendedFocus: focus,
    warningMessage,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PERSONALISED GREETING GENERATOR
// Produces a memory-aware, specific opening line for each conversation.
// Prevents the AI from sounding repetitive or generic.
// ─────────────────────────────────────────────────────────────────────────────

export function generatePersonalisedContext(
  profile: LongitudinalProfile,
  latestCheckIn: DailyCheckIn | undefined,
  childName: string
): string {
  if (!latestCheckIn) return "";

  const parts: string[] = [];

  // Today's summary for AI context
  parts.push(`Latest day summary (${latestCheckIn.date}): sleep ${latestCheckIn.sleep_quality}/5, mood ${latestCheckIn.mood}, meltdowns ${latestCheckIn.meltdowns}, sensory load ${latestCheckIn.sensory_load ?? "not logged"}/5, routine ${latestCheckIn.routine_adherence}/5.`);

  // Prediction context
  const prediction = predictNextDay(latestCheckIn, profile, childName);
  if (prediction.riskLevel !== "low" && prediction.warningMessage) {
    parts.push(`Tomorrow risk assessment: ${prediction.riskLevel}. ${prediction.warningMessage}`);
  }
  if (prediction.recommendedFocus.length > 0) {
    parts.push("Tomorrow focus areas:");
    for (const f of prediction.recommendedFocus) parts.push(`  - ${f}`);
  }

  return parts.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────

function avg(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
