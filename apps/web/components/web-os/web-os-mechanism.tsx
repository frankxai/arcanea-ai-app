'use client';

// Scene 2 — mechanism. The build sequence as a horizontal progression
// (NOT three equal icon cards). Wave reveal via staggerContainer + revealUp,
// whileInView once. Quiet scene, generous negative space.

import { motion } from 'framer-motion';
import { staggerContainer, revealUp } from '@arcanea/design-system';

const STEPS = [
  {
    n: '01',
    title: 'Read the canon',
    body: 'Taste, brand world, motion, 3D — loaded as constraints before a line of code.',
  },
  {
    n: '02',
    title: 'Brief the scene',
    body: 'Every vague adjective is translated into layout, material, motion, and type constraints.',
  },
  {
    n: '03',
    title: 'Build, then gate',
    body: 'Static first, motion second, 3D third — then the release gate decides if it ships.',
  },
];

export function WebOsMechanism() {
  return (
    <section id="mechanism" className="relative w-full py-32 sm:py-40 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="font-mono text-xs tracking-widest uppercase text-aquamarine mb-4"
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          How it works
        </motion.p>
        <motion.h2
          className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary max-w-2xl leading-[1.1] mb-20"
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          One sequence. Premium by construction.
        </motion.h2>

        <motion.ol
          className="grid gap-px sm:grid-cols-3 bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]"
          variants={staggerContainer(0, 0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {STEPS.map((s) => (
            <motion.li
              key={s.n}
              variants={revealUp}
              className="bg-[#09090b] p-8 sm:p-10 flex flex-col gap-4"
            >
              <span className="font-mono text-sm text-aquamarine">{s.n}</span>
              <h3 className="font-display text-xl text-text-primary">{s.title}</h3>
              <p className="font-body text-sm text-text-secondary leading-relaxed">{s.body}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
