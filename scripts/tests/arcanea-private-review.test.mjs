import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { compilePrivateReview, parseCatalog, privateAssetId, privateReviewSql } from "../lib/arcanea-private-review.mjs";

const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
function fixture() {
  const url = (id) => `https://drive.google.com/file/d/${id}/view`;
  const owner = [{ type: "user", role: "owner" }];
  const asset = {
    asset_id: "TEST-01", entity_id: "proposal:test:entity", visual_spec_id: "test-spec-v1",
    asset_version_id: "test-master-v1", title: "Fixture's Keeper", affinity: "night",
    proposed_game_role: "Shelter", power_and_cost: "Protects; rests afterward.",
    canon_state: "proposal", approval_state: "unreviewed_candidate", visibility: "private",
    width: 800, height: 1000, sha256: "a".repeat(64), file_bytes: 1234, mime_type: "image/png",
    alt_text: "A fictional winged keeper shelters a traveler.", prompt: "One original keeper.",
    camera: "portrait", style: "ink", story: "A protective moment.", version: "1.0.0",
    drive: { file_id: "fixture-image", url: url("fixture-image") }, relative_path: "masters/fixture.png",
    placements: [], renditions: [], tags: ["proposal"], review: { independent_review: "pending" },
    provenance: { provider: "fixture", model: "unknown" },
    rights: { publication_license: "unset; no public license granted" },
  };
  const manifest = { schema_version: "1.0.0", collection_id: "fixture-collection", title: "Fixture",
    canon_state: "proposal", publication_state: "private_review_only",
    archive_folder: { id: "fixture-folder", url: "https://drive.google.com/drive/folders/fixture-folder" }, assets: [asset] };
  const headers = ["asset_id", "title", "affinity", "proposed_game_role", "power_and_cost", "canon_state",
    "approval_state", "width", "height", "sha256", "alt_text", "drive_url"];
  const csv = (values) => values.map((value) => '"' + String(value).replaceAll('"', '""') + '"').join(",");
  const catalog = headers.join(",") + "\r\n" + csv(headers.map((key) => key === "drive_url" ? asset.drive.url : asset[key])) + "\r\n";
  const manifestBytes = Buffer.from(JSON.stringify(manifest)), catalogBytes = Buffer.from(catalog);
  const review = {
    schema: "arcanea.private-review-input.v1", collection_id: manifest.collection_id, expected_count: 1,
    inspected_on: "2026-11-01", shortlist: [asset.asset_id], scope_limitations: ["Not global clearance"],
    sources: { manifest: { url: url("fixture-manifest"), sha256: sha(manifestBytes) },
      catalog: { url: url("fixture-catalog"), sha256: sha(catalogBytes) },
      notes: { url: url("fixture-notes"), sha256: "b".repeat(64) } },
    drive: { folder: { id: "fixture-folder", permissions: owner }, files: [
      { id: "fixture-image", title: "fixture.png", size: "1234", mime_type: "image/png", permissions: owner, parent_ids: ["fixture-folder"] },
      ...[["fixture-manifest", manifestBytes.length], ["fixture-catalog", catalogBytes.length], ["fixture-notes", 30]]
        .map(([id, size]) => ({ id, size, permissions: owner, parent_ids: ["fixture-folder"] }))] },
    canon_sources: [{ url: "https://github.com/example/repo/blob/main/canon.md", commit_sha: "c".repeat(40), blob_sha: "d".repeat(40), authority_state: "locked" }],
    asset_screening: { "TEST-01": { result: "unresolved", findings: [], unknown_relationships: ["origin"] } },
  };
  return { manifest, manifestBytes, catalogBytes, review };
}
function compile(f) { return compilePrivateReview(f.manifestBytes, f.catalogBytes, f.review); }
function rebind(f) { f.manifestBytes = Buffer.from(JSON.stringify(f.manifest)); f.review.sources.manifest.sha256 = sha(f.manifestBytes); f.review.drive.files.find((x) => x.id === "fixture-manifest").size = f.manifestBytes.length; }

test("stable identities preserve private proposal/spec/version relationships without delivery URLs", () => {
  const f = fixture(), bundle = compile(f), row = bundle.records[0];
  assert.deepEqual(bundle, compile(f));
  assert.equal(row.id, privateAssetId("fixture-collection", "test-master-v1"));
  assert.notEqual(row.id, privateAssetId("other-collection", "test-master-v1"));
  assert.equal(row.metadata.entity_id, f.manifest.assets[0].entity_id);
  assert.equal(row.metadata.visual_spec_id, "test-spec-v1");
  assert.equal(row.metadata.approval_state, "unreviewed_candidate");
  assert.equal(row.metadata.editorial.shortlisted, true);
  assert.equal(row.metadata.release_eligible, false);
  assert.equal(row.metadata.relationships.accepted_character_id, null);
  assert.equal(row.storage_url, null); assert.equal(row.file_path, null);
  assert.deepEqual(row.published_to, []); assert.equal(row.approved_at, null);
});
test("CSV supports quoted commas, escaped quotes and embedded CRLF; malformed rows fail", () => {
  assert.deepEqual(parseCatalog('id,title\r\n1,"one, ""two""\r\nthree"\r\n'), [{ id: "1", title: 'one, "two"\r\nthree' }]);
  for (const text of ['id,id\n1,2', 'id,title\n1', 'id\n"unclosed', 'id\n"closed"trailing']) assert.throws(() => parseCatalog(text));
});
test("drift, premature approval, public access and existing renditions fail closed", () => {
  const mutations = [
    (f) => { f.review.sources.manifest.sha256 = "f".repeat(64); },
    (f) => { f.catalogBytes = Buffer.from(f.catalogBytes.toString().replace("Shelter", "Attack")); f.review.sources.catalog.sha256 = sha(f.catalogBytes); f.review.drive.files.find((x) => x.id === "fixture-catalog").size = f.catalogBytes.length; },
    (f) => { f.review.shortlist.push("unknown"); },
    (f) => { f.review.drive.files[0].permissions = [{ type: "anyone", role: "reader" }]; },
    (f) => { f.review.drive.files[0].parent_ids = ["other"]; },
    (f) => { f.review.drive.files[0].size = "999"; },
    (f) => { f.manifest.assets[0].approval_state = "approved"; rebind(f); },
    (f) => { f.manifest.assets[0].renditions = ["public"]; rebind(f); },
    (f) => { f.manifest.assets[0].rights.publication_license = "CC0"; rebind(f); },
    (f) => { f.manifest.assets.push(f.manifest.assets[0]); f.review.expected_count = 2; rebind(f); },
    (f) => { f.review.asset_screening = {}; },
  ];
  for (const mutate of mutations) { const f = fixture(); mutate(f); assert.throws(() => compile(f)); }
});
test("SQL is atomic, insert-only, access-checked and safely quotes adversarial source text", () => {
  const bundle = compile(fixture());
  bundle.records[0].metadata.visual_specification.prompt = "quote ' and $private_review$; DROP TABLE anything; --";
  const sql = privateReviewSql(bundle);
  assert.ok(sql.startsWith("BEGIN;")); assert.match(sql, /COMMIT;\n$/);
  assert.match(sql, /DO \$private_review_\$/);
  assert.match(sql, /quote '' and \$private_review\$/);
  assert.match(sql, /standard_conforming_strings = on/);
  assert.match(sql, /ON CONFLICT \(id\) DO NOTHING/);
  assert.match(sql, /roles <> ARRAY\['service_role'\]/);
  assert.doesNotMatch(sql, /CREATE POLICY|ALTER TABLE|UPDATE public|DELETE FROM/);
});
