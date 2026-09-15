# God Run 2026-07-06 — Academy Arc / Dungeon Diver Campaign

8-hour autonomous visual-production loop. Claude Fable 5 leading an Opus/Sonnet swarm.
Isolated run directory — no tracked-file edits on `codex/arcanea-homepage-world-engine`, no commits.

## Mission

Canon-grounded, top-of-feed-competitive imagery for the Confluence arc: Arion, Mera,
Emilia, Akamoto (+ Mamoru, STAGING) at the Starlight Academy; Dungeon Diver training,
raids and epic bosses; Academy world-towers at kilometer scale; Wonders, Guardians,
Luminors, Malachar, artifacts. Every asset scored, ledgered, metadata-ready for DB/web3
logging, and staged for wiring into arcanea.ai surfaces.

## Canon sources (read-only, CANONICAL > STAGING)

- `.arcanea/lore/CANON_LOCKED.md` — immutable mythology
- `.arcanea/lore/CHARACTER_CORE.md` — cast center (STAGING status)
- `.arcanea/lore/CONFLUENCE_CANON.md`, `MAGIC_SYSTEMS_INDEX.md`, `FACTION_COMPACT.md`
- `.arcanea/lore/godbeasts/`, `lore/guardians/`
- Mamoru is NOT canon — all Mamoru assets are STAGING lane, pending Frank's approval.

## Style contract

- Brand palette: Atlantean Teal `#00bcd4` / Cosmic Blue `#0d47a1` / Gold `#ffd700` on `#09090b`
- L99 Prompt Doctrine (night-run-2026-06-26): universal prompt block, global avoid block,
  one visual idea per frame, anatomy-led bending, buildable costumes/materials,
  max three readable shapes, no fake text, no glow spaghetti.
- 30-point gate: 26+ approve / 22–25 iterate / 0–21 restart. Approval threshold 26.

## Engine routing (Higgsfield MCP)

| Lane | Model | Use |
|---|---|---|
| draft | `z_image` | fast composition validation, cheap |
| character-premium | `nano_banana_pro` / `soul_2` | 4:5 anchor plates, re-rolls of gate winners |
| environment | `soul_location` | Academy vistas, world-towers, dungeon halls (16:9 / 21:9) |
| utility | `recraft_v4_1` (+colors) | palette-locked emblem/card work |

Discipline: `get_cost` preflight; draft-then-premium; count=1 per distinct prompt;
re-roll only 26+ candidates at premium tier.

## Waves (8h map)

1. **W1 — Character anchors** (5): Arion, Mera, Emilia (queued brief), Akamoto, Mamoru-staging. 4:5.
2. **W2 — Academy world** (6): Starlight Academy campus at dawn, world-tower with internal
   dragon roost, Athenaeum memory-pools, training halls, vertical city terraces, sky harbors. 16:9/21:9.
3. **W3 — Dungeon Diver arc** (8): first descent, gate threshold, party formation vs epic boss,
   titan-scale Godbeast silhouette, corrupted vault, extraction, aftermath, victory quiet.
4. **W4 — Wonders/Guardians/Luminors** (6): Malachar witness, Luminor transcendence,
   Guardian presences, Prisma gauntlet macro, Ten Gates wonder-scapes.
5. **W5 — Social/webtoon lane**: 4:5/9:16 crops of winners, webtoon-panel style tests,
   re-roll best performers at premium, gallery + site wiring.

Reflection after every wave: scores → failure modes → prompt deltas appended below.

## Tracking

- `ledger.csv` — night-run 26-column schema, one row per asset
- `metadata.jsonl` — one JSON object per asset (id, prompt, model, urls, local path,
  canon_refs, scores, timestamps) — DB/web3 ingest-ready
- `gallery.html` — refreshed each wave
- `briefs/` — production briefs (mandatory pre-generation)
- Tasks tracked in harness task list; wakeups self-paced.

## Prompt deltas (reflection log)

### Wave 1 (5 generated, 2 approve, 1 iterate, 1 style-fork, 1 restart)

1. **Symbol artifact**: "elemental pressure fields" → NB2 renders floating game-UI
   pictograms. Fix: describe magic as physical distortion only (heat-shimmer, lifted
   dust, refraction) and explicitly ban "symbols, icons, orbs, emblems, pictograms".
2. **Celebrity likeness (CRITICAL)**: character names that collide with real actors
   (Emilia) pull celebrity faces. Fix: mandatory anti-likeness clause + concrete
   original facial-feature spec on every named-character prompt. Gate hard-blocks
   real-person likeness regardless of other scores.
3. **Style drift**: NB2 chooses photoreal vs painterly per prompt vibe. Fix: open every
   prompt by naming the lane — "cinematic photoreal editorial film still" or
   "painterly epic illustration". Both lanes are valid: photoreal = anchor set,
   painterly = story/social art.
4. **Wins to keep**: single-effect discipline (Mera's one memory-lens, Mamoru's one
   ward-rim) reads beautifully at thumbnail; "honest repair marks" language produces
   exactly the lived-in material story we want; brand palette hexes in-prompt are
   being respected.

### Wave 2 + style probes (9 generated, 8 approve, 1 A/B-archived)

5. **Engine finding (load-bearing)**: `soul_location` DISCARDS the prompt (params.prompt
   returned empty; it self-generated a concept). Never use for canon surfaces — NB2 owns
   all canon work; soul_location only for untethered location exploration.
6. **Character consistency without reference images PROVEN**: the four anchors stayed
   on-model in the ensemble training hall (W2-04) and across webtoon + anime style
   transfers, purely from the written feature specs. Keep the feature-spec block verbatim
   in every multi-character prompt.
7. **Environment lane accepts painterly drift** (campus dawn) — fine; character lane
   stays photoreal-locked.
8. **"Cool haze swallowing the tower's upper third" rendered as dark smoke** (W2-02) —
   say "clean pale-blue altitude haze, no smoke" next time.
9. **Seven-distinct-silhouettes trick works**: naming each House's shape inline
   (light-crowned / obsidian / forge-warm / water-terraced / lattice / instrument)
   produced exactly seven distinguishable spires. Reuse for any multi-entity frame.

### Wave 3 (Opus critic pass — 8 generated, 7 approve, 1 iterate)

10. **Physical-consequence beats energy-FX (load-bearing)**: render the *consequence*
    of a power (drifting debris, warped dust, strained gear), never the power itself —
    Kaelith's gravity read as awe purely through suspended rubble. Ban glow/ring/portal
    shorthand explicitly in every power prompt.
11. **Mechanical poses must be body-geometry, not implication**: "shield becomes a
    stretcher" rendered as a default cradle-carry until spelled as "lies flat ACROSS the
    shield held horizontally, both hands gripping the shield's long edges, NOT strapped
    to his arm". State any specific mechanic in blunt physical terms.
12. Optional non-blocking polish deltas: W3-01 doorway "true dark shadow, no teal
    nebula"; W3-05 "faint warm inner ember, mostly dark" on the crystal find.

### Wave 5 batch A (4 generated, 3 approve, 1 iterate)

13. **Manhwa style pulls in hangul SFX calligraphy** — genre-native but uncontrolled
    text. For text-free panels, ban explicitly: "no sound-effect calligraphy, no
    hangul, no katakana, no typography — pure image only". Generated SFX is never
    shippable; real SFX lettering belongs in deterministic design tools.
14. Vertical 9:16 recomposes of approved 16:9 heroes work exceptionally (dragonback
    29/30) — recompose, don't crop: restate the composition for the vertical frame
    with upper-third negative space for overlay text.

### Wave 5 batch B (Opus critic #2 — 6 generated, 5 approve, 1 iterate)

15. **Scene-vibe overrides palette hexes** (Akamoto flight rendered amber-brown despite
    in-prompt hexes): bind each hex to a concrete surface ("cosmic-blue #0d47a1 in the
    thunderheads, gold #ffd700 as the key light, teal #00bcd4 as wing rim") and ban
    "warm amber/sepia wash" explicitly. Corollary extending delta 11 to action: "flight/
    storm" nouns render as static grounded portraits unless airborne posture is stated
    as blunt body/camera geometry (feet off ground, wings mid-beat, rider crouched low).
16. Thal'Maris approved 28/30 but carries a franchise-echo caution: character name
    "Mera" + underwater + scaled-armor styling drifts toward DC's Mera. Costume language
    must be enforced concretely (pearl-thread woven fieldwear, NOT scaled armor) —
    name-collision doctrine (delta 2) extends to costume/franchise context, not just faces.
