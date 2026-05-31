# HOW-TO — Generate Lumara's Images

This folder is the **prompt source of truth**. Edit the markdown files
here and run `forge.mjs` to regenerate.

## One-time setup

1. Get a free key: https://aistudio.google.com/apikey
2. Set it persistently in your Claude Code env config
   (**Settings → Environments → Environment Variables → `GEMINI_API_KEY`**) —
   it then works from every web session, mobile session, and agent run.
   No more per-session setup.
3. Or, locally: `export GEMINI_API_KEY=AIza...`

## Generate

```bash
# all 13 images at finished-art quality (Imagen 4 Ultra)
node scripts/forge.mjs lumara-valle-de-los-destellos all

# one image, fast iteration mode (NB2, cheaper)
node scripts/forge.mjs lumara-valle-de-los-destellos cover-v2 --fast

# one image at finished-art quality
node scripts/forge.mjs lumara-valle-de-los-destellos spread-ch07

# all spreads, fast iteration
node scripts/forge.mjs lumara-valle-de-los-destellos all --fast
```

Output → `apps/web/public/images/books/lumara-valle-de-los-destellos-<scene>.png`

## Iterating on a prompt

The slowest part of great art is the rewriting. Workflow:

1. `node scripts/forge.mjs lumara-valle-de-los-destellos cover-v2 --fast` →
   look at the image
2. Open `forge/cover-v2.md`. Adjust the **composition** or the
   **make-or-break detail** — those two have the most leverage. Don't
   re-tune the style bible per image; iterate at the scene level.
3. Re-run with `--fast` until composition is right
4. Final pass: drop `--fast` for Imagen 4 Ultra finishing

## Adding a new book

Want a different book to use this same pipeline?

1. Create `book/<your-slug>/forge/STYLE.md` (your style bible)
2. Create `book/<your-slug>/forge/<scene>.md` for each image you want
3. `node scripts/forge.mjs <your-slug> all`

Same script. Zero JavaScript edits.

## File map

```
forge/
├── STYLE.md          ← the bible (style, palette, characters, anti-patterns)
├── HOW-TO.md         ← this file
├── cover-v1.md       ← the threshold (Ch 1)
├── cover-v2.md       ← the meadow (Ch 1 climax — the iconic cover)
├── cover-v3.md       ← the great tree (Ch 10 finale)
├── spread-ch01.md    ← Lila crossing into Lumara for the first time
├── spread-ch02.md    ← the crystal river, the pez de luz
├── spread-ch03.md    ← the hummingbird singing colours
├── spread-ch04.md    ← the snail with a galaxy inside
├── spread-ch05.md    ← the silver fox accepting a gift
├── spread-ch06.md    ← the butterfly painting the air
├── spread-ch07.md    ← the owl and the long silence
├── spread-ch08.md    ← the candle-antlered deer
├── spread-ch09.md    ← Lila and Aurelia, two florchispas as one
└── spread-ch10.md    ← el árbol de los nombres
```
