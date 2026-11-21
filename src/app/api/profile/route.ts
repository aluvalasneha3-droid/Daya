import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/daya/supabase";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ child: null, parentName: user.user_metadata?.display_name ?? "" });

  const { data, error } = await supabase
    .from("child_profiles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    child: data,
    parentName: user.user_metadata?.display_name ?? user.email ?? "",
  });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });

  const body = await request.json() as {
    name?: string;
    age?: number;
    date_of_birth?: string;
    gender?: string;
    diagnosis?: string;
    diagnosis_date?: string;
    diagnosed_by?: string;
    medical_conditions?: string;
    allergies?: string;
    medications?: string;
    sensitivities?: string[];
    triggers?: string[];
    routines?: string[];
    calming_strategies?: string;
    communication_style?: string;
    strengths_interests?: string;
    care_team?: string;
    report_summary?: string;
    notes?: string;
  };

  const { data: existing, error: existingError } = await supabase
    .from("child_profiles")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  const profile: Record<string, unknown> = {
    ...existing,
    id: existing?.id,
    user_id: user.id,
    name: existing?.name ?? "My child",
  };

  const textFields = [
    "date_of_birth", "gender", "diagnosis", "diagnosis_date", "diagnosed_by",
    "medical_conditions", "allergies", "medications", "calming_strategies",
    "communication_style", "strengths_interests", "care_team", "report_summary", "notes",
  ] as const;
  for (const field of textFields) {
    if (Object.hasOwn(body, field)) {
      profile[field] = body[field]?.trim() || null;
    }
  }

  for (const field of ["sensitivities", "triggers", "routines"] as const) {
    if (Object.hasOwn(body, field)) {
      profile[field] = (body[field] ?? []).map((value) => value.trim()).filter(Boolean);
    }
  }

  if (Object.hasOwn(body, "name")) {
    const name = body.name?.trim();
    if (!name) return NextResponse.json({ error: "Child name is required." }, { status: 400 });
    profile.name = name;
  }
  if (Object.hasOwn(body, "age")) {
    if (body.age !== undefined && (!Number.isInteger(body.age) || body.age < 0 || body.age > 25)) {
      return NextResponse.json({ error: "Age must be a whole number between 0 and 25." }, { status: 400 });
    }
    profile.age = body.age ?? null;
  }
  profile.updated_at = new Date().toISOString();

  const query = existing
    ? supabase.from("child_profiles").update(profile).eq("id", existing.id).eq("user_id", user.id).select("*").single()
    : supabase.from("child_profiles").insert(profile).select("*").single();

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ child: data });
}
