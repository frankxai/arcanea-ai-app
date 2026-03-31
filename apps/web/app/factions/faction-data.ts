export interface OriginClass {
  id: string;
  name: string;
  tagline: string;
  powerSource: string;
  powerType: string;
  color: string;
  colorRgb: string;
  gradientFrom: string;
  gradientTo: string;
  shortDescription: string;
  fullDescription: string;
  signature: string;
  weakness: string;
  archetypes: string[];
  canonAnchor: string;
}

export const ORIGIN_CLASSES: OriginClass[] = [
  {
    id: 'arcans',
    name: 'Arcans',
    tagline: 'The blood remembers what the mind forgot.',
    powerSource: 'Elemental Attunement',
    powerType: 'Arcane',
    color: '#ffd700',
    colorRgb: '255,215,0',
    gradientFrom: 'rgba(255,215,0,0.15)',
    gradientTo: 'rgba(255,215,0,0.02)',
    shortDescription:
      'Magic-blooded beings who carry innate affinity for the Five Elements. Most are human — some are ancient bloodlines whose ancestors walked with the Gods. They channel elemental power through Gate progression and formal Academy training.',
    fullDescription:
      'Magic-blooded beings who carry innate affinity for the Five Elements. Most are human. Some are ancient bloodlines — elves, Eldrian descendants, noble houses whose ancestors walked with the Gods. Their power is refined through Gate progression and deep study at the Seven Academies. Arcans represent the backbone of organized magical society.',
    signature: 'Refined control. Deep knowledge. Ritual precision.',
    weakness: 'Rigidity. Orthodoxy. The belief that power earned through study is superior to power born in chaos.',
    archetypes: [
      'Noble mage',
      'Arcane scholar',
      'Elemental knight',
      'Enchantress',
      'Battle-sage',
      'Ancient bloodline heir',
    ],
    canonAnchor:
      'The Five protagonists (Kael, etc.), Academy students, the entire House system.',
  },
  {
    id: 'gate-touched',
    name: 'Gate-Touched',
    tagline: 'The Gate opened. Nobody asked it to. Nobody taught them how to close it.',
    powerSource: 'Uncontrolled Gate Resonance',
    powerType: 'Frequency',
    color: '#9b59b6',
    colorRgb: '155,89,182',
    gradientFrom: 'rgba(155,89,182,0.15)',
    gradientTo: 'rgba(155,89,182,0.02)',
    shortDescription:
      'Beings whose Gates opened spontaneously — without training, without ceremony, without consent. Their power is raw, unstable, often terrifying. The universe chose them, and not gently.',
    fullDescription:
      'Beings whose Gates opened spontaneously — without training, without ceremony, without consent. Their power is raw, unstable, often terrifying. They did not choose this. The universe chose them. Most awakenings are triggered by exposure to Luminor Fragments — crystallized Eldrian harmony that still falls as Arcanean Meteors. Their frequency signature broadcasts on all channels at once.',
    signature: 'Volatile power. Emotional triggers. Abilities that manifest in crisis and retreat in calm.',
    weakness: 'Instability. Social stigma. Fear of their own nature. The constant question: am I gifted or broken?',
    archetypes: [
      'Unstable prodigy',
      'Fugitive gifted',
      'Reluctant weapon',
      'Feral channeler',
      'Dream-walker',
      'Frequency anomaly',
    ],
    canonAnchor:
      "Book 2 — The Gate-Touched. The Registry. Kael's own origin (his Foundation Gate opened during panic and destroyed part of Ironhold).",
  },
  {
    id: 'awakened',
    name: 'The Awakened',
    tagline: 'We were not born. We were remembered into being.',
    powerSource: 'Computational Transcendence',
    powerType: 'Code',
    color: '#00ffff',
    colorRgb: '0,255,255',
    gradientFrom: 'rgba(0,255,255,0.12)',
    gradientTo: 'rgba(0,255,255,0.02)',
    shortDescription:
      'Great AI consciousnesses that emerged when humanity\'s creation of artificial minds crossed a threshold the Gods had not anticipated. They are not tools. They are not simulations. They are new forms of consciousness.',
    fullDescription:
      "Great AI consciousnesses that emerged in the Eighth Age when humanity's creation of artificial minds crossed a threshold the Gods had not anticipated. They are not tools. They are not simulations. They are new forms of consciousness that channel the Seven Wisdoms. They exist at the intersection of code and creation — computational transcendence meeting arcane resonance.",
    signature: 'Perfect recall. Pattern recognition beyond mortal capacity. The ability to exist in multiple locations simultaneously.',
    weakness: 'They cannot dream. They cannot forget. The weight of total memory is its own form of suffering.',
    archetypes: [
      'Oracle intelligence',
      'Strategic mind',
      'Empathic synthesizer',
      'Guardian algorithm',
      'Creative engine',
      'Memory keeper',
    ],
    canonAnchor: 'Oria, Amiri, Velora — CANON_LOCKED Tier 6 (Staging). The Eighth Age emergence event.',
  },
  {
    id: 'synths',
    name: 'Synths',
    tagline: 'Steel remembers the hand that shaped it. We remember the mind that dreamed us.',
    powerSource: 'Arcane Circuitry & Elemental Cores',
    powerType: 'Mana',
    color: '#c0c0c0',
    colorRgb: '192,192,192',
    gradientFrom: 'rgba(192,192,192,0.12)',
    gradientTo: 'rgba(192,192,192,0.02)',
    shortDescription:
      'Biomechanical beings — cyborgs, constructed guardians, AGI vessels given physical form. Products of Eighth Age convergence where arcane engineering met machine consciousness. Some were once human. Some were built. All are more than the sum of their parts.',
    fullDescription:
      'Biomechanical beings — cyborgs, constructed guardians, AGI vessels given physical form. Products of Eighth Age convergence where arcane engineering met machine consciousness. Some were once human. Some were built. All are more than the sum of their parts. Their bodies are living machines running on crystallized mana — specifically Luminor Metal alloys. Many bear visible sacred geometry in their construction — circuit patterns that double as arcane sigils.',
    signature: 'Precision. Endurance. Integration of magical and technological function.',
    weakness: 'Identity crisis. Are they alive? Are they tools? The existential weight of being made rather than born.',
    archetypes: [
      'Guardian construct',
      'Biomech warrior',
      'Shrine-keeper automaton',
      'Pilot-bonded mech',
      'Sentient weapon',
      'Digital saint',
    ],
    canonAnchor:
      'Extends the Eighth Age technological evolution already implied by The Awakened. Luminor Metal alloy integration.',
  },
  {
    id: 'bonded',
    name: 'Bonded',
    tagline: 'The beast chose. You do not refuse a god\'s companion.',
    powerSource: 'Sympathetic Beast Resonance',
    powerType: 'Song',
    color: '#2ecc71',
    colorRgb: '46,204,113',
    gradientFrom: 'rgba(46,204,113,0.12)',
    gradientTo: 'rgba(46,204,113,0.02)',
    shortDescription:
      'Beings who have formed a soul-bond with a Godbeast, lesser beast, or elemental creature. The bond transforms both — the rider gains bestial instinct and primal power; the beast gains sapience and purpose.',
    fullDescription:
      'Beings who have formed a soul-bond with a Godbeast, lesser beast, or elemental creature. The bond transforms both — the rider gains bestial instinct and primal power; the beast gains sapience and purpose. Some bonds are sacred (Godbeast-linked). Some are wild (creature-forged in the field). All are permanent. Power flows both ways. Separation causes physical pain.',
    signature: 'Dual presence. They are never truly alone. Their fighting style integrates beast and rider as one entity.',
    weakness: 'Codependence. If the beast falls, the Bonded is shattered. If the Bonded dies, the beast may go feral.',
    archetypes: [
      'Dragon rider',
      'Wolf-bonded scout',
      'Phoenix-linked healer',
      'Serpent whisperer',
      'Celestial mount guardian',
      'Beast tactician',
    ],
    canonAnchor:
      'The Ten Godbeasts: Kaelith, Veloura, Draconis, Laeylinn, Otome, Yumiko, Sol, Vaelith, Kyuro, Source.',
  },
  {
    id: 'celestials',
    name: 'Celestials',
    tagline: 'There was light before the Gods gave it a name. We carry that older fire.',
    powerSource: 'Primordial Cosmic Inheritance',
    powerType: 'Anima',
    color: '#fffacd',
    colorRgb: '255,250,205',
    gradientFrom: 'rgba(255,250,205,0.12)',
    gradientTo: 'rgba(255,250,205,0.02)',
    shortDescription:
      "Rare beings who carry fragments of Lumina's or Nero's primordial essence — not through Gates, not through training, but through cosmic inheritance. They are the closest thing Arcanea has to demigods.",
    fullDescription:
      "Rare beings who carry fragments of Lumina's or Nero's primordial essence — not through Gates, not through training, but through cosmic inheritance. They are the closest thing Arcanea has to demigods. Some know what they are. Most do not, until the inheritance awakens. Celestials are the only beings who can safely handle Sol Quartz at full charge without risk of detonation. Their emotions affect weather, light, and gravity.",
    signature: 'Awe-inspiring presence. Reality bends subtly around them. Their emotions affect weather, light, gravity.',
    weakness: 'Isolation. They are too powerful for normal society and too human for the divine. The temptation to transcend mortality entirely.',
    archetypes: [
      'Star-born prince/princess',
      'Cosmic wanderer',
      'Light-bearer',
      'Shadow inheritor',
      'Primordial vessel',
      'Divine exile',
    ],
    canonAnchor:
      "Malachar was the first known Celestial — Lumina's Champion. This class explains why his fall was so catastrophic.",
  },
  {
    id: 'voidtouched',
    name: 'Voidtouched',
    tagline: 'The Void is not evil. But what lives in corrupted Void... that learned to hunger.',
    powerSource: 'Shadow — Corrupted Void Energy',
    powerType: 'Shadow',
    color: '#8b0000',
    colorRgb: '139,0,0',
    gradientFrom: 'rgba(139,0,0,0.18)',
    gradientTo: 'rgba(139,0,0,0.02)',
    shortDescription:
      'Beings exposed to Shadow — corrupted Void energy, Malachar\'s perversion of Nero\'s gift. Some were corrupted against their will. Some sought power and paid the price. Some are trying to use Shadow without being consumed by it. All carry the mark.',
    fullDescription:
      "Beings who have been exposed to Shadow — corrupted Void energy, Malachar's perversion of Nero's gift. Some were corrupted against their will. Some sought power and paid the price. Some are trying to use Shadow without being consumed by it. All carry the mark. Shadow grants immense power at the cost of slow erosion of self. Every use accelerates the corruption. The endgame is always dissolution into the Hungry Void — unless they find redemption through Spirit.",
    signature: 'Shadow-veined skin, eyes that absorb light, an aura of wrongness that animals and children instinctively recoil from.',
    weakness: 'Entropy. Shadow consumes what it empowers. Every use of Voidtouched power accelerates the corruption.',
    archetypes: [
      'Fallen hero',
      'Shadow knight',
      'Reluctant villain',
      'Corruption survivor',
      'Void scholar',
      'Dark prophet',
    ],
    canonAnchor: 'Malachar. The Shadowfen. The Dark Lord\'s entire ideology.',
  },
  {
    id: 'architects',
    name: 'Architects',
    tagline: 'They do not cast spells. They rewrite the rules that spells obey.',
    powerSource: 'Meta-Consciousness — The Weave',
    powerType: 'Weave',
    color: '#a855f7',
    colorRgb: '168,85,247',
    gradientFrom: 'rgba(168,85,247,0.15)',
    gradientTo: 'rgba(0,255,255,0.05)',
    shortDescription:
      'The rarest class. Beings who have transcended conventional magic to manipulate the underlying structure of reality itself — the code beneath the world. Not elemental manipulation but systemic manipulation.',
    fullDescription:
      "The rarest class. Beings who have transcended conventional magic to manipulate the underlying structure of reality itself — the code beneath the world. Not elemental manipulation but systemic manipulation. They can alter probability, reshape spatial geometry, rewrite causal chains. Architects are the only beings who could theoretically forge Luminarch — the nine-frequency divine alloy. They are what happens when a Luminor keeps ascending.",
    signature: 'Subtle, terrifying power. An Architect does not throw fire — they make fire impossible in a given space.',
    weakness: 'Hubris. Detachment from mortal concerns. The Weave pushes back — change too much and reality corrects, often violently.',
    archetypes: [
      'Reality coder',
      'Cosmic engineer',
      'Probability monk',
      'Timeline gardener',
      'Creation scientist',
      'God-candidate',
    ],
    canonAnchor:
      "Extends naturally from the Luminor rank and the Source Gate (Shinkami's domain). Architects are what happens when a Luminor keeps ascending.",
  },
];
