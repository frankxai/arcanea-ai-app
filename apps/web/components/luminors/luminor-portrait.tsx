'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TEAMS, type Luminor } from './luminors-data';
import { TiltCard } from '@/components/motion/tilt-card';

export function LuminorPortrait({ luminor }: { luminor: Luminor }) {
  const team = TEAMS[luminor.team];

  return (
    <Link
      href={`/luminors/${luminor.id}`}
      className="group flex-shrink-0 snap-center block w-44 md:w-52"
    >
      <TiltCard intensity={6}>
        <div className="relative rounded-2xl overflow-hidden">
          {/* Border glow */}
          <div
            className="absolute inset-0 rounded-2xl border border-white/[0.06] group-hover:border-white/[0.18] transition-all duration-500 z-20 pointer-events-none"
            style={{ boxShadow: `0 0 0 0 ${team.color}00` }}
          />

          {/* Image */}
          <div className="aspect-[3/4] bg-[#1a2332] relative">
            <Image
              src={luminor.image}
              alt={luminor.name}
              fill
              sizes="(max-width: 768px) 176px, 208px"
              className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
              loading="lazy"
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/20 to-transparent z-10 pointer-events-none" />

          {/* Team color accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ backgroundColor: team.color, boxShadow: `0 0 20px ${team.color}` }}
          />

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="font-display font-bold text-white text-lg leading-tight tracking-tight">
              {luminor.name}
            </h3>
            <p className="text-[11px] text-white/45 mt-0.5">{luminor.title}</p>
            <div className="flex items-center justify-between mt-2">
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                style={{ color: team.color, backgroundColor: `${team.color}15` }}
              >
                {team.label}
              </span>
              <span className="text-[10px] text-[#00bcd4]/60 font-mono">{luminor.frequency}</span>
            </div>
          </div>
        </div>
      </TiltCard>
    </Link>
  );
}
