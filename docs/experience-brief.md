# arcanea.ai — experience brief

> Routed by the stack-kits prompt router to every UI, CTA and conversion prompt in this repo. `TASTE.md` and `DESIGN.md` outrank this file on taste and tokens. This file decides **what the homepage is for, in what order it explains itself, and what "converted" means**.
>
> Evidence: live capture of www.arcanea.ai on 2026-10-13 (mobile 360×800 plus full text), and a code audit of `apps/web` at `cadf533`. Line references are to that commit.

## The job

Get a creator from **one sentence** to a **named world that remembers**, then bring them back to it. Everything else on the page is either proof of that or a distraction from it.

## Who it is for

|             | Who                                                                                                        | What they have today                       | What they fear                 |
| ----------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------ |
| **Primary** | Solo world-builders: novelists, game and TTRPG designers, showrunners, already prompting ChatGPT or Claude | A world spread across chats that forget it | Losing continuity and their IP |
| Secondary   | AI-native developers (MCP, CLI, agent tooling)                                                             | Their own keys and editors                 | Lock-in, black boxes           |
| Not for     | People who want a generic chatbot, or a game to play                                                       | —                                          | —                              |

## The one conversion

- **Activation (primary): first world generated and saved.** The path is `/worlds/create`, which requires sign-in and a Gemini key (`app/api/worlds/generate/route.ts:36,51`).
- Secondary: a first chat sent with the creator's own key (`/chat`).
- Retention loop: return to a named world. A world that is not reopened has not converted.
- Capture fallback: the footer newsletter (`/api/subscribe` → Supabase `subscribers`).

**The biggest leak is the key wall.** The hero promises "type one sentence", and the final CTA says "Free to start". The first send to `/api/ai/chat` returns 401 _Connect your provider key_ when no key is set (`route.ts:266-281`). Creating a world also needs sign-in plus a key. Either the first world is funded, or the hero says plainly that you bring a key. No other fix on this page moves activation as much. **This is Frank's call; see Decisions.**

## Explain in this order

TASTE Gate 5 sets the sequence. Each step answers one question the visitor is already asking:

1. **What is it?** Hero: mark, one-line value proposition, prompt box, trust line. Nothing else above the fold.
2. **Show me.** One real world graph, with characters, places and rules linked. Show it working, not described.
3. **How does it work?** Three steps: prompt, world graph, specialists working on the same state.
4. **Why not just ChatGPT?** "When chat forgets, worlds drift", plus the comparison table. Keep only rows the code supports.
5. **Is it for me?** Three personas, not five: Novelists, Game designers, Developers.
6. **What is the world like?** Guardians and lore as _content_, in one section. The chrome stays AI-lab restrained.
7. **What can I use today?** The Live / Preview / Roadmap status block. It is the most honest section on the page; keep it.
8. **What do I keep?** Keys, data and IP, stated as the code does them (see Gaps 1).
9. FAQ, then the final CTA.

Today the page renders about 20 sections (`v3-below-fold.tsx:1285`). Target: **9**. Cut or merge the Portal Atlas and Dragon Rider into step 6, Voice Presence and Stack into step 7, and Earn into step 8.

## CTA hierarchy

| Rank      | Label (today)                                                            | Destination                                 | Rule                                                                   |
| --------- | ------------------------------------------------------------------------ | ------------------------------------------- | ---------------------------------------------------------------------- |
| Primary   | Prompt box + send ("Start creating in chat")                             | `/chat?prompt=` (prefill only)              | One primary per viewport. The send button must look enabled, at 44 px. |
| Secondary | Chips: Map a world, Write a scene, Design visuals, Plan agents           | `/worlds/create?prompt=` or `/chat?prompt=` | Each chip ≥ 44 px, AA contrast                                         |
| Header    | Get Started / Sign In (auth modal)                                       | modal                                       | ≥ 44 px                                                                |
| Exit      | Final CTA "Start Creating" → `/chat`; "Explore the Library" → `/library` |                                             | Every page needs an exit ramp (TASTE Gate 5)                           |

Target: every homepage CTA emits a `home_*` event, and saving a first world emits an activation event, so the funnel from viewport to world created is measurable. Today three homepage events fire: `home_hero_submit`, `home_hero_chip` and `home_final_cta`. The header Get Started and Sign In buttons, the product-pillar links and the world-created activation event are not instrumented yet, so visitors who start from those paths do not appear in the funnel.

## Emotion arc

| Moment   | Feel                             | Earned by                                                | Broken by                                      |
| -------- | -------------------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| 0–5 s    | **Wonder, restrained**           | Aquamarine on cosmic dark, one composed hero             | Busy video behind the text, low-contrast input |
| 5–30 s   | **Competence: "this remembers"** | A real world graph, specific numbers from `lib/facts.ts` | Abstract claims ("compute magic like code")    |
| Decision | **Safety**                       | True statements about keys, data and IP                  | Claims the code contradicts (Gaps 1)           |
| After    | **Momentum**                     | A named world and an obvious next move                   | A 401 on the first send                        |

## Mobile contract (375 first: 75 % of first visits are mobile, TASTE Gate 5)

- Mark, value proposition and the prompt box with a visible send button all sit above the fold at 375×667.
- Tap targets are ≥ 44 px, including the chips, the send button and Sign In (today: chips ~40 px, send 36 px, Sign In ~36 px).
- No autoplay video behind the hero on mobile (`v3-content.tsx:163-177`; TASTE :62). It costs LCP and data, and it reduces text contrast.
- Body text and placeholders meet AA (today `placeholder-white/20` and chips at `text-white/35`).

## Excellence bar

- LCP < 2.5 s, INP < 200 ms and CLS < 0.1 on mobile, measured with `core-web-vitals` against a preview.
- No claim on the page that the code does not do, and every number sourced from `FACTS` (`scripts/check-facts-drift.mjs` in CI).
- Accessible text reads correctly. Today extraction yields "worldswith" and "Builtintheopen", because the h1 spans have no space between them and `SplitText` splits per character.
- Before/after captures at 375 / 768 / 1440, with web-design-guidelines findings attached to the PR (`web-release-gate`).

## Verified gaps, ranked

Status as of this branch. **Fixed** means fixed here and verified locally.

1. **Claims the code contradicted (trust and legal risk). Fixed.** Rewritten to match the code:
   - "We have no servers to log your inputs": chat runs through the Edge route, and chats and memory are saved to the account.
   - "Compiled locally to SQLite": worlds live in Supabase `worlds`.
   - "Runs entirely on keys stored in your browser": keys do live in browser `localStorage`, but Imagine uses account credits.
   - "Built-in Gumroad, Whop and Stripe": there is no creator storefront yet.
   - "10 modules / 16 runtimes": now sourced from `FACTS`.
   - The voice tile said keys "never" reach our servers.
2. **Claims still unchecked, open:**
   - FAQ "How do I publish my work?" (one-click deployment, X threads, webhooks).
   - FAQ "Gates … unlock developer permissions".
   - Final CTA "Free to start … immediately", which collides with the key wall.
   - "Absolute data sovereignty" in "Built in the open".
   - Comparison row "Text + image + music integrated".
3. Key wall on the first action (see The one conversion).
4. About 20 sections against a target of 9. Everything below the fold is `ssr:false`, so none of the "why" narrative is in the server HTML that search and AI crawlers read.
5. **Fixed:** text extraction in the h1 and "Built in the open". SplitText now emits word spans with real spaces.
6. **Fixed:** hero contrast and tap targets. Placeholder went from ~2.0:1 to 5.0:1, chips from ~3.2:1 to 7.9:1, and chips, send and Sign In are all 44 px.
7. **Partly fixed:** CTA events `home_hero_submit`, `home_hero_chip` and `home_final_cta` now fire via `@vercel/analytics`. None carries prompt text. **Open:** events for the header Get Started and Sign In buttons, the product-pillar links, and world-created activation.
8. Glyphs used as icons. **Fixed:** the "✓" bullets. **Open:** two-letter integration monograms (TASTE :44 and :182 conflict) and `&rarr;` text arrows.
9. Logged-out visitors are bounced to sign-in by `/studio/image` lane links (`proxy.ts:54`).
10. **Fixed:** "Read the sovereignty promise" now reads "Read the privacy policy" and goes to `/privacy`.

## Skill chain (what the router loads, in order)

`web-release-gate` → `nextjs` · `react` · `shadcn` (framework; no Tailwind kit, because the only one is written for v4 and `apps/web` is on Tailwind 3) → `web-design-guidelines` (audit) → `emil-design-eng` / `review-animations` (motion) → `core-web-vitals` → `visual-proof`. Add `canon-check` for any copy that names Guardians, Gates or godbeasts. Agents: `design-architect` locks the brief before a section is rebuilt, and `design-verifier` runs before merge.

## Decisions that are Frank's

1. **Which first-run economics:** a platform-funded first world (cost per activation is yours), or a hero that says "bring your Gemini or Claude key" (fewer starts, honest ones)?
2. **Which three sections die first** when the page goes from 20 to 9?
3. **When does the below-fold narrative render on the server:** now, at the cost of hero JS budget (TASTE Gate 4), or after the hero video is gone and the budget has room?
