import type { Metadata } from "next";
import { OwlFlightExperience } from "./owl-flight-experience";

export const metadata: Metadata = {
  title: "Design Lab — Follow the Owl into the Academy — Arcanea",
  description:
    "Secluded design-lab experiment: an ultra-premium scroll journey that follows Arcanea’s guide into the Academy of Magic. GSAP ScrollTrigger + Lenis + canon stills.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Design Lab — Follow the Owl into the Academy — Arcanea",
    description:
      "Immersive scroll experiment: flight path, crystal forest, academy gates, and the living hall of Arcanea.",
  },
  alternates: { canonical: "/design-lab/owl-flight" },
};

export default function OwlFlightDesignLabPage() {
  return <OwlFlightExperience />;
}
