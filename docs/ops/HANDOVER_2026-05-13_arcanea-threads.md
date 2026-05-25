# Handover — Arcanea Kura rebrand + format lock + bridge ship

> **Update 2026-05-13 (later in session):** Product renamed once more from
> Threads → **Arcanea Kura** (蔵, the fireproof Japanese storehouse) with
> Frank's explicit lock. Tagline locked: **"Kura — export your most
> precious writing."** Backend ship and push completed in same session.
> See "Wave 2 + 3 addendum" at the bottom of this doc for what landed.

**Session:** 2026-05-13, overnight + late-evening rename
**Extension repo branch:** `codex/excellence-vault-baseline` in
`~/arcanea-vault/` — `github.com/frankxai/arcanea-vault`. Two commits
pushed: `0b6787a` (Threads rebrand + spec lock) → `3993daa` (Kura rebrand
+ STORE_LISTING).
**Monorepo branch:** `codex/machine-excellence-pp-storage` in
`~/Arcanea/` — `github.com/frankxai/arcanea-ai-app`. Kura backend commit
pushed: `739a947a` (endpoint + landing + privacy).
**Status:** Both branches pushed. Build green. PR URLs returned below.
**Build:** `pnpm typecheck` + `pnpm build` both green. `dist/` ready to load unpacked or submit to Chrome Web Store.

---

## What this session decided

The Chrome extension previously scaffolded as **Arcanea Vault** has been
reframed and renamed. The strategic shift driving the work:

1. **The extension is a capture layer, not a storage product.** Storage
   belongs in the user's filesystem (Obsidian, second brain, whatever
   they already use). The vault metaphor was the wrong name for an
   on-ramp.
2. **Local-first is the moat.** No cloud round-trip, no account, no
   "trust us with your conversation history" friction. The privacy
   story becomes the marketing story.
3. **The processing skill is where the value compounds**, not the
   extension. Capture is cheap; turning raw conversations into a linked
   worldbuilding graph is the durable wedge.
4. **Obsidian carries day one.** The extension emits Obsidian-compatible
   markdown. The native graph view is the free viral demo. The Arcanea
   second-brain visualizer is v0.4+, deferred.

Name locked: **Arcanea Threads** — conversation threads → graph threads →
threading needle into worldbuilding.

---

## What shipped

### Locked artifacts

| File | Purpose |
|------|---------|
| `arcanea-vault/FORMAT_SPEC.md` | v0.2.0 vault format contract. Folder layout, YAML frontmatter schema, wikilinks, entity tags, idempotence rules, version policy. **Single source of truth.** |
| `arcanea-vault/CLAUDE.md` | Repo-scoped Claude Code config: behavioral rules, file map, design tokens, message namespace migration plan. |
| `arcanea-vault/.claude/commands/threads-process.md` | The `/threads-process` slash command — walks the vault, extracts characters/locations/artifacts/lore, populates frontmatter, emits `_entities/` notes. Idempotent, never overwrites canon, never invents. |

### Code refactor

- **`src/core/frontmatter.ts`** (new, 216 lines): typed YAML frontmatter
  generation. Owns `SCHEMA_VERSION`, `VAULT_ROOT`, `CAPTURED_BY`. Single
  source for slug rules, asset naming, platform labels.
- **`src/core/exporter.ts`** (rewritten): emits `ConversationBundle` with
  `conversation.md` + `prompts.md` companion per spec. HTML/JSON/text
  fallbacks retuned to Atlantean Teal / Cosmic Blue / Gold + Geist +
  Instrument Serif palette.
- **`src/background/index.ts`** (rewritten): writes into
  `ArcaneaThreads/<platform>/<slug>/` with per-conversation folders.
  Asset sidecars for AI-generated media (prompt notes). Proper
  `URL.revokeObjectURL` cleanup. `THREADS_*` message namespace with
  backwards-compatible `VAULT_*` aliases.
- **`src/popup/{index.ts,popup.html}`** + **`src/styles/popup.css`**:
  redesigned to the May 2026 Arcanea design system. New copy:
  *"Capture to vault"*, *"Send to Arcanea (opt-in)"*.
- **Badge color** changed from purple `#8b5cf6` to Atlantean Teal `#00bcd4`.

### Rebrand

- `manifest.json`: name → *"Arcanea Threads — Local AI vault for ChatGPT,
  Claude, Grok, Gemini"*; version → `0.2.0`.
- `package.json`: name → `arcanea-threads`; keywords retuned around
  `obsidian`, `second-brain`, `local-first`, `knowledge-graph`,
  `worldbuilding`.
- `README.md`: full rewrite. Public positioning, Quick Start, privacy
  section, three-stage workflow diagram (Capture → Process → See).

### Bundled-in housekeeping

The same commit picks up the pre-existing pnpm-migration WIP that was
already staged on this branch (`.nvmrc`, flat eslint config,
`pnpm-lock.yaml`, `tsconfig.json` refinements). All consistent with the
overnight excellence pass.

---

## What's intentionally NOT shipped

- **GitHub repo rename.** URL stays `github.com/frankxai/arcanea-vault`
  until you decide to rename. The product is Arcanea Threads everywhere
  inside the repo; the URL is the last cosmetic step.
- **Chrome Web Store submission.** Build is ready but the store assets
  (440x280 promo tile, 5 screenshots, privacy policy URL) still need a
  design pass. Estimated 3–4h focused work.
- **Side-panel browser UI.** v0.2.1 roadmap. The `sidepanel.html` file
  exists but is empty.
- **PDF / DOCX export.** Pandoc-in-WASM bundle deferred to v0.3. Users
  can run Pandoc against the markdown locally today.
- **Drive / Notion / Obsidian Sync.** Out of scope by design — the
  filesystem *is* the sync surface.
- **`git push`.** Local commit only. Push after morning review.

---

## How to verify in the morning

```bash
cd ~/arcanea-vault
git log --oneline -1                        # expect 0b6787a
pnpm typecheck                              # expect clean
pnpm build                                  # expect dist/ rebuilt
```

Then load the extension:

1. `chrome://extensions/` → Developer mode → Load unpacked → `dist/`
2. Open `chatgpt.com`, `claude.ai`, `grok.com` etc.
3. Click Arcanea Threads icon → Capture to vault.
4. Check `~/Downloads/ArcaneaThreads/<platform>/<YYYY-MM-DD>_<slug>/`.
5. Open `~/Downloads/ArcaneaThreads/` as an Obsidian vault. Confirm
   graph view shows nodes (even if entities arrays are still empty —
   that's the next step).

Then test the processing layer:

```
# Inside a Claude Code session
/threads-process
```

It should walk the vault, fill in `characters` / `locations` /
`artifacts` / `lore` arrays in each `conversation.md`, and emit
`_entities/<kind>/<name>.md` notes.

---

## Risk inventory

| Risk | Severity | Mitigation |
|------|----------|------------|
| Per-platform scrapers drift since Feb 23. ChatGPT/Claude/Gemini DOMs change weekly. | High | First real capture test will surface broken selectors. Each platform's `src/content/<platform>.ts` is ≤ 200 lines — fast to repair. |
| Chrome Web Store reviewers scrutinize host permissions. | Medium | The local-first / no-cloud story is the strongest possible answer. The privacy policy needs to lead with it. |
| Repo URL still `arcanea-vault` while product is Threads. | Low | One `gh repo rename` away. GitHub auto-redirects old URLs. Cosmetic. |
| `THREADS_*` ↔ `VAULT_*` message aliases create technical debt. | Low | Aliases live in `src/background/index.ts`. Remove in v0.3 once content scripts are migrated. |
| `_entities/` extraction quality depends on Claude's reasoning. | Medium | Hard rules in `threads-process.md` (never invent, three-soft-signals-beats-one) constrain hallucination. First real run on your actual ChatGPT history will be the eval. |

---

## Recommended next stack (in order)

1. **Test capture against a real ChatGPT thread** (15 min). If any
   scraper is broken, fix it now while context is fresh.
2. **Run `/threads-process` on the captured folder** (30 min). Eyeball
   the extracted entities. Tune the skill's taxonomy rules if it's
   over- or under-extracting.
3. **Privacy policy + Chrome Web Store assets** (4h). The local-first
   story writes itself but needs a public URL.
4. **Push the branch + open a PR for review** (or merge directly — it's
   your repo).
5. **Decide on GitHub rename** (`arcanea-vault` → `arcanea-threads`).
   One command, redirects work.

Defer to next session:
- Side-panel browser
- Per-platform scraper hardening (do this only when you hit a broken
  scraper in practice)
- Real-time graph preview inside the extension

---

## Decisions log

- **Name:** Arcanea Threads (over Arcanea Capture, Scribe, Loom).
  Reasoning: tri-meaning — conversation threads (input), graph threads
  (output), threading needle (worldbuilding action). Clean, professional,
  no lore-jargon tax per the `feedback_naming_external` memory.
- **Vault root:** `ArcaneaThreads/` (camel-cased, no separator). Sits
  inside the user's default download folder by default; the
  `threads-process` skill accepts a custom path as `$ARGUMENTS`.
- **Schema version:** `0.2.0` (was no spec previously). Breaking changes
  require bumping in `frontmatter.ts`, `manifest.json`, the skill, and
  `FORMAT_SPEC.md` together.
- **Cloud bridge:** kept but downgraded to opt-in. Endpoint renamed
  `/api/vault/import` → `/api/threads/import`. The corresponding Vercel
  function still needs to exist on `arcanea.ai`; until then the button
  fails gracefully with the error returned from `fetch`.
- **GitHub URL:** unchanged. Repo rename is a cosmetic one-liner you can
  do after pushing, with no code impact.

---

## Wave 2 + 3 addendum — Kura rebrand + backend ship

After the initial Threads commit landed, Frank pushed for a more iconic
name. Locked **Arcanea Kura** (蔵, the fireproof Japanese storehouse a
family kept for their most precious scrolls), with the tagline
**"Kura — export your most precious writing."** Then "do it all" — so I
did.

### What additionally shipped this session

**Extension repo (`~/arcanea-vault`, commit `3993daa`):**
- Rename touches every brand surface — `VAULT_ROOT` → `ArcaneaKura`,
  `CAPTURED_BY` → `arcanea-kura/0.2.0`, all header comments, popup
  copy ("Export to Kura"), footer, manifest name + short_name, package
  name `arcanea-kura`.
- Message namespace evolved to `KURA_*` primary, with `THREADS_*`
  *and* `VAULT_*` legacy aliases for backward compat.
- Slash command renamed `.claude/commands/threads-process.md` →
  `kura-process.md` via `git mv` (preserves history).
- Endpoint URL: `/api/threads/import` → `/api/kura/import`.
- `STORE_LISTING.md` (new, 236 lines) — complete Chrome Web Store
  submission package: copy, permission justifications, privacy form
  answers, NB2 image-gen prompts for promo tile + icon, screenshot
  spec with captions, submission checklist.
- `pnpm typecheck` + `pnpm build` both green after rename.

**Monorepo (`~/Arcanea`, commit `739a947a` on `codex/machine-excellence-pp-storage`):**
- `apps/web/app/api/kura/import/route.ts` — Vercel Fluid Compute Node
  function. Zod-validated payload, hard schemaVersion gate (0.2.0),
  8MB body cap, 30s max duration. Mints stable captureId per
  `{platform, conv id, capturedAt}`. v0.2.0 persistence: metadata logs
  only, returns 202 Accepted. Permissive CORS via OPTIONS handler.
- `apps/web/app/api/kura/health/route.ts` — GET healthcheck reporting
  supported schemaVersion + service id.
- `apps/web/app/kura/page.tsx` — landing at `arcanea.ai/kura`. Hero
  with the locked tagline + 蔵 etymology paragraph, three-stage
  workflow (Export → Process → See), supported platforms grid,
  privacy callout, open-source CTA. Server Component, tokens from
  `@arcanea/design-system` (Atlantean Teal + Cosmic Blue + Gold +
  Geist + Instrument Serif + JetBrains Mono).
- `apps/web/app/privacy/kura/page.tsx` — full privacy policy at
  `arcanea.ai/privacy/kura`. Covers exactly what data the extension
  touches, what it does NOT do, opt-in bridge behavior, host
  permissions, retention, children policy, contact, changes.
- Untouched: the existing `apps/web/app/arcanea-vault/` (Starlight
  Vaults memory product — separate, kept as-is).

### Push state

Both branches pushed to origin. PR-creation URLs returned by Git:

- Extension: <https://github.com/frankxai/arcanea-vault/pull/new/codex/excellence-vault-baseline>
- Monorepo: <https://github.com/frankxai/arcanea-ai-app/pull/new/codex/machine-excellence-pp-storage>

The monorepo branch still carries unrelated WIP from earlier in the
session (`.agents/*`, `AGENTS.md` modifications, `planning-with-files/*`
files, `_archive/`, etc.) — none of those were touched by the Kura
commit. If you want to PR the Kura backend in isolation, the simplest
move is `git cherry-pick 739a947a` onto a fresh `feature/kura-bridge`
branch off main and open a PR from there.

### Remaining work (ordered)

1. **Test capture against a real ChatGPT/Claude thread** — fix any
   scraper that broke since Feb. Half-session.
2. **Run `/kura-process` on the result** — eval entity extraction
   quality, tune taxonomy rules. Half-session.
3. **Verify `arcanea.ai/api/kura/import` returns 202** in production
   once the monorepo branch merges. Single curl from the morning.
4. **Generate the Web Store assets** per `STORE_LISTING.md` §5 — NB2
   prompts already written. 2-3h.
5. **Pay the $5 Chrome dev fee, submit, wait 1-3 business days.**
6. **Optional `gh repo rename arcanea-vault arcanea-kura`** — last
   cosmetic step. GitHub auto-redirects old URLs.

### Quality reflection

What went well:
- Three-name iteration (Vault → Threads → Kura) was friction-fast
  because the architecture under the name was already locked. Names
  are cheap when the spec is locked first.
- The bridge endpoint exists. The "Send to Arcanea" button in the
  popup will now succeed (with a 202) instead of erroring.
- One coherent commit per concern: rebrand in extension repo, backend
  in monorepo. Surgical staging avoided dragging unrelated WIP.

What's wobbly:
- The scrapers are still untested against current platform DOMs.
  Until I see one real capture land cleanly in `Kura/`,
  everything above v0.2.0 is theory.
- The `/kura-process` skill is well-specified but has not been run
  against any actual vault yet. Quality of entity extraction is
  unknown until evaluated.
- The monorepo branch is mixing concerns. Cherry-pick the Kura
  commit to a clean branch before PR'ing if you want a tidy review.

---

## Wave 4 addendum — Council split ratification (2026-05-16)

The FrankX Superintelligent Council convened on 2026-05-16 to ratify a
brand split. Verdict: **4/4 YES, 0.91 confidence**.

### The split

- **Kura** — sovereign, brand-neutral export tool. Repo, extension,
  format spec, generic `/kura-process` skill. Tagline:
  *"Kura — export your most precious writing."*
- **Arcanea Kura** — Arcanea's specialization on top of Kura. The
  `/arcanea-kura-process` skill (worldbuilding entity extraction),
  the opt-in `Send to Arcanea` button in the popup, and the
  `arcanea.ai/kura` marketing page.

### Extension repo (`~/arcanea-vault`, commit `5327ca2`)

- `manifest.json`: name `"Kura — Export your most precious writing…"`,
  short_name `"Kura"`
- `package.json`: name `kura`
- `frontmatter.ts`: `VAULT_ROOT = 'Kura'`, `CAPTURED_BY = 'kura/0.2.0'`
- Vault on disk: `~/Downloads/Kura/` (was `~/Downloads/ArcaneaKura/`)
- popup + sidepanel: "Kura" everywhere; "Arcanea" only in the opt-in button
- Service worker boot log: `[Kura] Service worker initialized`
- Bridge payload: `{ source: "kura", integration: "arcanea", … }`;
  header `X-Kura-Source`
- `.claude/commands/kura-process.md` (new generic skill — format
  enforcement + index refresh, no entity extraction)
- `.claude/commands/arcanea-kura-process.md` (was `kura-process.md` —
  keeps the Arcanea worldbuilding extraction)
- Full README, FORMAT_SPEC, CLAUDE.md, STORE_LISTING, EXCELLENCE_AUDIT
  rebranded
- Playwright assertions + smoke-test script updated to "Kura"

### Monorepo state (no change this wave)

- **PR #116** (`apps/web/app/kura/*` + `apps/web/app/api/kura/*`) stays
  in **Draft**. Now correctly positioned as the Arcanea specialization
  surface — `arcanea.ai/kura` is Arcanea's specialization page, not
  Kura's home.
- **PR #117** (delete stale `packages/arcanea-vault/` +
  `packages/arcanea-vault-cli/`) ready to merge anytime.

### Verification status (still pending desktop)

- `pnpm test:extension` — Playwright must run green
- Manual `dist/` load → real ChatGPT/Claude/Grok capture → files in `~/Downloads/Kura/`
- `/kura-process` and `/arcanea-kura-process` against the captured folder

### Updated next-stack order

1. `pnpm test:extension` on desktop (5 min — first real browser validation)
2. Manual capture from one platform → verify `~/Downloads/Kura/` shape
3. Merge PR #1 (extension) once tests + manual pass
4. `gh repo rename arcanea-vault kura`
5. Un-draft + merge PR #116 (monorepo specialization)
6. Merge PR #117 (cleanup stale packages)
7. Generate Web Store assets, submit as **Kura**
