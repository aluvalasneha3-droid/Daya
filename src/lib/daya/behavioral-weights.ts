import type { DailyCheckIn, BehavioralInsight, MoodValue } from "@/types";

const MOOD_SCORES: Record<MoodValue, number> = {
  great: 5,
  good: 4,
  okay: 3,
  difficult: 2,
  very_difficult: 1,
};

export type BehavioralWeights = {
  sleep_priority: number;
  sensory_priority: number;
  routine_priority: number;
  communication_priority: number;
  food_priority: number;
  meltdown_risk: number;
  energy_management: number;
  social_readiness: number;
  parent_support_priority: number;
  overall_stability: number;
  active_concerns: string[];
  strengths: string[];
  trending: "improving" | "declining" | "stable";
  recommendation_mode: "recovery" | "stabilization" | "growth";
};

export function computeBehavioralWeights(
  checkIns: DailyCheckIn[],
  insights: BehavioralInsight[]
): BehavioralWeights {
  const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length === 0) return defaultWeights();

  const weighted = recencyWeight(sorted);
  const recent3 = sorted.slice(-3);
  const recent = sorted.at(-1)!;

  // Compute each priority dimension (0-1 scale, higher = needs more attention)
  const sleepPriority = computeSleepPriority(weighted, recent3, insights);
  const sensoryPriority = computeSensoryPriority(weighted, recent3, insights);
  const routinePriority = computeRoutinePriority(weighted, recent3, insights);
  const commPriority = computeCommunicationPriority(weighted, recent3);
  const foodPriority = computeFoodPriority(weighted, recent3);
  const meltdownRisk = computeMeltdownRisk(weighted, recent3, insights);
  const energyMgmt = computeEnergyManagement(weighted, recent3);
  const socialReadiness = computeSocialReadiness(weighted, recent3);
  const parentPriority = computeParentSupportPriority(weighted, recent3);

  const overallStability = computeOverallStability(weighted);
  const trending = computeTrend(sorted);
  const mode = computeRecommendationMode(overallStability, trending, meltdownRisk);

  const activeConcerns = identifyConcerns(
    sleepPriority, sensoryPriority, routinePriority, commPriority,
    foodPriority, meltdownRisk, energyMgmt, parentPriority, recent
  );

  const strengths = identifyStrengths(sorted, recent);

  return {
    sleep_priority: round(sleepPriority),
    sensory_priority: round(sensoryPriority),
    routine_priority: round(routinePriority),
    communication_priority: round(commPriority),
    food_priority: round(foodPriority),
    meltdown_risk: round(meltdownRisk),
    energy_management: round(energyMgmt),
    social_readiness: round(socialReadiness),
    parent_support_priority: round(parentPriority),
    overall_stability: round(overallStability),
    active_concerns: activeConcerns,
    strengths,
    trending,
    recommendation_mode: mode,
  };
}

type WeightedCheckIn = DailyCheckIn & { recencyWeight: number };

function recencyWeight(sorted: DailyCheckIn[]): WeightedCheckIn[] {
  const n = sorted.length;
  return sorted.map((c, i) => ({
    ...c,
    // Exponential decay: most recent = 1.0, oldest ≈ 0.3
    recencyWeight: Math.pow(0.85, n - 1 - i),
  }));
}

function weightedAvg(items: WeightedCheckIn[], getValue: (c: WeightedCheckIn) => number | undefined): number {
  let totalWeight = 0;
  let totalValue = 0;
  for (const item of items) {
    const v = getValue(item);
    if (v == null) continue;
    totalWeight += item.recencyWeight;
    totalValue += v * item.recencyWeight;
  }
  return totalWeight > 0 ? totalValue / totalWeight : 3;
}

function computeSleepPriority(weighted: WeightedCheckIn[], recent3: DailyCheckIn[], insights: BehavioralInsight[]): number {
  const avgSleep = weightedAvg(weighted, (c) => c.sleep_quality);
  const recent3Avg = avg(recent3.map((c) => c.sleep_quality));
  const consecutiveLow = countConsecutiveTail(recent3, (c) => c.sleep_quality <= 2);
  const hasSleepInsight = insights.some((i) => i.support_tags?.includes("sleep"));

  let priority = invertScale(avgSleep);
  if (recent3Avg <= 2.5) priority += 0.2;
  if (consecutiveLow >= 2) priority += 0.25;
  if (hasSleepInsight) priority += 0.1;

  return clamp(priority);
}

function computeSensoryPriority(weighted: WeightedCheckIn[], recent3: DailyCheckIn[], insights: BehavioralInsight[]): number {
  const avgSensory = weightedAvg(weighted, (c) => c.sensory_load);
  const recent3Avg = avg(recent3.map((c) => c.sensory_load ?? 3));
  const hasSensoryInsight = insights.some((i) => i.support_tags?.includes("overstimulation"));

  let priority = (avgSensory - 1) / 4; // higher sensory load = higher priority
  if (recent3Avg >= 4) priority += 0.2;
  if (hasSensoryInsight) priority += 0.1;

  return clamp(priority);
}

function computeRoutinePriority(weighted: WeightedCheckIn[], recent3: DailyCheckIn[], insights: BehavioralInsight[]): number {
  const avgRoutine = weightedAvg(weighted, (c) => c.routine_adherence);
  const recent3Avg = avg(recent3.map((c) => c.routine_adherence));
  const consecutiveLow = countConsecutiveTail(recent3, (c) => c.routine_adherence <= 2);
  const hasRoutineInsight = insights.some((i) => i.support_tags?.includes("routine"));

  let priority = invertScale(avgRoutine);
  if (recent3Avg <= 2.5) priority += 0.2;
  if (consecutiveLow >= 2) priority += 0.25;
  if (hasRoutineInsight) priority += 0.1;

  return clamp(priority);
}

function computeCommunicationPriority(weighted: WeightedCheckIn[], recent3: DailyCheckIn[]): number {
  const avgComm = weightedAvg(weighted, (c) => c.communication_level);
  const recent3Avg = avg(recent3.map((c) => c.communication_level));

  let priority = invertScale(avgComm);
  if (recent3Avg <= 2) priority += 0.2;

  return clamp(priority);
}

function computeFoodPriority(weighted: WeightedCheckIn[], recent3: DailyCheckIn[]): number {
  const avgMeals = weightedAvg(weighted, (c) => c.meal_quality);
  const recent3Avg = avg(recent3.map((c) => c.meal_quality));

  let priority = invertScale(avgMeals);
  if (recent3Avg <= 2) priority += 0.2;

  return clamp(priority);
}

function computeMeltdownRisk(weighted: WeightedCheckIn[], recent3: DailyCheckIn[], insights: BehavioralInsight[]): number {
  const avgMeltdowns = weightedAvg(weighted, (c) => c.meltdowns);
  const recent3Meltdowns = recent3.reduce((s, c) => s + c.meltdowns, 0);
  const hasMeltdownInsight = insights.some((i) => i.support_tags?.includes("meltdown_recovery"));

  let risk = Math.min(avgMeltdowns / 3, 1);
  if (recent3Meltdowns >= 3) risk += 0.2;
  if (recent3Meltdowns >= 5) risk += 0.15;
  if (hasMeltdownInsight) risk += 0.1;

  // Compound risk: low sleep + high sensory + disrupted routine
  const lastCI = recent3.at(-1);
  if (lastCI) {
    const compoundFactors = [
      lastCI.sleep_quality <= 2,
      (lastCI.sensory_load ?? 3) >= 4,
      lastCI.routine_adherence <= 2,
    ].filter(Boolean).length;
    if (compoundFactors >= 2) risk += 0.2;
  }

  return clamp(risk);
}

function computeEnergyManagement(weighted: WeightedCheckIn[], recent3: DailyCheckIn[]): number {
  const avgEnergy = weightedAvg(weighted, (c) => c.energy_level);
  const avgHyper = weightedAvg(weighted, (c) => c.hyperactivity);
  const recent3Energy = avg(recent3.map((c) => c.energy_level ?? 3));

  // High energy or hyperactivity = needs more management
  let priority = 0;
  if (avgEnergy >= 4 || avgHyper >= 4) priority += 0.4;
  if (recent3Energy >= 4) priority += 0.2;
  priority += (avgHyper - 1) / 8;

  return clamp(priority);
}

function computeSocialReadiness(weighted: WeightedCheckIn[], recent3: DailyCheckIn[]): number {
  const avgSocial = weightedAvg(weighted, (c) => c.social_interaction);
  // Higher score = more socially ready (not a priority needing attention)
  return clamp((avgSocial - 1) / 4);
}

function computeParentSupportPriority(weighted: WeightedCheckIn[], recent3: DailyCheckIn[]): number {
  const avgStress = weightedAvg(weighted, (c) => c.parent_stress);
  const recent3Stress = avg(recent3.map((c) => c.parent_stress ?? 3));
  const consecutiveHigh = countConsecutiveTail(recent3, (c) => (c.parent_stress ?? 3) >= 4);

  let priority = (avgStress - 1) / 4;
  if (recent3Stress >= 4) priority += 0.2;
  if (consecutiveHigh >= 2) priority += 0.25;

  // Check parent notes for distress signals
  const lastNote = recent3.at(-1)?.parent_notes?.toLowerCase() ?? "";
  if (/(exhaust|can't|overwhelm|guilt|awful|hopeless|burned)/i.test(lastNote)) {
    priority += 0.15;
  }

  return clamp(priority);
}

function computeOverallStability(weighted: WeightedCheckIn[]): number {
  const avgMood = weightedAvg(weighted, (c) => MOOD_SCORES[c.mood]);
  const avgRoutine = weightedAvg(weighted, (c) => c.routine_adherence);
  const avgMeltdowns = weightedAvg(weighted, (c) => c.meltdowns);

  // Stability: high mood + high routine + low meltdowns = stable
  const moodScore = (avgMood - 1) / 4;
  const routineScore = (avgRoutine - 1) / 4;
  const meltdownScore = 1 - Math.min(avgMeltdowns / 2, 1);

  return clamp((moodScore + routineScore + meltdownScore) / 3);
}

function computeTrend(sorted: DailyCheckIn[]): "improving" | "declining" | "stable" {
  if (sorted.length < 4) return "stable";

  const mid = Math.floor(sorted.length / 2);
  const earlier = sorted.slice(0, mid);
  const later = sorted.slice(mid);

  const earlierMood = avg(earlier.map((c) => MOOD_SCORES[c.mood]));
  const laterMood = avg(later.map((c) => MOOD_SCORES[c.mood]));

  const diff = laterMood - earlierMood;
  if (diff >= 0.5) return "improving";
  if (diff <= -0.5) return "declining";
  return "stable";
}

function computeRecommendationMode(
  stability: number,
  trending: "improving" | "declining" | "stable",
  meltdownRisk: number
): "recovery" | "stabilization" | "growth" {
  if (meltdownRisk >= 0.6 || stability <= 0.3) return "recovery";
  if (stability >= 0.65 && trending !== "declining") return "growth";
  return "stabilization";
}

function identifyConcerns(
  sleep: number, sensory: number, routine: number, comm: number,
  food: number, meltdown: number, energy: number, parent: number,
  recent: DailyCheckIn
): string[] {
  const concerns: string[] = [];
  const threshold = 0.55;

  if (sleep >= threshold) concerns.push("sleep_instability");
  if (sensory >= threshold) concerns.push("sensory_overload");
  if (routine >= threshold) concerns.push("routine_disruption");
  if (comm >= threshold) concerns.push("communication_difficulty");
  if (food >= threshold) concerns.push("meal_difficulty");
  if (meltdown >= threshold) concerns.push("elevated_meltdown_risk");
  if (energy >= threshold) concerns.push("high_energy_regulation");
  if (parent >= threshold) concerns.push("parent_burnout");

  // Consecutive difficult days
  if (recent.mood === "difficult" || recent.mood === "very_difficult") {
    concerns.push("recent_difficult_day");
  }

  return concerns;
}

function identifyStrengths(sorted: DailyCheckIn[], recent: DailyCheckIn): string[] {
  const strengths: string[] = [];
  const recent3 = sorted.slice(-3);

  if (avg(recent3.map((c) => c.routine_adherence)) >= 4) {
    strengths.push("consistent_routines");
  }
  if (avg(recent3.map((c) => c.communication_level)) >= 4) {
    strengths.push("strong_communication");
  }
  if (recent3.every((c) => c.meltdowns === 0)) {
    strengths.push("meltdown_free_streak");
  }
  if (avg(recent3.map((c) => c.sleep_quality)) >= 4) {
    strengths.push("good_sleep_pattern");
  }
  if (recent.mood === "great" || recent.mood === "good") {
    strengths.push("positive_mood");
  }
  if ((recent.social_interaction ?? 3) >= 4) {
    strengths.push("social_engagement");
  }

  return strengths;
}

// Utilities

function invertScale(val: number): number {
  return (5 - val) / 4;
}

function avg(values: number[]): number {
  if (!values.length) return 3;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function round(v: number): number {
  return Math.round(v * 100) / 100;
}

function countConsecutiveTail(items: DailyCheckIn[], test: (c: DailyCheckIn) => boolean): number {
  let count = 0;
  for (let i = items.length - 1; i >= 0; i--) {
    if (test(items[i])) count++;
    else break;
  }
  return count;
}

export function formatWeightsForPrompt(w: BehavioralWeights): string {
  const lines: string[] = [`BEHAVIORAL STATE: ${w.recommendation_mode.toUpperCase()} mode (trend: ${w.trending})`];

  lines.push(`Overall stability: ${pct(w.overall_stability)}`);

  const priorities = [
    { label: "Sleep", value: w.sleep_priority },
    { label: "Sensory regulation", value: w.sensory_priority },
    { label: "Routine stability", value: w.routine_priority },
    { label: "Communication support", value: w.communication_priority },
    { label: "Meal/food support", value: w.food_priority },
    { label: "Meltdown risk", value: w.meltdown_risk },
    { label: "Energy management", value: w.energy_management },
    { label: "Parent support", value: w.parent_support_priority },
  ]
    .filter((p) => p.value >= 0.3)
    .sort((a, b) => b.value - a.value);

  if (priorities.length) {
    lines.push("Priority areas (higher = needs more attention):");
    for (const p of priorities) {
      lines.push(`  ${p.label}: ${pct(p.value)}`);
    }
  }

  if (w.active_concerns.length) {
    lines.push(`Active concerns: ${w.active_concerns.join(", ")}`);
  }
  if (w.strengths.length) {
    lines.push(`Current strengths: ${w.strengths.join(", ")}`);
  }

  lines.push("");
  lines.push("ADAPTIVE RESPONSE RULES:");
  if (w.recommendation_mode === "recovery") {
    lines.push("- Focus on calming, predictability, and low demands.");
    lines.push("- Avoid suggesting new activities or challenges.");
    lines.push("- Prioritize parent emotional support.");
    lines.push("- Keep suggestions minimal and familiar.");
  } else if (w.recommendation_mode === "growth") {
    lines.push("- Celebrate progress and reinforce what's working.");
    lines.push("- Gently suggest one small stretch activity if appropriate.");
    lines.push("- Highlight strengths and positive patterns.");
    lines.push("- Encourage the parent's confidence.");
  } else {
    lines.push("- Balance support with gentle encouragement.");
    lines.push("- Focus on maintaining current routines.");
    lines.push("- Address the top 1-2 priority areas specifically.");
    lines.push("- Keep suggestions practical and achievable.");
  }

  return lines.join("\n");
}

function defaultWeights(): BehavioralWeights {
  return {
    sleep_priority: 0.5,
    sensory_priority: 0.5,
    routine_priority: 0.5,
    communication_priority: 0.5,
    food_priority: 0.5,
    meltdown_risk: 0.3,
    energy_management: 0.3,
    social_readiness: 0.5,
    parent_support_priority: 0.3,
    overall_stability: 0.5,
    active_concerns: [],
    strengths: [],
    trending: "stable",
    recommendation_mode: "stabilization",
  };
}

function pct(v: number): string {
  return `${Math.round(v * 100)}%`;
}
