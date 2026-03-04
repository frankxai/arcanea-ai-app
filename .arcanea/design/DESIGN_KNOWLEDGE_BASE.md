# Arcanea Design Knowledge Base

> Synthesized from deep research into Linear, Vercel, Suno, Grok, Arc Browser,
> Raycast, Midjourney, Runway, Udio, Pika, v0, and Cursor.
> Updated: 2026-03-03

---

## The One Rule

**Premium design in 2026 is not about beautiful components. It is about
hundreds of invisible, considered decisions that accumulate into a feeling —
and having the discipline not to undo them with decoration.**

---

## Benchmark Products & What Makes Them Work

### Suno (Music Creation)

**Designer**: Metalab (Slack, Headspace)

| Decision | Why it works |
|----------|-------------|
| Grainy, textured dark backgrounds | Reads as analogue warmth — positions as creative tool, not tech product |
| One text field, instant output | 60 seconds to first song. No paywall before value. |
| Two versions generated simultaneously | User feels abundance, not scarcity |
| No AI disclaimers in creation flow | Magic is preserved. No "powered by" in your face. |
| Studio mode hidden until you earn it | DAW-level control exists but never intimidates new users |
| Transitions pulse, not spin | Motion mirrors music — it breathes, not loads |

**Their brand in one word**: Warmth.

### Grok (AI Chat)

**Logo designer**: Jon Vio (black hole / Gargantua reference)

| Decision | Why it works |
|----------|-------------|
| Monochrome only — black and white | Reads as severe and confident against warm competitors |
| No safety disclaimers in UI | Voice is direct. Interface says "To understand" — 3 words. |
| Black hole logo animated with depth | Leads with aesthetic statement, not capability claims |
| No rounded-corner "bubbly" language | Rejects conversational warmth that ChatGPT/Claude use |

**Their brand in one word**: Vast.

### Linear (Project Management)

**The gold standard for SaaS design.**

| Decision | Why it works |
|----------|-------------|
| 8px spacing scale (8, 16, 32, 64) | Felt consistency users can't name but perceive as "polish" |
| LCH color space (not HSL) | Perceptual evenness — nothing jumps or recedes unexpectedly |
| 3 color variables (base, accent, contrast) | Automatic high-contrast accessibility. Simplicity = coherence. |
| Inter Display for headings, Inter for body | Micro-expressiveness in an otherwise neutral typeface |
| Brand color at 1-10% lightness for dark backgrounds | Depth without drama |
| One-axis reading (everything flows down) | Eyes never zig-zag. So unusual it's a brand statement. |
| "Evolution, not revolution" redesign philosophy | Users feel continuity, not disruption |

**Their brand in one word**: Discipline.

### Vercel (Developer Platform)

**Published the most detailed UI design guidelines in the industry.**

| Decision | Why it works |
|----------|-------------|
| Curly quotes, not straight quotes | Typographic care users feel but don't notice |
| Tabular numbers for comparisons | Numbers align perfectly — deployment counts, latency |
| Nested border-radius: child ≤ parent, concentric | Eliminates the "rounded parent, sharp child" visual bug |
| Animate only `transform` and `opacity` | No layout reflows. Silky performance. |
| Loading delay 150-300ms, minimum display 300-500ms | No flicker on fast loads, no flash on slow ones |
| APCA contrast (not WCAG 2) | Perceptually accurate accessibility |
| Custom typeface (Geist) | No existing font was correct, so they made one |
| No color in navigation hierarchy | Type-weight only. Color means state (green=deployed, red=error) |
| Don't pre-disable submit buttons | Let users submit, surface validation errors, not hidden problems |

**Their brand in one word**: Precision.

### Arc Browser

**2025 Red Dot Design Award for Interface Design.**

| Decision | Why it works |
|----------|-------------|
| Sidebar replaces tab bar | Defining spatial decision. Browser disappears, web remains. |
| 90-second onboarding (sidebar + Spaces only) | Two concepts, practiced through interaction, not slides |
| First-launch theatrical moment (screen fades, sphere, sound) | Sets expectation shift before interface loads |
| User-selectable Space colors | Navy=work, orange=personal. Browser has emotional context. |
| Boosts discovered through curiosity, not onboarding | Feature waits for user to wonder "can I change this?" |
| Browser chrome minimizes, content fills foreground | Figure-ground principle. Arc retreats. |

**Their brand in one word**: Disappearance.

### Raycast (Launcher)

| Decision | Why it works |
|----------|-------------|
| Homepage: rich gradients. Product: monochrome text. | Marketing energizes. Product focuses. Deliberate contrast. |
| Deep navy-black (#070921), not pure black | Depth without drama. Infinite space feeling. |
| Each extension has its own gradient color identity | Utility feels like a universe |
| Extension cards: icon, name, 1-line desc, author | Nothing more. Discovery through density, not explanation. |
| No onboarding modals | You learn by using. Intentional friction-through-curiosity. |

**Their brand in one word**: Alive.

---

## Creator Platform Patterns (Suno, Midjourney, Runway, Udio, Pika)

### The Universal Rule

**Time to first creation must be under 3 minutes.** Every successful creator
platform has this. Creation input is above the fold. Everything else is below.

| Platform | Time to first output | Key UX pattern |
|----------|---------------------|----------------|
| Suno | ~60 seconds | One input, two outputs simultaneously |
| Midjourney | ~90 seconds | /imagine command, hover-to-copy-prompt discovery |
| Pika | <5 minutes | Prompt + reference image, immediate generation |
| Udio | ~2 minutes | "Sessions" timeline for iterative creation |
| Runway | ~3 minutes | Pro-focused workflow builder |
| v0 | ~30 seconds | Chat + design mode, immediate preview |
| Cursor | Immediate | AI-native (not bolted-on), tab-to-accept |

### Discovery Loops

- **Midjourney**: Hover over any creation → see its prompt → copy → modify → create your own
- **Suno**: Trending songs → "Create Similar" → your version in 60 seconds
- **v0**: Chat generates code → design mode refines → deploy immediately

### Progressive Disclosure Done Right

| Stage | What's visible | What's hidden |
|-------|---------------|---------------|
| First visit | One input, one button | Everything else |
| First creation | Result + share + "create another" | Settings, tools |
| 5th creation | Suggested styles, community feed | Advanced controls |
| 20th creation | Full studio/editor mode | Power-user shortcuts |
| 100th creation | API access, batch tools | Nothing — everything earned |

---

## The 2025-2026 Design Landscape

### What Replaced Glassmorphism

1. **Liquid Glass** (Apple, WWDC 2025) — Dynamic, contextually-aware transparency.
   Not static blur. Variable opacity, morphing, color-adaptive.

2. **Soft Skeuomorphism** — Gentle 3D presence. Tactile toggles, buttons with depth.
   Physical feeling without pretending to be physical.

3. **Anti-Grid Organic** — Asymmetrical, broken-grid layouts. Signals handcrafted
   authenticity because it cannot be generated at scale.

### The Anti-AI-Slop Signal

"As AI democratizes imitation, human-centric decisions — emotional resonance
over automation — now define premium design." — UX Pilot, 2026

Premium signals are now:
- Visible labor (shows it was made with intention)
- Micro-interactions that feel considered
- Typography that was chosen, not defaulted
- Spacing that breathes
- Restraint (saying no to decoration)

### What Figma Config 2025 Said

Tools are more powerful → taste and intentionality become MORE important.
If anyone can generate a UI in 30 seconds, the differentiator is judgment
about which UI to keep, refine, and ship.

---

## Applied to Arcanea

### What We Should Steal (Ethically)

| From | Pattern | Arcanea Application |
|------|---------|-------------------|
| Suno | Grainy texture on dark backgrounds | Textured creation space — not clean void |
| Suno | Two outputs simultaneously | Generate 2-3 creation variations per prompt |
| Suno | No AI disclaimers in flow | Remove "Powered by Gemini" from creation UI |
| Linear | 8px spacing scale | Enforce 8/16/32/64px grid across all surfaces |
| Linear | LCH color space | Switch from HSL to LCH for perceptual evenness |
| Linear | One-axis reading | Homepage flows down. No zig-zag layouts. |
| Vercel | Animate only transform + opacity | Kill all layout-triggering animations |
| Vercel | Loading delay + minimum display | No flicker, no flash on state transitions |
| Vercel | Color = state, not decoration | Teal = action. Violet = creation. Nothing else. |
| Arc | 90-second onboarding | Two concepts max in first contact |
| Arc | Theatrical first-launch moment | One moment of magic, then functional interface |
| Arc | Content fills foreground, chrome retreats | User's creation is 90% of viewport |
| Midjourney | Hover-to-discover prompts | Explore page: hover on creation → see prompt |
| v0 | Chat → preview → deploy loop | Create → see result → share, in one flow |
| Grok | Monochrome + one accent | Dark + crystal teal only on core screens |

### What We Must Stop Doing

1. **Glass tiers** — Glassmorphism is dead. Replace with Suno-style texture.
2. **Aurora gradients on everything** — Color = meaning, not decoration.
3. **4 typefaces fighting** — 2 maximum. Display + UI.
4. **Particles on functional pages** — Zero ambient animation.
5. **Mythology on first contact** — Value on first contact. Mythology as reward.
6. **185 routes** — 5 core screens, 15 supporting, everything else is depth.
7. **Explaining AI** — Hide the machine. Show the magic.

---

## Reference Links

- [Metalab × Suno Case Study](https://www.metalab.com/work/suno)
- [Linear: How We Redesigned the UI](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)
- [Vercel Geist Design System](https://vercel.com/geist/introduction)
- [Arc Browser Progressive Disclosure](https://onboardme.substack.com/p/how-arc-browser-introduces-ai-max-feature)
- [Grok Logo Analysis](https://www.nan.xyz/txt/grok-a-logo-a-λόγός/)
- [Figma Config 2025](https://www.figma.com/blog/config-2025-recap/)
- [Design Trends 2026](https://uxpilot.ai/blogs/product-design-trends)
