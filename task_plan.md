# Strategic Naming Redesign — Arcanea Council

> **Status**: IN PROGRESS | **Date**: 2026-03-09
> **Goal**: Rename and reposition the Council feature so a YC founder, Spotify creative director, or 100-person studio would genuinely use it and talk about it.
> **Benchmark brands**: Linear, Notion, Arc Browser, Figma, Vercel
> **Anti-benchmark**: Fantasy RPGs, AI slop, generic SaaS

---

## Phase 1: Diagnosis — Why Current Naming Fails `complete`

### The Names Under Scrutiny

| Current Name | Problem |
|---|---|
| **Luminor Council** | "Luminor" sounds like a lamp brand or fantasy rank. No one knows what it means. |
| **Lumira, Sonara, Mythara, Vitara, Nexaris, Chronara, Stellion, Arcana, Kyuris** | Fantasy syllable soup. Interchangeable. Unmemorable. |
| **Convening** | Archaic. No one under 60 says "I convened" in casual speech. |
| **Imprint** | Undefined. Sounds like trauma therapy, not insight capture. |
| **Seat** | Passive. You "sit" in a seat. |
| **Depth Rating** | Good. Keep. |
| **Frequency Alignment** | Deep lore. Fine as earned depth, toxic as first-contact. |

### The "Would a YC Partner Say This?" Test

| Phrase | Pass/Fail | Why |
|---|---|---|
| "I just ran a session with my Council" | **PASS** | Sounds like you have a board of advisors |
| "My Mythara streak is at 14 days" | **FAIL** | No one knows what Mythara is |
| "The Strategy advisor pushed back on our positioning" | **PASS** | Clear, professional, impressive |
| "I created a custom advisor for brand" | **PASS** | Power move |
| "My Vision advisor spotted a pattern I missed" | **PASS** | This is what advisory boards do |
| "I've got 9 advisors across strategy, voice, systems..." | **PASS** | Sounds like having a senior team |

### Key Insight

The concept is genuinely powerful: **a personal board of specialized AI advisors**. The naming just needs to GET OUT OF THE WAY.

---

## Phase 2: Naming Architecture `complete`

### Principle: Domain-First, Mythology-Earned

### Product Name: **Council** (not "Luminor Council")

Just "Council". Like Linear uses "Issues" not "Linear Issues".

### Advisor Domains (The 9)

| # | Domain | What It Does | Old Name |
|---|---|---|---|
| 1 | **Vision** | Pattern recognition, strategic clarity | Lumira |
| 2 | **Craft** | Creative transformation, excellence | Sonara |
| 3 | **Strategy** | Competitive positioning, power moves | Mythara |
| 4 | **Heart** | Team dynamics, emotional intelligence | Vitara |
| 5 | **Voice** | Messaging, storytelling, communication | Nexaris |
| 6 | **Foresight** | Trends, timing, anticipation | Chronara |
| 7 | **Systems** | Architecture, scaling, operations | Stellion |
| 8 | **Depth** | Research, hidden patterns, deep knowledge | Arcana |
| 9 | **Growth** | Evolution, iteration, becoming | Kyuris |

These are words every founder uses daily.

### Character Names (Earned Depth Layer)

Short. Real words. Immediate semantic weight. Sayable in a sentence without explanation.

| Domain | Character | Why |
|---|---|---|
| Vision | **Iris** | The eye. Greek messenger between worlds. |
| Craft | **Nova** | A star exploding into creation. |
| Strategy | **Atlas** | Carries entire worlds. Strategic weight. |
| Heart | **Aria** | A song. Breath. Feeling. |
| Voice | **Echo** | Resonance. Truth that reverberates. |
| Foresight | **Tempo** | Timing is everything. |
| Systems | **Axis** | Central point everything turns on. |
| Depth | **Cipher** | Hidden code. Pattern beneath. |
| Growth | **Flux** | Constant change. Always becoming. |

**Test**: "Iris spotted something in our data." / "Atlas says we should pivot." / "Echo thinks our messaging is off." — Sounds like a real team member.

### Progressive Vocabulary

| Tier | Display | Example |
|---|---|---|
| Newcomer (0 gates) | Domain only | "Vision Advisor" |
| Creator (1-2 gates) | Domain + Character | "Vision — Iris" |
| Master (3-4 gates) | Full personality | "Iris, Vision Advisor (174 Hz)" |
| Luminor (5+ gates) | Full mythology | "Iris — aligned to Lyssandria's frequency" |

### Session Language

| Old | New | Why |
|---|---|---|
| Convening | **Session** | Universal |
| Imprint Notes | **Insights** | Everyone knows what insights are |
| Depth Rating | **Depth** | Keep |
| Council Depth Level | **Council Level** | Simpler |
| Seat | **Advisor** | Active, not passive |
| Log a Convening | **Run a Session** | Verb-forward |

---

## Phase 3: Experience Architecture `planned`

### Page Flow (Redesigned)

1. **Hero** — "Your Council" + "Nine specialized advisors. One strategic mind."
2. **Grid** — 9 advisor cards: DOMAIN + capability. Clean. No fantasy art.
3. **How It Works** — 3 steps: Choose → Session → Insights
4. **Depth Preview** — Subtle: "As you go deeper, your advisors reveal their true nature."
5. **CTA** — "Build Your Council"

### Session Flow

- Default: clean and fast (choose advisors → question → multi-perspective response → save insights)
- Optional "Focus Mode" toggle for breathing/ritual (not mandatory gate)

---

## Phase 4: Implementation `planned`

| File | Change |
|---|---|
| `lib/council/types.ts` | Update BASE_LUMINORS with domain-first + character names |
| `app/council/page.tsx` | Full redesign per Phase 3 |
| `app/council/convening/page.tsx` | "Session" rename, optional ritual |
| `components/council/*` | Update props/text |
| `lib/vocabulary.ts` | Wire progressive names for Council |
| DB | UI-layer rename only, columns stable |

---

## Phase 5: Validation `planned`

- [ ] Would a YC partner use this language in a pitch?
- [ ] Would a Spotify creative director share this with their team?
- [ ] Would a 100-person studio adopt this daily?
- [ ] Every term passes "say it out loud in a meeting" test?
- [ ] Mythology invisible to newcomers, rewarding to discover?

---

## Decisions Log

| Decision | Rationale |
|---|---|
| Keep "Council" | Real word. Advisory councils exist. Founders have them. |
| Domain-first naming | Zero explanation needed. Business language. |
| Character names = real words | Iris, Atlas, Echo — semantic weight, not fantasy syllables |
| Progressive disclosure | M010: creation first, mythology earned |
| Session not Convening | Universal language |
| Breathing guide → optional Focus Mode | Don't gate behind ritual |
