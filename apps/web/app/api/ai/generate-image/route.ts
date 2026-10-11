import { NextRequest, NextResponse } from "next/server";
import { POST as generate } from "../../imagine/generate/route";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Compatibility path shares authentication, catalog and operation ledger. */
export async function POST(request: NextRequest) {
  return generate(request);
}

export async function GET() {
  return NextResponse.json({
    status: "account-credit-reservation-required",
    endpoint: "/api/imagine/generate",
    operations: ["generate"],
    requestKeyRequired: true,
  });
}
