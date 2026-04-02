'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/command', label: 'Dashboard', icon: DashboardIcon },
  { href: '/ops', label: 'Ops', icon: OpsIcon },
  { href: '/command/inbox', label: 'Inbox', icon: InboxIcon },
  { href: '/command/agents', label: 'Agents', icon: AgentsIcon },
  { href: '/command/social', label: 'Social', icon: SocialIcon },
  { href: '/command/publish', label: 'Publish', icon: PublishIcon },
  { href: '/command/worlds', label: 'Worlds', icon: WorldsIcon },
  { href: '/command/stats', label: 'Stats', icon: StatsIcon },
] as const;

export function CommandSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/command') return pathname === '/command';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden lg:flex flex-col w-56 shrink-0 border-r border-white/10 bg-[#070b14]">
        <div className="px-5 py-6">
          <Link href="/command" className="block">
            <h1
              className="text-lg tracking-wider text-[#7fffd4]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Command Center
            </h1>
          </Link>
        </div>

        <div className="flex flex-col gap-0.5 px-2 flex-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isActive(href)
                    ? 'bg-[#7fffd4]/10 text-[#7fffd4] border border-[#7fffd4]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon active={isActive(href)} />
              {label}
            </Link>
          ))}
        </div>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Online
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070b14] border-t border-white/10 flex justify-around px-1 py-2 safe-area-pb">
        {NAV_ITEMS.slice(0, 5).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`
              flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px]
              transition-colors
              ${
                isActive(href)
                  ? 'text-[#7fffd4]'
                  : 'text-white/50 hover:text-white/80'
              }
            `}
          >
            <Icon active={isActive(href)} />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}

// ---------------------------------------------------------------------------
// Icons (inline SVG to avoid extra dependencies)
// ---------------------------------------------------------------------------

function DashboardIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#7fffd4' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function OpsIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#7fffd4' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l2.2 4.45L19 7.1l-3.5 3.41.83 4.82L12 13l-4.33 2.33.83-4.82L5 7.1l4.8-.65L12 2z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function InboxIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#7fffd4' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
    </svg>
  );
}

function AgentsIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#7fffd4' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  );
}

function SocialIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#7fffd4' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22 6 12 13 2 6" />
    </svg>
  );
}

function PublishIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#7fffd4' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function WorldsIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#7fffd4' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function StatsIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#7fffd4' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
