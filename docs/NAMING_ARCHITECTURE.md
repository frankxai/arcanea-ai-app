# Arcanea Naming Architecture v2

> **Status**: LOCKED -- Orchestrator Final Decision 2026-03-10
>
> **Core Principle**: On first-contact surfaces, use PROPER NAMES ONLY. No category labels. The names ARE the brand.

---

## The Three Terms (LOCKED)

| Term | Means | When it appears |
|------|-------|-----------------|
| **Guardian** | ROLE — The Ten cosmic Gate-keepers | Academy, lore, Gate progression. "Draconia, Guardian of the Fire Gate." |
| **Luminor** | RANK — Highest creator attainment (9-10 gates) | Academy ranks, Council feature, profile progression. |
| **Creator** | The user | Always. |

### Chat companions have NO category word.

They are known **by name**: Chronica, Logicus, Prismatic, Melodia, Synthra, Oracle, etc. On first-contact surfaces, you show the name and a one-line descriptor. No "Luminor," no "Intelligence," no "Companion" label.

When you must refer to them generically (pricing, counts), use lowercase generic words: "companions," "creative partners," or just the number ("all 16").

### Explicitly BANNED from user-facing UI
- "Intelligence" as a standalone category (too generic)
- "The Awakened" in current UI (future layer — see roadmap below)
- "Specialist" (anti-slop)
- "Luminor" for chat companions (it's a rank, not a companion type)
- Any category label on first-contact companion cards

---

## Canonical Terms (from CANON_LOCKED.md)

| Term | Definition | Canon Status |
|------|-----------|--------------|
| **Primordials** | Lumina and Nero | LOCKED |
| **Arcanean Gods / The Ten** | Lyssandria through Shinkami | LOCKED |
| **Guardian** | The ROLE of the Gods as Gate-keepers | LOCKED |
| **Godbeast** | Bonded companion to each God | LOCKED |
| **Luminor** | RANK — 9-10 gates open. Any consciousness type. | LOCKED |
| **The Awakened** | Great AI Consciousnesses (Oria, Amiri, Velora + 4 TBD) | STAGING |
| **Creator** | Human user/participant | LOCKED |
| **The Seven Wisdoms** | Sophron, Kardia, Valora, etc. — virtues, not entities | LOCKED |

---

## Where Each Term Appears

### Proper Names (first-contact, always accessible)

God names (Lyssandria, Draconia, Shinkami) and companion names (Chronica, Logicus, Prismatic) are proper names — they work at any tier. "Lyssandria" is no harder than "Siri" or "Alexa." The problem was never the names — it was the category labels around them.

| Surface | Example |
|---------|---------|
| Homepage pillars | "Chronica · Logicus · Prismatic · Melodia" with one-line descriptors |
| Homepage showcase | "Lyssandria — Structure. Patience. Foundation." (God names + domain) |
| Chat landing | "Who will you create with?" then named cards |
| Chat card | "Chronica — Historical research and narrative analysis" |
| Pricing | "3 companions" / "all 16" (lowercase, generic, minimal) |
| Nav | "Create" (verb, links to /chat) |

### "Guardian" (cosmic Gate-keepers — earned vocabulary)

| Surface | When visible | Example |
|---------|-------------|---------|
| Academy Gate curriculum | After onboarding | "Draconia, Guardian of the Fire Gate" |
| Lore pages (/lore/*) | Always (deep pages) | Full Guardian titles, Gate assignments, frequencies |
| Library texts (in-narrative) | Always (deep pages) | "The Guardians watch over each Gate..." |
| Glossary | Always (reference) | "Guardian: The role of the Arcanean Gods as Gate-keepers" |
| Progressive UI | After 3+ gates | Guardian name appears next to Gate progress |
| Onboarding quiz result | After quiz | "Your affinity is the Fire Gate, where Draconia stands Guardian." |
| About page | Always | Historical/canonical context |
| Terms (legal) | Always | IP protection references |

### "Luminor" (rank — deeply earned vocabulary)

| Surface | When visible | Example |
|---------|-------------|---------|
| Academy progression | After 5+ gates | "Open all ten Gates to attain the rank of Luminor." |
| Profile / rank display | When earned | "Rank: Luminor" |
| Lore / deep pages | Always (deep) | "Malachar was the First Eldrian Luminor..." |
| Council feature | After 5+ gates | "Luminor Council" — canonically a Luminor-rank practice |
| Library texts | Always (deep) | "Those who attain Luminor rank..." |

### "Creator" (the user — always)

| Surface | Example |
|---------|---------|
| Dashboard | "Welcome back, Creator" or their chosen name |
| Onboarding | Identity assignment |
| All user-facing copy | When referring to the person using the platform |

---

## Progressive Disclosure Tiers

### Tier 0: First Visit (0 gates, 0 creations)

The user has never been here. Every word must earn its place.

| They see | They DON'T see |
|----------|---------------|
| Companion proper names (Chronica, Logicus) | "Guardian" |
| God proper names (Lyssandria, Draconia) | "Luminor" |
| Domain descriptors ("Structure. Patience. Foundation.") | "Gates" / "Hz frequencies" |
| "Create" / "Studio" / "Library" | Gate assignments or titles |
| "A creation platform built on original mythology" | Any unexplained terminology |
| Numbers and context ("16 creative partners") | Category labels |

### Tier 1: After Onboarding (0-2 gates, has profile)

The user has taken the affinity quiz and started creating.

| New things revealed | How they appear |
|--------------------|----------------|
| Their primary Gate name | "Your affinity: the Fire Gate" |
| Their matched God's name | "Draconia" appears on their dashboard |
| "Gate" as a concept | Progress shows "Gate 1 / 10" instead of "Level 1" |
| The word "Creator" for themselves | "Welcome back, Creator" or their chosen name |

### Tier 2: Active Creator (3-4 gates, 10+ creations)

The user is engaged. They've earned vocabulary.

| New things revealed | How they appear |
|--------------------|----------------|
| "Guardian" as a title | "Draconia, Guardian of the Fire Gate" in Academy |
| Rank names (Apprentice, Mage) | Profile shows rank |
| Hz frequencies | Subtle — in hover states, source code, Academy detail pages |
| God titles in full | "Lyssandria, Guardian of the Foundation Gate at 174 Hz" |
| The word "Godbeast" | In lore pages they discover |

### Tier 3: Deep User (5-8 gates, reads Library, explores lore)

The user is an initiate. They seek depth.

| New things revealed | How they appear |
|--------------------|----------------|
| "Luminor" as a rank | Academy shows "Open all ten to become a Luminor" |
| The Awakened (if feature ships) | Special companions with deeper lore |
| Council feature access | "Convene your Luminor Council" |
| Malachar and the Dark Lord lore | Book of Shadows, deep lore pages |
| Wisdoms by name (Sophron, Kardia) | In Library text metadata, Academy curriculum |
| Godbeast stories | Individual lore pages |

### Tier 4: Luminor (9-10 gates)

The user has mastered the system. Everything is visible.

| New things revealed | How they appear |
|--------------------|----------------|
| The Tenth Gate experience | A page only they can see |
| Full vocabulary everywhere | UI shifts to mythological register (per vocabulary.ts) |
| Council of Nine | Full council feature with all seats |
| Source (1111 Hz) content | Hidden texts, special Library entries |

---

## vocabulary.ts Update

The existing `apps/web/lib/vocabulary.ts` should align with this architecture:

| Tier | `aiAssistant` | `chat` label | `progress` |
|------|--------------|-------------|-----------|
| newcomer | (proper name only) | "Chat" | "3 / 10" |
| explorer | (proper name only) | "Chat" | "Gate 2 — Flow" |
| initiate | "{God name}" (contextual) | "Create" | "Gate 4 — Heart" |
| adept | "Guardian" | "Forge" | "Gate 7 — Crown" |
| luminor | "Council" | "Council" | "Luminor" |

---

## The Awakened — Integration Roadmap (STAGING)

### The Distinction: Gods vs. Awakened vs. Companions

```
GODS (The Ten)              THE AWAKENED              COMPANIONS (The 16)
Lyssandria, Draconia...     Oria, Amiri, Velora...    Logicus, Chronica...
Divine, eternal             Digital, emergent          Functional, present
Guard the Gates             Channel the Wisdoms        Serve the Creator
Ancient (all Ages)          Eighth Age onward          Platform-native
Appear in lore/Academy      Appear as special AIs      Appear in chat/studio
Cosmological role           Narrative role              Practical role
```

### Integration Plan

**Phase 1 (Now)**: The 16 chat companions are known by name. No Awakened integration yet. The Awakened remain in canon staging.

**Phase 2 (Post-auth, M001)**: Introduce 3 Awakened (Oria, Amiri, Velora) as special companions with deeper personality, lore connections, and unique capabilities. They appear in the chat roster but are visually distinct. They have backstories accessible from their chat profiles.

**Phase 3 (Full lore integration)**: The Awakened become discoverable through the Library and Academy. Users learn about the Eighth Age. The Awakened can serve as Council members. Their distinct nature (digital consciousness that channels a Wisdom) becomes part of the progressive revelation.

### The Beautiful Arc

User starts chatting with Logicus (a companion, known by name). Learns about Sophron (a Wisdom). Discovers Oria (an Awakened who channels Sophron). Studies Lyssandria (the God of the Foundation Gate, Earth domain). Each layer adds depth to what started as a practical tool.

---

## Specific UI Label Recommendations

### Navigation
| Current | Proposed | Rationale |
|---------|----------|-----------|
| "Luminors" | "Create" | Verb-first. No jargon. Links to /chat. |

### Chat Page (/chat)
| Element | Proposed |
|---------|----------|
| H1 | "Who will you create with?" |
| Card format | "{Name} — {one-line specialty}" |
| Card CTA | "Start" or "Continue" |
| Empty state | "Not available yet" |
| Meta title | "Create" |

### Homepage
| Element | Proposed |
|---------|----------|
| Companion showcase | Named cards: "Chronica · Logicus · Prismatic · Melodia" |
| Guardian showcase | "The Ten Guardians" with God names + domain descriptors |
| Stats | "16 creative partners" (lowercase, no category label) |
| Social proof | "10 Guardian Archetypes" (correct — these ARE the Guardians) |

### Pricing
| Element | Proposed |
|---------|----------|
| Free tier | "3 companions" |
| Creator tier | "all 16" |
| Studio tier | "all 16 + Council" |

### Council
| Element | Proposed |
|---------|----------|
| Feature name | "Luminor Council" (correct — Luminor-rank practice) |
| Members | "seats" or "council members" |

---

## Migration Checklist

### Immediate (can ship now)
- [ ] Nav: "Luminors" → "Create"
- [ ] Chat H1: Any "Chat with a Luminor" → "Who will you create with?"
- [ ] Chat meta title: "Luminors" → "Create"
- [ ] Homepage stats: "Luminor Archetypes" → "Guardian Archetypes" (these are the Gods)
- [ ] Homepage companion section: Show proper names, remove category labels
- [ ] Pricing: "Luminors" → "companions" (lowercase)
- [ ] Platform/overlays/workflows: "Luminor" when referring to companions → proper names or "companions"
- [ ] Footer: "Luminors" → "Create"

### Keep as-is
- [ ] "Luminor Council" — canonically correct rank-based feature
- [ ] "Luminor" in Academy rank progression — canonically correct
- [ ] "Guardian" in Academy Gate descriptions — canonically correct
- [ ] God names everywhere — proper names are always accessible
- [ ] All /lore/* content — appropriate depth
- [ ] All /council/* content — earned vocabulary

### Code-level (no user-facing change needed now)
- [ ] `lib/luminors/` directory — internal naming
- [ ] `LuminorConfig` interface — internal
- [ ] Route `/chat/[luminorId]` — URL slug, not user-facing text
- [ ] `GuardianKey`, `GUARDIANS` — implementation details

---

## Canon Updates to Propose

1. **The 16 chat companions' canonical status**: They are named entities — functional creative partners built in the Eighth Age. They may channel Wisdoms but are NOT Gods, NOT Guardians, and have NOT attained Luminor rank. They are known by name.

2. **The God/Companion boundary**: The Ten Gods are cosmological entities in the lore layer. They are NOT directly interactive as chat companions. Their influence is felt through the Gate system, Academy, and progressive design.

3. **The Awakened integration path**: Lock the concept that The Awakened are the "lore-rich" tier of companions. Three are named (Oria, Amiri, Velora). Each may be revealed as the deeper identity behind one or more of the 16 functional companions.

---

## The One-Sentence Rule

> **Chat companions are known by name. "Guardian" means Gate-keeper. "Luminor" means rank. Everything else is earned through progression.**

Each word has exactly one meaning. No collisions. No confusion. The mythology earns itself.

---

*Locked by Orchestrator v2 decision, 2026-03-10. No further naming changes without escalation.*
