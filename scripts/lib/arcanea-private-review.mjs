import { createHash } from "node:crypto";
import { inspectExternalSourceBytes } from "./arcanea-external-source-evidence.mjs";

const requireValue = (condition, message) => {
  if (!condition) throw new Error(message);
};
const nonempty = (value) => typeof value === "string" && value.trim().length > 0;
const hashPattern = /^[a-f0-9]{64}$/;

// RFC 9562 UUIDv8: first 128 SHA-256 bits, with version and variant bits set.
export function privateAssetId(collectionId, versionId) {
  const hex = createHash("sha256")
    .update(JSON.stringify(["arcanea.private-review.v1", collectionId, versionId]))
    .digest("hex").slice(0, 32).split("");
  hex[12] = "8";
  hex[16] = ((parseInt(hex[16], 16) & 3) | 8).toString(16);
  return hex.join("").replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
}

export function parseCatalog(text) {
  const rows = [];
  let row = [], cell = "", quoted = false, closed = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else if (quoted) { quoted = false; closed = true; }
      else { requireValue(!cell && !closed, "Malformed CSV quote"); quoted = true; }
    } else if (!quoted && (char === "," || char === "\n" || char === "\r")) {
      row.push(cell); cell = ""; closed = false;
      if (char !== ",") {
        if (char === "\r" && text[i + 1] === "\n") i++;
        rows.push(row); row = [];
      }
    } else { requireValue(!closed, "Unexpected data after CSV quote"); cell += char; }
  }
  requireValue(!quoted, "Unclosed CSV quote");
  if (cell || row.length || closed) { row.push(cell); rows.push(row); }
  const headers = rows.shift();
  requireValue(headers?.length && new Set(headers).size === headers.length, "Invalid CSV headers");
  return rows.map((values) => {
    requireValue(values.length === headers.length, "CSV column count mismatch");
    return Object.fromEntries(headers.map((key, i) => [key, values[i]]));
  });
}

function driveFileId(url) {
  const parsed = new URL(url);
  const match = parsed.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]+)(?:\/view)?$/);
  requireValue(parsed.origin === "https://drive.google.com" && !parsed.username &&
    !parsed.password && !parsed.hash && match &&
    [...parsed.searchParams].every(([key, value]) => key === "usp" && value === "drivesdk"),
  "Expected a canonical Drive file reference");
  return match[1];
}

function ownerOnly(observation) {
  requireValue(observation && observation.shared !== true &&
    Array.isArray(observation.permissions) && observation.permissions.length === 1 &&
    observation.permissions[0].type === "user" && observation.permissions[0].role === "owner",
  "Drive evidence must confirm owner-only access");
}

/** Compiles reference-only proposals. Performs no network, image copy or approval. */
export function compilePrivateReview(manifestBytes, catalogBytes, review) {
  const manifestEvidence = inspectExternalSourceBytes(manifestBytes);
  const catalogEvidence = inspectExternalSourceBytes(catalogBytes);
  requireValue(review.schema === "arcanea.private-review-input.v1", "Unknown review contract");
  requireValue(review.sources?.manifest?.sha256 === manifestEvidence.sha256 &&
    review.sources?.catalog?.sha256 === catalogEvidence.sha256, "Source evidence hash mismatch");
  const manifest = JSON.parse(manifestBytes.toString("utf8"));
  const catalog = parseCatalog(catalogBytes.toString("utf8"));
  requireValue(manifest.schema_version === "1.0.0" &&
    manifest.canon_state === "proposal" && manifest.publication_state === "private_review_only",
  "Only private proposal manifests may be imported");
  requireValue(nonempty(manifest.collection_id) && manifest.collection_id === review.collection_id,
    "Collection identity mismatch");
  requireValue(Array.isArray(manifest.assets) && manifest.assets.length > 0 &&
    manifest.assets.length <= 100 && manifest.assets.length === review.expected_count &&
    catalog.length === manifest.assets.length, "Collection count mismatch");
  requireValue(Array.isArray(review.shortlist) && new Set(review.shortlist).size === review.shortlist.length,
    "Invalid editorial shortlist");
  requireValue(Array.isArray(review.canon_sources) && review.canon_sources.length > 0 &&
    review.canon_sources.every((source) => nonempty(source.url) && /^[a-f0-9]{40}$/.test(source.commit_sha) &&
      /^[a-f0-9]{40}$/.test(source.blob_sha) && nonempty(source.authority_state)), "Pinned canon sources required");
  ownerOnly(review.drive.folder);
  requireValue(review.drive.folder.id === manifest.archive_folder?.id, "Folder identity mismatch");
  for (const kind of ["manifest", "catalog", "notes"]) {
    const source = review.sources[kind];
    requireValue(nonempty(source?.url) && hashPattern.test(source.sha256), "Incomplete source evidence");
    const observed = review.drive.files.find((file) => file.id === driveFileId(source.url));
    ownerOnly(observed);
    requireValue(observed.parent_ids?.includes(manifest.archive_folder.id), "Source is outside the archive");
    if (kind !== "notes") requireValue(Number(observed.size) ===
      (kind === "manifest" ? manifestEvidence.bytes : catalogEvidence.bytes), "Source size mismatch");
  }
  const identities = new Set(), entities = new Set(), specs = new Set(), versions = new Set();
  const hashes = new Set(), drives = new Set();
  const catalogIds = new Set(catalog.map((entry) => entry.asset_id));
  requireValue(catalogIds.size === catalog.length, "Duplicate catalog identity");
  const records = manifest.assets.map((asset) => {
    for (const [value, seen] of [[asset.asset_id, identities], [asset.entity_id, entities],
      [asset.visual_spec_id, specs], [asset.asset_version_id, versions], [asset.sha256, hashes],
      [asset.drive?.file_id, drives]]) {
      requireValue(nonempty(value) && !seen.has(value), "Missing or duplicate stable identity, hash or master");
      seen.add(value);
    }
    requireValue(hashPattern.test(asset.sha256) && asset.mime_type === "image/png" &&
      [asset.width, asset.height, asset.file_bytes].every((n) => Number.isSafeInteger(n) && n > 0),
    "Invalid image metadata");
    requireValue(asset.canon_state === "proposal" && asset.approval_state === "unreviewed_candidate" &&
      asset.visibility === "private" && Array.isArray(asset.placements) && !asset.placements.length &&
      Array.isArray(asset.renditions) && !asset.renditions.length, "Proposal cannot carry a release or rendition");
    requireValue([asset.title, asset.alt_text, asset.prompt, asset.camera, asset.style, asset.story,
      asset.power_and_cost, asset.proposed_game_role, asset.rights?.publication_license,
      asset.provenance?.provider].every(nonempty), "Missing visual, accessibility, rights or provenance record");
    requireValue(asset.rights.publication_license === "unset; no public license granted" &&
      Array.isArray(asset.tags) && asset.tags.every(nonempty), "Private proposals cannot grant a public license");
    const entry = catalog.find((item) => item.asset_id === asset.asset_id);
    requireValue(entry && ["title", "affinity", "proposed_game_role", "power_and_cost", "canon_state",
      "approval_state", "sha256", "alt_text"].every((key) => entry[key] === asset[key]) &&
      entry.width === String(asset.width) && entry.height === String(asset.height) &&
      driveFileId(entry.drive_url) === asset.drive.file_id && driveFileId(asset.drive.url) === asset.drive.file_id,
    "Catalog and manifest disagree");
    const observed = review.drive.files.find((file) => file.id === asset.drive.file_id);
    ownerOnly(observed);
    const filename = asset.relative_path.split("/").at(-1);
    requireValue(observed.parent_ids?.includes(manifest.archive_folder.id) &&
      observed.mime_type === "image/png" && Number(observed.size) === asset.file_bytes &&
      observed.title === filename, "Drive master metadata mismatch");
    const screen = review.asset_screening[asset.asset_id];
    requireValue(screen && nonempty(screen.result) && Array.isArray(screen.findings) &&
      Array.isArray(screen.unknown_relationships), "Every asset requires explicit canon screening");
    return {
      id: privateAssetId(manifest.collection_id, asset.asset_version_id),
      file_name: filename, file_path: null, file_hash: asset.sha256, file_size: asset.file_bytes,
      mime_type: asset.mime_type, width: asset.width, height: asset.height,
      guardian: null, element: null, gate: null, content_type: "raw", tags: asset.tags,
      quality_score: null, quality_tier: "unscored", status: "new",
      source_agent: "private-archive-review-import", storage_url: null, thumbnail_url: null,
      storage_tier: null, world_id: "arcanea", published_to: [], approved_at: null, approved_by: null,
      metadata: {
        schema: "arcanea.private-review-asset.v1", collection_id: manifest.collection_id,
        collection_title: manifest.title, asset_id: asset.asset_id, entity_id: asset.entity_id,
        visual_spec_id: asset.visual_spec_id, asset_version_id: asset.asset_version_id,
        title: asset.title, affinity: asset.affinity, alt_text: asset.alt_text,
        canon_state: "proposal", approval_state: "unreviewed_candidate", visibility: "private",
        publication_state: "private_review_only", processing_hold: true, release_eligible: false,
        renditions: [], placements: [], sources: review.sources, archive_folder: manifest.archive_folder.url,
        checksum: { algorithm: "sha256", value: asset.sha256,
          verification: "source-declared; catalog/manifest agreement; remote master bytes not rehashed" },
        master: { provider: "google_drive", file_id: observed.id, url: entry.drive_url,
          access: "owner_only_observed", metadata_verified_on: review.inspected_on },
        visual_specification: { id: asset.visual_spec_id, state: "proposal", version: asset.version,
          story: asset.story, camera: asset.camera, style: asset.style, prompt: asset.prompt,
          power_and_cost: asset.power_and_cost, proposed_game_role: asset.proposed_game_role,
          identity_lock: "unaccepted" },
        relationships: { depicts: asset.entity_id, accepted_character_id: null, origin_class: null,
          guardian: null, gate: null, element: null, faction: null, location: null },
        canon_screening: { ...screen, authority_sources: review.canon_sources,
          scope_limitations: review.scope_limitations, canon_approval: false },
        editorial: { ...asset.review, shortlisted: review.shortlist.includes(asset.asset_id),
          shortlist_source: review.sources.notes.url, acceptance: false },
        provenance: asset.provenance, rights: asset.rights,
      },
    };
  });
  requireValue(review.shortlist.every((id) => identities.has(id)), "Shortlist contains an unknown asset");
  return { schema: "arcanea.private-review-import.v1", collection_id: manifest.collection_id,
    sources: { manifest: manifestEvidence, catalog: catalogEvidence }, records };
}

/** Insert-only transaction; reruns compare exact rows and never overwrite review decisions. */
export function privateReviewSql(bundle) {
  requireValue(bundle.schema === "arcanea.private-review-import.v1" && bundle.records?.length > 0,
    "Expected a compiled private review import");
  const literal = `'${JSON.stringify(bundle.records).replaceAll("'", "''")}'`;
  let delimiter = "$private_review$";
  while (literal.includes(delimiter)) delimiter = delimiter.slice(0, -1) + "_$";
  return `BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL standard_conforming_strings = on;
LOCK TABLE public.asset_metadata IN SHARE ROW EXCLUSIVE MODE;
DO ${delimiter}
DECLARE incoming jsonb := ${literal}::jsonb; r jsonb; existing jsonb;
BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.asset_metadata'::regclass)
    OR EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'asset_metadata'
      AND roles <> ARRAY['service_role']::name[]) THEN
    RAISE EXCEPTION 'Private review requires service-only RLS; no policies are changed by this import';
  END IF;
  FOR r IN SELECT value FROM jsonb_array_elements(incoming) LOOP
    IF EXISTS (SELECT 1 FROM public.asset_metadata a WHERE a.id <> (r->>'id')::uuid
      AND (a.file_hash = r->>'file_hash' OR
        (a.metadata->>'collection_id' = r->'metadata'->>'collection_id' AND
         a.metadata->>'asset_version_id' = r->'metadata'->>'asset_version_id') OR
        a.metadata->'master'->>'file_id' = r->'metadata'->'master'->>'file_id')) THEN
      RAISE EXCEPTION 'Existing master/version conflicts with import identity';
    END IF;
    SELECT to_jsonb(a) INTO existing FROM public.asset_metadata a WHERE a.id = (r->>'id')::uuid;
    IF existing IS NOT NULL AND NOT existing @> r THEN
      RAISE EXCEPTION 'Existing asset differs; preserve review decisions and reconcile explicitly';
    END IF;
  END LOOP;
  INSERT INTO public.asset_metadata (${Object.keys(bundle.records[0]).join(", ")})
  SELECT ${Object.keys(bundle.records[0]).map((key) => `a.${key}`).join(", ")}
  FROM jsonb_populate_recordset(NULL::public.asset_metadata, incoming) a
  ON CONFLICT (id) DO NOTHING;
END ${delimiter};
COMMIT;
`;
}
