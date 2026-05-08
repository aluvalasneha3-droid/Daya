import type { BehavioralInsight, DailyCheckIn, MoodValue } from "@/types";

const MOOD_SCORES: Record<MoodValue, number> = {
  great: 5,
  good: 4,
  okay: 3,
  difficult: 2,
  very_difficult: 1,
};

type InsightDraft = Omit<BehavioralInsight, "id" | "created_at">;

export function analyzeBehaviorPatterns(
  checkIns: DailyCheckIn[],
  childId: string
): BehavioralInsight[] {
  const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length < 3) return [];

  const drafts: InsightDraft[] = [
    ...detectSleepMeltdownCorrelation(sorted, childId),
    ...detectFoodMoodCorrelation(sorted, childId),
    ...detectRoutineDisruptionPattern(sorted, childId),
    ...detectSensoryOverloadTrend(sorted, childId),
    ...detectRecurringDifficultPeriods(sorted, childId),
    ...detectEmotionalShift(sorted, childId),
    ...detectCommunicationShift(sorted, childId),
    ...detectEnergyBehaviorPattern(sorted, childId),
    ...detectHyperactivityPattern(sorted, childId),
    ...detectSocialOverwhelmPattern(sorted, childId),
    ...detectParentStressTrend(sorted, childId),
    ...detectPositiveStreak(sorted, childId),
    // ── Longitudinal intelligence upgrades ──────────────────────────────────
    ...detectSleepCommunicationLink(sorted, childId),
    ...detectCompoundVulnerabilityDay(sorted, childId),
    ...detectMeltdownRecoveryPattern(sorted, childId),
    ...detectParentMoodMirror(sorted, childId),
    ...detectActivityMoodBoost(sorted, childId),
    ...detectSensoryLoadCarryover(sorted, childId),
  ];

  return dedupeInsights(drafts).map((draft) => ({
    ...draft,
    id: stableInsightId(draft),
    created_at: new Date().toISOString(),
  }));
}

export function summarizeCheckIn(checkIn: DailyCheckIn, childName = "your child") {
  const parts = [
    `${childName}'s check-in for ${checkIn.date}`,
    `sleep ${checkIn.sleep_quality}/5`,
    checkIn.sleep_hours ? `${checkIn.sleep_hours} hours slept` : undefined,
    `meals ${checkIn.meal_quality}/5`,
    `mood ${checkIn.mood.replace("_", " ")}`,
    `${checkIn.meltdowns} meltdown${checkIn.meltdowns === 1 ? "" : "s"}`,
    `communication ${checkIn.communication_level}/5`,
    `routine ${checkIn.routine_adherence}/5`,
    checkIn.sensory_load ? `sensory load ${checkIn.sensory_load}/5` : undefined,
    checkIn.energy_level ? `energy ${checkIn.energy_level}/5` : undefined,
    checkIn.hyperactivity ? `hyperactivity ${checkIn.hyperactivity}/5` : undefined,
    checkIn.social_interaction ? `social interaction ${checkIn.social_interaction}/5` : undefined,
    checkIn.repetitive_behaviors ? `repetitive behaviors ${checkIn.repetitive_behaviors}/5` : undefined,
    checkIn.parent_stress ? `parent stress ${checkIn.parent_stress}/5` : undefined,
    checkIn.difficult_period && checkIn.difficult_period !== "none"
      ? `hardest period: ${checkIn.difficult_period}`
      : undefined,
    checkIn.meltdown_triggers ? `triggers: ${checkIn.meltdown_triggers}` : undefined,
    checkIn.sensory_issues ? `sensory notes: ${checkIn.sensory_issues}` : undefined,
    checkIn.activities ? `activities: ${checkIn.activities}` : undefined,
    checkIn.notes ? `notes: ${checkIn.notes}` : undefined,
    checkIn.parent_notes ? `parent notes: ${checkIn.parent_notes}` : undefined,
  ].filter(Boolean);

  return parts.join("; ");
}

function detectSleepMeltdownCorrelation(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const lowSleepDays = checkIns.filter((c) => c.sleep_quality <= 2);
  if (lowSleepDays.length < 2) return [];

  const lowSleepWithMeltdowns = lowSleepDays.filter((c) => c.meltdowns > 0);
  const ratio = lowSleepWithMeltdowns.length / lowSleepDays.length;

  if (ratio < 0.6) return [];

  return [
    {
      child_id: childId,
      insight_type: "correlation",
      title: "Sleep may be connected to harder moments",
      description: `We noticed meltdowns showed up on ${lowSleepWithMeltdowns.length} of ${lowSleepDays.length} lower-sleep days recently.`,
      confidence: ratio,
      data_points: lowSleepDays.length,
      source_check_in_ids: lowSleepDays.map((c) => c.id),
      support_tags: ["tiredness", "sleep", "meltdown_recovery", "routine"],
    },
  ];
}

function detectFoodMoodCorrelation(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const lowerMealDays = checkIns.filter((c) => c.meal_quality <= 2);
  if (lowerMealDays.length < 2) return [];

  const lowerMealDifficultMood = lowerMealDays.filter(
    (c) => MOOD_SCORES[c.mood] <= 2
  );
  const ratio = lowerMealDifficultMood.length / lowerMealDays.length;

  if (ratio < 0.6) return [];

  return [
    {
      child_id: childId,
      insight_type: "correlation",
      title: "Meals and mood may be moving together",
      description: `On lower-meal days, mood was also harder ${lowerMealDifficultMood.length} out of ${lowerMealDays.length} times. This may be worth gently observing without assuming cause.`,
      confidence: ratio,
      data_points: lowerMealDays.length,
      source_check_in_ids: lowerMealDays.map((c) => c.id),
      support_tags: ["hunger", "food_and_eating", "mood", "observation"],
    },
  ];
}

function detectRoutineDisruptionPattern(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const disrupted = checkIns.filter((c) => c.routine_adherence <= 2);
  if (disrupted.length < 2) return [];

  const disruptedHardDays = disrupted.filter(
    (c) => c.meltdowns > 0 || MOOD_SCORES[c.mood] <= 2
  );
  const ratio = disruptedHardDays.length / disrupted.length;

  if (ratio < 0.55) return [];

  return [
    {
      child_id: childId,
      insight_type: "pattern",
      title: "Routine disruption is showing up on harder days",
      description: `We noticed that disrupted routines often overlap with more difficult moments. This appeared on ${disruptedHardDays.length} of ${disrupted.length} low-routine days.`,
      confidence: ratio,
      data_points: disrupted.length,
      source_check_in_ids: disrupted.map((c) => c.id),
      support_tags: ["routine", "transition", "schedule_change", "meltdown_recovery"],
    },
  ];
}

function detectSensoryOverloadTrend(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const sensoryDays = checkIns.filter(
    (c) => (c.sensory_load ?? 0) >= 4 || Boolean(c.sensory_issues)
  );
  if (sensoryDays.length < 2) return [];

  const sensoryWithMeltdown = sensoryDays.filter(
    (c) => c.meltdowns > 0 || MOOD_SCORES[c.mood] <= 2
  );
  const ratio = sensoryWithMeltdown.length / sensoryDays.length;

  if (ratio < 0.55) return [];

  return [
    {
      child_id: childId,
      insight_type: "pattern",
      title: "Overstimulation may be affecting the day",
      description: `We noticed harder moments after high-sensory or overstimulating days recently. This appeared on ${sensoryWithMeltdown.length} of ${sensoryDays.length} sensory-heavy days.`,
      confidence: ratio,
      data_points: sensoryDays.length,
      source_check_in_ids: sensoryDays.map((c) => c.id),
      support_tags: ["overstimulation", "sensory_support", "calming_activity"],
    },
  ];
}

function detectRecurringDifficultPeriods(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const counts = checkIns.reduce<Record<string, DailyCheckIn[]>>((acc, c) => {
    if (!c.difficult_period || c.difficult_period === "none") return acc;
    acc[c.difficult_period] = [...(acc[c.difficult_period] ?? []), c];
    return acc;
  }, {});

  const [period, days] =
    Object.entries(counts).sort((a, b) => b[1].length - a[1].length)[0] ?? [];

  if (!period || !days || days.length < 2) return [];

  return [
    {
      child_id: childId,
      insight_type: "pattern",
      title: `Harder ${period}s are repeating`,
      description: `We noticed ${period} has been the hardest part of the day ${days.length} times recently. A small buffer before that window may be worth gently observing.`,
      confidence: Math.min(0.55 + days.length / checkIns.length, 0.9),
      data_points: days.length,
      source_check_in_ids: days.map((c) => c.id),
      support_tags: ["routine", "calming_activity", period],
    },
  ];
}

function detectEmotionalShift(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  if (checkIns.length < 5) return [];

  const recent = checkIns.slice(-3);
  const earlier = checkIns.slice(0, -3);
  const recentMood = average(recent.map((c) => MOOD_SCORES[c.mood]));
  const earlierMood = average(earlier.map((c) => MOOD_SCORES[c.mood]));

  if (recentMood <= earlierMood - 0.75) {
    return [
      {
        child_id: childId,
        insight_type: "trend",
        title: "Recent days look emotionally heavier",
        description: `The last few check-ins show a gentler dip in mood compared with the earlier pattern. It may help to look for sleep, sensory, food, or routine changes around this shift.`,
        confidence: Math.min(0.65 + Math.abs(recentMood - earlierMood) / 5, 0.9),
        data_points: checkIns.length,
        source_check_in_ids: recent.map((c) => c.id),
        support_tags: ["mood", "parent_self_care", "observation"],
      },
    ];
  }

  if (recentMood >= earlierMood + 0.75) {
    return [
      {
        child_id: childId,
        insight_type: "observation",
        title: "A steadier stretch is emerging",
        description: `The recent check-ins look calmer than the earlier pattern. That is worth noticing, especially if routines, sleep, or sensory supports have been more predictable lately.`,
        confidence: Math.min(0.65 + Math.abs(recentMood - earlierMood) / 5, 0.9),
        data_points: checkIns.length,
        source_check_in_ids: recent.map((c) => c.id),
        support_tags: ["progress", "routine", "parent_self_care"],
      },
    ];
  }

  return [];
}

function detectCommunicationShift(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  if (checkIns.length < 5) return [];

  const midpoint = Math.floor(checkIns.length / 2);
  const earlier = average(checkIns.slice(0, midpoint).map((c) => c.communication_level));
  const later = average(checkIns.slice(midpoint).map((c) => c.communication_level));

  if (later >= earlier + 0.6) {
    return [
      {
        child_id: childId,
        insight_type: "trend",
        title: "Communication is trending up",
        description: `Communication check-ins have moved upward recently. Small gains can be easy to miss in the middle of busy days.`,
        confidence: Math.min(0.6 + (later - earlier) / 3, 0.9),
        data_points: checkIns.length,
        source_check_in_ids: checkIns.slice(midpoint).map((c) => c.id),
        support_tags: ["communication", "progress"],
      },
    ];
  }

  if (earlier >= later + 0.6) {
    return [
      {
        child_id: childId,
        insight_type: "trend",
        title: "Communication may need extra support",
        description: `Communication check-ins have dipped recently. This does not mean anything is wrong; it may simply be a signal to watch alongside sleep, sensory load, and routine changes.`,
        confidence: Math.min(0.6 + (earlier - later) / 3, 0.9),
        data_points: checkIns.length,
        source_check_in_ids: checkIns.slice(midpoint).map((c) => c.id),
        support_tags: ["communication", "observation"],
      },
    ];
  }

  return [];
}

function detectEnergyBehaviorPattern(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const highEnergyDays = checkIns.filter((c) => (c.energy_level ?? 3) >= 4);
  if (highEnergyDays.length < 2) return [];

  const highEnergyMeltdowns = highEnergyDays.filter((c) => c.meltdowns > 0);
  const ratio = highEnergyMeltdowns.length / highEnergyDays.length;

  if (ratio < 0.5) return [];

  return [
    {
      child_id: childId,
      insight_type: "correlation",
      title: "High energy days may need more movement outlets",
      description: `On ${highEnergyMeltdowns.length} of ${highEnergyDays.length} high-energy days, difficult moments showed up. Movement breaks and physical outlets may help channel that energy.`,
      confidence: ratio,
      data_points: highEnergyDays.length,
      source_check_in_ids: highEnergyDays.map((c) => c.id),
      support_tags: ["energy", "activity", "movement", "calming_activity"],
    },
  ];
}

function detectHyperactivityPattern(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const hyperDays = checkIns.filter((c) => (c.hyperactivity ?? 3) >= 4);
  if (hyperDays.length < 2) return [];

  const hyperWithLowComm = hyperDays.filter((c) => c.communication_level <= 2);
  if (hyperWithLowComm.length / hyperDays.length >= 0.5) {
    return [
      {
        child_id: childId,
        insight_type: "correlation",
        title: "Hyperactivity and communication may be connected",
        description: `On high-hyperactivity days, communication also dipped ${hyperWithLowComm.length} out of ${hyperDays.length} times. The body may be processing more than words can express.`,
        confidence: hyperWithLowComm.length / hyperDays.length,
        data_points: hyperDays.length,
        source_check_in_ids: hyperDays.map((c) => c.id),
        support_tags: ["hyperactivity", "communication", "sensory_support"],
      },
    ];
  }

  const hyperWithSensory = hyperDays.filter((c) => (c.sensory_load ?? 3) >= 4);
  if (hyperWithSensory.length / hyperDays.length >= 0.5) {
    return [
      {
        child_id: childId,
        insight_type: "correlation",
        title: "Hyperactivity may follow sensory overload",
        description: `High hyperactivity and high sensory load appeared together on ${hyperWithSensory.length} of ${hyperDays.length} days. This may be a regulation response.`,
        confidence: hyperWithSensory.length / hyperDays.length,
        data_points: hyperDays.length,
        source_check_in_ids: hyperDays.map((c) => c.id),
        support_tags: ["hyperactivity", "overstimulation", "sensory_support"],
      },
    ];
  }

  return [];
}

function detectSocialOverwhelmPattern(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const lowSocialDays = checkIns.filter((c) => (c.social_interaction ?? 3) <= 2);
  if (lowSocialDays.length < 2) return [];

  const lowSocialWithSensory = lowSocialDays.filter(
    (c) => (c.sensory_load ?? 3) >= 4 || c.meltdowns > 0
  );
  const ratio = lowSocialWithSensory.length / lowSocialDays.length;

  if (ratio < 0.5) return [];

  return [
    {
      child_id: childId,
      insight_type: "pattern",
      title: "Social withdrawal may signal overwhelm",
      description: `Lower social interaction appeared alongside sensory overload or meltdowns on ${lowSocialWithSensory.length} of ${lowSocialDays.length} days. Social retreat may be a self-regulation strategy.`,
      confidence: ratio,
      data_points: lowSocialDays.length,
      source_check_in_ids: lowSocialDays.map((c) => c.id),
      support_tags: ["social", "overstimulation", "observation"],
    },
  ];
}

function detectParentStressTrend(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const stressDays = checkIns.filter((c) => (c.parent_stress ?? 3) >= 4);
  if (stressDays.length < 2) return [];

  const recentStress = checkIns.slice(-3).filter((c) => (c.parent_stress ?? 3) >= 4);

  if (recentStress.length >= 2) {
    return [
      {
        child_id: childId,
        insight_type: "trend",
        title: "Parent stress has been elevated recently",
        description: `Parent stress has been high on ${recentStress.length} of the last 3 check-ins. The parent's nervous system matters too — recognizing this is a strength, not a weakness.`,
        confidence: Math.min(0.7 + recentStress.length / 10, 0.9),
        data_points: stressDays.length,
        source_check_in_ids: stressDays.map((c) => c.id),
        support_tags: ["parent_self_care", "burnout", "observation"],
      },
    ];
  }

  return [];
}

function detectPositiveStreak(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  if (checkIns.length < 3) return [];

  const recent = checkIns.slice(-5);
  const goodDays = recent.filter(
    (c) =>
      (c.mood === "good" || c.mood === "great") &&
      c.meltdowns === 0 &&
      c.routine_adherence >= 4
  );

  if (goodDays.length >= 3) {
    return [
      {
        child_id: childId,
        insight_type: "observation",
        title: "A positive streak is building",
        description: `${goodDays.length} of the last ${recent.length} days have been steady — good mood, no meltdowns, and consistent routines. Whatever is in place right now seems to be working.`,
        confidence: Math.min(0.7 + goodDays.length / 10, 0.95),
        data_points: goodDays.length,
        source_check_in_ids: goodDays.map((c) => c.id),
        support_tags: ["progress", "routine", "celebration"],
      },
    ];
  }

  return [];
}

// ─── Sleep ↔ Communication Link ───────────────────────────────────────────────
function detectSleepCommunicationLink(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const lowSleepDays = checkIns.filter((c) => c.sleep_quality <= 2);
  if (lowSleepDays.length < 2) return [];

  const lowSleepLowComm = lowSleepDays.filter((c) => c.communication_level <= 2);
  const ratio = lowSleepLowComm.length / lowSleepDays.length;
  if (ratio < 0.55) return [];

  return [{
    child_id: childId,
    insight_type: "correlation",
    title: "Low sleep appears to reduce verbal expression",
    description: `On ${lowSleepLowComm.length} of ${lowSleepDays.length} low-sleep days, communication also dipped. When sleep is shorter, extra patience with communication may help.`,
    confidence: ratio,
    data_points: lowSleepDays.length,
    source_check_in_ids: lowSleepDays.map((c) => c.id),
    support_tags: ["sleep", "communication", "observation"],
  }];
}

// ─── Compound Vulnerability Days ─────────────────────────────────────────────
// Flags days where 3+ risk factors co-occur — these are the hardest days.
function detectCompoundVulnerabilityDay(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const compoundDays = checkIns.filter((c) => {
    const riskFactors = [
      c.sleep_quality <= 2,
      (c.sensory_load ?? 0) >= 4,
      c.routine_adherence <= 2,
      c.meltdowns >= 2,
      c.mood === "very_difficult",
    ].filter(Boolean).length;
    return riskFactors >= 3;
  });

  if (compoundDays.length < 1) return [];

  return [{
    child_id: childId,
    insight_type: "pattern",
    title: "Some days carry multiple stressors simultaneously",
    description: `We noticed ${compoundDays.length} day(s) where sleep, sensory load, routine disruption, and mood challenges all appeared together. These compound days are the hardest — and not your fault. A recovery day after these is well worth protecting.`,
    confidence: Math.min(0.6 + compoundDays.length * 0.1, 0.95),
    data_points: compoundDays.length,
    source_check_in_ids: compoundDays.map((c) => c.id),
    support_tags: ["overstimulation", "meltdown_recovery", "parent_self_care", "routine"],
  }];
}

// ─── Meltdown Recovery Pattern ────────────────────────────────────────────────
// Detects how quickly the child recovers after high-meltdown days.
function detectMeltdownRecoveryPattern(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  if (checkIns.length < 4) return [];

  let quickRecoveries = 0;
  let slowRecoveries = 0;

  for (let i = 0; i < checkIns.length - 1; i++) {
    if (checkIns[i].meltdowns >= 2) {
      const next = checkIns[i + 1];
      if (MOOD_SCORES[next.mood] >= 3 && next.meltdowns <= 1) {
        quickRecoveries++;
      } else {
        slowRecoveries++;
      }
    }
  }

  if (quickRecoveries + slowRecoveries === 0) return [];

  const isQuick = quickRecoveries > slowRecoveries;
  return [{
    child_id: childId,
    insight_type: "observation",
    title: isQuick ? "Recovery after hard days is building" : "Hard days sometimes carry into the next morning",
    description: isQuick
      ? `After difficult days, the following day has been steadier ${quickRecoveries} time(s). A gentle, predictable next morning appears to help recovery.`
      : `After meltdown-heavy days, the next day has sometimes stayed difficult ${slowRecoveries} time(s). A very low-demand follow-up day may support faster recovery.`,
    confidence: 0.7,
    data_points: quickRecoveries + slowRecoveries,
    source_check_in_ids: [],
    support_tags: ["meltdown_recovery", "routine", "parent_self_care"],
  }];
}

// ─── Parent Mood Mirror ────────────────────────────────────────────────────────
// Detects whether parent stress and child mood often track together.
function detectParentMoodMirror(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const tracked = checkIns.filter((c) => c.parent_stress != null);
  if (tracked.length < 4) return [];

  const mirroredDays = tracked.filter(
    (c) =>
      (c.parent_stress! >= 4 && MOOD_SCORES[c.mood] <= 2) ||
      (c.parent_stress! <= 2 && MOOD_SCORES[c.mood] >= 4)
  );
  const ratio = mirroredDays.length / tracked.length;

  if (ratio < 0.5) return [];

  return [{
    child_id: childId,
    insight_type: "correlation",
    title: "Parent and child emotional states often align",
    description: `On ${mirroredDays.length} of ${tracked.length} logged days, parent stress and child mood appeared to move together. This is a two-way relationship — when the parent is steadier, the child often is too, and vice versa. Your wellbeing is part of the support system.`,
    confidence: ratio,
    data_points: tracked.length,
    source_check_in_ids: mirroredDays.map((c) => c.id),
    support_tags: ["parent_self_care", "co-regulation", "observation"],
  }];
}

// ─── Activity Mood Boost ──────────────────────────────────────────────────────
// Detects specific activities that are consistently paired with better moods.
function detectActivityMoodBoost(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  const withActivities = checkIns.filter((c) => c.activities);
  if (withActivities.length < 3) return [];

  const activityPatterns: [RegExp, string][] = [
    [/water|bath|splash/i, "water play"],
    [/walk|outdoor|park/i, "outdoor time"],
    [/blanket|pressure|deep/i, "deep pressure"],
    [/draw|colour|art/i, "art activities"],
    [/dinosaur|dino|puzzle|block/i, "interest-based activities"],
  ];

  let bestLabel = "";
  let bestScore = 0;
  let bestCount = 0;

  for (const [pattern, label] of activityPatterns) {
    const days = withActivities.filter((c) => pattern.test(c.activities!));
    if (days.length < 2) continue;
    const avgMood = days.reduce((s, c) => s + MOOD_SCORES[c.mood], 0) / days.length;
    if (avgMood > bestScore) {
      bestScore = avgMood;
      bestLabel = label;
      bestCount = days.length;
    }
  }

  if (!bestLabel || bestScore < 3.5) return [];

  return [{
    child_id: childId,
    insight_type: "observation",
    title: `${bestLabel.charAt(0).toUpperCase() + bestLabel.slice(1)} seems to support better days`,
    description: `On the ${bestCount} days that included ${bestLabel}, the average mood was ${bestScore.toFixed(1)}/5. This may be worth protecting in the daily routine.`,
    confidence: Math.min(0.65 + bestCount * 0.05, 0.9),
    data_points: bestCount,
    source_check_in_ids: [],
    support_tags: ["calming_activity", "routine", "progress"],
  }];
}

// ─── Sensory Load Carryover ───────────────────────────────────────────────────
// Detects whether high sensory days predict harder next-day mornings.
function detectSensoryLoadCarryover(
  checkIns: DailyCheckIn[],
  childId: string
): InsightDraft[] {
  if (checkIns.length < 4) return [];

  let carryover = 0;
  let total = 0;

  for (let i = 0; i < checkIns.length - 1; i++) {
    if ((checkIns[i].sensory_load ?? 0) >= 4) {
      total++;
      const next = checkIns[i + 1];
      if (MOOD_SCORES[next.mood] <= 2 || next.meltdowns > 0) {
        carryover++;
      }
    }
  }

  if (total < 2 || carryover / total < 0.5) return [];

  return [{
    child_id: childId,
    insight_type: "pattern",
    title: "Overstimulating days sometimes affect the following morning",
    description: `On ${carryover} of ${total} high-sensory days, the next day also started harder. A gentler evening routine and lower-demand next morning may help the nervous system reset overnight.`,
    confidence: carryover / total,
    data_points: total,
    source_check_in_ids: [],
    support_tags: ["sensory_support", "overstimulation", "routine", "sleep"],
  }];
}

function dedupeInsights(drafts: InsightDraft[]) {
  const seen = new Set<string>();
  return drafts.filter((draft) => {
    const key = `${draft.insight_type}:${draft.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function stableInsightId(insight: InsightDraft) {
  const source = `${insight.child_id}:${insight.insight_type}:${insight.title}`;
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    hash = (hash << 5) - hash + source.charCodeAt(i);
    hash |= 0;
  }
  return `insight-${Math.abs(hash)}`;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
