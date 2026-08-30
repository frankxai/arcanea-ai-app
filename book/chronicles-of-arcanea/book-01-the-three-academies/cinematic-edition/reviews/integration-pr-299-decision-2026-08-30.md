---
title: PR 299 cinematic story integration decision
status: approved-internal-direction
date: 2026-08-30
scope: editorial and route integration; no canon, rights, or production approval
---

# Decision

Do not merge PR #299 as written. Extract and rewrite its strongest cinematic ideas on the current book branch, then close the older PR as superseded only after the replacement is accepted.

The reusable contribution is its `/story` composition: a skip link, long-form cinematic pacing, paired Lumina and Nero panels, responsive visual chapters, and a restrained path into deeper reading. Its Kael excerpt, legacy `/books/book1/*` links, `/books` library assumption, metadata, sitemap edit, and verifier belong to an earlier Book One identity.

# Canon boundary

The locked origin remains:

- Lumina is First Light and Form-Giver.
- Nero is fertile darkness and primordial potential, not evil.
- Shadow is corrupted Void, not Nero or darkness itself.

The current cinematic series centers Arion, Mera, and Emilia. Kael remains archived source material; he is not presented as the protagonist of this edition or as the opening of the same *Three Academies* story.

Arion, Mera, Emilia, the five-book plan, and book-specific Academy procedures remain staging continuity until Creator Frank explicitly approves their canon promotion and the decision is recorded in the locked canon SSOT and its approval log. A future `/story` page must visibly distinguish locked origin cosmology from the current cinematic series.

# Replacement route

The coherent public path is:

`/story` → Arcanea origins → Arion's free opening → `/books/the-last-free-path`

Recommended story copy:

- Kicker: `Origins · Lumina and Nero`
- Title: `The First Light`
- Lede: `Nero holds the fertile unknown. Lumina gives possibility form. Their polarity begins Arcanea—not a war between good and evil.`
- Third section: `III · The house that leaned`
- Opening line: `The house had moved half an inch since Arion went under it.`
- Label: `Chapter One · The Last Free Path`
- Primary action: `Read Arion's opening`
- Primary route: `/books/the-last-free-path/01-the-house-that-leaned`
- Secondary route: `/books/the-last-free-path`

If Shadow is named, use: `Shadow is not darkness itself, but Void severed from Spirit and corrupted.`

Do not carry forward the claim that every possible soul and world rests “in superposition” unless the human creator deliberately promotes that formulation through canon review.

# Visual and catalog treatment

The `first-light.webp` and `aethermoor-dawn.webp` candidates may be reconsidered only after source provenance, rights, visual quality, and continuity are verified. They are not approved by this decision.

If the Lumara and Van Linh tiles survive, place them under `Elsewhere in Arcanea` with the copy `Explore other readable works from the wider Arcanea catalog.` They must remain separate from both the five-book Chronicles sequence and the paid cinematic-edition package. Do not say that covers “ship” or make another availability claim without current proof.

# Files to reject from the older PR

- `apps/web/app/books/page.tsx`
- `apps/web/app/sitemap.ts`
- Kael-specific `/story` metadata and passage data
- `/books/book1/the-storm-that-remembered` links
- assertions that treat `/books` as a library index

The replacement verifier must require the Arion route, the current opening line, sentence-case interface copy, accessible image descriptions, reduced-motion resilience, and honest release-state behavior.

# Release action

Keep `/story` absent rather than publish a contradictory or rights-unclear gateway. Recreate it only after the selected images pass the same evidence and human gates as the cinematic edition. Closing PR #299 is an external repository action and remains a human/release-lead decision until the replacement or archival note is ready.
