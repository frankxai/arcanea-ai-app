/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";
import { WorldsClient, type WorldCard } from "./worlds-client";
import { WorldsHero } from "./worlds-hero";

export const metadata: Metadata = {
  title: "Worlds — Build Your Universe",
  description:
    "Build your own fantasy universe with the Living Worlds engine. Characters, locations, magic systems, and lore — all interconnected.",
  openGraph: {
    title: "Worlds — Build Your Universe",
    description:
      "Build your own fantasy universe with the Living Worlds engine. Characters, locations, magic systems, and lore — all interconnected.",
  },
  alternates: { canonical: "/worlds" },
};

// ---------------------------------------------------------------------------
// Template worlds — always available as fallback
// ---------------------------------------------------------------------------

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "var(--arc-fire)",
  Water: "var(--arc-brand-cosmic-blue)",
  Earth: "var(--arc-wind)",
  Wind: "var(--arc-text-primary)",
  Void: "var(--arc-void)",
  Spirit: "var(--arc-brand-arcanean-gold)",
};

const TEMPLATE_WORLDS: WorldCard[] = [
  {
    id: "eldria-prime",
    name: "Eldria Prime",
    tagline: "The Celestine Heartland atop Mount Solaris — 1111 Hz Source Gate",
    creator: "Assembly of Luminors",
    stars: 124,
    forks: 38,
    characters: 28,
    mood: "mythological",
    elements: [
      { name: "Spirit", color: ELEMENT_COLORS.Spirit },
      { name: "Wind", color: ELEMENT_COLORS.Wind },
    ],
    gradient:
      "linear-gradient(135deg, var(--arc-brand-arcanean-gold), var(--arc-brand-cosmic-blue), var(--arc-brand-atlantean-teal))",
    isTemplate: true,
  },
  {
    id: "veldoria",
    name: "Veldoria",
    tagline: "The Singing Valleys of acoustic chalk-stone — 528 Hz Voice Gate",
    creator: "Alera",
    stars: 96,
    forks: 24,
    characters: 18,
    mood: "fantasy",
    elements: [
      { name: "Wind", color: ELEMENT_COLORS.Wind },
      { name: "Water", color: ELEMENT_COLORS.Water },
    ],
    gradient:
      "linear-gradient(135deg, var(--arc-brand-atlantean-teal), var(--arc-brand-cosmic-blue), var(--arc-brand-arcanean-gold))",
    isTemplate: true,
  },
  {
    id: "aurevalde",
    name: "Aurevalde",
    tagline:
      "Thermal ironstone mesas and solar-tempered steppes — 396 Hz Fire Gate",
    creator: "Draconia",
    stars: 82,
    forks: 19,
    characters: 16,
    mood: "fantasy",
    elements: [
      { name: "Fire", color: ELEMENT_COLORS.Fire },
      { name: "Earth", color: ELEMENT_COLORS.Earth },
    ],
    gradient:
      "linear-gradient(135deg, var(--arc-fire), var(--arc-brand-cosmic-blue), var(--arc-brand-arcanean-gold))",
    isTemplate: true,
  },
  {
    id: "mar-arcano",
    name: "Mar Arcano",
    tagline:
      "Subterranean bioluminescent sea and 5-realm aquifer — 285 Hz Flow Gate",
    creator: "Leyla",
    stars: 110,
    forks: 31,
    characters: 22,
    mood: "mythological",
    elements: [
      { name: "Water", color: ELEMENT_COLORS.Water },
      { name: "Void", color: ELEMENT_COLORS.Void },
    ],
    gradient:
      "linear-gradient(135deg, var(--arc-brand-cosmic-blue), var(--arc-brand-atlantean-teal), var(--arc-cosmic-void))",
    isTemplate: true,
  },
  {
    id: "the-shadowfen",
    name: "The Shadowfen",
    tagline:
      "Sunken obsidian arches and petrified cedar groves — 174 Hz Foundation Gate",
    creator: "Malachar / Sealed Archive",
    stars: 75,
    forks: 42,
    characters: 14,
    mood: "horror",
    elements: [
      { name: "Void", color: ELEMENT_COLORS.Void },
      { name: "Earth", color: ELEMENT_COLORS.Earth },
    ],
    gradient:
      "linear-gradient(135deg, var(--arc-cosmic-void), var(--arc-void), var(--arc-brand-cosmic-blue))",
    isTemplate: true,
  },
];

// ---------------------------------------------------------------------------
// Server Component
// ---------------------------------------------------------------------------

export default async function WorldsPage() {
  return (
    <>
      <WorldsHero />
      <WorldsClient worlds={TEMPLATE_WORLDS} />
    </>
  );
}
