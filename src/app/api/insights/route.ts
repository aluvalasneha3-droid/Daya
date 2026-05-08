import { MOCK_CHECKINS, MOCK_CHILD } from "@/lib/mock-data";
import { analyzePatterns } from "@/lib/insights";

export async function GET() {
  const insights = analyzePatterns(MOCK_CHECKINS, MOCK_CHILD.id);
  return Response.json(insights);
}
