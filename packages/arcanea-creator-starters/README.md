# Arcanea creator starters

Six editable website examples for music producers, AI labs and AI-tool builders. Each includes a self-contained HTML page and a specific v0 brief. The complete source package also contains one portable agent skill.

| Starter    | Job                        | Working local interaction                         |
| ---------- | -------------------------- | ------------------------------------------------- |
| Resonant   | Producer portfolio         | Three original synthesized audio sketches         |
| Crate      | Sample-collection page     | Sound pads and audition controls                  |
| Fieldwork  | Research lab               | Inspect question, evidence and review fixtures    |
| Open model | Model-release page         | Read intended use, evaluation and limitations     |
| Forma      | Creative-tool landing page | Format an idea into an editable brief and copy it |
| Relay      | Agent-tool landing page    | Format a task into a plan and export it           |

Names and content are fictional examples. Audio is synthesized locally; there are no third-party recordings. Research steps are illustrative text, not scientific findings. Brief and plan builders use deterministic local formatting, not AI inference. They send no text and use no browser storage.

## Use in a browser

Open `index.html` from a built export. Each HTML file contains its own CSS and JavaScript and works without a package install. Download a starter and edit it in your editor. The source endpoint uses `.html.txt` to keep hosting-injected preview scripts out of downloads; the browser saves it with the `.html` filename. If a client ignores that filename, rename the downloaded file to `.html`. Copy buttons fall back to a Markdown download if clipboard access is unavailable. Audio requires a user click and a browser with Web Audio support.

## Use with v0

Download the chosen HTML file and its matching `.md` brief from the gallery. Attach both to a new chat at https://v0.app and ask it to implement the design in your project's stack. The briefs target Next.js App Router and strict TypeScript. These files have not been generated or published in v0. v0 generation uses your own account and its terms.

## Build from the source package

From `packages/arcanea-creator-starters`, using the repository's Node 20 runtime:

```text
node scripts/build.mjs --out <absolute-new-directory>
node scripts/build.mjs --out <absolute-built-directory> --check
node scripts/build.mjs --compat --check
node --test scripts/build.test.mjs
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
