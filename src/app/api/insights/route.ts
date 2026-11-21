import { getAuthenticatedUser } from "@/lib/auth-server";
import { loadDayaContext } from "@/lib/daya/repository";
import { analyzeBehaviorPatterns } from "@/lib/daya/insights";

export async function GET(request: Request) {
  const authenticatedUser = await getAuthenticatedUser(request);
  if (!authenticatedUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const context = await loadDayaContext({ userId: authenticatedUser.id });
  const childId = context.child?.id ?? "no-child";
  const insights = analyzeBehaviorPatterns(context.recentCheckIns, childId);
  return Response.json(insights);
}
