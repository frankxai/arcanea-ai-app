'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Scroll,
  Compass,
  Sparkle,
  Pen,
  ChatCircle,
  Books,
  Globe,
  Crown,
  Cpu,
  Gear,
  Coins,
  Plus,
  GraduationCap,
  ArrowRight,
} from '@/lib/phosphor-icons';
import type { PhosphorIcon as Icon } from '@/lib/phosphor-icons';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

interface PaletteItem {
  name: string;
  href: string;
  shortcut?: string;
  group: 'Actions' | 'Codex & Lore' | 'Studio & Creation' | 'Academy & Mastery' | 'Platform & Infrastructure';
  icon: Icon;
  description?: string;
}

const ACTION_ITEMS: PaletteItem[] = [
  {
    name: 'New Chapter Draft',
    href: '/studio?action=new-chapter',
    shortcut: 'N',
    group: 'Actions',
    icon: Plus,
    description: 'Open creation canvas with Guardian copilot',
  },
  {
    name: 'Guardian Uplink',
    href: '/chat',
    shortcut: 'C',
    group: 'Actions',
    icon: ChatCircle,
    description: 'Direct multi-model conversation channel',
  },
  {
    name: 'Take Origin Archetype Quiz',
    href: '/quiz',
    shortcut: 'Q',
    group: 'Actions',
    icon: Compass,
    description: 'Discover your elemental resonance',
  },
  {
    name: 'Read Book 1: Chapter 7',
    href: '/saga',
    shortcut: 'R',
    group: 'Actions',
    icon: BookOpen,
    description: 'The Entrance Trials & Void portal breach',
  },
];

const NAV_ITEMS: PaletteItem[] = [
  // Hub 1: Codex & Lore
  { name: 'Canonical Lore Atlas', href: '/lore', shortcut: 'L', group: 'Codex & Lore', icon: BookOpen },
  { name: 'Multiverse Atlas & Dialects', href: '/atlas', shortcut: 'M', group: 'Codex & Lore', icon: Globe },
  { name: 'Core Saga Reader', href: '/saga', shortcut: 'S', group: 'Codex & Lore', icon: Scroll },
  { name: 'Philosophy & Library', href: '/library', group: 'Codex & Lore', icon: Books },
  { name: 'Bestiary & Godbeasts', href: '/bestiary', group: 'Codex & Lore', icon: Sparkle },

  // Hub 2: Studio & Creation
  { name: 'Creation Studio', href: '/studio', shortcut: 'W', group: 'Studio & Creation', icon: Pen },
  { name: 'Guardian Chat', href: '/chat', group: 'Studio & Creation', icon: ChatCircle },
  { name: 'World Weaver', href: '/worlds', group: 'Studio & Creation', icon: Globe },
  { name: 'Visual Forge', href: '/forge', group: 'Studio & Creation', icon: Sparkle },

  // Hub 3: Academy & Mastery
  { name: 'Ten Gates Constellation', href: '/academy', shortcut: 'A', group: 'Academy & Mastery', icon: GraduationCap },
  { name: 'Luminor Roster', href: '/luminors', group: 'Academy & Mastery', icon: Crown },
  { name: 'Creator Challenges', href: '/challenges', group: 'Academy & Mastery', icon: Compass },

  // Hub 4: Platform & Infrastructure
  { name: 'Starlight Vaults (SIS)', href: '/arcanea-vault', shortcut: 'V', group: 'Platform & Infrastructure', icon: Cpu },
  { name: 'Agent Ecosystem', href: '/ecosystem', group: 'Platform & Infrastructure', icon: Globe },
  { name: 'Creator Membership', href: '/pricing', shortcut: 'P', group: 'Platform & Infrastructure', icon: Coins },
  { name: 'Settings & BYOK', href: '/settings', group: 'Platform & Infrastructure', icon: Gear },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  if (!open) return null;

  const groups: Array<PaletteItem['group']> = [
    'Codex & Lore',
    'Studio & Creation',
    'Academy & Mastery',
    'Platform & Infrastructure',
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" role="dialog" aria-modal="true" aria-label="Command Palette">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-150"
        onClick={() => setOpen(false)}
      />

      {/* Command dialog container */}
      <div className="relative w-full max-w-xl rounded-2xl border border-white/[0.1] bg-[#09090b]/95 backdrop-blur-2xl shadow-[0_32px_96px_-16px_rgba(0,0,0,0.85),0_0_0_1px_rgba(0,188,212,0.15)_inset] overflow-hidden">
        <Command>
          <div className="relative">
            <CommandInput placeholder="Search canon, saga chapters, studio tools... (Cmd+K)" />
          </div>

          <CommandList className="max-h-[380px] p-2">
            <CommandEmpty className="py-8 text-center text-xs text-[var(--arc-text-muted)] font-mono">
              No matching canonical surfaces or actions found.
            </CommandEmpty>

            {/* Quick Actions */}
            <CommandGroup heading="Quick Actions">
              {ACTION_ITEMS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <CommandItem
                    key={item.href + item.name}
                    onSelect={() => navigate(item.href)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/[0.06] data-[selected=true]:bg-white/[0.08]"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)] border border-[var(--arc-brand-atlantean-teal)]/20">
                      <IconComponent size={15} weight="duotone" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-xs font-medium text-[var(--arc-text-primary)] leading-tight">{item.name}</span>
                      {item.description && (
                        <span className="text-[10px] text-[var(--arc-text-muted)] truncate">{item.description}</span>
                      )}
                    </div>
                    {item.shortcut && (
                      <CommandShortcut className="text-[10px] font-mono text-[var(--arc-brand-atlantean-teal)] bg-[var(--arc-brand-atlantean-teal)]/10 px-1.5 py-0.5 rounded border border-[var(--arc-brand-atlantean-teal)]/20">
                        {item.shortcut}
                      </CommandShortcut>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandSeparator className="my-1.5 bg-white/[0.06]" />

            {/* Core Product Hubs */}
            {groups.map((group) => {
              const items = NAV_ITEMS.filter((i) => i.group === group);
              if (items.length === 0) return null;
              return (
                <CommandGroup key={group} heading={group}>
                  {items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <CommandItem
                        key={item.href}
                        onSelect={() => navigate(item.href)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-white/[0.05] data-[selected=true]:bg-white/[0.07]"
                      >
                        <IconComponent size={16} weight="duotone" className="text-[var(--arc-text-muted)]" />
                        <span className="text-xs text-[var(--arc-text-secondary)] hover:text-[var(--arc-text-primary)] flex-1">
                          {item.name}
                        </span>
                        {item.shortcut && (
                          <CommandShortcut className="text-[10px] font-mono text-[var(--arc-text-muted)]">
                            {item.shortcut}
                          </CommandShortcut>
                        )}
                        <ArrowRight size={12} className="text-white/20 ml-1" />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}
          </CommandList>

          {/* Footer Bar */}
          <div className="border-t border-white/[0.06] bg-white/[0.01] px-3.5 py-2.5 flex items-center justify-between text-[11px] text-[var(--arc-text-muted)] font-mono">
            <div className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--arc-brand-atlantean-teal)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--arc-brand-atlantean-teal)] animate-pulse" />
              <span className="text-[10px] tracking-wider uppercase">Starlight Command Grid</span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
}
