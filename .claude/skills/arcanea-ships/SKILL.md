---
name: arcanea-ships
description: >
  Design and visualize vessels across all domains — space, sea, sky, void, hybrid.
  Generate cinematic art, blueprints, fleets, and educational content.
  Images saved to .arcanea/forge/ with manifest tracking and curation workflow.
version: 2.0.0
triggers:
  - /arcanea-ships
  - /ships
  - /forge-vessel
aliases:
  - ships
  - forge-vessel
---

# /arcanea-ships v2

> *Every vessel tells a story. What's yours?*

## Invocation

```
/arcanea-ships [domain] [mode] [concept]
```

**Domains** (default: space):
- `space` — Spacecraft, stations, orbital platforms
- `sea` — Sailing ships, submarines, ocean vessels, living ships
- `sky` — Airships, cloud-runners, wind-riders, flying fortresses
- `void` — Dimension-ships, gate-walkers, arc-vessels, abstract
- `hybrid` — Cross-domain vessels (sea-to-space, sky-to-void)

**Modes** (default: art):
- `art` — Pure cinematic render. No text, no labels. Wallpaper quality.
- `blueprint` — Technical cross-section, engineering diagram
- `fleet` — 3-5 vessels in a composition
- `educate` — How does it work? Physics, engineering, lore
- `concept` — Rough concept art style, painterly
- `collectible` — Product-shot 3D model on display stand

**Examples:**
```
/arcanea-ships                                    # Interactive prompt
/arcanea-ships space art ancient cathedral ship    # Cinematic space cathedral
/arcanea-ships sea art kraken hunting galleon      # Fantasy ocean scene
/arcanea-ships sky blueprint airship cross-section # Technical airship diagram
/arcanea-ships void art dimension gate vessel      # Abstract void-walker
/arcanea-ships space fleet fire armada             # Fleet of fire-element ships
/arcanea-ships sea educate how sails work          # Educational sailing physics
```

---

## Step 1: Parse the Request

Determine domain, mode, and concept from user input. If unclear, ask.

**Domain detection keywords:**
- Space: spaceship, starship, cruiser, dreadnought, station, orbital, cosmos, nebula
- Sea: ship, boat, galleon, frigate, submarine, ocean, sail, naval, pirate, kraken
- Sky: airship, zeppelin, cloud, wind, flying, hover, balloon
- Void: dimension, gate, portal, abstract, void, arc, between-worlds
- Hybrid: transform, transition, amphibious, multi-domain

**If the user just says "ship" with no space context, ASK which domain.**
Don't default to space — a sailing ship is equally valid.

---

## Step 2: Build the Prompt

### For Art Mode (default) — NO LABELS

Every art prompt MUST end with:
```
No text. No labels. No annotations. No diagrams. No overlays. No UI elements.
No watermarks. No borders. No frames. Pure cinematic render only.
```

Plus quality anchors:
```
Ultra-realistic 3D render. Cinematic lighting. Volumetric atmosphere.
8K detail. Photorealistic materials. Film grain. Shallow depth of field.
```

### Style by Domain

| Domain | Style Param | Lighting | Atmosphere |
|--------|------------|----------|------------|
| Space | `photorealistic` | Rim-lit by distant star, volumetric nebula | Deep space, asteroids, planets |
| Sea | `photorealistic` | Golden hour or storm lighting, god rays | Ocean waves, mist, spray |
| Sky | `photorealistic` | Cloud-filtered sunlight, atmospheric haze | Cloudscapes, mountain peaks |
| Void | `3d` | Otherworldly, non-euclidean light sources | Abstract geometry, impossible space |
| Hybrid | `photorealistic` | Transition lighting (two environments) | Split scene showing both domains |

### For Blueprint Mode — TECHNICAL

```
Technical engineering blueprint on dark navy-black background.
Precise cyan and white line drawing. Cross-section cutaway revealing
internal structure. Orthographic side view. Clean technical illustration.
Minimal clean labels in sans-serif font. Scale indicators.
Engineering diagram aesthetic. Dark background, bright line art.
```
Style: `technical`

### For Educational Mode — USE INFOGRAPHIC

Use `mcp__arcanea-infogenius__generate_infographic` instead of `generate_visual`.
This is the ONE mode where labels and research are wanted.

### For Fleet Mode — EPIC SCALE

Generate a single wide image showing multiple vessels in formation.
```
Epic wide-angle cinematic render of an Arcanean fleet in formation.
[N] vessels of varying sizes arranged in [formation type].
[Describe each vessel briefly]. Deep space / ocean / sky background.
Dramatic scale contrast between largest and smallest ships.
Cinematic widescreen composition.
No text. No labels. Pure cinematic render only.
```

---

## Step 3: Vessel Design DNA

### Ship Classes (Cross-Domain)

| Class | Space | Sea | Sky | Void |
|-------|-------|-----|-----|------|
| **Capital** | Leviathan / Dreadnought | Man-o-War / Flagship | Sky Fortress | World-Eater |
| **Cruiser** | Battle Cruiser | Frigate / Corvette | Destroyer | Phase-Walker |
| **Scout** | Explorer / Recon | Caravel / Clipper | Cloud-Runner | Gate-Seeker |
| **Fighter** | Interceptor | War Canoe / Torpedo | Wind-Blade | Rift-Dart |
| **Transport** | Freighter / Hauler | Galleon / Merchantman | Cargo Balloon | Void-Barge |
| **Personal** | Yacht / Shuttle | Sloop / Yacht | Glider | Spirit-Shell |
| **Ancient** | Relic Ship | Ghost Ship | Sky Ruin | Arc-Fragment |
| **Living** | Bio-Ship | Sea Beast | Cloud Whale | Void Leviathan |

### Element Affinity (OPTIONAL — only when requested)

| Element | Material Feel | Energy Color | Applies To |
|---------|--------------|-------------|------------|
| Fire | Volcanic, obsidian, magma veins | Orange-red | Aggressive vessels |
| Water | Pearlescent, fluid curves | Blue-silver | Graceful vessels |
| Earth | Dense alloy, stone-like | Green-amber | Heavy vessels |
| Wind | Translucent, minimal mass | White-silver | Fast vessels |
| Void | Light-absorbing black | Deep purple | Mysterious vessels |
| Spirit | Crystalline, semi-transparent | Gold-white | Transcendent vessels |

**IMPORTANT**: Do NOT force elements onto every vessel. Only use when the user
asks for it or when the concept naturally aligns. "A pirate galleon" needs no element.

---

## Step 4: Generate

Use the Infogenius MCP tools:
- **Art/Fleet/Concept/Collectible**: `mcp__arcanea-infogenius__generate_visual`
- **Educational**: `mcp__arcanea-infogenius__generate_infographic`
- **Blueprint**: `mcp__arcanea-infogenius__generate_visual` with `technical` style

---

## Step 5: Save, Register, Show

### File Naming
```
.arcanea/forge/{domain}/{NNN}-{descriptor}.png
```
- `{domain}` = space, sea, sky, void, hybrid, blueprints, fleets, educational
- `{NNN}` = auto-increment from manifest.json nextId
- `{descriptor}` = kebab-case 2-4 word description

### Registration

After saving, update `.arcanea/forge/manifest.json`:
- Increment `nextId`
- Add new entry with: id, file, domain, type, class, title, prompt_style, quality, labels, status, created, notes

### Image Extraction

```python
import json, base64
with open(RESULT_FILE) as f:
    data = json.load(f)
for item in data:
    if item.get('type') == 'text':
        try:
            inner = json.loads(item['text'])
            if inner.get('image'):
                raw = base64.b64decode(inner['image'])
                with open(OUTPUT_PATH, 'wb') as out:
                    out.write(raw)
        except:
            pass
```

### Show to User

Always show the image using the Read tool after saving.

---

## Step 6: Curation Workflow

After generation, the user can:

```
/arcanea-ships review          # Show all drafts needing review
/arcanea-ships approve [id]    # Mark as approved (ready for gallery)
/arcanea-ships reject [id]     # Mark as rejected
/arcanea-ships publish [id]    # Copy to public/images/ for arcanea.ai
/arcanea-ships gallery         # Show all approved assets as a visual grid
/arcanea-ships stats           # Count by domain, status, quality
```

### Publishing Path

```
Generate (.arcanea/forge/) → Review → Approve → Publish (apps/web/public/images/forge/)
                                                          ↓
                                                   Gallery page on arcanea.ai
                                                   Social media posts
                                                   Merch / prints
```

---

## Platform Integration (Future)

### For arcanea.ai (Server-Side)
When ready, build `/gallery/forge` or `/ships` page:
- Grid of published forge assets from `public/images/forge/`
- Filter by domain (space/sea/sky/void)
- Community submissions (users upload their own)
- Voting / favorites
- "Design Your Ship" wizard (calls AI generation API)

### For Local Users (Claude Code)
This skill IS the local tool. Any Arcanean with Claude Code can:
1. Install the skill
2. Run `/arcanea-ships`
3. Get cinematic vessel art
4. Curate in `.arcanea/forge/`
5. Submit to community gallery (future: API upload)

### For Content Pipeline
- Generated assets feed into social media posts
- "Ship of the Week" automated content
- Fleet compositions for lore pages
- Book illustrations
- Game concept art

---

## What NOT To Do

- Do NOT default everything to space — ask if ambiguous
- Do NOT force Guardian/Element on every vessel
- Do NOT add labels to art mode renders
- Do NOT save to project root — always use .arcanea/forge/
- Do NOT skip manifest registration — every asset gets tracked
- Do NOT generate without showing the result
- Do NOT assume the user wants Arcanea lore — "a cool pirate ship" is perfectly valid
