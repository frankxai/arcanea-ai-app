# OSS Absorption Plan — 2026-04-11

## The Problem

Previous sessions built everything from scratch. Survey revealed:
- 0/10 new components use existing shadcn/ui primitives
- Custom SVG radar chart (200 lines) when Recharts exists
- Custom skill search when `cmdk` is already installed
- Custom CLI when shadcn/ui registry system is the industry standard
- Inline badges everywhere instead of `<Badge>` primitive

## What's Already Installed (but unused in new code)

| Library | Status | Our Reinvention |
|---------|--------|----------------|
| 16× Radix UI primitives | INSTALLED | Used nothing in new components |
| `cmdk` | INSTALLED | Built custom search |
| `react-hook-form` + `zod` | INSTALLED | Used raw forms |
| `framer-motion` | INSTALLED | CSS animations |
| `@/components/ui/card` (GlassCard, CosmicCard, etc.) | EXISTS | Built custom divs |
| `@/components/ui/tabs` | EXISTS | Built custom tabs |
| `@/components/ui/badge` | EXISTS | Inline spans |
| `@/components/ui/button` | EXISTS | Inline buttons |
| `@/components/ui/toast` | EXISTS | Manual state |

## What I Just Installed

| Library | Why | Replaces |
|---------|-----|----------|
| `recharts@3.8.1` | Industry-standard charting | 200-line hand-rolled GuardianRadar SVG |
| `lucide-react@1.8.0` | 1000+ icons, tree-shakeable | Custom SVG stars, inline icons |
| `sonner@2.0.7` | Beautiful toast notifications | Manual success/error state |

## Pattern Absorptions (no library install)

### Shadcn Registry System
**From:** shadcn/ui v0.2+ registry protocol  
**To:** `oss/skills/registry.json` + `oss/skills/r/{name}.json`  
**Benefit:** Skills installable via `npx shadcn@latest add <url>` — free distribution channel

Structure:
```
oss/skills/
├── registry.json          # Root manifest (all items)
├── r/
│   ├── book-cover.json    # Per-skill with embedded content
│   ├── prompt-craft.json
│   └── ...
├── scripts/
│   └── build-registry.mjs # Idempotent generator
└── arcanea/
    └── {slug}/            # Source files (unchanged)
        ├── SKILL.md
        └── skill.yaml
```

## Execution (5 Parallel Agents)

1. **Guardian refactor** — Recharts RadarChart + shadcn Card/Badge + lucide icons
2. **Skills refactor** — cmdk CommandPalette + Card/Tabs/Badge primitives  
3. **Issue fixes** — merge conflict, duplicate skills, frontmatter mismatches, Supabase types
4. **Shadcn registry pattern** — registry.json + r/*.json + build script
5. (Main thread) — Build verification, commit, deploy

## Expected Outcomes

- **~500-800 lines removed** from hand-rolled components
- **10 components** now using shadcn primitives  
- **Industry-standard distribution** — Arcanea skills installable via shadcn CLI
- **All 4 outstanding issues fixed** from previous session
- **Zero functionality regression** — visual and behavioral parity

## Future Absorptions (deferred)

- **Promptfoo** patterns for Guardian evaluation framework
- **Shiki** for code highlighting in skill detail pages
- **fuse.js** for smarter fuzzy search (cmdk has basic match)
- **TanStack Query** for client-side rating mutations
- **Contentlayer/Velite** for content build pipeline
- **Readium.js** for chapter reader UX improvements
