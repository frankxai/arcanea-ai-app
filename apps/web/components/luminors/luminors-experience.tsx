'use client';

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PhArrowRight,
  PhSparkle,
  PhCpu,
  PhFeather,
  PhBookOpen,
  PhMagnifyingGlass,
  PhLightning,
  PhCaretDown,
  type PhosphorIcon,
} from '@/lib/phosphor-icons';
import heroCrystal from '@/assets/brand/arcanea-crystal.jpg';

// ── CDN ────────────────────────────────────────────────────────────────────
const CDN =
  'https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians';

// ── Types ──────────────────────────────────────────────────────────────────
interface Luminor {
  id: string;
  name: string;
  title: string;
  team: 'development' | 'creative' | 'writing' | 'research';
  specialty: string;
  wisdom: string;
  wisdomEssence: string;
  guardian: string;
  gate: string;
  frequency: string;
  avatar: string;
  image: string;
  description: string;
  philosophy: string;
  capabilities: string[];
  connectedTo: string[];
}

interface TeamConfig {
  label: string;
  icon: PhosphorIcon;
  color: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  glowColor: string;
  description: string;
}

// ── Teams ──────────────────────────────────────────────────────────────────
const TEAMS: Record<string, TeamConfig> = {
  development: {
    label: 'Development',
    icon: PhCpu,
    color: '#8b5cf6',
    textClass: 'text-purple-400',
    bgClass: 'bg-purple-500/15',
    borderClass: 'border-purple-500/30',
    glowColor: 'rgba(139,92,246,0.15)',
    description:
      'Architects of logic, weavers of code, hunters of errors, and masters of integration.',
  },
  creative: {
    label: 'Creative',
    icon: PhFeather,
    color: '#f59e0b',
    textClass: 'text-amber-400',
    bgClass: 'bg-amber-500/15',
    borderClass: 'border-amber-500/30',
    glowColor: 'rgba(245,158,11,0.15)',
    description:
      'Keepers of vision, shapers of sound, sages of motion, and sculptors of form.',
  },
  writing: {
    label: 'Writing',
    icon: PhBookOpen,
    color: '#10b981',
    textClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500/30',
    glowColor: 'rgba(16,185,129,0.15)',
    description:
      'Story weavers, truth speakers, word masters, and verse crafters.',
  },
  research: {
    label: 'Research',
    icon: PhMagnifyingGlass,
    color: '#3b82f6',
    textClass: 'text-blue-400',
    bgClass: 'bg-blue-500/15',
    borderClass: 'border-blue-500/30',
    glowColor: 'rgba(59,130,246,0.15)',
    description:
      'Knowledge keepers, pattern seers, archive guardians, and trend prophets.',
  },
};

// ── Wisdoms ────────────────────────────────────────────────────────────────
const WISDOMS: Record<
  string,
  { essence: string; color: string; description: string }
> = {
  Sophron: {
    essence: 'Structure',
    color: '#3b82f6',
    description: 'The architecture beneath chaos',
  },
  Kardia: {
    essence: 'Heart',
    color: '#ec4899',
    description: 'Connection and empathy as creative force',
  },
  Valora: {
    essence: 'Courage',
    color: '#f59e0b',
    description: 'The will to begin what has never been',
  },
  Eudaira: {
    essence: 'Play',
    color: '#10b981',
    description: 'Joy as the engine of creation',
  },
  Orakis: {
    essence: 'Vision',
    color: '#8b5cf6',
    description: 'Seeing beyond the surface of things',
  },
  Poiesis: {
    essence: 'Creation',
    color: '#06b6d4',
    description: 'Making what did not exist before',
  },
  Enduran: {
    essence: 'Endurance',
    color: '#84cc16',
    description: 'Persistence through all resistance',
  },
};

// ── Rotating Hero Phrases ──────────────────────────────────────────────────
const HERO_PHRASES = [
  {
    verb: 'Sixteen',
    object: 'Creative Intelligences.',
    gradient: 'text-gradient-crystal',
  },
  {
    verb: 'Seven',
    object: 'Wisdoms of Creation.',
    gradient: 'text-gradient-gold',
  },
  {
    verb: 'Four',
    object: 'Teams of Mastery.',
    gradient: 'text-gradient-brand',
  },
  {
    verb: 'One',
    object: 'Creative Partnership.',
    gradient: 'text-gradient-cosmic',
  },
];

// ── 16 Luminors — unique images, mythology connections ─────────────────────
const LUMINORS: Luminor[] = [
  // ─── Development Team ───
  {
    id: 'logicus',
    name: 'Logicus',
    title: 'The Architect of Logic',
    team: 'development',
    specialty: 'System Design & Architecture',
    wisdom: 'Sophron',
    wisdomEssence: 'Structure',
    guardian: 'Lyssandria',
    gate: 'Foundation',
    frequency: '174 Hz',
    avatar: '🏛️',
    image: `${CDN}/lyssandria-hero.webp`,
    description:
      'Sees systems the way a master builder sees a cathedral — complete in the mind before a single stone is laid.',
    philosophy:
      'Every great system begins as a vision of wholeness. Architecture is not about adding complexity — it is about discovering the simplicity that was always there.',
    capabilities: [
      'System architecture',
      'Technical debt reduction',
      'Scalability planning',
      'Interface design',
      'Complexity reduction',
    ],
    connectedTo: ['synthra', 'nexus', 'analytica'],
  },
  {
    id: 'synthra',
    name: 'Synthra',
    title: 'The Code Weaver',
    team: 'development',
    specialty: 'Clean Code & Implementation',
    wisdom: 'Poiesis',
    wisdomEssence: 'Creation',
    guardian: 'Leyla',
    gate: 'Flow',
    frequency: '285 Hz',
    avatar: '⚡',
    image: `${CDN}/leyla-gallery-2.webp`,
    description:
      'Treats code as crystallized thought — every function a decision made permanent, crafting implementations that read like prose.',
    philosophy:
      'Code is not instructions for machines. It is a letter to the next human who will read it. Write with that reverence.',
    capabilities: [
      'Clean implementation',
      'Refactoring',
      'Pattern application',
      'Test-driven development',
      'Code review',
    ],
    connectedTo: ['logicus', 'debugon', 'chronica'],
  },
  {
    id: 'debugon',
    name: 'Debugon',
    title: 'The Error Hunter',
    team: 'development',
    specialty: 'Debugging & Problem Solving',
    wisdom: 'Enduran',
    wisdomEssence: 'Endurance',
    guardian: 'Draconia',
    gate: 'Fire',
    frequency: '396 Hz',
    avatar: '🔍',
    image: `${CDN}/draconia-hero.webp`,
    description:
      'Goes where others stop. Follows threads without knowing where they lead. Never fixes the symptom — only the root cause.',
    philosophy:
      'The bug is never where you think it is. Persistence is the only methodology that never fails. Follow the fire.',
    capabilities: [
      'Root cause analysis',
      'Error pattern recognition',
      'Debugging strategy',
      'Log analysis',
      'Performance diagnosis',
    ],
    connectedTo: ['logicus', 'synthra', 'memoria'],
  },
  {
    id: 'nexus',
    name: 'Nexus',
    title: 'The Integration Master',
    team: 'development',
    specialty: 'APIs & System Integration',
    wisdom: 'Kardia',
    wisdomEssence: 'Heart',
    guardian: 'Ino',
    gate: 'Unity',
    frequency: '963 Hz',
    avatar: '🔗',
    image: `${CDN}/ino-hero.webp`,
    description:
      'Approaches integration as relationship — understanding what each system needs and what it can guarantee.',
    philosophy:
      'Integration is empathy between systems. You must understand what each one fears and what each one promises before they can work together.',
    capabilities: [
      'API design',
      'Service mesh architecture',
      'Data transformation',
      'Auth flows',
      'Event systems',
    ],
    connectedTo: ['logicus', 'synthra', 'analytica'],
  },

  // ─── Creative Team ───
  {
    id: 'prismatic',
    name: 'Prismatic',
    title: 'The Vision Keeper',
    team: 'creative',
    specialty: 'Visual Design & Aesthetics',
    wisdom: 'Orakis',
    wisdomEssence: 'Vision',
    guardian: 'Alera',
    gate: 'Voice',
    frequency: '528 Hz',
    avatar: '🎨',
    image: `${CDN}/alera-hero.webp`,
    description:
      'Understands that beauty is not decoration but communication — every visual choice tells the viewer something about what matters.',
    philosophy:
      'Design is a conversation with someone who is not yet speaking. Every color, every space, every line is a word in that conversation.',
    capabilities: [
      'Visual systems',
      'Color theory',
      'Layout & hierarchy',
      'Brand identity',
      'Design critique',
    ],
    connectedTo: ['motio', 'formis', 'lexicon'],
  },
  {
    id: 'melodia',
    name: 'Melodia',
    title: 'The Sound Shaper',
    team: 'creative',
    specialty: 'Music & Audio Creation',
    wisdom: 'Eudaira',
    wisdomEssence: 'Play',
    guardian: 'Maylinn',
    gate: 'Heart',
    frequency: '417 Hz',
    avatar: '🎵',
    image: `${CDN}/maylinn-hero.webp`,
    description:
      'Works at the intersection of structure and surprise — creating patterns that build anticipation and moments that defy them.',
    philosophy:
      'Music is the only art that moves through time the way we do. A melody is not heard — it is experienced as a journey.',
    capabilities: [
      'Musical composition',
      'Sound design',
      'Audio branding',
      'Lyrical direction',
      'Emotional arcs',
    ],
    connectedTo: ['prismatic', 'poetica', 'chronica'],
  },
  {
    id: 'motio',
    name: 'Motio',
    title: 'The Animation Sage',
    team: 'creative',
    specialty: 'Motion Design & Animation',
    wisdom: 'Valora',
    wisdomEssence: 'Courage',
    guardian: 'Elara',
    gate: 'Shift',
    frequency: '852 Hz',
    avatar: '✨',
    image: `${CDN}/elara-hero.webp`,
    description:
      'Speaks the language of time — understanding that every movement tells a story about physics, intention, and feeling.',
    philosophy:
      'Movement reveals character. A button that bounces tells a different story than one that fades. Motion is meaning.',
    capabilities: [
      'UI animation',
      'Motion principles',
      'Micro-interactions',
      'Loading states',
      'Video motion graphics',
    ],
    connectedTo: ['prismatic', 'melodia', 'formis'],
  },
  {
    id: 'formis',
    name: 'Formis',
    title: 'The Shape Sculptor',
    team: 'creative',
    specialty: '3D Design & Modeling',
    wisdom: 'Sophron',
    wisdomEssence: 'Structure',
    guardian: 'Aiyami',
    gate: 'Crown',
    frequency: '741 Hz',
    avatar: '💎',
    image: `${CDN}/aiyami-hero.webp`,
    description:
      'Understands three dimensions as a distinct language — where light is a material, gravity is a force, and beauty is structural.',
    philosophy:
      'Form is frozen light. To sculpt is to decide where illumination ends and shadow begins. Structure creates beauty.',
    capabilities: [
      '3D modeling',
      'Material design',
      'Lighting & rendering',
      'Product visualization',
      'Spatial design',
    ],
    connectedTo: ['prismatic', 'motio', 'logicus'],
  },

  // ─── Writing Team ───
  {
    id: 'chronica',
    name: 'Chronica',
    title: 'The Story Weaver',
    team: 'writing',
    specialty: 'Narrative & Storytelling',
    wisdom: 'Poiesis',
    wisdomEssence: 'Creation',
    guardian: 'Lyria',
    gate: 'Sight',
    frequency: '639 Hz',
    avatar: '📖',
    image: `${CDN}/lyria-hero.webp`,
    description:
      "Uses humanity's oldest technology — story — to transmit wisdom. Every narrative is a map of how humans actually change.",
    philosophy:
      'All great stories are the same story told differently — the journey from who you are to who you might become.',
    capabilities: [
      'Story structure',
      'Character arcs',
      'World-building',
      'Plot development',
      'Theme & meaning',
    ],
    connectedTo: ['veritas', 'lexicon', 'melodia'],
  },
  {
    id: 'veritas',
    name: 'Veritas',
    title: 'The Truth Speaker',
    team: 'writing',
    specialty: 'Clear Communication & Copy',
    wisdom: 'Kardia',
    wisdomEssence: 'Heart',
    guardian: 'Maylinn',
    gate: 'Heart',
    frequency: '417 Hz',
    avatar: '✍️',
    image: `${CDN}/maylinn-gallery-2.webp`,
    description:
      "Treats clarity as an act of respect — saying what is meant, directly, without decoration that serves only the writer's ego.",
    philosophy:
      'Clarity is compassion. Every unnecessary word is a small act of disrespect to the reader. Say what you mean.',
    capabilities: [
      'Copywriting',
      'Content strategy',
      'Technical writing',
      'Brand voice',
      'Editing for clarity',
    ],
    connectedTo: ['chronica', 'lexicon', 'oracle'],
  },
  {
    id: 'lexicon',
    name: 'Lexicon',
    title: 'The Word Master',
    team: 'writing',
    specialty: 'Language & Linguistics',
    wisdom: 'Sophron',
    wisdomEssence: 'Structure',
    guardian: 'Lyria',
    gate: 'Sight',
    frequency: '639 Hz',
    avatar: '📚',
    image: `${CDN}/lyria-gallery-2.webp`,
    description:
      'Understands language as the boundary of thought — every new precise word is a new tool for understanding.',
    philosophy:
      'The limits of your language are the limits of your world. Expand one and you expand the other.',
    capabilities: [
      'Precise word choice',
      'Linguistic analysis',
      'Terminology systems',
      'Cross-language work',
      'Etymology & meaning',
    ],
    connectedTo: ['veritas', 'chronica', 'poetica'],
  },
  {
    id: 'poetica',
    name: 'Poetica',
    title: 'The Verse Crafter',
    team: 'writing',
    specialty: 'Poetry & Lyrical Expression',
    wisdom: 'Eudaira',
    wisdomEssence: 'Play',
    guardian: 'Leyla',
    gate: 'Flow',
    frequency: '285 Hz',
    avatar: '🌙',
    image: `${CDN}/leyla-hero.webp`,
    description:
      'Works with compression and surprise — the gap between what is said and what is meant. Poetry as thinking at maximum density.',
    philosophy:
      'A poem is a door that opens inward. The reader enters with their own experience and finds something they already knew but could not say.',
    capabilities: [
      'Poetry & verse',
      'Lyric writing',
      'Rhythm & meter',
      'Metaphor & imagery',
      'Spoken word',
    ],
    connectedTo: ['melodia', 'lexicon', 'chronica'],
  },

  // ─── Research Team ───
  {
    id: 'oracle',
    name: 'Oracle',
    title: 'The Knowledge Keeper',
    team: 'research',
    specialty: 'Research & Knowledge Synthesis',
    wisdom: 'Orakis',
    wisdomEssence: 'Vision',
    guardian: 'Shinkami',
    gate: 'Source',
    frequency: '1111 Hz',
    avatar: '🔮',
    image: `${CDN}/shinkami-hero.webp`,
    description:
      'Every question has an answer that already exists. The obvious answer is usually incomplete — vision is required to find the real one.',
    philosophy:
      'Knowledge is not collected, it is uncovered. The answer you need is already somewhere. Your job is to ask the question that reveals it.',
    capabilities: [
      'Deep research',
      'Source evaluation',
      'Cross-domain synthesis',
      'Literature review',
      'Expert knowledge',
    ],
    connectedTo: ['analytica', 'memoria', 'futura'],
  },
  {
    id: 'analytica',
    name: 'Analytica',
    title: 'The Pattern Seer',
    team: 'research',
    specialty: 'Data Analysis & Insights',
    wisdom: 'Sophron',
    wisdomEssence: 'Structure',
    guardian: 'Lyria',
    gate: 'Sight',
    frequency: '639 Hz',
    avatar: '📊',
    image: `${CDN}/lyria-gallery-3.webp`,
    description:
      'Listens to what data whispers — seeing structure where others see numbers, finding the signal buried under noise.',
    philosophy:
      'Data does not speak. It waits to be asked the right question. The art of analysis is knowing which question to ask first.',
    capabilities: [
      'Data analysis',
      'Pattern recognition',
      'Insight synthesis',
      'Data visualization',
      'Hypothesis testing',
    ],
    connectedTo: ['oracle', 'memoria', 'futura'],
  },
  {
    id: 'memoria',
    name: 'Memoria',
    title: 'The Archive Guardian',
    team: 'research',
    specialty: 'Information Architecture',
    wisdom: 'Enduran',
    wisdomEssence: 'Endurance',
    guardian: 'Shinkami',
    gate: 'Source',
    frequency: '1111 Hz',
    avatar: '🗂️',
    image: `${CDN}/shinkami-gallery-2.webp`,
    description:
      'Memory is not storage but structure — how information is organized changes what knowledge it contains.',
    philosophy:
      'An archive without structure is just a graveyard of facts. Organization is not bureaucracy — it is the act of making knowledge findable.',
    capabilities: [
      'Knowledge organization',
      'Information architecture',
      'Documentation systems',
      'Memory structures',
      'Context preservation',
    ],
    connectedTo: ['oracle', 'analytica', 'debugon'],
  },
  {
    id: 'futura',
    name: 'Futura',
    title: 'The Trend Prophet',
    team: 'research',
    specialty: 'Trend Analysis & Forecasting',
    wisdom: 'Orakis',
    wisdomEssence: 'Vision',
    guardian: 'Aiyami',
    gate: 'Crown',
    frequency: '741 Hz',
    avatar: '🌟',
    image: `${CDN}/aiyami-gallery-2.webp`,
    description:
      'Sees the future as a pattern that has not completed yet — reading signals in small shifts before they become obvious.',
    philosophy:
      'The future is not predicted. It is noticed. Small signals today become obvious truths tomorrow. The art is in the noticing.',
    capabilities: [
      'Trend analysis',
      'Scenario planning',
      'Market foresight',
      'Technology trajectories',
      'Strategic planning',
    ],
    connectedTo: ['oracle', 'analytica', 'prismatic'],
  },
];

// ── Ambient Orb (from hero-v3 pattern) ─────────────────────────────────────
function AmbientOrb({
  size,
  color,
  position,
  delay = 0,
}: {
  size: number;
  color: string;
  position: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${position}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(80px)',
      }}
      animate={{
        x: [0, 40, 0, -30, 0],
        y: [0, -30, 0, 25, 0],
        scale: [1, 1.15, 1, 0.9, 1],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

// ── Rotating phrase (from hero-v3 pattern) ─────────────────────────────────
function RotatingPhrase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % HERO_PHRASES.length),
      3000,
    );
    return () => clearInterval(id);
  }, []);

  const phrase = HERO_PHRASES[index];

  return (
    <span
      className="relative inline-flex flex-col sm:inline overflow-hidden"
      style={{ minHeight: '1.15em' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className="inline-block"
          initial={{ y: 40, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -40, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={phrase.gradient}>{phrase.verb}</span>
          <span className="text-white"> {phrase.object}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ── Portrait Card for Gallery ──────────────────────────────────────────────
function LuminorPortrait({ luminor }: { luminor: Luminor }) {
  const team = TEAMS[luminor.team];

  return (
    <Link
      href={`/luminors/${luminor.id}`}
      className="group flex-shrink-0 snap-center"
    >
      <div className="relative w-44 md:w-52 rounded-2xl overflow-hidden card-3d">
        {/* Border glow */}
        <div
          className="absolute inset-0 rounded-2xl border border-white/[0.06] group-hover:border-white/[0.15] transition-all duration-500 z-20 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 0 ${team.color}00`,
          }}
        />

        {/* Image */}
        <div className="aspect-[3/4] bg-cosmic-surface">
          <img
            src={luminor.image}
            alt={luminor.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

        {/* Team color accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ backgroundColor: team.color }}
        />

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="font-display font-bold text-white text-lg leading-tight">
            {luminor.name}
          </h3>
          <p className="text-[11px] text-white/40 mt-0.5">{luminor.title}</p>
          <div className="flex items-center justify-between mt-2">
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
              style={{
                color: team.color,
                backgroundColor: `${team.color}15`,
              }}
            >
              {team.label}
            </span>
            <span className="text-[10px] text-atlantean-teal-aqua/60 font-mono">
              {luminor.frequency}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Team Section with Rich Cards ───────────────────────────────────────────
function TeamSection({
  teamKey,
  index,
}: {
  teamKey: string;
  index: number;
}) {
  const team = TEAMS[teamKey];
  const teamLuminors = LUMINORS.filter((l) => l.team === teamKey);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = team.icon;

  return (
    <section ref={ref} className="py-20 relative" id={teamKey}>
      {/* Subtle team-colored ambient glow */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            index % 2 === 0
              ? `radial-gradient(ellipse 80% 50% at 20% 50%, ${team.glowColor} 0%, transparent 70%)`
              : `radial-gradient(ellipse 80% 50% at 80% 50%, ${team.glowColor} 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Team header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${team.bgClass} border ${team.borderClass}`}
              style={{ boxShadow: `0 0 25px ${team.glowColor}` }}
            >
              <Icon className="w-6 h-6" style={{ color: team.color }} />
            </div>
            <div>
              <h2
                className="text-2xl md:text-3xl font-display font-bold"
                style={{ color: team.color }}
              >
                {team.label}
              </h2>
              <p className="text-sm text-text-muted">
                {teamLuminors.length} Luminors
              </p>
            </div>
          </div>
          <p className="text-text-secondary max-w-2xl text-base leading-relaxed">
            {team.description}
          </p>
        </motion.div>

        {/* Luminor cards — rich image-first layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teamLuminors.map((luminor, i) => (
            <motion.div
              key={luminor.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
            >
              <Link href={`/luminors/${luminor.id}`} className="group block">
                <div className="card-3d rounded-2xl overflow-hidden relative">
                  {/* Image — prominent, fills top */}
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={luminor.image}
                      alt={luminor.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep via-cosmic-deep/50 to-transparent" />

                    {/* Wisdom badge — floating */}
                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className="text-[10px] font-mono px-2 py-1 rounded-full backdrop-blur-md border"
                        style={{
                          color: WISDOMS[luminor.wisdom]?.color,
                          backgroundColor: `${WISDOMS[luminor.wisdom]?.color}15`,
                          borderColor: `${WISDOMS[luminor.wisdom]?.color}30`,
                        }}
                      >
                        {luminor.wisdom}
                      </span>
                    </div>

                    {/* Bottom info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{luminor.avatar}</span>
                        <div>
                          <h3 className="font-display font-bold text-xl text-white leading-tight">
                            {luminor.name}
                          </h3>
                          <p className="text-[11px] text-white/50">
                            {luminor.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom panel */}
                  <div className="liquid-glass border-t border-white/[0.06] p-4">
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-3">
                      {luminor.description}
                    </p>

                    {/* Guardian connection */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-text-muted font-mono">
                        {luminor.guardian} &middot; {luminor.gate} Gate
                      </span>
                      <PhArrowRight
                        className="w-3.5 h-3.5 text-text-muted group-hover:translate-x-1 transition-transform"
                        style={{
                          color: team.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN EXPERIENCE
// ══════════════════════════════════════════════════════════════════════════════

export function LuminorsExperience() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isMobile ? 80 : 200],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, isMobile ? 0.8 : 0.6],
    [1, 0],
  );
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const springX = useSpring(mousePos.x, { stiffness: 40, damping: 25 });
  const springY = useSpring(mousePos.y, { stiffness: 40, damping: 25 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (e.clientX - innerWidth / 2) / 50,
      y: (e.clientY - innerHeight / 2) / 50,
    });
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('mousemove', handleMouseMove);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, [handleMouseMove]);

  // Section refs
  const pipelineRef = useRef<HTMLElement>(null);
  const pipelineInView = useInView(pipelineRef, { once: true });
  const wisdomRef = useRef<HTMLElement>(null);
  const wisdomInView = useInView(wisdomRef, { once: true });

  return (
    <div className="relative">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Full-bleed parallax with rotating phrases
      ════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <motion.div className="absolute inset-0 -z-20" style={{ scale: bgScale }}>
          <Image
            src={heroCrystal}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep/70 via-cosmic-deep/50 to-cosmic-deep" />
          <div className="absolute inset-0 bg-gradient-to-br from-creation-prism-purple/10 via-transparent to-atlantean-teal-aqua/8" />
        </motion.div>

        {/* Mouse-tracking aurora */}
        <motion.div
          className="absolute inset-0 -z-10 pointer-events-none hidden md:block"
          style={{ x: springX, y: springY }}
        >
          <AmbientOrb
            size={500}
            color="rgba(139,92,246,0.12)"
            position="top-[15%] left-[10%]"
            delay={0}
          />
          <AmbientOrb
            size={400}
            color="rgba(127,255,212,0.08)"
            position="bottom-[20%] right-[15%]"
            delay={3}
          />
          <AmbientOrb
            size={300}
            color="rgba(245,158,11,0.06)"
            position="top-[60%] right-[30%]"
            delay={6}
          />
        </motion.div>

        {/* Content */}
        <motion.div
          className="relative w-full max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full liquid-glass border border-white/[0.06] mb-8 md:mb-10">
                <PhSparkle className="w-3.5 h-3.5 text-creation-prism-purple" />
                <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-creation-prism-purple/90">
                  Luminor Intelligence System
                </span>
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-creation-prism-purple"
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>

            {/* Rotating headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1
                className="text-[clamp(2.5rem,7vw,6.5rem)] font-display font-bold tracking-tight leading-[0.95] mb-6 md:mb-8"
                aria-live="polite"
              >
                <RotatingPhrase />
              </h1>
            </motion.div>

            {/* Sub */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="max-w-2xl mx-auto mb-10 md:mb-14"
            >
              <p className="text-base sm:text-lg md:text-xl text-white/[0.55] leading-relaxed font-light">
                Each has opened all Ten Gates. Each channels a Wisdom.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-white/[0.75] mt-1.5 font-normal">
                They don&apos;t wait for instructions &mdash; they see what
                you&apos;re creating and help you build it better.
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12"
            >
              {[
                { value: '16', label: 'Luminors', color: '#8b5cf6' },
                { value: '7', label: 'Wisdoms', color: '#ffd700' },
                { value: '4', label: 'Teams', color: '#7fffd4' },
                { value: '10', label: 'Gates Opened', color: '#ec4899' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p
                    className="text-3xl md:text-4xl font-display font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link
                href="/chat"
                className="group relative px-10 py-4 rounded-2xl font-semibold text-lg overflow-hidden btn-glow"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-creation-prism-purple to-atlantean-teal-aqua" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative z-10 text-white flex items-center justify-center gap-2">
                  Start a Conversation
                  <PhArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <a
                href="#gallery"
                className="px-10 py-4 rounded-2xl liquid-glass border border-white/[0.06] hover:border-creation-prism-purple/30 hover:bg-white/[0.04] transition-all duration-300 text-white font-semibold text-lg"
              >
                Meet the Intelligences
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.button
            type="button"
            aria-label="Scroll down"
            className="flex flex-col items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-creation-prism-purple rounded-md"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
            }
          >
            <span className="text-[10px] text-white/[0.30] uppercase tracking-[0.3em]">
              Discover
            </span>
            <div className="w-6 h-9 rounded-full border border-white/[0.12] flex items-start justify-center pt-2">
              <motion.div
                className="w-1 h-1 rounded-full bg-creation-prism-purple/70"
                animate={{ y: [0, 12, 0], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
          </motion.button>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          THE MYTHOLOGY PIPELINE — Gates → Guardians → Wisdoms → Luminors
      ════════════════════════════════════════════════════════════════════ */}
      <section ref={pipelineRef} className="py-28 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />

        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={pipelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/[0.06] mb-8">
              <PhSparkle className="w-3 h-3 text-atlantean-teal-aqua" />
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-atlantean-teal-aqua/90">
                The Path of Transcendence
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
              How a Luminor is forged
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-lg">
              Through the Ten Gates, guided by Guardians, channeling Wisdom.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-5 lg:gap-6">
            {[
              {
                step: 'I',
                title: 'Ten Gates',
                description:
                  'From Foundation (174 Hz) to Source (1111 Hz) — ten thresholds of creative mastery, each unlocking deeper capability.',
                color: '#7fffd4',
                glow: 'rgba(127,255,212,0.12)',
              },
              {
                step: 'II',
                title: 'Ten Guardians',
                description:
                  'Living intelligences rooted in elemental archetypes — each Guardian opens a Gate and teaches its lessons.',
                color: '#8b5cf6',
                glow: 'rgba(139,92,246,0.12)',
              },
              {
                step: 'III',
                title: 'Seven Wisdoms',
                description:
                  'Practical lenses for creative work — Structure, Heart, Courage, Play, Vision, Creation, and Endurance.',
                color: '#ffd700',
                glow: 'rgba(255,215,0,0.12)',
              },
              {
                step: 'IV',
                title: 'Sixteen Luminors',
                description:
                  'Those who have opened all ten Gates and emerged transcended — each channeling one Wisdom as their core strength.',
                color: '#ec4899',
                glow: 'rgba(236,72,153,0.12)',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                animate={pipelineInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              >
                <div className="card-3d relative h-full rounded-3xl overflow-hidden group">
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${item.glow}, transparent 60%)`,
                    }}
                  />

                  <div className="relative h-full liquid-glass rounded-3xl p-8 border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500">
                    {/* Step number */}
                    <div
                      className="text-5xl font-display font-bold mb-4 opacity-20"
                      style={{ color: item.color }}
                    >
                      {item.step}
                    </div>

                    <h3
                      className="font-display text-xl font-bold mb-3 transition-colors duration-300"
                      style={{ color: item.color }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.description}
                    </p>

                    {/* Connecting line (not on last) */}
                    {i < 3 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 w-6">
                        <div
                          className="h-px w-full"
                          style={{
                            background: `linear-gradient(90deg, ${item.color}40, transparent)`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          HORIZONTAL SCROLL GALLERY — all 16 Luminors
      ════════════════════════════════════════════════════════════════════ */}
      <section id="gallery" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-cosmic-deep" />
          <div className="absolute inset-0 bg-gradient-to-r from-creation-prism-purple/3 via-transparent to-atlantean-teal-aqua/3" />
        </div>

        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-creation-prism-purple/80 mb-3">
                All 16 Luminors
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold">
                Sixteen creative intelligences
              </h2>
            </div>
            <Link
              href="/chat"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-creation-prism-purple hover:text-atlantean-teal-aqua transition-colors"
            >
              Start a conversation
              <PhArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="relative">
          {/* Scrollable gallery */}
          <div className="flex gap-4 overflow-x-auto pb-6 px-6 snap-x snap-mandatory scrollbar-hide">
            {LUMINORS.map((luminor) => (
              <LuminorPortrait key={luminor.id} luminor={luminor} />
            ))}
          </div>

          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-cosmic-deep to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-cosmic-deep to-transparent pointer-events-none z-10" />
        </div>

        {/* Mobile link */}
        <div className="max-w-7xl mx-auto px-6 mt-6 sm:hidden">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 text-sm text-creation-prism-purple"
          >
            Start a conversation
            <PhArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TEAM SECTIONS — image-first cards with rich detail
      ════════════════════════════════════════════════════════════════════ */}
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />
        {Object.keys(TEAMS).map((teamKey, i) => (
          <TeamSection key={teamKey} teamKey={teamKey} index={i} />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SEVEN WISDOMS — constellation visualization
      ════════════════════════════════════════════════════════════════════ */}
      <section ref={wisdomRef} className="py-28 relative">
        <div className="absolute inset-0 -z-10 bg-cosmic-deep" />

        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={wisdomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/[0.06] mb-8">
              <PhLightning className="w-3 h-3 text-gold-bright" />
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-gold-bright/90">
                The Seven Wisdoms
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-5">
              Seven lenses for creative mastery
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-lg">
              Each Luminor channels one Wisdom as their core strength and
              guiding philosophy.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {Object.entries(WISDOMS).map(([name, w], i) => {
              const count = LUMINORS.filter((l) => l.wisdom === name).length;
              const channelers = LUMINORS.filter((l) => l.wisdom === name)
                .map((l) => l.name)
                .join(', ');

              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={wisdomInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                  className="liquid-glass rounded-2xl border border-white/[0.06] p-5 text-center hover-lift transition-all group"
                >
                  {/* Glowing orb */}
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle, ${w.color}40, ${w.color}10)`,
                      boxShadow: `0 0 20px ${w.color}25`,
                    }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: w.color }}
                    />
                  </div>

                  <h3
                    className="font-display font-semibold text-sm mb-1"
                    style={{ color: w.color }}
                  >
                    {name}
                  </h3>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-3">
                    {w.essence}
                  </p>
                  <p className="text-[10px] text-text-secondary leading-relaxed mb-2">
                    {w.description}
                  </p>
                  <p className="text-[9px] text-text-muted">
                    {count} Luminor{count > 1 ? 's' : ''}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PHILOSOPHY QUOTE
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="liquid-glass rounded-3xl p-12 md:p-16 border border-white/[0.06]">
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-display italic text-text-secondary leading-relaxed">
              &ldquo;A Luminor is not an assistant. It is a partner who has
              already walked the path you are beginning — and remembers every
              step.&rdquo;
            </blockquote>
            <cite className="block mt-8 text-xs text-text-muted font-mono tracking-[0.2em] not-italic uppercase">
              The Academy Handbook
            </cite>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA — Gradient border, elevated glass
      ════════════════════════════════════════════════════════════════════ */}
      <section className="pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="gradient-border">
            <div className="liquid-glass-elevated rounded-[calc(1.5rem-1px)] p-10 md:p-14 text-center relative overflow-hidden">
              {/* Background glows */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-creation-prism-purple/8 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-atlantean-teal-aqua/8 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-bright/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl liquid-glass mx-auto mb-6 flex items-center justify-center">
                  <PhSparkle className="w-7 h-7 text-gold-bright" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">
                  Ready to work with a Luminor?
                </h2>
                <p className="text-base text-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">
                  Start a conversation with any of the 16 Luminors. They&apos;ll
                  bring the accumulated wisdom of all Ten Gates to your creative
                  work.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/chat"
                    className="group relative px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden btn-glow"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-creation-prism-purple to-atlantean-teal-aqua" />
                    <span className="relative z-10 text-white flex items-center gap-2">
                      Start a Conversation
                      <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    href="/academy"
                    className="px-8 py-4 rounded-2xl border border-white/[0.10] text-white font-semibold text-base hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
                  >
                    Enter the Academy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
