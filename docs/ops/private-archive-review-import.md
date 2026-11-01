# Private archive review import

Creator job: inspect already archived artwork with traceable identities, source
evidence, visual specifications and unresolved canon relationships. Importing a
proposal does not accept its character, specification, rights or publication.

Scope: the offline importer and existing `public.asset_metadata` table.
Owner: asset-review operator. Base: `b63a7a6ab0d06768a9ced94a4751ce0ec54183e7`.
Files: `scripts/import-arcanea-private-review.mjs`, its library and focused tests,
and this contract. No runtime API, UI, schema, policy, binary or canon changes.
No provider calls, generation, deployment or paid dependencies are introduced.

## Existing contracts

The accepted Registry decision `architecture_media_fabric_v2` keeps Drive as
private-master/review/recovery storage, GitHub as accepted canon/spec authority,
and Supabase as metadata/approval control. Proposal records are registration for
review, not approval metadata. This uses the existing JSON metadata extension;
it does not create a parallel asset store or a production dependency on Drive.

`asset_metadata` has a constrained processing status enum. An imported proposal
uses `status=new`, `quality_tier=unscored`, null quality score, null
`approved_at`/`approved_by`, and an empty `published_to`. Its actual decision
states are explicit in metadata: `canon_state=proposal`,
`approval_state=unreviewed_candidate`, `visibility=private`,
`publication_state=private_review_only`, `processing_hold=true`,
`release_eligible=false`. `new` does not assert an artistic decision.

Source `asset_id`, `entity_id`, `visual_spec_id` and `asset_version_id` survive
unchanged. The relational UUID is deterministic UUIDv8 from SHA-256 of the
contract name, collection ID and version ID. A title rename cannot change it.
Drive references live under `metadata.master` and `metadata.sources`.
`file_path`, `storage_url`, `thumbnail_url`, and `storage_tier` remain null.
There are no production renditions or placements. Affinity is a descriptor;
Guardian, Gate, element, origin and accepted-character relationships stay null.

## Offline use

Use Node 24 from `.nvmrc`. Keep real manifests, evidence, generated records and
SQL outside the public repository. The CLI refuses output inside the source
repository, writes with exclusive creation and private file permissions, and
never accesses Supabase or Drive itself.

```sh
node scripts/import-arcanea-private-review.mjs \
  /private/manifest.json /private/catalog.csv /private/review-input.json \
  /private/review-output
node --test scripts/tests/arcanea-private-review.test.mjs
```

The `arcanea.private-review-input.v1` envelope contains the exact `collection_id`,
`expected_count`, `inspected_on`, editorial `shortlist`, `sources` with manifest,
catalog and director-notes URLs and SHA-256 values, and `drive.folder` plus
`drive.files` observations. Each observation records ID, title, MIME type, size,
parents, sharing flag and permissions from the authorized Drive readback.
This importer currently requires exactly one owner permission per source/master.
It does not alter sharing or guess missing permission evidence.

`canon_sources` pins URL, commit SHA, blob SHA and `authority_state` for every
inspected source. `asset_screening` is keyed by source asset ID, with `result`,
`findings` and `unknown_relationships`. `scope_limitations` records unavailable
repositories, conflicting accepted references, staging material and incomplete
search coverage. Name matches never create character relationships. A clean
screen is not acceptance or global name/IP clearance.

Validate source byte hashes independently before supplying the envelope.
Master checksums retain their original evidence level: catalog/manifest
agreement plus Drive metadata inspection is not a fresh hash of remote bytes.
Unknown model IDs/seeds/costs remain unknown. Editorial selections remain
preferences, separate from independent artistic review and acceptance.

## Applying and verifying

Review `private-review-records.json` and `private-review-import.sql` through an
authorized operator connection. The transaction takes a bounded table lock,
requires existing service-only RLS, checks duplicate master hashes/references
and version identities, and inserts missing UUIDs. It changes no policies.
Do not apply to a table with general authenticated/public read access.
`media_catalog` is a public projection and must not receive these proposals.

A rerun does not update existing rows: an exact match is a no-op; any changed
review decision, source version or metadata causes the transaction to fail.
Reconcile changes explicitly rather than replacing review history. The source
code cannot authenticate a human approval; it grants none. `processing_hold`
is an operator instruction, not a new database trigger or worker capability.
Do not enroll these records into automatic classification/publication queues.

Acceptance: same ten/source-count records after retry; unchanged stable IDs;
exact hashes/source links; empty public destinations; no new renditions; explicit
unknown canon relationships; editorial shortlist preserved. Verify collection
SELECT returns zero under both `anon` and ordinary `authenticated`, including
the owner's normal session unless a separately reviewed reviewer policy exists.
The ordinary Command Center uses session RLS and is not claimed to display
service-only review rows. Drive remains the human review entry point.

Verification: focused source tests, Node syntax checks, transaction rollback
trial, idempotent live retry, exact row readback and denied-role queries. Full
application build/type/lint and independent source review remain receiving
gates before merging source changes. No web/UI verification is implied.

Recovery: revert the source PR without changing masters. For imported data,
export the collection first; remove only the exact import UUIDs whose recorded
metadata and state still match the import, inside a reviewed transaction. Stop
when any row has subsequent review history. Never delete or move the masters.
