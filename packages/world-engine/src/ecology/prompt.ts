import {
  ECOLOGY_GATE_CONTEXT,
  type EcologyEntry,
  type EcologyImageShot,
  type EcologyVisualPromptOptions,
  type EcologyVisualPromptResult,
} from "./types.js";

const SHOT_DIRECTION: Record<EcologyImageShot, string> = {
  "habitat-hero":
    "Wide environmental hero frame. Show the organism actively changing its habitat; scale must be proven by terrain, weather, and smaller life, not by text.",
  specimen:
    "Living specimen portrait with the complete silhouette readable, anatomy unobscured, tactile surfaces legible, and no museum labels or dead display pose.",
  relationship:
    "Show one ecological dependency in the instant its cause becomes visible. Both organisms remain anatomically readable and neither becomes decorative background.",
  macro:
    "Extreme macro view of one functional structure. Reveal how material, signal, and energy mechanism work; retain enough context to identify the organism.",
  lifecycle:
    "One continuous habitat scene containing distinct life stages through depth and time cues, not a collage, split panel, infographic, or lineup.",
};

function selectedRelationship(entry: EcologyEntry, targetId?: string): string {
  const relationship = targetId
    ? entry.ecology.relationships.find((candidate) => candidate.targetId === targetId)
    : entry.ecology.relationships[0];
  if (!relationship) return "No secondary organism; focus on the habitat function.";
  return `${relationship.type} with ${relationship.targetName ?? relationship.targetId}: ${relationship.description}`;
}

export function buildEcologyVisualPrompt(
  entry: EcologyEntry,
  options: EcologyVisualPromptOptions = {},
): EcologyVisualPromptResult {
  const shot = options.shot ?? "habitat-hero";
  const aspectRatio = options.aspectRatio ?? "16:9";
  const gateContext = ECOLOGY_GATE_CONTEXT[entry.gate];
  const radiance = entry.radiance
    ? `${entry.radiance.mechanism}; carrier: ${entry.radiance.carrier}; trigger: ${entry.radiance.trigger}; appearance: ${entry.radiance.appearance}; signal: ${entry.radiance.information}; visible energetic cost: ${entry.radiance.cost}.`
    : "No decorative glow. Light behaves only as specified by the habitat and living surfaces.";

  const prompt = [
    "[WORLD]",
    "WORLD SPARK: Creation is conscious; every living act alters the Weave, and the Weave remembers.",
    "WORLD SHAPE: VOID + FORGE — starfield silence meets metabolized heat; ozone, old bronze, wet living tissue; light originates inside matter.",
    "WORLD SHARPEN: NOT medieval-European fantasy. NOT chosen-one symbolism. NOT magic without cost. NOT pure good versus evil. NOT technology separated from biology or magic.",
    "",
    `SPARK: ${entry.visual.spark}`,
    `SHAPE: ${entry.visual.shapePalettes.join(" + ")}. ${entry.narrative.sensorySignature}`,
    `SHARPEN: ${entry.visual.sharpen.map((constraint) => `NOT ${constraint}`).join("; ")}.`,
    "",
    "@form visual",
    "@tone documentary",
    "@render cinematic",
    `@anchor ${entry.narrative.signatureBehavior}`,
    "@exclude generic-fantasy-art, decorative-neon, plastic-surfaces, busy-composition, copied-franchise-traits",
    `@element ${entry.visual.shapePalettes.join(" + ")}`,
    "",
    `Create one original Arcanea ${entry.kind} image of ${entry.name}.`,
    `CANON STATE: ${entry.canon.state}.`,
    `CANON ANCHOR: ${entry.gate} Gate · ${gateContext.guardian} · ${gateContext.godbeast}. Anchor only to cited entry sources; do not imply this proposal is locked canon.`,
    `Body: ${entry.taxonomy.morphology} Substrate: ${entry.taxonomy.bodySubstrate}`,
    `Silhouette: ${entry.taxonomy.silhouetteThesis}`,
    `Structural logic: ${entry.taxonomy.structuralAdaptations.join("; ")}.`,
    `Scale: ${entry.visual.scaleEvidence}`,
    `Behavior: ${entry.narrative.signatureBehavior}`,
    `Ecological action: ${selectedRelationship(entry, options.relationshipTargetId)}`,
    `Covenant made visible: gift — ${entry.covenant.gift}; cost — ${entry.covenant.cost}; breach — ${entry.covenant.breachConsequence}.`,
    `Radiance and signal logic: ${radiance}`,
    `Environment: ${entry.origin.biome}${entry.origin.realmName ? `, ${entry.origin.realmName}` : ""}, ${entry.origin.worldName}. ${entry.ecology.habitatFunction}`,
    `Material language: ${entry.visual.materialLanguage.join(", ")}. Light behavior: ${entry.visual.lightBehavior}`,
    `Composition: ${SHOT_DIRECTION[shot]} ${entry.visual.camera}`,
    `Finish: Arcanean living-world design expressed through causal anatomy, restrained radiance, deep atmospheric separation, noble silhouette, subtle wear, and museum-grade production value.`,
    `Output: ${aspectRatio}, single coherent frame, no text.`,
  ].join("\n");

  return {
    prompt,
    negativePrompt: [
      "generic fantasy plant",
      "ordinary flower enlarged without structural adaptation",
      "decorative neon glow",
      "oversaturated purple-pink palette",
      "plastic or toy surfaces",
      "collectible monster framing",
      "copied franchise traits",
      "random crystal growths",
      "symmetrical concept-art pedestal",
      "collage",
      "split panel",
      "infographic labels",
      "typography",
      "watermark",
      "UI",
    ].join(", "),
    shot,
    aspectRatio,
    canonState: entry.canon.state,
    sourceEntryId: entry.id,
  };
}
