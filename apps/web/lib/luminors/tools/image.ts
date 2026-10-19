/** Prepare an image request for explicit creator review in Imagine. */
import { tool } from "ai";
import { z } from "zod";

export const imageGenerateInputSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1)
    .max(2000)
    .describe("Detailed description of the image to generate"),
  aspectRatio: z
    .enum(["1:1", "16:9", "9:16", "4:3"])
    .optional()
    .describe(
      "Suggested image aspect ratio. The creator selects this in Imagine.",
    ),
});
export type ImageGenerateInput = z.infer<typeof imageGenerateInputSchema>;

export function buildImageGenerateTool() {
  return tool({
    description:
      "Prepare an image request and return a link to Imagine for the creator to review the prompt, choose the model and aspect ratio, and submit it. This tool does not generate an image or spend credits. Never describe its result as a completed image.",
    inputSchema: imageGenerateInputSchema,
    execute: async (input: ImageGenerateInput) => {
      const { prompt, aspectRatio = "1:1" } =
        imageGenerateInputSchema.parse(input);
      return {
        type: "image_generation_handoff" as const,
        status: "awaiting_creator" as const,
        prompt,
        aspectRatio,
        href: `/imagine?${new URLSearchParams({ prompt })}`,
        message:
          "Review the prompt in Imagine, select the requested aspect ratio and model, then generate. No image has been generated and no image credits have been spent.",
      };
    },
  });
}
