import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  children?: ReactNode;
}

/**
 * Marquee — infinite horizontal or vertical scroll.
 * Magic UI primitive ported 2026-04-18.
 *
 * Requires these keyframes in your Tailwind config (added in arcanea-design-preset.js):
 *   marquee: 'marquee var(--duration) linear infinite',
 *   marquee-vertical: 'marquee-vertical var(--duration) linear infinite',
 *
 * Default duration is 40s — override via --duration CSS var on the container.
 */
export function Marquee({
  className = '',
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  children,
  ...props
}: MarqueeProps) {
  const containerCls = [
    'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
    vertical ? 'flex-col' : 'flex-row',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const trackCls = [
    'flex shrink-0 justify-around [gap:var(--gap)]',
    vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
    pauseOnHover ? 'group-hover:[animation-play-state:paused]' : '',
    reverse ? '[animation-direction:reverse]' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...props} className={containerCls}>
      {Array.from({ length: repeat }, (_, i) => (
        <div key={i} className={trackCls}>
          {children}
        </div>
      ))}
    </div>
  );
}
