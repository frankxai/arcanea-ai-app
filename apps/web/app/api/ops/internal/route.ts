import { NextResponse } from "next/server";
import internalOpsDashboard from "@/lib/ops/internal-dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await internalOpsDashboard.getInternalOpsDashboardData();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal ops route failed",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
