import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

// Operator tools require a separately reviewed authentication and host boundary.
export async function POST(_request: Request) {
  void _request;
  return NextResponse.json(
    {
      ok: false,
      error: "Operator tools are unavailable on this public endpoint.",
    },
    { status: 403, headers: { "Cache-Control": "private, no-store" } },
  );
}
