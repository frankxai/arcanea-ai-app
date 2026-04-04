'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock } from '@/lib/phosphor-icons';
import type { ComponentType } from 'react';

interface Gate {
  n: number;
  name: string;
  god: string;
  beast: string;
  domain: string;
  color: string;
  icon: ComponentType<{ className?: string; style?: React.CSSProperties; weight?: string }>;
  locked?: boolean;
}

export function GateGrid({ gates }: { gates: Gate[] }) {
  const [hoveredGate, setHoveredGate] = useState<number | null>(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {gates.map((gate) => {
        const Icon = gate.icon;
        const isHovered = hoveredGate === gate.n;
        return (
          <Link
            key={gate.n}
            href={`/academy/gates/${gate.name.toLowerCase()}`}
            onMouseEnter={() => setHoveredGate(gate.n)}
            onMouseLeave={() => setHoveredGate(null)}
            className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.05]"
            style={{
              boxShadow: isHovered ? `0 0 40px ${gate.color}20, inset 0 1px 0 ${gate.color}15` : 'none',
            }}
          >
            {/* Top accent line on hover */}
            <div
              className="absolute left-4 right-4 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: `linear-gradient(90deg, transparent, ${gate.color}, transparent)` }}
            />

            <div className="mb-4 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${gate.color}12`, border: `1px solid ${gate.color}25` }}
              >
                <Icon className="h-5 w-5" style={{ color: gate.color }} weight="fill" />
              </div>
              <div className="flex items-center gap-2">
                {gate.locked && <Lock className="h-3.5 w-3.5 text-white/20" />}
              </div>
            </div>

            <div className="mb-1 flex items-center gap-2">
              <span
                className="font-mono text-xs font-bold"
                style={{ color: gate.color }}
              >
                {String(gate.n).padStart(2, '0')}
              </span>
              <h3
                className="font-display text-base font-semibold transition-colors"
                style={{ color: gate.color }}
              >
                {gate.name}
              </h3>
            </div>

            <p className="mb-3 text-[11px] leading-relaxed text-white/40">
              {gate.domain}
            </p>

            <div className="border-t border-white/[0.05] pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/30">Guardian</p>
                  <p className="text-xs font-medium text-white/70">{gate.god}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/30">Godbeast</p>
                  <p className="text-xs font-medium text-white/70">{gate.beast}</p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
