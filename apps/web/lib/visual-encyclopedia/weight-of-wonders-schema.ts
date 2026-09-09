import { z } from "zod";

const prose = z.string().min(1);
const slug = z.string().regex(/^[a-z0-9-]+$/u);
const image = z
  .object({
    src: z.string().regex(/^\/images\/weight-of-wonders\/[a-z0-9-]+\.webp$/u),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    bytes: z.number().int().positive(),
    sha256: z.string().regex(/^[a-f0-9]{64}$/u),
    alt: prose,
  })
  .strict();
const sessionKit = z
  .object({
    prompt: prose,
    beats: z.array(prose).min(1),
  })
  .strict();
const shared = {
  canonStatus: z.literal("EXPERIMENTAL"),
  slug,
  name: prose,
  title: prose,
  summary: prose,
  history: z.array(prose).min(1),
  storySeeds: z.array(prose).min(1),
  relatedSlug: slug,
  image,
  artNote: prose,
  sessionKit,
};

export const wonderBossSchema = z
  .object({
    ...shared,
    id: z.string().regex(/^wow-b0[1-3]$/u),
    kind: z.literal("boss"),
    entrance: prose,
    bodyMovement: z.array(prose).min(1).optional(),
    encounter: z
      .object({
        objective: prose,
        phases: z
          .array(z.object({ title: prose, description: prose }).strict())
          .length(3),
        endings: z
          .array(
            z.object({ id: slug, label: prose, consequence: prose }).strict(),
          )
          .length(3),
      })
      .strict(),
  })
  .strict();

export const wonderDungeonSchema = z
  .object({
    ...shared,
    id: z.string().regex(/^wow-d0[1-3]$/u),
    kind: z.literal("dungeon"),
    place: z
      .object({
        spatialIdentity: prose,
        ecology: z.array(prose).min(1),
        routes: z.array(prose).min(1),
        discoveries: z.array(prose).min(1),
        consequence: prose,
      })
      .strict(),
  })
  .strict();

export const wonderEntrySchema = z.discriminatedUnion("kind", [
  wonderBossSchema,
  wonderDungeonSchema,
]);

export const weightOfWondersSchema = z
  .object({
    collection: z
      .object({
        id: z.literal("weight-of-wonders"),
        title: prose,
        subtitle: prose,
        canonStatus: z.literal("EXPERIMENTAL"),
        source: z.union([prose, z.record(z.string(), z.unknown())]),
        opening: prose,
        trilogy: z
          .array(z.object({ title: prose, premise: prose }).strict())
          .length(3),
      })
      .strict(),
    entries: z.array(wonderEntrySchema).length(6),
  })
  .strict()
  .superRefine(({ entries }, context) => {
    for (const key of ["id", "slug"] as const) {
      if (new Set(entries.map((entry) => entry[key])).size !== entries.length)
        context.addIssue({
          code: "custom",
          message: `Duplicate ${key} in Weight of Wonders.`,
        });
    }
    for (const entry of entries) {
      const related = entries.find((item) => item.slug === entry.relatedSlug);
      if (
        !related ||
        related.relatedSlug !== entry.slug ||
        related.kind === entry.kind
      )
        context.addIssue({
          code: "custom",
          message: `Broken reciprocal pair for ${entry.id}.`,
        });
    }
  });

export type WonderBoss = z.infer<typeof wonderBossSchema>;
export type WonderDungeon = z.infer<typeof wonderDungeonSchema>;
export type WonderEntry = z.infer<typeof wonderEntrySchema>;
export type WeightOfWonders = z.infer<typeof weightOfWondersSchema>;

export function filterWonderEntries(
  entries: WonderEntry[],
  query = "",
  kind = "all",
): WonderEntry[] {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);
  return entries.filter(
    (entry) =>
      (kind === "all" || entry.kind === kind) &&
      terms.every((term) =>
        `${entry.name} ${entry.title} ${entry.summary} ${entry.history.join(" ")} ${entry.storySeeds.join(" ")}`
          .toLocaleLowerCase()
          .includes(term),
      ),
  );
}
