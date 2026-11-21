import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getAuthenticatedUser(request?: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const bearer = request?.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (bearer) {
    const client = createServerClient(url, anonKey, {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    });
    const { data } = await client.auth.getUser(bearer);
    return data.user;
  }

  const cookieStore = await cookies();
  const client = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
  const { data } = await client.auth.getUser();
  return data.user;
}
