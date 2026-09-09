import data from "./weight-of-wonders.json";
import { weightOfWondersSchema } from "./weight-of-wonders-schema";

export const WEIGHT_OF_WONDERS = weightOfWondersSchema.parse(data);
export const WONDER_ENTRIES = WEIGHT_OF_WONDERS.entries;
export const WONDER_BY_SLUG = new Map(
  WONDER_ENTRIES.map((entry) => [entry.slug, entry]),
);
