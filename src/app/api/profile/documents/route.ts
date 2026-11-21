import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/daya/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bucket = "child-reports";
const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
const maxFileSize = 10 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });

  const { data: child, error: childError } = await supabase
    .from("child_profiles")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (childError) return NextResponse.json({ error: childError.message }, { status: 500 });
  if (!child) return NextResponse.json({ documents: [] });

  const { data, error } = await supabase
    .from("child_documents")
    .select("id, child_id, file_name, mime_type, file_size, category, created_at, storage_path")
    .eq("user_id", user.id)
    .eq("child_id", child.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const documents = [];
  for (const document of data ?? []) {
    const { data: signed, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(document.storage_path, 60);
    if (signedError) return NextResponse.json({ error: signedError.message }, { status: 500 });
    documents.push({ ...document, url: signed.signedUrl });
  }

  return NextResponse.json({ documents });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a report file to upload." }, { status: 400 });
  }
  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Only PDF, JPEG, and PNG reports are supported." }, { status: 400 });
  }
  if (file.size <= 0 || file.size > maxFileSize) {
    return NextResponse.json({ error: "The file must be smaller than 10 MB." }, { status: 400 });
  }

  const { data: child, error: childError } = await supabase
    .from("child_profiles")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (childError) return NextResponse.json({ error: childError.message }, { status: 500 });
  if (!child) {
    return NextResponse.json({ error: "Save a child profile before uploading reports." }, { status: 400 });
  }

  const safeFileName = file.name.replace(/[^\w.-]+/g, "_").slice(0, 120) || "report";
  const storagePath = `${user.id}/${child.id}/${crypto.randomUUID()}-${safeFileName}`;
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data, error } = await supabase
    .from("child_documents")
    .insert({
      user_id: user.id,
      child_id: child.id,
      file_name: file.name.slice(0, 255),
      storage_path: storagePath,
      mime_type: file.type,
      file_size: file.size,
      category: "medical_report",
    })
    .select("id, child_id, file_name, mime_type, file_size, category, created_at")
    .single();

  if (error) {
    const { error: cleanupError } = await supabase.storage.from(bucket).remove([storagePath]);
    if (cleanupError) console.error("Could not remove report after metadata save failed", cleanupError);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ document: data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });

  const { id } = await request.json() as { id?: string };
  if (!id) return NextResponse.json({ error: "Document id is required." }, { status: 400 });

  const { data: document, error: fetchError } = await supabase
    .from("child_documents")
    .select("id, storage_path")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (!document) return NextResponse.json({ error: "Report not found." }, { status: 404 });

  const { error: storageError } = await supabase.storage.from(bucket).remove([document.storage_path]);
  if (storageError) return NextResponse.json({ error: storageError.message }, { status: 500 });

  const { error } = await supabase
    .from("child_documents")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
