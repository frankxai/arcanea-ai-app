import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "See the top creators in Arcanea ranked by XP, creations, likes, and streaks. Climb from Apprentice to Luminor.",
  openGraph: {
    title: "Leaderboard | Arcanea",
    description:
      "See the top creators in Arcanea ranked by XP, creations, likes, and streaks. Climb from Apprentice to Luminor.",
  },
  alternates: { canonical: "/leaderboard" },
};

export default function LeaderboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
