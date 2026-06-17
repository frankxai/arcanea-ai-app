import type { Metadata } from "next";
import { PlatformStudioShell, STUDIO_BY_ID } from "@/components/studio";

export const metadata: Metadata = {
  title: "Music Studio - Arcanea",
  description:
    "Artist universes, song briefs, album lore, cover art briefs, visualizer plans, and release assets.",
  alternates: { canonical: "/music-studio" },
};

export default function MusicStudioPage() {
  return (
    <PlatformStudioShell
      studio={STUDIO_BY_ID.music}
      title="Build artist worlds, not loose tracks"
      subtitle="Shape an artist identity, song world, release plan, visual style, cover direction, and video brief that agents and music tools can keep consistent."
    />
  );
}
