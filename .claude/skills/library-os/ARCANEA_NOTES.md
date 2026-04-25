# Library OS — Arcanea Adaptations

Arcanea-specific notes on top of the canonical [Library OS](https://github.com/frankxai/library-os) workflow.

> The base SKILL.md describes the universal workflow (capture → extract → enrich → publish).
> This file documents how to adapt it for **fantasy book documentation** in the Arcanea universe.

## What's the same

- Three slash commands (`/library-add`, `/library-deepen`, `/library-research`) — work unchanged
- Subagent (`book-distiller`) — extraction quality rails apply
- Schema spine (`BookReview` + `BookQuote` + `BookChapterSummary` + `RelatedReadingItem` + `BookVideo`) — works for fantasy
- Quote curation principles (load-bearing, attributable, spread across chapters) — universal

## What's different — fantasy categories

The base library uses self-development categories. For Arcanea fantasy books, swap the category set:

| Replace canonical | With Arcanea-flavored |
|---|---|
| Self-Development, Habits, Productivity | **Worldbuilding, Magic System, Characters, Plot, Themes** |
| Mindset, Wealth, Career | **Lore, Mythology, Cosmology** |
| Stoicism, Classic | **Epic, Mythic, Saga** |

Update the `categoryColors` map in the index page to match the Arcanea palette (likely cyan/violet/gold instead of amber/emerald).

## What's different — fantasy quote types

For fantasy books, quotes typically fall into different functional buckets:

- **In-world axioms** — what a character *believes* (e.g. "The path of light is paved with sacrificed shadows")
- **Worldbuilding fragments** — descriptions of magic systems, cosmology, places
- **Character voice** — distinctive lines that capture a character's mindset
- **Thematic statements** — what the *book* argues about reality, not what a character says

Use the optional `context` field on `BookQuote` to disambiguate:

```ts
{
  text: "The path of light is paved with sacrificed shadows.",
  chapter: "Chapter 7 — The Verdant Threshold",
  context: "Spoken by the Verdant Guardian. Encapsulates the book's central
            argument that creation requires conscious destruction.",
}
```

## What's different — chapters can include lore

For non-fiction the chapter `summary` is "what the chapter argues." For fantasy, the chapter summary should be:

- **What happens** (plot beat, no spoilers in the keyIdea)
- **What's revealed** (worldbuilding the reader learns)
- **What's at stake** (emotional / cosmological)

Use `keyIdea` for the chapter's emotional or thematic core, not for plot mechanics:

```ts
{
  number: 7,
  title: "Chapter 7 — The Verdant Threshold",
  keyIdea: "Some doors only open to those willing to leave the light behind.",
  summary: "Aria reaches the Threshold and meets the Verdant Guardian, who offers
            passage in exchange for a memory. We learn that the realm beyond the
            Threshold runs on remembered grief — a piece of cosmology that recasts
            the trilogy's central conflict.",
}
```

## Worldbuilding extension — optional fields to add

Beyond the base schema, fantasy books often deserve their own meta-entities. Two extension patterns:

**Option A: Per-book lore appendices** (lightweight)
- Add a `worldbuilding?: Array<{ name: string; description: string }>` field to `BookReview`
- Render as a section after Chapter-by-Chapter
- Examples: magic systems, deities, factions, places

**Option B: Cross-book entity catalog** (heavyweight)
- Separate `data/lore.ts` with `Character`, `Place`, `Magic`, `Faction` types
- Books reference entities by ID; entities reference books they appear in
- Entity pages at `/lore/{type}/{slug}`
- Quote pages can cross-link to the entity speaking

Option A is recommended for v1. Option B is the "Wikipedia for your world" endgame — defer until you have ≥3 books that share entities.

## Recommended categories for Arcanea fantasy library

```ts
// In app/library/page.tsx categoryColors map
const arcaneaCategories = {
  Worldbuilding: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Magic System': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Characters: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Plot: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Themes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Lore: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Mythology: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Cosmology: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Epic: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Mythic: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Saga: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};
```

## Workflow for adding an Arcanea book

```
/library-add "The Verdant Threshold" by Frank van Geirt
# Edit categories to use Arcanea set: Worldbuilding, Magic System, Themes

/library-deepen the-verdant-threshold
# book-distiller works on fantasy — quotes can be character lines or thematic statements
# Use `context` field to disambiguate (in-world vs. authorial voice)

/library-research the-verdant-threshold
# continueReading: other Arcanea books, source-influence books (LeGuin, Erikson, etc.)
# videos: author readings, lore explainers, fan analyses
```

## Reference

- Canonical SKILL.md (in this folder) — the universal workflow
- [github.com/frankxai/library-os](https://github.com/frankxai/library-os) — open-source template
- [frankx.ai/library](https://frankx.ai/library) — non-fantasy reference (22 books)
- [frankx.ai/library/approach](https://frankx.ai/library/approach) — the manifesto

## Status

Library OS primitives ported to Arcanea on `feat/library-os-fantasy` branch (2026-04-25). Not yet wired into Arcanea's web layer — primitives only. When ready to expose a public Arcanea library, port the Next.js template files (`app/library/`, `data/book-reviews.ts`, `app/books/types.ts`) from library-os into the appropriate Arcanea app and adapt the categoryColors palette to match Arcanea brand.
