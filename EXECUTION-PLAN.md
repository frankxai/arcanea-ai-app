# Arcanea — Execution Plan (2026-08-08 → 2026-10-30)

**Status:** Execution layer for `STRATEGY.md`. The strategy is binding; this plan sequences it.
**Owner:** Frank. Agents execute against this.
**Source tracks:** `../publishing-house/runs/2026-08-08-four-engine-execution/`
(`LICENSING-PASS.md`, `SITE-IA.md`, `FORGE-SPEC.md`, `ACADEMY-OFFER.md`, `COMMERCE-WIRING.md`, `RELEASE-001-SELECTION.md`)

---

## 0. Correction that must be read before anything else

**The Release 001 candidate table in `STRATEGY.md` is wrong, and the correction is larger than the
RELEASE-001 track found.** Verified 2026-08-08 by recursive count against `book/`.

The table was produced by globbing `<dir>/*.md` — **top-level markdown only**. Every candidate that
keeps chapters in a subdirectory was undercounted or scored zero. The RELEASE-001 track caught this
for three candidates. It did not catch that **the same bug scored three candidates at zero, and that
the survey covered 7 of 45 collections.**

| Candidate | STRATEGY says | Verified (recursive) | Reality |
|---|---|---|---|
| Legends of Arcanea | 14 files / 50,394 w | 14 / 50,394 | Correct count, but **4 files carry unresolved `<<<<<<<` merge conflicts**; anthology of lore fragments, no chapters, no protagonist |
| Las Tierras de Luz | 10 / 18,052 | 23 / 59,681 | **6 narrative chapters × 2 languages** (EN+ES), not 12 chapters |
| Song of Van Linh | 3 / 5,102 | 12 / 31,141 | 3 chapters + full bible/characters |
| Heart of Pyrathis | 2 / 3,653 | 6 / 12,636 | 2 chapters; **75 mojibake sequences** would ship into the EPUB |
| **Luminor Rising** | **0 / 0 — "no manuscript exists"** | **4 / 21,010** | Four separate `chapter-01`s — four novella openings, no continuation |
| **Starbound** | **0 / 0 — "no manuscript exists"** | **7 / 35,293** | **Book 1 complete, closed arc** ("End of Starbound, Book One") |
| **Dragonborne** | **0 / 0 — "no manuscript exists"** | **7 / 38,061** | **Book 1 complete, closed arc**, Book 2 premise written |
| **Chronicles of Arcanea** | **never in the table** | **83 / 358,329** | **Book 1 = 20 chapters / 66,498 words, complete.** Books 2 (13ch/47k) and 3 (16ch/76k) also drafted. Gate-anchored, POV-driven |

Committed to git **2026-03-30**, tracked, clean. Sampled prose is real, voiced, and scene-level
(`chronicles` ch.1 opens on Kael, Foundation Gate, POV front matter; `dragonborne` ch.1 opens on
Theron, Fire Gate). These are not outlines.

**What this changes.** The strategy's Release 001 dilemma was "ship mass with a weak hook (Legends),
or write the hook and accept a writing project." That dilemma is an artifact of the counting bug.
**Three complete, closed-arc manuscripts already exist**, one of them a 20-chapter novel sitting
directly on the Ten Gates spine the strategy calls its best serial asset. The choice is no longer
*write vs. ship*. It is **which finished manuscript to edit**.

**What this does NOT establish.** Word count is not quality. None of these have been through the
elevation ladder, a developmental pass, or a cold read. They were produced fast in March. The
recommendation below rests on a sampled read of two chapters, not a full read — and the full read is
Frank's irreducible input (F1 below). Do not let an agent declare a manuscript shippable.

**Disagreement with the RELEASE-001 track, stated plainly:** its recommendation (Las Tierras de Luz,
Avilara) was made without seeing Chronicles, Dragonborne, or Starbound. Its reasoning — "prefer
completion over elevation, completion is the cheaper problem" — is sound and, applied to the full
candidate set, points away from its own conclusion. Las Tierras needs 6+ more chapters in two
languages. Chronicles Book 1 needs an edit.

---

## 1. THE CRITICAL PATH

### What "first euro" actually requires

Five things must be simultaneously true for a stranger to pay. Nothing else is on the critical path.

```
(a) A FILE          selected manuscript → cleaned → compiled EPUB → cover embedded
(b) A BUTTON        offer page → checkout route in payment mode, no auth wall
(c) A RAIL          Stripe activated + live keys in Vercel env          ← FRANK
(d) A DELIVERY      webhook → order row → token → signed URL → receipt email
(e) HONEST COPY     fake revenue, fake store, fake stats removed from prod
```

### The true blocking chain

```
F1 selection ──→ manuscript cleanup ──→ EPUB build ──→ cover ──┐
                                                               ├──→ offer page ──→ FIRST EURO
Stripe activation (Frank, ~50 min of clicks + 1–7 days of      │
  Stripe-side identity verification, runs in background) ──────┘
                                                     ▲
A0 kill fake store ─ A1..A8 commerce code (env-gated) ┘
```

**The credential wall is positioned wrong in the strategy.** `STRATEGY.md` lists it as blocker #1,
"~2h, nothing downstream ships without this." That is half right. It is **~50 minutes of Frank's
attention plus up to seven days of Stripe's asynchronous identity/bank verification.** Its cost is
not effort, it is *latency*. Therefore:

- It goes **first in wall-clock** (Week 1) — because the clock runs without him.
- It is **consumed last** (Week 4) — nothing else waits on it.
- It **blocks zero agent work**. Every new commerce route reads price ids from env and returns an
  honest 503 when unset (per `COMMERCE-WIRING.md`). The agent track merges to `main` before Frank
  ever opens the Stripe dashboard. The two tracks join at exactly one point: **F16, setting Vercel env vars.**

### Runs fully in parallel with the credential wall (start immediately, no Frank input)

| Parallel lane | Depends on Frank? | Notes |
|---|---|---|
| A0 — neutralize fake store (`/studio/store`) | No | **Ship first, ahead of everything.** Legal/trust liability |
| A1–A7 — schema, webhook hardening, checkout, delivery | No | Env-gated, 503 honestly when keys unset |
| SITE-IA kill pass (145 pages, 170 handlers) | No | Except the 5 pages needing copy decisions |
| Trust-liability removal (`/creator-economy`, `/community-hub`, `DEMO_STATS`) | No | Fabricated-revenue removal needs no approval |
| Forge: manifest generator, cover pipeline, print PDF | No | Highest-leverage Forge gap per `FORGE-SPEC.md` |
| `sitemap.ts` + `middleware.ts` repair | No | `authenticatedRedirectPath: '/chat'` 404s on route kill |
| Chapter reader consolidation (4 readers → 1) | No | `components/saga/chapter-reader.tsx` wins |
| Licensing: catalog re-baseline for `arcanea-mcp` | No | Sign-off (F-L) gates *publishing*, not the work |

### Not on the critical path — do not let these move first

Academy pilot (gated on Release 001 shipping, per `ACADEMY-OFFER.md` P1–P4) · OSS publication
(gated on licensing sign-off + catalog re-baseline) · canon elevation for Pyrathis · any new
drafting · any platform/lore-dashboard software.

---

## 2. WEEK-BY-WEEK (Weeks 1–12)

**Rule enforced throughout: at most one FRANK-ONLY item per week.** Week 1's single Frank item is the
consolidated queue sitting in §3 — one session, not six tasks.

### MONTH 1 — Choose and prepare Release 001 (Weeks 1–4)

---

**Week 1 · Aug 8–14 — Decide, and start the clock on Stripe**

| # | Deliverable | Who | Definition of done |
|---|---|---|---|
| 1.1 | **Frank Queue Sitting 1** (§3, items 1–9, ~2h20m) | **FRANK-ONLY** | Release 001 named in writing; Stripe application submitted (verification pending is success); founding price set; licensing signed off |
| 1.2 | A0 — fake store neutralized | AGENT | `/studio/store` unreachable in prod; no `alert("Stripe Payment...succeeded")` anywhere; navbar+footer links removed; `grep -rn "setTimeout(1500)" apps/web/app/studio` empty |
| 1.3 | Trust-liability purge, phase 1 | AGENT | `/creator-economy`, `/community-hub` deleted; `DEMO_STATS` removed from `/api/community/stats` (returns real count or 204); `/products` unsourced metrics and the "MIT" chip removed; `/records` Spotify CTAs fixed or removed. Prod grep for `4,200`/`2,800`/`6,500` returns nothing |
| 1.4 | A1+A2 — schema truth + commerce migration | AGENT | Types regenerated and diffed; migration creates `orders`, `order_downloads`, `stripe_events`, `waitlists`, private `deliverables` bucket; **F3 answered — does `waitlists` have rows?** |

> **Why A0 ships in week 1:** a simulated Stripe success dialog must not exist in the same codebase as
> a real one, and it is a live misrepresentation today. It is the cheapest trust win available.

---

**Week 2 · Aug 15–21 — Manuscript truth pass + commerce spine**

| # | Deliverable | Who | Definition of done |
|---|---|---|---|
| 2.1 | Release 001 manuscript cleanup | AGENT | Zero `<<<<<<<` conflicts; zero mojibake (`â€`); chapter order + front matter normalized; word count recorded; **no prose rewritten without Frank's pass** |
| 2.2 | A3+A5 — webhook hardened, order path live | AGENT | Every Supabase error checked and 500s on failure; `event.id` dedupe; `nodejs` runtime; replayed event creates exactly one order. Verified via `stripe trigger` + replay |
| 2.3 | A4+A6 — checkout + success, env-gated | AGENT | `app/api/checkout/book/route.ts` in `mode:'payment'`, **no auth**, `automatic_tax`, `allow_promotion_codes`; returns 503 with an honest body when `STRIPE_PRICE_*` unset; `/orders/success` server-verifies the session |
| 2.4 | Forge: manifest generator | AGENT | `release-manifest` scaffolds/refreshes from a run dir; re-running after a chapter edit updates checksums instead of going stale. Closes `FORGE-SPEC.md` gap #1 |
| — | *(no Frank task)* | — | Stripe verification is running in background |

---

**Week 3 · Aug 22–28 — Wave 0: prove the rails end-to-end**

| # | Deliverable | Who | Definition of done |
|---|---|---|---|
| 3.1 | **Wave 0 build** — Release 001 through `book-build.mjs` | AGENT | Valid EPUB3 on disk, opens in a reader, TOC correct, **cover embedded** (closes `FORGE-SPEC.md` gap #2 — `book.json` currently has no `cover` key and the Golden Age EPUB shipped coverless) |
| 3.2 | Cover produced | AGENT | 1600×2560 JPEG, legible title at thumbnail size, rights-clean, referenced from `book.json` |
| 3.3 | A7+A8 — delivery + offer page | AGENT | `/download/[token]` issues 300s signed URLs, soft cap ~25/30d, revocable; `app/books/release-001` renders one Buy button; end-to-end test-mode purchase delivers the real EPUB |
| 3.4 | **Frank: read the Release 001 manuscript end to end** | **FRANK-ONLY** | Verdict recorded: ship as-is / edit list / reject. ~4–6h. This is the one thing no agent can do |

---

**Week 4 · Aug 29–Sep 4 — Go live**

| # | Deliverable | Who | Definition of done |
|---|---|---|---|
| 4.1 | **F16 — Stripe live keys + Vercel Web Analytics ON** | **FRANK-ONLY** | Env set on prod (test keys on preview); Vercel Analytics toggled; ~20 min. **The single join point of the two tracks** |
| 4.2 | A9+A10 — funnel events + honest founding copy | AGENT | 8 funnel events firing into `lib/analytics/events.ts`; 40%-off rewritten to *40% off Release 001, 100 redemptions, Stripe-enforced*; `/founding-circle` terms page dated and live; unbounded "direct advisory access" deleted |
| 4.3 | A11+A12 — receipt email + asset upload | AGENT | EPUB in private `deliverables` bucket; Resend receipt behind a flag; Stripe "Successful payments" email on as the day-one fallback |
| 4.4 | **F20 — one live purchase, then refund it** | *(rolls into 4.1 sitting)* | Real card charged, file delivered, refund issued, token confirmed dead. **This is the first euro.** |

---

### MONTH 2 — Build the release surface (Weeks 5–8)

**Week 5 · Sep 5–11 — The 83% route kill**

| # | Deliverable | Who | Definition of done |
|---|---|---|---|
| 5.1 | Kill pass: 145 pages + 170 handlers | AGENT | 438 routes → 48 pages / 24 handlers. `pnpm build` green; `middleware.ts` `authenticatedRedirectPath` no longer points at a dead `/chat`; navbar (38/44 dead) and footer (28/34 dead) replaced |
| 5.2 | Reader consolidation | AGENT | `lib/content` + `lib/saga/loader` merged **before** `/library` folds into `/books` (the one hard ordering dependency). One reader: `components/saga/chapter-reader.tsx` |
| 5.3 | `sitemap.ts` emits chapters | AGENT | Every Release 001 chapter URL present; `/books` outranks `/chat` (which no longer exists) |
| 5.4 | `/academy/certification` removed | AGENT | Gone. `STRATEGY.md`: "No unsupported certification" |

**Week 6 · Sep 12–18 — Codex + measurement**

| # | Deliverable | Who | Definition of done |
|---|---|---|---|
| 6.1 | `/codex` + 5 essential entries | AGENT | Built from generated `book/_index/codex-links.json` off `.arcanea/lore/`; `STAGING_*` entries render **EXPLORATORY**, never canon; spoiler-safe chips keyed to `firstAppearance.order`. **`CANON_LOCKED.md` read-only** |
| 6.2 | Legends of Arcanea → free Codex | AGENT | Merge conflicts resolved into one Gate-frequency table (pending F-C), published as free reference, **not** as a paid release |
| 6.3 | Measurement instrumentation live | AGENT | `chapter_complete` scroll-depth events firing; stranger-buyer list query written (§5) |
| 6.4 | **Frank: mid-point review** (§5) | **FRANK-ONLY** | Gate readings recorded against Week-12 thresholds; continue/adjust decision written. ~45 min |

**Week 7 · Sep 19–25 — Print + KDP**

| # | Deliverable | Who | DoD |
|---|---|---|---|
| 7.1 | Print PDF pipeline | AGENT | `book-build.mjs` emits a press-ready PDF without a manual browser step (`FORGE-SPEC.md` gap #3) |
| 7.2 | Front-matter assembly | AGENT | Copyright page, disclaimer, acknowledgements auto-assembled (gap #4) |
| 7.3 | KDP-ready edition | AGENT | Passes KDP previewer; **KDP Select exclusivity left OFF** pending a deliberate decision |
| 7.4 | Email capture on arcanea.ai | AGENT | Consented double-opt-in; replaces the 29-subscriber dead end |

**Week 8 · Sep 26–Oct 2 — Licensing + OSS extract**

| # | Deliverable | Who | DoD |
|---|---|---|---|
| 8.1 | `arcanea-mcp` catalog re-baseline | AGENT | Catalog regenerated against upstream ≥`1ff36675` (the 2026-06-12 MIT commit); NOTICE attribution corrected to "Open Generative AI Contributors"; `private:true` may then be lifted |
| 8.2 | Provenance + claims scrub | AGENT | `src/taste.ts:4-5` competitor disparagement removed; `C:/Users/frank/...` path leak out of README; `docs/PRD.md` roadmap unshipped |
| 8.3 | OSS extract homed | AGENT | Release-manifest schema + validator + `book-build.mjs` in `author-os` (MIT); LICENSE files kept **byte-standard** so GitHub's detector reports a licence; provenance in NOTICE only |
| 8.4 | **Frank: confirm `arcanea-studio` position** | **FRANK-ONLY** | It is already public under a self-written MIT against its own written hold. Decide: keep public + re-paper, or accept the exposure. ~20 min |

### MONTH 3 — Publish and learn (Weeks 9–12)

**Week 9 · Oct 3–9 — Ship publicly**
9.1 Release 001 announced to list + public (AGENT drafts, Frank sends — counts as his one item) ·
9.2 Chapters live on the reader, indexed · 9.3 Amazon mirror live · 9.4 Cadence page published with a
date Frank will actually hit.

**Week 10 · Oct 10–16 — Derivatives, cheaply**
10.1 Two short-form formats from existing chapters · 10.2 One musical motif · 10.3 Character/style
consistency check in Forge · 10.4 *(no Frank task)*.

**Week 11 · Oct 17–23 — Rung 2, not the pilot**
11.1 **€150 async written review** opens on arcanea.academy — the ladder's missing rung, and the first
euro from the Academy engine · 11.2 Booking path that is not `mailto:` · 11.3 Academy analytics +
consented capture (Academy P4) · 11.4 **Frank: deliver review #1** (FRANK-ONLY, ~3h).

**Week 12 · Oct 24–30 — Measure and decide**
12.1 Post-launch metrics report against §5 · 12.2 Build log + case study published (OSS engine's one
case study) · 12.3 **Frank: the Week-12 review** (FRANK-ONLY, ~1h) — RAISE / RESHAPE / STOP on each
engine · 12.4 Academy pilot opens **only if** P1–P6 are all true.

> **The Academy pilot is not in weeks 1–12.** Per `ACADEMY-OFFER.md`, earliest honest open is Release
> 001 public + ~5 weeks = **mid-November**, and it costs ~12h/week, which cannot run concurrently with
> release production. Weeks 11–12 open rung 2 (€150 reviews) instead — cheaper, faster, and it is what
> discovers whether anyone pays at all.

---

## 3. THE FRANK QUEUE

One sitting. Ordered so the items with external latency fire first. **~2h20m total.**

| # | Item | Time | Why now | Output |
|---|---|---|---|---|
| **1** | **Stripe: confirm/create account, submit activation** (entity, ID, IBAN) — F4, F5, F6 | **25 m** | **Do this first.** Stripe's verification takes 1–7 days and runs while you sleep. Everything else in this list is instant by comparison | Activation submitted |
| **2** | Check whether `waitlists` has rows (Supabase dashboard) — F3 | **5 m** | `app/api/waitlist/route.ts:18` inserts into a table that exists in neither the migrations nor the generated types. Every Founding Circle signup may have 500'd. Determines whether the 40% promise has anyone to honour | Row count, or "table absent" |
| **3** | **Release 001 selection** — F1 | **30 m** | The largest downstream unblock. **Read §0 first — the strategy's table is wrong.** Choose from the corrected set. My recommendation and its uncertainty are below | Manuscript named in writing |
| **4** | Founding pilot price — replaces the $9,800 residency | **10 m** | Recommendation on file: **€750**, 5 seats, 6 weeks, full refund through week 2. €9,800 requires outcome claims the repo's own gate blocks | Price + seat count |
| **5** | Book prices — F2 | **10 m** | Proposed €29 / €17 founding / €39 bundle | Three numbers |
| **6** | **Licensing sign-off** — the open/private split | **20 m** | `LICENSING-PASS.md` decision table. Apache-2.0 for `arcanea-mcp` (§6 trademark carve-out is load-bearing — 11 `arcanea_*` tool names bake the franchise into a public API); MIT stays on `author-os`; BUSL rejected everywhere; canon/manuscripts never open | Signed table |
| **7** | Stripe product + prices + coupon — F10, F11, F12 | **20 m** | One-time price in EUR, tax-inclusive; `FOUNDING100` capped at `max_redemptions: 100` so the promise is enforced by Stripe, not by memory | `price_...` ids |
| **8** | Stripe webhook endpoint + copy `whsec_` — F14 | **10 m** | `https://arcanea.ai/api/stripe/webhook`, 4 events | Signing secret |
| **9** | Enable receipt emails, Stripe Tax, payment methods — F8, F9, F13 | **10 m** | F8 gives proof-of-payment on day one with zero code. **Confirm EU OSS with an accountant — this plan is not tax advice** | Toggles on |

**Deferred to their scheduled weeks (do not do these now):**

| # | Item | Week | Time |
|---|---|---|---|
| 10 | **F16 — set Vercel env vars + enable Web Analytics** | Week 4 | 20 m |
| 11 | **F19/F20 — test purchase, then one live purchase and refund** | Week 4 | 20 m |
| 12 | **Read Release 001 end to end** | Week 3 | 4–6 h |
| 13 | **Pyrathis Sister-World canon approval** | **Only if Pyrathis is selected** | 1 h |
| 14 | **Canon elevation decisions** (`STAGING_CANON_ELEVATION_2026-08-08.md`) | Week 6 | 1 h |
| 15 | `arcanea-studio` public-status decision | Week 8 | 20 m |

### On items 13 and 14 — canon decisions are smaller than the strategy implies

`STRATEGY.md` lists Pyrathis Sister-World approval as a Release 001 blocker. **It is only a blocker if
Pyrathis is Release 001**, and Pyrathis is the weakest candidate (12,636 words, 2 chapters, 75
mojibake sequences). Under any other selection it drops off the critical path entirely.

Three canon items *are* real and belong to whichever manuscript wins:

- **`CANON_LOCKED.md:147`** — "Locked novel: *Las Tierras de Luz* (Veldoria-set, 12 chapters)". The
  current `las-tierras-de-luz/` has **6 narrative chapters in two languages** (12 files); the archived
  `las-tierras-de-luz-valle-v0/` has **12 actual chapters** and a different protagonist. The locked
  entry cannot describe both. Frank must say which. *(Not fixed here — `CANON_LOCKED.md` is read-only
  to agents.)*
- **Avilara** — Release 001's setting under the Las Tierras option appears **nowhere** in
  `CANON_LOCKED.md`.
- **Gate frequencies** — Legends' four merge-conflicted files give contradictory values on both sides.
  One canonical table needed before the Codex publishes.

### Recommendation on item 3, with its uncertainty stated

**Recommended: `chronicles-of-arcanea/book-01-the-three-academies` — 20 chapters, 66,498 words, complete.**

It is the only candidate that is simultaneously (a) finished with a closing beat, (b) Gate-anchored
with POV front matter — i.e. natively on the Ten Gates spine the strategy calls its best serial
asset, (c) followed by two more drafted books, so Release 002 and 003 already have raw material, and
(d) free of merge conflicts, TK markers, and mojibake.

**Fallback if a read-through finds the prose weak: `dragonborne/book-01-the-last-clutch`** — 38,061
words, closed arc, Book 2 premise already written, strongest sampled opening voice, and short enough
that a full edit is a weekend rather than a month.

**Against Las Tierras** (the RELEASE-001 track's pick): it needs 6+ new chapters written twice, in two
languages, before it is a book. That is the writing project the strategy was trying to avoid, and
three finished alternatives exist.

**The uncertainty is real and it is Frank's to close.** I sampled two chapters. These manuscripts were
committed in a single March push and have never been through a developmental pass or a cold read.
Volume is not quality. If the Week-3 read finds Chronicles Book 1 unshippable, the fallback costs one
week, not one month — which is exactly why the read is scheduled before the launch and not after.

---

## 4. AGENT WORK QUEUE

Ordered by dependency. Nothing here needs Frank. Each item states its acceptance test.

### Tier 0 — ship immediately, blocks nothing, unblocks trust

| ID | Work | Acceptance test |
|---|---|---|
| A0 | Neutralize `/studio/store` fake Stripe | `grep -rn "Payment of\|Stripe Connect payout\|setTimeout(1500)" apps/web/app/studio` → empty. Route 404s or redirects |
| T1 | Delete `/creator-economy` (Elena $4,200/mo, Marcus $2,800, Priya $6,500 — fabricated) | Route gone; `grep -rn "4,200\|2,800\|6,500" apps/web/app` → empty |
| T2 | Delete `/community-hub` (6 invented creators, Guardian art as headshots, dead `whop.com/arcanea` link) | Route gone; no `whop.com` reference in prod |
| T3 | `DEMO_STATS` out of `/api/community/stats` | Endpoint returns real counts or 204. Never serves 389/1,247/8,432 |
| T4 | `/products` unsourced metrics + homepage "MIT" chip | No unsourced counts; no licence claim that contradicts `arcanea-mcp` |
| T5 | `/records` Spotify CTAs (both point at the Spotify root) | Real URLs or CTA removed |
| T6 | Unpublish "Coming Soon" indexable routes | `/books/drafts/[slug]/{map,read}`, `/command/agents` return 404, not a stub |

### Tier 1 — commerce spine (env-gated; merges before Frank touches Stripe)

| ID | Work | Acceptance test |
|---|---|---|
| A1 | Regenerate Supabase types, diff against migrations | Drift documented. **Generated types are the schema of record** — migrations say `profiles.tier`, live DB has `subscription_tier` |
| A2 | Commerce migration | `orders`, `order_downloads`, `stripe_events`, `waitlists`, private `deliverables` bucket exist; RLS denies anon reads |
| A3 | Harden existing webhook | Every Supabase result checked; failure returns 500 not `{received:true}`; `event.id` dedupe; `nodejs` runtime. Replay creates one row |
| A4 | `app/api/checkout/book/route.ts` | `mode:'payment'`, **no auth gate**, `automatic_tax`, `allow_promotion_codes`, no `payment_method_types` pin. 503s honestly when price env unset |
| A5 | Webhook payment branch | Order row + hashed token + email, in its own try/catch. `stripe trigger checkout.session.completed` produces a complete order |
| A6 | `/orders/success` | Server-verifies session with Stripe; never trusts a query param |
| A7 | `/download/[token]` + signed-URL API | 300s expiry; ~25/30d soft cap routes to a human, never hard-locks; revocation kills the token |
| A13 | `.env.example` documents every new var | Names only. **No secret ever reaches a repo or a chat** |
| A14 | `stripe listen` / `stripe trigger` suite incl. replay + refund | All pass in test mode with zero live keys present |

### Tier 2 — needs Release 001 selected (F1)

| ID | Work | Acceptance test |
|---|---|---|
| M1 | Manuscript cleanup | Zero `<<<<<<<`, zero `â€`, normalized front matter, recorded word count. **No prose rewritten** |
| M2 | Cover | 1600×2560, legible at thumbnail, rights-clean, wired into `book.json` |
| M3 | EPUB via `book-build.mjs` | Valid EPUB3 **with cover in the OPF** — today's build emits a coverless OPF that storefronts reject |
| A8 | `app/books/release-001` offer page | One Buy button; honest copy; no claim not backed by a file on disk |
| A12 | Upload EPUB to private bucket | Object present; anon direct fetch denied |

### Tier 3 — Forge gaps (parallel, no Frank input)

| ID | Work | Acceptance test |
|---|---|---|
| G1 | **Manifest generator** — highest leverage | Scaffolds/refreshes a manifest from a run dir; editing a chapter and re-running updates checksums rather than going stale |
| G2 | Cover production step | Part of the build, not a manual act |
| G3 | Print PDF | Emitted by the tool, no manual browser step |
| G4 | Front-matter assembly | Disclaimer + copyright + acknowledgements auto-assembled |
| G5 | Provenance capture at dispatch | New runs record model attribution. *(The Golden Age run's provenance is unrecorded and unrecoverable — do not backfill it with guesses)* |
| G6 | Web-chapters compiler | Same source → reader routes |

### Tier 4 — site surgery (after Tier 1 merges, to avoid clobbering)

| ID | Work | Acceptance test |
|---|---|---|
| S1 | `lib/content` + `lib/saga/loader` merge | **Must precede S2.** The one hard ordering dependency |
| S2 | `/library` → `/books`; kill 3 redundant readers | One reader survives; every old URL 301s |
| S3 | Kill 145 pages / 170 handlers | 438 → 48 pages / 24 handlers. `pnpm build` green |
| S4 | Replace navbar + footer | Zero dead links (`grep` every `href` against the route table) |
| S5 | `middleware.ts` redirect repair | `authenticatedRedirectPath` no longer `/chat`. **Login must not 404** |
| S6 | `sitemap.ts` emits chapters | Every Release 001 chapter indexed |
| S7 | `/codex` + `book/_index/codex-links.json` | Generated from `.arcanea/lore/`; `STAGING_*` renders EXPLORATORY; **`CANON_LOCKED.md` unmodified** |

### Tier 5 — licensing / OSS (work now, publish after F-6 sign-off)

| ID | Work | Acceptance test |
|---|---|---|
| L1 | `arcanea-mcp` catalog re-baseline | Regenerated against upstream ≥`1ff36675`; MIT notice shipped. **Until green, `private:true` stays** |
| L2 | NOTICE attribution fix | Credits "Open Generative AI Contributors", not "Anil Matcha" |
| L3 | Competitive-claim + path-leak scrub | `src/taste.ts:4-5` clean; no `C:/Users/frank/...` in README |
| L4 | LICENSE files byte-standard everywhere | GitHub reports a real SPDX licence for `author-os`, `arcanea-studio`, `frankxai/arcanea` — all three currently report `license=NONE`, which makes the OSS engine invisible to corporate scanners |
| L5 | Copyright lines standardized | Every LICENSE says **Frank Riemer**, not "FrankX" or "Arcanea" |

---

## 5. THE MEASUREMENT PLAN

The six behavioral gates from `STRATEGY.md`, each bound to a specific query. **No number here exists
today** — Vercel Web Analytics is off on both projects and zero books have sold. Every source below
becomes real only after Week 4 (F16).

| Gate | Number | Exact source | Threshold by Week 12 |
|---|---|---|---|
| **Did strangers finish?** | Chapter-completion rate | `analytics_events` where `event='chapter_complete'` (scroll-depth ≥90%, fired by the consolidated reader, built W6) ÷ `chapter_view` for ch.1 | **≥25%** reach the final chapter |
| **Did anyone buy without knowing Frank?** | Stranger sales | `orders.email` **NOT IN** (the 29 newsletter subscribers ∪ a manually maintained known-contacts list). Query written W6 | **≥3** stranger purchases |
| **Did readers return?** | Return rate | Vercel Web Analytics returning visitors on `/books/*`, cross-checked against `chapter_view` for ch.N+1 by the same anon id ≥24h later | **≥20%** return |
| **Did a buyer want the next release?** | Next-release demand | One-question post-purchase email + click count on the cadence page's notify control | **≥30%** of buyers |
| **Did an external dev finish the OSS workflow unaided?** | Unprompted external completion | An issue, PR, or discussion from a non-Frank GitHub account showing a completed run. **npm downloads do not count** | **≥1** |
| **Did an Academy creator publish?** | Public release | Manual — a public URL to work produced through the ladder | **≥1** from rung 2 |

**Instrumentation still to build (W6, agent):** `chapter_complete` scroll-depth events; the
stranger-buyer SQL; the known-contacts list. Vercel Analytics gives sessions and referrers but
**cannot** answer "did they finish" or "is this buyer a stranger" — those need the events table.

**Platform trigger (from `STRATEGY.md`):** build canon management only if lab creators repeatedly
demand it. `ACADEMY-OFFER.md` sharpens this to: **≥4 of 5 rank canon/continuity top AND ≥3 would pay
separately.** Cannot be evaluated before a cohort runs — i.e. **not in this plan's horizon.** Any
proposal to build a lore dashboard before then is out of order.

**Review dates:** mid-point **2026-09-18** (Week 6, ~45 min) · full review **2026-10-30** (Week 12,
~1 h). Week 12 verdict per engine: **RAISE / RESHAPE / STOP.**

**Honesty rule:** a gate with no instrumented source is reported as **"not measured"**, never
estimated. Reporting a plausible number for an unmeasured gate is the failure mode this whole plan
exists to correct.

---

## 6. KILL LIST

| Stop doing | Scale | Why |
|---|---|---|
| **Drafting new books** | **45 collections, 414 files, 1,447,425 words, zero sold** | The estate's constraint has never been manuscript volume. It is that nothing is finishable, buyable, or measured. **Freeze all new drafting until Release 001 has sold to a stranger.** Two complete Book 1s sat unshipped for four months while the strategy recorded them as nonexistent |
| **Route stubs and "Coming Soon" pages** | 145 pages + 170 handlers killed; 663 files / 91,500 lines in `app/` alone | 61% of pages and 88% of API handlers serve nothing. Every one is a maintenance tax and a credibility leak |
| **Fabricated social proof** | `/creator-economy`, `/community-hub`, `DEMO_STATS`, `/products` metrics | Named people with invented monthly revenue, invented creators using Guardian art as headshots, and hardcoded stats served whenever the real count is 0 — i.e. always. This is the worst asset on the domain |
| **Simulated commerce** | `/studio/store` | `alert("Stripe Payment of $X succeeded!")` after a 1.5s timer, plus a fake "Connect payout processed" and a `useState(350)` credit balance shown to every visitor |
| **Phantom dev scripts** | 7 of 8 `dev:*` targets | `dev:academy|chat|studio|gallery|library|realms|sanctuary` filter to packages that do not exist. Only `dev:web` resolves |
| **Unwired apps** | `apps/agenthub`, `apps/agenthub-old` | Not in the deploy path. Archive or delete — do not maintain |
| **Unconsumed workspace packages** | 65 packages, one deployed app | Inventory mistaken for capability. Keep what `apps/web` imports; archive the rest |
| **Four parallel chapter readers** | 3 of 4 | Same `book/` tree, three redundant implementations |
| **Certification** | `/academy/certification` | Ten-gate certification for humans *and agents*, "join the marketplace" — directly against `STRATEGY.md`'s "No unsupported certification" |
| **Unbounded promises** | "permanent 40% lifetime discount", "direct advisory access to the developer" | Made by a page whose CTA never reached a payment route, on a waitlist table that may not exist. Honour the 40% with a bounded, Stripe-enforced instrument; delete the advisory promise |
| **Opening repos before the licensing pass** | `arcanea-mcp` | Ships a catalog derived from upstream code taken before any licence existed. `private:true` is the gate — leave it until L1 is green |
| **Pushing per-change / running cloud CI as iteration** | — | Draft-first PRs, batch commits, `[skip ci]` on docs. Verify locally |

---

## 7. RISKS — top 5, each with its early-warning signal

**R1 · "Prepare Release 001" quietly becomes "write Release 001."**
The failure that has already happened once: sustained drafting produced 1.45M words and zero sales. Selecting a *finished* manuscript is the structural defence; the risk is that the Week-3 read
turns into a rewrite.
→ **Signal:** Week 4 arrives with no valid EPUB on disk. Or: the selected manuscript's word count
moves more than ±10% between Weeks 2 and 8. Either means editing became authoring.
→ **Response:** freeze the edit, ship the cleaner fallback (Dragonborne, 38k, closed).

**R2 · Stripe activation stalls on entity, ID, or banking.**
It is the only item with unbounded external latency and it gates the entire commerce track's payoff.
→ **Signal:** no "payments enabled" in the Stripe dashboard by **end of Week 2**.
→ **Response:** escalate to Stripe support immediately; do not silently wait. Lemon Squeezy as
merchant-of-record is the fallback (it also removes the EU VAT question) — but only if Week 2 fails,
because switching rails costs the A4–A7 work.

**R3 · The estate resumes activity theater instead of shipping.**
45 collections, 65 packages, 438 routes, 8 dev scripts for 1 app. The pattern is generating inventory
and calling it progress.
→ **Signal:** any commit creating a **new** directory under `book/`, or a new workspace package, or a
new route group, before Release 001 has sold to a stranger. Also: total word count rising while zero
chapters have been through an editorial pass.
→ **Response:** revert the addition. The freeze in §6 is not advisory.

**R4 · Real checkout ships next to fake checkout, or fabricated proof survives launch.**
A live Stripe purchase adjacent to `alert("Stripe Payment succeeded!")`, or `/creator-economy`'s
invented revenue still indexed on launch day, converts a credibility problem into a
misrepresentation problem the moment money changes hands.
→ **Signal:** `/studio/store` or `/creator-economy` still reachable in production at **end of Week 1**.
→ **Response:** A0 and T1–T3 block every other agent task. They are Tier 0 for this reason.

**R5 · The first euros all come from people who already know Frank.**
29 subscribers, a personal network, and a launch post can produce revenue that proves nothing about
the business. The strategy's gate is explicitly *"bought without knowing Frank personally."*
→ **Signal:** at Week 10, every `orders.email` matches the subscriber list or known contacts.
→ **Response:** do **not** raise prices, do **not** open the Academy pilot (its L1 threshold requires
≥2 non-relationship buyers), and treat distribution — not production — as the Month 4 problem.

**Runner-up, worth naming:** the Academy pilot costs ~12h/week and cannot run concurrently with
release production; scheduling it before mid-November guarantees one of the two fails. This plan
keeps it out of Weeks 1–12 deliberately.

---

## Appendix — what this plan deliberately does not do

- Does not modify `.arcanea/lore/CANON_LOCKED.md` or any LOCKED lore. The three canon defects in §3
  are **reported for Frank**, not fixed by agents.
- Does not modify `arcanea-studio`'s LICENSE.
- Does not schedule the Academy pilot (prerequisites P1–P6 unmet; earliest honest open ≈ mid-November).
- Does not open any repo before the licensing sign-off and the `arcanea-mcp` catalog re-baseline.
- Does not assert a traffic, conversion, or audience number. There are none. Vercel Web Analytics is
  off on both projects; zero books have ever sold.
