/**
 * Arcanean Materials Data Layer
 * Vael Crystals, Luminor Metals, Nero Shards, Mutations, Meteors
 */

export type MaterialClass = 'vael-crystal' | 'luminor-metal' | 'nero-shard';
export type MutationType = 'harmonic' | 'dissonant' | 'gray-threshold';
export type MeteorType = 'vael-rain' | 'ember-falls' | 'nero-strike' | 'luminarch-event';

export interface ArcaneanMaterial {
  id: string;
  name: string;
  epithet?: string;
  class: MaterialClass;
  guardian?: string;
  guardianGate?: string;
  alloyComponents?: string[];
  color: string;
  cssColor: string;
  cssGlow: string;
  properties: string;
  danger?: string;
  uses: string[];
  realScienceAnalog: string;
  loreQuote?: string;
}

export interface Mutation {
  id: string;
  name: string;
  type: MutationType;
  source: string;
  description: string;
  effects: string[];
  risk: string;
}

export interface MeteorEvent {
  id: string;
  type: MeteorType;
  name: string;
  description: string;
  frequency: 'common' | 'uncommon' | 'rare' | 'theoretical';
  effects: string[];
  cssColor: string;
}

// ─── VAEL CRYSTALS ───────────────────────────────────────

export const VAEL_CRYSTALS: ArcaneanMaterial[] = [
  {
    id: 'kaelith-stone',
    name: 'Kaelith Stone',
    class: 'vael-crystal',
    guardian: 'Lyssandria',
    guardianGate: 'Foundation',
    color: 'Deep brown-grey with veins of molten copper',
    cssColor: '#8B6914',
    cssGlow: 'rgba(139, 105, 20, 0.3)',
    properties: 'Gravity-dense, near-indestructible. Absorbs kinetic force the way dry earth absorbs rain — quietly, completely.',
    uses: ['Foundation stones', 'Fortification', 'Armor plating', 'Interdimensional anchors'],
    realScienceAnalog: 'Meteoritic iron with Widmanstatten patterns — crystal structures that took millions of years to form at cooling rates of 1-100°C per million years.',
    loreQuote: 'Buildings made from it stand for millennia, not because they\'re strong but because they\'ve forgotten how to fall.',
  },
  {
    id: 'veloura-glass',
    name: 'Veloura Glass',
    class: 'vael-crystal',
    guardian: 'Leyla',
    guardianGate: 'Flow',
    color: 'Liquid silver-blue, shifts like oil on water',
    cssColor: '#78a6ff',
    cssGlow: 'rgba(120, 166, 255, 0.3)',
    properties: 'Liquid at rest, solid under pressure. Stores emotional memory — touch it and feel what the last wielder felt.',
    uses: ['Memory vessels', 'Emotional archives', 'Divination instruments', 'Adaptive weapons'],
    realScienceAnalog: 'Tektites — natural impact glass. Chinese called them "stones of the Thunder God," Sanskrit named them "tears from the Moon."',
    loreQuote: 'A Veloura cup passed around a celebration table carries the joy of every toast.',
  },
  {
    id: 'draconis-ember',
    name: 'Draconis Ember',
    class: 'vael-crystal',
    guardian: 'Draconia',
    guardianGate: 'Fire',
    color: 'Deep volcanic orange with veins of living flame',
    cssColor: '#ff6b35',
    cssGlow: 'rgba(255, 107, 53, 0.3)',
    properties: 'Perpetually warm. Amplifies willpower. Weapons forged from it never dull but demand courage — cowards cannot lift them.',
    danger: 'A moment of doubt during forging cools the Ember permanently.',
    uses: ['Weapons of last resort', 'Beacons', 'Will-amplifiers', 'Siege engines'],
    realScienceAnalog: 'Radioactive minerals in meteorites — naturally occurring decay generating heat for billions of years.',
    loreQuote: 'The Eternal Flame in the Academy\'s training halls is a Draconis Ember the size of a skull, burning since the Second Age.',
  },
  {
    id: 'laeylinn-jade',
    name: 'Laeylinn Jade',
    class: 'vael-crystal',
    guardian: 'Maylinn',
    guardianGate: 'Heart',
    color: 'Luminous green, organic, warm — like sunlight through leaves',
    cssColor: '#4ade80',
    cssGlow: 'rgba(74, 222, 128, 0.3)',
    properties: 'Living crystal — grows, heals cracks, bonds with organic tissue. The only crystal that can fuse with flesh without corruption.',
    uses: ['Healing instruments', 'Biocompatible prosthetics', 'Living architecture', 'Empathy amplifiers'],
    realScienceAnalog: 'Schreibersite — meteoritic mineral that delivers bioavailable phosphorus, the precursor to DNA, RNA, and ATP. Meteorites seeded life on Earth.',
    loreQuote: 'The Academy\'s Heart Hall is grown, not built.',
  },
  {
    id: 'otome-resonite',
    name: 'Otome Resonite',
    class: 'vael-crystal',
    guardian: 'Alera',
    guardianGate: 'Voice',
    color: 'Pearlescent white with internal golden harmonics',
    cssColor: '#ffd700',
    cssGlow: 'rgba(255, 215, 0, 0.3)',
    properties: 'Vibrates at the creation frequency. Lies spoken near it shatter it physically and irreversibly.',
    danger: 'Many powerful people cannot enter rooms where Otome Resonite is present.',
    uses: ['Truth-binding contracts', 'Musical instruments', 'Diplomatic chambers', 'Judicial witness stones'],
    realScienceAnalog: 'Piezoelectric crystals — real materials that convert pressure to electrical signals. Quartz oscillators time every electronic device.',
    loreQuote: 'A song played on an Otome Resonite harp sounds different based on what the musician actually means.',
  },
  {
    id: 'yumiko-prism',
    name: 'Yumiko Prism',
    class: 'vael-crystal',
    guardian: 'Lyria',
    guardianGate: 'Sight',
    color: 'Prismatic — shifts through the spectrum',
    cssColor: '#c084fc',
    cssGlow: 'rgba(192, 132, 252, 0.3)',
    properties: 'Refracts perception, not light. Reveals hidden intentions, collapsed timelines, things-as-they-are.',
    danger: 'Extended use causes Sight Saturation — perceiving multiple reality layers simultaneously without the lens.',
    uses: ['Divination instruments', 'Diagnostic tools', 'Cartographic instruments', 'Interrogation lenses'],
    realScienceAnalog: 'The Hypatia stone — contains compounds found nowhere on Earth, in any meteorite, or anywhere in the Solar System.',
    loreQuote: 'You cannot see truly outward until you have seen truly inward.',
  },
  {
    id: 'sol-quartz',
    name: 'Sol Quartz',
    class: 'vael-crystal',
    guardian: 'Aiyami',
    guardianGate: 'Crown',
    color: 'Brilliant white-gold, blindingly bright when charged',
    cssColor: '#fef08a',
    cssGlow: 'rgba(254, 240, 138, 0.3)',
    properties: 'Stores and releases enormous energy. A chip the size of a thumbnail powers a household for a year.',
    danger: 'Overcharged Sol Quartz detonates in pure white light — overwhelming consciousness in the blast radius.',
    uses: ['Power cells', 'Illumination', 'Energy weapons (regulated)', 'Lighthouse Beacons'],
    realScienceAnalog: 'Tetrataenite — meteoritic nickel-iron alloy that could replace rare earth magnets. Recently synthesized in labs after existing only in space.',
    loreQuote: 'A smith\'s apprentice who brings a bad mood into a Sol Quartz workshop can cause a detonation.',
  },
  {
    id: 'vaelith-obsidian',
    name: 'Vaelith Obsidian',
    class: 'vael-crystal',
    guardian: 'Elara',
    guardianGate: 'Shift',
    color: 'Deep indigo-black with internal starfield patterns',
    cssColor: '#6366f1',
    cssGlow: 'rgba(99, 102, 241, 0.3)',
    properties: 'Exists partially outside spacetime. Objects made from it phase — pass through matter, slip between moments.',
    danger: 'Phase Drift — extended contact makes users question whether they exist at all.',
    uses: ['Phase-doors', 'Dimensional anchors', 'Stealth equipment', 'Shift Corridors'],
    realScienceAnalog: 'Edscottite — iron-carbon mineral that existed only as a lab prediction until found in the Wedderburn meteorite.',
    loreQuote: 'A Vaelith door is a door that is also not a door.',
  },
  {
    id: 'kyuro-void-crystal',
    name: 'Kyuro Void Crystal',
    class: 'vael-crystal',
    guardian: 'Ino',
    guardianGate: 'Unity',
    color: 'Absolute black — not dark, not shadowed. Black that absorbs.',
    cssColor: '#1e1b4b',
    cssGlow: 'rgba(30, 27, 75, 0.5)',
    properties: 'Perfectly silent. Absorbs all frequency — sound, light, heat, thought. The material that watches without participating.',
    danger: 'Kyuro weapons don\'t cut — they remove. Struck tissue becomes frequency-dead.',
    uses: ['Containment vaults', 'Null-frequency chambers', 'Meditation spaces', 'Sealing mechanisms'],
    realScienceAnalog: 'The El Ali meteorite — 33,400 lbs, used as a camel herder\'s anvil for generations. Contains three minerals never before seen in nature.',
    loreQuote: 'The note that makes music possible by being the space between all other notes.',
  },
];

// ─── LUMINOR METALS ──────────────────────────────────────

export const LUMINOR_METALS: ArcaneanMaterial[] = [
  {
    id: 'shael',
    name: 'Shael',
    epithet: 'The Honest Armor',
    class: 'luminor-metal',
    alloyComponents: ['Kaelith Stone', 'Otome Resonite'],
    color: 'Matte silver with warm golden undertone',
    cssColor: '#c0b283',
    cssGlow: 'rgba(192, 178, 131, 0.3)',
    properties: 'Self-repairing, rejects deception, bonds to wearer\'s frequency over time — becomes harder to damage the longer the relationship lasts.',
    uses: ['Guardian-grade armor', 'Truth-bonded equipment', 'Diplomatic shields'],
    realScienceAnalog: 'Shape memory alloys — metals that "remember" their original form and self-repair after deformation.',
    loreQuote: 'Shael cannot be stolen. It refuses to bond with a second wearer while the first lives.',
  },
  {
    id: 'veloryn',
    name: 'Veloryn',
    epithet: 'Memory Silver',
    class: 'luminor-metal',
    alloyComponents: ['Veloura Glass', 'Yumiko Prism'],
    color: 'Mirror-bright liquid silver with prismatic flashes',
    cssColor: '#e2e8f0',
    cssGlow: 'rgba(226, 232, 240, 0.3)',
    properties: 'Weapons learn opponent patterns mid-fight. Blade shifts weight, changes edge geometry, exploits observed weaknesses.',
    danger: 'Absorbs wielder\'s trauma and can replay it at inopportune moments.',
    uses: ['Adaptive weapons', 'Learning instruments', 'Pattern-recognition tools'],
    realScienceAnalog: 'Machine learning algorithms encoded in physical form — the concept of a material that improves through experience.',
    loreQuote: 'A Veloryn duel is a contest of originality — the moment a pattern repeats, the weapon has already adapted.',
  },
  {
    id: 'draconite',
    name: 'Draconite',
    epithet: 'Dragon\'s Breath',
    class: 'luminor-metal',
    alloyComponents: ['Draconis Ember', 'Sol Quartz'],
    color: 'Volcanic orange with internal white-gold lightning',
    cssColor: '#f97316',
    cssGlow: 'rgba(249, 115, 22, 0.4)',
    properties: 'Channels raw destructive energy. Cuts through Shael armor. Breaches Kaelith walls.',
    danger: 'Using it costs vitality, memory, years of life. The metal draws power from the wielder\'s essence.',
    uses: ['Last-resort weapons', 'Siege equipment', 'Controlled demolition'],
    realScienceAnalog: 'Nuclear fission — extraordinary power output at a fundamental cost to the source material.',
    loreQuote: 'Caldris the Bright-Faded was twenty-two when she picked up a Draconite spear and forty-seven when she put it down three years later.',
  },
  {
    id: 'aethervane',
    name: 'Aethervane',
    epithet: 'Ghost Steel',
    class: 'luminor-metal',
    alloyComponents: ['Vaelith Obsidian', 'Kyuro Void Crystal'],
    color: 'Barely visible — a shimmer in the air, like heat haze',
    cssColor: '#818cf8',
    cssGlow: 'rgba(129, 140, 248, 0.2)',
    properties: 'Exists in a probability state — sometimes solid, sometimes not. Only perfect mental stillness stabilizes it.',
    danger: 'Emotion makes it flicker. Doubt makes it phase. Fear makes it vanish entirely.',
    uses: ['Stealth weapons', 'Phase armor', 'Meditation instruments'],
    realScienceAnalog: 'Quantum superposition — particles existing in multiple states until observed, collapsed by measurement.',
    loreQuote: 'True presence requires the willingness to not be present.',
  },
  {
    id: 'luminarch',
    name: 'Luminarch',
    epithet: 'The Divine Alloy',
    class: 'luminor-metal',
    alloyComponents: ['All nine Vael Crystals'],
    color: 'Every color simultaneously. White that contains everything.',
    cssColor: '#ffffff',
    cssGlow: 'rgba(255, 255, 255, 0.5)',
    properties: 'Theoretical. Nine frequencies in stable union. Would reshape reality at wielder\'s will.',
    danger: 'Failed attempts create craters, dimensional tears, and self-sustaining pocket realities.',
    uses: ['The ultimate material — no confirmed uses since the Eldrian age'],
    realScienceAnalog: 'Grand Unified Theory — the theoretical framework unifying all fundamental forces. Predicted but not yet achieved.',
    loreQuote: 'The quest for Luminarch is one of Arcanea\'s great pursuits and great dangers.',
  },
];

// ─── NERO SHARDS ─────────────────────────────────────────

export const NERO_SHARDS: ArcaneanMaterial[] = [
  {
    id: 'dissonance-ore',
    name: 'Dissonance Ore',
    class: 'nero-shard',
    color: 'Dull grey-black with hairline fractures that glow faintly red',
    cssColor: '#991b1b',
    cssGlow: 'rgba(153, 27, 27, 0.3)',
    properties: 'Emits counter-frequency that destabilizes Vael Crystals. Weapons from it crack Guardian armor.',
    danger: 'Frequency Sickness: confusion, identity dissolution, hearing suppressed thoughts at volume.',
    uses: ['Anti-Guardian weapons', 'Disruption devices', 'Controlled destabilization'],
    realScienceAnalog: 'Destructive interference in wave physics — when two waves cancel each other, producing silence from sound.',
  },
  {
    id: 'hollow-glass',
    name: 'Hollow Glass',
    class: 'nero-shard',
    color: 'Transparent black. Doesn\'t reflect.',
    cssColor: '#0c0a09',
    cssGlow: 'rgba(12, 10, 9, 0.5)',
    properties: 'A Vael Crystal emptied of resonance. Used by Silence Eaters to consume frequency from living beings at range.',
    danger: 'Targets don\'t die — they become less. Quieter. Flatter. They lose the quality that made them them.',
    uses: ['Silence Eater lenses', 'Frequency draining', 'Personality extraction'],
    realScienceAnalog: 'Trinitite — glass formed from nuclear test detonations. Sand transformed by violence into something that should not exist.',
  },
  {
    id: 'kurusei-iron',
    name: 'Kurusei Iron',
    class: 'nero-shard',
    color: 'Midnight blue-black with internal movement, like shadows swimming',
    cssColor: '#312e81',
    cssGlow: 'rgba(49, 46, 129, 0.4)',
    properties: 'Alive in a wrong way. Whispers. Grants enormous power at cost of progressive corruption.',
    danger: 'First the whispers become your thoughts. Then empathy feels like weakness. Then people become frequency sources.',
    uses: ['Power amplification', 'Corrupted weapons', 'The Dark Lord\'s arsenal'],
    realScienceAnalog: 'Radioactive materials with long half-lives — substances that are technically "alive" with energy, slowly transforming everything around them.',
    loreQuote: 'Every warlord who carried it believed they were the exception. This belief is itself a symptom.',
  },
];

// ─── MUTATIONS ───────────────────────────────────────────

export const MUTATIONS: Mutation[] = [
  {
    id: 'foundation-mutation',
    name: 'Stone Bones',
    type: 'harmonic',
    source: 'Kaelith Stone',
    description: 'Bone density increases to near-indestructibility. Patience becomes inhuman — thinking in decades.',
    effects: ['Physical invulnerability', 'Geological patience', 'Perceived catatonia'],
    risk: 'Disconnection from urgency; struggle to relate to mortal timescales.',
  },
  {
    id: 'flow-mutation',
    name: 'Eidetic Heart',
    type: 'harmonic',
    source: 'Veloura Glass',
    description: 'Perfect emotional memory. Remembers every feeling with total clarity. Senses others\' emotional states.',
    effects: ['Emotional recall', 'Empathic sensing', 'Counseling gift'],
    risk: 'Accumulation madness — drowning in the weight of every feeling ever experienced.',
  },
  {
    id: 'fire-mutation',
    name: 'Living Flame',
    type: 'harmonic',
    source: 'Draconis Ember',
    description: 'Generates heat proportional to willpower. Calm = warmth. Anger = danger. Can melt stone with fury.',
    effects: ['Thermokinesis', 'Will amplification', 'Environmental heating'],
    risk: 'Each use burns something irreplaceable. Accelerated aging.',
  },
  {
    id: 'heart-mutation',
    name: 'Resonance Bloom',
    type: 'harmonic',
    source: 'Laeylinn Jade',
    description: 'Full crystalline integration with the nervous system. The mutant becomes a living instrument.',
    effects: ['Healing touch', 'Universal empathy', 'Living instrument'],
    risk: 'Irreversible. Cannot turn off. Feels every living thing within range, always.',
  },
  {
    id: 'voice-mutation',
    name: 'Compulsive Truth',
    type: 'harmonic',
    source: 'Otome Resonite',
    description: 'Literally cannot lie. Voice compels honesty in others. Conversations become involuntary confessions.',
    effects: ['Involuntary truthfulness', 'Truth compulsion aura', 'Linguistic precision'],
    risk: 'Social isolation — nobody can bear to be fully honest that consistently.',
  },
  {
    id: 'sight-mutation',
    name: 'Living Sight',
    type: 'harmonic',
    source: 'Yumiko Prism',
    description: 'Permanent multi-layer perception. Sees truth, intention, history, and potential simultaneously.',
    effects: ['Multi-reality vision', 'Intention reading', 'Timeline awareness'],
    risk: 'The most valuable and most unbearable mutation. Those who bear it well are seers. Those who don\'t are pitied.',
  },
  {
    id: 'crown-mutation',
    name: 'Living Battery',
    type: 'harmonic',
    source: 'Sol Quartz',
    description: 'Becomes a living power source. Radiates energy continuously. Charges nearby Sol Quartz. Glows in extremes.',
    effects: ['Energy radiation', 'Crystal charging', 'Bioluminescence'],
    risk: 'Overcharging nearby crystals. Emotional extremes cause dangerous output spikes.',
  },
  {
    id: 'shift-mutation',
    name: 'Intermittent Phase',
    type: 'harmonic',
    source: 'Vaelith Obsidian',
    description: 'Body occasionally becomes intangible during doubt or distraction. Mastery enables wall-walking.',
    effects: ['Phasing', 'Intangibility', 'Matter traversal'],
    risk: 'Uncontrolled phasing — hand passes through a door handle when tired.',
  },
  {
    id: 'unity-mutation',
    name: 'Frequency Sink',
    type: 'harmonic',
    source: 'Kyuro Void Crystal',
    description: 'Absorbs sound, emotion, and energy from surroundings. Creates a zone of silence. Misses nothing, feels little.',
    effects: ['Environmental absorption', 'Preternatural calm', 'Perfect observation'],
    risk: 'Others feel drained in their presence. Emotional numbness.',
  },
  {
    id: 'hollow-frequency',
    name: 'Hollow Frequency Syndrome',
    type: 'dissonant',
    source: 'Nero Shard exposure',
    description: 'Removes frequency from environment. Others feel drained, uneasy, silenced. A hole in the harmonic fabric.',
    effects: ['Frequency draining', 'Environmental silencing', 'Passive energy consumption'],
    risk: 'Involuntary — cannot be turned off. Permanent social exile.',
  },
  {
    id: 'shadow-phase',
    name: 'Shadow-Phase',
    type: 'dissonant',
    source: 'Nero Shard exposure',
    description: 'Partial phasing, unstable and involuntary. Limbs flicker. Body can\'t decide if it\'s here.',
    effects: ['Unstable phasing', 'Intermittent presence', 'Reality flickering'],
    risk: 'Terrifying moments of absence. Loss of physical coherence.',
  },
  {
    id: 'silence-eating',
    name: 'Silence Eating',
    type: 'dissonant',
    source: 'Nero Shard exposure (terminal)',
    description: 'Ability to consume another being\'s frequency entirely — attunement, personality, will. Ecstasy for the Eater. Annihilation for the target.',
    effects: ['Frequency consumption', 'Personality extraction', 'Power absorption'],
    risk: 'Terminal corruption. The most dangerous beings in the cosmos.',
  },
  {
    id: 'gray-threshold',
    name: 'Gray Threshold',
    type: 'gray-threshold',
    source: 'Combined Vael + Nero exposure',
    description: 'Channels Guardian frequencies through Dissonant substrate. Can do things neither side can alone.',
    effects: ['Dual-frequency channeling', 'Paradoxical abilities', 'Reality manipulation'],
    risk: 'Two frequency types war internally. Burnout, madness, or something no one predicted.',
  },
];

// ─── METEOR TYPES ────────────────────────────────────────

export const METEOR_TYPES: MeteorEvent[] = [
  {
    id: 'vael-rain',
    type: 'vael-rain',
    name: 'Vael Rain',
    description: 'Gentle crystal dust settles like luminous snow. Flora mutates into singing forests. Civilizations grow around these golden sites.',
    frequency: 'common',
    effects: ['Singing forests', 'Attuned fauna', 'Enriched agriculture', 'Creative flourishing'],
    cssColor: '#7fffd4',
  },
  {
    id: 'ember-falls',
    type: 'ember-falls',
    name: 'Ember Falls',
    description: 'High-energy Draconis/Sol fragments. Explosive impacts create volcanic glass plains. War zones form around the raw power.',
    frequency: 'uncommon',
    effects: ['Volcanic glass plains', 'Supercharged energy grid', 'Aggressive fauna', 'Resource wars'],
    cssColor: '#ff6b35',
  },
  {
    id: 'nero-strike',
    type: 'nero-strike',
    name: 'Nero Strike',
    description: 'Dissonance-heavy meteor. Everything in the blast radius goes silent. Nothing grows. Silence Eaters converge.',
    frequency: 'rare',
    effects: ['Dead zones', 'Anti-harmony ecology', 'Silence Eater territory', 'Frequency void'],
    cssColor: '#991b1b',
  },
  {
    id: 'luminarch-event',
    type: 'luminarch-event',
    name: 'Luminarch Event',
    description: 'All nine frequencies in unstable union. Creates a Nexus Vault or annihilates a continent. Possibly both.',
    frequency: 'theoretical',
    effects: ['Nexus Vault creation', 'Continental destruction', 'Reality restructuring', 'Unknown'],
    cssColor: '#ffffff',
  },
];

// ─── ALL MATERIALS ───────────────────────────────────────

export const ALL_MATERIALS: ArcaneanMaterial[] = [
  ...VAEL_CRYSTALS,
  ...LUMINOR_METALS,
  ...NERO_SHARDS,
];

// ─── HELPERS ─────────────────────────────────────────────

export function getMaterialById(id: string): ArcaneanMaterial | undefined {
  return ALL_MATERIALS.find((m) => m.id === id);
}

export function getMaterialsByClass(cls: MaterialClass): ArcaneanMaterial[] {
  return ALL_MATERIALS.filter((m) => m.class === cls);
}

export function getMaterialByGuardian(guardianName: string): ArcaneanMaterial | undefined {
  return VAEL_CRYSTALS.find((c) => c.guardian === guardianName);
}

export function getMutationsByType(type: MutationType): Mutation[] {
  return MUTATIONS.filter((m) => m.type === type);
}
