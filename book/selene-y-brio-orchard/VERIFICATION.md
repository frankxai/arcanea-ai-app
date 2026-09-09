# The Orchard of Unspoken Names — final build verification

Verified 2026-09-09 from the canonical files in `evolution/manuscript`.

## Final source and editions

| Measure | Result |
| --- | ---: |
| Chapters | 14 |
| Words | 15,945 |
| New chapter plates | 4 |
| WebP files including cover | 5 |
| Canonical source SHA-256 | `6cb336c006b8ffcf3ab84b6e73f5eeee238ea96659860b6908b6acc94e60a06b` |
| HTML bytes | 3,630,230 |
| HTML SHA-256 | `161714603ddc026f338a17c48045ca35b2c3ee08bffe212370c697a048a75283` |
| EPUB bytes | 2,688,169 |
| EPUB SHA-256 | `fa25565e97700ebc0378a4834a4a96529ccdb206fb953b0ec17703842dc4134f` |

The staged chapter set is byte-identical to all 14 canonical Markdown files.
The HTML is marked `final`, has no draft or `noindex` marker, contains 14
chapter sections and four plates, and embeds the canonical source hash. No
literal Markdown emphasis markers remain in the manuscript.

The EPUB ZIP test passed. Its `mimetype` is the first entry and is stored
without compression. All XML, OPF, and XHTML entries parse successfully. The
package contains 14 chapter documents, four plate images, the cover, the source
hash, and `CC-BY-NC-SA-4.0` rights metadata.

All five WebPs decode as RGB WebP at exactly 941 × 1672 pixels. Every image
referenced by chapter frontmatter resolves, and the public asset staging tree
contains the four plates plus `cover.webp`.

## Web integration

- `generateMetadata` and page rendering independently call
  `isBookPublic(BOOK_DIR)`.
- `BOOK_DIR` derives from `getBookRoot()` and `selene-y-brio-orchard`.
- The loader requires 14 contiguous chapters with unique kebab-case IDs and
  permits zero to two validated images per chapter.
- The route reuses the existing `IllustratedNovellaReader` and introduces no
  website dependency or visual constant.
- Prettier passed for the route, loader, and two-volume catalogue component.
- The isolated repository-shaped fixture passed TypeScript with exit 0 and
  ESLint with exit 0 for those three files.

Cloud browser control rejected the local `file://` edition under its URL
policy and explicitly prohibited alternate local-browser workarounds. Rendered
verification remains pending against the deployed preview URL.

## Reproducibility

The default strict build passed. A second strict build copied the builder into
`scripts/books/build-selene-orchard.py` in a temporary repo-shaped fixture and
ran it with explicit `--manuscript-dir`, `--asset-root`, `--output-dir`, and
`--staging-root` arguments. Both editions and all 14 staged chapters were
created outside the canonical directory, and pre/post SHA-256 comparison
confirmed every canonical input remained unchanged. The builder rejects
overlap between the manuscript and either the output or staged chapter path.

## Primary content payload

The primary content payload contains 18 text files: route, loader, manifest,
source ledger, and 14 chapters. Their raw content is 106,523 bytes; the summed
unified-diff estimate is 115,890 bytes, below the 120,000-byte review limit.
The five binary web assets total 2,634,838 bytes. Builder and broader process,
catalogue, continuity, provenance, and editorial material remain in the
separate follow-up payload.
