# Arcanea SaaS Application Design Handoff (arcanea-ai-app)

> Local visual specifications. Consumes the global design operating contract at [starlight/design.md](file:///C:/Users/frank/starlight/design.md).

---

## 1 · Brand & Audience
- **Brand Identity:** Arcanea (Creative-platform SaaS).
- **Target Audience:** Digital world-builders, AI creators, game directors, musicians, lore authors.
- **Key Emotions:** Wonder, sovereignty, magic, luxury.

---

## 2 · Target Asset Queue
These are the assets required for the main application platform UI and user onboarding pathways.

| Element / Placement | Asset Description | Aspect Ratio | Dimensions | Preferred Model |
|---|---|---|---|---|
| **SaaS Dashboard Hero** | Ethereal deep void indigo canvas showing a glowing gold World Graph | `16:9` | 2K / 4K | `soul_cinematic` |
| **Workspace Selector Cover**| Cosmic threads weaving together floating islands of lore | `16:9` | 2K | `soul_cinematic` |
| **Creator Avatar Placeholders**| Cinematic character profiles with warm arcane lighting | `1:1` | 1024×1024 | `soul_cinematic` |
| **Tutorial Onboarding Slide**| Interwoven constellation grids with star-teal highlights | `16:9` | 2K | `nano_banana_pro` |

---

## 3 · Visual Rules & Forbidden Aesthetics
- **Rules:** Layered depth, parallax planes, deep shadows. Apply the Arcanea Color Spectrum (bg `#05070f` / gold `#c5a26f` / indigo `#3f2a6b` / crimson `#6b2a2a` / teal `#2a5c5c`).
- **Forbidden:** No flat vectors, no saturated primary colors (pure red, green, blue), and no standard modern flat UI frames.

---

## 4 · Rendering Pipelines (Higgsfield)
To generate the Dashboard Hero:
1. Run `soul_cinematic` using the spec in `starlight/higgsfield/experiments/arcanea-dashboard-hero-brief.md`.
2. upscale to 4K using `upscale_image`.
3. Log result in the global [ledger.jsonl](file:///C:/Users/frank/starlight/higgsfield/ledger.jsonl).
