# Arcanea Skills Registry

A shadcn-compatible registry of Claude Code / OpenCode skills published by Arcanea.

> Install any skill with the same mental model as `npx shadcn@latest add button` — just point at an Arcanea registry URL.

---

## What lives here

```
oss/skills/
  arcanea/                 # source of truth: one folder per skill
    book-cover/
      SKILL.md
      skill.yaml
    arcanea-lore/
      SKILL.md
      skill.yaml
      foundations/
        ...
  r/                       # GENERATED — per-item registry files (shadcn format)
    book-cover.json
    arcanea-lore.json
    ...
  registry.json            # GENERATED — root manifest listing all items
  scripts/
    build-registry.mjs     # regenerates registry.json + r/*.json
  SCHEMA.md                # skill.yaml metadata schema + absorption notes
```

The `registry.json` manifest and the `r/*.json` files are **generated** from the contents of `arcanea/<slug>/`. Do not hand-edit them — edit the source files and re-run the builder.

---

## Browsing the registry

- **Website** (coming): `https://arcanea.ai/skills`
- **Raw manifest:**
  ```bash
  curl https://raw.githubusercontent.com/frankxai/arcanea/main/oss/skills/registry.json
  ```
- **Single item:**
  ```bash
  curl https://raw.githubusercontent.com/frankxai/arcanea/main/oss/skills/r/book-cover.json
  ```

Every item has:

- `name` — slug (matches the directory name)
- `type` — `registry:skill`
- `title`, `description`, `categories`
- `files[]` — each with `path`, `target`, and (in `r/<name>.json`) `content`

---

## Installing

### Via the Arcanea CLI (recommended)

```bash
npx arcanea install book-cover
```

The Arcanea CLI knows how to resolve `~/.claude/skills/<slug>/` correctly per harness (Claude Code, OpenCode, Cursor, etc.) and will fall back to a GitHub-API walk if the registry ever becomes unavailable.

### Via the shadcn CLI (power users)

```bash
npx shadcn@latest add https://raw.githubusercontent.com/frankxai/arcanea/main/oss/skills/r/book-cover.json
```

This writes the files to the `target` paths declared in the registry item (by default `~/.claude/skills/<slug>/<file>`). Because shadcn was built with Next.js projects in mind, it may warn about unknown types or expect a `components.json` — that's fine for skills, which don't use the component-slot system.

Power-user tip: you can override `target` in your local `components.json` to put skills under your project (e.g. `./skills/<slug>`) if you want to version-control them alongside your code.

### Manual (curl + unzip into place)

```bash
mkdir -p ~/.claude/skills/book-cover
cd ~/.claude/skills/book-cover
curl -O https://raw.githubusercontent.com/frankxai/arcanea/main/oss/skills/arcanea/book-cover/SKILL.md
curl -O https://raw.githubusercontent.com/frankxai/arcanea/main/oss/skills/arcanea/book-cover/skill.yaml
```

---

## Creating a new skill

1. Create `oss/skills/arcanea/<your-slug>/`
2. Add `SKILL.md` (the skill body, with frontmatter) and `skill.yaml` (machine metadata — see [`SCHEMA.md`](./SCHEMA.md))
3. Run `pnpm build:registry` from the repo root
4. Commit both the source files **and** the regenerated `registry.json` + `r/<your-slug>.json`
5. Open a PR — the registry files are served statically from the `main` branch via GitHub's raw URL

See [`SAMPLE_skill.yaml`](./SAMPLE_skill.yaml) for a filled-in template.

---

## Regenerating the registry

From the repo root:

```bash
pnpm build:registry
```

This runs `node oss/skills/scripts/build-registry.mjs`, which:

1. Walks `oss/skills/arcanea/*/`
2. Reads each skill's `skill.yaml` (falling back to `SKILL.md` frontmatter)
3. Inlines every file in the skill directory as a `content` string
4. Writes `r/<slug>.json` for each skill
5. Writes `registry.json` with a shallow list (no `content` — that's only in `r/*.json`)

The script is idempotent — rerun it anytime the source changes.

---

## Registry format

We adopt shadcn/ui's v0.2+ registry schema with two deliberate extensions:

| Field | Value | Why |
|-------|-------|-----|
| `type` | `registry:skill` | Skill bundles aren't UI components. We use a custom type so future marketplace tooling can filter cleanly. |
| `target` | `~/.claude/skills/<slug>/<file>` | Skills install into the user's home-directory skills dir, not a Next.js project tree. The Arcanea CLI resolves `~` at install time. |
| `meta.slug`, `meta.version`, `meta.license`, `meta.tags` | extra metadata | Shadcn's schema has no first-class `version` or `slug` field at the item level, so we stash them under `meta` (which shadcn treats as opaque pass-through). |

Everything else — `$schema`, `name`, `title`, `description`, `categories`, `files[]`, `files[].path`, `files[].type`, `files[].content` — is pure shadcn. That's what lets `npx shadcn@latest add <url>` parse our files.

See [`SCHEMA.md`](./SCHEMA.md#registry-absorption-decision) for the full absorption rationale.
