/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";
import { WorldsClient, type WorldCard } from "./worlds-client";
import { WorldsHero } from "./worlds-hero";

export const metadata: Metadata = {
  title: "Worlds — Build Your Universe — Arcanea",
  description:
    "Build your own fantasy universe with the Living Worlds engine. Characters, locations, magic systems, and lore — all interconnected.",
  openGraph: {
    title: "Worlds — Build Your Universe — Arcanea",
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
    id: "arcanea-prime",
    name: "Arcanea Prime",
    tagline: "The original world of Luminors, Guardians, and the Ten Gates",
    creator: "Arcanea",
    stars: 0,
    forks: 0,
    characters: 28,
    mood: "mythological",
    elements: [
      { name: "Fire", color: ELEMENT_COLORS.Fire },
      { name: "Water", color: ELEMENT_COLORS.Water },
      { name: "Earth", color: ELEMENT_COLORS.Earth },
      { name: "Wind", color: ELEMENT_COLORS.Wind },
      { name: "Void", color: ELEMENT_COLORS.Void },
    ],
    gradient: "linear-gradient(135deg, var(--arc-brand-atlantean-teal), var(--arc-brand-cosmic-blue), var(--arc-brand-arcanean-gold))",
    isTemplate: true,
  },
  {
    id: "shadowfen-chronicles",
    name: "The Shadowfen",
    tagline: "Where Malachar's corruption seeps through fractured reality",
    creator: "Arcanea",
    stars: 0,
    forks: 0,
    characters: 12,
    mood: "horror",
    elements: [
      { name: "Void", color: ELEMENT_COLORS.Void },
      { name: "Fire", color: ELEMENT_COLORS.Fire },
    ],
    gradient: "linear-gradient(135deg, var(--arc-brand-cosmic-blue), var(--arc-cosmic-void), var(--arc-earth))",
    isTemplate: true,
  },
  {
    id: "starweave-academy",
    name: "Starweave Academy",
    tagline: "Seven houses, ten gates, and a thousand stories waiting to unfold",
    creator: "Arcanea",
    stars: 0,
    forks: 0,
    characters: 19,
    mood: "fantasy",
    elements: [
      { name: "Spirit", color: ELEMENT_COLORS.Spirit },
      { name: "Water", color: ELEMENT_COLORS.Water },
      { name: "Wind", color: ELEMENT_COLORS.Wind },
    ],
    gradient: "linear-gradient(135deg, var(--arc-brand-cosmic-blue), var(--arc-brand-arcanean-gold), var(--arc-brand-atlantean-teal))",
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
