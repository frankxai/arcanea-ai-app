'use client';

import { useRef } from 'react';
import { LiquidGlass } from '@/components/motion/liquid-glass';
import { AnimatedBeam } from '@/components/motion/animated-beam';

interface Layer {
  title: string;
  subtitle: string;
  accent: string;
  description: string;
  stats: string[];
  features: string[];
}

/**
 * Animated ecosystem architecture: 3 layer cards connected by flowing beams.
 * Beams animate from Product → Intelligence → Open Source, showing the
 * data flow through the stack.
 */
export function LayerCards({ layers }: { layers: Layer[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  const refs = [card0Ref, card1Ref, card2Ref];

  return (
    <div ref={containerRef} className="relative grid lg:grid-cols-3 gap-5">
      {layers.map((layer, i) => (
        <div key={layer.title} ref={refs[i]}>
          <LiquidGlass
            intensity="standard"
            tint={layer.accent}
            className="group relative rounded-2xl border border-white/[0.06] hover:border-white/[0.14] transition-colors p-6 sm:p-8 h-full"
          >
            <div className="relative">
              <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: `${layer.accent}99` }}>
                {layer.subtitle}
              </p>
              <h3 className="text-xl font-display font-bold mb-3" style={{ color: layer.accent }}>
                {layer.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed mb-5">{layer.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {layer.stats.map((s) => (
                  <div key={s} className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                    <p className="text-[11px] text-white/50 font-mono">{s}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {layer.features.map((f) => (
                  <span
                    key={f}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full border"
                    style={{
                      color: `${layer.accent}cc`,
                      borderColor: `${layer.accent}30`,
                      backgroundColor: `${layer.accent}08`,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </LiquidGlass>
        </div>
      ))}

      {/* Beam: Product → Intelligence (left to middle) */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={card0Ref}
        toRef={card1Ref}
        fromColor={layers[0]?.accent ?? '#00bcd4'}
        toColor={layers[1]?.accent ?? '#a78bfa'}
        duration={4}
        delay={0}
      />
      {/* Beam: Intelligence → Open Source (middle to right) */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={card1Ref}
        toRef={card2Ref}
        fromColor={layers[1]?.accent ?? '#a78bfa'}
        toColor={layers[2]?.accent ?? '#ffd700'}
        duration={4}
        delay={1}
      />
    </div>
  );
}
