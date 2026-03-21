import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Library',
  description: 'Browse the Library of Arcanea — 17 collections, 34+ original texts of wisdom, poetry, and practical guidance for creators.',
  openGraph: {
    title: 'The Library | Lore of Arcanea',
    description: '17 collections of sacred texts — laws, legends, parables, rituals, and wisdom for the creative life.',
  },
  alternates: { canonical: '/lore/library' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
