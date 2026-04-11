import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  accent?: 'teal' | 'gold' | 'blue' | 'violet';
}

const ACCENT_STYLES: Record<
  NonNullable<StatCardProps['accent']>,
  { bg: string; text: string; glow: string }
> = {
  teal: {
    bg: 'bg-[#00bcd4]/10',
    text: 'text-[#00bcd4]',
    glow: 'shadow-[0_0_40px_-10px_rgba(0,188,212,0.25)]',
  },
  gold: {
    bg: 'bg-[#ffd700]/10',
    text: 'text-[#ffd700]',
    glow: 'shadow-[0_0_40px_-10px_rgba(255,215,0,0.2)]',
  },
  blue: {
    bg: 'bg-[#0d47a1]/20',
    text: 'text-sky-300',
    glow: 'shadow-[0_0_40px_-10px_rgba(13,71,161,0.25)]',
  },
  violet: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-300',
    glow: 'shadow-[0_0_40px_-10px_rgba(167,139,250,0.2)]',
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  accent = 'teal',
}: StatCardProps) {
  const style = ACCENT_STYLES[accent];
  return (
    <div
      className={`relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 transition-all hover:border-white/[0.12] ${style.glow}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center`}
        >
          <Icon size={20} className={style.text} strokeWidth={1.75} />
        </div>
        {change && (
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
            {change}
          </span>
        )}
      </div>
      <p className="font-display text-2xl sm:text-3xl font-semibold text-white/95 tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-white/40 font-sans">
        {label}
      </p>
    </div>
  );
}
