import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { loadDayaContext } from "@/lib/daya/repository";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const context = await loadDayaContext({ userId: user.id });
  return Response.json(context.recentCheckIns);
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const checkInsResponse = await fetch(new URL("/api/check-ins", req.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.get("authorization") ?? "",
    },
    body: JSON.stringify(await req.json()),
  });
  return checkInsResponse;
}
