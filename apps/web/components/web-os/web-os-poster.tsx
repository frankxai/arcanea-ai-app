// Static poster for the Web OS hero — doubles as the LCP image and the
// reduced-motion / mobile / 3D-loading fallback. Pure CSS, no JS, server-safe.

import type { JSX } from 'react';

export function WebOsPoster({ className = '' }: { className?: string }): JSX.Element {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      aria-hidden="true"
      style={{
        background:
          'radial-gradient(ellipse 70% 60% at 50% 42%, rgba(0,188,212,0.12), transparent 60%), radial-gradient(ellipse 50% 50% at 70% 70%, rgba(13,71,161,0.14), transparent 55%), #09090b',
      }}
    >
      {/* faint constellation suggestion — static, decorative */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 65% 25%, rgba(0,188,212,0.5), transparent), radial-gradient(1px 1px at 80% 60%, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 35% 70%, rgba(13,71,161,0.5), transparent), radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.35), transparent)',
        }}
      />
    </div>
  );
}
