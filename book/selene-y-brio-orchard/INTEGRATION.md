# The Orchard of Unspoken Names — additive integration slice

This slice adds `/books/selene-y-brio-orchard` on top of the Book I reader work
from PR 372 at `567718ffaa6242cc9c3f485371873b1417163f28`.

Copy these paths to the same paths in the production repository:

- `apps/web/app/books/selene-y-brio-orchard/`
- `book/selene-y-brio-orchard/`
- `apps/web/public/images/books/selene-y-brio-orchard/` when generated assets
  are present

The route intentionally imports the existing
`@/components/books/illustrated-novella-reader`; this slice does not duplicate
or change its component or CSS. Both metadata generation and page rendering
call the existing `isBookPublic` gate against the manifest directory returned
by `getBookRoot()`.

The canonical sources are `evolution/manuscript/*.md`. Run the edition builder
from the project root:

```bash
python3 evolution/production/build-orchard.py --draft
python3 evolution/production/build-orchard.py
```

When the builder is installed at `scripts/books/build-selene-orchard.py`, run a
reproducible repo-root build with explicit, non-overlapping destinations:

```bash
python3 scripts/books/build-selene-orchard.py \
  --manuscript-dir book/selene-y-brio-orchard/chapters \
  --asset-root apps/web/public \
  --output-dir /tmp/selene-orchard-editions \
  --staging-root /tmp/selene-orchard-stage
```

The command reads canonical chapters and public assets without changing them.
It writes editions under the output directory and a byte-identical release tree
under the separate staging root. The builder rejects overlapping manuscript,
output, and staged-chapter paths.

Draft mode stages the current contiguous chapter prefix and emits a visibly
marked, `noindex` HTML review copy. Final mode requires 14 chapters, the cover,
four to eight unique Book II chapter plates, and all referenced assets. Only a
successful final run writes the EPUB. The builder stages byte-identical Markdown
copies and emits one combined source SHA-256 in both final editions.

The website reader currently treats each Markdown paragraph as plain text.
Markdown emphasis markers therefore remain literal unless the manuscript is
normalized before the final build or the shared reader later gains a safe inline
renderer.
