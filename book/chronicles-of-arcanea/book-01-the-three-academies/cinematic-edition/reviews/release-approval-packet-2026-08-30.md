---
title: The Last Free Path release approval packet
status: awaiting-human-decisions
date: 2026-08-30
edition_id: book-01-founding-cinematic
---

# Purpose

This packet collects the decisions that automation must not make. It is not an approval receipt. The manuscript, protected reader, checkout gates, cover study, plate suite, and deterministic export pipeline can continue through draft verification while every item below remains open. Public sales and commercial artifact builds must remain disabled.

# Recommended product decision

Use `arcanea.ai/books/the-last-free-path` as the canonical reading address. Keep `/books` as its redirect. A future `books.arcanea.ai` may redirect to the same path; do not create a second reading product or buy another domain for launch.

Offer the finished founding cinematic edition at €17 one-time. Keep chapters 1–4 free. The paid promise is the complete edited novel, responsive reader, EPUB, screen and print PDFs, cinematic artbook, and optional Creator's Ledger—not the fact that AI tools were used.

The Creator's Ledger should remain separate from the reading surface. It may disclose owned task-prompt summaries, tool and skill roles, sources, art provenance, editorial interventions, version history, rights state, and honest missing evidence. It must not disclose hidden reasoning, chain-of-thought, system prompts, credentials, private paths, confidential data, or third-party protected instructions.

# Creator decisions

## 1. Title

Recommended: *The Last Free Path*.

Why it leads: it names the book's actual moral and material conflict, survives beyond the Academy setting, and reads as adult literary fantasy rather than a generic school adventure. *The Three Academies* remains a useful series-development label but is less distinctive as the commercial title.

- [ ] Approve *The Last Free Path* for title, metadata, routes, and cover lockup.
- [ ] Confirm originality and legal/title clearance.
- [ ] Reject and provide the exact replacement title.

Decision: ____________________  Approver: ____________________  Date: __________

## 2. Publication byline

No author name is inferred. Draft artbooks display `Byline pending approval`; release builds require an exact approved string and receipt.

- [ ] Approve exact byline: ______________________________________________
- [ ] Approve whether Arcanea appears as publisher/imprint rather than author.

Decision: ____________________  Approver: ____________________  Date: __________

## 3. Book continuity promoted to Arcanea canon

Only Creator Frank may promote staging continuity into Arcanea canon. Review the complete `BOOK_BIBLE.md`, movement QA reports, and 32 chapter packets. At minimum, decide whether the following may become durable universe canon:

- three major Academies with Seven Houses operating across institutions;
- the Akamoto Roost annex and Akamoto's bounded role;
- Emilia's Synthesis-adjacent practice;
- the Foundation event and its consequences;
- the unauthenticated `Hollow Root` records label;
- Confluence as a feared research term;
- the five-book custody, memory, bond, personhood, and freedom arc;
- Malachar's Book One remote influence and disclosure timing, strictly consistent with his locked Shadowfen seal. Approval must not imply escape, physical presence, a new location, a canon-wide network, or authentication of the lower structure's identity.

Do not approve any claim that the lower structure is alive, a person, intentional, agentic, requesting, or authoring unless new evidence and an explicit canon decision support it.

- [ ] Approve all listed staging continuity.
- [ ] Approve only the items I mark in the list above; keep every unmarked item in staging.
- [ ] Keep all book-specific continuity staging for this edition.

Creator decision: ____________________  Creator Frank: ____________________  Date: __________

Any promotion requires the corresponding update to the locked canon SSOT and its approval log. An edition manifest or artbook receipt alone cannot make book continuity canon.

## 4. Character casting and cover

Review the protected cover study at `apps/web/public/images/books/the-last-free-path/cover-held-interval-preview.png` and the character direction in `ART_DIRECTION.md`.

- [ ] Approve Arion, Mera, and Emilia's visual casting.
- [ ] Approve the cover composition as the basis for final typography and derivatives.
- [ ] Approve the title/byline lockup after 120-pixel thumbnail, mobile, and print proof checks.
- [ ] Approve commercial-use rights after current terms and provenance review.

Decision: ____________________  Approver: ____________________  Date: __________

## 5. Cinematic plates

Review all nine primary plates and nine intentional companion compositions. Plates 04, 06, and 08 are explicitly labeled editorial studies rather than literal scene frames.

- [ ] Approve character continuity and casting across all selected plates.
- [ ] Approve the three labeled editorial departures.
- [ ] Approve commercial-use rights and the public-safe provenance wording.
- [ ] Approve captions, image descriptions, and final crop behavior.

Decision: ____________________  Approver: ____________________  Date: __________

## 6. Commerce and buyer promise

- [ ] Approve €17 one-time pricing and chapters 1–4 as the free boundary.
- [ ] Approve Polar product name, exact book/edition metadata, tax handling, receipt copy, and refund terms.
- [ ] Approve the personal-use download license wording.
- [ ] Approve sandbox proof that a purchase unlocks the book, a full refund removes access, service outages never expose paid files, and each private Blob download checks the buyer's entitlement.

Decision: ____________________  Approver: ____________________  Date: __________

## 7. Public route integration

PR #299 should be extracted and rewritten, not merged as-is. Its cinematic `/story` shell may return after its imagery passes provenance/rights review and its Kael material is replaced by the Arion opening. See `integration-pr-299-decision-2026-08-30.md`.

- [ ] Approve the replacement path `/story` → origins → Arion preview → paid edition.
- [ ] Approve closing PR #299 as superseded after replacement or archival notes exist.

Decision: ____________________  Approver: ____________________  Date: __________

# Activation sequence after approval

Engineering evidence, 2026-09-09: all seven web workspace dependencies build; the complete web TypeScript check and production build pass (471 static pages). All 37 cinematic tests pass: 14 delivery/entitlement, six manifest, 11 novel, and six artbook cases. Changed-scope ESLint passes, including the CommonJS publishing scripts after correcting their plugin coverage. The installed Vercel Blob SDK supplies its own types; the earlier handwritten shim has been removed. Final manifest receipt validation, buffer limits, overwritten files, truncation, trailing bytes, storage failure, timeout, and cancellation are covered by local tests. These results do not stand in for independent review, real Polar sandbox transactions, artifact inspection, final-file load tests, or desktop/mobile preview QA. The build still reports eight existing tracing warnings in the separate saga loader.

1. Record exact release, editorial, legal, rights, casting, title, and byline receipts in `edition-spec.json` and `artbook-spec.json`. Bind `edition-spec.json` to the exact approved manuscript SHA-256. Record any Creator-approved canon promotion separately in the locked canon SSOT and its approval log.
2. Produce final title/byline typography and approved derivatives.
3. Render EPUB, novel PDFs, and the 21-page tagged artbook from a clean commit.
4. Inspect every file, desktop/mobile reader state, keyboard flow, reduced motion, and protected route. Verify the final manifest contains the four promised buyer downloads with matching hashes and no release-blocking pending item. Verify each file remains below the 128 MiB delivery ceiling and that approved files download while overwritten, truncated, or stalled files return no artifact bytes. Measure delivery with the final file sizes.
5. Run Polar sandbox purchase/refund and private Blob download verification.
6. Resolve or supersede PR #299.
7. Keep sales test-only in the private Vercel preview environment and use Polar sandbox/test mode. Repeat the complete verification there, then request a separate production approval. Only the human release lead may record the verified private-manifest hash and source commit in the checkout receipt variables. The application must fetch and verify those exact manifest bytes and require the manifest source commit to match Vercel's deployed git revision before checkout can open. Live charging requires explicit human release-lead approval; automation must not enable it.

Rollback is `CINEMATIC_BOOK_SALES_ENABLED=false`; existing buyer verification and the four free chapters remain available.
