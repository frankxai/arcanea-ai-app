/* ------------------------------------------------------------------ */
/*  Image Arena Data — no 'use client'                                 */
/* ------------------------------------------------------------------ */

export const PIPELINE_STEPS = [
  {
    role: "Primary",
    modelId: "grok-2-image",
    label: "Grok 2 Image",
    reason: "Fast (4s), affordable ($0.02), good general quality. Handles 80% of image requests.",
    color: "#7fffd4",
  },
  {
    role: "Premium",
    modelId: "flux-2-max",
    label: "FLUX.2 Max via OpenRouter",
    reason: "Highest quality output. Used for hero images, marketing assets, and text-in-image needs.",
    color: "#fde047",
  },
  {
    role: "Fallback",
    modelId: "gemini-image",
    label: "Gemini Image",
    reason: "Cheapest option ($0.02), fastest (3s). Catches overflow when primary is rate-limited.",
    color: "#60a5fa",
  },
] as const;

export const TEXT_RENDERING_RANKING = [
  { id: "ideogram-2", rank: 1, note: "Purpose-built for typography. Near-perfect text accuracy." },
  { id: "flux-2-max", rank: 2, note: "Best text rendering among general-purpose models." },
  { id: "dall-e-3", rank: 3, note: "Reliable text, especially with clear prompt structure." },
  { id: "gemini-image", rank: 4, note: "Decent text for short words and simple compositions." },
  { id: "grok-2-image", rank: 5, note: "Handles basic text but struggles with longer strings." },
  { id: "sd-3.5-large", rank: 6, note: "Improved over SD 2.x but still inconsistent." },
  { id: "imagen-3", rank: 7, note: "Good for short labels, less reliable for sentences." },
  { id: "midjourney-v7", rank: 8, note: "Avoid for text-heavy compositions. Artistic strength lies elsewhere." },
] as const;
