import { CHARACTERS } from './characters';
import { CREATURES } from './creatures';
import { FOUNDATION_MEDIA } from './foundation-media';
import { GENERATION_OVERRIDES } from './generation-manifest';
import { KINFORMS } from './kinforms';
import { PLACES, SCENES } from './places-scenes';
import { RESONANT_COLLECTION_ENTRIES } from './resonant-collection';
import { GATES, type EntryKind, type GateName, type VisualEncyclopediaEntry } from './schema';

export const VISUAL_ENCYCLOPEDIA_ENTRIES: VisualEncyclopediaEntry[] = [
  ...RESONANT_COLLECTION_ENTRIES,
  ...KINFORMS,
  ...CHARACTERS,
  ...CREATURES,
  ...PLACES,
  ...SCENES,
]
  .map((entry) => {
    const override = GENERATION_OVERRIDES[entry.id];
    const resolved = override ? { ...entry, ...override } : entry;
    const foundationMedia = FOUNDATION_MEDIA[entry.id];
    const { blobPath, ...media } = foundationMedia
      ? { ...resolved.media, ...foundationMedia }
      : resolved.media;

    return {
      ...resolved,
      media: {
        ...media,
        deliveryKey: media.deliveryKey ?? blobPath,
      },
    };
  })
  .sort((a, b) => a.batch - b.batch || a.id.localeCompare(b.id, undefined, { numeric: true }));

export const VISUAL_BATCHES = GATES.map((gate, index) => ({
  batch: index + 1,
  gate,
  guardian: VISUAL_ENCYCLOPEDIA_ENTRIES.find((entry) => entry.gate === gate)?.guardian ?? '',
  entries: VISUAL_ENCYCLOPEDIA_ENTRIES.filter((entry) => entry.batch === index + 1),
  cadenceMinutes: 45,
}));

export const ENTRY_BY_ID = new Map(
  VISUAL_ENCYCLOPEDIA_ENTRIES.map((entry) => [entry.id, entry] as const),
);

export const ENTRY_BY_SLUG = new Map(
  VISUAL_ENCYCLOPEDIA_ENTRIES.map((entry) => [entry.slug, entry] as const),
);

export const VISUAL_GRAPH_EDGES = buildVisualGraphEdges(VISUAL_ENCYCLOPEDIA_ENTRIES);

export const ENCYCLOPEDIA_STATS = {
  total: VISUAL_ENCYCLOPEDIA_ENTRIES.length,
  byKind: countBy(VISUAL_ENCYCLOPEDIA_ENTRIES, (entry) => entry.kind),
  byGate: countBy(VISUAL_ENCYCLOPEDIA_ENTRIES, (entry) => entry.gate),
  byReviewState: countBy(VISUAL_ENCYCLOPEDIA_ENTRIES, (entry) => entry.review.state),
  graphEdges: VISUAL_GRAPH_EDGES.length,
};

export const CINEMA_USE_MAP = VISUAL_BATCHES.map((batch) => ({
  chapter: batch.batch,
  gate: batch.gate,
  guardian: batch.guardian,
  primaryScene: batch.entries.find((entry) => entry.kind === 'scene')?.id ?? null,
  environments: batch.entries.filter((entry) => entry.kind === 'place').map((entry) => entry.id),
  cast: batch.entries
    .filter((entry) => entry.kind === 'kinform' || entry.kind === 'character' || entry.kind === 'creature')
    .map((entry) => entry.id),
  beats: batch.entries.map((entry) => ({ id: entry.id, use: entry.cinemaUse })),
}));

function countBy<T extends string>(
  entries: VisualEncyclopediaEntry[],
  read: (entry: VisualEncyclopediaEntry) => T,
): Record<T, number> {
  return entries.reduce((counts, entry) => {
    const key = read(entry);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

function buildVisualGraphEdges(entries: VisualEncyclopediaEntry[]) {
  const seen = new Set<string>();

  return entries.flatMap((entry) =>
    entry.relationships.flatMap((relationship) => {
      const [source, target] = [entry.id, relationship].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      );
      const key = `${source}::${target}`;
      if (source === target || seen.has(key)) return [];
      seen.add(key);
      return [{ source, target, relation: 'story-use' as const }];
    }),
  );
}

export function getEntriesByGate(gate: GateName): VisualEncyclopediaEntry[] {
  return VISUAL_ENCYCLOPEDIA_ENTRIES.filter((entry) => entry.gate === gate);
}

export function getEntriesByKind(kind: EntryKind): VisualEncyclopediaEntry[] {
  return VISUAL_ENCYCLOPEDIA_ENTRIES.filter((entry) => entry.kind === kind);
}

export function validateVisualCatalog(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  if (VISUAL_ENCYCLOPEDIA_ENTRIES.length !== 130) {
    errors.push(`Expected 130 entries (30 foundation + 100 new), found ${VISUAL_ENCYCLOPEDIA_ENTRIES.length}.`);
  }

  const expectedKinds: Record<EntryKind, number> = {
    kinform: 42,
    character: 28,
    creature: 25,
    place: 15,
    scene: 20,
  };

  for (const [kind, expected] of Object.entries(expectedKinds) as Array<[EntryKind, number]>) {
    const actual = VISUAL_ENCYCLOPEDIA_ENTRIES.filter((entry) => entry.kind === kind).length;
    if (actual !== expected) errors.push(`Expected ${expected} ${kind} entries, found ${actual}.`);
  }

  for (const batch of VISUAL_BATCHES) {
    if (batch.entries.length !== 10) {
      errors.push(`Batch ${batch.batch} (${batch.gate}) has ${batch.entries.length} entries instead of 10.`);
    }
  }

  for (const entry of VISUAL_ENCYCLOPEDIA_ENTRIES) {
    if (ids.has(entry.id)) errors.push(`Duplicate id: ${entry.id}.`);
    if (slugs.has(entry.slug)) errors.push(`Duplicate slug: ${entry.slug}.`);
    ids.add(entry.id);
    slugs.add(entry.slug);

    if (
      entry.media.status !== 'generated' ||
      !entry.media.sha256?.match(/^[a-f0-9]{64}$/u) ||
      !entry.media.width ||
      !entry.media.height ||
      entry.media.mimeType !== 'image/png'
    ) {
      errors.push(`${entry.id} is missing its generated-master checksum or PNG dimensions.`);
    }

    if (entry.canon.state !== 'proposal') {
      errors.push(`${entry.id} is ${entry.canon.state}; generated additions must remain proposal state.`);
    }

    for (const relationship of entry.relationships) {
      if (!ENTRY_BY_ID.has(relationship)) {
        errors.push(`${entry.id} links to unknown entry ${relationship}.`);
      }
    }
  }

  return errors;
}
