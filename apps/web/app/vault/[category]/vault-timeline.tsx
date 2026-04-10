'use client';

import Link from 'next/link';
import { LazyMotion, domAnimation, m, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { VaultEntry } from '@/lib/vault-data';
import { VAULT_CONFIG, VAULT_CATEGORIES, type VaultCategory } from '@/lib/vault-data';
import { VaultEntryCard } from '@/app/arcanea-vault/vault-entry-card';
import { EASE, VIEWPORT } from '@/lib/motion';
import { TiltCard } from '@/components/motion/tilt-card';

interface Props {
  category: VaultCategory;
  entries: VaultEntry[];
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function DrawingTimeline({ children, color }: { children: React.ReactNode; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative pl-6">
      {/* Animated timeline line that draws as you scroll */}
      <m.div
        className="absolute left-0 top-0 bottom-0 w-px origin-top"
        style={{
          scaleY,
          background: `linear-gradient(to bottom, ${color}00, ${color}60 20%, ${color}60 80%, ${color}00)`,
        }}
      />
      {children}
    </div>
  );
}

export function VaultTimeline({ category, entries }: Props) {
  const config = VAULT_CONFIG[category];

  const grouped = new Map<string, VaultEntry[]>();
  for (const entry of entries) {
    const key = formatDate(entry.createdAt);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(entry);
  }

  return (
    <LazyMotion features={domAnimation}>
      <main className="max-w-4xl mx-auto px-6">
        {/* ── Back link ── */}
        <m.div
          className="pt-8"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE.smooth }}
        >
          <Link
            href="/arcanea-vault"
            className="text-xs font-mono tracking-widest text-[#708094] hover:text-[#e6eefc] transition-colors uppercase"
          >
            ← Back
          </Link>
        </m.div>

        {/* ── Category nav pills ── */}
        <m.nav
          className="flex flex-wrap gap-2 mt-6 mb-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
          }}
        >
          {VAULT_CATEGORIES.map((c) => {
            const cfg = VAULT_CONFIG[c];
            const isActive = c === category;
            return (
              <m.div
                key={c}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE.smooth } },
                }}
              >
                <Link
                  href={`/vault/${c}`}
                  className="inline-block px-3 py-1.5 rounded-full text-xs font-mono border transition-all"
                  style={{
                    color: isActive ? cfg.color : '#708094',
                    borderColor: isActive ? `${cfg.color}40` : 'rgba(255,255,255,0.06)',
                    backgroundColor: isActive ? `${cfg.color}12` : 'transparent',
                  }}
                >
                  {cfg.label}
                </Link>
              </m.div>
            );
          })}
        </m.nav>

        {/* ── Header ── */}
        <m.div
          className="mb-12"
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: EASE.smooth, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${config.color}15` }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-[#e6eefc] tracking-tight">
                {config.label}
              </h1>
              <p className="text-[10px] text-[#708094] font-mono tracking-[0.2em] uppercase mt-0.5">
                {config.guardian}
              </p>
            </div>
          </div>
          <p className="text-sm text-[#9bb1d0]">{config.tagline}</p>
          <p className="text-xs text-[#708094] mt-1 font-mono">
            {entries.length} {entries.length === 1 ? 'insight' : 'insights'}
            {entries.length > 0 && <> · Latest {timeAgo(entries[0].createdAt)}</>}
          </p>
        </m.div>

        {/* ── Timeline ── */}
        {entries.length > 0 ? (
          <DrawingTimeline color={config.color}>
            <div className="space-y-10 pb-32">
              {Array.from(grouped).map(([date, dayEntries]) => (
                <div key={date} className="relative">
                  {/* Date marker dot */}
                  <div
                    className="absolute -left-[25px] top-1.5 w-2 h-2 rounded-full ring-4 ring-[#09090b]"
                    style={{ backgroundColor: config.color }}
                  />

                  <m.p
                    className="text-xs font-mono tracking-[0.2em] text-[#708094] mb-4 uppercase"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.5, ease: EASE.smooth }}
                  >
                    {date}
                  </m.p>

                  <div className="space-y-3">
                    {dayEntries.map((entry, i) => (
                      <m.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={VIEWPORT}
                        transition={{ duration: 0.6, ease: EASE.smooth, delay: i * 0.06 }}
                      >
                        <TiltCard intensity={4}>
                          <VaultEntryCard entry={entry} />
                        </TiltCard>
                      </m.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DrawingTimeline>
        ) : (
          <m.div
            className="text-center py-24"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.smooth, delay: 0.3 }}
          >
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${config.color}08` }}
            >
              <div className="w-4 h-4 rounded-full opacity-30" style={{ backgroundColor: config.color }} />
            </div>
            <p className="text-[#708094] text-sm">Empty.</p>
            <p className="text-[#708094]/50 text-xs mt-1">Entries appear here as the vault grows.</p>
          </m.div>
        )}
      </main>
    </LazyMotion>
  );
}
