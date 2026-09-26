import { joinWaitlist } from "@/lib/waitlist/join";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  const { status, body: out, headers } = await joinWaitlist(body, req);
  return Response.json(out, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}
