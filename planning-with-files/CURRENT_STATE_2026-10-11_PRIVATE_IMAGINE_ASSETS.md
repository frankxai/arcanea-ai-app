# Private retained Imagine assets

Scope: a signed-in creator keeps an image, reopens it in the correct account,
downloads its actual bytes and explicitly authorizes any animation handoff without
silently publishing the source. This is part of the full world/chapter/continuity/
media/reopen/export programme, not a substitute for that outcome.

Owner: Codex task `01a123df-58c6-72f3-b86c-65083426cf65`, sole writer in the existing
`arcanea-gateway-admission-20261010` worktree. Origin:
`https://github.com/frankxai/arcanea-ai-app.git`. Branch:
`agent/codex/private-imagine-assets-20261011`. Base:
`0dd501281f89f0612454b1200ba40f8fac5799f6`. Issues: programme276 and trust529.

Files currently changed: Imagine's favorites helper, native favorites regression,
ImageCard, Imagine page and this record. The admitted scope also includes save,
gallery and private asset retrieval routes and their helper/tests. Further SQL,
animation or hosted-verifier changes require an explicit scope extension first.
No foreign checkout or index is written. Preserve578/579 and the reader/entry lanes.

## Evidence and implemented foundation

The frozen accepted helper at0dd5012 reads an unowned global localStorage manifest
without account authority. The actual helper reproducer exposes controlled A scene
metadata without an owner argument. It makes no network calls or production writes;
this is a native reproduction, not an authenticated-browser result.

The repair requires the existing synchronous Auth actor/epoch for every favorite
read/write. A/B/A stale uploads cannot commit or update the next account's UI.
Unowned legacy manifests are preserved without importing or displaying them.
Browser namespaces are not encryption and do not provide cross-device persistence.

A favorite now requires a valid successful save receipt. HTTP denial, transport
failure, session-only responses and failed local writes remain visible failures;
an expiring provider URL is never silently substituted for a saved receipt.
Corrupt metadata remains preserved. Inline image bytes are bounded through the
accepted decoder; raw inline bytes are not duplicated into the metadata cache.
The local cache bound is an implementation guard, not a paid storage entitlement.

ImageCard passes captured authority, exposes an accessible save toggle and error,
and keeps its 44px favorite target visible on touch and keyboard focus. Downloads
reuse the bounded PNG/JPEG/WEBP decoder with correct filenames and a guarded original
link fallback. Favorite previews avoid the unauthenticated Next image optimizer.
Unrelated component behavior was retained. The required changed-file formatting
gate normalizes the touched legacy ImageCard source, including its CRLF and JSX
layout. All five changed files pass the existing formatter. No new image, canon or marketing asset was generated.

Twelve focused native cases and the existing ten request/export cases pass.
Changed-source lint passes. Full type/build, authenticated/rendered acceptance and
exact-revision independent review are not earned for this branch.

## Full acceptance, still open

- Private new writes and authenticated owner-scoped byte reads. Existing public
  objects must not be deleted, relabelled as private or silently republished.
- Durable Postgres metadata with source, rights, checksum, accessible description,
  operation identity and private lifecycle. A creator can recover the saved record
  if the browser cache is lost. Gallery pagination must not lose older records.
- Atomic per-account byte admission, including concurrent/uncertain uploads. No
  client-controlled quota, blind retry, automatic deletion or unapproved overage.
  The current commerce catalog defines no numeric storage entitlement; do not
  invent one or advertise capacity before configuration and enforcement are proven.
- Stable retries and checksum-bound completion. A lost upload acknowledgement
  retains the same asset identity and reservation until the object is reconciled.
- Input bounds compatible with actual Vercel request limits. Direct client upload
  tokens, if used, require authenticated owner/path/type/size binding and verified
  completion; an upload callback cannot promote arbitrary content.
- Private animation sources delivered only after explicit creator intent, with
  owner validation before credit reservation and current documented supplier input.
  The present animation/save route is not yet changed and still relies on public
  URLs. A private route must not break it or expose images merely to make it work.
- Real two-account Auth/Postgres/storage-fixture save/reopen/export, guest/foreign
  denial, malformed/oversized bytes, quota exhaustion, duplicate completion,
  interrupted upload, expired authority and storage failure. Require original
  desktop/mobile/reduced-motion captures with companions and visual-ledger entries.
- Same-head source review, build/type/lint/native/hosted acceptance, protected merge
  and source-bound production verification. Actual customer usefulness and paid
  activation remain separate programme gates.

## Architecture, admission and rollback

Current reviewed Registry `b4b82e3d1430846d62707973a66584de4f2e4776` was read through
the authorized connection: manifest, exclusions, repositories, artifact authorities
and architecture decisions, with hashes retained privately. The registered Arcanea
product remains the source; no new portfolio artifact authority is invented.
`architecture_media_fabric_v2` is accepted: Postgres metadata and governed Blob
delivery. The earlier R2-default decision is superseded. Reusing Supabase Storage
was considered against the accepted Blob path; no measured exception or migration
is approved. Current official Blob private/client-upload and xAI image-to-video
documentation were checked. Installed Blob SDK is2.8.0; no dependency change.

Machine review-lite admission is HOLD at2483MB free/6144MB required,27 runtimes.
Only text edits and small native/lint checks ran. No new local browser, build,
agent, server, vendor store, provider call or production database/configuration
change occurred. Keep existing public assets and all account data. No financial
transaction, price, subscription or rights grant is authorized by this record.

Rollback is an owned reviewed revert that preserves asset bytes, reservations,
metadata and unowned legacy browser data. Reverting the account helper restores the
known cross-account leak and false-success behavior, so record that consequence.
The slice remains unfinished and must stay draft. The complete native goal is ACTIVE.

## Private server candidate, 11 October

Draft PR580 is open at the account-cache foundation103a3e96d42cab4049920a2d70e3756527db49b3. Its full manual CI38128274165 completes SUCCESS for Install/Lint/TypeScript/Build/CI Status. Its restricted authenticated and independent review jobs SKIP; this does not certify private assets. The next server revision below is not covered by that older result.

New candidate source uses a dedicated private Blob token and explicit new-write enablement. All new puts are private and immutable. Authenticated byte reads enforce owner metadata before store access, re-hash actual bounded bytes and return no-store/nosniff responses. Disabling new writes leaves configured owner exports readable. Existing public objects and legacy manifests remain untouched. No new store or live environment was provisioned.

The pending migration stores private metadata, exact bytes/checksum, source/prompt/description, immutable operation fingerprint and lifecycle. Source and rights are explicitly unverified creator claims; the row grants no license or publishing rights. Only the trusted server can reserve/complete. No numeric account capacity is minted by default. Each account's row lock serializes byte admission; completion moves reserved bytes to used once. Unknown upload outcomes hold reservations and use the same stable content-bound ID until actual object readback reconciles them. Browser receipts must match the captured owner and asset handle.

Saved-image input is capped at3 MiB, with real streamed JSON limits below the deployed request-body bound. Larger originals retain the existing8 MiB export decoder and a clear download/size error. PNG/JPEG/WEBP require actual pixel decoding, MIME consistency and bounded dimensions. A governed direct-upload path for larger saves is still future acceptance; it is not supplied by these server routes.

Native cases now cover private handles, same-origin cookie scoping, foreign/stale receipts, interrupted save identity, unknown upload/metadata acknowledgements, immutable/corrupt/missing bytes and actual PNG decoding. Native service tests use controlled repository/store adapters, not an actual paid Blob store or Supabase identity. A new disposable PostgreSQL fixture is wired into the existing CI service after the rolled-back author bootstraps. It tests migration/RLS, unconfigured/full quota, duplicate completion, unknown holds and two simultaneous database connections racing for one capacity. Its hosted result is pending until this candidate is pushed and run. No local heavy work was started under RAM HOLD2774/6144MB.

Release remains draft. The current animation caller still posts the previous save contract, and the video route still requires public HTTPS sources. Private animation resolution before credit reservation, durable gallery hydration/cache-loss reopen, real Auth plus storage-adapter browser acceptance, rendered craft, cancellation/repair controls, exact-candidate independent review, full hosted checks and approved production provisioning all remain open. Neither a passing foundation build nor the new native cases closes these requirements.

## Actual hosted SQL pass and type repair

Integrated63f53bf7edbe4c3cd45c8d20ddc32e2eecb0d923 preserves accepted main97801884's four incoming provider files byte-for-byte. Production is independently READY at978 with receiving main CI38128420246/CodeQL/estate-guard and anonymous09:52UTC probes passing. This candidate is not deployed.

Hosted38129833431 Lint succeeds, including the actual PostgreSQL migration/RLS fixture. Logged PASS covers stable reservation/metadata conflict, unconfigured and exhausted quota, duplicate completion and unknown hold; owner gallery/read/pagination and client completion/quota/delete denial; foreign/guest/expired auth; two actual simultaneous connections produce one reservation and one quota refusal. These SQL rows are an isolated service fixture, not GoTrue/browser or actual Blob acceptance.

TypeScript fails with TS2305 missing Blob get and TS2353 token not in PutOptions. The installed/pinned2.8.0 SDK provides both; an inherited ambient apps/web/types/vercel-blob.d.ts from60d307a shadows its real declarations with a narrow old stub. The repair makes that declaration file import the installed SDK without replacing its exports. No new cast, type suppression, dependency change or disabled check is introduced. Fresh hosted type/build acceptance remains pending after this source change. Earlier failed/cancelled candidate receipts remain preserved. Gallery lifecycle, private animation, actual authenticated store/rendering, independent review and production configuration remain open.

## Cloud favorites candidate and receiving world editor

11 October, 10:35 UTC: previous source832f3e81071e5ae04bd758e65b000776808dc5d8 completes hosted CI38130336650 SUCCESS for Install/Lint/TypeScript/Build/CI Status. This repairs the inherited Blob ambient declaration. Its restricted real-auth and independent review jobs SKIP. That older success does not certify the new cloud-favorites source below.

The candidate now keeps favorites in owner-scoped PostgreSQL metadata. The narrow RPC locks the asset and checks a safe-integer revision plus stable operation UUID. A matching acknowledgement replay returns the same row; stale or altered operations fail. Removal changes the favorite flag and revision while retaining private bytes, metadata and accounted storage. Restoring a favorite updates its keyset position. Direct customer UPDATE remains denied. SQL fixture extensions cover removal/restoration/replay, stale tabs, owner/foreign/guest/expired access, unchanged capacity and two real connections racing one favorite revision. These new SQL cases still need the fresh hosted run.

The browser hydrates account favorites through bounded50-row pages, preserving exact microsecond cursors. Cache loss no longer prevents cloud reopen. Browser-only bookmarks are labelled separately; unowned and malformed legacy data remain preserved. Confirmed cloud writes return an explicit cache warning when browser storage fails. Favorite changes retain their operation UUID through lost acknowledgements and require an exact owner/asset/state/revision acknowledgement. Unknown operations do not change the local bookmark. A/B/A account epochs guard metadata, pagination, save and mutation completions.

FavoritesPanel uses the installed Radix Dialog for focus trapping, Escape, inert background and focus return. The existing handwritten modal was considered; its initial-element focus capture does not cover controls arriving after asynchronous loads. The panel supplies sync/retry/load-more, keyboard-visible44px controls, persistent labels for private account records versus browser bookmarks, and bounded actual-MIME downloads. ImageCard awaits removal acknowledgements and checks cached private state before changing it. Next Image now receives dimensions and bypasses the remote optimizer for generated images. This describes implemented source; authenticated rendered desktop/mobile/reduced-motion and actual store acceptance are still open.

Focused native tests PASS56/56; changed-source ESLint PASS with0 errors/warnings. The existing hosted independent reviewer is narrowly extended to this owned branch/manual dispatch, using an immutable receiving-main base, exact Git source, bounded packet and existing provider. New admission cases reject local/foreign/PR/unpinned review before provider access; both admission cases PASS. This is not an independent verdict yet. Manual CI Status requires that independent review for this branch. No existing required gate is weakened.

PR579 is now MERGED, receiving main46b77c58d5dd4bf1423fd8e45e7d1591ac016e82. Its five accepted world editor/navigation/fixture files are incoming integration only and must remain byte-identical. Main CI38131259624, CodeQL38131259633 and estate-guard38131259621 SUCCESS. Production dpl_FEHwfJe1uk1UE12zUyvezGrx9uAt is READY at46b77c58, with www/apex/app aliases. Read-only10:35:47UTC probes return home200 and real auth redirects for Studio/settings; exact imgen.x.ai CSP has no wildcard. No credentials, paid generation, retained writes or production configuration changed.

Fresh machine preflight remains HOLD at4547MB free/6144MB required,27 runtimes. No new local agent, browser, server or full build started. The current candidate remains DRAFT. Private animation resolution, authenticated GoTrue plus private store/browser acceptance, actual rendered craft, recovery controls and independent exact-candidate review still block release. The inherited inline animation caller still uses the old save body and cannot serve a private handle to a public-HTTPS video route. Provisioning and approved capacity are not supplied by tests. Subscription pricing/storage/API credits, the premium creator journey, remaining branch triage, cloud/local harness and client contracts remain part of the ACTIVE full goal.

## Independent blocker reproduced and animation handoff corrected

At exact9e2a06f8b61f25e1dfe5324f49cd73e477f447f6, manual CI38132627839 passes Install/Lint/TypeScript/Build. The actual PostgreSQL fixture passes both byte-quota and favorite-revision races. Independent Gemini3.1 Pro review FAIL reports0 critical,1 high,0 medium: the known inline animation save body/private URL incompatibility. CI Status correctly fails. The exact receipt and final findings are retained privately. This failure is neither waived nor suppressed.

The actual animation-handler native reproducer initially FAILS: an owned private source returns400 instead of200. The correction reuses addFavorite's content-bound save/acknowledgement rather than posting the former incomplete body. The inline button says Save and animate. The selected generated prompt/source ID and actual bytes are retained privately; the displayed source becomes the account handle. Completed video URLs now reach ImageCard. Caller completion and cleanup respect the captured account epoch.

The animation route authenticates before reading a bounded8KiB body. Browser transport sends the captured owner without changing pre-existing payload fingerprints or pending request slots. Wrong owner/private-source ownership is refused before credit reservation. The server resolves only a ready owner record with a matching MIME extension, exact byte size and checksum, then sends a data URI directly to the already selected supplier. There is no public upload or signed URL. Existing HTTPS callers remain compatible; credential-bearing URLs fail before ledger/provider access. Missing, corrupt, unconfigured or foreign private bytes cannot start the paid operation. The existing job checkpoint/recovery still polls one accepted job and never starts a fallback.

Official [xAI image-to-video documentation](https://docs.x.ai/developers/model-capabilities/video/image-to-video) confirms data-URI input and the REST image.url field; the mistaken SDK-style image_url field in the Grok REST body is corrected. The existing model alias and quote are unchanged. The existing [fal endpoint documentation](https://fal.ai/models/fal-ai/kling-video/v1/standard/image-to-video/api) accepts data URIs; its image_url contract remains unchanged. These are documented transport contracts, not actual supplier acceptance or usefulness.

Native76/76 PASS includes seven private-route scenarios, owner transport binding that preserves an existing uncertain request key, Grok/fal direct-frame payloads and existing one-submission/poll/recovery invariants. Route tests execute the actual transpiled handler with controlled database/store/ledger/transport imports; they are not real GoTrue/Blob/customer acceptance. The old Grok native expectation is updated to the official REST contract, retaining duration and one-POST assertions. Changed-source ESLint PASS0 errors/warnings. New hosted type/build and exact-candidate independent review remain required after this correction.

Read-only Vercel project metadata discovery: connector env-list returns403; the installed CLI fallback succeeds for the same explicit starlight-intelligence project. Only variable names/targets are retained privately. The listing contains public Supabase keys/URLs and the existing Blob token; no private Imagine token/enablement or Supabase admin, XAI or FAL key names appear in that project listing. Full values were not pulled. This does not inventory external stores/key vaults or establish the existing Blob store's access mode. No production variables, store, DDL, quota, charge, subscription or rights were changed.

The full goal remains ACTIVE and draft580 remains unfinished. Next run exact-source hosted verification and independent review, then complete actual isolated Auth/private-SDK transport/browser acceptance and rendered desktop/mobile/reduced-motion checks. Private durable video retention, provider-job recovery UI, larger governed saves, approved live provisioning, customer creation quality, subscription/API economics, remaining branch landing and connected client/harness acceptance remain open. No new local heavy worker runs under machine HOLD.

## Authenticated private acceptance implementation, 11 October

Exact84c5820945e0e1abdb005b3a8c63733ae30bae4b completes full manual38134468098 SUCCESS for Install/Lint/TypeScript/Build/CI Status and independent source review. The Gemini3.1 Pro PASS binds33 complete Git source hashes, all checked against the actual candidate. Earlier fde7ceb aggregation failure remains retained. This certifies those gates only; private authenticated/browser/store and customer acceptance are still open.

The next candidate extends the existing disposable provider-account runner with a separately restricted owned private Imagine/manual Linux mode. Existing provider settings mode, exclusive0600 configuration factory and cleanup remain. The private mode applies the exact pending migration only to disposable PostgreSQL, uses real GoTrue password accounts and PostgREST, and provisions explicit synthetic capacities16384/0 bytes. Neither capacity is a live entitlement. A new job requires the actual browser result in CI Status without weakening the existing gates.

The compiled private save/read routes still use the installed Blob SDK2.8.0. A server-process-only undici MockAgent supplies a bounded immutable ephemeral byte store and denies external network, admitting only the fixture loopback app/Auth. Native actual-SDK checks pass for private/token/path/header binding, cache-bypass byte reads, uncertain put/readback, overwrite refusal, foreign paths and external network denial. No application route, RPC or storage adapter is replaced. Synthetic keys stay only in exclusive private configuration/server environment; inherited live or fixture keys/configuration are refused. No live store is provisioned or modified.

New browser acceptance exercises guest/foreign/stale owner/zero-capacity denial; literal pixel validation; interrupted SDK put and stable-ID reconciliation; actual compiled Save with browser cache failure; cache-loss cloud reopen, byte-checksummed download; real favorite revision replay/conflict/removal/restoration; actual keyset pagination; actual SDK BroadcastChannel A/B/A authority with a delayed unmodified old-account gallery; focus/Escape/return and44px mobile/keyboard actions at desktop/mobile/reduced-motion. Only the generation receipt is explicitly injected with the native test's literal1px PNG, isolating byte retention from paid creation. Favorite-ack interruption discards a real successful RPC response without fabricating its content. These newly authored browser cases are not yet executed or accepted; failed stages must remain visible.

Private captured renders have immediate fixture-provenance companions; the lead must inspect and append downloaded captures to the estate visual ledger before acceptance. A render of literal test pixels proves UI/transport, not valuable creative output. The existing generated-card hover-only animation controls may fail the new visibility check; do not waive that check. Live Blob/customer usefulness, durable video/job recovery UI, larger governed saves, approved capacity/configuration, commercial economics, remaining branch landing and connected harness/client acceptance remain open. The complete goal stays ACTIVE. No local browser/build/agent starts under current PP HOLD4448/8192MB browser reserve and27 runtimes.
