import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Foundation — The Living Lore Volume 1',
  description:
    'Seven strangers. One broken Gate. A journey that will change everything.',
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-guardian="leyla">{children}</div>;
}
