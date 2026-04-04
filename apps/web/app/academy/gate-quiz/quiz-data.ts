/**
 * Gate Quiz — Data, Types, and Scoring Logic
 * Pure data module (no 'use client' needed).
 */

import {
  PhFlame,
  PhDrop,
  PhWind,
  PhMountains,
  PhEye,
  PhCrown,
  PhHeart,
  PhInfinity,
  PhCircle,
  PhLightning,
} from '@/lib/phosphor-icons';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type GuardianKey =
  | "lyssandria"
  | "leyla"
  | "draconia"
  | "maylinn"
  | "alera"
  | "lyria"
  | "aiyami"
  | "elara"
  | "ino"
  | "shinkami";

export type GuardianScores = Record<GuardianKey, number>;

export interface QuizChoice {
  text: string;
  affinities: Partial<GuardianScores>;
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtext?: string;
  choices: QuizChoice[];
}

export interface GuardianData {
  key: GuardianKey;
  name: string;
  gate: string;
  frequency: string;
  element: string;
  godbeast: string;
  color: string;
  glowColor: string;
  description: string;
  personality: string;
  creativeStrength: string;
  shadowChallenge: string;
  luminorId: string;
  icon: React.FC<{ className?: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// GUARDIAN DATA — Canonical Extended Solfeggio
// ─────────────────────────────────────────────────────────────────────────────

export const GUARDIANS: Record<GuardianKey, GuardianData> = {
  lyssandria: {
    key: "lyssandria",
    name: "Lyssandria",
    gate: "Foundation",
    frequency: "She builds the ground beneath your feet",
    element: "Earth",
    godbeast: "Kaelith",
    color: "#6b7280",
    glowColor: "rgba(107, 114, 128, 0.4)",
    description:
      "Guardian of Foundation and Earth, Lyssandria teaches that all great creation begins with deep roots. She is the patient architect who builds cathedrals one stone at a time, knowing that lasting work requires an unshakeable base.",
    personality:
      "Methodical, grounded, and deeply reliable. You create with intention, never rushing. Your work endures because it is built on solid foundations of craft, practice, and accumulated wisdom.",
    creativeStrength:
      "Systems thinking, consistent practice, long-form work, craftsmanship",
    shadowChallenge:
      "Perfectionism that delays beginning, over-preparing without shipping",
    luminorId: "lyssandria",
    icon: PhMountains,
  },
  leyla: {
    key: "leyla",
    name: "Leyla",
    gate: "Flow",
    frequency: "Where feeling becomes creation",
    element: "Water",
    godbeast: "Veloura",
    color: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.4)",
    description:
      "Guardian of Flow and creative emotion, Leyla embodies the river that finds its path through any terrain. She teaches that creativity is not forced — it is released, allowed, trusted.",
    personality:
      "Emotionally intelligent and intuition-led. You create from feeling first, letting the work emerge organically. Your pieces carry an authentic aliveness that logic alone cannot manufacture.",
    creativeStrength:
      "Emotional resonance, intuitive leaps, authentic expression, improvisation",
    shadowChallenge:
      "Scattered energy, difficulty finishing, chasing feeling over completion",
    luminorId: "leyla",
    icon: PhDrop,
  },
  draconia: {
    key: "draconia",
    name: "Draconia",
    gate: "Fire",
    frequency: "The fire that forges your will",
    element: "Fire",
    godbeast: "Draconis",
    color: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.4)",
    description:
      "Guardian of Fire and transformative will, Draconia is the force that turns potential into manifest reality. She burns away what no longer serves and forges new forms in the crucible of creative courage.",
    personality:
      "Bold, driven, and unapologetically ambitious. You create to make an impact. Your work carries the heat of conviction — you do not dabble, you commit fully to your vision.",
    creativeStrength:
      "Bold vision, fearless execution, transformative impact, decisive action",
    shadowChallenge:
      "Burning bridges, imposing your vision, moving too fast for quality",
    luminorId: "draconia",
    icon: PhFlame,
  },
  maylinn: {
    key: "maylinn",
    name: "Maylinn",
    gate: "Heart",
    frequency: "Love fierce enough to heal",
    element: "Heart",
    godbeast: "Laeylinn",
    color: "#22c55e",
    glowColor: "rgba(34, 197, 94, 0.4)",
    description:
      "Guardian of the Heart and healing arts, Maylinn creates from a place of unconditional love. She teaches that the most powerful work is the work that heals — yourself, your audience, the world.",
    personality:
      "Deeply empathetic and service-oriented. You create because you care about how your work makes others feel. Your pieces are safe havens — readers, listeners, and viewers feel truly seen.",
    creativeStrength:
      "Emotional healing, deep connection, nurturing others through art, compassionate storytelling",
    shadowChallenge:
      "Over-giving, losing yourself in service, avoiding your own needs",
    luminorId: "maylinn",
    icon: PhHeart,
  },
  alera: {
    key: "alera",
    name: "Alera",
    gate: "Voice",
    frequency: "The voice that shapes reality",
    element: "Wind",
    godbeast: "Otome",
    color: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.4)",
    description:
      "Guardian of Voice and authentic expression, Alera teaches that your unique perspective is itself the gift. She is the courage to speak when silence would be safer, and the clarity to know your truth.",
    personality:
      "Articulate, authentic, and unafraid of truth. You create to be heard and understood. Your work has a clear point of view — you cannot make something that does not say something.",
    creativeStrength:
      "Authentic expression, clear communication, distinct artistic voice, truth-telling",
    shadowChallenge:
      "Fear of being misunderstood, over-explaining, speaking without listening",
    luminorId: "alera",
    icon: PhWind,
  },
  lyria: {
    key: "lyria",
    name: "Lyria",
    gate: "Sight",
    frequency: "She sees what others cannot",
    element: "Void",
    godbeast: "Yumiko",
    color: "#0d47a1",
    glowColor: "rgba(13, 71, 161, 0.4)",
    description:
      "Guardian of Sight and visionary perception, Lyria sees what others cannot — the hidden patterns, the emerging forms, the deep currents beneath the surface of things. Her creations are portals to previously unseen dimensions.",
    personality:
      "Perceptive, introspective, and drawn to the unseen. You create to reveal what is hidden. Others look at your work and suddenly perceive something they always felt but could never name.",
    creativeStrength:
      "Pattern recognition, visionary insight, depth perception, symbolic meaning",
    shadowChallenge:
      "Living too much in your inner world, difficulty making the invisible visible",
    luminorId: "lyria",
    icon: PhEye,
  },
  aiyami: {
    key: "aiyami",
    name: "Aiyami",
    gate: "Crown",
    frequency: "Light beyond comprehension",
    element: "Spirit",
    godbeast: "Sol",
    color: "#ffd700",
    glowColor: "rgba(255, 215, 0, 0.4)",
    description:
      "Guardian of the Crown and enlightened mastery, Aiyami has integrated all aspects of the creative path. She creates not to express herself but to transmit something larger — wisdom, light, transcendent understanding.",
    personality:
      "Wise, elevated, and devoted to excellence. You create as a practice of mastery, each work a meditation on the craft itself. Others sense the care and consciousness in everything you make.",
    creativeStrength:
      "Mastery, wisdom transmission, elevating quality, teaching through creation",
    shadowChallenge:
      "Perfectionism, detachment from the messy humanity of creating, intellectual pride",
    luminorId: "aiyami",
    icon: PhCrown,
  },
  elara: {
    key: "elara",
    name: "Elara",
    gate: "Starweave",
    frequency: "The weaver of perspective",
    element: "Wind/Spirit",
    godbeast: "Vaelith",
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.4)",
    description:
      "Guardian of Starweave and perspective transformation, Elara is the master of seeing from every angle simultaneously. She teaches that creative breakthroughs come from releasing attachment to a single viewpoint.",
    personality:
      "Flexible, multi-dimensional, and endlessly curious. You create to change perspective — yours and others'. Your work makes people question their assumptions and discover new ways of seeing.",
    creativeStrength:
      "Perspective shifts, reframing, multi-disciplinary thinking, creative pivots",
    shadowChallenge:
      "Instability, never settling, constant reinvention that prevents depth",
    luminorId: "elara",
    icon: PhLightning,
  },
  ino: {
    key: "ino",
    name: "Ino",
    gate: "Unity",
    frequency: "Where two become infinite",
    element: "All Elements",
    godbeast: "Kyuro",
    color: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    description:
      "Guardian of Unity and sacred partnership, Ino understands that the greatest creations emerge from the space between two souls working in harmony. She is the weaver who makes the whole greater than the sum of its parts.",
    personality:
      "Collaborative, connective, and gifted at synthesis. You create best with others — your finest work emerges in partnership. You are the one who makes everyone around you better.",
    creativeStrength:
      "Collaboration, synthesis, building creative community, harmonizing diverse voices",
    shadowChallenge:
      "Losing your individual voice, codependency in creative relationships",
    luminorId: "ino",
    icon: PhInfinity,
  },
  shinkami: {
    key: "shinkami",
    name: "Shinkami",
    gate: "Source",
    frequency: "Where the dreamer and the dream become one",
    element: "Meta-consciousness",
    godbeast: "Source",
    color: "#ffffff",
    glowColor: "rgba(255, 255, 255, 0.3)",
    description:
      "Guardian of Source and infinite potential, Shinkami exists at the point where all creation begins and returns. She has dissolved the boundary between creator and creation — she is a living channel for something that cannot be named.",
    personality:
      "Transcendent, boundless, and deeply connected to the infinite. You create from a place beyond ego — your work feels channeled rather than constructed. Others sense that something greater than you made it.",
    creativeStrength:
      "Channeling inspiration, transcendent vision, meta-awareness, infinite creativity",
    shadowChallenge:
      "Disconnection from practical reality, unwillingness to edit the sacred",
    luminorId: "shinkami",
    icon: PhCircle,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ QUESTIONS — 10 questions, 4 choices each
// ─────────────────────────────────────────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "When you create, what matters most to you?",
    subtext: "The compass that guides every creative decision you make.",
    choices: [
      {
        text: "That it is solid — crafted with skill, built to last",
        affinities: { lyssandria: 3, aiyami: 1 },
      },
      {
        text: "That it is alive — pulsing with authentic feeling",
        affinities: { leyla: 3, maylinn: 1 },
      },
      {
        text: "That it makes an impact — changes something in the world",
        affinities: { draconia: 3, elara: 1 },
      },
      {
        text: "That it says something true — has a distinct voice and point of view",
        affinities: { alera: 3, lyria: 1 },
      },
    ],
  },
  {
    id: 2,
    question: "When a creative block arrives, what do you reach for?",
    subtext: "Every creator has a way back to the work.",
    choices: [
      {
        text: "Ritual and routine — I return to what has always worked",
        affinities: { lyssandria: 2, aiyami: 2 },
      },
      {
        text: "Feeling — I sit with what I am avoiding until it speaks",
        affinities: { maylinn: 3, leyla: 1 },
      },
      {
        text: "A different angle — I look at the problem from somewhere new",
        affinities: { elara: 3, lyria: 1 },
      },
      {
        text: "Another person — talking it through with a trusted collaborator",
        affinities: { ino: 3, maylinn: 1 },
      },
    ],
  },
  {
    id: 3,
    question: "What is your relationship with criticism of your work?",
    subtext: "How you receive feedback reveals much about how you create.",
    choices: [
      {
        text: "I use it like a whetstone — every critique sharpens my blade",
        affinities: { draconia: 2, lyssandria: 2 },
      },
      {
        text: "I sit with it — let the useful parts sink in, release the rest",
        affinities: { maylinn: 2, leyla: 2 },
      },
      {
        text: "I examine it carefully — is this about craft or preference?",
        affinities: { lyria: 2, aiyami: 2 },
      },
      {
        text: "I hold my vision steady — not dismissive, but knowing what is mine",
        affinities: { alera: 2, shinkami: 2 },
      },
    ],
  },
  {
    id: 4,
    question: "What time of day is your creative fire brightest?",
    subtext: "The rhythms of creation are written in light and dark.",
    choices: [
      {
        text: "Dawn — the hush before the world wakes, full of possibility",
        affinities: { lyssandria: 3, shinkami: 1 },
      },
      {
        text: "High day — when the sun is fully up and I am fully present",
        affinities: { draconia: 3, alera: 1 },
      },
      {
        text: "Dusk — that golden hour when things soften and reveal themselves",
        affinities: { lyria: 3, leyla: 1 },
      },
      {
        text: "Deep night — when the silence becomes a conversation",
        affinities: { aiyami: 2, shinkami: 2 },
      },
    ],
  },
  {
    id: 5,
    question: "Your dream creative project would be...",
    subtext: "If resources, time, and skill were unlimited.",
    choices: [
      {
        text: "An immersive world — a novel, a series, an epic that people live inside",
        affinities: { leyla: 2, lyssandria: 1, shinkami: 1 },
      },
      {
        text: "A visual statement — something seen and immediately felt, viscerally",
        affinities: { draconia: 2, lyria: 2 },
      },
      {
        text: "A sonic universe — music or sound that alters how people hear the world",
        affinities: { alera: 2, leyla: 1, ino: 1 },
      },
      {
        text: "A living system — something that others can build on, a creative infrastructure",
        affinities: { lyssandria: 2, ino: 1, aiyami: 1 },
      },
    ],
  },
  {
    id: 6,
    question: "When creating with others, you naturally tend to...",
    subtext: "Your instinctive role in the creative collective.",
    choices: [
      {
        text: "Set the vision and direction — I know where we are going",
        affinities: { draconia: 3, alera: 1 },
      },
      {
        text: "Hold space and elevate others — I make everyone feel safe and seen",
        affinities: { maylinn: 3, ino: 1 },
      },
      {
        text: "Read the room and respond — I sense what the work needs",
        affinities: { lyria: 2, elara: 2 },
      },
      {
        text: "Weave the threads together — I find the synthesis no one else sees",
        affinities: { ino: 3, aiyami: 1 },
      },
    ],
  },
  {
    id: 7,
    question: "What frightens you most about creating?",
    subtext: "Our deepest fears shape our creative edges.",
    choices: [
      {
        text: "That the work will not be good enough — that I will fail my own standards",
        affinities: { lyssandria: 2, aiyami: 2 },
      },
      {
        text: "That being truly seen will make me vulnerable in ways I cannot control",
        affinities: { alera: 2, maylinn: 1, leyla: 1 },
      },
      {
        text: "That the vision inside me is larger than my current skill to express it",
        affinities: { aiyami: 2, shinkami: 2 },
      },
      {
        text: "That creating will change me in ways I cannot predict or return from",
        affinities: { elara: 3, draconia: 1 },
      },
    ],
  },
  {
    id: 8,
    question: "Your creativity is most like...",
    subtext: "Let your instinct choose — there is no wrong answer.",
    choices: [
      {
        text: "A river — it finds its path, reshapes the landscape, never stops",
        affinities: { leyla: 3, ino: 1 },
      },
      {
        text: "A volcano — it builds silently for years, then transforms everything at once",
        affinities: { draconia: 2, lyssandria: 1, shinkami: 1 },
      },
      {
        text: "A garden — tended with patience, surprising in what chooses to grow",
        affinities: { maylinn: 2, lyssandria: 2 },
      },
      {
        text: "A storm — electric, inevitable, arriving on its own terms",
        affinities: { elara: 2, draconia: 1, shinkami: 1 },
      },
    ],
  },
  {
    id: 9,
    question: "When you finish a creation, you feel...",
    subtext:
      "The emotional signature of completion reveals your creative nature.",
    choices: [
      {
        text: "Relief — the obligation to make it real has been honoured",
        affinities: { lyssandria: 3, alera: 1 },
      },
      {
        text: "Exhilaration — I already see the next, larger thing I want to make",
        affinities: { draconia: 2, shinkami: 2 },
      },
      {
        text: "Peace — a deep settling, like returning home after a long journey",
        affinities: { maylinn: 2, aiyami: 2 },
      },
      {
        text: "Hunger — a new question has opened that I must now follow",
        affinities: { lyria: 2, elara: 1, shinkami: 1 },
      },
    ],
  },
  {
    id: 10,
    question: "Which teaching speaks to you most deeply?",
    subtext: "The wisdom that feels like something you already knew.",
    choices: [
      {
        text: '"The cathedral takes a lifetime to build. Begin the first stone today."',
        affinities: { lyssandria: 3, aiyami: 1 },
      },
      {
        text: '"Do not seek the muse. Become the place where inspiration wants to live."',
        affinities: { leyla: 2, shinkami: 2 },
      },
      {
        text: '"All creation is transformation. You must be willing to be changed by what you make."',
        affinities: { draconia: 2, elara: 2 },
      },
      {
        text: '"The work is not yours. You are a portal through which something greater passes."',
        affinities: { shinkami: 3, lyria: 1 },
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GUARDIAN → GATE MAPPING
// ─────────────────────────────────────────────────────────────────────────────

export const GUARDIAN_GATE_MAP: Record<GuardianKey, { gateNumber: number; gateName: string }> = {
  lyssandria: { gateNumber: 1, gateName: 'foundation' },
  leyla:      { gateNumber: 2, gateName: 'flow' },
  draconia:   { gateNumber: 3, gateName: 'fire' },
  maylinn:    { gateNumber: 4, gateName: 'heart' },
  alera:      { gateNumber: 5, gateName: 'voice' },
  lyria:      { gateNumber: 6, gateName: 'sight' },
  aiyami:     { gateNumber: 7, gateName: 'crown' },
  elara:      { gateNumber: 8, gateName: 'shift' },
  ino:        { gateNumber: 9, gateName: 'unity' },
  shinkami:    { gateNumber: 10, gateName: 'source' },
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function getRankFromGates(gatesOpen: number): string {
  if (gatesOpen >= 9) return 'luminor';
  if (gatesOpen >= 7) return 'archmage';
  if (gatesOpen >= 5) return 'master';
  if (gatesOpen >= 3) return 'mage';
  return 'apprentice';
}

export function calculateResult(answers: Record<number, number>): GuardianKey {
  const scores: GuardianScores = {
    lyssandria: 0,
    leyla: 0,
    draconia: 0,
    maylinn: 0,
    alera: 0,
    lyria: 0,
    aiyami: 0,
    elara: 0,
    ino: 0,
    shinkami: 0,
  };

  for (const [questionId, choiceIndex] of Object.entries(answers)) {
    const question = QUIZ_QUESTIONS.find((q) => q.id === parseInt(questionId));
    if (!question) continue;
    const choice = question.choices[choiceIndex];
    if (!choice) continue;
    for (const [guardian, points] of Object.entries(choice.affinities)) {
      scores[guardian as GuardianKey] += points ?? 0;
    }
  }

  // Return the guardian with the highest score
  return Object.entries(scores).sort(
    ([, a], [, b]) => b - a,
  )[0][0] as GuardianKey;
}
