/**
 * Cinematic /story gateway — canon prose only, live CTAs only.
 * Sources: cosmology-section.tsx, about-sections.tsx, books-data.ts FEATURED_PASSAGES.
 */

export const STILLS = [
  {
    id: "first-light",
    src: "/story/first-light.webp",
    width: 2816,
    height: 1584,
    alt: "Gold geometric lattice organizing a dark void above teal-lit stone.",
  },
  {
    id: "aethermoor-dawn",
    src: "/story/aethermoor-dawn.webp",
    width: 2816,
    height: 1584,
    alt: "Terraced luminous valley at dawn, gold light lining a river through mist.",
  },
] as const;

export const LIVE_LINKS = [
  { href: "/books", label: "The Library" },
  {
    href: "/books/book1/the-storm-that-remembered",
    label: "Begin The Three Academies",
  },
  { href: "/books/docs/founding-myths", label: "Founding Myths" },
  { href: "/gallery", label: "Visual Encyclopedia" },
] as const;

export const CANON = {
  kicker: "Origins · Lumina & Nero",
  title: "The First Light",
  lede: "Neither Light nor Darkness alone could create. Together, they became the eternal duality from which all existence springs.",
  luminaName: "Lumina",
  luminaTitle: "The First Light",
  lumina:
    "From the stirring came separation. Lumina blazed forth not as fire but as form. Where Nero was infinite potential, Lumina was pattern. The First Light did not illuminate the darkness—it organized it.",
  neroName: "Nero",
  neroTitle: "The Primordial Darkness",
  nero: "In the beginning, there was Nero. The Void contained everything that could ever be, held in superposition, waiting. Every possible world, every potential soul, every future creation—all rested in the fertile darkness.",
} as const;

export const PASSAGE = {
  text: "The sea remembered things the town had forgotten. Kael knew this the way you know anything you've never been taught — in the soles of the feet, in the way the back of the neck prickles before lightning, in the way the tide sometimes came in speaking a language older than words.",
  chapter: "Chapter One: The Storm That Remembered",
  book: "The Three Academies",
  href: "/books/book1/the-storm-that-remembered",
} as const;

export const ARTBOOK = [
  {
    src: "/images/books/lumara-valle-de-los-destellos-cover-v2.png",
    title: "Lumara, Valle de los Destellos",
    href: "/books/lumara-valle-de-los-destellos/print",
  },
  {
    src: "/images/books/song-of-van-linh-cover.png",
    title: "The Girl Who Heard the River",
    href: "/books/song-of-van-linh/subject-7",
  },
] as const;
