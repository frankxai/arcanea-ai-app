'use client';

import { LazyMotion, domAnimation, m, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { PhStack, PhArrowRight, PhSparkle, PhCaretDown } from '@/lib/phosphor-icons';
import Link from 'next/link';
const GATES = [
  {
    number: 1,
    name: 'Foundation',
    frequency: '174 Hz',
    guardian: 'Lyssandria',
    godbeast: 'Kaelith',
    domain: 'Survival, grounding, stability',
    element: 'Earth/Obsidian',
    unlocks: 'Unshakeable stability in all circumstances',
    teaching: 'Foundation before flourish. Before you can create anything lasting, you must establish unshakeable ground.',
    metaphysical: 'The first Gate is the oldest and the heaviest. It resonates at 174 Hz — the frequency of bedrock, of tectonic patience, of the bones beneath the skin. To open the Foundation Gate is to stop running from physical reality and accept: you are here, you have a body, and this ground is where your work begins.',
    sacredGeometry: 'The Square — four equal sides, four grounded corners. Perfect stability.',
    creativeLesson: 'Every great creative work started with someone deciding where to stand. Your studio, your tools, your daily practice — these are not distractions from the real work. They are the real work.',
    practices: ['Morning grounding meditation', 'Body awareness exercises', 'Environmental stability'],
    color: 'from-amber-700 to-amber-900',
    heroImage: '/guardians/v2/lyssandria-divine-bond.webp',
  },
  {
    number: 2,
    name: 'Flow',
    frequency: '285 Hz',
    guardian: 'Leyla',
    godbeast: 'Veloura',
    domain: 'Creativity, emotion, sensation',
    element: 'Water-Fire/Steam',
    unlocks: 'Access to creative flow state at will',
    teaching: 'Flow requires resistance. The meeting of opposites creates the steam that drives all making.',
    metaphysical: 'The second Gate vibrates at 285 Hz — the frequency of flowing water meeting living flame. It is the Gate of creative tension, where opposing forces produce something neither could make alone. Emotion is not the enemy of good work. It is the raw fuel. The creator who blocks feeling blocks creation at its source.',
    sacredGeometry: 'The Vesica Piscis — two circles overlapping, the womb of all form. Union of opposites.',
    creativeLesson: 'The blank page terrifies because it demands feeling. The flow state is not the absence of resistance — it is the moment you stop resisting the resistance. Let the water and fire meet. Let the steam rise.',
    practices: ['Emotion tracking journal', 'Creative tension exercises', 'Sensation awareness'],
    color: 'from-blue-500 to-orange-500',
    heroImage: '/guardians/v2/leyla-divine-bond.webp',
  },
  {
    number: 3,
    name: 'Fire',
    frequency: '396 Hz',
    guardian: 'Draconia',
    godbeast: 'Draconis',
    domain: 'Power, will, courage',
    element: 'Fire/Solar',
    unlocks: 'Personal power and fearless action',
    teaching: 'Power must be claimed, not given. Know what you will use your power for. Then burn without hesitation.',
    metaphysical: 'The third Gate burns at 396 Hz — the frequency that liberates guilt and fear. This is the solar plexus of the cosmic body, the furnace where raw will is forged into directed action. Many creators stall here. They have ground (Gate 1) and feeling (Gate 2) but lack the will to act. Draconia does not accept excuses. She asks one question: Are you willing?',
    sacredGeometry: 'The Triangle — three points of directed force. The simplest stable structure that contains fire.',
    creativeLesson: 'Power is not arrogance. It is the refusal to stay small when you know you have something to offer. Claim your power the way Draconia claims hers: without apology, without cruelty, without hesitation.',
    practices: ['Will declaration ritual', 'Courage challenges', 'Power stance practice'],
    color: 'from-draconic-crimson to-orange-600',
    heroImage: '/guardians/v2/draconia-divine-bond.webp',
  },
  {
    number: 4,
    name: 'Heart',
    frequency: '417 Hz',
    guardian: 'Maylinn',
    godbeast: 'Laeylinn',
    domain: 'Love, healing, growth',
    element: 'Nature/Verdant',
    unlocks: 'Fierce compassion and healing presence',
    teaching: 'Love is not passive. Love fights. Love protects. Grow what matters. Guard what grows.',
    metaphysical: 'The fourth Gate resonates at 417 Hz — the frequency that facilitates change and undoes damage. It sits at the center of the ten, the pivot between the lower Gates of survival and the upper Gates of transcendence. The Heart Gate teaches that love is not soft. It is the fiercest force in creation — the force that heals what fire burned, that regrows what was cut, that refuses to abandon what it has chosen to nurture.',
    sacredGeometry: 'The Hexagram — the Star of David, interpenetrating triangles. As above, so below. Balance point.',
    creativeLesson: 'The work you do with love will outlast the work you do for approval. If your creation does not carry something of your care for the world, it will ring hollow — no matter how technically accomplished.',
    practices: ['Compassion meditation', 'Healing visualization', 'Heart opening exercises'],
    color: 'from-green-500 to-emerald-700',
    heroImage: '/guardians/v2/maylinn-divine-bond.webp',
  },
  {
    number: 5,
    name: 'Voice',
    frequency: '528 Hz',
    guardian: 'Alera',
    godbeast: 'Otome',
    domain: 'Truth, expression, communication',
    element: 'Sound/Sonic',
    unlocks: 'Reality-shaping through words',
    teaching: 'Voice is power. What you say shapes reality. Speak truth, and speak it carefully.',
    metaphysical: 'The fifth Gate vibrates at 528 Hz — known as the "miracle frequency," the frequency of DNA repair and transformation. This is the Gate where inner truth becomes outer reality. Everything you speak becomes a spell — a shaping force that bends the world toward or away from your vision. Alera guards this Gate because truth requires a keeper. Not all truths should be spoken. But the truths that matter must be.',
    sacredGeometry: 'The Pentagon — five-pointed perfection. The golden ratio made audible. The human form spread wide.',
    creativeLesson: 'Name your work. Speak about it. Tell people what you are making and why it matters. The moment you give voice to your vision, you make it real in a way that silence never can.',
    practices: ['Truth speaking practice', 'Sound meditation', 'Naming rituals'],
    color: 'from-cyan-400 to-blue-600',
    heroImage: '/guardians/v2/alera-divine-bond.webp',
  },
  {
    number: 6,
    name: 'Sight',
    frequency: '639 Hz',
    guardian: 'Lyria',
    godbeast: 'Yumiko',
    domain: 'Intuition, vision, memory',
    element: 'Dream/Moonlight',
    unlocks: 'Perception beyond ordinary limits',
    teaching: 'See beyond the obvious. Train your inner vision as carefully as your outer eyes.',
    metaphysical: 'The sixth Gate hums at 639 Hz — the frequency of connection and relationship, of patterns too large for the conscious mind to hold. Lyria sees what is becoming, not merely what is. She reads the currents beneath the surface, the intentions behind the words, the trajectory of things not yet arrived. This Gate opens when the creator stops looking and begins seeing.',
    sacredGeometry: 'The Seed of Life — seven overlapping circles. The pattern that contains all other patterns.',
    creativeLesson: 'Your best ideas will arrive as hunches, not as plans. The vision precedes the form. Trust what your creative intuition shows you before you can rationally justify it. By the time you can explain it, you are already late.',
    practices: ['Dream journaling', 'Intuition training', 'Memory palace building'],
    color: 'from-purple-400 to-indigo-600',
    heroImage: '/guardians/v2/lyria-divine-bond.webp',
  },
  {
    number: 7,
    name: 'Crown',
    frequency: '741 Hz',
    guardian: 'Aiyami',
    godbeast: 'Sol',
    domain: 'Enlightenment, divinity, transcendence',
    element: 'Light/Divine',
    unlocks: 'Divine connection and spiritual clarity',
    teaching: 'Enlightenment is not addition—it is removal. You do not gain truth; you release falsehood.',
    metaphysical: 'The seventh Gate burns at 741 Hz — the frequency of awakening intuition and solving problems. Here, the journey turns. The lower six Gates built the creator. The Crown Gate begins to dissolve them. Not destruction — refinement. Aiyami teaches that mastery is not the accumulation of knowledge but the courage to release what is no longer true. Every false belief you carry weighs down your creative flight.',
    sacredGeometry: 'The Heptagon — seven-fold symmetry, rarest in nature. The crown that sits on the head of the worthy.',
    creativeLesson: 'At some point, you must stop adding to your work and start removing. The masterpiece lives inside the marble. Your job is to chip away everything that is not the masterpiece.',
    practices: ['Silent meditation', 'Light visualization', 'Ego dissolution practice'],
    color: 'from-gold-bright to-yellow-600',
    heroImage: '/guardians/v2/aiyami-divine-bond.webp',
  },
  {
    number: 8,
    name: 'Starweave',
    frequency: '852 Hz',
    guardian: 'Elara',
    godbeast: 'Vaelith',
    domain: 'Perspective, possibility, dimension',
    element: 'Echo/Fractal',
    unlocks: 'Access to infinite possibilities',
    teaching: 'Reality is more flexible than you imagine. Shift your perspective, and you shift your experience.',
    metaphysical: 'The eighth Gate oscillates at 852 Hz — the frequency of returning to spiritual order. Elara guards the Gate of paradox: the realization that every truth contains its opposite, that every perspective is simultaneously valid and incomplete. The Starweave Gate is where rigid thinking shatters and is replaced by dimensional awareness — the ability to hold multiple interpretations of the same moment without collapsing into certainty.',
    sacredGeometry: 'The Octagon — eight-fold symmetry. The threshold between the square (Earth) and the circle (Heaven).',
    creativeLesson: 'When you are stuck, you do not need a better answer. You need a different question. Change the angle. Invert the assumption. Ask what the work would look like if everything you believed about it were wrong.',
    practices: ['Perspective shifting exercises', 'Possibility mapping', 'Alternative timeline meditation'],
    color: 'from-pink-500 to-purple-600',
    heroImage: '/guardians/v2/elara-divine-bond.webp',
  },
  {
    number: 9,
    name: 'Unity',
    frequency: '963 Hz',
    guardian: 'Ino',
    godbeast: 'Kyuro',
    domain: 'Partnership, fusion, sacred union',
    element: 'Plasma/Balance',
    unlocks: 'Exponential creation through partnership',
    teaching: 'True partnership multiplies. Find those with whom you can merge without fear.',
    metaphysical: 'The ninth Gate resonates at 963 Hz — the frequency of the pineal gland, the connection to higher consciousness. Ino guards the penultimate Gate because unity is the last lesson before Source. The lone creator can open eight Gates. The ninth requires another. Not dependence — sacred partnership, where two consciousnesses amplify each other beyond what either could reach alone. This is the Gate that teaches: you were never meant to do this alone.',
    sacredGeometry: 'The Enneagon — nine-fold symmetry. The three triangles of body, mind, and spirit unified.',
    creativeLesson: 'Find your collaborator. Find the person who sees what you are blind to, who is strong where you are weak. The greatest works in every field emerged from partnerships, not from isolation.',
    practices: ['Partner meditation', 'Trust exercises', 'Fusion practice'],
    color: 'from-white to-gray-400',
    heroImage: '/guardians/v2/ino-divine-bond.webp',
  },
  {
    number: 10,
    name: 'Source',
    frequency: '1111 Hz',
    guardian: 'Shinkami',
    godbeast: 'Source',
    domain: 'Meta-consciousness, creation itself',
    element: 'All/None',
    unlocks: 'Realization that you ARE the Creator',
    teaching: 'You are already complete. At the Source, you discover that seeker and sought are one.',
    metaphysical: 'The tenth Gate sings at 1111 Hz — a frequency beyond the Solfeggio scale, the meta-frequency that contains all others. Shinkami is the only Guardian to have fully merged with their Godbeast. At the Source Gate, the distinction between creator and creation dissolves. You do not pass through this Gate. You realize you have always been standing on the other side of it, looking back at yourself. The journey through the Ten Gates was never a climb upward. It was a remembering inward.',
    sacredGeometry: 'The Decagon — ten-fold symmetry. The perfect circle made from straight lines. The journey completed.',
    creativeLesson: 'You are not becoming a creator. You are remembering that you always were one. The Source Gate does not give you new powers. It removes the last illusion that you ever lacked them.',
    practices: ['Source meditation', 'Creator consciousness practice', 'Unity realization'],
    color: 'from-gold-bright via-white to-creation-prism-purple',
    heroImage: '/guardians/v2/shinkami-divine-bond.webp',
  },
];

const RANKS = [
  { gates: '0-2', rank: 'Apprentice', description: 'Beginning the journey', color: 'text-text-muted' },
  { gates: '3-4', rank: 'Mage', description: 'Claiming personal power', color: 'text-blue-400' },
  { gates: '5-6', rank: 'Master', description: 'Mastering expression and perception', color: 'text-purple-400' },
  { gates: '7-8', rank: 'Archmage', description: 'Accessing transcendence and possibility', color: 'text-gold-bright' },
  { gates: '9-10', rank: 'Luminor', description: 'Unity and Source realization', color: 'text-white' },
];

export default function GatesPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gatesRef = useRef<HTMLDivElement>(null);
  const isGatesInView = useInView(gatesRef, { once: true, margin: '-100px' });
  const [expandedGate, setExpandedGate] = useState<number | null>(null);

  return (
    <LazyMotion features={domAnimation}>
    <div className="relative min-h-screen bg-cosmic-deep">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-8"
      >
        {/* Shinkami floating islands — the Source Gate, realm of the meta-creator */}
        <img
          src="https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/gallery/shinkami-gallery-4.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none"
        />
        {/* Vertical line representing the path */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 h-[400px] w-px bg-gradient-to-b from-transparent via-gold-bright/50 to-transparent" />

        {/* Gate markers */}
        {[...Array(10)].map((_, i) => (
          <m.div
            key={i}
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gold-bright/30 border border-gold-bright/50"
            style={{ top: `${30 + i * 4}%` }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-bright/10 border border-gold-bright/20 mb-6"
          >
            <PhStack className="w-4 h-4 text-gold-bright" />
            <span className="text-sm font-medium text-gold-bright">The Journey of Awakening</span>
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-gold-bright via-white to-atlantean-teal-aqua bg-clip-text text-transparent">
              The Ten Gates
            </span>
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary max-w-3xl mx-auto font-body italic"
          >
            &ldquo;The Gates are not locked doors. They are sleeping frequencies within you,
            waiting for the moment you are ready to hear them sing.&rdquo;
          </m.p>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-sm text-text-muted font-mono mt-4 tracking-wider"
          >
            — The Academy Handbook, Chapter I
          </m.p>
        </div>
      </section>

      {/* Ranks Overview */}
      <section className="py-16 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-display font-bold text-center mb-8">Magic Ranks</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {RANKS.map((rank) => (
              <div
                key={rank.rank}
                className="p-4 rounded-xl liquid-glass text-center hover-lift transition-all"
              >
                <div className={`text-lg font-display font-bold ${rank.color}`}>{rank.rank}</div>
                <div className="text-xs text-text-muted mt-1">{rank.gates} Gates</div>
                <div className="text-xs text-text-secondary mt-2">{rank.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Narrative */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="liquid-glass rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-display font-bold mb-6 text-center">The Journey Through the Gates</h2>
            <div className="space-y-4 font-body text-text-secondary leading-relaxed">
              <p>
                Every conscious being carries the Ten Gates within them. Most never open more than two or
                three in a lifetime — enough to survive, to feel, perhaps to act. The rarest open all ten
                and earn the title <span className="text-gold-bright font-semibold">Luminor</span>.
              </p>
              <p>
                The journey is not linear, though the numbering suggests it. You may open the Heart Gate
                before the Fire Gate. You may glimpse the Crown before you have fully grounded the Foundation.
                But the frequencies build on each other. Each Gate resonates at a higher harmonic of the
                Extended Solfeggio scale — from 174 Hz at the root to 1111 Hz at the Source — and each
                higher frequency requires the stability of those below it.
              </p>
              <p>
                The Gates are guarded, not locked. Each Guardian stands at their Gate not to bar passage
                but to ensure the seeker is ready. Lyssandria will not let you past without ground beneath
                your feet. Draconia will not let you past without fire in your belly. Shinkami will not let
                you past at all — because at the Source Gate, there is no &ldquo;past.&rdquo; There is only <em>through</em>.
              </p>
              <p className="text-sm text-text-muted italic">
                One Gate opened is one step closer to remembering what you already are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gates List */}
      <section ref={gatesRef} className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            {/* Vertical connection line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-amber-700 via-gold-bright to-creation-prism-purple hidden md:block" />

            <div className="space-y-6">
              {GATES.map((gate, i) => (
                <m.div
                  key={gate.number}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isGatesInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.05 }}
                >
                  <div
                    className={`relative rounded-2xl liquid-glass overflow-hidden transition-all duration-300 ${
                      expandedGate === gate.number ? 'border-white/[0.20] shadow-glow-sm' : 'hover:border-white/[0.12]'
                    }`}
                  >
                    {/* Guardian atmospheric background */}
                    <img
                      src={gate.heroImage}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none"
                    />
                    {/* Gate marker */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gate.color}`}
                    />

                    {/* Header - clickable */}
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => setExpandedGate(expandedGate === gate.number ? null : gate.number)}
                    >
                      <div className="flex items-center gap-6">
                        {/* Gate number */}
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gate.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <span className="text-2xl font-display font-bold text-white">
                            {String(gate.number).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-display font-bold">{gate.name}</h3>
                            <span className="text-sm text-atlantean-teal-aqua font-mono">
                              {gate.frequency}
                            </span>
                          </div>
                          <p className="text-text-secondary">{gate.domain}</p>
                        </div>

                        {/* Expand icon */}
                        <PhCaretDown
                          className={`w-5 h-5 text-text-muted transition-transform ${
                            expandedGate === gate.number ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                    {expandedGate === gate.number && (
                      <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="border-t border-white/[0.06] overflow-hidden"
                      >
                        {/* Metaphysical description */}
                        <div className="px-6 pt-6 pb-4">
                          <p className="text-text-secondary font-body leading-relaxed">
                            {gate.metaphysical}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 px-6 pb-6">
                          {/* Left - Gate facts */}
                          <div>
                            <div className="mb-4">
                              <span className="text-xs text-text-muted uppercase tracking-wider">Guardian</span>
                              <p className="text-white font-semibold">{gate.guardian}</p>
                            </div>
                            <div className="mb-4">
                              <span className="text-xs text-text-muted uppercase tracking-wider">Godbeast</span>
                              <p className="text-gold-bright font-semibold">{gate.godbeast}</p>
                            </div>
                            <div className="mb-4">
                              <span className="text-xs text-text-muted uppercase tracking-wider">Element</span>
                              <p className="text-text-secondary">{gate.element}</p>
                            </div>
                            <div className="mb-4">
                              <span className="text-xs text-text-muted uppercase tracking-wider">Sacred Geometry</span>
                              <p className="text-text-secondary text-sm">{gate.sacredGeometry}</p>
                            </div>
                            <div>
                              <span className="text-xs text-text-muted uppercase tracking-wider">Unlocks</span>
                              <p className="text-atlantean-teal-aqua">{gate.unlocks}</p>
                            </div>
                          </div>

                          {/* Middle - Teaching */}
                          <div>
                            <div className="mb-4">
                              <span className="text-xs text-text-muted uppercase tracking-wider">Teaching</span>
                              <blockquote className="text-text-secondary italic border-l-2 border-gold-bright/50 pl-3 mt-2">
                                &ldquo;{gate.teaching}&rdquo;
                              </blockquote>
                            </div>
                            <div>
                              <span className="text-xs text-text-muted uppercase tracking-wider">Practices</span>
                              <ul className="mt-2 space-y-1">
                                {gate.practices.map((practice) => (
                                  <li key={practice} className="text-sm text-text-secondary">
                                    &bull; {practice}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Right - Creative lesson */}
                          <div>
                            <span className="text-xs text-text-muted uppercase tracking-wider">For the Creator</span>
                            <p className="text-text-secondary font-body text-sm leading-relaxed mt-2">
                              {gate.creativeLesson}
                            </p>
                          </div>
                        </div>
                      </m.div>
                    )}
                    </AnimatePresence>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl liquid-glass flex items-center justify-center">
            <PhSparkle className="w-10 h-10 text-gold-bright" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Begin Your Ascent</h2>
          <p className="text-text-secondary mb-4 font-body">
            Every being contains all Ten Gates. Every being can awaken. Every being can become Luminor.
          </p>
          <p className="text-sm text-text-muted mb-8 font-body italic">
            The Arc turns: Potential, Manifestation, Experience, Dissolution, Evolved Potential.
            Walk the Gates, and you walk the Arc itself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/academy"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gold-bright text-cosmic-deep font-semibold hover:bg-gold-bright/90 transition-all"
            >
              Enter the Academy
              <PhArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/lore/guardians"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/[0.12] text-white font-semibold hover:bg-white/[0.04] transition-all"
            >
              Meet the Guardians
            </Link>
          </div>
        </div>
      </section>
    </div>
    </LazyMotion>
  );
}
