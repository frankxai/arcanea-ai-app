# Arcanea Book Visual Design System (AVDS)
*The Overarching Visual Standard for AI-Human Multimodal Publishing*

---

## 1. Executive Vision & Philosophy
In the landscape of modern publishing, a book is no longer merely a stream of text. For Arcanea, visual assets are the **soul of the mythology**—they establish presence, evoke emotional resonance, and transform reading into an immersive, multi-sensory experience.

This Visual Design System establishes a world-class, repeatable framework for art-directing, generating, and cataloging visual assets across the entire Arcanea library. Written by combining the insights of world-class marketing minds, traditional book publishers, and advanced generative AI engineers, it ensures that every book—past, present, and future—maintains strict aesthetic cohesion while preserving the unique emotional signature of its genre.

---

## 2. Core Book Identity Profiles (Visual Categories)

We divide the Arcanea library into three canonical visual tracks. Each track defines its own medium, lighting style, color palette, and target emotions.

### Track A: Whimsical Wonder (e.g., *Lumara: Valle de los Destellos*)
*Target Audience:* Children (ages 4-8), parents, and seekers of pure magic.
*   **Art Medium:** Hand-drawn watercolor illustration with soft graphite outlines (Ghibli/Cozy fantasy style).
*   **Lighting:** Diffuse morning sunlight, soft warm golden hour glows, glowing magical items acting as light sources (e.g., the glowing Immortelle flower).
*   **Palette:** Warm ochre, Adriatic sea blues, sage green, and soft amber. Avoid high-contrast blacks.
*   **Composition:** Eye-level or slightly low-angle shots tracking the child protagonist. Focus on natural landscapes, close-ups of magical creatures, and expressions of wonder.

### Track B: Mythic Realism (e.g., *Las Tierras de Luz*)
*Target Audience:* Young adult and mature fantasy readers (ages 18-45).
*   **Art Medium:** High-fidelity digital concept art with cinematic rendering and painterly brushstrokes.
*   **Lighting:** Chiaroscuro (dramatic light and shadow contrast). Shafts of divine light breaking through dark canopies or cavernous vaults.
*   **Palette:** Deep void purple (#20003b), Atlantean teal (#008080), rich gold (#ffd700), and dark granite grey.
*   **Composition:** Wide-angle establishing shots of mystical academies, crystalline citadels, and dramatic character portraits showing vulnerability or dynamic action.

### Track C: Sacred blue-prints (e.g., *The Book of Arcanea* / Lore Manuals)
*Target Audience:* Creators, world-builders, and technical developers.
*   **Art Medium:** Sacred geometry vector diagrams meets glassmorphism UI overlays.
*   **Lighting:** Luminous neon highlights, cosmic energy streams glowing against dark, deep space backgrounds.
*   **Palette:** Monochromatic space-black, neon white-gold, Atlantean teal, and electric violet.
*   **Composition:** Planar alignment, symmetrical decagons, concentric circles, and flowcharts styled as ancient grimoire pages.

---

## 3. The Design-Thinking 80/20 Prompt Formula

To prevent generic "AI-slop" (plastic skin, oversaturated gradients, deformed anatomy, and generic clip-art styles), all prompts must go through the **Design-Thinking Gate**. The library rejects any prompt that lacks explicit artistic instruction.

Every prompt must be structured using the following template:

```markdown
## CONCEPT
[Describe the core narrative action or symbolic meaning of the scene in one sentence.]

## ART DIRECTION & STYLE
[Define the medium, style references, and rendering details. (e.g., "watercolor illustration with hand-drawn pencil outlines, Ghibli style, soft texture")]

## COMPOSITION & FOCUS
[Define the camera angle, framing, foreground, midground, and background details. (e.g., "Cinematic wide shot, character in lower-left third, looking up at giant floating islands in background")]

## LIGHTING & ATMOSPHERE
[Define light sources, light temperature, shadows, and mood. (e.g., "Warm backlighting, golden particles floating, cozy and nostalgic atmosphere")]

## PALETTE
[Specify exact hex codes or color descriptions. (e.g., "Adriatic sea blue, warm amber, soft terracotta, and forest green. Avoid harsh neon colors.")]

## CHARACTER/CREATURE CONSISTENCY (If applicable)
[Detail key features of repeating elements. (e.g., "Mila: 6-year-old girl, short dark hair, large curious brown eyes, wearing a simple blue dress.")]
```

---

## 4. Execution Paths & Tooling

To generate images, creators and developers must use one of the two verified paths:

### Path 1: The Sandboxed `generate_image` Tool (No API Costs)
When working in the Antigravity developer environment, utilize the built-in `generate_image` tool. This routes requests through Google's premium Imagen 3 engine automatically under your active session subscription, saving files to the brain artifacts directory.

**Example Usage:**
```json
{
  "ImageName": "lumara_valle_de_los_destellos_ch11_water_spirit",
  "Prompt": "## CONCEPT\nMila meeting the friendly water spirit in the cave.\n\n## ART DIRECTION\nStudio Ghibli watercolor style...\n"
}
```
*Note: Once generated in the artifacts directory, run `copy-images.mjs` to copy and rename the files to `apps/web/public/images/books/`.*

### Path 2: Programmatic Script Execution (`nb-image.mjs`)
For bulk operations, server-side generation, or custom scripts, use the central `nb-image.mjs` library in the ecosystem.

```bash
node scripts/nb-generate.mjs \
  --spec public/images/books/book-spec.md \
  --out public/images/books/book-cover.png \
  --model nbpro \
  --aspect 2:3 \
  --size 4K
```

---

## 5. Model Selection & Capabilities

| Alias | Target API Model | Default Aspect Ratios | Max Resolution | Best Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **`nbpro`** | `gemini-3-pro-image-preview` | 2:3, 16:9, 1:1, 4:3 | 4K (Super-Resolution) | **Default for Book Covers.** Printable covers, digital covers, and high-fidelity showcase assets. |
| **`nb2`** | `gemini-3.1-flash-image-preview` | 2:3, 16:9, 1:1, 4:3 | 2K (High-Definition) | **Default for Chapter Spreads.** Section illustrations, web banners, and rapid iterative previews. |
| **`nb1`** | `gemini-2.5-flash-image` | 1:1 | 1K | **Fallback only.** Quick design layout checks, rough conceptual prototypes. |

---

## 6. Rate Limit Management & Quota Tracking

Image generation models operate under stricter rate limits than text models. To ensure high availability and prevent script failures, developers must reference and log entries in the central tracking CSV file:

👉 **Source of Truth for Generation Logs:** [image-generation-limits.csv](file:///C:/Users/frank/starlight/repos/arcanea-ai-app/data/image-generation-limits.csv)

### Quota Structure & Restrictions
1.  **Requests Per Minute (RPM):**
    *   **Standard Limit:** 5 to 10 RPM.
    *   **Mitigation:** Batch generation scripts must introduce an artificial delay of **12 to 15 seconds** between consecutive requests.
2.  **Requests Per Day (RPD):**
    *   **Standard Limit:** 1,500 RPD.
    *   **Mitigation:** Log the remaining limit value (`LimitRemaining`) in the CSV after every batch. Once the remaining limit drops below 100, pause generations for 24 hours.

### Batch Script Delay Formula (Node.js)
When writing scripts to generate images for a book series, implement a rate-limiter wrapper:
```javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

for (const chapter of chapters) {
  await generateImageForChapter(chapter);
  console.log("Sleeping 15s to prevent rate limit limits...");
  await delay(15000); // 15-second gap
}
```

---

## 7. Backfilling Existing Books & Creating New Ones

To add additional images to an existing book (e.g., *Las Tierras de Luz* or *Das Mädchen, das drei Sprachen hörte*) or initiate a new one:

1.  **Extract the Chapters:** Look at the markdown source in `book/[book-slug]/chapters/`.
2.  **Design the Prompts:** Draft a design-thinking prompt spec for each chapter based on the book's Visual Category (watercolor, digital painting, etc.).
3.  **Execute the Generation:** Call the `generate_image` tool or script.
4.  **Publish to Web Directory:** Copy the resulting image file to `apps/web/public/images/books/` naming it `[book-slug]-ch[xx].[ext]`.
5.  **Insert Into Markdown:** Edit the markdown file of the chapter to reference the image:
    `![Chapter Illustration](/images/books/[book-slug]-ch[xx].png)`
6.  **Log to CSV:** Append a new row to `data/image-generation-limits.csv` to keep the quota tracker updated.
