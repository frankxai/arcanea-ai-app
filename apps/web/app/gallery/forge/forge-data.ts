/**
 * Forge Gallery — Vessel art showcase data.
 * Maps to .arcanea/forge/manifest.json approved assets.
 */

export type VesselDomain = "space" | "sea" | "sky" | "void" | "hybrid";
export type VesselClass =
  | "leviathan"
  | "dreadnought"
  | "cruiser"
  | "explorer"
  | "frigate"
  | "interceptor"
  | "transport"
  | "station"
  | "yacht"
  | "ancient"
  | "capital"
  | "living";

export interface ForgeAsset {
  id: number;
  title: string;
  description: string;
  domain: VesselDomain;
  vesselClass: VesselClass | string;
  image: string;
  width: number;
  height: number;
  createdBy: string;
  featured: boolean;
}

export const DOMAIN_LABELS: Record<VesselDomain, string> = {
  space: "Space",
  sea: "Sea",
  sky: "Sky",
  void: "Void",
  hybrid: "Hybrid",
};

export const DOMAIN_COLORS: Record<VesselDomain, string> = {
  space: "text-cyan-400",
  sea: "text-blue-400",
  sky: "text-amber-400",
  void: "text-purple-400",
  hybrid: "text-emerald-400",
};

export const DOMAIN_BG: Record<VesselDomain, string> = {
  space: "bg-cyan-500/10 border-cyan-500/20",
  sea: "bg-blue-500/10 border-blue-500/20",
  sky: "bg-amber-500/10 border-amber-500/20",
  void: "bg-purple-500/10 border-purple-500/20",
  hybrid: "bg-emerald-500/10 border-emerald-500/20",
};

export const FORGE_ASSETS: ForgeAsset[] = [
  {
    id: 4,
    title: "Dreadnought Emerging from Nebula",
    description:
      "3km cathedral-warship with crystalline obsidian hull and teal plasma engines, emerging from a purple nebula. Ringed planet backdrop.",
    domain: "space",
    vesselClass: "dreadnought",
    image: "/images/forge/space/004-dreadnought-nebula.png",
    width: 1536,
    height: 768,
    createdBy: "Arcanea Forge",
    featured: true,
  },
  {
    id: 5,
    title: "Interceptor — Canyon Chase",
    description:
      "Blade-shaped interceptor tearing through an alien desert canyon at golden hour. Matte black hull with electric cyan energy lines.",
    domain: "space",
    vesselClass: "interceptor",
    image: "/images/forge/space/005-interceptor-canyon.png",
    width: 1536,
    height: 640,
    createdBy: "Arcanea Forge",
    featured: true,
  },
  {
    id: 6,
    title: "Aethelred's Fury — Storm Galleon",
    description:
      "Dark-hulled galleon with bioluminescent organisms, sea serpent bowsprit, and black sails battling a violent ocean storm at night.",
    domain: "sea",
    vesselClass: "capital",
    image: "/images/forge/sea/006-storm-galleon.png",
    width: 1536,
    height: 640,
    createdBy: "Arcanea Forge",
    featured: true,
  },
  {
    id: 7,
    title: "Ironclad Airship Fleet — Sunset Patrol",
    description:
      "Steampunk fleet of ironclad airships above a golden cloud sea at sunset. Brass fittings, glass observation dome, escort formation.",
    domain: "sky",
    vesselClass: "capital",
    image: "/images/forge/sky/007-ironclad-airship.png",
    width: 1536,
    height: 768,
    createdBy: "Arcanea Forge",
    featured: true,
  },
];

export const SHIP_OF_THE_WEEK = FORGE_ASSETS[0];
