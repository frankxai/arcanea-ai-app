'use client';

import { useRef } from 'react';
import { LazyMotion, domAnimation, m, useScroll, useTransform } from 'framer-motion';
import { EASE, VIEWPORT } from '@/lib/motion';

const LAYERS = [
  { name: 'Perception', desc: 'Captures raw context from any AI interaction', color: '#34d399' },
  { name: 'Classification', desc: 'Routes insights to the right vault with confidence scoring', color: '#60a5fa' },
  { name: 'Storage', desc: 'Writes to semantic vaults as local JSONL files', color: '#a78bfa' },
  { name: 'Retrieval', desc: 'Recalls relevant memories via MCP tools or API', color: '#fbbf24' },
  { name: 'Synthesis', desc: 'Compounds insights across sessions into new understanding', color: '#f472b6' },
];

/**
 * Animated 5-layer architecture diagram — SVG connector lines draw in as you scroll,
 * layer cards slide in staggered with blur-to-focus.
 */
export function SisArchitecture() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'end 40%'],
  });
  const lineLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <LazyMotion features={domAnimation}>
      <div ref={ref} className="relative">
        <h2 className="text-[10px] font-mono tracking-[0.25em] text-[#708094] mb-8 uppercase">
          Cognitive Architecture
        </h2>

        <div className="relative space-y-3">
          {/* Animated connector line that draws down */}
          <svg
            className="absolute left-[20px] top-[24px] bottom-[24px] w-[1px] overflow-visible pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 1 100"
          >
            <m.line
              x1="0.5"
              x2="0.5"
              y1="0"
              y2="100"
              stroke="url(#sis-gradient)"
              strokeWidth="1"
              style={{ pathLength: lineLength, opacity: lineLength }}
            />
            <defs>
              <linearGradient id="sis-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
                <stop offset="25%" stopColor="#60a5fa" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.6" />
                <stop offset="75%" stopColor="#fbbf24" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#f472b6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>

          {LAYERS.map((layer, i) => (
            <m.div
              key={layer.name}
              initial={{ opacity: 0, x: -16, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE.smooth, delay: i * 0.08 }}
              className="relative flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
            >
              <div
                className="relative w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold z-10"
                style={{
                  backgroundColor: `${layer.color}18`,
                  color: layer.color,
                  boxShadow: `0 0 20px ${layer.color}20`,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#e6eefc] tracking-tight">{layer.name}</p>
                <p className="text-xs text-[#708094] mt-0.5">{layer.desc}</p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </LazyMotion>
  );
}
