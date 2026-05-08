import { DEMO_USER_ID, loadDayaContext } from "@/lib/daya/repository";
import { generateTherapistReport, formatReportAsText } from "@/lib/daya/report";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") ?? DEMO_USER_ID;
  const childId = url.searchParams.get("childId") ?? undefined;
  const format = url.searchParams.get("format") ?? "json";

  const context = await loadDayaContext({ userId, childId });

  const report = generateTherapistReport({
    child: context.child,
    checkIns: context.recentCheckIns,
    insights: context.insights,
  });

  if (format === "text") {
    return new Response(formatReportAsText(report), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return Response.json(report);
}
