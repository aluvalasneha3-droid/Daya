import { DEMO_USER_ID, loadDayaContext } from "@/lib/daya/repository";
import { retrieveSupportSnippets } from "@/lib/daya/support";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") ?? DEMO_USER_ID;
  const childId = url.searchParams.get("childId") ?? undefined;
  const conversationId = url.searchParams.get("conversationId") ?? undefined;
  const context = await loadDayaContext({ userId, childId, conversationId });
  const supportSnippets = await retrieveSupportSnippets({
    query: "recent sleep sensory routine mood communication support",
    checkIns: context.recentCheckIns,
    insights: context.insights,
  });

  return Response.json({
    ...context,
    supportSnippets,
  });
}
