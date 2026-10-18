/**
 * Grimoire generation is deliberately unavailable.
 *
 * The legacy orchestrator uses platform credentials without verified,
 * actor-bound entitlement, atomic reservation or a cumulative cost cap.
 * Do not parse a body or load generation dependencies at this ingress.
 * Re-enable only through the existing qualified metered-admission boundary.
 */
export const runtime = 'edge';

export async function POST(): Promise<Response> {
  return Response.json(
    {
      error: 'Grimoire generation is unavailable until metered admission is verified.',
      code: 'GRIMOIRE_GENERATION_UNAVAILABLE',
    },
    {
      status: 503,
      headers: { 'Cache-Control': 'private, no-store' },
    },
  );
}
