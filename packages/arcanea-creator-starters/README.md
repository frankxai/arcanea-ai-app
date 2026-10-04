# Arcanea creator starters

Nine editable website examples for music producers, AI labs and AI-tool builders. Each includes a self-contained HTML page, a specific v0 brief and a shadcn-compatible registry bundle. The complete source package also contains one portable agent skill.

| Starter    | Job                         | Working local interaction                           |
| ---------- | --------------------------- | --------------------------------------------------- |
| Resonant   | Producer portfolio          | Three original synthesized audio sketches           |
| Crate      | Sample-collection page      | Sound pads and audition controls                    |
| Fieldwork  | Research lab                | Inspect question, evidence and review fixtures      |
| Open model | Model-release page          | Read intended use, evaluation and limitations       |
| Forma      | Creative-tool landing page  | Format an idea into an editable brief and copy it   |
| Relay      | Agent-tool landing page     | Format a task into a plan and export it             |
| Session    | Release listening room      | Audition three takes with clear play/stop states    |
| Margin     | Research publication        | Read a paper specimen and export a research outline |
| Patch      | Developer-tool landing page | Validate JSON syntax, handle errors and copy output |

Names and content are fictional examples. Audio is synthesized locally; there are no third-party recordings. Research steps are illustrative text, not scientific findings. Brief and plan builders use deterministic local formatting, not AI inference. Demo inputs stay in the page and use no browser storage. The gallery keeps its search and category in the URL for sharing; do not enter private information in a gallery search. Fonts load from Google Fonts, with system fallbacks offline.

## Use in a browser

Open `index.html` from a built export. Each HTML file contains its own CSS and JavaScript and works without a package install. Download a starter and edit it in your editor. The source endpoint uses `.html.txt` to keep hosting-injected preview scripts out of downloads; the browser saves it with the `.html` filename. If a client ignores that filename, rename the downloaded file to `.html`. Copy buttons fall back to a Markdown download if clipboard access is unavailable. Audio requires a user click and a browser with Web Audio support.

## Use with v0

Download the chosen HTML file and its matching `.md` brief from the gallery. Attach both to a new chat at https://v0.app and ask it to implement the design in your project's stack. The briefs target Next.js App Router and strict TypeScript. These files have not been generated or published in v0. v0 generation uses your own account and its terms.

## Build from the source package

From `packages/arcanea-creator-starters`, using the repository's Node 22 runtime:

```text
node scripts/build.mjs --out <absolute-new-directory>
node scripts/build.mjs --out <absolute-built-directory> --check
node scripts/build.mjs --compat --check
node --test scripts/build.test.mjs scripts/interactions.test.mjs scripts/myth-packets.test.mjs
```

Use a dedicated empty output directory. Subsequent builds require a valid generator marker and refuse unrelated or locally edited files. The check command detects drift without writing. Edit the source package or download a starter to a new project; do not edit generated delivery files in place.

## Plugin architecture

The source package uses root `plugin.json` for portable identity and `extensions.com.openai` for Codex presentation. One skill lives in `skills/build-creator-page/`. The `.codex-plugin/plugin.json` compatibility file is generated from the root manifest. No MCP server, hooks, provider key, account, telemetry or background process is needed for this workflow.

This package is an authoring candidate. It is not registered in your personal marketplace, installed in a new task, or submitted to the public plugin directory. Test installation from your chosen existing marketplace before distribution. Build scripts are run explicitly; they are not install hooks.

## Before publishing your page

Replace every example name, track, research fixture and product statement with verified material you own or are allowed to use. Choose a license appropriate to the destination; this draft does not add or change the host repository's licensing. Connect verified URLs. A real unlaunched product should use its existing shared demand-capture service, with visible success and failure behavior. Never ship a fake-success signup form. Checkout, inference, account creation and service execution are not implemented here.

Inspect mobile, desktop, keyboard focus, reduced motion, copy/download and error states. A local demo is not evidence that a deployed service works. An official v0 marketplace submission and a public plugin release are separate actions.

## Primary sources checked on 2026-09-10

- OpenAI portable plugin packaging: https://developers.openai.com/plugins/build/plugins
- OpenAI skills and tool boundaries: https://developers.openai.com/plugins/concepts/plugins
- v0 workflow and project export: https://v0.app/docs/quickstart
- v0 community-template reference board: https://v0.app/templates

No third-party template code, artwork, scientific datasets, customer logos or recordings are copied into these examples.

## v0 registry bundles and discovery

Each `<starter>.registry.json` follows the shadcn registry-item schema. It carries the exact standalone HTML and brief as two `registry:file` entries under `creator-starters/<starter>/`. Importing never adds a root route, environment variable, dependency, account or provider. It is a source handoff, not a prebuilt React component. Inspect targets before importing into an existing project.

The gallery supports category plus text search, shareable query URLs, visible empty results and a reset action. Copy a starter-specific v0 prompt beside its download links. Clipboard failures fall back to a file download.

For a verified publicly accessible HTTPS host, [Open in v0](https://ui.shadcn.com/docs/registry/open-in-v0) accepts a URL-encoded registry URL through `https://v0.dev/chat/api/open?url=...`. A protected Vercel preview may not be readable by v0; use the downloaded HTML and brief in that case. Never put a preview bypass token or other credential into the shared URL. End-to-end import in a signed-in v0 session remains a separate check; this package does not claim that check passed.

Version 0.2.0 adds Session, Margin and Patch, replaces decorative lab diagrams with readable evidence requirements, loads the declared typography, and generates all deliveries from the same catalog. JSON validation is syntax-only and clears stale output after invalid input; it is not an API response or model evaluation. The root portable plugin manifest stays canonical, with compatibility metadata generated for older Codex hosts.

## Inside the Arcanea app

The app generates all pages and downloads before `pnpm --dir apps/web dev` or `pnpm --dir apps/web build`. Only this source package is tracked in Git; generated files under `apps/web/public/creator-starters/` are ignored. Run `node scripts/build-creator-starters.mjs` from the repository root to generate them without starting a server, or add `--check` to verify exact output. Turbo caches the generated directory and invalidates it when the source package changes.

## Myth research and production packets

The same export includes `myth-atlas.v1.json`, `myth-brief.example.json`, `myth-packet.example.json` and `myth-packet.example.md`. These are twelve research leads and a planning example, with no source passages, manuscript, approved Arcanea canon or commercial clearance. `anchor-located` means source metadata has been located; it does not mean the passage or edition rights have been reviewed. The Greek entries reference ancient textual witnesses, rather than making claims about current religious practices. The Mapuche entry is a distinct living tradition and requires community consultation. Proposed transformations are editorial questions, separate from source evidence. Geography preserves traditional associations and unresolved modern identifications.

Copy the example brief outside the generated delivery directory and edit it. From this package:

```text
node scripts/compile-myth-packet.mjs --brief /absolute/path/to/brief.json
node scripts/compile-myth-packet.mjs --brief /absolute/path/to/brief.json --format md
node scripts/compile-myth-packet.mjs --brief /absolute/path/to/brief.json --atlas /absolute/path/to/atlas.json
```

The CLI writes the complete packet to stdout only after validation. It reports errors on stderr with a nonzero exit status. Each input must be a regular JSON file no larger than 256KiB. Unknown fields and identifiers, duplicates, invalid rates, excessive counts and unsafe computed amounts fail validation. Import `compilePacket`, `validateBrief`, `validateAtlas` and `packetMarkdown` through `@arcanea/creator-starters/myth-packets` for programmatic use. Only pass compiler-produced packets to the Markdown formatter.

The exact v1 brief fields are shown in the example. An audience is `ages-8-12`, `teens`, `adults` or `family`; this records intent and does not approve age suitability. A deliverable format is `text`, `image`, `audio` or `video`. Select one to eight distinct catalog IDs and one to sixteen distinct deliverable IDs. Each deliverable specifies a target of one to 1,000 accepted units, one to twenty attempts per unit, a nonnegative integer unit cost and zero to 1,440 review minutes per attempt. Currency is `USD`, `EUR` or `GBP`; no currency conversion occurs. A micro is one millionth of that currency unit. Money inputs are safe integers capped at one million currency units.

The estimate charges every planned attempt and review of every attempt. Review cost is rounded up to a whole micro per deliverable. Rates are supplied by the creator, not retrieved provider prices; accepted output is a target, not a promise. The example plans 14 attempts and 90 review minutes: EUR 4 in generation plus EUR 45 in review, totaling EUR 49 against a EUR 150 ceiling. Taxes, checkout fees, hosting, writing and distribution are excluded. Exceeding the ceiling produces `withinBudget: false` so a human can revise the brief; compilation never initiates jobs or spending.

Packets contain SHA-256 fingerprints of the atlas, brief, each selected record and complete packet body. Key order does not affect fingerprints; content and array order do. They detect change, not authenticity, legal status or editor approval. There are no timestamps, model calls, provider keys, network requests, database writes or automatic releases. Persist reviewed project packets through the app's existing owner-scoped catalog/publishing flows when that integration is separately implemented. Draft release-manifest validation work is not duplicated here.
