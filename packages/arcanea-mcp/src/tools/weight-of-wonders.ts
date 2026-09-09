import { z } from "zod";

export const weightOfWondersQuerySchema = z.object({
  includeExperimental: z.boolean().default(false),
  includeProposals: z.boolean().default(false),
  kind: z.enum(["all", "boss", "dungeon"]).default("all"),
  query: z.string().max(160).default(""),
  id: z
    .string()
    .regex(/^wow-[bd]0[1-3]$/u)
    .optional(),
});

const emptyResult = {
  canonStatus: "EXPERIMENTAL",
  total: 0,
  entries: [],
  notice:
    "Weight of Wonders contains experimental proposals. Set both includeProposals=true and includeExperimental=true to retrieve them; never treat these as locked canon.",
};

/** Reads the public collection without accepting a caller-controlled origin. */
export async function searchWeightOfWonders(
  input: z.input<typeof weightOfWondersQuerySchema>,
) {
  const args = weightOfWondersQuerySchema.parse(input);
  if (!args.includeProposals || !args.includeExperimental)
    return {
      content: [{ type: "text" as const, text: JSON.stringify(emptyResult) }],
    };

  const url = new URL("https://www.arcanea.ai/api/lore/weight-of-wonders");
  url.searchParams.set("includeProposals", "true");
  url.searchParams.set("includeExperimental", "true");
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
        collectionId: z.literal("weight-of-wonders"),
        canonStatus: z.literal("EXPERIMENTAL"),
        includeProposals: z.literal(true),
        includeExperimental: z.literal(true),
        trilogy: z.array(z.unknown()).max(3).default([]),
        total: z.number().int().min(0).max(6),
        entries: z
          .array(
            z
              .object({
                id: z.string().regex(/^wow-[bd]0[1-3]$/u),
                kind: z.enum(["boss", "dungeon"]),
                canonStatus: z.literal("EXPERIMENTAL"),
              })
              .passthrough(),
          )
          .max(6),
      })
      .passthrough()
      .parse(payload);
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
            canonStatus: "EXPERIMENTAL",
          }),
        },
      ],
    };
  }
}
