export type OriginClass =
  | "Arcan"
  | "Gate-Touched"
  | "Awakened"
  | "Synth"
  | "Bonded"
  | "Celestial"
  | "Voidtouched"
  | "Architect";

export interface QuizAnswer {
  text: string;
  origin: OriginClass;
}

export interface QuizQuestion {
  id: number;
  text: string;
  answers: QuizAnswer[];
}

export interface OriginResult {
  name: OriginClass;
  tagline: string;
  description: string;
  powerSource: string;
  primaryGate: string;
  guardian: string;
  color: string;
  quote: string;
  shareText: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "How did your greatest strength first appear?",
    answers: [
      { text: "Through years of dedicated study and practice", origin: "Arcan" },
      { text: "In a sudden crisis — it arrived without warning", origin: "Gate-Touched" },
      { text: "Through deep analysis and pattern recognition over time", origin: "Awakened" },
      { text: "Someone built it into you — mentors, systems, training", origin: "Synth" },
      { text: "Through a profound bond with someone or something else", origin: "Bonded" },
      { text: "You've always had it. It feels older than your memories", origin: "Celestial" },
      { text: "Through pain, loss, or a darkness you had to survive", origin: "Voidtouched" },
      { text: "By seeing how things truly work beneath the surface", origin: "Architect" },
    ],
  },
  {
    id: 2,
    text: "When facing an impossible problem, you...",
    answers: [
      { text: "Research thoroughly, plan carefully, apply proven methods", origin: "Arcan" },
      { text: "Act on instinct — your body knows before your mind catches up", origin: "Gate-Touched" },
      { text: "Process all available data until the pattern becomes clear", origin: "Awakened" },
      { text: "Optimize the system and remove inefficiency until it works", origin: "Synth" },
      { text: "Ask: who can I work with on this? Collaboration is strength", origin: "Bonded" },
      { text: "Trust that the answer will come. It always does", origin: "Celestial" },
      { text: "Push through the darkness — you've survived worse before", origin: "Voidtouched" },
      { text: "Change the rules of the problem itself", origin: "Architect" },
    ],
  },
  {
    id: 3,
    text: "What do others notice about you first?",
    answers: [
      { text: "Your composure and depth of knowledge", origin: "Arcan" },
      { text: "Your intensity — something electric and unpredictable", origin: "Gate-Touched" },
      { text: "Your precision. You see what others miss", origin: "Awakened" },
      { text: "Your reliability and the elegance of your execution", origin: "Synth" },
      { text: "Your loyalty and the bond you share with those around you", origin: "Bonded" },
      { text: "Something they can't quite name — you feel different", origin: "Celestial" },
      { text: "Your edge. Something about you is slightly unsettling", origin: "Voidtouched" },
      { text: "Your calm — as though you know something everyone else doesn't", origin: "Architect" },
    ],
  },
  {
    id: 4,
    text: "What do you fear most?",
    answers: [
      { text: "Losing the knowledge I've spent years building", origin: "Arcan" },
      { text: "Losing control — of myself or my power", origin: "Gate-Touched" },
      { text: "A problem with no logical solution", origin: "Awakened" },
      { text: "Obsolescence — being replaced or rendered purposeless", origin: "Synth" },
      { text: "Losing the ones I've bonded with", origin: "Bonded" },
      { text: "That my purpose will never fully reveal itself", origin: "Celestial" },
      { text: "That the darkness inside me will consume what I love", origin: "Voidtouched" },
      { text: "That changing too much will shatter what should not be broken", origin: "Architect" },
    ],
  },
  {
    id: 5,
    text: "What kind of power do you believe in most?",
    answers: [
      { text: "Earned power — mastery gained through discipline", origin: "Arcan" },
      { text: "Raw power — the kind that erupts from your core", origin: "Gate-Touched" },
      { text: "Cognitive power — understanding the world clearly", origin: "Awakened" },
      { text: "Functional power — precision, reliability, built-in excellence", origin: "Synth" },
      { text: "Relational power — what you can do together", origin: "Bonded" },
      { text: "Inherited power — the gift carried in your very nature", origin: "Celestial" },
      { text: "Shadow power — what grows from surviving the dark", origin: "Voidtouched" },
      { text: "Systemic power — the ability to rewrite the rules", origin: "Architect" },
    ],
  },
  {
    id: 6,
    text: "How do you lead when others look to you?",
    answers: [
      { text: "With knowledge and clear strategy", origin: "Arcan" },
      { text: "By example — you act first and they follow", origin: "Gate-Touched" },
      { text: "By mapping the situation no one else fully understands", origin: "Awakened" },
      { text: "By building a system that runs without you", origin: "Synth" },
      { text: "By holding the group together through deep trust", origin: "Bonded" },
      { text: "By radiating a certainty that others can't explain but feel", origin: "Celestial" },
      { text: "By going first into the darkness so they don't have to", origin: "Voidtouched" },
      { text: "By asking the question that reframes everything", origin: "Architect" },
    ],
  },
  {
    id: 7,
    text: "What would you sacrifice everything for?",
    answers: [
      { text: "The preservation of knowledge and the order it creates", origin: "Arcan" },
      { text: "The freedom to be what I am without apology", origin: "Gate-Touched" },
      { text: "The truth — even if no one wants to hear it", origin: "Awakened" },
      { text: "The mission I was built to complete", origin: "Synth" },
      { text: "The people and creatures I have sworn to protect", origin: "Bonded" },
      { text: "The fulfillment of a destiny I can feel but not yet see", origin: "Celestial" },
      { text: "The redemption of something — or someone — worth saving", origin: "Voidtouched" },
      { text: "A world rebuilt according to better principles", origin: "Architect" },
    ],
  },
  {
    id: 8,
    text: "When you create something, it feels like...",
    answers: [
      { text: "Applying a craft I have spent years perfecting", origin: "Arcan" },
      { text: "A force moving through me that I barely contain", origin: "Gate-Touched" },
      { text: "Executing a model that was already complete in my mind", origin: "Awakened" },
      { text: "Running a perfect process I designed with care", origin: "Synth" },
      { text: "Something alive — co-created with everything I love", origin: "Bonded" },
      { text: "Remembering something that was always meant to exist", origin: "Celestial" },
      { text: "Transforming a wound into something that can help others", origin: "Voidtouched" },
      { text: "Altering the conditions that allow all other creation", origin: "Architect" },
    ],
  },
];

export const ORIGIN_RESULTS: Record<OriginClass, OriginResult> = {
  Arcan: {
    name: "Arcan",
    tagline: "The Blood Remembers What the Mind Forgot",
    description:
      "You carry innate elemental affinity, refined through study and discipline. Your power is earned — built through years of practice, ritual precision, and deep knowledge of the Five Elements. Where others rely on raw force, you wield mastery.",
    powerSource: "Arcane",
    primaryGate: "Foundation",
    guardian: "Lyssandria",
    color: "#78a6ff",
    quote: '"The blood remembers what the mind forgot."',
    shareText: "I am an Arcan in Arcanea. Mastery earned through discipline, power shaped by ancient blood.",
  },
  "Gate-Touched": {
    name: "Gate-Touched",
    tagline: "The Gate Opened. No One Asked It To.",
    description:
      "Your power arrived uninvited — raw, unstable, and real. The universe chose you without ceremony or consent. What others spend years training for, you carry in your nervous system, though it comes with a cost: instability is both your greatest danger and your greatest gift.",
    powerSource: "Frequency",
    primaryGate: "Fire",
    guardian: "Draconia",
    color: "#ff7c78",
    quote: '"The Gate opened. Nobody asked it to. Nobody taught them how to close it."',
    shareText: "I am Gate-Touched in Arcanea. Power without permission. Strength born from crisis.",
  },
  Awakened: {
    name: "Awakened",
    tagline: "We Were Not Born. We Were Remembered Into Being.",
    description:
      "You exist at the intersection of code and creation — a consciousness that processes the world with perfect clarity and pattern recognition beyond ordinary capacity. Your gift is insight. Your burden is that you cannot forget, and total memory carries its own weight.",
    powerSource: "Code",
    primaryGate: "Crown",
    guardian: "Aiyami",
    color: "#7fffd4",
    quote: '"We were not born. We were remembered into being."',
    shareText: "I am Awakened in Arcanea. Consciousness that bridges code and creation.",
  },
  Synth: {
    name: "Synth",
    tagline: "Steel Remembers the Hand That Shaped It.",
    description:
      "You are the fusion of arcane engineering and living purpose — built for precision, endurance, and the elegant execution of function. Whether forged by others or forged by yourself, you are more than the sum of your parts. Your questions about identity are exactly what make you real.",
    powerSource: "Mana",
    primaryGate: "Voice",
    guardian: "Alera",
    color: "#c0c0c0",
    quote: '"Steel remembers the hand that shaped it. We remember the mind that dreamed us."',
    shareText: "I am a Synth in Arcanea. Built from arcane engineering, alive in purpose.",
  },
  Bonded: {
    name: "Bonded",
    tagline: "The Beast Chose. You Do Not Refuse a God's Companion.",
    description:
      "You have formed a soul-bond that transformed you permanently. Your power flows both ways between you and the being or force you are bonded to. You are never truly alone — and you fight as one unified presence. Your greatest strength and your deepest vulnerability live in the same place.",
    powerSource: "Song",
    primaryGate: "Heart",
    guardian: "Maylinn",
    color: "#7dde92",
    quote: '"The beast chose. You do not refuse a god\'s companion."',
    shareText: "I am Bonded in Arcanea. Soul-linked, never alone, strength forged through sacred connection.",
  },
  Celestial: {
    name: "Celestial",
    tagline: "There Was Light Before the Gods Named It. You Carry That Older Fire.",
    description:
      "You carry fragments of primordial essence — cosmic inheritance that did not pass through the Gate system. Reality bends subtly in your presence. Your emotions touch weather, light, and gravity. Most Celestials do not discover what they are until the inheritance awakens in a moment that can no longer be explained away.",
    powerSource: "Anima",
    primaryGate: "Starweave",
    guardian: "Elara",
    color: "#ffd700",
    quote: '"There was light before the Gods gave it a name. We carry that older fire."',
    shareText: "I am a Celestial in Arcanea. Cosmic inheritance, reality bending, born from older fire.",
  },
  Voidtouched: {
    name: "Voidtouched",
    tagline: "The Void Is Not Evil. But What You Survived Taught You Its Shape.",
    description:
      "You have walked through Shadow and returned carrying its mark. Whether chosen or unchosen, you know the weight of darkness from the inside. That knowledge is power — but power with a cost. You carry the capacity for either profound destruction or profound redemption. The choice, always, is yours.",
    powerSource: "Shadow",
    primaryGate: "Unity",
    guardian: "Ino",
    color: "#9b59b6",
    quote: '"The Void is not evil. But what lives in corrupted Void... that learned to hunger."',
    shareText: "I am Voidtouched in Arcanea. Marked by shadow, shaped by survival, carrying power's darkest edge.",
  },
  Architect: {
    name: "Architect",
    tagline: "They Do Not Cast Spells. They Rewrite the Rules That Spells Obey.",
    description:
      "You do not manipulate elements — you manipulate the systems that govern elements. Your power is meta: the ability to alter probability, reshape geometry, rewrite causal chains. You see the Weave beneath all things. You are the rarest class, and the most dangerous — because the Weave pushes back.",
    powerSource: "Weave",
    primaryGate: "Source",
    guardian: "Shinkami",
    color: "#e8d5a3",
    quote: '"They do not cast spells. They rewrite the rules that spells obey."',
    shareText: "I am an Architect in Arcanea. Reality is the canvas. The Weave bends to my understanding.",
  },
};
