# Arcanea Skills `skill.yaml` Schema

This document defines the canonical metadata format for all Arcanea OSS skills. Every skill in `oss/skills/arcanea/` MUST have a `skill.yaml` file alongside its `SKILL.md` for marketplace discovery, installation, and cross-tool compatibility.

> Goal: one metadata file that describes a skill well enough for any CLI harness (Claude Code, OpenCode, Cursor, Codex, Gemini CLI) to install, display, and invoke it.

---

## File Location

```
oss/skills/arcanea/<slug>/
  ├─ SKILL.md        # Human/LLM-facing skill definition (progressive disclosure)
  └─ skill.yaml      # Machine-readable metadata (this schema)
```

Single-file skills (`<slug>.md`) are NOT supported. Every skill must be a directory containing at minimum `SKILL.md` and `skill.yaml`.

---

## Required Fields

These fields are mandatory. A skill without them will fail marketplace validation.

### `name` (string)
Human-readable display name shown in UI, cards, and search results.
- Use title case.
- Keep under 50 characters.
- Example: `"Arcanea Canon Guardian"`

### `slug` (string)
URL-safe, lowercase identifier. MUST match the directory name.
- Characters: `[a-z0-9-]` only.
- No spaces, underscores, or uppercase.
- Example: `"arcanea-canon"`

### `description` (string)
One-sentence summary used for cards, previews, and search snippets.
- Target 100-200 characters.
- Start with a verb when possible ("Generate...", "Enforce...", "Design...").
- Example: `"Enforce canon consistency across the Arcanea universe — tracks facts, prevents contradictions, guards lore."`

### `version` (string)
Semantic version (semver) of the skill.
- Format: `MAJOR.MINOR.PATCH`.
- Initial release: `1.0.0`.
- Bump MAJOR for breaking changes to skill interface/contract.
- Example: `"1.0.0"`

### `category` (string)
One of exactly these values (controlled vocabulary):

| Category | Use For |
|---|---|
| `writing` | Prose, copy, voice, editing, storytelling |
| `design` | Visual design, UI, typography, color, tokens |
| `development` | Code, engineering, debugging, architecture |
| `worldbuilding` | Lore, canon, characters, factions, mythology |
| `productivity` | Workflows, planning, task management, automation |
| `creative` | Cross-domain creative methodologies and frameworks |
| `ai-agents` | Multi-agent orchestration, prompting, agent design |
| `publishing` | Book production, covers, layout, distribution |

### `author` (string)
Creator name or organization.
- Default: `"FrankX"` or `"Arcanea"` for house-made skills.
- Example: `"FrankX"`

### `license` (string)
SPDX identifier. No custom licenses in the marketplace.
- Common values: `MIT`, `Apache-2.0`, `CC-BY-SA-4.0`, `CC0-1.0`, `AGPL-3.0`.
- Default for Arcanea OSS: `MIT`.
- Example: `"MIT"`

---

## Optional (Recommended) Fields

Strongly encouraged — omit only with good reason.

### `tags` (array of string)
Searchable keywords. 3-7 tags is the sweet spot.
- Lowercase, hyphen-separated.
- Example: `["canon", "lore", "worldbuilding", "consistency", "fantasy"]`

### `tool_compatibility` (array of string)
Which CLI harnesses are tested/supported. Values from:
- `claude-code` — primary target
- `opencode`
- `cursor`
- `codex`
- `gemini-cli`

Default for new skills: `["claude-code", "opencode"]`.

### `dependencies` (array of string)
Slugs of other skills this one depends on. Used for install graph resolution.
- Example: `["arcanea-canon", "arcanea-voice"]`
- Empty array `[]` if none.

### `install_commands` (object)
Per-harness install commands. Keys are tool names, values are shell commands.
Standard pattern for Arcanea OSS skills:

```yaml
install_commands:
  claude-code: "cp -r ~/.claude/skills/<slug>"
  opencode: "cp -r ~/.opencode/skills/<slug>"
  universal: "npx arcanea install <slug>"
```

Replace `<slug>` with the actual slug.

---

## Optional (Metadata) Fields

Nice-to-have for richer marketplace listings.

### `usage_examples` (array of string)
2-3 short example invocations showing what the skill does.
- Format: `"User: <request> → AI: <what skill does>"`
- Keep each under 140 characters.
- Example:
  ```yaml
  usage_examples:
    - "User: generate a book cover for my grimdark novel → AI: runs 5-phase method, composes NB2 prompt, generates cover"
    - "User: make the title bolder → AI: iterates typography with one-hero-color rule"
  ```

### `homepage` (url)
Canonical documentation or showcase URL.
- Example: `"https://arcanea.ai/skills/arcanea-canon"`

### `repository` (url)
Source repository. Defaults to the Arcanea OSS repo if omitted.
- Default: `"https://github.com/frankxai/arcanea"`

### `screenshots` (array of url)
Visual previews for the marketplace card/detail page.
- PNG or JPG, 16:9 preferred.
- Example: `["https://arcanea.ai/screenshots/canon-1.png"]`

### `changelog` (url)
Link to CHANGELOG file.
- Example: `"https://github.com/frankxai/arcanea/blob/main/oss/skills/arcanea/arcanea-canon/CHANGELOG.md"`

### `support` (url)
Issue tracker, Discord, or support forum.
- Example: `"https://github.com/frankxai/arcanea/issues"`

---

## Auto-Populated Fields (DO NOT SET MANUALLY)

The marketplace tooling fills these in. Do not include them in hand-authored `skill.yaml`:

- `last_updated` — ISO8601 timestamp of last modification
- `stars` — marketplace star count
- `downloads` — install counter

---

## Marketplace Listing Requirements

To be listed in the Arcanea skill marketplace, a `skill.yaml` MUST include:

1. All **Required Fields** (name, slug, description, version, category, author, license)
2. At least `tool_compatibility` and `tags` from the Recommended section
3. A corresponding `SKILL.md` in the same directory with valid frontmatter
4. The `slug` must match the directory name exactly

Skills missing any required field will be rejected by `arcanea validate`.

---

## Validation

Run validation with:

```bash
npx arcanea validate oss/skills/arcanea/<slug>
# or validate all:
npx arcanea validate oss/skills/arcanea
```

Validator checks:
- All required fields present and typed correctly
- `category` is in the controlled vocabulary
- `version` parses as semver
- `license` is a known SPDX identifier
- `slug` matches directory name
- `SKILL.md` exists and has valid frontmatter
- No unknown top-level keys

---

## See Also

- `SAMPLE_skill.yaml` — fully-annotated reference template
- `arcanea/<any-skill>/skill.yaml` — real examples in every shipped skill
- `SKILL.md` frontmatter format — progressive disclosure spec for the skill body itself

---

## Registry Absorption Decision

> **Decision (2026-04-08):** Adopt shadcn/ui's `registry.json` format as Arcanea's skill distribution protocol. Do not invent a custom skill registry spec.

### Context

We needed a way to distribute skills so users could install them with a single command from any project. We considered three options:

1. **Invent our own JSON format** — full control, but zero ecosystem leverage and requires teaching users a new mental model.
2. **Use `package.json` + npm** — familiar but heavy (versioning, tarballs, scope collisions) and doesn't match how Claude Code skills actually live on disk.
3. **Adopt shadcn/ui's registry format** — industry-standard for "copy these files into my project." Works with `npx shadcn@latest add <url>`. Zero teaching overhead for the frontend crowd we're courting.

We picked (3).

### What we absorb

- Root `registry.json` with `$schema`, `name`, `homepage`, `items[]`
- Per-item `r/<name>.json` with embedded file `content`
- `files[].path`, `files[].type`, `files[].target`, `files[].content` field shapes
- The mental model: "registry is a collection of items; items are collections of files; CLI fetches and writes."

### What we extend

| Extension | Rationale |
|-----------|-----------|
| `type: "registry:skill"` | Skills aren't components; the custom type lets marketplace tooling filter by kind without breaking shadcn parsers (which treat unknown `type` as pass-through). |
| `target: "~/.claude/skills/<slug>/..."` | Skills install into the user's home dir, not a Next.js project tree. Shadcn CLI writes literal strings — the Arcanea CLI resolves `~` at install time. |
| `meta.slug`, `meta.version`, `meta.license`, `meta.tags` | Shadcn's item schema has no first-class `version` or `slug` field. We stash them under the opaque `meta` pass-through so both `skill.yaml` and the registry agree. |

### What stays unchanged

- `skill.yaml` — still the hand-written source of truth for metadata.
- `SKILL.md` — still the progressive-disclosure body.
- `apps/web/lib/skills/loader.ts` — continues to read `skill.yaml` from disk; the registry is a separate export surface, not a replacement.

### Generation pipeline

`skill.yaml` + `SKILL.md` + any other files in `arcanea/<slug>/`
  → `oss/skills/scripts/build-registry.mjs`
  → `oss/skills/r/<slug>.json` (full, with content) + `oss/skills/registry.json` (shallow manifest)

Run `pnpm build:registry` from the repo root whenever a skill changes. The generated files are committed so GitHub's raw URLs can serve them without a build step.

### Install paths (all valid)

```bash
# Arcanea CLI (recommended — handles ~ expansion and per-harness install paths)
npx arcanea install book-cover

# Shadcn CLI (power users — writes to target paths verbatim)
npx shadcn@latest add https://raw.githubusercontent.com/frankxai/arcanea/main/oss/skills/r/book-cover.json

# Manual curl (always works)
curl https://raw.githubusercontent.com/frankxai/arcanea/main/oss/skills/r/book-cover.json | jq '.files[] | {path, target}'
```
