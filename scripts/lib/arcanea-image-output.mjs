const OPENAI_PIXEL_DIMENSIONS = {
  "1:1": { width: 1536, height: 1536 },
  "4:5": { width: 1536, height: 1920 },
  "3:2": { width: 1536, height: 1024 },
  "2:3": { width: 1024, height: 1536 },
  "4:3": { width: 1536, height: 1152 },
  "3:4": { width: 1152, height: 1536 },
  "16:9": { width: 1792, height: 1008 },
  "9:16": { width: 1008, height: 1792 },
  "21:9": { width: 2016, height: 864 },
};

const FLUX_PIXEL_DIMENSIONS = {
  ...OPENAI_PIXEL_DIMENSIONS,
  "1:1": { width: 1408, height: 1408 },
  "4:5": { width: 1216, height: 1520 },
};

export const SUPPORTED_OUTPUT_ASPECT_RATIOS = Object.freeze(
  Object.keys(OPENAI_PIXEL_DIMENSIONS),
);

export function providerDimensionsForAspect(providerProfileId, aspectRatio) {
  const dimensions =
    providerProfileId === "openai-gpt-image"
      ? OPENAI_PIXEL_DIMENSIONS[aspectRatio]
      : providerProfileId === "flux-2"
        ? FLUX_PIXEL_DIMENSIONS[aspectRatio]
        : null;
  if (!dimensions) {
    if (!SUPPORTED_OUTPUT_ASPECT_RATIOS.includes(aspectRatio)) {
      throw new Error(`Unsupported output aspect ratio: ${aspectRatio}.`);
    }
    throw new Error(
      `Provider ${providerProfileId} does not use an explicit pixel-dimension map.`,
    );
  }
  return { ...dimensions };
}
