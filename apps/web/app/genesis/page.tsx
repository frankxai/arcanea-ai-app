import type { Metadata } from "next";
import { GenesisSession } from "./genesis-session";

export const metadata: Metadata = {
  title: "Genesis | Arcanea",
  description:
    "Turn a creative call into a Gift Object, living world seed, first proof artifact, and stewardship record.",
  alternates: {
    canonical: "/genesis",
  },
};

export default function GenesisPage() {
  return (
    <main>
      <GenesisSession />
    </main>
  );
}
