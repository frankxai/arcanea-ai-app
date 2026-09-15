import { NextResponse } from "next/server";
import registry from "../../data/products.graph.json";

type RegistryRow = { id: string; gate?: string };

/**
 * DEMAND-CAPTURE-STANDARD: no checkout until a product holds a release gate
 * PASS in the registry. A product absent from the registry is not released.
 */
export function isReleased(
  productId: string,
  source: { products: RegistryRow[] } = registry,
): boolean {
  const gate = source.products.find((p) => p.id === productId)?.gate;
  return typeof gate === "string" && /^PASS\b/.test(gate);
}

export function notReleasedResponse() {
  return NextResponse.json(
    {
      error: "This product is not on sale yet. Join the waitlist at /pricing.",
      code: "not_released",
    },
    { status: 403 },
  );
}
