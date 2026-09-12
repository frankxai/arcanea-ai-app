import data from "./weight-of-wonders.json";
import extensionEntries from "../../../../docs/worldbuilding/weight-of-wonders/living-crucibles-entries.json";
import { weightOfWondersSchema } from "./weight-of-wonders-schema";

export const WEIGHT_OF_WONDERS = weightOfWondersSchema.parse({
  collection: {
    ...data.collection,
    source: {
      foundation: data.collection.source,
      extension: "docs/worldbuilding/weight-of-wonders/living-crucibles.md",
    },
  },
  entries: [...data.entries, ...extensionEntries],
});
export const WONDER_ENTRIES = WEIGHT_OF_WONDERS.entries;
export const WONDER_BY_SLUG = new Map(
  WONDER_ENTRIES.map((entry) => [entry.slug, entry]),
);
