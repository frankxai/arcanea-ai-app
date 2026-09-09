import source from "./sovereign-depths.json";
import {
  collectionEntries,
  sovereignCollectionSchema,
} from "./sovereign-depths-schema";

export const SOVEREIGN_DEPTHS = sovereignCollectionSchema.parse(source);
export const SOVEREIGN_ENTRIES = collectionEntries(SOVEREIGN_DEPTHS);
export const SOVEREIGN_BY_SLUG = new Map(
  SOVEREIGN_ENTRIES.map((entry) => [entry.slug, entry]),
);
export const SOVEREIGN_BY_ID = new Map(
  SOVEREIGN_ENTRIES.map((entry) => [entry.id, entry]),
);
