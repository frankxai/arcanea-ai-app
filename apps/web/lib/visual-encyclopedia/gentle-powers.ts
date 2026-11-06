import collection from "../../data/gentle-powers/collection.json";

type SourceEntry = (typeof collection.entries)[number];
export type GentleAsset = Omit<NonNullable<SourceEntry["asset"]>, "url"> & {
  url: string | null;
  approval?: {
    reviewer: string;
    authorizationRef: string;
    masterSha256: string;
    renditionSha256: string;
  };
};
export type GentleEntry = Omit<SourceEntry, "asset"> & {
  asset: GentleAsset | null;
};
export type GentleCollection = Omit<
  typeof collection,
  "sourceCommit" | "entries"
> & {
  sourceCommit: string | null;
  entries: GentleEntry[];
};

export const GENTLE_POWERS: GentleCollection = collection;

/** Publication is deliberately separate from creative review and canon status. */
export function isGentlePowersPublished(value: GentleCollection): boolean {
  if (
    value.id !== "gentle-powers" ||
    value.canonState !== "proposal" ||
    value.visibility !== "public" ||
    value.releaseState !== "published" ||
    value.sourceRepository !== "frankxai/arcanean-library" ||
    typeof value.sourceCommit !== "string" ||
    !/^[a-f0-9]{40}$/.test(value.sourceCommit) ||
    value.entries.length !== 12 ||
    new Set(value.entries.map((entry) => entry.id)).size !== 12
  )
    return false;

  const generated = value.entries.filter(
    (entry) => entry.generationState === "generated",
  );
  if (generated.length !== 3) return false;
  const hashes = new Set<string>();
  for (const entry of value.entries) {
    if (
      entry.canonState !== "proposal" ||
      !entry.prompt.trim() ||
      !entry.alt.trim()
    )
      return false;
    if (entry.generationState === "prompt-only") {
      if (entry.asset !== null) return false;
      continue;
    }
    if (entry.generationState !== "generated") return false;
    const asset = entry.asset;
    if (
      !asset ||
      asset.deliveryState !== "verified" ||
      asset.reviewState !== "release-approved" ||
      typeof asset.url !== "string" ||
      !/^[a-f0-9]{64}$/.test(asset.sha256) ||
      !/^[a-f0-9]{64}$/.test(asset.masterSha256) ||
      hashes.has(asset.sha256) ||
      !Number.isSafeInteger(asset.width) ||
      asset.width <= 0 ||
      !Number.isSafeInteger(asset.height) ||
      asset.height <= 0 ||
      !Number.isSafeInteger(asset.bytes) ||
      asset.bytes <= 0 ||
      !asset.approval?.reviewer.trim() ||
      !asset.approval.authorizationRef.trim() ||
      asset.approval.masterSha256 !== asset.masterSha256 ||
      asset.approval.renditionSha256 !== asset.sha256
    )
      return false;
    try {
      const url = new URL(asset.url);
      if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.port ||
        url.search ||
        url.hash ||
        !/^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/.test(url.hostname) ||
        url.pathname !== `/arcanea/gentle-powers/${asset.sha256}.webp`
      )
        return false;
    } catch {
      return false;
    }
    hashes.add(asset.sha256);
  }
  return true;
}

export function filterGentleEntries(
  entries: GentleEntry[],
  query: string,
  generatedOnly: boolean,
) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/u).filter(Boolean);
  return entries.filter(
    (entry) =>
      (!generatedOnly || entry.generationState === "generated") &&
      terms.every((term) =>
        `${entry.title} ${entry.emotion} ${entry.camera} ${entry.story}`
          .toLocaleLowerCase()
          .includes(term),
      ),
  );
}
