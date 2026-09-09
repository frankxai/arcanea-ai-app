---
title: The Last Free Path — founding cinematic edition package
status: staging
price: €17 one-time
updated: 2026-09-09
---

# Release promise

The €17 edition is built around the finished adult/crossover fantasy novel and its reading package: a responsive reader, personal-use downloadable files, narrative art, and an optional production record. AI involvement is disclosed in the Creator’s Ledger; it is not the sales premise.

## Included at launch

1. Complete 32-chapter novel in the account-based Arcanea reader.
2. Four free chapters before the purchase boundary.
3. Reflowable EPUB with chapter navigation, semantic headings, cover, metadata, alt text, and no web-only UI.
4. Typeset PDF in screen and print-friendly variants, with selectable text and tagged structure where the production toolchain supports it.
5. Cinematic artbook PDF containing the approved cover, six narrative plates, three explicitly labeled editorial studies, captions, companion compositions, and public-safe art provenance.
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
  manifest.json
```

`manifest.json` records edition ID, manuscript revision, publication date, file hashes, byte sizes, format versions, cover asset ID, art asset IDs, rights status, accessibility check, and approval receipts. The server exposes downloads only after the same Polar access verification used for paid chapters.

Release-mode artifact builds refuse a dirty git worktree and record both the source commit and a deterministic manuscript-content hash. Draft builds may run from a dirty tree but mark that state visibly in the manifest.

`edition-spec.json` is the machine-readable release authority for the novel files. It binds the canonical title, edition identity, 32-chapter count, exact approved manuscript hash, byline state, cover path and hash, and the canon, editorial, legal, rights, and title approvals. Protected-staging values are valid for internal proofs but cannot produce a release build. Release mode also requires every chapter frontmatter status to be `release-approved`, every approval to carry a non-empty receipt, and the requested cover to match the committed specification asset byte for byte.

Novel and artbook outputs must be written outside the source repository. The novel builder rejects linked or aliased output directories and refuses to replace symlinks or non-file targets. Its EPUB uses the release date for archive entry times and EPUB modification metadata so identical approved sources produce stable package bytes.

The artbook is built from `artbook-spec.json`, which owns the ordered plate sequence, captions, image descriptions, material notes, aspect-ratio pairings, provenance wording, and human approval flags. Its source builder refuses a release artifact while the title, canon, casting, or rights gates remain open. Draft proofs carry a visible protected-staging label.

The reproducible build order is:

1. Run `pnpm --filter @arcanea/web book:edition -- --out <edition-output> --cover <specified-cover> --author <internal-proof-name> --draft` for an internal novel proof. Draft artifacts replace the requested name with `Byline pending approval` and carry a visible protected-staging notice. Omit `--draft` only after the byline and every other release gate are approved.
2. Run `pnpm --filter @arcanea/web book:artbook -- --out <edition-output> --author <approved-publication-name> --draft` with the same draft/release mode. The artbook cover is bound to the committed asset and hash in `artbook-spec.json`; it cannot be replaced at the command line.
3. Render the novel PDFs with `pnpm --filter @arcanea/web book:pdf -- --source <edition-output>/the-last-free-path-print-source.html --out <edition-output>`.
4. Render the artbook with `pnpm --filter @arcanea/web book:artbook-pdf -- --source <edition-output>/the-last-free-path-artbook-source.html --out <edition-output>`.

The HTML artbook source is self-contained for durable proofing. Each plate receives a plate page and a composition-study page, yielding a 21-page source: cover, reading note, eighteen plate/study pages, and a public-safe production record. The PDF renderer accepts only that canonical source and manifest, blocks network requests, and validates the final page count, tagged structure, document outline, and readable text layer before removing the artifact from the pending list.

The novel PDF renderer applies the same posture. It accepts only the print source inside the edition output directory, reconstructs that source from the current manuscript and specified cover, verifies all chapter and approval receipts against the current source revision, disables JavaScript and network access, and validates both PDFs for plausible pagination, tagged structure, chapter outline, and searchable opening and closing text before updating the manifest.

Release files are uploaded to a private Vercel Blob store under `editions/the-last-free-path/book-01-founding-cinematic/`. The application authenticates the Arcanea account, verifies the live Polar order and release manifest, and fetches the allow-listed private pathname server-side. Before returning any file bytes, it verifies the complete file's byte count and SHA-256 against the same approved manifest used for access. This catches a replacement at a previously approved storage path, including a same-size replacement. Public blob URLs and user-supplied pathnames are not accepted.

The first release buffers each download for verification, with a 128 MiB per-file ceiling. The manifest gate rejects a promised download above that ceiling, so checkout cannot advertise a file the delivery path cannot verify. Storage reads have a 30-second deadline; manifest reads and Polar reconciliation have 10-second deadlines. Interrupted, truncated, oversized, or mismatched files return a retry error without sending partial file content. Load testing of the final export sizes remains part of preview QA because concurrent downloads each consume a verification buffer.

# Commerce activation gate

Use Polar sandbox/test mode when setting `CINEMATIC_BOOK_SALES_ENABLED=true` in a private preview. Production and live charging remain disabled until every gate below is satisfied and the human release lead gives separate explicit approval.

- manuscript release and canon verdicts are approved;
- provisional title and cover pass human legal/IP review;
- selected art has complete receipts and rights approval;
- EPUB/PDF/artbook files exist and open correctly;
- reader, checkout, confirmation, removal of access after a full refund, ledger, and downloads pass desktop, mobile, and accessibility checks;
- Polar product name, €17 one-time price, refund terms, tax handling, and receipt copy are reviewed by the human creator;
- live Polar Orders, exact product ID, exact book/edition metadata, the verified release manifest, and refund state remain the entitlement authority for the first release; a Polar, manifest, or private-storage outage locks protected access rather than granting it;
- production secrets are configured through Vercel, never committed;
- the private Blob store is connected, files match `manifest.json`, and `CINEMATIC_BOOK_DOWNLOADS_ENABLED=true` is set only after file QA;
- final-file delivery is tested with an approved download, a same-size overwritten file, a truncated response, a stalled response, and client cancellation; rejected responses contain no artifact bytes;
- the final private `manifest.json` contains the four allow-listed buyer downloads with matching byte sizes and hashes, all novel and artbook approvals are present, and no release-blocking `pending` item remains; only then may the human release lead set `CINEMATIC_BOOK_RELEASE_MANIFEST_SHA256` and `CINEMATIC_BOOK_RELEASE_SOURCE_COMMIT` to the verified manifest hash and source revision. Before checkout can open, the server fetches those exact manifest bytes, verifies their SHA-256, validates the approved release records, and requires the manifest source revision to equal both the recorded source revision and Vercel's deployed git revision. Any missing, stale, or tampered evidence fails closed;
- rollback is defined as setting `CINEMATIC_BOOK_SALES_ENABLED=false` while preserving existing buyer verification and free chapters.
