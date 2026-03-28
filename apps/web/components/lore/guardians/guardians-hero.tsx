'use client';

import { m } from 'framer-motion';
import { PhShield } from '@/lib/phosphor-icons';

export function GuardiansHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-atlantean-teal-aqua/10 via-transparent to-transparent" />

        {[...Array(10)].map((_, i) => {
          const angle = (i / 10) * Math.PI * 2;
          const radius = 300;
          const x = (Math.cos(angle) * radius).toFixed(3);
          const y = (Math.sin(angle) * radius).toFixed(3);
          const orbColor = `hsl(${i * 36}, 70%, 50%)`;

          return (
            <m.div
              key={i}
              className="absolute w-4 h-4 rounded-full"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                backgroundColor: orbColor,
                boxShadow: `0 0 20px ${orbColor}`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/20 mb-6">
          <PhShield className="w-4 h-4 text-atlantean-teal-aqua" />
          <span className="text-sm font-medium text-atlantean-teal-aqua">
            Keepers of the Gates
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
          <span className="bg-gradient-to-r from-atlantean-teal-aqua via-white to-gold-bright bg-clip-text text-transparent">
            The Ten Guardians
          </span>
        </h1>

        <p className="text-xl text-text-secondary max-w-3xl mx-auto font-body italic mb-4">
          &ldquo;They are not merely powerful. They are the Ten who chose to stand
          between creation and dissolution — each one an axis upon which
          existence turns.&rdquo;
        </p>

        <p className="text-sm text-text-muted font-mono tracking-wider mb-8">
          — Legends of Arcanea, Book III
        </p>

        <p className="text-base text-text-secondary max-w-2xl mx-auto font-body">
          The Ten Guardians are not gods in the petitioning sense. They do not
          grant wishes. They guard the Gates of awakening and demand that those
          who pass through have earned the passage. Each carries a unique
          teaching, a bonded Godbeast, and a frequency that resonates through
          all of creation.
        </p>
      </div>
    </section>
  );
}
