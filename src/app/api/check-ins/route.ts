import type { DailyCheckIn, MoodValue } from "@/types";
import { analyzeBehaviorPatterns, summarizeCheckIn } from "@/lib/daya/insights";
import {
  loadDayaContext,
  persistInsights,
  saveDailyCheckIn,
} from "@/lib/daya/repository";
import { retrieveSupportSnippets } from "@/lib/daya/support";
import { computeBehavioralWeights } from "@/lib/daya/behavioral-weights";
import { detectRoutineChanges } from "@/lib/daya/routine-detector";
import { generateDailyPlan } from "@/lib/daya/daily-plan";
import { generateFoodPlan } from "@/lib/daya/food-planner";
import { getAuthenticatedUser } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckInBody = {
  userId?: string;
  childId?: string;
  date?: string;
  sleep_quality?: number;
  sleep_hours?: number;
  meal_quality?: number;
  mood?: MoodValue;
  meltdowns?: number;
  meltdown_triggers?: string;
  communication_level?: number;
  routine_adherence?: number;
  sensory_load?: number;
  sensory_issues?: string;
  difficult_period?: DailyCheckIn["difficult_period"];
  energy_level?: number;
  hyperactivity?: number;
  social_interaction?: number;
  repetitive_behaviors?: number;
  activities?: string;
  parent_stress?: number;
  parent_notes?: string;
  notes?: string;
};

export async function POST(request: Request) {
  const authenticatedUser = await getAuthenticatedUser(request);
  if (!authenticatedUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as CheckInBody;
  const userId = authenticatedUser.id;
  let existingContext;
  try {
    existingContext = await loadDayaContext({ userId, childId: body.childId });
  } catch (error) {
    console.error("Could not load family data before check-in", error);
    return Response.json({ error: "Could not load your saved family data." }, { status: 500 });
  }
  const childId = body.childId ?? existingContext.child?.id;
  if (!childId) {
    return Response.json(
      { error: "Create a child profile before logging a check-in." },
      { status: 400 }
    );
  }

  let checkIn: DailyCheckIn;
  try {
    checkIn = await saveDailyCheckIn({
      user_id: userId,
      child_id: childId,
      date: body.date ?? new Date().toISOString().slice(0, 10),
      sleep_quality: toScale(body.sleep_quality, 3),
      sleep_hours: body.sleep_hours,
      meal_quality: toScale(body.meal_quality, 3),
      mood: normalizeMood(body.mood),
      meltdowns: Math.max(0, Number(body.meltdowns ?? 0)),
      meltdown_triggers: cleanOptional(body.meltdown_triggers),
      communication_level: toScale(body.communication_level, 3),
      routine_adherence: toScale(body.routine_adherence, 3),
      sensory_load: toScale(body.sensory_load, 3),
      sensory_issues: cleanOptional(body.sensory_issues),
      difficult_period: body.difficult_period ?? "none",
      energy_level: toScale(body.energy_level, 3),
      hyperactivity: toScale(body.hyperactivity, 3),
      social_interaction: toScale(body.social_interaction, 3),
      repetitive_behaviors: toScale(body.repetitive_behaviors, 2),
      activities: cleanOptional(body.activities),
      parent_stress: toScale(body.parent_stress, 3),
      parent_notes: cleanOptional(body.parent_notes),
      notes: cleanOptional(body.notes),
    });
  } catch (error) {
    console.error("Could not save family check-in", error);
    return Response.json({ error: "Your check-in could not be saved. Please try again." }, { status: 500 });
  }

  let context;
  try {
    context = await loadDayaContext({ userId, childId });
  } catch (error) {
    console.error("Check-in was saved, but family context could not be refreshed", error);
    return Response.json({
      error: "Your check-in was saved, but the dashboard data could not be refreshed. Reload and try again.",
    }, { status: 500 });
  }
  const checkIns = mergeCheckIns(context.recentCheckIns, checkIn);
  const insights = analyzeBehaviorPatterns(checkIns, childId);
  await persistInsights(insights);

  const supportSnippets = await retrieveSupportSnippets({
    query: summarizeCheckIn(checkIn, context.child?.name),
    checkIns,
    insights,
  });

  const behavioralWeights = computeBehavioralWeights(checkIns, insights);
  const routineChanges = detectRoutineChanges(checkIns, insights);

  const updatedPlan = generateDailyPlan({
    child: context.child,
    checkIns,
    insights,
    intent: "planning_request",
  });

  const updatedFoodPlan = generateFoodPlan({
    child: context.child,
    checkIns,
    insights,
  });

  return Response.json({
    checkIn,
    insights,
    supportSnippets,
    behavioralWeights,
    routineChanges,
    updatedPlan,
    updatedFoodPlan,
    summaryPrompt: `Daily check-in logged: ${summarizeCheckIn(
      checkIn,
      context.child?.name
    )}`,
  });
}

function toScale(value: number | undefined, fallback: number) {
  const number = Math.round(Number(value ?? fallback));
  return Math.min(5, Math.max(1, number)) as 1 | 2 | 3 | 4 | 5;
}

function normalizeMood(value: MoodValue | undefined): MoodValue {
  const allowed: MoodValue[] = ["great", "good", "okay", "difficult", "very_difficult"];
  return value && allowed.includes(value) ? value : "okay";
}

function cleanOptional(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 1200) : undefined;
}

function mergeCheckIns(checkIns: DailyCheckIn[], checkIn: DailyCheckIn) {
  const byDate = new Map(checkIns.map((item) => [item.date, item]));
  byDate.set(checkIn.date, checkIn);
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}
