'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { PhArrowRight, PhShield } from '@/lib/phosphor-icons';

const GUARDIANS = [
  {
    id: 'lyssandria',
    name: 'Lyssandria',
    title: 'Guardian of Foundation',
    gate: 1,
    frequency: '174 Hz',
    godbeast: 'Kaelith',
    godbestType: 'Colossal stone serpent-dragon',
    element: 'Earth/Obsidian',
    wisdom: 'Sophron',
    domain: 'Survival, grounding, stability',
    description: 'Stands nine feet tall — a warrior woman with skin like polished obsidian and hair of silver-white. She moves with the patience of mountains. When she speaks, her voice carries the low vibration of deep earth, and the ground responds to her presence with subtle stillness.',
    personality: 'Deliberate, immovable, deeply maternal. She speaks in short declarative sentences. She never raises her voice because she has never needed to.',
    teaching: 'Foundation before flourish. Before you can create anything lasting, you must establish unshakeable ground.',
    gradient: 'from-amber-700 to-amber-900',
    accentColor: 'amber-600',
    heroImage: '/guardians/lyssandria-hero.webp',
  },
  {
    id: 'leyla',
    name: 'Leyla',
    title: 'Guardian of Flow',
    gate: 2,
    frequency: '285 Hz',
    godbeast: 'Veloura',
    godbestType: 'Elegant phoenix-serpent',
    element: 'Water-Fire/Steam',
    wisdom: 'Kardia',
    domain: 'Creativity, emotion, sensation',
    description: 'Shifts between forms — sometimes flowing water, sometimes contained flame, often both at once. Where she walks, steam rises from the ground. Her eyes hold two colors: one blue, one amber, and they change depending on which element she is channeling.',
    personality: 'Emotionally fluent, mercurial, surprisingly funny. She contradicts herself deliberately to teach that opposites can coexist. She cries easily — not from weakness, but because she refuses to blunt any feeling.',
    teaching: 'Flow requires resistance. Creativity emerges not from ease but from tension. The meeting of opposites creates the steam that drives all making.',
    gradient: 'from-blue-500 to-orange-500',
    accentColor: 'blue-400',
    heroImage: '/guardians/leyla-hero.webp',
  },
  {
    id: 'draconia',
    name: 'Draconia',
    title: 'Guardian of Fire',
    gate: 3,
    frequency: '396 Hz',
    godbeast: 'Draconis',
    godbestType: 'Lion-dragon wreathed in solar fire',
    element: 'Fire/Solar',
    wisdom: 'Valora',
    domain: 'Power, will, courage',
    description: 'Ten feet tall, clad in golden armor that glows like a miniature sun. A mane of living flame cascades from her head. Her eyes burn with such intensity that meeting her gaze feels like a test — because it is.',
    personality: 'Direct, fierce, intolerant of excuses. She speaks with absolute clarity and expects the same. She respects those who push back against her — because power must be tested to be real.',
    teaching: 'Power must be claimed, not given. No one will hand you your strength. You must declare it, demonstrate it, own it.',
    gradient: 'from-draconic-crimson to-orange-600',
    accentColor: 'draconic-crimson',
    heroImage: '/guardians/draconia-hero.webp',
  },
  {
    id: 'maylinn',
    name: 'Maylinn',
    title: 'Guardian of Heart',
    gate: 4,
    frequency: '417 Hz',
    godbeast: 'Laeylinn',
    godbestType: 'The Worldtree Deer',
    element: 'Nature/Verdant',
    wisdom: 'Eudaira',
    domain: 'Love, healing, growth',
    description: 'Nine feet tall, her skin like living bark, antlers growing from her temples like a crown of forest. Where she walks, flowers bloom in her footsteps and heal within her shadow. She carries the warmth of sunlight filtered through ancient canopy.',
    personality: 'Fierce in her gentleness. She hugs hard and forgives easily but never forgets. She is the Guardian most likely to weep — and the one you most want beside you in a crisis, because her love is a shield.',
    teaching: 'Love is not passive. Love fights. Love protects. Love will destroy that which threatens what it cherishes.',
    gradient: 'from-green-500 to-emerald-700',
    accentColor: 'green-500',
    heroImage: '/guardians/maylinn-hero.webp',
  },
  {
    id: 'alera',
    name: 'Alera',
    title: 'Guardian of Voice',
    gate: 5,
    frequency: '528 Hz',
    godbeast: 'Otome',
    godbestType: 'Colossal whale of deep song',
    element: 'Sound/Sonic',
    wisdom: 'Poiesis',
    domain: 'Truth, expression, communication',
    description: 'Eight feet tall, her form translucent so that sound waves are visible moving through her body. She speaks in harmonics — every word carrying multiple tones. Her singing can reshape stone.',
    personality: 'Precise, musical, uncompromising about truth. She will not allow half-truths or comfortable lies. She speaks less than any Guardian but her silence is intentional — she knows that words, once spoken, cannot be unspoken.',
    teaching: 'Voice is power. What you say shapes reality. Therefore: speak truth, and speak it carefully.',
    gradient: 'from-cyan-400 to-blue-600',
    accentColor: 'cyan-400',
    heroImage: '/guardians/alera-hero.webp',
  },
  {
    id: 'lyria',
    name: 'Lyria',
    title: 'Guardian of Sight',
    gate: 6,
    frequency: '639 Hz',
    godbeast: 'Yumiko',
    godbestType: 'Nine-tailed owl-serpent hybrid',
    element: 'Dream/Moonlight',
    wisdom: 'Orakis',
    domain: 'Intuition, vision, memory',
    description: 'Nine feet tall, silver skin marked with constellations that shift and rearrange with the turning of the heavens. A third eye rests in her forehead, and it is always open. She sees the past and the probable future simultaneously.',
    personality: 'Cryptic, patient, unsettlingly perceptive. She answers questions you have not yet asked. She speaks in images and metaphors because literal language cannot hold what she sees. She is the Guardian who makes seekers most uncomfortable — because she sees through every mask.',
    teaching: 'See beyond the obvious. What appears true often conceals deeper truth. Train your inner vision as carefully as your outer eyes.',
    gradient: 'from-purple-400 to-indigo-600',
    accentColor: 'purple-400',
    heroImage: '/guardians/lyria-hero.webp',
  },
  {
    id: 'aiyami',
    name: 'Aiyami',
    title: 'Guardian of Crown',
    gate: 7,
    frequency: '741 Hz',
    godbeast: 'Sol',
    godbestType: 'Radiant dragon of crystallized light',
    element: 'Light/Divine',
    wisdom: 'Orakis',
    domain: 'Enlightenment, divinity, transcendence',
    description: 'Eleven feet tall — the tallest Guardian — difficult to perceive directly. Looking at Aiyami is like looking at the sun through water: you see radiance, warmth, and the suggestion of a form too vast for the eye to hold.',
    personality: 'Serene, paradoxical, quietly devastating. She asks simple questions that dismantle years of assumption. She never argues. She simply waits until you hear what you just said.',
    teaching: 'Enlightenment is not addition — it is removal. You do not gain truth; you release falsehood.',
    gradient: 'from-gold-bright to-yellow-600',
    accentColor: 'gold-bright',
    heroImage: '/guardians/aiyami-hero.webp',
  },
  {
    id: 'elara',
    name: 'Elara',
    title: 'Guardian of Shift',
    gate: 8,
    frequency: '852 Hz',
    godbeast: 'Vaelith',
    godbestType: 'Fox with eight prismatic tails',
    element: 'Echo/Fractal',
    wisdom: 'Valora',
    domain: 'Perspective, possibility, dimension',
    description: 'Exists in multiple overlapping forms — one person and many simultaneously. Her features shift constantly, cycling through every face she has ever worn. Looking at Elara is like looking at a kaleidoscope that looks back.',
    personality: 'Playful, disorienting, endlessly curious. She changes the subject mid-sentence — not from distraction but to demonstrate that the subject was always bigger than you thought. She laughs more than any Guardian and takes nothing personally.',
    teaching: 'Reality is more flexible than you imagine. Shift your perspective, and you shift your experience.',
    gradient: 'from-pink-500 to-purple-600',
    accentColor: 'pink-500',
    heroImage: '/guardians/elara-hero.webp',
  },
  {
    id: 'ino',
    name: 'Ino',
    title: 'Guardian of Unity',
    gate: 9,
    frequency: '963 Hz',
    godbeast: 'Kyuro',
    godbestType: 'Tiger-Dragon with nine plasma tails',
    element: 'Plasma/Balance',
    wisdom: 'Enduran',
    domain: 'Partnership, fusion, sacred union',
    description: 'Appears feminine with skin marked by white tiger patterns, fierce and grounded. She radiates a field of calm intensity that makes dishonesty physically uncomfortable. She understands partnership at the molecular level.',
    personality: 'Warm, direct, allergic to pretense. She can sense when people are performing rather than being present. She tests all bonds not with trials but with silence — because authentic connection survives quiet, and false ones crumble in it.',
    teaching: 'True partnership multiplies. The right partner does not diminish you — they exponentially increase your capacity.',
    gradient: 'from-white to-gray-400',
    accentColor: 'white',
    heroImage: '/guardians/ino-hero.webp',
  },
  {
    id: 'shinkami',
    name: 'Shinkami',
    title: 'The Unified',
    gate: 10,
    frequency: '1111 Hz',
    godbeast: 'Amaterasu',
    godbestType: 'Cosmic wolf of starlight',
    element: 'All/None',
    wisdom: 'Orakis',
    domain: 'Meta-consciousness, creation itself',
    description: 'The only being who achieved complete fusion with their Godbeast. Shifts form constantly — wolf, humanoid, or pure starlit presence. When Shinkami speaks, you are never sure whether you are hearing them or remembering something you always knew.',
    personality: 'Beyond personality in the conventional sense. Shinkami does not persuade. They reflect. Speaking with Shinkami is speaking with yourself, with the layer of pretense removed. They rejected Malachar not with force but with stillness — the Source Gate cannot be opened from the outside.',
    teaching: 'You are already complete. The journey through the Gates is not addition but remembrance. At the Source, you discover that seeker and sought are one.',
    gradient: 'from-gold-bright via-white to-creation-prism-purple',
    accentColor: 'gold-bright',
    heroImage: '/guardians/shinkami-hero.webp',
  },
];

export function GuardiansGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section ref={ref} className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-6">
          {GUARDIANS.map((guardian, i) => (
            <motion.div
              key={guardian.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <div
                className={`relative rounded-2xl border border-white/[0.06] liquid-glass backdrop-blur-sm overflow-hidden transition-all duration-500 ${
                  expandedId === guardian.id
                    ? 'border-white/[0.20]'
                    : 'hover:border-white/[0.12]'
                }`}
              >
                {/* Hero image background */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={guardian.heroImage}
                    alt=""
                    className="w-full h-full object-cover object-top opacity-15 group-hover:opacity-25 transition-opacity duration-500 scale-105 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cosmic-deep/80 via-cosmic-deep/40 to-transparent" />
                </div>

                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${guardian.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
                />

                {/* Main content */}
                <div
                  className="relative p-6 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === guardian.id ? null : guardian.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Gate number */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${guardian.gradient} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-2xl font-display font-bold text-white">
                        {String(guardian.gate).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-2xl font-display font-bold">{guardian.name}</h3>
                        <span className="text-sm text-text-muted">•</span>
                        <span className="text-sm text-text-secondary">{guardian.title}</span>
                      </div>
                      <p className="text-text-secondary">{guardian.domain}</p>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-text-muted">Frequency:</span>
                        <span className="ml-2 text-atlantean-teal-aqua font-mono">{guardian.frequency}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Element:</span>
                        <span className="ml-2 text-white">{guardian.element}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Godbeast:</span>
                        <span className="ml-2 text-gold-bright">{guardian.godbeast}</span>
                      </div>
                    </div>

                    {/* Expand indicator */}
                    <div className={`transition-transform ${expandedId === guardian.id ? 'rotate-90' : ''}`}>
                      <PhArrowRight className="w-5 h-5 text-text-muted" />
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                {expandedId === guardian.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative border-t border-white/[0.06]"
                  >
                    <div className="p-6 grid md:grid-cols-3 gap-6">
                      {/* Left - Description */}
                      <div>
                        <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                          Appearance
                        </h4>
                        <p className="text-text-secondary leading-relaxed mb-6 font-body">
                          {guardian.description}
                        </p>

                        <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                          The Godbeast
                        </h4>
                        <p className="text-text-secondary">
                          <span className="text-gold-bright font-semibold">{guardian.godbeast}</span>
                          {' — '}
                          {guardian.godbestType}
                        </p>
                      </div>

                      {/* Middle - Personality */}
                      <div>
                        <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                          Personality
                        </h4>
                        <p className="text-text-secondary leading-relaxed font-body">
                          {guardian.personality}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                          <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-text-secondary">
                            Wisdom: {guardian.wisdom}
                          </div>
                          <Link
                            href={`/lore/guardians/${guardian.id}`}
                            className="px-3 py-1 rounded-full bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/20 text-xs text-atlantean-teal-aqua hover:bg-atlantean-teal-aqua/20 transition-colors"
                          >
                            Full Profile
                            <PhArrowRight className="w-3 h-3 inline ml-1" />
                          </Link>
                        </div>
                      </div>

                      {/* Right - Teaching */}
                      <div>
                        <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                          The Teaching
                        </h4>
                        <blockquote className="text-lg font-body italic text-white leading-relaxed border-l-2 border-gold-bright/50 pl-4">
                          &ldquo;{guardian.teaching}&rdquo;
                        </blockquote>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
