'use client';

import { cn } from '@/lib/utils';
import {
  User,
  Palette,
  Bell,
  Shield,
  Gear,
  Lightning,
} from '@/lib/phosphor-icons';
import type { IconProps } from '@/lib/phosphor-icons';

type Section =
  | 'profile'
  | 'appearance'
  | 'notifications'
  | 'privacy'
  | 'account'
  | 'guardians';

interface SidebarProps {
  active: Section;
  onChange: (s: Section) => void;
}

const navItems: {
  id: Section;
  label: string;
  Icon: React.ComponentType<IconProps>;
  badge?: string;
}[] = [
  { id: 'profile', label: 'Profile', Icon: User },
  { id: 'appearance', label: 'Appearance', Icon: Palette },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
  { id: 'privacy', label: 'Privacy', Icon: Shield },
  { id: 'account', label: 'Account', Icon: Gear },
  { id: 'guardians', label: 'Guardians', Icon: Lightning, badge: 'ARCANE' },
];

export type { Section as SettingsSection };

export function SettingsSidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0">
      {/* Logo */}
      <div className="mb-8 px-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-violet-500 to-violet-700 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <Lightning size={20} weight="fill" className="text-white" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none font-display text-white/95">
              Arcanea
            </p>
            <p className="text-xs mt-0.5 text-violet-400">Settings</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? 'text-violet-200 bg-violet-500/15 border border-violet-500/30'
                  : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent',
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
              )}
              <item.Icon
                size={18}
                weight={isActive ? 'fill' : 'regular'}
                className={cn(
                  'shrink-0 transition-colors',
                  isActive ? 'text-violet-400' : 'group-hover:text-violet-400',
                )}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/25">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom card — XP progress */}
      <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-atlantean-aqua/5 border border-violet-500/20">
        <p className="text-xs font-semibold text-[#ffd700]">Luminor Tier</p>
        <p className="text-xs mt-1 text-white/40 leading-relaxed">
          Your cosmic essence resonates across all realms.
        </p>
        <div className="mt-3 h-1.5 rounded-full overflow-hidden bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-atlantean-aqua shadow-[0_0_8px_rgba(139,92,246,0.5)]"
            style={{ width: '78%' }}
          />
        </div>
        <p className="text-[11px] mt-1.5 text-white/30">7,800 / 10,000 XP</p>
      </div>
    </aside>
  );
}
