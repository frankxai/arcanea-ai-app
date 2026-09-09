import { z } from "zod";

const prose = z.string().min(1);
const canonStatus = z.enum(["STAGING", "EXPERIMENTAL"]);
const story = z
  .object({
    series: prose,
    book: prose,
    role: prose,
    canonStatus,
  })
  .passthrough();
const image = z
  .object({
    src: z.string().regex(/^\/images\/sovereign-depths\/[a-z0-9-]+\.webp$/u),
    alt: prose,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    promptId: prose,
  })
  .passthrough();
const shared = {
  canonStatus,
  id: prose,
  slug: z.string().regex(/^[a-z0-9-]+$/u),
  name: prose,
  title: prose,
  summary: prose,
  history: prose,
  story,
  image,
};

export const sovereignBossSchema = z
  .object({
    ...shared,
    id: z.string().regex(/^b(?:0[1-9]|1\d|2[0-4])$/u),
    dungeonId: prose,
    faction: prose,
    ecology: prose,
    rivalry: prose,
    anatomy: prose,
    materials: prose,
    movement: prose,
    entrance: prose,
    encounter: z
      .object({
        objective: prose,
        arena: prose,
        phases: z
          .array(
            z
              .object({
                name: prose,
                trigger: prose,
                action: prose,
                counterplay: prose,
              })
              .passthrough(),
          )
          .min(2),
        failure: prose,
        aftermath: prose,
      })
      .passthrough(),
  })
  .passthrough();

export const sovereignDungeonSchema = z
  .object({
    ...shared,
    id: z.string().regex(/^d(?:0[1-9]|1[0-2])$/u),
    region: prose,
    spatialIdentity: prose,
    mythology: z
      .object({
        publicStory: prose,
        counterStory: prose,
        observableEvidence: prose,
        unresolved: prose,
        canonStatus,
      })
      .passthrough()
      .optional(),
    inhabitants: z.array(prose).min(1),
    discoveries: z.array(prose).min(1),
    traversal: prose,
    bossIds: z.array(prose).length(2),
  })
  .passthrough();

export const sovereignCollectionSchema = z
  .object({
    schemaVersion: z.literal("1.0"),
    id: z.literal("sovereign-depths"),
    title: prose,
    subtitle: prose,
    description: prose,
    canonStatus: z.literal("STAGING"),
    source: z
      .object({ repository: prose, commit: prose, createdAt: prose })
      .passthrough(),
    series: z
      .array(
        z
          .object({
            id: prose,
            title: prose,
            continuity: prose,
            premise: prose,
            canonStatus,
            books: z
              .array(
                z
                  .object({
                    id: prose,
                    title: prose,
                    premise: prose,
                    canonStatus,
                    dungeonIds: z.array(prose),
                  })
                  .passthrough(),
              )
              .length(3),
          })
          .passthrough(),
      )
      .length(4),
    factions: z.array(
      z
        .object({
          id: prose,
          name: prose,
          purpose: prose,
          resource: prose,
          internalConflict: prose,
          canonStatus,
          associatedDungeons: z.array(prose),
        })
        .passthrough(),
    ),
    bosses: z.array(sovereignBossSchema).length(24),
    dungeons: z.array(sovereignDungeonSchema).length(12),
  })
  .passthrough()
  .superRefine((collection, context) => {
    const all = [...collection.bosses, ...collection.dungeons];
    for (const key of ["id", "slug"] as const) {
      if (new Set(all.map((entry) => entry[key])).size !== all.length) {
        context.addIssue({
          code: "custom",
          message: `Duplicate ${key} in Sovereign Depths.`,
        });
      }
    }
    for (const dungeon of collection.dungeons) {
      for (const id of dungeon.bossIds) {
        const boss = collection.bosses.find((entry) => entry.id === id);
        if (!boss || boss.dungeonId !== dungeon.id)
          context.addIssue({
            code: "custom",
            message: `Broken dungeon relationship: ${dungeon.id}/${id}.`,
          });
      }
    }
    for (const boss of collection.bosses) {
      if (
        !collection.dungeons.some(
          (dungeon) =>
            dungeon.id === boss.dungeonId && dungeon.bossIds.includes(boss.id),
        )
      ) {
        context.addIssue({
          code: "custom",
          message: `Orphan boss: ${boss.id}.`,
        });
      }
    }
  });

export type SovereignBoss = z.infer<typeof sovereignBossSchema>;
export type SovereignDungeon = z.infer<typeof sovereignDungeonSchema>;
export type SovereignCollection = z.infer<typeof sovereignCollectionSchema>;
export type SovereignEntry =
  (SovereignBoss & { kind: "boss" }) | (SovereignDungeon & { kind: "dungeon" });

export function collectionEntries(
  collection: SovereignCollection,
): SovereignEntry[] {
  return [
    ...collection.bosses.map((boss) => ({ ...boss, kind: "boss" as const })),
    ...collection.dungeons.map((dungeon) => ({
      ...dungeon,
      kind: "dungeon" as const,
    })),
  ];
}

export function filterSovereignEntries(
  entries: SovereignEntry[],
  query = "",
  kind = "all",
): SovereignEntry[] {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);
  return entries.filter(
    (entry) =>
      (kind === "all" || entry.kind === kind) &&
      terms.every((term) =>
        `${entry.name} ${entry.title} ${entry.summary} ${entry.history} ${entry.story.series} ${entry.story.book} ${entry.kind === "boss" ? entry.faction : entry.region}`
          .toLocaleLowerCase()
          .includes(term),
      ),
  );
}

/** Status inheritance is default-deny, including future nested claim objects. */
export function containsExperimental(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if ("canonStatus" in value && value.canonStatus === "EXPERIMENTAL")
    return true;
  return Object.values(value).some(containsExperimental);
}
