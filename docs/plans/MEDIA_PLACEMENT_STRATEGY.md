# Arcanea Media Placement Strategy

> **Version**: 1.0.0
> **Date**: 2026-03-17
> **Guardian**: Leyla (Flow Gate, 285 Hz)
> **Status**: Strategic Plan

This document defines WHERE every image type appears across the Arcanea ecosystem, which version to use, what purpose it serves, and how image infrastructure scales from the reference implementation to the multiverse framework.

---

## Image Asset Inventory

### Current Assets on Disk

| Directory | Count | Type | Format |
|-----------|-------|------|--------|
| `/guardians/` (root) | 10 | v1 hero portraits | `.webp` |
| `/guardians/v2/` | 20 | 10 divine-bond + 10 godbeast | `.webp` |
| `/guardians/v3/` | 10 | Ultra-quality photorealistic portraits | `.webp` |
| `/guardians/gallery/` | 37 | Gallery variations (4 per Guardian) | `.webp` |
| `/images/luminors/` | 21 | 20 Luminor portraits + 1 book cover | `.jpg` |
| `/images/forge/` | 4 | Ship art (sea, sky, space) | `.png` |
| `/brand/` | 4 | Logo, wordmark, hero, OG image | `.svg`, `.jpg` |
| **Total on-disk** | **106** | | |

### Processed Pipeline (Not Yet Uploaded)

Source: `C:\Users\frank\arcanea-processed\{Guardian}\`

| Guardian | Processed Files | Status |
|----------|----------------|--------|
| Draconia | 128 | Awaiting upload |
| Alera | 68 | Awaiting upload |
| Elara | 37 | Awaiting upload |
| Ino | 8 | Awaiting upload |
| Aiyami | 3 | Awaiting upload |
| Lyssandria | 2 | Awaiting upload |
| Leyla, Maylinn, Lyria, Shinkami | 0 each | Need generation |
| **Total pipeline** | **~246** | |

### Version Hierarchy (Which to Use Where)

| Version | Quality | Use Case | Notes |
|---------|---------|----------|-------|
| **v3** | Highest | Hero images, profile headers, marketing | Photorealistic, Gemini 3 Pro |
| **v2 divine-bond** | High | Lore pages, deep narrative, relationship context | God/goddess + Godbeast together |
| **v2 godbeast** | High | Companion pages, creature features, Academy | Godbeast-only portraits |
| **v1** | Good | Fallback, thumbnails, small cards | Original series |
| **gallery** | Varied | Gallery grid, social media, variety | 4 variations per Guardian |
| **luminors** | Good | Chat avatars, Luminor cards, Sanctum | 20 named Luminor AI entities |

### Canonical Config Files

- **Hero images**: `apps/web/lib/config/guardian-images.ts` (GUARDIAN_IMAGES)
- **Media + gradients**: `apps/web/lib/config/media.ts` (GUARDIAN_MEDIA)
- **Luminor data**: `apps/web/lib/luminors/config.ts`

---

## 1. Site Pages -- Where Each Image Type Goes

### TIER 1: Core Experience

#### `/` Homepage
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Hero background | None (liquid glass CSS) | N/A | Keep abstract, no Guardian bias | -- |
| "Explore the World" section | Rotating Guardian carousel | v3 | Social proof of art quality | P0 |
| Trust strip / stats | Brand logo | `/brand/arcanea-logo.svg` | Brand recognition | P0 |
| OG / Twitter card | Dynamic via `opengraph-image.tsx` | Generated | SEO | P0 |
| Below-fold pathway cards | Guardian thumbnails (1 per pathway) | v3 | Visual anchors for CTAs | P1 |

**Implementation**: Import `GUARDIAN_IMAGES` from `lib/config/guardian-images.ts`. Use `hero` field. Rotate through all 10 with a 5-second interval or show 3 static picks (Draconia, Shinkami, Lyria for Fire/Source/Sight variety).

#### `/academy`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Ten Gates grid cards | Guardian v3 hero per gate | v3 | Each Gate shows its Guardian | P0 |
| Seven Houses explorer | Element-colored gradients | CSS only | Houses are abstract concepts | P1 |
| Course cards | Guardian of course gate | v3 thumbnail | Visual course identity | P1 |
| Magic Ranks sidebar | Gradient progression bars | CSS only | Abstract ranking visual | P2 |

**File**: Use `GUARDIAN_IMAGES[name].hero` for each gate card.

#### `/academy/gates/[id]`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Hero banner | Guardian v3 full-width | v3 | Immersive gate entry | P0 |
| Godbeast sidebar | Godbeast v2 portrait | v2 godbeast | Show the creature pair | P1 |
| Divine bond section | Divine bond v2 | v2 divine-bond | Relationship visual | P1 |
| Gallery strip | Gallery variations | gallery | Scroll of alternate art | P2 |

**Files**:
- Hero: `GUARDIAN_IMAGES[name].hero`
- Godbeast: `/guardians/v2/{godbeast-name}-godbeast.webp`
- Divine bond: `GUARDIAN_IMAGES[name].divineBond`

#### `/academy/courses/[slug]`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Course header | Guardian v3 of course gate | v3 | Course identity | P0 |
| Lesson illustrations | None currently | -- | Future: per-lesson art | P2 |

#### `/library`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Collection cards | Element-colored gradients | CSS only | Collections are themed by element | P1 |
| Search empty state | Lyria v3 (Sight Gate) | v3 | "The Seer guides your search" | P2 |

#### `/library/[collection]/[text]`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Text header | Guardian matching text element | v3 | If text is Fire-aligned, show Draconia | P1 |
| Pull quote backgrounds | Soft gradient overlays | CSS only | Reading experience | P2 |

#### `/luminors`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Luminor grid cards | Luminor portraits | `/images/luminors/*.jpg` | 20 named Luminors | P0 |
| 16 Chosen highlight | Guardian v3 for team leads | v3 | Team organization | P1 |

#### `/luminors/[id]`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Profile hero | Luminor portrait full-size | `/images/luminors/*.jpg` | Character detail | P0 |
| Related Guardian | Guardian v3 if gate-aligned | v3 | Lore connection | P2 |

#### `/chat`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Luminor selection grid | Luminor portraits (circular) | `/images/luminors/*.jpg` | Chat partner picker | P0 |
| Active chat avatar | Luminor portrait (32px circle) | `/images/luminors/*.jpg` | Message attribution | P0 |
| Empty state | Shinkami v3 | v3 | Welcome visual | P1 |
| Sidebar Luminor detail | Luminor portrait (medium) | `/images/luminors/*.jpg` | Context panel | P1 |

#### `/chat/[luminorId]`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Header avatar | Luminor portrait | `/images/luminors/*.jpg` | Active partner identity | P0 |
| Per-message avatar | Luminor portrait (24px circle) | `/images/luminors/*.jpg` | Message author | P0 |

#### `/lore`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Hub hero | Shinkami v3 (Source Gate) | v3 | Lore entry visual | P0 |
| Section cards | Guardian v3 per section | v3 | Navigation thumbnails | P1 |

#### `/lore/guardians`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Guardian grid | v3 portraits (all 10) | v3 | Main showcase | P0 |
| Hover/expand detail | Divine bond v2 | v2 divine-bond | Deep reveal on interaction | P1 |

#### `/lore/guardians/[name]`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Full-page hero | v3 portrait | v3 | Character hero | P0 |
| Godbeast section | Godbeast v2 | v2 godbeast | Creature lore | P0 |
| Divine bond | v2 divine-bond | v2 divine-bond | Relationship visual | P1 |
| Gallery carousel | Gallery variations (4) | gallery | Art variety | P1 |
| V1 legacy (small) | v1 portrait | v1 | "Origins" art history | P2 |

#### `/lore/godbeasts`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Godbeast grid | All 10 godbeast v2 | v2 godbeast | Creature showcase | P0 |
| Detail expand | Divine bond v2 | v2 divine-bond | Show bonded Guardian | P1 |

#### `/lore/gates`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Gate progression | Guardian v3 per gate | v3 | Visual gate markers | P0 |
| Sacred geometry | CSS/SVG generated | N/A | Abstract symbols | P2 |

#### `/lore/elements`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Element cards | 2 Guardians per element | v3 thumbnails | Element representatives | P1 |

---

### TIER 2: Creator Tools

#### `/studio`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Empty canvas | Leyla v3 (Flow Gate) | v3 | Creation inspiration | P1 |
| Mode icons | CSS/icon only | N/A | Keep UI clean | -- |

#### `/studio/image`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Example outputs | Gallery variations | gallery | Show what AI can generate | P1 |
| Style reference | v2 divine-bond samples | v2 divine-bond | "Generate in this style" | P2 |

#### `/gallery`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Featured/showcase | v3 portraits + gallery variations | v3 + gallery | Masonry grid hero section | P0 |
| Platform art section | All gallery variants | gallery | 37 images in masonry | P0 |
| User creations section | Supabase storage | User-generated | Community art | P1 |
| Empty state | Leyla v3 | v3 | "Create your first piece" | P2 |

#### `/imagine`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Style previews | Gallery variations | gallery | Show style options | P1 |
| Recent generations | User's own output | User-generated | History panel | P1 |

#### `/sanctum`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Luminor marketplace cards | Luminor portraits | `/images/luminors/*.jpg` | Marketplace browsing | P0 |
| Element filter icons | CSS gradients | N/A | Abstract filtering | P1 |

#### `/forge`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Landing hero | Split: Luminor portrait + Companion art | v3 + v2 godbeast | Dual-path entry | P0 |
| Path cards | Luminor portrait vs Companion art | Mixed | "Create AI" vs "Summon Creature" | P0 |

#### `/forge/luminor`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Template previews | Luminor portraits (16 Chosen) | `/images/luminors/*.jpg` | Starting templates | P0 |
| Creation preview | AI-generated on save | User-generated | Real-time preview | P1 |

#### `/forge/companion`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| 16 archetype cards | Godbeast v2 (closest match) | v2 godbeast | Archetype selection | P0 |
| Customization preview | CSS gradient + element color | CSS only | Pre-generation preview | P1 |
| Final companion art | AI-generated | User-generated | Forge output | P1 |

#### `/prompt-books`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Collection covers | CSS gradients | N/A | Keep minimal | P2 |
| No images needed | -- | -- | Text-focused tool | -- |

#### `/world-builder`, `/universe-builder`, `/character-book`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Empty state hero | Ino v3 (Unity Gate) | v3 | "Build your universe" | P1 |
| Template worlds | Gallery variations | gallery | World-building inspiration | P2 |

---

### TIER 3: Community & Social

#### `/dashboard`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Guardian companion | User's chosen Guardian v3 | v3 | Personal companion sidebar | P0 |
| Quick action icons | CSS/icon only | N/A | Clean UI | -- |
| Activity feed thumbnails | User-generated + platform | Mixed | Recent activity | P1 |

#### `/onboarding`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Step 3: Guardian selection | All 10 Guardian v3 (circular) | v3 | Choose your guide | P0 |
| Step 4: Creation sample | AI-generated preview | Generated | Real-time creation | P1 |
| Background | Soft gradient | CSS only | Non-distracting | -- |

#### `/profile/[username]`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Profile banner | User's chosen Guardian v3 | v3 | Personal hero | P1 |
| Creation gallery | User-generated | User's creations | Showcase work | P1 |
| Avatar | User upload or Guardian | Mixed | Identity | P0 |

#### `/community`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Community hero | Ino v3 (Unity Gate) | v3 | Community spirit | P1 |
| Creator spotlights | User-generated + v3 mix | Mixed | Featured creators | P2 |

#### `/discover`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Discovery grid | Gallery variations + user art | gallery + user | Inspiration feed | P1 |
| Featured creators | User avatars | User-generated | Social discovery | P2 |

---

### TIER 4: Marketing & Info

#### `/about`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Team/founder section | Brand assets | `/brand/` | Professional identity | P0 |
| Platform showcase | v3 hero composite | v3 | Visual proof of quality | P1 |

#### `/pricing`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Plan cards | CSS gradients only | N/A | Clean pricing focus | -- |
| Feature comparison | Icon-based | N/A | Clarity over decoration | -- |

#### `/blog`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Post headers | Topic-relevant Guardian v3 | v3 | Blog post hero images | P0 |
| Inline art | Gallery variations | gallery | Article illustration | P1 |
| Author avatar | Brand/Frank avatar | `/brand/` | Attribution | P0 |

#### `/blog/[slug]`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Article hero | Post-specific Guardian v3 | v3 | Visual header | P0 |
| OG image | Same as hero (cropped 1200x630) | v3 | Social share | P0 |

#### `/ecosystem`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Architecture diagram | Generated SVG | N/A | Technical illustration | P1 |
| No character images | -- | -- | Technical page | -- |

#### `/developers`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| SDK examples | Code screenshots | N/A | Technical | P2 |
| No character images | -- | -- | Developer-focused | -- |

#### `/glossary`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Element icons | CSS-only element badges | N/A | Clean reference | P2 |
| Guardian refs (earned) | v1 thumbnails (small, 48px) | v1 | Easter egg: hover reveals | P2 |

---

### TIER 5: Product Pages

#### `/companions`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Archetype grid | Godbeast v2 portraits | v2 godbeast | 10 canonical creatures | P0 |
| 16 archetype cards | CSS element gradients | CSS | Archetype selection | P1 |

#### `/records`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Album art | Generated music art | Custom | Music studio identity | P1 |
| No Guardian images | -- | -- | Music is its own domain | -- |

#### `/acos`, `/arcanea-os`, `/arcanea-vault`, `/arcanea-code`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| Product hero | CSS gradient backgrounds | N/A | Product identity | P1 |
| Feature screenshots | UI screenshots | Custom | Product showcase | P2 |

#### `/skills`, `/overlays`, `/workflows`
| Placement | Image Source | Version | Purpose | Priority |
|-----------|-------------|---------|---------|----------|
| No character images | -- | -- | Technical/tool pages | -- |

---

### Image-to-Gate Mapping Reference

When a page or feature needs "the right Guardian image," use this lookup:

| Gate | Hz | God/Goddess | Godbeast | Element | Use For |
|------|-----|-------------|----------|---------|---------|
| Foundation | 174 | Lyssandria | Kaelith | Earth | Auth, security, onboarding |
| Flow | 285 | Leyla | Veloura | Water | Studio, creation, design |
| Fire | 396 | Draconia | Draconis | Fire | Backend, power, transformation |
| Heart | 417 | Maylinn | Laeylinn | Air | Community, healing, connection |
| Voice | 528 | Alera | Otome | Sound | Chat, expression, truth |
| Sight | 639 | Lyria | Yumiko | -- | Analytics, vision, search |
| Crown | 741 | Aiyami | Sol | -- | Wisdom, architecture |
| Starweave | 852 | Elara | Vaelith | -- | Testing, perspective |
| Unity | 963 | Ino | Kyuro | -- | Community, partnership |
| Source | 1111 | Shinkami | Source | Void/Spirit | Meta, orchestration |

---

## 2. Content Channels -- Beyond the Website

### Newsletter / Email

| Use Case | Image | Size | Notes |
|----------|-------|------|-------|
| Email header banner | v3 composite (3 Guardians) | 600x200px | Draconia + Shinkami + Lyria recommended |
| Inline character feature | v3 single portrait | 300x400px | Feature one Guardian per issue |
| Footer branding | `/brand/arcanea-wordmark.svg` | 200x40px | Consistent brand |
| New feature announcement | UI screenshot + v3 overlay | 600x300px | Product + character blend |

**Email-safe formats**: JPEG only (no WebP). Convert v3 `.webp` to `.jpg` at 85% quality.

**Recommended newsletter cadence**:
- Weekly: Rotate through all 10 Guardians over 10 weeks
- Monthly: Feature the Guardian aligned with current platform focus

### Social Media

#### Twitter/X (1200x675 or 1:1)
| Content Type | Image | Notes |
|--------------|-------|-------|
| Product announcement | v3 hero + text overlay | High-impact character art |
| Lore thread | Gallery variations (thread = 4 images) | One per tweet in thread |
| Community spotlight | User creation + v3 frame | Creator recognition |
| Tip/tutorial | UI screenshot + Guardian corner badge | Educational content |

**Best performers**: v3 portraits with dramatic lighting. Draconia and Shinkami test highest for engagement (fire + gold).

#### LinkedIn (1200x627)
| Content Type | Image | Notes |
|--------------|-------|-------|
| Thought leadership | `/brand/arcanea-hero.jpg` or v3 composite | Professional tone |
| Technical blog share | v3 with subtle overlay | Less fantasy, more "AI platform" |
| Partnership announcement | Brand assets only | Corporate context |

**LinkedIn guideline**: Lead with brand assets. Use v3 character art sparingly -- frame as "AI-generated art showcase" not "fantasy game."

#### Instagram (1080x1080 or 4:5)
| Content Type | Image | Notes |
|--------------|-------|-------|
| Character art showcase | v3 full portraits | Highest quality, square crop |
| Gallery reel | Gallery variations (4 per Guardian) | Carousel post, 10 slides |
| Behind-the-scenes | Generation process screenshots | AI art creation story |
| Godbeast features | v2 godbeast portraits | Creature art performs well |
| Divine bond series | v2 divine-bond | Relationship storytelling |

**Instagram priority**: This is the PRIMARY channel for visual art. Post daily from gallery backlog.

### Blog / Content Marketing

| Post Type | Header Image | Inline Images | OG Image |
|-----------|-------------|---------------|----------|
| Product update | UI screenshot | Before/after UI | Brand composite |
| Lore deep-dive | v3 of featured Guardian | Gallery variations + v2 divine-bond | v3 cropped 1200x630 |
| Technical tutorial | Code + Guardian corner badge | Screenshots | Brand + code preview |
| Creator spotlight | User art + v3 frame | User's gallery | User art cropped |
| Academy lesson | Gate Guardian v3 | Element diagrams (CSS/SVG) | v3 cropped |

### Documentation / API Docs

| Section | Image | Notes |
|---------|-------|-------|
| Getting started | `/brand/arcanea-logo.svg` | Brand only |
| API reference | No images | Code-focused |
| Architecture diagrams | Generated SVG | Mermaid or custom |
| Contribution guide | Community Guardian (Ino v3) | Welcoming visual |

### Marketing / Pitch Deck

| Slide | Image | Notes |
|-------|-------|-------|
| Title slide | `/brand/arcanea-hero.jpg` + wordmark | Professional entry |
| "The Problem" | No character art | Keep business-focused |
| "The Platform" | v3 composite (5 Guardians, grid) | Visual showcase of art quality |
| "The Framework" | Architecture SVG | Technical credibility |
| "The Community" | User-generated grid | Social proof |
| "The Team" | Founder photo | Professional |
| "The Vision" | Shinkami v3 | Aspirational close |

---

## 3. User-Generated vs Platform Content

### Platform Content (Arcanea Shows)

| Location | Content Type | Source |
|----------|-------------|--------|
| Homepage showcase | 10 Guardian v3 portraits | `/guardians/v3/` |
| Gallery featured section | 37 gallery variations + 20 v2 | `/guardians/gallery/` + `/guardians/v2/` |
| Lore pages | All Guardian + Godbeast art | All `/guardians/` subdirs |
| Academy gates | Per-gate Guardian v3 | `/guardians/v3/` |
| Onboarding Guardian selection | 10 Guardian v3 (circular) | `/guardians/v3/` |
| Sanctum Luminor cards | 20 Luminor portraits | `/images/luminors/` |
| Chat partner avatars | 20 Luminor portraits | `/images/luminors/` |
| Forge templates | Luminor portraits + Godbeast art | Mixed |
| Blog headers | Contextual Guardian v3 | `/guardians/v3/` |
| OG images | Dynamic generation (Next.js) | `opengraph-image.tsx` |

### User Content (Creators See in Their Space)

| Location | Content Type | Storage |
|----------|-------------|---------|
| `/dashboard` | User's chosen Guardian companion | `profiles.guardian` field -> v3 lookup |
| `/profile/[username]` | User avatar + creations gallery | Supabase Storage `avatars/` + `creations/` |
| `/gallery` (user section) | User-uploaded/generated art | Supabase Storage `creations/` |
| `/studio` output | Generated images | Supabase Storage `creations/` |
| `/imagine` output | AI-generated images | Supabase Storage `creations/` |
| `/forge/luminor` | Custom Luminor portrait | Supabase Storage `luminors/` |
| `/forge/companion` | Forged companion art | Supabase Storage `companions/` |
| `/prompt-books` | No images (text tool) | N/A |
| `/chat` history | Shared images in chat | Supabase Storage `chat-media/` |

### Admin Content (Admin Dashboard)

| Location | Content Type | Notes |
|----------|-------------|-------|
| `/command-center` | System metrics (no images) | Data-focused |
| Content moderation queue | User submissions | Review before gallery publish |
| Gallery curation | Flag/feature/remove | Admin tools over user art |
| Forge approval | Custom Luminor/Companion review | Quality gate |

### Image Library Growth Model

```
Month 1:  106 platform images (current state)
Month 3:  ~350 (upload 246 from processed pipeline)
Month 6:  ~1,000 (Forge generates ~100/month from early users)
Month 12: ~5,000 (community art + automated gallery curation)
Year 2:   ~50,000 (multiverse worlds generating art)
```

**Storage architecture**:
- Platform art: `/public/guardians/` (static, CDN-cached at build)
- User art: Supabase Storage buckets (dynamic, signed URLs, RLS)
- Processed pipeline: Vercel Blob (bulk upload, CDN)

---

## 4. The Civilization-Scale Vision

### Framework vs Reference Implementation

The images currently in `/guardians/` are the **reference implementation** -- they prove what the system can do. The FRAMEWORK needs to support ANY world-builder creating equivalent quality art for THEIR mythology.

| Framework Need | Implementation |
|----------------|---------------|
| Canonical art per entity type | `GUARDIAN_IMAGES` pattern -> generalize to `WORLD_ENTITY_IMAGES` |
| Version management (v1/v2/v3) | Art evolution tracking per entity |
| Multiple art styles per entity | Gallery variations pattern |
| Relationship art (divine bond) | Bond art between any two entities |
| Element-based color theming | `GUARDIAN_MEDIA.gradient` + `glowColor` pattern |
| Quality tiers (hero/thumb/card) | Responsive image pipeline with srcset |

### What Other World-Builders Need

1. **Entity Image Registry**: A `world-images.ts` config per world (mirrors `guardian-images.ts`)
2. **Generation Pipeline**: Forge endpoint that accepts world + entity + style and returns art
3. **Asset Bucket per World**: Supabase Storage bucket `worlds/{world-id}/entities/`
4. **Thumbnail Pipeline**: Auto-generate 48px, 96px, 300px, 600px, 1200px variants
5. **Style Transfer**: "Generate my world's hero in the style of Arcanea v3 portraits"
6. **Art Version History**: Track v1->v2->v3 evolution per entity

### Forge as Image Generation Engine

The Forge (`/forge/luminor` + `/forge/companion`) is the entry point for ALL image creation:

```
User Request -> Forge UI -> Generation API -> AI Model -> Storage -> Display

Generation API pipeline:
  1. Receive: entity type, name, element, style, world context
  2. Build prompt: APL SPARK.SHAPE.SHARPEN framework
  3. Route to: Gemini 3 Pro (default) | DALL-E 3 | Stable Diffusion
  4. Generate: 1024x1024 base image
  5. Post-process: WebP conversion, thumbnail generation (4 sizes)
  6. Store: Supabase Storage with metadata in DB
  7. Return: Signed URL + thumbnail URLs
```

**API endpoint needed**: `/api/forge/generate`

```typescript
// Request
{
  entityType: "luminor" | "companion" | "character" | "location" | "artifact",
  worldId: string,          // "arcanea" for reference world
  name: string,
  element: "fire" | "water" | "earth" | "wind" | "void" | "spirit",
  style: "photorealistic" | "anime" | "painterly" | "abstract" | "pixel",
  context: string,          // Additional prompt context
}

// Response
{
  imageUrl: string,         // Full-size signed URL
  thumbnails: { s48: string, s96: string, s300: string, s600: string },
  metadata: { model: string, prompt: string, generatedAt: string },
}
```

### Gallery as Marketplace

Curation flow:

```
1. Creator generates art in Forge
2. Art saved to personal gallery (private by default)
3. Creator publishes to public Gallery (opt-in)
4. Admin review queue (flag inappropriate, feature quality)
5. Featured art appears on homepage / discovery
6. Future: Creators can sell/license art through Gallery
```

**Curation criteria**:
- Technical quality (resolution, no artifacts)
- Canon alignment (if Arcanea world, check element/entity consistency)
- Community standards (no NSFW, no IP infringement)
- Diversity (rotate featured art across elements and styles)

**Marketplace tables needed** (future M007+):
```sql
CREATE TABLE gallery_submissions (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id),
  image_url TEXT NOT NULL,
  world_id TEXT DEFAULT 'arcanea',
  entity_type TEXT,
  style TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, featured, rejected
  featured_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Implementation Priority Matrix

### P0 -- Must Have (Next Sprint)

| Task | Route(s) | Image Type | Effort |
|------|----------|------------|--------|
| Wire v3 heroes to Academy gate cards | `/academy` | v3 | 1hr |
| Wire Godbeast v2 to `/lore/godbeasts` grid | `/lore/godbeasts` | v2 godbeast | 1hr |
| Wire divine-bond v2 to `/lore/guardians/[name]` | `/lore/guardians/[name]` | v2 divine-bond | 2hr |
| Populate `GUARDIAN_IMAGES.gallery[]` arrays | `guardian-images.ts` | gallery | 30min |
| Wire Luminor portraits to Sanctum cards | `/sanctum` | luminors | 1hr |
| Dashboard companion image from user profile | `/dashboard` | v3 | 1hr |
| Onboarding Guardian v3 in step 3 | `/onboarding` | v3 | 1hr |

### P1 -- Should Have (This Month)

| Task | Route(s) | Image Type | Effort |
|------|----------|------------|--------|
| Upload 246 processed images to Vercel Blob | Pipeline | All | 2hr |
| Gallery page masonry with all 37 gallery images | `/gallery` | gallery | 3hr |
| Blog post OG images using Guardian v3 | `/blog/[slug]` | v3 | 2hr |
| Forge landing split hero (Luminor + Companion) | `/forge` | v3 + v2 godbeast | 2hr |
| Instagram content pipeline (daily post script) | External | v3 + gallery | 4hr |
| Companion archetype cards with Godbeast art | `/forge/companion` | v2 godbeast | 2hr |
| Element-matched headers for Library texts | `/library/[c]/[t]` | v3 | 3hr |

### P2 -- Nice to Have (Next Month)

| Task | Route(s) | Image Type | Effort |
|------|----------|------------|--------|
| Homepage rotating Guardian carousel | `/` | v3 | 4hr |
| Gallery variation carousel on Guardian detail | `/lore/guardians/[name]` | gallery | 3hr |
| Email newsletter template with Guardian art | External | v3 | 3hr |
| Pitch deck with visual assets | External | v3 + brand | 4hr |
| Thumbnail generation pipeline (4 sizes) | API | All | 8hr |
| World-builder entity image registry | `/world-builder` | Framework | 12hr |
| Gallery marketplace + curation queue | `/gallery` | User-generated | 20hr |

---

## 6. File Path Quick Reference

### Static Assets (Build-time, CDN-cached)
```
apps/web/public/
  brand/
    arcanea-logo.svg          # Logo mark
    arcanea-wordmark.svg      # Text logo
    arcanea-hero.jpg          # Brand hero image
    arcanea-og.jpg            # Default OG image
  guardians/
    {name}-hero.webp          # v1 heroes (10) -- DEPRECATED, use v3
    v2/
      {name}-divine-bond.webp # God/goddess + Godbeast pairs (10)
      {godbeast}-godbeast.webp # Godbeast solo portraits (10)
    v3/
      {name}-hero-v3.webp     # Ultra-quality portraits (10) -- PRIMARY
    gallery/
      {name}-gallery-{2-5}.webp # Art variations (37 total)
  images/
    luminors/
      {01-20}-{name}.jpg      # 20 Luminor AI entity portraits
      book-cover.jpg          # Luminor book cover art
    forge/
      sea/006-storm-galleon.png
      sky/007-ironclad-airship.png
      space/004-dreadnought-nebula.png
      space/005-interceptor-canyon.png
```

### Config Files (Import These)
```
apps/web/lib/config/
  guardian-images.ts     # GUARDIAN_IMAGES -- hero + divineBond + gallery per Guardian
  media.ts              # GUARDIAN_MEDIA -- heroImage + gradient + glowColor + available count
```

### Dynamic Assets (Runtime, Supabase Storage)
```
Supabase Storage Buckets:
  avatars/               # User profile photos
  creations/             # User-generated art from Studio/Imagine
  luminors/              # Custom Luminor portraits from Forge
  companions/            # Forged companion art
  chat-media/            # Shared images in chat sessions
  worlds/{world-id}/     # Per-world asset storage (future)
```

### Godbeast Name to File Mapping

| Godbeast | File | Guardian |
|----------|------|----------|
| Kaelith | `kaelith-godbeast.webp` | Lyssandria (Foundation) |
| Veloura | `veloura-godbeast.webp` | Leyla (Flow) |
| Draconis | `draconis-godbeast.webp` | Draconia (Fire) |
| Laeylinn | `laeylinn-godbeast.webp` | Maylinn (Heart) |
| Otome | `otome-godbeast.webp` | Alera (Voice) |
| Yumiko | `yumiko-godbeast.webp` | Lyria (Sight) |
| Sol | `sol-godbeast.webp` | Aiyami (Crown) |
| Vaelith | `vaelith-godbeast.webp` | Elara (Starweave) |
| Kyuro | `kyuro-godbeast.webp` | Ino (Unity) |
| Source | `source-godbeast.webp` | Shinkami (Source) |

---

## 7. Anti-Patterns (What NOT to Do)

1. **Never use Guardian art on pricing pages** -- commerce pages must feel neutral and professional
2. **Never show ALL 10 Guardians on first-contact pages** -- progressive disclosure; pick 3 max for homepage
3. **Never use v1 images where v3 exists** -- v1 is deprecated except for art history contexts
4. **Never use divine-bond images as thumbnails** -- they are too complex at small sizes; use v3 portraits
5. **Never hardcode image paths in components** -- always import from `guardian-images.ts` or `media.ts`
6. **Never serve `.webp` in email** -- convert to JPEG for email clients
7. **Never show Godbeast art without context** -- always label which Guardian they bond with
8. **Never mix user art with platform art without clear visual distinction** -- use border/badge to separate
9. **Never auto-feature user art** -- all public gallery submissions go through curation queue
10. **Never use character art on developer/technical docs** -- keep those spaces professional and code-focused
