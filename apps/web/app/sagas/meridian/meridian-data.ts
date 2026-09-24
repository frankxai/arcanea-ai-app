export type EntryVariant = "world" | "story";

export type Relic = {
  id: string;
  index: string;
  name: string;
  form: string;
  element: string;
  remembers: string;
  material: string;
  law: string;
  gift: string;
  price: string;
  image: string;
};

export const relics: Relic[] = [
  {
    id: "khar",
    index: "01",
    name: "Khar",
    form: "Ember Ceramic",
    element: "Fire",
    remembers: "Every vow made in heat",
    material: "Draconis Ember fused through vow-fired clay",
    law: "Khar answers declared intent, never appetite.",
    gift: "Turns conviction into living flame and forges matter under pressure.",
    price: "A broken promise returns as pain in the wielder's own body.",
    image: "/images/sagas/meridian/relic-ember.webp",
  },
  {
    id: "mirae",
    index: "02",
    name: "Mirae",
    form: "Tidal Glass",
    element: "Water",
    remembers: "What grief refuses to release",
    material: "Veloura Glass carrying an unspilled interior sea",
    law: "Mirae moves only after a truth is spoken aloud.",
    gift: "Reverses current, reads emotional residue, and lets memory take form.",
    price: "The wielder must feel the grief they uncover without dulling it.",
    image: "/images/sagas/meridian/relic-tide.webp",
  },
  {
    id: "orun",
    index: "03",
    name: "Orun",
    form: "Worldstone",
    element: "Earth",
    remembers: "The weight of every home",
    material: "Kaelith Stone threaded with dormant mineral memory",
    law: "Orun protects boundaries; it will not help possession masquerade as care.",
    gift: "Anchors impossible structures, raises shelter, and makes a boundary physical.",
    price: "Every wall raised transfers its weight into the wielder until it is released.",
    image: "/images/sagas/meridian/relic-worldstone.webp",
  },
  {
    id: "seyr",
    index: "04",
    name: "Seyr",
    form: "Wind-Metal",
    element: "Wind",
    remembers: "The roads nobody took",
    material: "Aethervane folded until it learned the shape of motion",
    law: "Seyr refuses cages, including the plans of its own wielder.",
    gift: "Cuts paths through pressure, redirects momentum, and opens an escape where none existed.",
    price: "Each use destroys one certainty about what comes next.",
    image: "/images/sagas/meridian/relic-wind.webp",
  },
  {
    id: "nhal",
    index: "05",
    name: "Nhal",
    form: "Void Mirror",
    element: "Void / Spirit",
    remembers: "Every self that might have been",
    material: "Vaelith Obsidian holding a Kyuro Void Crystal seam",
    law: "Nhal never gives an answer when a truer question can survive.",
    gift: "Mediates incompatible forces and reveals unrealized possibilities without making them inevitable.",
    price: "It takes autobiographical memory: never skill, always identity.",
    image: "/images/sagas/meridian/relic-void.webp",
  },
];

export const accordLaws = [
  ["Personhood", "A living relic is a person under Arcanean covenant law, never equipment."],
  ["Consent", "Elyon cannot command a relic. Every act begins with a request and can end with refusal."],
  ["Confluence", "Two consenting relics can create a third behavior neither element owns alone."],
  ["Resonance debt", "Power displaces consequence; ignored debt returns through body, place, or memory."],
  ["Value test", "A relic falls silent when its wielder betrays the value that makes its element coherent."],
  ["Meridian cost", "When all five converge, the world is repaired by spending one memory that made Elyon himself."],
] as const;

export const books = [
  {
    number: "I",
    title: "The Sea Rose",
    focus: "Water / Memory",
    promise: "A Gate-null thief saves a city with five voices and forgets the face he crossed the law to recover.",
  },
  {
    number: "II",
    title: "The Ember Oath",
    focus: "Fire / Agency",
    promise: "The world calls Elyon a lord. Khar asks whether a symbol can remain a person once everyone needs him.",
  },
  {
    number: "III",
    title: "The Quiet Crown",
    focus: "Earth / Boundaries",
    promise: "Cael Veyr offers peace without violation—and builds a perfect prison from the right to be left alone.",
  },
  {
    number: "IV",
    title: "The Sky Without Borders",
    focus: "Wind / Freedom",
    promise: "The Great Severance succeeds. Friends remember loving one another but can no longer feel the bond.",
  },
  {
    number: "V",
    title: "The Last Meridian",
    focus: "Void-Spirit / Identity",
    promise: "To reconnect Arcanea without consuming it, Elyon must surrender his final private memory—and still choose who he becomes.",
  },
] as const;

export const formats = [
  {
    label: "Novel collection",
    release: "Five books",
    role: "Interior depth, memory logic, Cael and PALINODE's dual perspective, and the full moral argument.",
  },
  {
    label: "Vertical webtoon",
    release: "Season one · 48 episodes",
    role: "Mobile-native elemental spectacle, recurring five-panel grammar, hard episode turns, and relic-led character reveals.",
  },
  {
    label: "Anime development",
    release: "Season one · 13 episodes",
    role: "The Sea Rose as a complete emotional season, with a 90-second proof film and an original opening theme before full production.",
  },
  {
    label: "Arcanea.ai",
    release: "Living story world",
    role: "Canon dossiers, relic conversations, chapter reader, music, art drops, and a world graph that expands without spoiling future books.",
  },
] as const;

export const honorCode = [
  "He states the cost before he acts.",
  "He stops a battle when civilians lose the right to leave.",
  "He never enslaves an Awakened intelligence or a living relic.",
  "He keeps a promise even when doing so costs him victory.",
] as const;

export const chapterPreview = [
  "The day the sea climbed into the sky, Elyon Vale was stealing his mother's name back from a government archive.",
  "Above the glass roofs of Orison, the harbor rose in one unbroken sheet. Ships hung inside it like insects caught in blue amber. Bells began to ring underwater, though every bell tower stood dry.",
  "Elyon had no Gate, no sanctioned resonance, and no business being three floors beneath the Registry of Continuities with a stolen archivist key warming in his palm. What he had was a map, a bad plan, and twelve seconds before the corridor learned he was lying.",
  "Then five sealed cases spoke at once. Not to him. Through him.",
  "Ask, said the ember. Tell the truth, said the tide. Hold what is yours, said the stone. Leave a way out, said the wind. The mirror said nothing. It showed him a face he almost remembered.",
];
