"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getAuthClient() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  client = createBrowserClient(url, anonKey);
  return client;
}

export async function getAccessToken() {
  const auth = getAuthClient();
  if (!auth) return null;
  const { data } = await auth.auth.getSession();
  return data.session?.access_token ?? null;
}
