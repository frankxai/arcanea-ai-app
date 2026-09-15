# Arcanea Image Quality Recalibration

Date: 2026-06-26

## Verdict

The current image set is a strong concept pass, not a studio-final or competition-final pass.

The ideas are useful: Arcanean Avatar, Thal'Maris, Pyrathis, Emilia, Arion, Mera, Akamoto, creator studio, and campaign assets all point in the right direction. The execution bar was scored too generously. A 9.x score must mean "world-class final candidate after artifact inspection," not "good prompt idea with a rich render."

From this point forward, most first generations should be treated as raw plates unless they pass the 30 point gate.

## What Went Wrong

The prompts used words like "ultra high quality" and "premium cinematic," but did not force enough production discipline.

Failure modes observed:

- Too much AI-maximalist ornament: filigree, random golden tracery, extra straps, arbitrary jewels, and micro-glyph noise.
- Glow spaghetti: magical effects became decorative trails instead of readable bending mechanics.
- Weak material logic: surfaces look expensive, but not always modelable, manufacturable, or physically motivated.
- Overcrowded compositions: too many towers, effects, small vignettes, or supporting motifs reduce crispness.
- Generic fantasy render language: several images drift toward ornate game splash art rather than Arcanea-specific visual canon.
- Over-polished faces and costumes: characters look beautiful, but some details reduce believability and animation usefulness.
- Missing camera discipline: prompts did not consistently name lens, shot scale, depth of field, haze, crop, or negative-space rules.
- Missing artifact ban: prompts did not explicitly reject malformed hands, random jewelry, fake text, tangled hair-detail noise, or unreadable props.

## Corrected Score Language

Use this scale:

- 29-30 / 30: competition-final or flagship hero; can anchor brand identity.
- 26-28 / 30: approved for use after crop/surface check.
- 22-25 / 30: concept keeper; iterate once with targeted prompt/edit.
- 0-21 / 30: restart from references and a simpler brief.

The existing 9.x scores are now deprecated. The ledger adds `gate_30_score`, `gate_verdict`, and `ship_status` so future batches cannot hide behind inflated decimals.

## New Prompt Standard

Each prompt must include:

1. Final surface and aspect ratio.
2. Audience and first read.
3. One visual idea, not five.
4. Camera, lens, shot scale, crop, and negative space.
5. Character or scene material rules.
6. Lighting model and atmosphere limits.
7. Bending/magic mechanics as body-led action, not loose glow.
8. Artifact ban and "what to cut" list.
9. Inspection criteria for the critic.

Prompt skeleton:

```text
Use case:
Surface/aspect:
Audience:
First read:
One visual idea:
Shot:
Subject:
World/canon rules:
Material rules:
Lighting:
Composition:
Magic/bending mechanics:
Brand palette:
Must keep:
Must avoid:
Inspection gate:
```

## Arcanea-Specific Visual Rules

Keep:

- Mythic creative intelligence.
- Dark cinematic premium.
- Luminous, crafted, layered, enchanted.
- Physical bending with stance, breath, hands, posture, and attention.
- Arcanean materials: coral-glass, aged Luminor metal, Vael crystal, Nero shard, void-ink, memory-water, prism instruments.
- Clear silhouettes and surfaces that could become costumes, props, sets, cards, UI assets, or animated model sheets.

Cut:

- Generic purple fantasy UI.
- One-hue teal/gold wallpaper.
- Random filigree that does not explain function.
- Fake tiny text.
- Unreadable ornamental borders.
- Costume detail that would be impossible to model, animate, or recognize at thumbnail size.
- Overexposed glow around every edge.
- "More detail" as a substitute for better hierarchy.

## Character Plate Rules

For Arion, Mera, Emilia, Akamoto, and future characters:

- One clear silhouette at thumbnail size.
- Three material families max.
- One signature object or tool.
- One supernatural effect, not a ring of unrelated effects.
- Hands, eyes, jawline, hairline, and fabric seams inspected.
- Practical movement: boots, joints, sleeves, belts, and layers must make physical sense.
- Costume motifs must indicate role and culture, not generic wealth.
- Face should include subtle asymmetry and natural skin texture; avoid waxy perfection.

## Thal'Maris Correction

The underwater image idea is good. The current execution is too dense and too generically luminous.

The v2 direction:

- Move from skyline wallpaper to one inspectable archive chamber.
- Use fewer towers and fewer ribbons.
- Make water-memory one readable physical phenomenon.
- Use real underwater caustics, volumetric falloff, and particulate depth.
- Separate foreground, midground, and background with clean silhouettes.
- Give Mera one body-led gesture instead of decorative trails everywhere.

## Acceptance Rule

No generated image should be called final until:

- The actual PNG has been inspected.
- The 30 point score is recorded.
- The strongest and weakest elements are named.
- One next improvement is written.
- The gallery shows `ship_status`.

