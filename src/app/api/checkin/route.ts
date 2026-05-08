import { NextRequest } from "next/server";
import { MOCK_CHECKINS } from "@/lib/mock-data";
import type { DailyCheckIn } from "@/types";

const checkIns = [...MOCK_CHECKINS];

export async function GET() {
  return Response.json(checkIns);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newCheckIn: DailyCheckIn = {
    id: crypto.randomUUID(),
    child_id: "child-001",
    date: body.date || new Date().toISOString().split("T")[0],
    sleep_quality: body.sleep_quality,
    sleep_hours: body.sleep_hours,
    meal_quality: body.meal_quality,
    mood: body.mood,
    meltdowns: body.meltdowns || 0,
    meltdown_triggers: body.meltdown_triggers,
    communication_level: body.communication_level,
    routine_adherence: body.routine_adherence,
    sensory_load: body.sensory_load,
    sensory_issues: body.sensory_issues,
    difficult_period: body.difficult_period ?? "none",
    notes: body.notes,
    created_at: new Date().toISOString(),
  };

  checkIns.push(newCheckIn);
  return Response.json(newCheckIn, { status: 201 });
}
