"use client";

import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Element hex map ──────────────────────────────────────────────────

export const ELEMENT_HEX: Record<string, string> = {
  Fire: "#ef4444",
  Water: "#3b82f6",
  Earth: "#22c55e",
  Wind: "#e2e8f0",
  Void: "#a855f7",
  Spirit: "#fbbf24",
};

// ── Glass style ─────────────────────────────────────────────────────

export const GLASS_STYLE = {
  background: "linear-gradient(145deg, rgba(12,12,20,0.92) 0%, rgba(9,9,11,0.96) 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.3)",
} as const;

// ── Shared small components ──────────────────────────────────────────

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">{children}</h3>;
}

export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl p-5", className)} style={GLASS_STYLE}>{children}</div>;
}

export function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 space-y-4" style={GLASS_STYLE}>
      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">{title}</h3>
      {children}
    </div>
  );
}

const STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2";
const FORK_PATHS = "M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9M12 12v3";

export function MiniStat({ label, value, icon }: { label: string; value: number; icon?: string }) {
  return (
    <div className="rounded-xl px-3 py-3 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="text-xl font-display font-bold text-white/70 tabular-nums flex items-center justify-center gap-1.5">
        {icon === "star" && (
          <svg className="w-3.5 h-3.5 text-[#ffd700]/50" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points={STAR_PATH} />
          </svg>
        )}
        {icon === "fork" && (
          <svg className="w-3.5 h-3.5 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><path d={FORK_PATHS} />
          </svg>
        )}
        {value}
      </div>
      <div className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}

export function EmptyState({ message, cta, href }: { message: string; cta: string; href: string }) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <m.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <svg className="w-7 h-7 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </m.div>
        <p className="text-white/35 text-sm max-w-md mb-4 leading-relaxed">{message}</p>
        <Link href={href} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[#00bcd4] hover:bg-[#00bcd4]/20 transition-all">
          {cta}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </LazyMotion>
  );
}
