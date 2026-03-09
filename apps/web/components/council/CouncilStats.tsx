"use client";

import { motion } from "framer-motion";

interface CouncilStatsProps {
  streak?: number;
  totalConvenings?: number;
  depthLevel?: number;
  lastConvening?: string;
}

export function CouncilStats({
  streak = 3,
  totalConvenings = 14,
  depthLevel = 4,
  lastConvening = "Yesterday",
}: CouncilStatsProps) {
  const depthPercent = Math.min((depthLevel / 10) * 100, 100);

  const stats = [
    {
      label: "Current Streak",
      value: `${streak} day${streak !== 1 ? "s" : ""}`,
      sub: streak >= 7 ? "Sustained practice" : "Keep going",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M9 2C9 2 13.5 5.5 13.5 9.5C13.5 12.09 11.48 14 9 14C6.52 14 4.5 12.09 4.5 9.5C4.5 7.5 6 6 6 6C6 6 6.5 8.5 8 9C8 9 7.5 6.5 9 4C9.5 5 10 6 10 7.5C11 6.5 11 5 9 2Z"
            fill="#f97316"
            stroke="#fb923c"
            strokeWidth="0.5"
          />
        </svg>
      ),
      color: "#f97316",
      bg: "rgba(249,115,22,0.08)",
    },
    {
      label: "Total Convenings",
      value: `${totalConvenings}`,
      sub: "Sessions completed",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <circle cx="9" cy="9" r="6" stroke="#6366f1" strokeWidth="1.5" fill="none" />
          <circle cx="9" cy="9" r="2.5" fill="#6366f1" opacity="0.7" />
          <path d="M9 3V6M9 12V15M3 9H6M12 9H15" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
      color: "#6366f1",
      bg: "rgba(99,102,241,0.08)",
    },
    {
      label: "Last Convening",
      value: lastConvening,
      sub: "Most recent session",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <rect x="3" y="4" width="12" height="11" rx="2" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
          <path d="M6 2V5M12 2V5M3 7H15" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.08)",
    },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 space-y-5">
      <h3 className="font-display text-base font-bold text-white/80">
        Your Practice
      </h3>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-xl border border-white/[0.05] p-4 space-y-2"
            style={{ background: stat.bg }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${stat.color}15` }}
            >
              {stat.icon}
            </div>
            <div>
              <p
                className="font-display text-lg font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="font-mono text-[9px] text-white/30 uppercase tracking-wider leading-tight mt-0.5">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Depth level progress */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-white/40 uppercase tracking-wider">
            Council Depth
          </span>
          <span className="font-display text-sm font-bold text-[#f59e0b]">
            Level {depthLevel} / 10
          </span>
        </div>

        <div className="relative h-2 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #00bcd4, #6366f1 50%, #f59e0b)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${depthPercent}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </div>

        <p className="font-body text-xs text-white/25 leading-relaxed">
          {depthLevel < 3
            ? "Establishing the practice. Attend consistently."
            : depthLevel < 6
            ? "The imprints are deepening. The Council knows your frequency."
            : depthLevel < 9
            ? "Deep coherence. The transmissions arrive with clarity."
            : "Full Council resonance. You have become the chamber."}
        </p>
      </div>
    </div>
  );
}
