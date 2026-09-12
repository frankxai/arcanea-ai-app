import { z } from "zod";

const name = z.string().trim().min(1).max(160);
const text = z.string().max(12000);
const color = z.string().regex(/^#[0-9a-f]{6}$/i);

export const worldDraftSchema = z.object({
  name,
  slug: z
    .string()
    .trim()
    .min(1)
    .max(96)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  tagline: z.string().max(500).default(""),
  description: text.default(""),
  mood: z.string().max(500).optional(),
  elements: z
    .array(z.object({ name, domain: z.string().max(1000), color }))
    .max(12)
    .default([]),
  laws: z
    .array(z.object({ name, description: text }))
    .max(12)
    .default([]),
  systems: z
    .array(z.object({ name, type: z.string().max(100), rules: text }))
    .max(8)
    .default([]),
  characters: z
    .array(
      z.object({
        name,
        title: z.string().max(500).optional(),
        backstory: text.optional(),
        element: z.string().max(160).optional(),
        origin_class: z.string().max(160).optional(),
        personality: z
          .object({
            traits: z.array(z.string().max(500)).max(12).default([]),
            voice_style: z.string().max(1000).optional(),
          })
          .optional(),
      }),
    )
    .max(8)
    .default([]),
  locations: z
    .array(
      z.object({
        name,
        region: z.string().max(500).optional(),
        description: text.optional(),
        significance: text.optional(),
      }),
    )
    .max(8)
    .default([]),
  first_event: z
    .object({
      title: name,
      description: text,
      era: z.string().max(500).optional(),
    })
    .optional(),
  palette: z
    .object({ primary: color, secondary: color, accent: color })
    .optional(),
  image_prompt: z.string().max(6000).default(""),
});

export type WorldDraft = z.infer<typeof worldDraftSchema>;
export const saveWorldDraftSchema = z.object({
  draft_id: z.string().uuid(),
  world: worldDraftSchema,
});
export type SaveWorldDraft = z.infer<typeof saveWorldDraftSchema>;

export function draftResult(world: WorldDraft, draft_id: string) {
  return {
    world,
    draft_id,
    characters: world.characters,
    locations: world.locations,
    event: world.first_event,
    image_prompt: world.image_prompt,
    saved: false,
  };
}

export const WORLD_DRAFT_KEY = "arcanea.world-draft.v1";
export const storedWorldDraftSchema = z.object({
  version: z.literal(1),
  description: z.string().max(500),
  draft_id: z.string().uuid(),
  world: worldDraftSchema,
});

export function readStoredWorldDraft(raw: string | null) {
  if (!raw || raw.length > 150000) return null;
  try {
    const result = storedWorldDraftSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
