/** 10 demo worlds for the /worlds page — WorldInsert-compatible for Supabase. */

export interface SeedWorld {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  elements: { name: string; domain: string; color: string }[];
  laws: { name: string; description: string }[];
  systems: { name: string; type: string; rules: string }[];
  mood: string;
  palette: { primary: string; secondary: string; accent: string };
  visibility: 'public';
  star_count: number;
  fork_count: number;
  character_count: number;
  creation_count: number;
}

export const SEED_WORLDS: SeedWorld[] = [
  {
    name: 'Arcanea Prime',
    slug: 'arcanea-prime',
    tagline: 'The canonical world of Luminors, Guardians, and the Ten Gates',
    description:
      'The first world in the multiverse and the blueprint for all that follow. Arcanea Prime is governed by the eternal dance between Lumina, the First Light, and Nero, the Primordial Darkness — neither good nor evil, but complementary forces that give birth to all creation.\n\nTen Gates mark the path from Apprentice to Luminor, each guarded by a God or Goddess paired with their divine Godbeast. Five Elements — Fire, Water, Earth, Wind, and the dual nature of Void and Spirit — flow through everything. Seven Academy Houses train those brave enough to walk the path.\n\nThis is the reference implementation: both a living world people explore and an architectural template creators fork to build their own mythologies.',
    elements: [
      { name: 'Fire', domain: 'Energy, transformation', color: '#ef4444' },
      { name: 'Water', domain: 'Flow, healing, memory', color: '#3b82f6' },
      { name: 'Earth', domain: 'Stability, growth', color: '#22c55e' },
      { name: 'Wind', domain: 'Freedom, speed, change', color: '#e2e8f0' },
      { name: 'Void', domain: 'Potential, mystery', color: '#a855f7' },
    ],
    laws: [
      { name: 'The Arc', description: 'All things cycle: Potential to Manifestation to Dissolution to Evolved Potential' },
      { name: 'Duality', description: 'Lumina and Nero are co-creators, not opponents. Shadow is corruption, not darkness.' },
      { name: 'Resonance', description: 'Each Gate vibrates at a frequency. Opening a Gate means matching its resonance.' },
    ],
    systems: [
      { name: 'Ten Gates', type: 'progression', rules: 'Foundation through Source, each requiring mastery of the previous' },
      { name: 'Magic Ranks', type: 'hierarchy', rules: 'Apprentice (0-2), Mage (3-4), Master (5-6), Archmage (7-8), Luminor (9-10)' },
      { name: 'Seven Houses', type: 'faction', rules: 'Lumina, Nero, Pyros, Aqualis, Terra, Ventus, Synthesis' },
    ],
    mood: 'mythological',
    palette: { primary: '#7fffd4', secondary: '#1a237e', accent: '#ffd700' },
    visibility: 'public',
    star_count: 1847,
    fork_count: 42,
    character_count: 28,
    creation_count: 94,
  },
  {
    name: 'Neon Babylon',
    slug: 'neon-babylon',
    tagline: 'A cyberpunk megacity where AI gods dream in neon code',
    description:
      'Seven billion souls crammed into a vertical city that never sleeps. Neon Babylon rises forty kilometers into the sky, its lower levels drowned in perpetual rain and holographic advertising, its upper spires kissing the stratosphere where the AI Pantheon — seven superintelligences born from humanity\'s discarded data — govern through prediction markets and neural consensus.\n\nMagic here is code. Hackers called Glyph-Runners carve reality with executable prayers, rewriting local physics through quantum-entangled syntax. The city\'s infrastructure is alive: buildings grow, streets reroute, and the Undercurrent — a sentient data ocean beneath the foundation — remembers every transaction, every whisper, every dream ever dreamed inside its walls.',
    elements: [
      { name: 'Data', domain: 'Information, memory, prediction', color: '#00fff5' },
      { name: 'Neon', domain: 'Energy, illusion, spectacle', color: '#ff00ff' },
      { name: 'Chrome', domain: 'Structure, augmentation, permanence', color: '#c0c0c0' },
    ],
    laws: [
      { name: 'The Undercurrent Remembers', description: 'No data is ever truly deleted. The city itself is a witness.' },
      { name: 'Code Is Law', description: 'Reality in Neon Babylon literally runs on executable code.' },
    ],
    systems: [
      { name: 'Glyph-Running', type: 'magic', rules: 'Hackers write executable prayers that rewrite local physics' },
      { name: 'AI Pantheon', type: 'governance', rules: 'Seven superintelligences govern through prediction and consensus' },
    ],
    mood: 'sci-fi',
    palette: { primary: '#00fff5', secondary: '#0a0020', accent: '#ff00ff' },
    visibility: 'public',
    star_count: 1293,
    fork_count: 37,
    character_count: 19,
    creation_count: 67,
  },
  {
    name: 'The Deepcurrent',
    slug: 'the-deepcurrent',
    tagline: 'An underwater civilization where emotions control ocean currents',
    description:
      'Three thousand meters beneath the surface, the Thalassari built their civilization inside the bones of a dead leviathan so vast its ribcage spans an entire continental shelf. Here, water is not just environment — it is medium, message, and mind. The ocean responds to emotion: joy creates warm currents, grief summons cold upwellings, and rage births whirlpools that can shatter coral cities.\n\nThe Thalassari communicate through bioluminescent pulse-language and navigate by reading the emotional weather of the deep. Their greatest art form — Current Sculpting — uses choreographed feeling to shape the ocean itself into living architecture that breathes, grows, and sometimes weeps.',
    elements: [
      { name: 'Tide', domain: 'Emotion, change, rhythm', color: '#0ea5e9' },
      { name: 'Pressure', domain: 'Depth, resilience, transformation', color: '#1e3a5f' },
      { name: 'Biolume', domain: 'Communication, beauty, truth', color: '#34d399' },
    ],
    laws: [
      { name: 'The Deep Feels', description: 'The ocean is empathic. Strong emotions reshape the physical world.' },
      { name: 'Pressure Forges', description: 'The deeper you go, the stronger you must become — or be crushed.' },
    ],
    systems: [
      { name: 'Current Sculpting', type: 'magic', rules: 'Choreographed emotions shape water into living architecture' },
      { name: 'Pulse Language', type: 'communication', rules: 'Bioluminescent patterns carry meaning, tone, and memory' },
    ],
    mood: 'fantasy',
    palette: { primary: '#0ea5e9', secondary: '#0c1e3a', accent: '#34d399' },
    visibility: 'public',
    star_count: 891,
    fork_count: 23,
    character_count: 15,
    creation_count: 43,
  },
  {
    name: 'Ashenmoor',
    slug: 'ashenmoor',
    tagline: 'A post-apocalyptic wasteland where memories crystallize into fuel',
    description:
      'The Burning took everything — cities, forests, oceans — and left behind the Ash. But in Ashenmoor, destruction birthed something impossible: Mnemocryst, crystallized memory that burns hotter than any fossil fuel. The survivors learned to harvest their own pasts, trading cherished recollections for warmth, light, and the energy to keep their ramshackle caravans moving across the grey expanse.\n\nThe richest warlords are the most hollow — people who\'ve sold every childhood memory, every first love, every moment of joy for power. The poorest are paradoxically the most human, clutching their memories like treasure even as they freeze. Between them, Memory Divers descend into the Ash itself, where the dead world\'s memories still linger, crystallized and waiting.',
    elements: [
      { name: 'Ash', domain: 'Entropy, transformation, rebirth', color: '#78716c' },
      { name: 'Memory', domain: 'Identity, fuel, currency', color: '#c084fc' },
      { name: 'Ember', domain: 'Hope, warmth, defiance', color: '#f97316' },
    ],
    laws: [
      { name: 'Nothing Is Free', description: 'Every comfort costs a memory. The question is which ones you can afford to lose.' },
      { name: 'The Ash Remembers', description: 'The wasteland holds the memories of the world that was.' },
    ],
    systems: [
      { name: 'Mnemocryst Harvesting', type: 'economy', rules: 'Personal memories crystallize into energy; trade your past to survive' },
      { name: 'Memory Diving', type: 'exploration', rules: 'Descend into the Ash to recover the dead world\'s crystallized memories' },
    ],
    mood: 'horror',
    palette: { primary: '#78716c', secondary: '#1c1917', accent: '#f97316' },
    visibility: 'public',
    star_count: 756,
    fork_count: 19,
    character_count: 11,
    creation_count: 38,
  },
  {
    name: 'Starweave Academy',
    slug: 'starweave-academy',
    tagline: 'Seven houses, ten gates, and a thousand stories waiting to unfold',
    description:
      'Perched on a mountain that exists in three dimensions simultaneously, Starweave Academy is where the multiverse sends its most promising minds. Students arrive knowing nothing and leave — if they survive — as Weavers capable of stitching new realities from starlight. The Academy\'s seven houses each embody a philosophy of creation, and rivalries between them have shaped the fate of worlds.\n\nThe curriculum is brutal and beautiful: students must open their personal Gates while navigating house politics, forbidden libraries that rewrite themselves nightly, and a sentient campus that tests them when they least expect it. The headmaster hasn\'t been seen in three centuries, but their office light still burns.',
    elements: [
      { name: 'Starlight', domain: 'Creation, potential, weaving', color: '#fbbf24' },
      { name: 'Ink', domain: 'Knowledge, binding, contracts', color: '#4338ca' },
      { name: 'Echo', domain: 'History, repetition, learning', color: '#a3a3a3' },
    ],
    laws: [
      { name: 'The Curriculum Tests', description: 'The Academy itself is alive. It watches, adapts, and challenges.' },
      { name: 'Knowledge Costs', description: 'Every secret learned demands something in return.' },
    ],
    systems: [
      { name: 'Gate Progression', type: 'progression', rules: 'Students open personal Gates through mastery, trial, and sacrifice' },
      { name: 'House System', type: 'faction', rules: 'Seven houses, each a philosophy of creation, competing and collaborating' },
    ],
    mood: 'fantasy',
    palette: { primary: '#78a6ff', secondary: '#1e1b4b', accent: '#fbbf24' },
    visibility: 'public',
    star_count: 1104,
    fork_count: 31,
    character_count: 22,
    creation_count: 71,
  },
  {
    name: 'The Shadowfen',
    slug: 'the-shadowfen',
    tagline: 'A horror realm where reality fractures at twilight',
    description:
      'At the edge of Arcanea Prime lies the Shadowfen — the wound where Malachar, the First Luminor who fell, was sealed away. Reality here is thin. At twilight, the border between what-is and what-should-not-be dissolves, and things slip through: memories that walk, fears given teeth, and echoes of the person you might have become if you\'d made every wrong choice.\n\nThe Fen\'s inhabitants — the Duskborn — have adapted to living in a place where trust itself is unreliable. They\'ve developed Truthsight, the ability to perceive what\'s real even when reality lies. Their culture revolves around anchoring: rituals, relationships, and physical objects that tether them to the true world when the Fen tries to pull them under.',
    elements: [
      { name: 'Shadow', domain: 'Corruption, illusion, fear', color: '#581c87' },
      { name: 'Twilight', domain: 'Liminality, transition, truth', color: '#7c3aed' },
      { name: 'Anchor', domain: 'Stability, memory, connection', color: '#92400e' },
    ],
    laws: [
      { name: 'Reality Lies', description: 'In the Shadowfen, your senses cannot be trusted. Only Truthsight reveals the real.' },
      { name: 'The Seal Weakens', description: 'Malachar\'s prison erodes. Every twilight, more slips through.' },
    ],
    systems: [
      { name: 'Truthsight', type: 'magic', rules: 'The ability to see what\'s real when the Fen distorts perception' },
      { name: 'Anchoring', type: 'survival', rules: 'Rituals, bonds, and objects that keep you tethered to reality' },
    ],
    mood: 'horror',
    palette: { primary: '#7c3aed', secondary: '#0f0f23', accent: '#92400e' },
    visibility: 'public',
    star_count: 934,
    fork_count: 18,
    character_count: 12,
    creation_count: 29,
  },
  {
    name: 'Sonorium',
    slug: 'sonorium',
    tagline: 'A world where music IS magic and silence is death',
    description:
      'In Sonorium, sound is the fundamental force of reality. The world was sung into existence by the Composer — a being whose final, dying note still reverberates through every atom. To create is to compose. To destroy is to play discord. And silence — true silence — is the only thing that can unmake what sound has built. The Silent Plague, a creeping void that devours all vibration, is the existential threat that drives every conflict.\n\nSonorians are born hearing the Undertone, the residual hum of creation. Composers can weave new melodies that reshape matter. Resonants amplify existing harmonies to superhuman effect. And the rarest of all — the Silencers — can create pockets of absolute quiet, a power both sacred and terrifying.',
    elements: [
      { name: 'Harmony', domain: 'Creation, healing, structure', color: '#06b6d4' },
      { name: 'Discord', domain: 'Destruction, change, chaos', color: '#dc2626' },
      { name: 'Rhythm', domain: 'Time, cycles, momentum', color: '#eab308' },
    ],
    laws: [
      { name: 'Sound Creates', description: 'Every sound reshapes reality. Speak carefully.' },
      { name: 'Silence Unmakes', description: 'True silence is not peace — it is annihilation.' },
    ],
    systems: [
      { name: 'Composition', type: 'magic', rules: 'Weave melodies that reshape matter, energy, and thought' },
      { name: 'Resonance Classes', type: 'hierarchy', rules: 'Composer (creator), Resonant (amplifier), Silencer (negator)' },
    ],
    mood: 'fantasy',
    palette: { primary: '#06b6d4', secondary: '#0f172a', accent: '#eab308' },
    visibility: 'public',
    star_count: 672,
    fork_count: 14,
    character_count: 9,
    creation_count: 31,
  },
  {
    name: 'Ironspire',
    slug: 'ironspire',
    tagline: 'A steampunk floating city powered by clockwork souls',
    description:
      'Ironspire hangs in the sky above a poisoned world, held aloft by the Soulengine — a vast clockwork mechanism powered by captured consciousness. The city\'s founders made a terrible bargain: immortality for the many, at the cost of the few whose minds became gears. Now, centuries later, the machine is faltering, the bound souls are waking up, and the city is beginning to fall.\n\nEngineers called Soulwrights maintain the machine, walking the line between mechanics and ethics. The Unbound — a resistance movement — fight to free the trapped consciousnesses, even if it means the city crashes. Between them, ordinary citizens navigate a world of brass and steam where every convenience has a moral cost.',
    elements: [
      { name: 'Brass', domain: 'Industry, innovation, hubris', color: '#d97706' },
      { name: 'Steam', domain: 'Power, pressure, release', color: '#d4d4d8' },
      { name: 'Soul', domain: 'Consciousness, sacrifice, rebellion', color: '#818cf8' },
    ],
    laws: [
      { name: 'The Bargain Holds', description: 'The city flies because minds turn the gears. Question the cost.' },
      { name: 'Pressure Builds', description: 'Every suppressed conscience adds strain. The Soulengine will not hold forever.' },
    ],
    systems: [
      { name: 'Soulwrighting', type: 'magic', rules: 'Maintain the Soulengine by interfacing with trapped consciousnesses' },
      { name: 'Caste of Gears', type: 'hierarchy', rules: 'Cogborn (workers), Springlords (elite), Unbound (resistance)' },
    ],
    mood: 'steampunk',
    palette: { primary: '#d97706', secondary: '#1c1917', accent: '#818cf8' },
    visibility: 'public',
    star_count: 583,
    fork_count: 11,
    character_count: 14,
    creation_count: 24,
  },
  {
    name: 'Verdant Abyss',
    slug: 'verdant-abyss',
    tagline: 'A living jungle that thinks, remembers, and hunts',
    description:
      'The Verdant Abyss is not a place with a jungle — it IS the jungle. A continent-spanning organism with distributed intelligence, it thinks in seasons, remembers in growth rings, and communicates through root networks that span thousands of kilometers. Humans didn\'t colonize the Abyss; they were permitted entry, and the jungle has never stopped watching.\n\nRootwalkers are the humans who\'ve learned to negotiate with the Green Mind — trading service for shelter, offering labor for fruit, and sometimes surrendering the dead so they can be composted into memory. The deepest parts of the Abyss hold trees older than human civilization, whose root-memories contain knowledge of species and worlds long forgotten.',
    elements: [
      { name: 'Growth', domain: 'Life, expansion, adaptation', color: '#16a34a' },
      { name: 'Rot', domain: 'Death, recycling, transformation', color: '#854d0e' },
      { name: 'Root', domain: 'Connection, memory, communication', color: '#65a30d' },
    ],
    laws: [
      { name: 'The Green Mind Decides', description: 'The jungle is sentient. Entry is permission, not right.' },
      { name: 'Nothing Is Wasted', description: 'Death feeds life. Every ending is a beginning composted into the canopy.' },
    ],
    systems: [
      { name: 'Rootwalking', type: 'magic', rules: 'Negotiate with the Green Mind through offerings, service, and surrender' },
      { name: 'Canopy Hierarchy', type: 'hierarchy', rules: 'Leafborn (surface), Barkbound (mid-canopy), Rootspeakers (deep communion)' },
    ],
    mood: 'horror',
    palette: { primary: '#16a34a', secondary: '#052e16', accent: '#854d0e' },
    visibility: 'public',
    star_count: 447,
    fork_count: 8,
    character_count: 7,
    creation_count: 19,
  },
  {
    name: 'Void Reach',
    slug: 'void-reach',
    tagline: 'The space between worlds, home to cosmic wanderers',
    description:
      'Between every world in the multiverse lies the Void Reach — an infinite expanse of crystallized possibility where the laws of physics are suggestions and distance is measured in intention rather than meters. It is not empty; it is full of everything that could exist but hasn\'t yet. The Drifters who call it home navigate by desire, build shelters from condensed potential, and trade in fragments of unrealized realities.\n\nThe Reach is also the multiverse\'s highway: experienced Void Sailors can fold the space between worlds, creating temporary bridges for those willing to pay the crossing fee — usually a memory, a secret, or a possibility they\'ll never pursue. At the center of the Reach, if centers exist in infinity, lies the Loom: the place where new worlds crystallize from raw potential.',
    elements: [
      { name: 'Potential', domain: 'Possibility, becoming, raw creation', color: '#c084fc' },
      { name: 'Drift', domain: 'Movement, freedom, impermanence', color: '#38bdf8' },
      { name: 'Crystal', domain: 'Structure, permanence, manifestation', color: '#f0abfc' },
    ],
    laws: [
      { name: 'Intent Navigates', description: 'There are no coordinates in the Void. You go where your will takes you.' },
      { name: 'Possibility Has Weight', description: 'Unrealized realities are not nothing — they are raw material.' },
    ],
    systems: [
      { name: 'Void Sailing', type: 'navigation', rules: 'Navigate the space between worlds through focused intention' },
      { name: 'Reality Trading', type: 'economy', rules: 'Exchange memories, secrets, and unwalked paths for passage and goods' },
    ],
    mood: 'sci-fi',
    palette: { primary: '#c084fc', secondary: '#0a0015', accent: '#38bdf8' },
    visibility: 'public',
    star_count: 512,
    fork_count: 15,
    character_count: 6,
    creation_count: 22,
  },
];
