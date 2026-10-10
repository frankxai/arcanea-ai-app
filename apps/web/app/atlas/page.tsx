import { Metadata } from "next";
import {
  getCanonicalRealms,
  getLinguisticFamilies,
  getCanonicalEpochs,
  getCanonicalGuardians,
  getMonomythStages,
} from "@arcanea/world-engine";
import { AtlasClient } from "./atlas-client";

export const metadata: Metadata = {
  title: "Multiverse Atlas — Realms, Corridors & Dialects — Arcanea",
  description:
    "Explore the acoustic cartography of the Kingdom of Light. Inspect Solfeggio frequency corridors, Tolkien-grade linguistic matrices, Sandersonian magic tolls, and the 12-stage Monomyth.",
  openGraph: {
    title: "Multiverse Atlas — Realms, Corridors & Dialects — Arcanea",
    description:
      "Explore the acoustic cartography of the Kingdom of Light. Inspect Solfeggio frequency corridors, Tolkien-grade linguistic matrices, Sandersonian magic tolls, and the 12-stage Monomyth.",
  },
  alternates: { canonical: "/atlas" },
};

export default function AtlasPage() {
  const realms = getCanonicalRealms();
  const linguisticFamilies = getLinguisticFamilies();
  const epochs = getCanonicalEpochs();
  const guardians = getCanonicalGuardians();
  const monomythStages = getMonomythStages();

  return (
    <AtlasClient
      initialRealms={realms}
      linguisticFamilies={linguisticFamilies}
      epochs={epochs}
      guardians={guardians}
      monomythStages={monomythStages}
    />
  );
}
