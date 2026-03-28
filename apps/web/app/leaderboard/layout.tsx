import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'See top creators on Arcanea ranked by XP, creations, community love, and streaks.',
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
