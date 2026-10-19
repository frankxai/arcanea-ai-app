# One source, portable delivery

Verified against [OpenAI's packaging documentation](https://developers.openai.com/plugins/build/plugins) on 2026-09-10. Root `plugin.json` is canonical for new portable packages. `extensions.com.openai` holds platform presentation. When that object exists it replaces the compatibility overlay; the two are not merged. Fixed `skills/` and optional `mcp.json` paths provide portable components.

This package deliberately uses one skill. The user's job is selecting and adapting a page; separate agents, databases or MCP servers for each example would duplicate the same workflow. The HTML has six composition families and nine catalog records. The build command produces the gallery, pages, briefs, registry bundles and file-hash receipt. Node built-ins are sufficient. No new package dependency is needed. A small repository adapter generates the static files before the existing web dev/build commands. Turbo tracks the source package and adapter as build inputs and restores the generated directory with its cached build outputs.

```text
plugin.json → generated .codex-plugin/plugin.json
catalog.json + src/ → HTML previews + v0 briefs + gallery
skills/build-creator-page/ → select, adapt, verify, deliver
```

The fallback manifest exists for legacy Codex hosts. Regenerate it with `node scripts/build.mjs --compat`; check semantic equality before review (JSON whitespace is not identity). Never maintain identity in both files manually. Root license metadata is omitted until the owner chooses a distribution license; no public license grant is implied.

Integrations are optional adapters added only for a real requirement. Browser interaction stays local. A paid model call belongs behind a server boundary with validated input, an explicit cost owner, cancellation, rate limits and errors. A customer's credential must not enter client source, URL, logs or localStorage. Provider adapters do not belong in plugin metadata.

Build artifacts are portable. A Next.js app can serve the generated static directory; a v0 chat can consume one HTML and its brief; an agent can use the skill and the same source. Converting a page to React is an explicit implementation step, not a claim about the current HTML files.

The original commercial-truth audit concerns the wider app. This package does not prove its hosted checkout, waitlist storage, model routing or entitlements. Keep those gates and the existing user data boundaries separate.

## Extension contract

Add a catalog entry for content changes. Add a composition only for a different user job. `render.mjs` owns the common shell; `compositions.mjs` owns the three new artifacts; `registry.mjs` owns import packaging. There is one catalog, one shared browser script and one build entry point. Registry bundles carry source files with namespaced destinations, never hidden install-time execution. Metadata and generated output drift are checked before release.

## App delivery

Only source is committed. `scripts/build-creator-starters.mjs` resolves the app output directory from its own URL, so root and app working directories produce the same result on Windows and Linux. `pnpm --dir apps/web build` and `dev` generate `/creator-starters/` before starting Next.js. The generated public directory is ignored by Git; it is still shipped by Next.js and retained in Turbo build outputs. CI verifies the emitter, interactions, compatibility manifest and exact generated downloads after the production build. A clean checkout therefore has the same nine pages as a cached build. Do not copy generated pages between branches or edit their downloaded outputs to change the source.

The app declares the generator as a private workspace development dependency. The portable plugin manifest remains the only version authority; no registry package is published. The standalone route has its own restrictive CSP with explicit Google Fonts origins, and browser CI verifies the font actually loads.
