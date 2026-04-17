import type { ReactNode } from 'react';

export const dynamic = 'force-static';

export default function RoomLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-[#050507] overflow-hidden" style={{ colorScheme: 'dark' }}>
      {children}
    </div>
  );
}
