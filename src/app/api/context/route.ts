import { loadDayaContext } from "@/lib/daya/repository";
import { retrieveSupportSnippets } from "@/lib/daya/support";
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
  const conversationId = url.searchParams.get("conversationId") ?? undefined;
  try {
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
  } catch (error) {
    console.error("Failed to load dashboard context", error);
    return Response.json({ error: "Could not load your saved family data." }, { status: 500 });
  }
}
