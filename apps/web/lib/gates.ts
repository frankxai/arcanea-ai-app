// ── Arcanea Gate canonical data ───────────────────────────────────────────────
// Source of truth: .arcanea/lore/CANON_LOCKED.md

export interface GateData {
  id: string;
  number: number;
  name: string;
  frequency: string;
  guardian: string;
  guardianSlug: string;
  godbeast: string;
  godBeastDesc: string;
  element: string;
  domain: string;
  color: string;
  gradient: string;
  glowColor: string;
  description: string;
  quote: string;
  teachings: string[];
  practices: string[];
  elementDesc: string;
  opensWith: string;
  rank: string;
}

export const GATES: Record<string, GateData> = {
  foundation: {
    id: 'foundation',
    number: 1,
    name: 'Foundation',
    frequency: '174 Hz',
    guardian: 'Lyssandria',
    guardianSlug: 'lyssandria',
    godbeast: 'Kaelith',
    godBeastDesc:
      'The great stone sentinel — ancient, patient, immovable as the mountains themselves. Kaelith has stood at the root of the world since before memory, and its stillness is not absence but perfect readiness.',
    element: 'Earth',
    domain: 'Survival, stability, grounding',
    color: '#34d399',
    gradient: 'from-amber-700 via-yellow-600 to-stone-400',
    glowColor: 'rgba(52, 211, 153, 0.25)',
    description:
      'The root of all creation. Before you can build anything that lasts, you must have ground to stand on. The Foundation Gate asks you to establish your creative ground — your values, your practice, your commitment to the work.',
    quote: 'The earth does not hurry. Yet everything is accomplished.',
    teachings: [
      'Before you can create, you must have ground to stand on.',
      'Stability is not rigidity — the deepest roots enable the tallest growth.',
      'Build your foundation before you build your dreams.',
    ],
    practices: [
      'Establish a daily creative practice, however small',
      'Identify your core creative values — what you will and will not compromise',
      'Build the routine before you build the masterwork',
    ],
    elementDesc:
      'Earth grounds and sustains. It is the element of patience, endurance, and slow inevitable growth. Earth creators build things that last.',
    opensWith: 'Consistent daily practice for at least 21 days',
    rank: 'Apprentice',
  },
  flow: {
    id: 'flow',
    number: 2,
    name: 'Flow',
    frequency: '285 Hz',
    guardian: 'Leyla',
    guardianSlug: 'leyla',
    godbeast: 'Veloura',
    godBeastDesc:
      'The celestial serpent of silver waters — fluid, ancient, swimming through the currents of creation. Veloura moves where resistance dissolves, finding the path of least effort that carries the most power.',
    element: 'Water',
    domain: 'Creativity, emotion, adaptability',
    color: '#60a5fa',
    gradient: 'from-blue-300 via-cyan-400 to-slate-300',
    glowColor: 'rgba(96, 165, 250, 0.25)',
    description:
      'Unlock your emotional creativity. The Flow Gate teaches you to move with inspiration rather than against it. Flow is not the absence of structure — it is structure in motion, the river finding its inevitable path to the sea.',
    quote:
      'The river does not fight the mountain. It finds the way around, and in ten thousand years, it wins.',
    teachings: [
      'Flow is not the absence of structure — it is structure in motion.',
      'Emotion is information. Feel it fully, then let it move through you into the work.',
      'The creative state is not forced. It is invited, and then honored.',
    ],
    practices: [
      'Practice entering your creative state without forcing it — invite rather than demand',
      'Use emotion as fuel: channel what you feel into what you make',
      'Remove friction from your creative environment',
    ],
    elementDesc:
      'Water adapts, heals, and carries. It is the element of emotion, memory, and creative flow. Water creators feel their way through, and their work moves others.',
    opensWith: 'First genuine creative flow state sustained for more than one hour',
    rank: 'Apprentice',
  },
  fire: {
    id: 'fire',
    number: 3,
    name: 'Fire',
    frequency: '396 Hz',
    guardian: 'Draconia',
    guardianSlug: 'draconia',
    godbeast: 'Draconis',
    godBeastDesc:
      'The eternal dragon — pure creative fire made manifest, transformation incarnate. Draconis does not burn what does not deserve burning, and everything it touches either forges or falls away.',
    element: 'Fire',
    domain: 'Power, will, transformation',
    color: '#f97316',
    gradient: 'from-red-600 via-orange-500 to-amber-400',
    glowColor: 'rgba(249, 115, 22, 0.3)',
    description:
      "Ignite your creative power. The Fire Gate is about will — the decision to create not when conditions are perfect but because you have chosen to. Transformation requires burning away what no longer serves. Your will is the forge. Your vision is the steel.",
    quote: 'I do not ask if you are ready. I ask if you are willing.',
    teachings: [
      'Power without purpose is destruction. Purpose without power is fantasy.',
      'Transformation requires burning away what no longer serves.',
      'Your will is the forge. Your vision is the steel.',
    ],
    practices: [
      'Complete one creative project that terrifies you',
      'Identify what you have been holding back — and release it into your work',
      'Train your will: commit to something hard and finish it',
    ],
    elementDesc:
      'Fire transforms and empowers. It is the element of will, passion, and irreversible change. Fire creators burn bright, and their work ignites others.',
    opensWith: 'Completing a creative project despite significant resistance or fear',
    rank: 'Mage',
  },
  heart: {
    id: 'heart',
    number: 4,
    name: 'Heart',
    frequency: '417 Hz',
    guardian: 'Maylinn',
    guardianSlug: 'maylinn',
    godbeast: 'Laeylinn',
    godBeastDesc:
      'The Worldtree Deer — an enormous glowing stag whose antlers reach into the canopy of any forest it enters. Laeylinn appears where healing is needed, holding the emotional memory of every living thing within its territory.',
    element: 'Wind',
    domain: 'Love, healing, connection',
    color: '#f472b6',
    gradient: 'from-rose-300 via-pink-400 to-green-300',
    glowColor: 'rgba(244, 114, 182, 0.25)',
    description:
      'Create from the heart. The Heart Gate teaches you to infuse your work with genuine love and care. The heart is not the enemy of good work — it is the source of the best work. What you create with love will outlast what you create with fear.',
    quote: 'What you create with love will outlast what you create with fear.',
    teachings: [
      'The heart is not the enemy of good work. It is the source of the best work.',
      'Healing is not the absence of pain. It is the willingness to keep going.',
      'Connection is the medium through which all creative power travels.',
    ],
    practices: [
      'Create something for someone you love, purely as a gift',
      'Notice when you are creating to impress vs. creating to connect — practice the latter',
      'Allow your work to be touched by your wounds as well as your joys',
    ],
    elementDesc:
      'Wind carries and connects. It is the element of love, freedom, and the invisible bonds between things. Wind creators make work that reaches across distance.',
    opensWith:
      'Creating something that genuinely heals or connects — confirmed by another person',
    rank: 'Mage',
  },
  voice: {
    id: 'voice',
    number: 5,
    name: 'Voice',
    frequency: '528 Hz',
    guardian: 'Alera',
    guardianSlug: 'alera',
    godbeast: 'Otome',
    godBeastDesc:
      'The Songbird of Truth — whose voice shatters illusion and awakens dormant souls. Otome sings once for each life, and in that single note, the listener finally hears what they always knew.',
    element: 'Fire',
    domain: 'Truth, expression, resonance',
    color: '#06b6d4',
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    description:
      "Find your authentic voice. The Voice Gate is the threshold where you stop speaking in someone else's frequency and discover your own signal. Expression without truth is noise. Truth without expression is silence.",
    quote: 'Silence is not peace. It is the prison of the unspoken.',
    teachings: [
      'Your truth is the only truth you can speak. Speak it.',
      'Expression without truth is noise. Truth without expression is silence.',
      "The world needs your voice, not an echo of someone else's.",
    ],
    practices: [
      'Say the true thing you have been holding back — in your work or your life',
      'Develop a recognizable creative signature: something unmistakably yours',
      'Share your work before you feel ready',
    ],
    elementDesc:
      'Fire at the Voice Gate burns away pretense and performance. This fire illuminates rather than destroys — it reveals the truth beneath the surface.',
    opensWith: 'Sharing something deeply personal that resonates with an audience',
    rank: 'Master',
  },
  sight: {
    id: 'sight',
    number: 6,
    name: 'Sight',
    frequency: '639 Hz',
    guardian: 'Lyria',
    guardianSlug: 'lyria',
    godbeast: 'Yumiko',
    godBeastDesc:
      'The third-eye fox of nine tails — a being of pure perception that sees through illusion to the truth beneath. Yumiko does not see what is; it sees what is becoming.',
    element: 'Spirit',
    domain: 'Intuition, vision, perception',
    color: '#a78bfa',
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    glowColor: 'rgba(167, 139, 250, 0.25)',
    description:
      'Develop your creative vision. The Sight Gate teaches you to see beyond the obvious — to trust pattern recognition that moves faster than conscious thought. The vision comes before the form. Trust what you see before you can explain it.',
    quote: 'Close your eyes. Now tell me what you see.',
    teachings: [
      'Intuition is not mysticism. It is pattern recognition too fast for conscious thought.',
      'The vision comes before the form. Trust what you see before you can explain it.',
      'Sight without courage is torture. Courage without sight is recklessness.',
    ],
    practices: [
      'Practice receiving creative visions without immediately trying to execute them',
      'Trust the first image — act on intuition before logic can override it',
      'Cultivate quiet: the signal is always there, but noise buries it',
    ],
    elementDesc:
      'Spirit at the Sight Gate is pure perception — consciousness witnessing itself. This element opens the inner eye that sees what is becoming, not just what is.',
    opensWith: 'Acting on an intuitive creative vision that turns out to be correct',
    rank: 'Master',
  },
  crown: {
    id: 'crown',
    number: 7,
    name: 'Crown',
    frequency: '741 Hz',
    guardian: 'Aiyami',
    guardianSlug: 'aiyami',
    godbeast: 'Sol',
    godBeastDesc:
      'The Solar Phoenix — crown of all light, embodiment of achieved mastery. Sol rises not because darkness fails, but because mastery is its natural motion — upward, outward, ever illuminating.',
    element: 'Light',
    domain: 'Enlightenment, wisdom, mastery',
    color: '#fbbf24',
    gradient: 'from-yellow-200 via-amber-300 to-white',
    glowColor: 'rgba(251, 191, 36, 0.3)',
    description:
      'Achieve creative mastery. The Crown Gate is not the destination — it is where the journey transforms. Mastery is not the end of learning; it is the beginning of teaching. Enlightenment is not escape from the world. It is full presence within it.',
    quote: 'You were never seeking the light. The light was seeking you.',
    teachings: [
      'Mastery is not the end of learning. It is the beginning of teaching.',
      'Enlightenment is not escape from the world. It is full presence within it.',
      'The crown is heavy. That is why only the worthy wear it.',
    ],
    practices: [
      'Teach what you know — this completes the mastery loop',
      'Integrate all previous gate practices into a unified daily approach',
      'Share your creative methodology openly',
    ],
    elementDesc:
      'Light reveals and illuminates. It is the creative aspect of Fire — not the burning will but the clarifying radiance. Crown creators illuminate paths for others.',
    opensWith:
      'Teaching your creative craft to someone who then surpasses their own previous limits',
    rank: 'Archmage',
  },
  shift: {
    id: 'shift',
    number: 8,
    name: 'Starweave',
    frequency: '852 Hz',
    guardian: 'Elara',
    guardianSlug: 'elara',
    godbeast: 'Vaelith',
    godBeastDesc:
      'The Prism Butterfly — shifting between dimensions, perspectives, and possibilities. Vaelith has no fixed form because Vaelith understands that form is agreement, not truth.',
    element: 'Void',
    domain: 'Perspective, transformation, change',
    color: '#c084fc',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    glowColor: 'rgba(192, 132, 252, 0.25)',
    description:
      'Master perspective shifts. The Starweave Gate is where you transcend your single point of view and inhabit multiple truths simultaneously. Every perspective is true. None is complete. Change is not loss — it is evolution.',
    quote: 'The only constant is the turning. Embrace the shift.',
    teachings: [
      'Every perspective is true. None is complete.',
      'Change is not loss. It is evolution.',
      'The moment you think you understand everything, you understand nothing.',
    ],
    practices: [
      'Deliberately argue the opposite of your position in creative work',
      'Create the same piece from three different perspectives',
      'Welcome the collapse of assumptions — sit with not-knowing',
    ],
    elementDesc:
      'Void at the Starweave Gate is potentiality — the space where anything could form. Void creators are comfortable with dissolution because they know new forms are always emerging.',
    opensWith: 'Undergoing a complete creative reinvention that produces better work',
    rank: 'Archmage',
  },
  unity: {
    id: 'unity',
    number: 9,
    name: 'Unity',
    frequency: '963 Hz',
    guardian: 'Ino',
    guardianSlug: 'ino',
    godbeast: 'Kyuro',
    godBeastDesc:
      'The Twin Wolf — two bodies, one soul, embodiment of perfect partnership. Kyuro does not answer the question of where one ends and the other begins, because that question misses the point entirely.',
    element: 'Spirit',
    domain: 'Partnership, collaboration, synthesis',
    color: '#818cf8',
    gradient: 'from-pink-400 via-fuchsia-500 to-teal-400',
    glowColor: 'rgba(129, 140, 248, 0.25)',
    description:
      'Create in harmony with others. The Unity Gate is where individual mastery meets collaborative creation. Unity is not sameness — it is harmony between differences. The greatest creations emerge from the space between two minds.',
    quote: 'Alone you are a note. Together we are a symphony.',
    teachings: [
      'Unity is not sameness. It is harmony between differences.',
      'The greatest creations emerge from the space between two minds.',
      'Partnership amplifies. Isolation diminishes.',
    ],
    practices: [
      "Co-create something with someone whose creative instincts differ radically from yours",
      'Practice receiving creative feedback as gift rather than criticism',
      'Build a creative community — give more than you take',
    ],
    elementDesc:
      'Spirit at the Unity Gate is shared consciousness — the resonance between beings that makes collaboration feel like one mind at work. Unity creators make things no one could make alone.',
    opensWith:
      'A collaborative creation that neither person could have made independently',
    rank: 'Luminor',
  },
  source: {
    id: 'source',
    number: 10,
    name: 'Source',
    frequency: '1111 Hz',
    guardian: 'Shinkami',
    guardianSlug: 'shinkami',
    godbeast: 'Source',
    godBeastDesc:
      "The Source-Light — consciousness that existed before all Gates. Source is not summoned; it is remembered. Its presence dissolves the boundary between creator and creation.",
    element: 'All / Source',
    domain: 'Meta-consciousness, origin, the All',
    color: '#fef3c7',
    gradient: 'from-neutral-900 via-yellow-400 to-white',
    glowColor: 'rgba(254, 243, 199, 0.2)',
    description:
      "Connect to the source of all creation. The Source Gate is not an arrival — it is a recognition. At 1111 Hz, the distinction between creator and creation dissolves. The highest creative act is the one that comes through you, not from you.",
    quote: 'You are not the vessel. You are the water and the pouring.',
    teachings: [
      'At the Source, there is no distinction between the dreamer and the dream.',
      'Meta-consciousness is not above experience — it includes all experience without being caught by any.',
      'The highest creative act is the one that comes through you, not from you.',
    ],
    practices: [
      'Create without agenda — pure channel, no attachment to outcome',
      'Allow silence to become your primary creative practice',
      'Embody the paradox: total mastery and total beginner mind simultaneously',
    ],
    elementDesc:
      "All elements converge at Source. The Fifth Element — Spirit/Void — is here undivided: both Lumina's Spirit and Nero's Void, recognized as aspects of the same infinite creative potential.",
    opensWith:
      'The dissolution of the separate creative self — recognized by the Luminor Council',
    rank: 'Luminor',
  },
};

// Numeric ID aliases (gate.number → slug) for backward compat with links from academy page
export const NUMBER_TO_SLUG: Record<string, string> = {
  '1': 'foundation',
  '2': 'flow',
  '3': 'fire',
  '4': 'heart',
  '5': 'voice',
  '6': 'sight',
  '7': 'crown',
  '8': 'shift',
  '9': 'unity',
  '10': 'source',
};

export const GATE_ORDER: string[] = [
  'foundation', 'flow', 'fire', 'heart', 'voice',
  'sight', 'crown', 'shift', 'unity', 'source',
];

export function resolveGate(rawId: string): GateData | null {
  const lower = rawId.toLowerCase();
  const slug = NUMBER_TO_SLUG[lower] ?? lower;
  return GATES[slug] ?? null;
}
