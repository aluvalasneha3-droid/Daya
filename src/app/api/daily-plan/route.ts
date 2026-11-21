import { loadDayaContext } from "@/lib/daya/repository";
import { generateDailyPlan } from "@/lib/daya/daily-plan";
import { generateFoodPlan } from "@/lib/daya/food-planner";
import { computeBehavioralWeights } from "@/lib/daya/behavioral-weights";
import { detectRoutineChanges } from "@/lib/daya/routine-detector";
import { getAuthenticatedUser } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authenticatedUser = await getAuthenticatedUser(request);
  if (!authenticatedUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const userId = authenticatedUser.id;
  const childId = url.searchParams.get("childId") ?? undefined;

  const context = await loadDayaContext({ userId, childId });

  const routinePlan = generateDailyPlan({
    child: context.child,
    checkIns: context.recentCheckIns,
    insights: context.insights,
    intent: "planning_request",
  });

  const foodPlan = generateFoodPlan({
    child: context.child,
    checkIns: context.recentCheckIns,
    insights: context.insights,
  });

  const behavioralWeights = computeBehavioralWeights(
    context.recentCheckIns,
    context.insights
  );
  const routineChanges = detectRoutineChanges(
    context.recentCheckIns,
    context.insights
  );

  return Response.json({
    routinePlan,
    foodPlan,
    behavioralWeights,
    routineChanges,
    child: context.child ? { name: context.child.name, age: context.child.age } : null,
    checkInCount: context.recentCheckIns.length,
  });
}
