import { NextResponse } from "next/server";

/** A debit without a durable generation receipt cannot authorize paid work. */
export async function POST() {
  return NextResponse.json(
    {
      error: "Start generation through Imagine with a stable request key.",
      reason: "legacy_spend_retired",
    },
    { status: 410, headers: { "Cache-Control": "private, no-store" } },
  );
}
