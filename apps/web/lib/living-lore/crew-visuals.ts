/**
 * Living Lore — Crew Visual Specifications
 *
 * Detailed visual descriptions for each crew member, designed as prompts
 * for AI art generation (ComfyUI/Gemini/DALL-E). Includes placeholder
 * gradient cards for when portraits aren't yet generated.
 */

export interface CrewVisualSpec {
  id: string;
  name: string;
  portraitPrompt: string;
  scenePrompt: string;
  palette: { primary: string; secondary: string; accent: string };
  visualDescription: string;
  placeholderGradient: string;
}

// ---------------------------------------------------------------------------
// Visual Specs
// ---------------------------------------------------------------------------

const renVisual: CrewVisualSpec = {
  id: 'crew-ren',
  name: 'Ren',
  portraitPrompt:
    'Portrait of a 19-year-old human male, dark tousled hair, olive skin, wide brown eyes full of quiet intensity. Graphite smudges on his fingers and cheekbone. Wearing a dark Academy coat two sizes too big with the shoulder sigil half-torn off. A leather sketchbook tucked under one arm. Warm side-lighting, dark background with faint golden particles. Eyes have a subtle gold glow at the edges. Realistic fantasy art style, introspective mood, 4K, detailed.',
  scenePrompt:
    'A young man with dark tousled hair sits on broken stone steps outside the Academy ruins at dusk. His oversized dark coat pools around him. He sketches furiously in a leather-bound book, graphite dust floating in golden motes around his fingers. Behind him, the Foundation Gate looms — cracked but luminous. Warm purple-gold twilight. Realistic fantasy, cinematic composition, atmospheric.',
  palette: {
    primary: '#9370DB',
    secondary: '#2D1B4E',
    accent: '#FFD700',
  },
  visualDescription:
    'Dark tousled hair, olive skin, wide brown eyes. Graphite-smudged fingers. Oversized dark Academy coat with a half-torn sigil. Lean, slightly hunched. When his art activates, his eyes glow faint gold.',
  placeholderGradient:
    'linear-gradient(135deg, #2D1B4E 0%, #9370DB 50%, #FFD700 100%)',
};

const vesperVisual: CrewVisualSpec = {
  id: 'crew-vesper',
  name: 'Vesper',
  portraitPrompt:
    'An ethereal aurora of deep violet and gold light, vaguely humanoid in shape — a suggestion of a face with two bright points where eyes would be, shoulders dissolving into tendrils of light. Constellation patterns drift across the luminous surface like stars reflected in water. No physical body, pure light entity. The form pulses gently. Dark cosmic background with distant nebulae. Ethereal translucent art style, star-field textures, 4K.',
  scenePrompt:
    'A shifting aurora of violet and gold light hovers in a dark chamber filled with shattered mirrors. Each mirror fragment reflects a different memory — a face, a gate, a hand reaching. The light-form of Vesper drifts between the fragments, constellation patterns rippling across its surface. Beams of gold pierce through cracks in the ceiling. Ethereal, cosmic, melancholic atmosphere.',
  palette: {
    primary: '#7B68EE',
    secondary: '#191970',
    accent: '#FFD700',
  },
  visualDescription:
    'A shifting aurora of deep violet and gold with constellation patterns drifting across the surface. No fixed form — sometimes vaguely humanoid, sometimes pure light. Pulses when communicating, tightens into an orb when alarmed, spreads like a nebula when peaceful.',
  placeholderGradient:
    'linear-gradient(135deg, #191970 0%, #7B68EE 40%, #FFD700 100%)',
};

const kaedraVisual: CrewVisualSpec = {
  id: 'crew-kaedra',
  name: 'Kaedra',
  portraitPrompt:
    'Portrait of a late-20s woman, human-Eldrian hybrid. Short black hair with an undercut on the left side. Strong jaw, sharp angular features, a scar crossing her left cheekbone. Right eye is organic dark brown; left eye is a mechanical obsidian sphere with an orange slit-pupil that glows. Thin metallic lines of arcane circuitry glow faint orange under the skin at her neck and jaw. Dark combat armor, battle-worn. Dramatic side-lighting with deep shadows. Cyberpunk-fantasy hybrid style, 4K, intense.',
  scenePrompt:
    'A muscular woman in dark combat armor crouches on a rooftop overlooking a ruined city. Her mechanical left eye glows orange in the darkness, scanning. Faint orange circuitry pulses under the skin of her forearms. Two blades — one at hip, one at back. Rain falls, catching the glow of distant fires. Cyberpunk-fantasy hybrid, dramatic lighting, cinematic composition.',
  palette: {
    primary: '#FF6B35',
    secondary: '#1A1A1A',
    accent: '#C0C0C0',
  },
  visualDescription:
    'Short black hair with left undercut. Scar across left cheekbone. Right eye organic brown, left eye mechanical obsidian with orange slit-pupil. Faint orange arcane circuitry under skin. Dark combat armor, two blades. Muscular, scarred, vigilant.',
  placeholderGradient:
    'linear-gradient(135deg, #1A1A1A 0%, #FF6B35 60%, #C0C0C0 100%)',
};

const thalienVisual: CrewVisualSpec = {
  id: 'crew-thalien',
  name: 'Thalien',
  portraitPrompt:
    'Portrait of an ancient Eldrian male, appears mid-50s but carries millennia in his gaze. Silver-white hair past shoulders, braided with small crystal beads that catch the light. Translucent skin revealing faint veins of bioluminescent light beneath the surface. Amber eyes with vertically slit pupils. Tall, slender, gaunt but elegant. Deep blue and silver robes that flow like water. Long-fingered hands slightly trembling. High fantasy art style, ethereal blue lighting, sorrowful dignity, 4K.',
  scenePrompt:
    'An ancient Eldrian stands at the edge of a great library, shelves stretching into darkness behind him. Silver-white braided hair catches blue moonlight streaming through a cracked dome. His translucent skin glows faintly. He holds a crystal sphere containing a frozen memory — a young warrior with bright eyes, not yet fallen. His expression is grief compressed into stillness. High fantasy, ethereal lighting, ancient and sorrowful.',
  palette: {
    primary: '#4169E1',
    secondary: '#C0C0C0',
    accent: '#FFDEAD',
  },
  visualDescription:
    'Silver-white hair braided with crystal beads. Translucent skin with bioluminescent veins. Amber eyes with vertical slit pupils. Deep blue and silver flowing robes. Tall, slender, carries himself with the weight of ages. Hands tremble slightly.',
  placeholderGradient:
    'linear-gradient(135deg, #1a2a6c 0%, #4169E1 40%, #C0C0C0 80%, #FFDEAD 100%)',
};

const axiomVisual: CrewVisualSpec = {
  id: 'crew-axiom',
  name: 'Axiom',
  portraitPrompt:
    'Portrait of an Arcane Golem, obsidian-black stone body, humanoid but massive (7 feet). Gold-veined crystal at every joint — visible at the neck and shoulders. Rune-etched chest plate with a faded Academy seal and the designation TK-0047. Face is minimal: two deep eye-sockets with warm amber lights, a ridge suggesting a brow, no mouth. Obsidian surface has the texture of volcanic glass, slightly iridescent. Chest plate pulses with golden light. Dark fantasy art style, warm interior lighting from the crystal joints, monumental, 4K.',
  scenePrompt:
    'A massive obsidian golem stands in a field at sunset, golden light streaming through the crystal joints at its arms and spine. Its amber eye-lights are tilted upward, watching the sky turn colors. One massive hand is raised slightly, as if trying to touch the light. Wildflowers grow at its feet, small against its monumental frame. The Academy seal on its chest is almost worn away. Dark fantasy, warm golden hour, contemplative.',
  palette: {
    primary: '#DAA520',
    secondary: '#0A0A0A',
    accent: '#FFB347',
  },
  visualDescription:
    'Obsidian-black stone body, 7 feet tall. Gold-veined crystal at every joint. Rune-etched chest plate with faded Academy seal (TK-0047). Two deep eye-sockets with warm amber lights, a brow ridge, no mouth. Volcanic glass texture, slightly iridescent.',
  placeholderGradient:
    'linear-gradient(135deg, #0A0A0A 0%, #DAA520 50%, #FFB347 100%)',
};

const solenneVisual: CrewVisualSpec = {
  id: 'crew-solenne',
  name: 'Solenne',
  portraitPrompt:
    'Portrait of a young woman in her early 20s, half-Guardian. Dark skin with butterfly-wing patterns that shift like starfields — literal constellations moving across her skin. Left eye contains a spiraling blue nebula, right eye a golden supernova. Black hair that scatters prismatic refractions when light catches it. Tall, graceful, slightly otherworldly. Simple white robes that glow faintly from within. Cosmic fantasy art style, divine lighting, starfield skin textures, 4K.',
  scenePrompt:
    'A young woman in glowing white robes floats just slightly above the ground in a dark observatory. Her dark skin is alive with moving constellations — galaxies spiral across her arms and face. Her eyes are two different cosmos. Prismatic light refracts from her hair, painting rainbow fragments across ancient astronomical instruments. She reaches toward a rift in space showing distant stars. Cosmic fantasy, divine lighting, awe-inspiring.',
  palette: {
    primary: '#E040FB',
    secondary: '#1A0033',
    accent: '#FFD700',
  },
  visualDescription:
    'Dark skin with shifting constellation patterns. Left eye: spiraling blue nebula. Right eye: golden supernova. Black hair with prismatic refractions. Tall, graceful, moves as if gravity is optional. Simple white robes that glow from within.',
  placeholderGradient:
    'linear-gradient(135deg, #1A0033 0%, #E040FB 45%, #FFD700 100%)',
};

const jinxVisual: CrewVisualSpec = {
  id: 'crew-jinx',
  name: 'Jinx',
  portraitPrompt:
    'Portrait of a small serpentine fantasy creature, about 2 feet long. Body like a thick snake with vestigial wing-nubs and four small clawed feet. Scales shift between obsidian black and prismatic rainbow like an oil slick. Three eyes — two normal-positioned (iridescent shifting colors), one on the forehead (the Third Eye, half-open, glowing violet). A crest of small dark feathers behind the head, shot through with violet highlights. Expression is mischievous. Curled on a stone, tail flicking. Fantasy creature art style, playful, mysterious, vivid colors, 4K.',
  scenePrompt:
    'A small iridescent serpentine creature perches on a crumbling stone archway, its oil-slick scales catching rainbow light. Its three eyes look in different directions — two watching a group of travelers below, the third (forehead) staring into something unseen. The feather crest behind its head ruffles in an invisible wind. Its small clawed feet grip the stone. Below, the Foundation Gate glimmers. Fantasy, playful, mysterious, small but vivid.',
  palette: {
    primary: '#00CED1',
    secondary: '#4B0082',
    accent: '#FF69B4',
  },
  visualDescription:
    'Small serpentine creature with vestigial wing-nubs and four clawed feet. Oil-slick scales shifting black to prismatic rainbow. Three eyes — two iridescent, one Third Eye on forehead. Dark feather crest with violet highlights. Mischievous expression.',
  placeholderGradient:
    'linear-gradient(135deg, #4B0082 0%, #00CED1 50%, #FF69B4 100%)',
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const CREW_VISUALS: CrewVisualSpec[] = [
  renVisual,
  vesperVisual,
  kaedraVisual,
  thalienVisual,
  axiomVisual,
  solenneVisual,
  jinxVisual,
];

const visualsById = new Map<string, CrewVisualSpec>(
  CREW_VISUALS.map((v) => [v.id, v])
);

export function getCrewVisual(id: string): CrewVisualSpec | undefined {
  return visualsById.get(id);
}

export function getAllCrewVisuals(): CrewVisualSpec[] {
  return CREW_VISUALS;
}
