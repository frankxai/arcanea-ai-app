# Arcanea Atlas

Atlas retains an Astro/MDX configuration and a standalone dependency graph.
At revision `d2285fb74f296ce783d3f0fed9bdef6959e3f9d9`, this directory has no
tracked `src/` pages, components or styles. A successful configuration build
does not establish a usable microsite or an accepted deployment.

## Tracked files and setup

The directory contains `astro.config.mjs`, `package.json`, the PNPM workspace
and lock files, `tsconfig.json`, `data/`, `scripts/build-data.ts` and archive
planning documents. It is outside the root application's workspace and uses
its own graph with the repository's pinned Node and PNPM versions.

From the repository root, using Node from `.nvmrc`:

```bash
pnpm --dir docs/atlas install --frozen-lockfile --ignore-scripts
node scripts/verify-atlas-dependency-lock.cjs
node --test scripts/tests/atlas-source-map-regressions.test.cjs scripts/tests/atlas-sharp-runtime.test.cjs
pnpm --dir docs/atlas build
```

The graph verifier checks all preserved resolved nodes against the immutable
pre-migration revision. The focused workflow installs on Linux and Windows,
tests the actual Astro → Vite → PostCSS source-map dependency and the actual
Astro → Sharp native image dependency, then builds the tracked configuration.
It does not generate canon payloads or publish a site.

## Dependency repair

The legacy v6 lock is incompatible with PNPM 11's frozen install. The v9 migration
preserves the 292 resolved snapshots and the top-level versions/specifiers.
It changes Sharp 0.35.4 to 0.35.5, its packaged native binaries/libvips family,
and source-map-js 1.2.1 to 1.2.2. Legacy `dev`/`requiresBuild` annotations are
removed; optional peers use modern snapshot placement. All unrelated package
metadata and dependency edges remain preserved.

Sharp 0.35.5 bundles patched librsvg 2.63.2; source-map-js 1.2.2 bounds indexed
map offsets. See the [Sharp advisory](https://github.com/advisories/GHSA-wq5f-xc86-pv6w)
and [source-map advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q).
The native test checks the loaded library and decodes a small benign SVG.
It does not attempt exploitation or prove application reachability.

The preserved Astro dependency still includes http-cache-semantics 4.2.0.
Its [shared-cache advisory](https://github.com/advisories/GHSA-ch52-4w7c-c8xp)
has no published patch as inspected on 11 October 2026. That alert remains open;
this repair does not establish the deployed cache behavior or dismiss the alert.

## Canon and unfinished product work

`.arcanea/lore/CANON_LOCKED.md` is authoritative. The older `docs/canon/`
inputs and `data/canon-manifest.json` are retained historical/derived material;
they are not authority for new canon promotion.

`scripts/build-data.ts` reads legacy markdown and writes a derived payload.
The dependency workflow does not run it. Any canon reconciliation or promotion
requires the separate canon process before generating or publishing that payload.

The earlier documentation's landing page, constellation navigation, status
widgets, live endpoints and `atlas.arcanea.ai` deployment are proposed work.
Their implementation and customer acceptance are not established by this
directory's current tracked files. Preserve the archive plan and original
assets until their owner reviews any migration.
