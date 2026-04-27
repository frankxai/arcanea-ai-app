import type { ReactNode } from 'react';

export const dynamic = 'force-static';

// z-[100] + isolate creates a stacking context above the root layout's
// Navbar (z-50), LuminaBubble (z-50), and Footer (document flow). Without
// this the daemon-launched voice window leaks global chrome through the
// immersive scene — the user sees the marketing footer poking through, and
// the floating LuminaBubble covers the Connect-voice CTA + Settings drawer.
// Children's fixed elements stack within this isolated context so the
// drawer + error toast are no longer occluded.

export default function RoomLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-[#050507] overflow-hidden isolate"
      style={{ colorScheme: 'dark' }}
    >
      {children}
    </div>
  );
}
