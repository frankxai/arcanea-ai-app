'use client';

import Link from 'next/link';
import { TEAMS, type Luminor } from './luminors-data';

export function LuminorPortrait({ luminor }: { luminor: Luminor }) {
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
