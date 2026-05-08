import type { DailyCheckIn, BehavioralInsight } from "@/types";

export type RoutineChange = {
  type:
    | "routine_disruption"
    | "sleep_shift"
    | "sensory_escalation"
    | "meltdown_spike"
    | "food_regression"
    | "energy_shift"
    | "parent_stress_rise"
    | "positive_shift";
  severity: "mild" | "moderate" | "significant";
  description: string;
  recommendation: string;
};

export function detectRoutineChanges(
  checkIns: DailyCheckIn[],
  insights: BehavioralInsight[]
): RoutineChange[] {
  if (checkIns.length < 2) return [];

  const changes: RoutineChange[] = [];
  const recent = checkIns.at(-1)!;
  const prev = checkIns.at(-2)!;
  const recent3 = checkIns.slice(-3);
  const earlier = checkIns.slice(-7, -3);

  // Routine disruption detection
  if (recent.routine_adherence <= 2 && prev.routine_adherence >= 3) {
    changes.push({
      type: "routine_disruption",
      severity: recent.routine_adherence === 1 ? "significant" : "moderate",
      description: `Routine adherence dropped from ${prev.routine_adherence}/5 to ${recent.routine_adherence}/5.`,
      recommendation: "Prioritize predictability tomorrow. Use visual schedules and keep the same order of activities.",
    });
  } else if (
    recent3.length >= 3 &&
    recent3.every((c) => c.routine_adherence <= 2)
  ) {
    changes.push({
      type: "routine_disruption",
      severity: "significant",
      description: "Routine has been disrupted for 3+ consecutive days.",
      recommendation: "Focus on restoring one anchor routine first — bedtime or mealtime are good starting points.",
    });
  }

  // Sleep shift
  if (recent.sleep_quality <= 2 && prev.sleep_quality >= 3) {
    changes.push({
      type: "sleep_shift",
      severity: recent.sleep_quality === 1 ? "significant" : "moderate",
      description: `Sleep quality dropped from ${prev.sleep_quality}/5 to ${recent.sleep_quality}/5.`,
      recommendation: "Start wind-down 20 minutes earlier. Keep tomorrow's morning demands low.",
    });
  } else if (
    recent3.length >= 3 &&
    recent3.every((c) => c.sleep_quality <= 2)
  ) {
    changes.push({
      type: "sleep_shift",
      severity: "significant",
      description: "Sleep has been poor for 3+ consecutive days.",
      recommendation: "Consider adjusting the entire evening routine. Reduce afternoon stimulation.",
    });
  }

  // Sensory escalation
  const recentSensory = recent.sensory_load ?? 3;
  const prevSensory = prev.sensory_load ?? 3;
  if (recentSensory >= 4 && prevSensory <= 2) {
    changes.push({
      type: "sensory_escalation",
      severity: recentSensory === 5 ? "significant" : "moderate",
      description: `Sensory load jumped from ${prevSensory}/5 to ${recentSensory}/5.`,
      recommendation: "Create low-sensory spaces tomorrow. Noise-canceling headphones, dim lighting, calm corners.",
    });
  }

  // Meltdown spike
  if (recent.meltdowns >= 2 && prev.meltdowns === 0) {
    changes.push({
      type: "meltdown_spike",
      severity: recent.meltdowns >= 3 ? "significant" : "moderate",
      description: `Meltdowns spiked from 0 to ${recent.meltdowns} in one day.`,
      recommendation: "Tomorrow should be a recovery day — low demands, familiar activities, extra patience.",
    });
  }

  // Food regression
  if (recent.meal_quality <= 2 && prev.meal_quality >= 4) {
    changes.push({
      type: "food_regression",
      severity: "moderate",
      description: `Meal quality dropped from ${prev.meal_quality}/5 to ${recent.meal_quality}/5.`,
      recommendation: "Return to known comfort foods. No new textures or flavors until meals stabilize.",
    });
  }

  // Energy shift
  const recentEnergy = recent.energy_level ?? 3;
  const prevEnergy = prev.energy_level ?? 3;
  if (Math.abs(recentEnergy - prevEnergy) >= 2) {
    changes.push({
      type: "energy_shift",
      severity: "mild",
      description: `Energy shifted from ${prevEnergy}/5 to ${recentEnergy}/5.`,
      recommendation:
        recentEnergy > prevEnergy
          ? "Plan extra movement breaks and physical outlets tomorrow."
          : "Keep demands low and allow more rest periods.",
    });
  }

  // Parent stress rise
  const recentStress = recent.parent_stress ?? 3;
  const prevStress = prev.parent_stress ?? 3;
  if (recentStress >= 4 && prevStress <= 2) {
    changes.push({
      type: "parent_stress_rise",
      severity: recentStress === 5 ? "significant" : "moderate",
      description: "Parent stress increased significantly.",
      recommendation: "Consider what support you can access today — even a brief break matters.",
    });
  }

  // Positive shift
  if (earlier.length >= 2) {
    const earlierMoodScore = avg(earlier.map((c) => moodScore(c.mood)));
    const recentMoodScore = avg(recent3.map((c) => moodScore(c.mood)));
    if (recentMoodScore - earlierMoodScore >= 1.5) {
      changes.push({
        type: "positive_shift",
        severity: "mild",
        description: "Mood and overall stability have improved noticeably over recent days.",
        recommendation: "Whatever you've been doing is working. Keep the current rhythms going.",
      });
    }
  }

  return changes.sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
}

export function formatRoutineChanges(changes: RoutineChange[]): string {
  if (changes.length === 0) return "";

  const lines: string[] = ["DETECTED CHANGES (since last check-in):"];
  for (const change of changes.slice(0, 4)) {
    const icon =
      change.severity === "significant" ? "⚠️" : change.severity === "moderate" ? "🔔" : "📌";
    lines.push(`${icon} ${change.description}`);
    lines.push(`  → ${change.recommendation}`);
  }
  return lines.join("\n");
}

function moodScore(mood: string): number {
  const scores: Record<string, number> = {
    great: 5,
    good: 4,
    okay: 3,
    difficult: 2,
    very_difficult: 1,
  };
  return scores[mood] ?? 3;
}

function avg(values: number[]): number {
  if (!values.length) return 3;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function severityRank(s: string): number {
  return s === "significant" ? 3 : s === "moderate" ? 2 : 1;
}
