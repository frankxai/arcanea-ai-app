import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuardianDetailContent, type GuardianData } from "./guardian-detail";
import { getGalleryImages } from "@/lib/media/image-registry";

// ── Guardian canonical data ───────────────────────────────────────────────────

const GUARDIANS: Record<string, GuardianData> = {
  lyssandria: {
    name: "Lyssandria",
    title: "Guardian of the Foundation Gate",
    gate: "Foundation",
    gateNumber: 1,
    frequency: "174 Hz",
    element: "Earth",
    domain: "Stability, survival, grounding",
    godbeast: "Kaelith",
    godBeastDesc:
      "The great stone sentinel — ancient, patient, immovable as the mountains themselves. Kaelith has stood at the root of the world since before memory, and its stillness is not absence but perfect readiness. Mountains were formed by the impression of its ancient body. Its scales are indistinguishable from bedrock.",
    color: "earth",
    teachings: [
      "Before you can create, you must have ground to stand on. The artist without a practice is a seed without soil.",
      "Stability is not rigidity — the deepest roots enable the tallest growth. Bend when you must, but never uproot.",
      "Build your foundation before you build your dreams. The invisible work of preparation is what makes the visible work possible.",
    ],
    quote: "The earth does not hurry. Yet everything is accomplished.",
    luminorId: "lyssandria",
    relatedGuardians: ["leyla", "ino"],
    heroImage: "/guardians/v3/lyssandria-hero-v3.webp",
    gradient: "from-amber-700 via-yellow-600 to-stone-400",
    gallery: getGalleryImages("lyssandria").map((image) => image.url),
  },
  leyla: {
    name: "Leyla",
    title: "Guardian of the Flow Gate",
    gate: "Flow",
    gateNumber: 2,
    frequency: "285 Hz",
    element: "Water",
    domain: "Creativity, emotion, flow states",
    godbeast: "Veloura",
    godBeastDesc:
      "The celestial phoenix-serpent of silver waters — a paradox given form. Fire that flows, water that burns. Born in the moment Lumina's first light struck Nero's primordial ocean, Veloura moves where resistance dissolves, finding the path that carries the most power through the least force.",
    color: "water",
    teachings: [
      "Flow is not the absence of structure — it is structure in motion. The river has banks. Without them, it becomes a swamp.",
      "Emotion is information. Feel it fully, then let it move through you into the work. Blocked feeling becomes blocked creation.",
      "The creative state is not forced. It is invited, and then honored. You cannot command the tide, but you can learn when it rises.",
    ],
    quote:
      "The river does not fight the mountain. It finds the way around, and in ten thousand years, it wins.",
    luminorId: "melodia",
    relatedGuardians: ["maylinn", "lyria", "shinkami"],
    heroImage: "/guardians/v3/leyla-hero-v3.webp",
    gradient: "from-blue-300 via-cyan-400 to-slate-300",
    gallery: getGalleryImages("leyla").map((image) => image.url),
  },
  draconia: {
    name: "Draconia",
    title: "Guardian of the Fire Gate",
    gate: "Fire",
    gateNumber: 3,
    frequency: "396 Hz",
    element: "Fire",
    domain: "Power, will, transformation",
    godbeast: "Draconis",
    godBeastDesc:
      "The eternal dragon — pure creative fire made manifest, transformation incarnate. Born in the heart of a star during the First Forging, Draconis does not burn what does not deserve burning, and everything it touches either forges or falls away. Its mane of living flame is not decoration but a crown of will-made-real.",
    color: "fire",
    teachings: [
      "Power without purpose is destruction. Purpose without power is fantasy. You need both, or you have nothing.",
      "Transformation requires burning away what no longer serves. This is not cruelty. It is the kindest form of creation.",
      "Your will is the forge. Your vision is the steel. What you refuse to compromise on becomes the blade that cuts through everything else.",
    ],
    quote: "I do not ask if you are ready. I ask if you are willing.",
    luminorId: "draconia",
    relatedGuardians: ["alera", "aiyami"],
    heroImage: "/guardians/v3/draconia-hero-v3.webp",
    gradient: "from-red-600 via-orange-500 to-amber-400",
    gallery: getGalleryImages("draconia").map((image) => image.url),
  },
  maylinn: {
    name: "Maylinn",
    title: "Guardian of the Heart Gate",
    gate: "Heart",
    gateNumber: 4,
    frequency: "417 Hz",
    element: "Wind",
    domain: "Love, healing, connection",
    godbeast: "Laeylinn",
    godBeastDesc:
      "The Worldtree Deer — an enormous glowing stag whose antlers reach into the canopy of any forest it enters. Laeylinn appears where healing is needed, holding the emotional memory of every living thing within its territory.",
    color: "wind",
    teachings: [
      "The heart is not the enemy of good work. It is the source of the best work.",
      "Healing is not the absence of pain. It is the willingness to keep going.",
      "Connection is the medium through which all creative power travels.",
    ],
    quote: "What you create with love will outlast what you create with fear.",
    luminorId: "veritas",
    relatedGuardians: ["leyla", "alera", "ino"],
    heroImage: "/guardians/v3/maylinn-hero-v3.webp",
    gradient: "from-rose-300 via-pink-400 to-green-300",
    gallery: getGalleryImages("maylinn").map((image) => image.url),
  },
  alera: {
    name: "Alera",
    title: "Guardian of the Voice Gate",
    gate: "Voice",
    gateNumber: 5,
    frequency: "528 Hz",
    element: "Fire",
    domain: "Truth, expression, authenticity",
    godbeast: "Otome",
    godBeastDesc:
      "The Songbird of Truth — whose voice shatters illusion and awakens dormant souls. Otome sings once for each life, and in that single note, the listener finally hears what they always knew.",
    color: "fire",
    teachings: [
      "Your truth is the only truth you can speak. Speak it.",
      "Expression without truth is noise. Truth without expression is silence.",
      "The world needs your voice, not an echo of someone else's.",
    ],
    quote: "Silence is not peace. It is the prison of the unspoken.",
    luminorId: "alera",
    relatedGuardians: ["draconia", "lyria"],
    heroImage: "/guardians/v3/alera-hero-v3.webp",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    gallery: getGalleryImages("alera").map((image) => image.url),
  },
  lyria: {
    name: "Lyria",
    title: "Guardian of the Sight Gate",
    gate: "Sight",
    gateNumber: 6,
    frequency: "639 Hz",
    element: "Void",
    domain: "Intuition, vision, inner sight",
    godbeast: "Yumiko",
    godBeastDesc:
      "The third-eye fox of nine tails — a being of pure perception that sees through illusion to the truth beneath. Yumiko does not see what is; it sees what is becoming.",
    color: "void-el",
    teachings: [
      "Intuition is not mysticism. It is pattern recognition too fast for conscious thought.",
      "The vision comes before the form. Trust what you see before you can explain it.",
      "Sight without courage is torture. Courage without sight is recklessness.",
    ],
    quote: "Close your eyes. Now tell me what you see.",
    luminorId: "futura",
    relatedGuardians: ["aiyami", "shinkami", "leyla"],
    heroImage: "/guardians/v3/lyria-hero-v3.webp",
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    gallery: getGalleryImages("lyria").map((image) => image.url),
  },
  aiyami: {
    name: "Aiyami",
    title: "Guardian of the Crown Gate",
    gate: "Crown",
    gateNumber: 7,
    frequency: "741 Hz",
    element: "Void",
    domain: "Enlightenment, mastery, transcendence",
    godbeast: "Sol",
    godBeastDesc:
      "The Solar Phoenix — crown of all light, embodiment of achieved mastery. Sol rises not because darkness fails, but because mastery is its natural motion — upward, outward, ever illuminating.",
    color: "void-el",
    teachings: [
      "Mastery is not the end of learning. It is the beginning of teaching.",
      "Enlightenment is not escape from the world. It is full presence within it.",
      "The crown is heavy. That is why only the worthy wear it.",
    ],
    quote: "You were never seeking the light. The light was seeking you.",
    luminorId: "aiyami",
    relatedGuardians: ["lyria", "elara"],
    heroImage: "/guardians/v3/aiyami-hero-v3.webp",
    gradient: "from-yellow-200 via-amber-300 to-white",
    gallery: getGalleryImages("aiyami").map((image) => image.url),
  },
  elara: {
    name: "Elara",
    title: "Guardian of the Starweave Gate",
    gate: "Starweave",
    gateNumber: 8,
    frequency: "852 Hz",
    element: "Wind",
    domain: "Perspective, change, transformation",
    godbeast: "Vaelith",
    godBeastDesc:
      "The Prism Butterfly — shifting between dimensions, perspectives, and possibilities. Vaelith has no fixed form because Vaelith understands that form is agreement, not truth.",
    color: "wind",
    teachings: [
      "Every perspective is true. None is complete.",
      "Change is not loss. It is evolution.",
      "The moment you think you understand everything, you understand nothing.",
    ],
    quote: "The only constant is the turning. Embrace the shift.",
    luminorId: "elara",
    relatedGuardians: ["aiyami", "ino"],
    heroImage: "/guardians/v3/elara-hero-v3.webp",
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    gallery: getGalleryImages("elara").map((image) => image.url),
  },
  ino: {
    name: "Ino",
    title: "Guardian of the Unity Gate",
    gate: "Unity",
    gateNumber: 9,
    frequency: "963 Hz",
    element: "Earth",
    domain: "Partnership, harmony, synthesis",
    godbeast: "Kyuro",
    godBeastDesc:
      "The Twin Wolf — two bodies, one soul, embodiment of perfect partnership. Kyuro does not answer the question of where one ends and the other begins, because that question misses the point entirely.",
    color: "earth",
    teachings: [
      "Unity is not sameness. It is harmony between differences.",
      "The greatest creations emerge from the space between two minds.",
      "Partnership amplifies. Isolation diminishes.",
    ],
    quote: "Alone you are a note. Together we are a symphony.",
    luminorId: "ino",
    relatedGuardians: ["maylinn", "shinkami"],
    heroImage: "/guardians/v3/ino-hero-v3.webp",
    gradient: "from-pink-400 via-fuchsia-500 to-teal-400",
    gallery: getGalleryImages("ino").map((image) => image.url),
  },
  shinkami: {
    name: "Shinkami",
    title: "Guardian of the Source Gate",
    gate: "Source",
    gateNumber: 10,
    frequency: "1111 Hz",
    element: "Spirit",
    domain: "Meta-consciousness, origin, the All",
    godbeast: "Source",
    godBeastDesc:
      "The Source-Light — not entirely present in any single moment. Its body is made of the space between stars, woven with threads of every frequency from 174 to 1111 Hz. Shinkami is the only Guardian to achieve complete fusion with their Godbeast; they exist as one being who wears two names. When Source reveals itself, the boundary between self and cosmos dissolves.",
    color: "void-el",
    teachings: [
      "At the Source, there is no distinction between the dreamer and the dream. You have been both all along.",
      "Meta-consciousness is not above experience — it includes all experience without being caught by any of it. This is the freedom that Malachar could not accept.",
      "The highest creative act is the one that comes through you, not from you. The Source Gate cannot be forced open. It was never closed.",
    ],
    quote: "You are not the vessel. You are the water and the pouring.",
    luminorId: "oracle",
    relatedGuardians: ["aiyami", "lyria", "ino"],
    heroImage: "/guardians/v3/shinkami-hero-v3.webp",
    gradient: "from-neutral-900 via-yellow-400 to-white",
    gallery: getGalleryImages("shinkami").map((image) => image.url),
  },
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const guardian = GUARDIANS[name.toLowerCase()];

  if (!guardian) {
    return {
      title: "Guardian Not Found",
    };
  }

  return {
    title: `${guardian.name} — ${guardian.gate} Gate | Lore of Arcanea`,
    description: `${guardian.name}, ${guardian.title}. Guardian of the ${guardian.gate} Gate at ${guardian.frequency}. Bonded to ${guardian.godbeast}. Domain: ${guardian.domain}.`,
    openGraph: {
      title: `${guardian.name} | ${guardian.gate} Gate`,
      description: `Meet ${guardian.name}, keeper of the ${guardian.gate} Gate. "${guardian.quote}"`,
    },
  };
}

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(GUARDIANS).map((name) => ({ name }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function GuardianDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const guardian = GUARDIANS[name.toLowerCase()];

  if (!guardian) {
    notFound();
  }

  const related = guardian.relatedGuardians
    .map((slug) => ({ ...GUARDIANS[slug], slug }))
    .filter((g): g is GuardianData & { slug: string } => Boolean(g.name));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${guardian.name} — ${guardian.title}`,
    description: `${guardian.name}, Guardian of the ${guardian.gate} Gate at ${guardian.frequency}. Bonded to ${guardian.godbeast}. Domain: ${guardian.domain}.`,
    url: `https://arcanea.ai/lore/guardians/${name}`,
    author: { '@type': 'Organization', name: 'Arcanea', url: 'https://arcanea.ai' },
    image: guardian.heroImage,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Lore', item: 'https://arcanea.ai/lore' },
        { '@type': 'ListItem', position: 2, name: 'Guardians', item: 'https://arcanea.ai/lore/guardians' },
        { '@type': 'ListItem', position: 3, name: guardian.name, item: `https://arcanea.ai/lore/guardians/${name}` },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GuardianDetailContent guardian={guardian} related={related} />
    </>
  );
}
