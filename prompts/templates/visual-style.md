---
name: Vision Lens
form: visual
difficulty: any
---

# Visual / Image Generation Template

```
@form     visual
@tone     {cinematic | intimate | surreal | documentary | iconic | raw}
@render   {cinematic | concept-art | icon | premium-photo | editorial | painterly}
@anchor   {the single most important visual element in the frame}
@exclude  over-saturated, busy-composition, stock-photo-feel, generic-fantasy-art
@element  {element}     (optional — pulls from sensory palette)
```

## The Questions That Matter

**Subject:** What owns the frame? ONE thing. Not a scene with seventeen interesting elements — one subject that commands attention. Everything else serves it.

**Lighting:** Where is the light, and what does it MEAN? Lighting isn't decoration — it's emotional direction.
- Warm key light from below: intimate, vulnerable, campfire
- Harsh top light: exposed, interrogation, noon desert
- Rim light only: mysterious, emerging, about to act
- Diffused/overcast: melancholy, quiet, honest
- Single point in darkness: hope, focus, isolation

**Palette:** State 3-4 specific colors, not just "blue." `#1a1a2e` hits different than `#87ceeb`. If you can name it ("dried blood," "oxidized copper," "2am sky"), the AI will get closer.

**Atmosphere:** What's in the air between the camera and the subject? This is what separates flat AI art from images that feel like places:
- Dust motes in a beam of light
- Heat shimmer off stone
- Fog that stops at knee height
- Absolute stillness — no movement at all
- Rain that hasn't started yet — the pressure before

**Composition:** Where does the eye enter? Where does it rest? Is there negative space, and what does the emptiness say? Rule of thirds is fine. Rule of breaking thirds is better when you know why.

**Scale Cue:** One element that tells you how big everything is. A hand on a wall. A bird against a mountain. Without this, AI-generated environments float in ambiguous scale.

**Anchor:** {anchor} — must be the most prominent element in the final image.

## Converting to Image Generator Syntax

Strip all narrative. Image models want nouns and adjectives:

```
[subject], [lighting direction], [specific colors], [atmosphere element],
[composition note], [render style], [aspect ratio]
```

Example conversion:
```
APL:    @anchor cooling-lava scar, @render cinematic, @tone fierce, @element Fire
→       "fierce warrior portrait, cinematic rim lighting, glowing orange scar across
         left cheek, ember particles floating in dark air, shallow depth of field,
         warm tones against near-black background, 3:4 portrait"
```

## Quality Gate

- [ ] Is there ONE clear focal point, or is the eye confused?
- [ ] Would this work as a phone wallpaper? (Composition stress test)
- [ ] Does the palette feel intentional, or like the AI picked random colors?
- [ ] Is there atmosphere, or is the subject floating in nothing?
- [ ] If you squint, can you still tell what's going on? (Silhouette test)
