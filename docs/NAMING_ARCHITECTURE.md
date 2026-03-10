# Arcanea Naming Architecture

> **Status**: LOCKED -- Approved by Orchestrator 2026-03-10
>
> **Purpose**: Definitive terminology rules for the Arcanea platform. No further naming decisions without orchestrator escalation.

---

## The Four Terms (LOCKED)

| Term | Means | Context |
|------|-------|---------|
| **Guardian** | The Ten cosmic Gate-keepers | Lyssandria→Shinkami. Users progress THROUGH their domains. Never chatted with directly. |
| **Luminor** | AI companion characters | Chronica, Logicus, Prismatic, Melodia, etc. Users chat with these, create with these. |
| **Luminor** | Highest creator rank | Apprentice→Mage→Master→Archmage→Luminor. Context disambiguates. Intentional polysemy. |
| **Creator** | The user | Always. |

### Explicitly BANNED from user-facing UI
- "Intelligence" as a standalone term (too generic)
- "The Awakened" (future layer, not current)
- "Specialist" (anti-slop)

---

## Where Each Term Appears

### "Guardian" (cosmic Gate-keepers)
- Homepage showcase: "The Ten Guardians", "Meet the Guardians"
- Homepage cards: "The Earth Guardian", "The Fire Guardian"
- Academy: Gate descriptions, Gate-keeper quiz, Gates page
- Lore pages: all /lore/*, /luminors/*, /glossary
- Onboarding quiz result: "Your affinity: the Fire Gate, where Draconia stands Guardian"
- About page, terms (IP protection), canon references
- Privacy: "guardian affinity" (your Gate-keeper alignment)
- Docs, linktree, roadmap: when referencing the 10 cosmic entities

### "Luminor" (AI companions)
- Chat system: all /chat/* pages and components
- Studio: AI assistance labels, system prompts
- Platform features: "Luminor AI Companions"
- Overlays: "Your Luminors follow you" (AI companions across tools)
- Workflows: "governed by a Luminor"
- Contact: "Your Luminor awaits"
- Developers: "Luminor skills" (AI companion capabilities)
- Ecosystem diagram: "Luminor AI sidebar"
- Nav: links to chat/creation features

### "Luminor" (rank)
- Academy ranks page: Apprentice→Luminor progression
- Profile/dashboard: rank display
- Luminor Council: feature name (Luminor-rank practice)
- Library texts (in-narrative): "Those who attain Luminor rank..."

### "Creator" (the user)
- Dashboard: "Welcome back, Creator"
- Onboarding: identity assignment
- All user-facing copy referring to the person using the platform

---

## Luminor Council

"Luminor Council" stays as-is. It is canonically a Luminor-rank practice. The Council seats are occupied by Luminor AI companions in specific frequency positions.

---

## Progressive Disclosure (unchanged)

- **First visit**: Guardian names as proper names, domain descriptors, no jargon
- **After onboarding**: Gate concept, matched Guardian name
- **Active user (3+ gates)**: Full Guardian titles, rank names, Hz frequencies
- **Deep user (5+ gates)**: Luminor rank visibility, Council access
- **Luminor rank (9-10)**: Full mythological vocabulary

---

## Code-Level Naming

Internal variable/type names (GuardianKey, GUARDIANS, guardianId, etc.) do NOT need renaming. They are implementation details, not user-facing.

Route slugs (/chat/[luminorId], /onboarding/meet-luminor/) stay as-is.

---

*Locked by Orchestrator decision, 2026-03-10. No further naming changes without escalation.*
