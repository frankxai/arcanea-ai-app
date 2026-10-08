import { handleCheckoutRequest } from "@/lib/shop/checkout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleCheckoutRequest(request, process.env);
}
