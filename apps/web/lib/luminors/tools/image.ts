/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * image_generate — Luminors can call the imagine pipeline mid-response.
 *
 * The Luminor describes an image; `@/lib/imagine/generate` picks a provider
 * (NB2 by default, see feedback_nb2_default memory) and returns hosted URLs.
 */

import { tool } from 'ai';
import { z } from 'zod';
import { generateImages } from '@/lib/imagine/generate';

export const imageGenerateInputSchema = z.object({
  prompt: z.string().describe('Detailed description of the image to generate'),
  aspectRatio: z
    .enum(['1:1', '16:9', '9:16', '4:3'])
    .optional()
    .describe('Image aspect ratio. Defaults to 1:1 if not specified.'),
});

export type ImageGenerateInput = z.infer<typeof imageGenerateInputSchema>;

export function buildImageGenerateTool() {
  return tool({
    description:
      'Generate an image based on a text description. Use when the user asks to create, draw, generate, or imagine a visual image.',
    inputSchema: imageGenerateInputSchema,
    execute: async ({ prompt, aspectRatio }: ImageGenerateInput) => {
      const result = await generateImages({
        prompt,
        aspectRatio: aspectRatio ?? '1:1',
        count: 1,
      });
      return {
        type: 'image' as const,
        images: result.images,
        provider: result.provider,
      };
    },
  });
}
