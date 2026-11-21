import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/daya/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const periods = ["morning", "afternoon", "evening", "night"] as const;
const maxTasksPerPeriod = 50;

type PlanTask = {
  id: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
};

type PlanSection = {
  period: (typeof periods)[number];
  items: PlanTask[];
};

function isPlanDate(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function normalizeSections(value: unknown): PlanSection[] | null {
  if (!Array.isArray(value) || value.length !== periods.length) return null;

  const byPeriod = new Map<string, unknown>();
  for (const section of value) {
    if (!section || typeof section !== "object" || !("period" in section)) return null;
    byPeriod.set(String(section.period), section);
  }

  const sections: PlanSection[] = [];
  for (const period of periods) {
    const section = byPeriod.get(period);
    if (!section || typeof section !== "object" || !("items" in section) || !Array.isArray(section.items)) {
      return null;
    }
    if (section.items.length > maxTasksPerPeriod) return null;

    const items: PlanTask[] = [];
    for (const item of section.items) {
      if (!item || typeof item !== "object") return null;
      const task = item as Record<string, unknown>;
      if (
        typeof task.id !== "string" ||
        typeof task.title !== "string" ||
        typeof task.description !== "string" ||
        typeof task.time !== "string" ||
        typeof task.completed !== "boolean"
      ) {
        return null;
      }

      const title = task.title.trim();
      const description = task.description.trim();
      const time = task.time.trim();
      if (
        !title ||
        title.length > 120 ||
        description.length > 2000 ||
        (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
      ) {
        return null;
      }

      items.push({
        id: task.id.slice(0, 80),
        title,
        description,
        time,
        completed: task.completed,
      });
    }
    sections.push({ period, items });
  }

  return sections;
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const planDate = request.nextUrl.searchParams.get("date");
  if (!isPlanDate(planDate)) {
    return NextResponse.json({ error: "A valid plan date is required." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });

  const { data: child, error: childError } = await supabase
    .from("child_profiles")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (childError) return NextResponse.json({ error: childError.message }, { status: 500 });
  if (!child) return NextResponse.json({ error: "Create a child profile before planning." }, { status: 404 });

  const { data, error } = await supabase
    .from("user_daily_plans")
    .select("sections")
    .eq("user_id", user.id)
    .eq("child_id", child.id)
    .eq("plan_date", planDate)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sections = data ? normalizeSections(data.sections) : null;
  if (data && !sections) {
    return NextResponse.json({ error: "The saved plan has an invalid format." }, { status: 500 });
  }

  return NextResponse.json({
    planDate,
    sections: sections ?? periods.map((period) => ({ period, items: [] })),
  });
}

export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { date?: unknown; sections?: unknown };
  try {
    body = (await request.json()) as { date?: unknown; sections?: unknown };
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (typeof body.date !== "string" || !isPlanDate(body.date)) {
    return NextResponse.json({ error: "A valid plan date is required." }, { status: 400 });
  }
  const sections = normalizeSections(body.sections);
  if (!sections) {
    return NextResponse.json({ error: "Plan activities are invalid. Review the titles, times, and descriptions." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });

  const { data: child, error: childError } = await supabase
    .from("child_profiles")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (childError) return NextResponse.json({ error: childError.message }, { status: 500 });
  if (!child) return NextResponse.json({ error: "Create a child profile before planning." }, { status: 404 });

  const { data, error } = await supabase
    .from("user_daily_plans")
    .upsert(
      {
        user_id: user.id,
        child_id: child.id,
        plan_date: body.date,
        sections,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,child_id,plan_date" }
    )
    .select("sections")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ planDate: body.date, sections: data.sections });
}
