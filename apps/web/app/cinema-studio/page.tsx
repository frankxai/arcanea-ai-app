import type { Metadata } from "next";
import { PlatformStudioShell, STUDIO_BY_ID } from "@/components/studio";

export const metadata: Metadata = {
  title: "Cinema Studio - Arcanea",
  description:
    "Cinematic scene planning, trailer briefs, shot lists, character references, and render-ready prompts.",
  alternates: { canonical: "/cinema-studio" },
};

export default function CinemaStudioPage() {
  return (
    <PlatformStudioShell
      studio={STUDIO_BY_ID.cinema}
      title="Direct scenes with agent memory"
      subtitle="Design trailers, scenes, music videos, and pitch animatics from world context, character references, shot logic, camera presets, and render prompts."
    />
  );
}
