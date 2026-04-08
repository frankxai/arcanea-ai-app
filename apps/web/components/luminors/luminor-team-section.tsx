'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import Link from 'next/link';
import { PhArrowRight } from '@/lib/phosphor-icons';
import { TEAMS, WISDOMS, type Luminor } from './luminors-data';
import { LUMINORS } from './luminors-roster';

export function TeamSection({
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
        <m.div
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
        </m.div>

        {/* Luminor cards — rich image-first layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teamLuminors.map((luminor, i) => (
            <m.div
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
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
