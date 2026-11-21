import type { DailyCheckIn, BehavioralInsight, ChildProfile, MoodValue } from "@/types";

const MOOD_SCORES: Record<MoodValue, number> = {
  great: 5,
  good: 4,
  okay: 3,
  difficult: 2,
  very_difficult: 1,
};

export type TherapistReport = {
  title: string;
  period: { start: string; end: string; totalDays: number };
  child: { name: string; age?: number };
  sections: ReportSection[];
  disclaimer: string;
  generatedAt: string;
};

type ReportSection = {
  title: string;
  emoji: string;
  content: string[];
};

export function generateTherapistReport(options: {
  child?: ChildProfile;
  checkIns: DailyCheckIn[];
  insights: BehavioralInsight[];
}): TherapistReport {
  const { child, checkIns, insights } = options;
  const childName = child?.name ?? "Child";
  const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length < 3) {
    return {
      title: `Behavioral Observation Report — ${childName}`,
      period: { start: "", end: "", totalDays: sorted.length },
      child: { name: childName, age: child?.age },
      sections: [
        {
          title: "Insufficient Data",
          emoji: "📊",
          content: [
            `Only ${sorted.length} check-in(s) recorded. A minimum of 7 days of data is recommended for meaningful patterns. Continue logging daily to build a more complete picture.`,
          ],
        },
      ],
      disclaimer: DISCLAIMER,
      generatedAt: new Date().toISOString(),
    };
  }

  const start = sorted[0].date;
  const end = sorted[sorted.length - 1].date;
  const sections: ReportSection[] = [];

  sections.push(sleepSection(sorted, childName));
  sections.push(moodSection(sorted, childName));
  sections.push(meltdownSection(sorted, childName));
  sections.push(sensorySection(sorted, childName));
  sections.push(communicationSection(sorted, childName));
  sections.push(routineSection(sorted, childName));
  sections.push(foodSection(sorted, childName));
  sections.push(energyAndBehaviorSection(sorted, childName));
  sections.push(socialSection(sorted, childName));
  sections.push(parentWellbeingSection(sorted));
  sections.push(insightSection(insights));

  return {
    title: `Behavioral Observation Report — ${childName}`,
    period: { start, end, totalDays: sorted.length },
    child: { name: childName, age: child?.age },
    sections: sections.filter((s) => s.content.length > 0),
    disclaimer: DISCLAIMER,
    generatedAt: new Date().toISOString(),
  };
}

function sleepSection(checkIns: DailyCheckIn[], childName: string): ReportSection {
  const sleepValues = checkIns.map((c) => c.sleep_quality);
  const avg = mean(sleepValues);
  const lowDays = checkIns.filter((c) => c.sleep_quality <= 2);
  const highDays = checkIns.filter((c) => c.sleep_quality >= 4);
  const hours = checkIns.filter((c) => c.sleep_hours).map((c) => c.sleep_hours!);
  const avgHours = hours.length ? mean(hours) : null;

  const content: string[] = [];
  content.push(`Average sleep quality: ${avg.toFixed(1)}/5 across ${checkIns.length} days.`);
  if (avgHours) content.push(`Average sleep duration: ${avgHours.toFixed(1)} hours.`);
  content.push(`Days with low sleep (≤2/5): ${lowDays.length}. Days with good sleep (≥4/5): ${highDays.length}.`);

  if (lowDays.length >= 2) {
    const lowSleepMeltdowns = lowDays.filter((c) => c.meltdowns > 0);
    content.push(`On low-sleep days, meltdowns occurred ${lowSleepMeltdowns.length} of ${lowDays.length} times (${pct(lowSleepMeltdowns.length, lowDays.length)}).`);
  }

  return { title: "Sleep Patterns", emoji: "😴", content };
}

function moodSection(checkIns: DailyCheckIn[], childName: string): ReportSection {
  const moodCounts = countBy(checkIns, (c) => c.mood);
  const avgMood = mean(checkIns.map((c) => MOOD_SCORES[c.mood]));
  const content: string[] = [];

  content.push(`Average mood score: ${avgMood.toFixed(1)}/5.`);
  content.push(`Mood distribution: ${Object.entries(moodCounts).map(([k, v]) => `${k.replace("_", " ")} (${v})`).join(", ")}.`);

  const recent3 = checkIns.slice(-3);
  const recent3Avg = mean(recent3.map((c) => MOOD_SCORES[c.mood]));
  const earlier = checkIns.slice(0, -3);
  if (earlier.length >= 3) {
    const earlierAvg = mean(earlier.map((c) => MOOD_SCORES[c.mood]));
    const diff = recent3Avg - earlierAvg;
    if (Math.abs(diff) >= 0.5) {
      content.push(`Recent trend: mood has ${diff > 0 ? "improved" : "declined"} (${earlierAvg.toFixed(1)} → ${recent3Avg.toFixed(1)}).`);
    }
  }

  return { title: "Mood Trends", emoji: "🎭", content };
}

function meltdownSection(checkIns: DailyCheckIn[], childName: string): ReportSection {
  const totalMeltdowns = checkIns.reduce((sum, c) => sum + c.meltdowns, 0);
  const daysWithMeltdowns = checkIns.filter((c) => c.meltdowns > 0);
  const avgPerDay = totalMeltdowns / checkIns.length;
  const content: string[] = [];

  content.push(`Total meltdowns: ${totalMeltdowns} across ${checkIns.length} days (average ${avgPerDay.toFixed(1)}/day).`);
  content.push(`Days with at least one meltdown: ${daysWithMeltdowns.length} of ${checkIns.length} (${pct(daysWithMeltdowns.length, checkIns.length)}).`);

  const triggers = daysWithMeltdowns
    .filter((c) => c.meltdown_triggers)
    .map((c) => c.meltdown_triggers!);
  if (triggers.length) {
    content.push(`Recorded triggers: ${triggers.join("; ")}.`);
  }

  const periods = countBy(
    daysWithMeltdowns.filter((c) => c.difficult_period && c.difficult_period !== "none"),
    (c) => c.difficult_period!
  );
  if (Object.keys(periods).length) {
    content.push(`Most difficult periods on meltdown days: ${Object.entries(periods).map(([k, v]) => `${k} (${v})`).join(", ")}.`);
  }

  return { title: "Meltdown Frequency & Triggers", emoji: "⚡", content };
}

function sensorySection(checkIns: DailyCheckIn[], childName: string): ReportSection {
  const sensoryDays = checkIns.filter((c) => c.sensory_load != null);
  if (!sensoryDays.length) return { title: "Sensory Patterns", emoji: "🌊", content: ["No sensory data recorded."] };

  const avg = mean(sensoryDays.map((c) => c.sensory_load!));
  const highDays = sensoryDays.filter((c) => c.sensory_load! >= 4);
  const content: string[] = [];

  content.push(`Average sensory load: ${avg.toFixed(1)}/5 across ${sensoryDays.length} days.`);
  content.push(`High sensory load days (≥4/5): ${highDays.length}.`);

  const issues = checkIns.filter((c) => c.sensory_issues).map((c) => c.sensory_issues!);
  if (issues.length) {
    content.push(`Sensory observations: ${issues.join("; ")}.`);
  }

  if (highDays.length >= 2) {
    const highSensoryMeltdowns = highDays.filter((c) => c.meltdowns > 0);
    content.push(`On high-sensory days, meltdowns occurred ${highSensoryMeltdowns.length} of ${highDays.length} times (${pct(highSensoryMeltdowns.length, highDays.length)}).`);
  }

  return { title: "Sensory Patterns", emoji: "🌊", content };
}

function communicationSection(checkIns: DailyCheckIn[], childName: string): ReportSection {
  const avg = mean(checkIns.map((c) => c.communication_level));
  const content: string[] = [];

  content.push(`Average communication level: ${avg.toFixed(1)}/5.`);

  const mid = Math.floor(checkIns.length / 2);
  if (mid >= 2) {
    const earlier = mean(checkIns.slice(0, mid).map((c) => c.communication_level));
    const later = mean(checkIns.slice(mid).map((c) => c.communication_level));
    const diff = later - earlier;
    if (Math.abs(diff) >= 0.5) {
      content.push(`Communication trend: ${diff > 0 ? "improving" : "declining"} (${earlier.toFixed(1)} → ${later.toFixed(1)}).`);
    } else {
      content.push(`Communication has been relatively stable.`);
    }
  }

  return { title: "Communication Changes", emoji: "💬", content };
}

function routineSection(checkIns: DailyCheckIn[], childName: string): ReportSection {
  const avg = mean(checkIns.map((c) => c.routine_adherence));
  const lowDays = checkIns.filter((c) => c.routine_adherence <= 2);
  const content: string[] = [];

  content.push(`Average routine adherence: ${avg.toFixed(1)}/5.`);
  content.push(`Days with disrupted routine (≤2/5): ${lowDays.length} of ${checkIns.length}.`);

  if (lowDays.length >= 2) {
    const disruptedMeltdowns = lowDays.filter((c) => c.meltdowns > 0);
    content.push(`On disrupted-routine days, meltdowns occurred ${disruptedMeltdowns.length} of ${lowDays.length} times (${pct(disruptedMeltdowns.length, lowDays.length)}).`);
  }

  return { title: "Routine Consistency", emoji: "📋", content };
}

function foodSection(checkIns: DailyCheckIn[], childName: string): ReportSection {
  const avg = mean(checkIns.map((c) => c.meal_quality));
  const lowDays = checkIns.filter((c) => c.meal_quality <= 2);
  const content: string[] = [];

  content.push(`Average meal quality: ${avg.toFixed(1)}/5.`);
  content.push(`Days with lower meal quality (≤2/5): ${lowDays.length} of ${checkIns.length}.`);

  if (lowDays.length >= 2) {
    const lowMealDifficultMood = lowDays.filter((c) => MOOD_SCORES[c.mood] <= 2);
    content.push(`On low-meal days, mood was also difficult ${lowMealDifficultMood.length} of ${lowDays.length} times (${pct(lowMealDifficultMood.length, lowDays.length)}).`);
  }

  return { title: "Food & Meal Observations", emoji: "🍽️", content };
}

function energyAndBehaviorSection(checkIns: DailyCheckIn[], childName: string): ReportSection {
  const content: string[] = [];

  const energyDays = checkIns.filter((c) => c.energy_level != null);
  if (energyDays.length) {
    const avg = mean(energyDays.map((c) => c.energy_level!));
    content.push(`Average energy level: ${avg.toFixed(1)}/5.`);
  }

  const hyperDays = checkIns.filter((c) => c.hyperactivity != null);
  if (hyperDays.length) {
    const avg = mean(hyperDays.map((c) => c.hyperactivity!));
    const highDays = hyperDays.filter((c) => c.hyperactivity! >= 4);
    content.push(`Average hyperactivity: ${avg.toFixed(1)}/5. High days (≥4/5): ${highDays.length}.`);
  }

  const repDays = checkIns.filter((c) => c.repetitive_behaviors != null);
  if (repDays.length) {
    const avg = mean(repDays.map((c) => c.repetitive_behaviors!));
    content.push(`Average repetitive behaviors: ${avg.toFixed(1)}/5.`);
  }

  if (!content.length) content.push("No energy or behavioral data recorded yet.");

  return { title: "Energy & Behavioral Patterns", emoji: "⚡", content };
}

function socialSection(checkIns: DailyCheckIn[], childName: string): ReportSection {
  const socialDays = checkIns.filter((c) => c.social_interaction != null);
  if (!socialDays.length) return { title: "Social Interactions", emoji: "👥", content: ["No social interaction data recorded."] };

  const avg = mean(socialDays.map((c) => c.social_interaction!));
  const lowDays = socialDays.filter((c) => c.social_interaction! <= 2);
  const content: string[] = [];

  content.push(`Average social interaction: ${avg.toFixed(1)}/5.`);
  content.push(`Days with low social interaction (≤2/5): ${lowDays.length} of ${socialDays.length}.`);

  return { title: "Social Interactions", emoji: "👥", content };
}

function parentWellbeingSection(checkIns: DailyCheckIn[]): ReportSection {
  const stressDays = checkIns.filter((c) => c.parent_stress != null);
  const content: string[] = [];

  if (stressDays.length) {
    const avg = mean(stressDays.map((c) => c.parent_stress!));
    const highDays = stressDays.filter((c) => c.parent_stress! >= 4);
    content.push(`Average parent stress: ${avg.toFixed(1)}/5. High stress days (≥4/5): ${highDays.length} of ${stressDays.length}.`);
  }

  const parentNotes = checkIns
    .filter((c) => c.parent_notes)
    .map((c) => `${c.date}: "${c.parent_notes}"`);
  if (parentNotes.length) {
    content.push(`Parent reflections: ${parentNotes.join("; ")}.`);
  }

  if (!content.length) content.push("No parent wellbeing data recorded.");

  return { title: "Parent Wellbeing", emoji: "🤍", content };
}

function insightSection(insights: BehavioralInsight[]): ReportSection {
  if (!insights.length) return { title: "Behavioral Insights", emoji: "🧠", content: ["No patterns detected yet."] };

  const content = insights.slice(0, 6).map(
    (i) => `${i.title} (${Math.round(i.confidence * 100)}% confidence, ${i.data_points} data points): ${i.description}`
  );

  return { title: "Detected Behavioral Patterns", emoji: "🧠", content };
}

// Utilities

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function pct(num: number, den: number): string {
  if (den === 0) return "0%";
  return `${Math.round((num / den) * 100)}%`;
}

function countBy<T>(items: T[], key: (item: T) => string): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const k = key(item);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
}

export function formatReportAsText(report: TherapistReport): string {
  let output = `${report.title}\n${"═".repeat(report.title.length)}\n\n`;
  output += `Reporting Period: ${report.period.start} to ${report.period.end} (${report.period.totalDays} days)\n`;
  output += `Child: ${report.child.name}${report.child.age ? `, age ${report.child.age}` : ""}\n`;
  output += `Generated: ${new Date(report.generatedAt).toLocaleDateString()}\n\n`;

  for (const section of report.sections) {
    output += `${section.emoji} ${section.title}\n${"─".repeat(section.title.length + 2)}\n`;
    for (const line of section.content) {
      output += `  ${line}\n`;
    }
    output += `\n`;
  }

  output += `⚠️ ${report.disclaimer}\n`;
  return output;
}

const DISCLAIMER =
  "This report is generated from parent-reported observational data only. It does not constitute a medical diagnosis, clinical assessment, or treatment recommendation. It is intended to support continuity of care by providing structured behavioral observations to qualified professionals.";
