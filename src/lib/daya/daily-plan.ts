import type { DailyCheckIn, BehavioralInsight, ChildProfile } from "@/types";
import type { DayaIntent } from "./intent";
import { generateFoodPlan, formatFoodPlan } from "./food-planner";

type PlanSection = {
  period: "morning" | "afternoon" | "evening";
  emoji: string;
  label: string;
  items: string[];
};

type BehavioralPrepItem = {
  pattern: string;
  suggestion: string;
};

type DailyPlan = {
  title: string;
  sections: PlanSection[];
  behavioralPrep: BehavioralPrepItem[];
  parentSupport: string[];
  note: string;
};

export function generateDailyPlan(options: {
  child?: ChildProfile;
  checkIns: DailyCheckIn[];
  insights: BehavioralInsight[];
  intent: DayaIntent;
}): DailyPlan {
  const { child, checkIns, insights, intent } = options;
  const childName = child?.name ?? "your child";
  const recent = checkIns.at(-1);
  const prev = checkIns.at(-2);

  const lowSleep = (recent?.sleep_quality ?? 3) <= 2;
  const lowMeals = (recent?.meal_quality ?? 3) <= 2;
  const highSensory = (recent?.sensory_load ?? 3) >= 4;
  const hadMeltdowns = (recent?.meltdowns ?? 0) > 0;
  const lowRoutine = (recent?.routine_adherence ?? 3) <= 2;
  const difficultMood = recent?.mood === "difficult" || recent?.mood === "very_difficult";
  const hardPeriod = recent?.difficult_period ?? "none";
  const highEnergy = (recent?.energy_level ?? 3) >= 4;
  const highHyperactivity = (recent?.hyperactivity ?? 3) >= 4;
  const lowSocial = (recent?.social_interaction ?? 3) <= 2;
  const highRepetitive = (recent?.repetitive_behaviors ?? 3) >= 4;
  const highParentStress = (recent?.parent_stress ?? 3) >= 4;

  const hasRoutineInsight = insights.some((i) => i.support_tags?.includes("routine"));
  const hasSleepInsight = insights.some((i) => i.support_tags?.includes("sleep"));
  const hasSensoryInsight = insights.some((i) => i.support_tags?.includes("overstimulation"));

  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  // Morning planning
  if (lowSleep || hasSleepInsight) {
    morning.push("Slower wake-up with dim lighting and minimal demands");
    morning.push("Offer a familiar comfort food for breakfast — predictability first");
  } else {
    morning.push("Gentle morning greeting with visual schedule preview");
    morning.push("Calm, predictable breakfast at the usual time");
  }

  if (lowRoutine || hasRoutineInsight) {
    morning.push("Walk through the day's plan together using simple visual cues");
  }

  if (hardPeriod === "morning") {
    morning.push("Extra buffer time before transitions — no rushing");
    morning.push("Keep choices minimal (e.g., two outfit options, not open-ended)");
  }

  if (highHyperactivity || highEnergy) {
    morning.push("Short movement break before any seated activity — jumping, stretching, or a walk");
  }

  morning.push("Hydration check — water available and visible");

  // Afternoon planning
  if (highSensory || hasSensoryInsight) {
    afternoon.push("Quiet decompression period after school or activities");
    afternoon.push("Noise-reduced environment — consider headphones or a calm corner");
  } else {
    afternoon.push("Gentle transition from school/activities with a calming ritual");
  }

  if (hadMeltdowns || intent === "meltdown_recovery") {
    afternoon.push("Low-demand activity — water play, drawing, or a comfort show");
    afternoon.push("Keep the environment quieter than usual");
  }

  if (intent === "hyperactivity" || intent === "activity_request" || highHyperactivity) {
    afternoon.push("Movement break — jumping, swinging, or an outdoor walk");
  }

  afternoon.push("Hydration and a small sensory-friendly snack");

  if (hardPeriod === "afternoon") {
    afternoon.push("Pre-transition warning before any activity change");
  }

  if ((recent?.communication_level ?? 3) <= 2) {
    afternoon.push("Low-pressure communication time — picture cards or shared activity without questions");
  }

  if (lowSocial) {
    afternoon.push("Brief, optional parallel play opportunity — no forced interaction");
  }

  // Evening planning
  if (difficultMood || hadMeltdowns) {
    evening.push("Lower stimulation — softer lights, quieter voices, fewer screens");
    evening.push("Predictable dinner timing with a familiar, comfortable meal");
  } else {
    evening.push("Predictable dinner at the usual time");
  }

  if (lowSleep || hasSleepInsight) {
    evening.push("Start wind-down routine 15 minutes earlier than usual");
    evening.push("Calming bedtime sequence — same order, same activities");
  } else {
    evening.push("Consistent bedtime routine — bath, story, comfort item, lights down");
  }

  if (highSensory) {
    evening.push("Deep-pressure comfort before bed if it usually helps");
  }

  if (hardPeriod === "evening" || hardPeriod === "night") {
    evening.push("Extra calm — no new demands, just connection and comfort");
  }

  if (highRepetitive) {
    evening.push("Allow repetitive comfort activities during wind-down — they may help self-regulate");
  }

  evening.push("Comfort item accessible — familiar blanket, toy, or object");

  // Add child-specific routine knowledge
  if (child?.routines.length) {
    for (const routine of child.routines) {
      const lower = routine.toLowerCase();
      if (lower.includes("morning") && morning.length < 7) {
        morning.push(`Continue ${routine} — familiar anchors matter`);
      }
      if ((lower.includes("bedtime") || lower.includes("evening")) && evening.length < 7) {
        evening.push(`Maintain ${routine}`);
      }
    }
  }

  // Behavioral preparation
  const behavioralPrep = generateBehavioralPrep(checkIns, insights, childName);

  // Parent support
  const parentSupport = generateParentSupport(recent, prev, highParentStress, childName);

  const note = generatePlanNote(recent, prev, childName);

  return {
    title: `Tomorrow's Support Flow for ${childName}`,
    sections: [
      { period: "morning", emoji: "🌅", label: "Morning", items: morning.slice(0, 5) },
      { period: "afternoon", emoji: "🏫", label: "Afternoon", items: afternoon.slice(0, 5) },
      { period: "evening", emoji: "🌙", label: "Evening", items: evening.slice(0, 5) },
    ],
    behavioralPrep,
    parentSupport,
    note,
  };
}

function generateBehavioralPrep(
  checkIns: DailyCheckIn[],
  insights: BehavioralInsight[],
  childName: string
): BehavioralPrepItem[] {
  const prep: BehavioralPrepItem[] = [];
  const recent = checkIns.at(-1);

  // Day-of-week patterns
  if (checkIns.length >= 7) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayName = tomorrow.toLocaleDateString("en-US", { weekday: "long" });
    const dayIndex = tomorrow.getDay();
    const sameDayCheckIns = checkIns.filter((c) => new Date(c.date).getDay() === dayIndex);
    const difficultSameDays = sameDayCheckIns.filter(
      (c) => c.mood === "difficult" || c.mood === "very_difficult" || c.meltdowns > 0
    );
    if (sameDayCheckIns.length >= 2 && difficultSameDays.length / sameDayCheckIns.length >= 0.6) {
      prep.push({
        pattern: `${dayName}s tend to feel emotionally heavier for ${childName}.`,
        suggestion: "Consider building in extra buffer time and keeping demands low.",
      });
    }
  }

  // Sleep-behavior pattern
  if (recent && recent.sleep_quality <= 2) {
    const lowSleepDays = checkIns.filter((c) => c.sleep_quality <= 2);
    const lowSleepWithMeltdowns = lowSleepDays.filter((c) => c.meltdowns > 0);
    if (lowSleepDays.length >= 2 && lowSleepWithMeltdowns.length / lowSleepDays.length >= 0.5) {
      prep.push({
        pattern: "Lower sleep has recently been followed by more sensory sensitivity.",
        suggestion: "Gentler morning pace and reduced sensory demands may help.",
      });
    }
  }

  // Sensory-evening pattern
  if (recent && (recent.sensory_load ?? 3) >= 4) {
    const highSensoryDays = checkIns.filter((c) => (c.sensory_load ?? 0) >= 4);
    const hardEvenings = highSensoryDays.filter(
      (c) => c.difficult_period === "evening" || c.difficult_period === "night"
    );
    if (highSensoryDays.length >= 2 && hardEvenings.length / highSensoryDays.length >= 0.5) {
      prep.push({
        pattern: "Loud environments earlier in the day sometimes lead to difficult evenings.",
        suggestion: "Plan for a quieter afternoon and a low-demand evening.",
      });
    }
  }

  // Routine-disruption recovery
  if (recent && recent.routine_adherence <= 2) {
    prep.push({
      pattern: `After routine disruptions, ${childName} typically needs 1-2 days to resettle.`,
      suggestion: "Keep tomorrow as predictable as possible — same times, same order.",
    });
  }

  // Insight-based prep
  for (const insight of insights.slice(0, 3)) {
    if (insight.confidence >= 0.7 && prep.length < 4) {
      prep.push({
        pattern: insight.description,
        suggestion: "DAYA will continue watching this pattern across the coming days.",
      });
    }
  }

  return prep.slice(0, 4);
}

function generateParentSupport(
  recent?: DailyCheckIn,
  prev?: DailyCheckIn,
  highStress = false,
  childName = "your child"
): string[] {
  const support: string[] = [];

  if (highStress) {
    support.push("You are carrying a lot right now. That level of care is extraordinary — and it is also okay to feel the weight of it.");
    support.push("Even a brief pause — water, a breath, one supportive text — can help your nervous system settle too.");
  }

  if (recent?.parent_notes) {
    if (/exhaust|tired|can't|overwhelm|awful|guilt/i.test(recent.parent_notes)) {
      support.push("The feelings you described are real and valid. You don't have to solve everything today.");
    }
    if (/hope|good|relax|proud|better/i.test(recent.parent_notes)) {
      support.push("The steadier moments you noticed are worth celebrating. You are building something that matters.");
    }
  }

  if (recent?.meltdowns && recent.meltdowns >= 2) {
    support.push("Multiple hard moments in one day is genuinely exhausting. Tomorrow is a fresh start.");
  }

  if (prev && prev.meltdowns > 0 && recent && recent.meltdowns === 0) {
    support.push(`Whatever you did differently today helped. ${childName} had a steadier day, and that's worth noticing.`);
  }

  // Always include at least one
  if (!support.length) {
    support.push("You are noticing patterns carefully, and that matters more than you might realize.");
  }

  support.push("Small routines built consistently can still create calmer days.");

  return support.slice(0, 3);
}

function generatePlanNote(
  recent?: DailyCheckIn,
  prev?: DailyCheckIn,
  childName = "your child"
): string {
  if (!recent) {
    return `This plan is a starting point. As you log more check-ins, DAYA will personalize it based on ${childName}'s actual patterns.`;
  }

  const parts: string[] = [];

  if (recent.mood === "difficult" || recent.mood === "very_difficult") {
    parts.push("Today was harder — tomorrow's plan leans toward more predictability and lower demands.");
  } else if (recent.mood === "great" || recent.mood === "good") {
    parts.push("Today went well — tomorrow's plan aims to keep that momentum with familiar structure.");
  }

  if (prev && prev.meltdowns > 0 && recent.meltdowns === 0) {
    parts.push("The recovery from yesterday's difficult moments seems to be happening — keep the pace gentle.");
  }

  if (!parts.length) {
    parts.push(`This plan is shaped by ${childName}'s recent patterns. Adjust freely based on what you observe in the moment.`);
  }

  return parts.join(" ");
}

export function formatDailyPlan(plan: DailyPlan): string {
  let output = `\n🗓️ ${plan.title}\n`;

  for (const section of plan.sections) {
    output += `\n${section.emoji} ${section.label}\n`;
    for (const item of section.items) {
      output += `• ${item}\n`;
    }
  }

  if (plan.behavioralPrep.length > 0) {
    output += `\n🔮 Behavioral Preparation\n`;
    for (const prep of plan.behavioralPrep) {
      output += `• ${prep.pattern}\n  → ${prep.suggestion}\n`;
    }
  }

  if (plan.parentSupport.length > 0) {
    output += `\n🤍 For You, the Parent\n`;
    for (const item of plan.parentSupport) {
      output += `• ${item}\n`;
    }
  }

  output += `\n💛 ${plan.note}`;
  return output;
}

export function generateFullDayPlan(options: {
  child?: ChildProfile;
  checkIns: DailyCheckIn[];
  insights: BehavioralInsight[];
  intent: DayaIntent;
}): string {
  const routinePlan = generateDailyPlan(options);
  const foodPlan = generateFoodPlan({
    child: options.child,
    checkIns: options.checkIns,
    insights: options.insights,
  });

  return `${formatDailyPlan(routinePlan)}\n\n${formatFoodPlan(foodPlan)}`;
}
