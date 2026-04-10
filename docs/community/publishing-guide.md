# Publishing Books on Arcanea — Community Guide

Welcome. This guide explains how to publish a book to the Arcanea Open Library — whether you're writing solo, co-authoring with AI, or collaborating with other humans.

**TL;DR:** Write your book in a folder, add a `book.yaml` manifest, open a pull request. CI checks quality. If it passes, you're published to the community tier within minutes.

---

## The Three Tiers

| Tier | How to publish | Review | Revenue |
|------|----------------|--------|---------|
| **Community** | PR auto-merges on CI pass | Quality gate only | Always free |
| **Featured** | Editor promotes from community | Human review + Guardian ratings | Subscriber access, 70/30 split |
| **Canon** | Frank-only flagship | Arcanea universe integration | Always free |

Start in Community. Good books graduate to Featured.

---

## Step 1: Fork and Clone

```bash
# Fork https://github.com/frankxai/arcanea-ai-app on GitHub
git clone https://github.com/YOUR-USERNAME/arcanea-ai-app.git
cd arcanea-ai-app
git checkout -b book/your-book-slug
```

## Step 2: Create the Book Directory

```
book/
└── your-book-slug/
    ├── book.yaml              # Required manifest
    ├── chapters/
    │   ├── 00-prologue.md     # Optional
    │   ├── 01-first-chapter.md
    │   ├── 02-second-chapter.md
    │   └── ...
    ├── outline/               # Optional
    │   └── story-architecture.md
    ├── characters/            # Optional
    │   └── profiles.md
    └── worldbuilding/         # Optional
        └── world-bible.md
```

Rules:
- Directory name = slug (lowercase, hyphens, no spaces)
- Chapters are numbered markdown files (`00-` to `99-`)
- Filenames become URL slugs (strip the number prefix)
- Each chapter must be 500+ words to pass the gate

## Step 3: Write `book.yaml`

This is the heart of the contract with readers.

```yaml
title: "The Tides of Silence"
slug: tides-of-silence
tier: community        # community | featured (featured requires editor approval)
status: in-progress    # draft | in-progress | complete | archived

authors:
  - name: Your Name
    github: your-github-handle
    role: creator       # creator | co_author | co_creator | editor | contributor
  - name: Collaborator Name
    role: co_author

ai_transparency:
  models_used:
    - id: claude-opus-4-6
      provider: anthropic
      role: prose-drafting
  human_contribution: 30   # % estimate — be honest
  ai_contribution: 70
  method: "Human direction + AI prose drafting, human curation and editing"

license: CC-BY-NC-SA-4.0   # recommended for community tier
content_rating: general    # general | mature | explicit
tags: [literary-fantasy, water-magic, le-guin-adjacent]

acknowledgments: |
  World concept co-created with [collaborator]. Story architecture
  and character design by human authors. Prose generation by
  Claude Opus 4.6, curated and edited by humans.
```

### Required fields
- `title`, `slug`, `tier`, `status`
- `authors` (at least one with `role: creator`)
- `ai_transparency` (all sub-fields if AI was used)
- `license`
- `tags` (at least one)

### AI transparency is non-negotiable
If AI was used at any stage, declare it. Not because we're policing — because readers deserve to know, and the US Copyright Office / EU AI Act are watching.

Honest estimates are fine. You don't need to measure percentages with a stopwatch. A reasonable split between what the human decided and what the AI drafted is the expectation.

## Step 4: Write Your Book

Start with `01-first-chapter.md`. Add a `## Chapter One: Title` heading at the top.

**Minimum per chapter:** 500 words
**Recommended per chapter:** 3,000-5,000 words for novels, 1,500-3,000 for novellas

The CI quality gate runs an **anti-slop scan** that flags overuse of common AI verbal tics. If you see a warning about "delve", "tapestry", "nestled", "myriad", or "beacon" — rewrite those sentences. They're not forbidden, they're just symptoms of lazy drafting.

## Step 5: Add a Cover (Optional but Recommended)

Two paths:

**Path A: Git-tier cover (committed to repo)**
1. Generate or commission cover art
2. Save to `apps/web/public/images/books/{your-slug}-cover.png`
3. Recommended: 1200x1800px, portrait ratio, < 2MB

**Path B: Use the `/arcanea-book-cover` skill**
- Install the Arcanea skill pack (`npx arcanea install book-cover`)
- Run the skill and it generates a cover via NB2
- The skill handles validation and optimal prompting

## Step 6: Open a Pull Request

```bash
git add book/your-book-slug/
git add apps/web/public/images/books/your-slug-cover.png  # if git-tier
git commit -m "book(your-slug): initial draft — Ch 1-3"
git push origin book/your-book-slug
```

Then open a PR on GitHub. Use the **Book Contribution** template.

## Step 7: CI Quality Gate

The gate runs automatically on PR open. It checks:

- [ ] `book.yaml` exists and parses as valid YAML
- [ ] `book.yaml` has all required fields
- [ ] At least one chapter in `chapters/` with 500+ words
- [ ] AI metadata present if AI was used
- [ ] License declared
- [ ] No secrets, no binaries outside allowed paths
- [ ] Anti-slop scan within acceptable density
- [ ] Markdown passes basic linting
- [ ] Build passes (no broken imports)

**If passes:** PR is labeled `book:ready` and can be merged (auto-merge for community tier).
**If fails:** PR gets feedback comments. Fix and push — the gate re-runs.

## Step 8: Merge and Publish

Once merged to main:
1. Vercel deploys automatically
2. Your book appears at `arcanea.ai/books/drafts/{your-slug}`
3. Chapters readable at `arcanea.ai/books/{your-slug}/{chapter-slug}`
4. Listed in the drafts hub at `arcanea.ai/books/drafts/`

---

## Updating Your Book

Same flow — open a new PR with your updates. The quality gate runs on every change.

**Adding chapters:** Create new numbered files in `chapters/`.
**Revising chapters:** Edit existing files, bump version in git commits.
**New cover:** Upload via the covers API or commit new image, update `book.yaml`.

---

## Getting Promoted to Featured Tier

Featured books get:
- Dedicated hero section on the library
- Guardian Intelligence Ratings (5-dimension LLM review)
- Revenue share on subscriber reads
- Editorial review and voice polish suggestions

Request featured promotion by:
1. Opening an issue with label `book-promotion-request`
2. Linking your community-tier book
3. Explaining what makes it featured-worthy

Editors review. No guarantees, but strong community books (high ratings, polished voice, original concept) get promoted.

---

## Rules of the Road

1. **Your book, your voice.** No one on the Arcanea team will rewrite your work without permission.
2. **AI is a tool, not a ghost.** Declare what it did. Claim what you did.
3. **No hate, no harm.** Community tier is open. Explicit hate speech or harm content gets removed.
4. **Respect licenses.** If you reference other works, credit them. Fair use applies.
5. **One book per PR.** Don't bundle unrelated changes.

---

## Getting Help

- Discord: `#authors` channel
- GitHub Discussions: [arcanea-ai-app/discussions](https://github.com/frankxai/arcanea-ai-app/discussions)
- Skill help: `/arcanea-author` inside Claude Code

---

## The First Three Books

For reference, these books established the publishing pattern:

- [The Forge of Ruin](https://arcanea.ai/books/drafts/forge-of-ruin) — Dark epic fantasy, 4 chapters
- [The Tides of Silence](https://arcanea.ai/books/drafts/tides-of-silence) — Literary water fantasy, 3 chapters
- [The Heart of Pyrathis](https://arcanea.ai/books/drafts/heart-of-pyrathis) — Epic genre mashup, 2 chapters

Study their `book.yaml` files. Copy what works.

---

*"Write the thing only you can write. Be honest about how you wrote it. The rest is engineering."*
