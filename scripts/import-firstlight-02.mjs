import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const digest = (value) => createHash("sha256").update(value).digest("hex");
const requireValue = (condition, message) => {
  if (!condition) throw new Error(message);
};

/** Validate the public immutable projection; this does not accept fictional canon. */
export function validateFirstlight(characters, assets) {
  requireValue(
    characters?.batch_id === "arcanea-firstlight-02",
    "Wrong character batch",
  );
  requireValue(
    characters.canon_state === "proposal",
    "Public exhibition cannot promote canon",
  );
  requireValue(
    characters.visibility === "public",
    "Private lore cannot enter the public projection",
  );
  requireValue(
    characters.authority?.canonical_repository === "frankxai/arcanean-library",
    "Wrong fiction authority",
  );
  requireValue(
    characters.authority?.canonical_path === "content/proposals/firstlight-02",
    "Wrong fiction path",
  );
  requireValue(
    Array.isArray(characters.characters) && characters.characters.length === 10,
    "Expected ten character records",
  );
  requireValue(
    assets?.batch_id === characters.batch_id &&
      Array.isArray(assets.assets) &&
      assets.assets.length === 20,
    "Expected twenty asset records",
  );
  const characterIds = new Set();
  const assetIds = new Set();
  const checksums = new Set();
  const masterChecksums = new Set();
  const categories = { companion: 0, guardian: 0, opponent: 0 };
  for (const character of characters.characters) {
    requireValue(
      !characterIds.has(character.id),
      "Duplicate character identity",
    );
    characterIds.add(character.id);
    requireValue(
      character.canon_state === "proposal" && character.visibility === "public",
      "Character must remain a public proposal",
    );
    requireValue(
      /^[a-z][a-z0-9-]{1,40}$/.test(character.slug) &&
        character.id === `arcanea.fl02.${character.slug}`,
      "Malformed character identity",
    );
    requireValue(
      character.category in categories,
      "Unknown character category",
    );
    categories[character.category] += 1;
    for (const value of [
      character.name,
      character.title,
      character.tagline,
      character.description,
      character.story?.vow,
      character.story?.cost,
      character.story?.limitation,
      character.story?.affection_detail,
      character.story?.hook,
      character.teamwork?.role,
      character.teamwork?.metaphor,
      character.teamwork?.acceptance_criterion,
    ])
      requireValue(
        typeof value === "string" && value.trim().length > 0,
        "Missing required story or role field",
      );
    for (const kind of ["sheet", "hero"]) {
      const id = `fl02-${character.slug}-${kind}`;
      const asset = assets.assets.find((candidate) => candidate.id === id);
      requireValue(
        asset?.character_id === character.id && asset.kind === kind,
        "Asset must bind to the exact character and view",
      );
      requireValue(
        character.asset_ids.includes(id),
        "Character does not reference this asset",
      );
    }
  }
  requireValue(
    categories.companion === 6 &&
      categories.guardian === 2 &&
      categories.opponent === 2,
    "Cast balance must remain six companions, two protectors and two opponents",
  );
  for (const asset of assets.assets) {
    requireValue(!assetIds.has(asset.id), "Duplicate asset identity");
    assetIds.add(asset.id);
    requireValue(
      asset.availability === "registered",
      "Unstored images cannot ship as a complete exhibition",
    );
    requireValue(
      typeof asset.sha256 === "string" && /^[a-f0-9]{64}$/.test(asset.sha256),
      "Image checksum required",
    );
    requireValue(
      !checksums.has(asset.sha256),
      "One image cannot count as two distinct outputs",
    );
    checksums.add(asset.sha256);
    requireValue(
      typeof asset.master_sha256 === "string" &&
        /^[a-f0-9]{64}$/.test(asset.master_sha256),
      "Master checksum required",
    );
    requireValue(
      !masterChecksums.has(asset.master_sha256),
      "One master cannot count as two generated outputs",
    );
    masterChecksums.add(asset.master_sha256);
    requireValue(
      asset.derived_from_sha256 === asset.master_sha256 &&
        asset.exhibition_release?.state === "approved" &&
        asset.exhibition_release?.source_sha256 === asset.master_sha256 &&
        typeof asset.exhibition_release?.reviewer === "string" &&
        asset.exhibition_release.reviewer.length > 0 &&
        typeof asset.exhibition_release?.authorization_ref === "string" &&
        asset.exhibition_release.authorization_ref.length > 0,
      "Display approval must bind the exact original master and rendition lineage",
    );
    const url = new URL(asset.url);
    requireValue(
      url.protocol === "https:" &&
        !url.username &&
        !url.password &&
        !url.port &&
        !url.search &&
        !url.hash &&
        /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/.test(url.hostname),
      "Only public immutable Blob renditions can ship",
    );
    requireValue(
      url.pathname.includes(asset.sha256),
      "Blob path must bind the exact immutable checksum",
    );
    requireValue(
      Number.isSafeInteger(asset.width) &&
        asset.width > 0 &&
        Number.isSafeInteger(asset.height) &&
        asset.height > 0,
      "Actual image dimensions required",
    );
    requireValue(
      typeof asset.prompt === "string" && asset.prompt.length >= 100,
      "Exact generation prompt required",
    );
    requireValue(
      typeof asset.alt === "string" && asset.alt.length >= 20,
      "Meaningful image alternative required",
    );
    requireValue(
      characterIds.has(asset.character_id),
      "Unknown image character",
    );
  }
  return { characters: characterIds.size, assets: assetIds.size, categories };
}

export async function importFirstlight({
  characterPath,
  assetPath,
  queuePath,
  sourceCommit,
}) {
  requireValue(
    /^[a-f0-9]{40}$/.test(sourceCommit ?? ""),
    "Pinned fiction source commit required",
  );
  const [characterText, assetText, queueText] = await Promise.all([
    readFile(characterPath, "utf8"),
    readFile(assetPath, "utf8"),
    readFile(queuePath, "utf8"),
  ]);
  const characters = JSON.parse(characterText);
  const assets = JSON.parse(assetText);
  const reviewQueue = JSON.parse(queueText);
  characters.authority = {
    ...characters.authority,
    projection_source_commit: sourceCommit,
    projection_source_path: "content/proposals/firstlight-02/characters.json",
  };
  const validation = validateFirstlight(characters, assets);
  requireValue(
    reviewQueue.batch_id === characters.batch_id &&
      reviewQueue.canon_state === "proposal",
    "Review packet belongs to another batch or canon state",
  );
  const sourceHashes = {
    characters_sha256: digest(characterText),
    assets_sha256: digest(assetText),
    review_queue_sha256: digest(queueText),
  };
  const catalog = {
    schema_version: "1.0.0",
    batch_id: characters.batch_id,
    title: characters.title,
    canon_state: "proposal",
    visibility: "public",
    source_hashes: sourceHashes,
    character_authority: characters.authority,
    rights: characters.rights,
    publication: {
      purpose: "experimental_review_exhibition",
      canon_promotion: false,
      runtime_permissions_granted: false,
      approval_control_plane: "supabase_not_mutated_by_this_static_projection",
    },
    characters: characters.characters,
    assets: assets.assets,
  };
  const queue = {
    ...reviewQueue,
    projection_source_commit: sourceCommit,
    projection_source_hashes: sourceHashes,
    asset_bindings: assets.assets.map(({ id, character_id, sha256, url }) => ({
      id,
      character_id,
      sha256,
      url,
    })),
  };
  const writes = [
    ["apps/web/data/firstlight-02/characters.json", characters],
    ["apps/web/data/firstlight-02/assets.json", assets],
    ["apps/web/public/firstlight-02/catalog.json", catalog],
    ["apps/web/public/firstlight-02/review-queue.json", queue],
    [
      "docs/worldbuilding/firstlight-02/projection-receipt.json",
      {
        schema_version: "1.0.0",
        source_hashes: sourceHashes,
        ...validation,
        canon_state: "proposal",
        storage: "vercel_blob",
        runtime_permission_changes: false,
      },
    ],
  ];
  for (const [relative, value] of writes) {
    const path = resolve(root, relative);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
  }
  return validation;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const [characterPath, assetPath, queuePath, sourceCommit] =
    process.argv.slice(2);
  if (!characterPath || !assetPath || !queuePath || !sourceCommit) {
    console.error(
      "Usage: node scripts/import-firstlight-02.mjs CHARACTERS_JSON ASSETS_JSON REVIEW_QUEUE_JSON FICTION_SOURCE_COMMIT",
    );
    process.exitCode = 1;
  } else {
    try {
      console.log(
        JSON.stringify(
          await importFirstlight({
            characterPath,
            assetPath,
            queuePath,
            sourceCommit,
          }),
        ),
      );
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
