# Arcanea cinematic book strategy

**Status:** Active working contract
**Date:** 2026-08-29
**Branch:** `codex/arcanea-cinematic-book`
**Canonical product:** `arcanea.ai/books`
**Working edition:** Book 1 cinematic edition, derived from *The Three Academies* zero draft

## Current continuation evidence — 2026-09-09

This section supersedes the historical recovery, risks, and next-action sections below. The original brief and decisions remain preserved as source context.

- Assigned worktree: `starlight/worktrees/arcanea-cinematic-book-20260829`, branch `codex/arcanea-cinematic-book`, origin `frankxai/arcanea-ai-app`; draft PR [#314](https://github.com/frankxai/arcanea-ai-app/pull/314).
- The 32-chapter revised draft is approximately 76,800 words. It is still below the 95K–110K development target; a complete draft is not proof of final editorial readiness. Expansion must deepen the trio's choices, teaching, relationships, and consequences.
- The current edition route is `/books/the-last-free-path`. Chapter 1 is the free opening, matching Frank's original brief; Chapters 2–32, the Creator's Ledger, and downloads require server-side access verification. An earlier private iteration offered four chapters; that is no longer the release sample policy.
- Live Polar Orders is the first-release entitlement authority. It matches the exact product, book, and edition, and reconciles refunds on each protected request. This supersedes the earlier proposal for a new local entitlement table; no such migration is needed for this slice.
- Novel and artbook builders reject release mode without exact approval receipts and approved source hashes. Draft artifacts remain visibly marked. Checkout and protected reading require the private manifest's approved bytes and source revision to match the deployed revision.
- Delivery now verifies each complete file against the approved manifest before returning bytes; replacement, truncation, trailing data, stalled reads, and cancellation are covered. Each file must fit the 128 MiB buffer ceiling.
- The earlier TypeScript failure was resolved by building the seven workspace dependencies. After delivery changes, the complete web `tsc --noEmit --incremental false`, changed-scope ESLint, and `next build` passed; 471 static pages were generated. The obsolete local Vercel Blob type shim was removed, so these checks use the installed SDK types. The build reports eight existing dynamic-filesystem tracing warnings in `lib/saga/loader.ts`; they need integration review before a production promotion.
- Production was independently advanced by other work. Vercel reports production deployment `dpl_H8aPzSHY3RpALorLNTjkeB87ErYB`, source `141ad072132597f741979eee58671b3bd4e26a88`. This book lane has not been promoted. Do not deploy this older branch over current production without integration review.
- The estate's 2026-08-31 demand-capture rule applies: the product needs its registered per-product waitlist while the release gate is pending. The older disabled checkout state is insufficient for a public launch surface. Integrate the shared capture contract before public preview promotion.
- Canon, title, casting, byline, rights, commercial settings, and production approvals remain open in `book/chronicles-of-arcanea/book-01-the-three-academies/cinematic-edition/reviews/release-approval-packet-2026-08-30.md`.

### Production-baseline integration and reader evidence

- Reconciled production baseline `141ad072132597f741979eee58671b3bd4e26a88` in the assigned book lane. Preserve its galleries, story gateway, dependency updates, and default-deny public book protections. The six conflict resolutions retain the accessible reader dialog, prose preferences, and server-rendered chapter body while adopting client-side router navigation.
- Restored the shared `/books` catalog instead of redirecting the entire library to this edition. Catalog metadata is route-local; it must not overwrite individual book or chapter canonical URLs. The cinematic preview uses its own release-aware metadata before legacy manifest visibility checks.
- On Node 22.23.2 and pinned pnpm 8.15.0, frozen web-workspace dependency installation passed. All 37 cinematic tests and 14 public saga release-gate tests passed. The six resolved files pass scoped ESLint with zero warnings, formatting, and conflict-marker checks; the full web `tsc --noEmit --incremental false` also passed. Broader staged whitespace warnings belong to preserved upstream files; this integration does not silently reformat those unrelated files.
- Integrated Next.js 16.3.3 build passed, including TypeScript and generation of 525 static pages. The eight known dynamic-filesystem tracing warnings remain, alongside upstream middleware/Edge Runtime deprecation notices. These are not a clean production-performance verdict.
- Latest browser-verified preview remains commit `8ac162fabb301a1ded5288256ae9bd930f0f4027`, deployment `dpl_C9vvDuComeEhbrhfjNU5g6zQfCed`: https://arcanea-ai-guak59rvy-starlight-intelligence.vercel.app/books/the-last-free-path. It is protected and not production. The integrated revision needs its own deployed browser proof before promotion.
- Desktop and 375 px checks on that preview confirm one chapter heading, working serif/sans and spacing preferences on actual paragraphs, no horizontal overflow, and no paid prose in Chapter 5. Open reader defects: displayed sizes 22/26 map to 20/24 px; the assistant launcher competes with mobile controls. The mobile storefront puts the cover below the first viewport.
- PP allows one bounded build workload but holds new swarms. No new independent editorial or second-provider review occurred in this integration pass; the maker's checks are not a release verdict.

### Mobile reader and original sample-boundary implementation

- The mobile invitation now places the cover beside the title, with the real free-chapter action immediately below. Desktop retains an editorial three-column composition with an actual opening excerpt. The overview consumes the existing design-system palette and shadow tokens; no new image generation or artwork approval is implied.
- The server-side sample policy and released sitemap share one public contract: only `01-the-house-that-leaned` is free. Chapters 2–32 are classified as paid. Paywall, overview, and Creator's Ledger copy follow that boundary.
- Reader settings now validate stored data. Old 22/26 labels migrate to 20/24, preserving their actual previous appearance; the control reports the same size as the type token. Invalid fields fall back independently. Font and line-spacing controls are available on mobile, with 44 px buttons and two grouped rows. Additional bottom space protects the final chapter navigation.
- The assistant launcher and keyboard shortcut are suppressed only on this edition's chapter routes, including two-letter locale prefixes. The assistant remains available elsewhere. Its deferred focus callback is also cancelled on a suppressed route.
- Seven new unit contracts cover sample policy, scoped assistant exclusions, preference validation, and size migration. All 58 focused tests pass (21 delivery/access/preferences, six manifest, 11 edition, six artbook, 14 public saga gate), along with scoped lint. Next.js 16.3.3 build and its full TypeScript check passed with 525 static pages; eight existing dynamic-filesystem tracing warnings remain. Three new browser regressions cover the first mobile viewport, actual paragraph settings and persistence, and the Chapter 2 paywall; they still need deployed browser evidence.
- These are private implementation changes. Shared demand capture, independent review, final manuscript and artwork approvals, commerce rehearsal, and production promotion remain open.

### Deployed reader proof and opening performance study

- Previous goal turn classification: progress. Fresh browser evidence closed the mobile composition and preference defects rather than merely restating status.
- Exact browser-reviewed source: `aba8760b6e0a54648dec57e5023728c6a780765f`; Vercel `dpl_9ggGoE8RFVZy39CBqoZ78MncSJYz`, READY. Protected URL: https://arcanea-ai-kdkm80q0w-starlight-intelligence.vercel.app/books/the-last-free-path. This is not production.
- At 375 × 812, the loaded cover starts at y=173 and ends at y=374; the free-reading CTA ends at y=624. No horizontal overflow. Chapter 1 has one heading and actual Newsreader paragraphs at 18 px / 29.25 px, 312 px wide. Changing to 20 px, Geist sans and relaxed spacing changes the actual prose to 20 px / 40 px and persists after reload. Defaults were restored. The reader assistant is absent.
- Chapter 2 settles to one heading, no article and no paid opening prose; checkout is disabled and the free-opening return link exists. Desktop 1440 × 1000 has one storefront heading and no overflow. These are direct browser observations, not a claim that the Playwright runner or full accessibility/performance audit passed. The viewport was reset and the owned tab closed; no local server was started.
- Chapter 2–4 frontmatter now agrees with the one-chapter server policy. A new regression reads all 32 chapter files and compares their access metadata with that contract. All 59 focused tests pass in this continuation: 22 book/access/preferences, six manifest, 11 edition, six artbook and 14 public saga. The changed test file passes ESLint with zero warnings. The full build evidence belongs to the previous application-code revision, separately recorded above; this follow-up changes metadata, tests, private art and receipts only.
- A private Arion performance study was generated from the existing Slate Row casting reference, then refined to make the chalk displacement visible. Selected file: `art/studies/arion-cellar-performance-r02.png` inside the cinematic edition. Exact prompts, source hashes, edit history and maker-only 41/50 review are in `ledger/opening-performance-proof-2026-09-09.md`. No public placement or independent approval is implied. Mera and Emilia performance frames remain to be made.
- Shared demand capture is an open integration dependency. Its canonical registry/package are on another active dirty control-plane branch. Static review also found non-atomic position claims, insufficient KV-error checks, raw-count exposure below the display threshold and unverified email reconciliation. See `reviews/demand-capture-integration-2026-09-09.md`. No shared files, real signups or email audiences were changed.

Next actions: obtain an owned integration lane for the shared waitlist and close its documented failure cases; place the opening performance proof beside the existing environment plate for review; continue the Mera/Emilia sequence and developmental passes. The cover still needs a thumbnail-legible composition and separately typeset title/byline. Independent editorial, visual, commerce and release reviews remain required. The full novel, final artbook, verified sale and production release remain the goal.

### Academy teaching revision — 2026-09-09

- Previous turn classification: progress. `8cbfba62e85d40a2ce46275bb62c9def61a11042` was committed/pushed and its protected Vercel deployment `dpl_5B6Hp4HNtrSfJhzg4D43RcBRNCD8` reached READY; PR 314 remained draft. No production release occurred.
- Chapter 13 now gives Arion and Cass a modest shared success, Lio a desired coastal life beyond his examination, and the later peer rupture a specific social cost. Foundation attention includes an imperfect attempt, physical feedback and a second try. Akamoto's injury accommodation and recovery pause do not resolve the disputed clearance criterion. No plot outcome, locked canon, hammer custody or subsequent rescue causality changed.
- Corrected the manual's belt/shoulder inconsistency and the duplicate student count. The chapter and its packet/ledger received a second maker-only line/continuity pass. New prose remains private staging, not covered by the old independent movement verdict.
- Actual edition loading renders all 32 current chapters with supported markup: 77,648 words overall, 3,098 in Chapter 13. All 39 relevant access/sample, edition and artbook tests pass. Tests and counts are technical evidence only; independent literary judgment is still required.
- Fresh swarm preflight returns HOLD: no new author agents or alternate dispatch route. Text editing and small checks continued in the single owned worktree. No new image, dev server, external manuscript upload, live capture or purchase was made.

Next manuscript action: independent review of the revised teaching/attachment balance when admitted, then apply the same reader-experience scrutiny to Mera's memory lesson and Emilia's maker practicum. Keep the shared waitlist, final cover/artbook, commerce rehearsal and production release as unfinished parts of the original goal.

## Task contract

**Scope**

- Recover and rewrite the strongest existing Arcanea Book 1 material around Arion, Mera, Emilia, Headmaster Akamoto, and Malachar.
- Produce a publication-grade novel, cover, cinematic art set, responsive web reader, free preview, paid edition, and buyer-only Creator's Ledger.
- Launch the finished edition on `arcanea.ai` through a verified Vercel preview and a human-approved Polar production product.

**Owner**

- Primary: Codex on `codex/arcanea-cinematic-book`.
- Editorial council: World Architect, Character Psychologist, Fantasy & Sci-Fi Master, Publishing Strategist, Line Editor/Voice Alchemist.
- Independent release verifier: a reviewer who did not write the assessed slice.

**Owned files**

- `book/chronicles-of-arcanea/book-01-the-three-academies/cinematic-edition/**`
- `apps/web/app/books/**` only after a hotspot audit
- book-specific assets under `apps/web/public/books/**`
- book-specific commerce/entitlement files after the existing Polar and auth contracts are mapped
- this initiative's files in `planning-with-files/**`

**Non-goals**

- Changing `CANON_LOCKED.md` without Frank's explicit canon approval.
- Recasting `arcanea.academy`; it remains the World Proof Lab.
- Replacing the Arcanea platform, Studio, or existing unrelated books.
- Shipping a cosmetic client-side paywall.
- Publishing raw chain-of-thought, hidden system prompts, third-party proprietary prompts, secrets, or unlicensed source material.
- Buying a domain, creating a live Polar product, adding secrets, changing DNS, or promoting production without the relevant human gate.

**Acceptance criteria**

- One canon-fenced Book 1 bible distinguishes LOCKED, book-approved staging, and working invention.
- A complete, edited novel exists; target 95,000–110,000 words, with length earned by conflict and consequence.
- Arion, Mera, and Emilia each have independent agency, POV texture, and a consequential choice that changes the ending.
- The Academy teaches through dramatized practice, failure, cost, consent, release, and repair—not exposition lectures.
- One rewritten opening unit is free. The remainder is protected by server-verified entitlement.
- The paid edition includes the finished story, cinematic art, exportable reading formats when verified, and a curated Creator's Ledger.
- Mobile reading at 375 px and desktop reading both pass accessibility, comprehension, performance, and visual-quality gates.
- Polar signature verification, idempotent fulfillment, refund/revocation behavior, and account mapping are tested before live checkout.
- Preview is verified on Vercel; production promotion is a deliberate, reversible, human-approved action.

**Verification**

- Editorial: developmental, continuity, humanizer, sensitivity/originality, proof, and read-aloud passes.
- Technical: changed-scope lint/type/build, entitlement tests, accessibility, reduced motion, 375 px/desktop visual QA, Core Web Vitals budget.
- Commerce: valid webhook, invalid signature, replay/idempotency, paid order, refund/revoke, logged-out return, and account mismatch cases.
- Release: Vercel preview desktop/mobile, live CTA audit, metadata/OG/schema, and rollback proof.

**Rollback**

- Keep the legacy manuscript unchanged as source material.
- Implement the cinematic edition in new files/routes until migration verification passes.
- Revert the book-specific commit or route flag; restore the previous Vercel production deployment if a promoted release fails.
- Disable checkout and retain the free preview if entitlement or fulfillment is uncertain.

## Evidence recovered

- The canonical repository is `frankxai/arcanea-ai-app`; the canonical Vercel project is `arcanea-ai-app`.
- `arcanea.ai` and `www.arcanea.ai` are attached. Current production is READY.
- The current public `/books` surface exposes legacy manuscripts and internal development bibles; it is not a valid paid-edition boundary.
- Book 1 contains 20 legacy chapters and 66,498 words. It is a promising zero draft, not a finished 100–120K novel.
- The strongest reusable material is the opening Foundation event, Mera's rain-memory arrival, consent-aware training, Hollow Root atmosphere, archive redaction, institutional questioning, and the final Foundation trial.
- Main contains `@polar-sh/sdk` and a signature-verifying `/api/webhook/polar` endpoint. Fulfillment is intentionally `TODO`; no reader entitlement exists yet.
- A draft PR adds a cinematic `/story` gateway. It is adjacent work, not the book product, and must be integrated without duplication.
- `.book` is a real top-level domain; `.books` is not. `arcaneabooks.com` was available at the time of research, but a second brand/domain would dilute launch focus.
- The machine is currently HOLD for build/media workloads. Text editing is permitted; build, browser loops, and image generation remain blocked until preflight opens.

## Strategic decisions

### 1. Domain

Use `https://arcanea.ai/books` as the canonical library and a stable book route such as:

`https://arcanea.ai/books/the-three-academies`

Why:

- Arcanea already owns the reader's trust, search authority, analytics, auth, project graph, and commerce integration.
- The `.ai` ending supports the broader AI-native creative-universe positioning; the reading surface itself should feel like a literary publication, not an AI tool landing page.
- A new domain creates identity, SEO, analytics, entitlement, and operational fragmentation before the book has demand.

Later, `books.arcanea.ai` or `read.arcanea.ai` may redirect to the canonical path if campaign attribution benefits. Do not make a subdomain the source of truth. Do not purchase `arcaneabooks.com` for launch. Reconsider `arcanea.book` only after readership proves the need and trademark/domain review passes.

### 2. Product positioning

Lead with the story:

> Three young creators arrive carrying powers that institutions would rather measure than understand. When a buried Academy root begins remembering what the masters erased, they must decide whether protection without consent is another name for possession.

The durable advantage is Arcanea's moral magic architecture:

- power creates debt;
- witnesses may refuse;
- tools cannot perform moral work;
- repair completes an act;
- love never authorizes control.

Do not lead with “AI-written,” model counts, prompt engineering, or a technology demonstration. Those are provenance and process signals, not the reader promise.

### 3. Edition and price

Launch one deliberately valuable direct product:

**Founding cinematic edition — €17 one-time**

Included at launch only when complete:

- the finished novel in the premium web reader;
- verified EPUB/PDF downloads if their typography and accessibility pass;
- the cover and a restrained cinematic artbook;
- the curated Creator's Ledger;
- corrected digital editions and the first art/reader updates.

Free:

- story landing page;
- prologue plus Chapter 1 or an equivalent 8–12K-word opening movement;
- 2–3 inspected art plates;
- honest edition contents and status.

Pricing logic:

- A plain ebook should sit closer to the mainstream €9.99–€12.99 band.
- €17 is justified only as a direct cinematic bundle, not as an unfinished web novel or ordinary EPUB.
- Polar's fixed transaction component makes a meaningful bundle price healthier than a very low micro-price.
- Keep a future €12.99 Reader Edition available as a test, but do not create multiple launch SKUs before demand.
- Never claim a €100 value without evidence. Let completion, art count, word count, and reader proof establish value.

### 4. Transparency

Create a buyer-only **Creator's Ledger** with optional public excerpts.

It should disclose:

- human creative direction and final editorial responsibility;
- which model/tool families supported ideation, drafting, editing, verification, and art;
- the final owned prompt brief for each published asset or chapter pass when safe;
- skill/workflow names and version/date;
- source and canon files consulted;
- asset rights/provenance and transformation notes;
- what was rejected and why, in concise editorial terms;
- known limitations and corrections.

It must not disclose:

- chain-of-thought or hidden reasoning;
- system/developer prompts or provider-confidential instructions;
- API keys, private data, unpublished third-party text, or unsafe internal paths;
- an undifferentiated transcript that makes the reader do the editorial work.

The ledger is secondary navigation. The default reader contains only story, chapter controls, unobtrusive notes, and art that earns its place.

### 5. Commerce and access

Use Polar as Merchant of Record with one-time, forever access.

Required design:

1. A signed-in Arcanea account initiates checkout from a server-created session.
2. Checkout metadata carries a stable internal user ID and edition ID.
3. `order.paid` is signature-verified and written idempotently to an entitlement table.
4. The reader checks entitlement server-side. JavaScript state, cookies alone, or a checkout query parameter never grants access.
5. Refund/revocation events update entitlement without deleting the audit record.
6. The success route reconciles the order and explains account mismatch without exposing order data.
7. The free preview remains available when Polar or auth is unavailable.

Live product creation, pricing/tax behavior, terms checkbox, refund policy, webhook secret, and production checkout require human approval.

## Canon and continuity decision register

### Locked and safe

- Lumina and Nero duality; Nero is not evil.
- Five Elements and Ten Gates.
- Luminor is a rank, not a species or AI entity inside the fiction.
- Malachar Lumenbright's fall, imprisonment, tragic nature, and role as the core antagonist.
- Seven Academy Houses as institutions.

### Approved by the direct story brief for this working edition

- Arion, Mera, and Emilia are the central student trio.
- They journey into an Academy-centered story with Akamoto as a major teacher/mentor presence.
- The book explores teaching, practice, magic, and massive challenges with emotional depth.

These are **book-working approvals**, not an automatic edit to `CANON_LOCKED.md`.

### Working continuity pending canon elevation

- Arion inherits the strongest Kael source scenes without a bulk name replacement.
- Mera inherits the strongest Mira source scenes after a complete voice/agency rewrite.
- Emilia is Synthesis-adjacent and not an Earth-isekai character in Book 1.
- Three major Academies hold cross-institutional Houses; Akamoto Roost is a specialist Bonded field annex, not a replacement for all Academy leadership.
- Akamoto's exact dragon/bond status remains unrevealed in Book 1.
- The Foundation event damages Arion's home and relationships; casualty count stays unspecified until approved.
- “Confluence” is a feared research classification, not a triumphal chosen-one title.

### Naming/IP gate

“Avatar” and “bending” may be generic words, but their combined fantasy use creates strong franchise association. Public title, cover, metadata, and sales copy will avoid those terms until a trademark/originality review is complete. The manuscript may instead foreground Arcanean terms such as shaping, resonance, Gate-work, Foundation, prismwork, bond law, and restoration.

## Series architecture

Use a five-book reader-facing arc. Keep the Ten Gates as the deeper cosmological progression across the series rather than forcing one novel per Gate.

1. **Book 1 — Foundation / custody:** Who owns a miracle when everyone is afraid?
2. **Book 2 — Memory / truth:** What truth should be released, and who pays?
3. **Book 3 — Bond / force:** Can power be trained without becoming military property?
4. **Book 4 — Synthesis / personhood:** When does a tool become a person?
5. **Book 5 — Source / freedom:** Can love refuse control at cosmic scale?

This preserves the Ten-Gate depth while giving readers five clean commercial promises. A later series may expand individual Gates without making the debut carry ten-book commitment language.

## Book 1 production shape

- Target: 95K–110K words.
- Structure: prologue or cold open, 30–34 chapters, epilogue optional.
- POV: Arion approximately 50%; Mera approximately 25%; Emilia approximately 25%. Akamoto appears through their perception, with at most two short interludes if essential.
- Malachar: one or two brief contacts. He names pain accurately and offers a morally serious wrong answer.
- Romantic pressure: subtext only in Book 1. No triangle, no satellite heroine, no destiny bond.
- Ending: Arion refuses institutional ownership but accepts witnessed limits, repair, and training. The trio chooses one another without becoming a frictionless “found family.”

## Experience thesis

The web reader is a quiet literary instrument surrounded by cinematic thresholds.

- Reading pages prioritize typographic comfort, progress, place, privacy, and low-distraction navigation.
- Cinematic art marks acts, locations, and irreversible story turns; it does not interrupt every chapter.
- One flagship interaction lets the reader move between “story,” “world note,” and “making of” for an approved moment without losing reading position.
- Motion reveals relationships or spatial transitions; reduced motion shows the complete composition immediately.
- Audio is off by default and must be user-initiated. No autoplay video or ambient sound.
- Mobile is primary. Desktop gains wider art direction and marginalia, not a longer line length.

## Production phases and gates

### Phase A — Foundation

- Lock this strategy, page spec, scene brief, and Book 1 bible.
- Produce chapter-level beat sheet and character conflict grid.
- Resolve title shortlist and naming/IP review.
- Gate: no manuscript drafting until the continuity ledger has no release-blocking ambiguity in the current act.

### Phase B — Manuscript

- Rewrite in act-sized batches, preserving only earned legacy sentences/scenes.
- Run developmental review after each act and a separate voice/humanizer pass after meaning is stable.
- Maintain word count, POV balance, setup/payoff, consent/debt, injury, artifact, and timeline ledgers.
- Gate: no public “complete book” claim before all chapters exist and the ending survives developmental review.

### Phase C — Visual identity

- Audit existing approved Mera/Emilia/Arion/Akamoto anchors.
- Lock faces, silhouettes, materials, and palette before scene generation.
- Generate cover concepts only after opening, midpoint, and climax are stable.
- Produce a restrained 12–18 plate launch set; inspect every result at full size and on mobile crop.
- Gate: no generic fantasy, anime-bright, spandex, grimdark, accidental text, malformed anatomy, or unlogged provenance.

### Phase D — Product

- Implement the edition route and free preview with static content first.
- Add server-side entitlement and Polar checkout after the data/auth contract is reviewed.
- Add Creator's Ledger as a separate, calm layer.
- Gate: inaccessible paid content must not be present in client bundles or public static payloads.

### Phase E — Release

- Run full editorial, canon, legal/naming, accessibility, performance, commerce, and visual gates.
- Deploy one Vercel preview for the coherent release slice.
- Obtain human approvals for canon elevation, product/price, terms/refund, secrets, and production promotion.
- Promote, verify live `www.arcanea.ai` and canonical metadata, then monitor the first paid-order path.

## Human gates

- Canon elevation or change to `CANON_LOCKED.md`.
- Final title and cover brand identity.
- Legal/IP clearance and rights representation.
- Polar organization/product creation, billing/tax behavior, refund terms, and secrets.
- Database migration and production entitlement rollout.
- DNS/domain purchase.
- Production promotion and first live sale.

## Current risks

1. Canon: central characters and forward magic vocabulary are staging.
2. Originality: combined “Avatar/bending” language invites immediate comparison.
3. Editorial: the legacy draft is short and under-conflicted for the desired premium promise.
4. Product: current public routes expose material that conflicts with a paid-edition boundary.
5. Commerce: webhook verification exists; fulfillment, idempotency, refunds, and entitlements do not.
6. Operations: the machine is HOLD for builds and media, and other valuable tasks must not be archived or interrupted.
7. Claims: current `/books` metadata claims seven books and 486K+ words without distinguishing finished publication from development corpus.

## Next bounded action

Create the Book 1 conflict grid and 32-chapter master outline, then rewrite the opening movement only after the editorial council signs off on its character promises. UI implementation waits for the machine build gate.
