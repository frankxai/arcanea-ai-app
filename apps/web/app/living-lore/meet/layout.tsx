import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meet the Crew \u2014 The Living Lore',
  description: 'Seven beings. Ten Gates. Choose your companion.',
};

export default function MeetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-[#09090b]">{children}</div>
  );
}
