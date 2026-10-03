import { z } from "zod";

export const sovereignDepthsQuerySchema = z.object({
  includeExperimental: z.boolean().default(false),
  includeProposals: z.boolean().default(false),
  kind: z.enum(["all", "boss", "dungeon"]).default("all"),
  query: z.string().max(160).default(""),
  id: z
    .string()
    .regex(/^[bd]\d{2}$/u)
    .optional(),
});

/** Read the published collection without accessing creator-private world state. */
export async function searchSovereignDepths(
  input: z.input<typeof sovereignDepthsQuerySchema>,
) {
  const args = sovereignDepthsQuerySchema.parse(input);
  if (!args.includeProposals) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            canonStatus: "STAGING",
            total: 0,
            entries: [],
            notice:
              "Sovereign Depths contains proposals. Set includeProposals=true explicitly to retrieve them; never treat these as locked canon.",
          }),
        },
      ],
    };
  }
  const url = new URL("https://www.arcanea.ai/api/lore/sovereign-depths");
  url.searchParams.set("includeProposals", "true");
  url.searchParams.set("includeExperimental", String(args.includeExperimental));
  url.searchParams.set("kind", args.kind);
  url.searchParams.set("query", args.query);
  if (args.id) url.searchParams.set("id", args.id);
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (!response.ok)
      throw new Error(`Collection returned HTTP ${response.status}.`);
    const payload: unknown = await response.json();
    const verified = z
      .object({
        schemaVersion: z.literal("arcanea.public-collection.v1"),
        collectionId: z.literal("sovereign-depths"),
        canonStatus: z.literal("STAGING"),
        includeProposals: z.literal(true),
        includeExperimental: z.boolean(),
        series: z
          .array(
            z
              .object({
                canonStatus: z.enum(["STAGING", "EXPERIMENTAL"]),
                books: z.array(
                  z
                    .object({
                      canonStatus: z.enum(["STAGING", "EXPERIMENTAL"]),
                    })
                    .passthrough(),
                ),
              })
              .passthrough(),
          )
          .max(4)
          .default([]),
        factions: z
          .array(
            z
              .object({ canonStatus: z.enum(["STAGING", "EXPERIMENTAL"]) })
              .passthrough(),
          )
          .default([]),
        total: z.number().int().min(0).max(36),
        entries: z
          .array(
            z
              .object({
                id: z.string(),
                kind: z.enum(["boss", "dungeon"]),
                canonStatus: z.enum(["STAGING", "EXPERIMENTAL"]),
                story: z
                  .object({ canonStatus: z.enum(["STAGING", "EXPERIMENTAL"]) })
                  .passthrough(),
              })
              .passthrough(),
          )
          .max(36),
      })
      .passthrough()
      .parse(payload);
    if (
      verified.includeExperimental !== args.includeExperimental ||
      (!args.includeExperimental && containsExperimental(verified))
    )
      throw new Error("Experimental retrieval requires explicit opt-in.");
    if (verified.total !== verified.entries.length)
      throw new Error("Collection count mismatch.");
    return {
      content: [{ type: "text" as const, text: JSON.stringify(verified) }],
    };
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            error:
              error instanceof Error
                ? error.message
                : "Collection unavailable.",
            canonStatus: "STAGING",
          }),
        },
      ],
    };
  }
}

function containsExperimental(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if ("canonStatus" in value && value.canonStatus === "EXPERIMENTAL")
    return true;
  return Object.values(value).some(containsExperimental);
}
