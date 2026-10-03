import metadata from "./sovereign-depths/metadata.json";
import bossesA from "./sovereign-depths/bosses-a.json";
import bossesB from "./sovereign-depths/bosses-b.json";
import dungeons from "./sovereign-depths/dungeons.json";
import {
  collectionEntries,
  sovereignCollectionSchema,
} from "./sovereign-depths-schema";

export const SOVEREIGN_DEPTHS = sovereignCollectionSchema.parse({
  ...metadata,
  bosses: [...bossesA, ...bossesB],
  dungeons,
});
export const SOVEREIGN_ENTRIES = collectionEntries(SOVEREIGN_DEPTHS);
export const SOVEREIGN_BY_SLUG = new Map(
  SOVEREIGN_ENTRIES.map((entry) => [entry.slug, entry]),
);
export const SOVEREIGN_BY_ID = new Map(
  SOVEREIGN_ENTRIES.map((entry) => [entry.id, entry]),
);
