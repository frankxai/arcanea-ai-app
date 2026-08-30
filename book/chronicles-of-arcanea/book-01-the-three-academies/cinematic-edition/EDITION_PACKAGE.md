---
title: The Last Free Path — founding cinematic edition package
status: staging
price: €17 one-time
updated: 2026-08-30
---

# Release promise

The €17 edition is not justified by calling AI involvement a feature. It is justified by a finished adult/crossover fantasy novel, an excellent responsive reading experience, durable downloadable ownership, intentional narrative art, and an optional trustworthy production record.

## Included at launch

1. Complete 32-chapter novel in the account-based Arcanea reader.
2. Four free chapters before the purchase boundary.
3. Reflowable EPUB with chapter navigation, semantic headings, cover, metadata, alt text, and no web-only UI.
4. Typeset PDF in screen and print-friendly variants, with selectable text and tagged structure where the production toolchain supports it.
5. Cinematic artbook PDF containing the approved cover, eight narrative plates, final-record plate, scene captions, crop studies, and public-safe art provenance.
6. Buyer-only Creator's Ledger with human decisions, owned task-prompt summaries, material tool contributions, editorial interventions, sources, rights, versioning, and honest missing evidence.
7. Refund-aware one-time access tied to the buyer's Arcanea account and verified against Polar.

If EPUB, PDF, artbook, or final art is absent, the product is not yet the promised founding cinematic edition and checkout must remain disabled.

# Product boundary

- Story is the primary sales promise and occupies the reading surface alone.
- The Creator's Ledger is optional and separate. It supports trust and creator education; it is not positioned as the reason the fiction matters.
- Downloads are for personal use by the buyer. Legal/license wording requires human approval before release.
- No subscription, scarcity countdown, false launch capacity, certification, publishing-success claim, or unverifiable result claim.

# Build manifest

The release bundle is versioned by `book-01-founding-cinematic` and contains:

```text
the-last-free-path/
  the-last-free-path.epub
  the-last-free-path-screen.pdf
  the-last-free-path-print.pdf
  the-last-free-path-artbook.pdf
  cover.jpg
  cover-thumbnail.jpg
  manifest.json
```

`manifest.json` records edition ID, manuscript revision, publication date, file hashes, byte sizes, format versions, cover asset ID, art asset IDs, rights status, accessibility check, and approval receipts. The server exposes downloads only after the same Polar access verification used for paid chapters.

Release-mode artifact builds refuse a dirty git worktree and record both the source commit and a deterministic manuscript-content hash. Draft builds may run from a dirty tree but mark that state visibly in the manifest.

The artbook is built from `artbook-spec.json`, which owns the ordered plate sequence, captions, image descriptions, material notes, aspect-ratio pairings, provenance wording, and human approval flags. Its source builder refuses a release artifact while the title, canon, casting, or rights gates remain open. Draft proofs carry a visible protected-staging label.

The reproducible build order is:

1. Run `pnpm --filter @arcanea/web book:edition -- --out <edition-output> --cover <approved-cover> --author <approved-publication-name> --draft` for an internal novel proof, omitting `--draft` only after release approval.
2. Run `pnpm --filter @arcanea/web book:artbook -- --out <edition-output> --author <approved-publication-name> --draft` with the same draft/release mode. The artbook cover is bound to the committed asset and hash in `artbook-spec.json`; it cannot be replaced at the command line.
3. Render the novel PDFs with `pnpm --filter @arcanea/web book:pdf -- --source <edition-output>/the-last-free-path-print-source.html --out <edition-output>`.
4. Render the artbook with `pnpm --filter @arcanea/web book:artbook-pdf -- --source <edition-output>/the-last-free-path-artbook-source.html --out <edition-output>`.

The HTML artbook source is self-contained for durable proofing. Each plate receives a plate page and a composition-study page, yielding a 21-page source: cover, reading note, eighteen plate/study pages, and a public-safe production record. The PDF renderer accepts only that canonical source and manifest, blocks network requests, and validates the final page count, tagged structure, document outline, and readable text layer before removing the artifact from the pending list.

Release files are uploaded to a private Vercel Blob store under `editions/the-last-free-path/book-01-founding-cinematic/`. The application authenticates the Arcanea account, verifies the live Polar order, fetches the allow-listed private pathname server-side, and streams it with an attachment header. Neither public blob URLs nor user-supplied pathnames are accepted.

# Commerce activation gate

Before setting `CINEMATIC_BOOK_SALES_ENABLED=true` in preview or production:

- manuscript release and canon verdicts are approved;
- provisional title and cover pass human legal/IP review;
- selected art has complete receipts and rights approval;
- EPUB/PDF/artbook files exist and open correctly;
- reader, checkout, confirmation, refund denial, ledger, and downloads pass desktop/mobile/accessibility checks;
- Polar product name, €17 one-time price, refund terms, tax handling, and receipt copy are reviewed by the human creator;
- live Polar Orders, exact product ID, exact book/edition metadata, and refund state remain the entitlement authority for the first release; an outage locks protected access rather than granting it;
- production secrets are configured through Vercel, never committed;
- the private Blob store is connected, files match `manifest.json`, and `CINEMATIC_BOOK_DOWNLOADS_ENABLED=true` is set only after file QA;
- rollback is defined as setting `CINEMATIC_BOOK_SALES_ENABLED=false` while preserving existing buyer verification and free chapters.
