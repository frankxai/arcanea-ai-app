import type { JSX } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "The complete Arcanea documentation portal — getting started, mythology, creation tools, the Library, community, and developer resources.",
  openGraph: {
    title: "Documentation",
    description:
      "The complete Arcanea documentation portal — getting started, creation tools, the Library, and developer resources.",
  },
};

// ── Inline SVG Icons (server-component safe) ─────────────────────────────────

const Icons = {
  Rocket: () => (
    <svg className="w-6 h-6" viewBox="0 0 256 256" fill="currentColor">
      <path d="M152,224a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,224ZM128,112a12,12,0,1,0-12-12A12,12,0,0,0,128,112Zm95.62,43.83-12.36,55.63a16,16,0,0,1-25.51,9.11L158.51,200h-61L70.25,220.57a16,16,0,0,1-25.51-9.11L32.38,155.83a16.09,16.09,0,0,1,3.32-13.71l28.56-34.26a123.07,123.07,0,0,1,8.57-36.67c12.9-32.34,36-52.63,45.37-59.85a16,16,0,0,1,19.6,0c9.34,7.22,32.47,27.51,45.37,59.85a123.07,123.07,0,0,1,8.57,36.67l28.56,34.26A16.09,16.09,0,0,1,223.62,155.83ZM99.43,184h57.14c21.12-37.54,25.07-73.48,11.74-106.88C156.55,49.78,134.49,30,128,24c-6.51,6-28.57,25.8-40.31,53.14C74.36,110.52,78.31,146.46,99.43,184Zm-48,26.93L60,178.42,48.17,148.22l-13.79,16.55ZM221.62,164.77,207.83,148.22,196,178.42l8.54,32.51Z" />
    </svg>
  ),
  Compass: () => (
    <svg className="w-6 h-6" viewBox="0 0 256 256" fill="currentColor">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64A8,8,0,0,0,172.42,72.84ZM138,138,97.89,158.11,118,118l40.15-20.07Z" />
    </svg>
  ),
  Scroll: () => (
    <svg className="w-6 h-6" viewBox="0 0 256 256" fill="currentColor">
      <path d="M220,42H76A22,22,0,0,0,54,64V176a22,22,0,0,0,22,22H188a6,6,0,0,0,0-12H76a10,10,0,0,1-10-10V68.91A21.9,21.9,0,0,0,76,70H220a6,6,0,0,0,6-6V48A6,6,0,0,0,220,42Zm-6,16H76a10,10,0,0,1,0-20H214ZM94,112a6,6,0,0,1,6-6h56a6,6,0,0,1,0,12H100A6,6,0,0,1,94,112Zm0,32a6,6,0,0,1,6-6h56a6,6,0,0,1,0,12H100A6,6,0,0,1,94,144Zm134,48a22,22,0,0,1-22,22H56a34,34,0,0,1-34-34V88a6,6,0,0,1,12,0v92a22,22,0,0,0,22,22H206a10,10,0,0,0,10-10V104a6,6,0,0,1,12,0Z" />
    </svg>
  ),
  PaintBrush: () => (
    <svg className="w-6 h-6" viewBox="0 0 256 256" fill="currentColor">
      <path d="M232,32a8,8,0,0,0-8-8c-44.08,0-89.31,49.71-114.43,82.63A60,60,0,0,0,32,164c0,30.88-19.54,44.73-20.47,45.37A8,8,0,0,0,16,224H92a60,60,0,0,0,57.37-77.57C182.3,121.31,232,76.08,232,32ZM92,208H34.63C41.38,198.41,48,183.92,48,164a44,44,0,1,1,44,44Zm32.42-94.45q5.14-6.66,10.09-12.55A176.07,176.07,0,0,1,155,80.56a176.07,176.07,0,0,1-20.44,20.49Q128.64,106.92,122,112.06A60.44,60.44,0,0,0,124.42,113.55ZM175.32,63.37C193.78,48.85,212,38.32,224,34,219.68,46,209.15,64.22,194.63,82.68a192.17,192.17,0,0,0-19.31-19.31Z" />
    </svg>
  ),
  Books: () => (
    <svg className="w-6 h-6" viewBox="0 0 256 256" fill="currentColor">
      <path d="M231.65,194.53,198.46,36.75a16,16,0,0,0-19.58-12.36l-48.62,10.13a16.08,16.08,0,0,0-10.89,8.15A16,16,0,0,0,104,40H56A16,16,0,0,0,40,56V224a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V169.8l14.61,3a16.13,16.13,0,0,0,3.18.31,16,16,0,0,0,15.71-12.88.61.61,0,0,0,0-.1Zm-120-34.14V224H56V56h48V204A16,16,0,0,0,111.65,160.39ZM192,224H127.69a.46.46,0,0,0,.06-.09l-3.75-18L192,191.5Zm-48-63.05V67.89l48.78-10.17,32.44,156.1Z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6" viewBox="0 0 256 256" fill="currentColor">
      <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" />
    </svg>
  ),
  Terminal: () => (
    <svg className="w-6 h-6" viewBox="0 0 256 256" fill="currentColor">
      <path d="M117.31,134l-72,64a8,8,0,1,1-10.63-12L100,128,34.69,70A8,8,0,1,1,45.32,58l72,64a8,8,0,0,1,0,12ZM216,184H120a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Z" />
    </svg>
  ),
  MagnifyingGlass: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M229.66,218.34l-50.07-50.07a88.11,88.11,0,1,0-11.31,11.31l50.07,50.07a8,8,0,0,0,11.31-11.31ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" viewBox="0 0 256 256" fill="currentColor">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  ),
  Sparkle: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM128,165.09a8,8,0,0,0-4.74,4.74L107.1,216,90.84,171.9a8,8,0,0,0-4.74-4.74L40,150.9l46.26-16.26a8,8,0,0,0,4.74-4.74L107.1,84l16.26,45.9a8,8,0,0,0,4.74,4.74L174.36,150.9ZM210,76a6,6,0,0,1-6,6H190v14a6,6,0,0,1-12,0V82H164a6,6,0,0,1,0-12h14V56a6,6,0,0,1,12,0V70h14A6,6,0,0,1,210,76Zm44,28a6,6,0,0,1-6,6h-6v6a6,6,0,0,1-12,0v-6h-6a6,6,0,0,1,0-12h6V92a6,6,0,0,1,12,0v6h6A6,6,0,0,1,254,104Z" />
    </svg>
  ),
  ArrowUpRight: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-6 h-6" viewBox="0 0 256 256" fill="currentColor">
      <path d="M208,40H48A16,16,0,0,0,32,56v58.77c0,89.61,75.82,119.34,91,124.38a15.44,15.44,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208Z" />
    </svg>
  ),
  Fire: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M143.38,17.85a8,8,0,0,0-12.63,3.41l-22,60.41L84.59,58.26a8,8,0,0,0-11.93,2.17C51.53,93.8,40,120.49,40,144a88,88,0,0,0,176,0C216,84.55,165.21,36,143.38,17.85Zm40.51,135.49a57.6,57.6,0,0,1-46.56,46.55A7.65,7.65,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68Z" />
    </svg>
  ),
  Crown: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M248,80a28,28,0,1,0-51.12,15.77l-26.79,33L146,73.4a28,28,0,1,0-36.06,0L85.91,128.74l-26.79-33a28,28,0,1,0-26.6,12L47,211.74A8,8,0,0,0,54.86,218H201.14A8,8,0,0,0,209,211.74l14.49-103.95A28,28,0,0,0,248,80ZM128,40a12,12,0,1,1-12,12A12,12,0,0,1,128,40ZM24,80A12,12,0,1,1,36,92,12,12,0,0,1,24,80ZM196.65,202H59.35L47.44,116.43,71.82,146.3a8,8,0,0,0,13-1.67l29.51-57.53a27.9,27.9,0,0,0,27.42,0l29.51,57.53a8,8,0,0,0,13,1.67l24.38-29.87ZM220,92a12,12,0,1,1,12-12A12,12,0,0,1,220,92Z" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.29A169.47,169.47,0,0,1,24.4,128,169.47,169.47,0,0,1,48.07,97.29C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.29A169.47,169.47,0,0,1,231.6,128C223.06,143.34,183.47,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" />
    </svg>
  ),
  Wind: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M184,184a32,32,0,0,1-32,32c-13.7,0-26.95-8.93-31.5-21.22a8,8,0,0,1,15-5.56C137.74,195.27,145,200,152,200a16,16,0,0,0,0-32H40a8,8,0,0,1,0-16H152A32,32,0,0,1,184,184Zm-64-80A32,32,0,1,0,152,72c-13.7,0-26.95,8.93-31.5,21.22a8,8,0,0,0,15,5.56C137.74,92.73,145,88,152,88a16,16,0,0,1,0,32H40a8,8,0,0,0,0,16H152A32,32,0,0,0,120,104Zm88,0a40,40,0,0,0-40-40c-16.15,0-31.47,10.09-36.39,24a8,8,0,0,0,15.18,5c2.82-7.95,12-13,21.21-13a24,24,0,0,1,0,48H40a8,8,0,0,0,0,16H168A40,40,0,0,0,208,104Z" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.62,87.62,0,0,1-6.4,32.94l-44.7-27.49a15.92,15.92,0,0,0-6.24-2.23l-22.82-3.08a16.11,16.11,0,0,0-16,7.86h-8.72l-3.8-7.86a15.91,15.91,0,0,0-11-8.67l-8-1.73L96.14,104h16.71a16.06,16.06,0,0,0,7.73-2l12.25-6.76a16.62,16.62,0,0,0,3-2.14l26.91-24.34A15.93,15.93,0,0,0,168,57.87V40.65A88.11,88.11,0,0,1,216,128ZM40,128a87.53,87.53,0,0,1,8.54-37.8l11.34,30.27a16,16,0,0,0,11.62,10l21.43,4.61L96.74,144a16.09,16.09,0,0,0,10,14.78l9.19,4V195.1a16,16,0,0,0,7.57,13.58l1.69,1.05A88.08,88.08,0,0,1,40,128Z" />
    </svg>
  ),
  Package: () => (
    <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.78Z" />
    </svg>
  ),
};

// ── Section Data ─────────────────────────────────────────────────────────────

interface DocLink {
  label: string;
  href: string;
  description: string;
  external?: boolean;
}

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: () => JSX.Element;
  accent: string;
  links: DocLink[];
}

const DOC_SECTIONS: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Get started with Arcanea. Installation, orientation, and your first steps through the Academy.",
    icon: Icons.Rocket,
    accent: "#00bcd4",
    links: [
      {
        label: "Install Arcanea",
        href: "/install",
        description: "Set up your creative environment",
      },
      {
        label: "Welcome Guide",
        href: "/welcome",
        description: "Your first steps in the universe",
      },
      {
        label: "The Academy",
        href: "/academy",
        description: "Begin the Ten Gates progression",
      },
    ],
  },
  {
    id: "the-system",
    title: "The System",
    description:
      "The mythology that powers everything. Lumina and Nero, the Ten Guardians, the Five Elements, and the gates of creative mastery.",
    icon: Icons.Compass,
    accent: "#9966ff",
    links: [
      {
        label: "Mythology",
        href: "/lore",
        description: "The cosmic duality and founding myths",
      },
      {
        label: "Ten Guardians",
        href: "/lore/guardians",
        description: "Divine Guardians and their domains",
      },
      {
        label: "Ten Gates",
        href: "/lore/gates",
        description: "Frequencies of creative mastery",
      },
      {
        label: "Five Elements",
        href: "/lore/elements",
        description: "Fire, Water, Earth, Wind, and Void/Spirit",
      },
      {
        label: "Seven Wisdoms",
        href: "/lore/wisdoms",
        description: "Foundational principles of creation",
      },
    ],
  },
  {
    id: "creation-tools",
    title: "Creation Tools",
    description:
      "The surfaces where ideas become reality. Studio, AI chat, and code generation — all guided by Guardian intelligences.",
    icon: Icons.PaintBrush,
    accent: "#ffd700",
    links: [
      {
        label: "Studio",
        href: "/studio",
        description: "Visual creation workspace",
      },
      {
        label: "Arcanea Code",
        href: "/arcanea-code",
        description: "AI-assisted code generation",
      },
      {
        label: "Chat",
        href: "/chat",
        description: "Chat with AI companions",
      },
    ],
  },
  {
    id: "the-library",
    title: "The Library",
    description:
      "17 collections, 34+ original texts on creative philosophy and practice. Not entertainment — equipment for living.",
    icon: Icons.Books,
    accent: "#00bcd4",
    links: [
      {
        label: "Browse the Library",
        href: "/library",
        description: "All 17 collections of creator wisdom",
      },
      {
        label: "Laws of Arcanea",
        href: "/library",
        description: "Theoretical foundations",
      },
      {
        label: "Academy Handbook",
        href: "/library",
        description: "Complete guide to the Ten Gates",
      },
      {
        label: "Legends of Arcanea",
        href: "/library",
        description: "Founding myths of Lumina, Nero, and the Guardians",
      },
    ],
  },
  {
    id: "community",
    title: "Community",
    description:
      "Connect with fellow creators. Share your work, discover others, and build together in the Arcanea universe.",
    icon: Icons.Users,
    accent: "#22c55e",
    links: [
      {
        label: "Community Hub",
        href: "/community",
        description: "Creator profiles and discussions",
      },
      {
        label: "Gallery",
        href: "/gallery",
        description: "Browse community creations",
      },
    ],
  },
  {
    id: "for-developers",
    title: "For Developers",
    description:
      "Build on the Arcanea stack. npm packages, CLI tools, OS-level intelligence, and API documentation for extending the platform.",
    icon: Icons.Terminal,
    accent: "#f97316",
    links: [
      {
        label: "Developer Portal",
        href: "/developers",
        description: "API references and integration guides",
      },
      {
        label: "Arcanea OS",
        href: "/arcanea-os",
        description: "Operating system intelligence layer",
      },
      {
        label: "@arcanea/core",
        href: "https://www.npmjs.com/package/@arcanea/core",
        description: "Core types, constants, and mythology engine",
        external: true,
      },
      {
        label: "@arcanea/cli",
        href: "https://www.npmjs.com/package/@arcanea/cli",
        description: "Command-line tools for Arcanea development",
        external: true,
      },
    ],
  },
];

// ── Quick Links ──────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "What is Arcanea?", href: "/about", icon: Icons.Sparkle },
  { label: "The Ecosystem", href: "/ecosystem", icon: Icons.Globe },
  { label: "Ten Gates", href: "/lore/gates", icon: Icons.Shield },
  { label: "Five Elements", href: "/lore/elements", icon: Icons.Fire },
  { label: "Magic Ranks", href: "/lore/gates", icon: Icons.Crown },
  { label: "Open the Library", href: "/library", icon: Icons.Books },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_left,rgba(0,188,212,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(13,71,161,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-14 sm:px-14 sm:py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-atlantean-teal-aqua/10 via-transparent to-creation-prism-purple/8 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-atlantean-teal-aqua/6 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-creation-prism-purple/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-atlantean-teal-aqua/30 bg-atlantean-teal-aqua/10 mb-8">
                <Icons.Sparkle />
                <span className="text-xs font-mono tracking-widest uppercase text-atlantean-teal-aqua">
                  Documentation
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                Learn the system.
                <span className="block bg-gradient-to-r from-atlantean-teal-aqua via-cosmic-blue to-creation-prism-purple bg-clip-text text-transparent">
                  Master the craft.
                </span>
              </h1>

              <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mb-10">
                Everything you need to understand and build within the Arcanea
                universe — from your first steps through the Academy to
                extending the platform as a developer.
              </p>

              {/* Search Bar (visual) */}
              <div className="relative max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                  <Icons.MagnifyingGlass />
                </div>
                <input
                  type="text"
                  placeholder="Search documentation..."
                  readOnly
                  aria-label="Search documentation"
                  className="w-full pl-12 pr-4 py-4 rounded-xl liquid-glass border border-white/[0.06] bg-white/[0.04] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-atlantean-teal-aqua/40 focus:ring-2 focus:ring-atlantean-teal-aqua/20 focus:shadow-[0_0_24px_rgba(0,188,212,0.15)] transition-all cursor-default"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md border border-white/[0.06] bg-white/[0.04] text-xs text-text-muted font-mono">
                    Coming Soon
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick Links ──────────────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="text-xs font-mono tracking-[0.35em] uppercase text-atlantean-teal-aqua mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_LINKS.map((link) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-cosmic-surface/20 hover:border-atlantean-teal-aqua/30 hover:bg-atlantean-teal-aqua/5 transition-all"
                >
                  <span className="text-atlantean-teal-aqua opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
                    <LinkIcon />
                  </span>
                  <span className="text-sm font-medium text-text-primary truncate">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Documentation Sections Grid ─────────────────────────────── */}
        <section className="mb-16" aria-labelledby="sections-heading">
          <div className="mb-10">
            <h2
              id="sections-heading"
              className="text-xs font-mono tracking-[0.35em] uppercase text-atlantean-teal-aqua mb-2"
            >
              All Documentation
            </h2>
            <p className="text-2xl font-display font-bold">
              Explore by topic
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOC_SECTIONS.map((section) => {
              const SectionIcon = section.icon;
              return (
                <div
                  key={section.id}
                  className="group relative card-3d liquid-glass rounded-2xl p-7 overflow-hidden transition-all hover:border-white/[0.12] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 25% 25%, ${section.accent}12, transparent 65%)`,
                    }}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mb-5"
                      style={{ backgroundColor: `${section.accent}18` }}
                    >
                      <span style={{ color: section.accent }}>
                        <SectionIcon />
                      </span>
                    </div>

                    {/* Title and description */}
                    <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                      {section.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      {section.description}
                    </p>

                    {/* Links */}
                    <div className="space-y-2">
                      {section.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={
                            link.external ? "noopener noreferrer" : undefined
                          }
                          className="group/link flex items-center justify-between gap-3 px-3 py-2.5 -mx-3 rounded-lg hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="min-w-0">
                            <span
                              className="text-sm font-medium block"
                              style={{ color: section.accent }}
                            >
                              {link.label}
                            </span>
                            <span className="text-xs text-text-muted block truncate">
                              {link.description}
                            </span>
                          </div>
                          <span className="text-text-muted opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0">
                            {link.external ? (
                              <Icons.ArrowUpRight />
                            ) : (
                              <Icons.ArrowRight />
                            )}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Canon Reference ─────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="relative liquid-glass rounded-2xl p-8 sm:p-10 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(ellipse_at_30%_0%,#9966ff,transparent_70%)]" />

            <div className="relative flex flex-col md:flex-row items-start gap-8">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-creation-prism-purple/15">
                <span className="text-creation-prism-purple">
                  <Icons.Scroll />
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display text-xl font-semibold mb-2">
                  The Canonical Reference
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 max-w-2xl">
                  Arcanea is built on a locked canon — the cosmic duality of
                  Lumina and Nero, the Ten Gates from Foundation to
                  Source, ten Guardian-Godbeast pairs, and the Five
                  Elements including the Void/Spirit duality. All content
                  creation aligns with this source of truth.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/lore"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-creation-prism-purple/15 text-creation-prism-purple text-sm font-medium hover:bg-creation-prism-purple/25 transition-colors"
                  >
                    Explore the Lore
                    <Icons.ArrowRight />
                  </Link>
                  <Link
                    href="/lore/guardians"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.06] text-text-primary text-sm font-medium hover:border-creation-prism-purple/30 hover:bg-creation-prism-purple/5 transition-colors"
                  >
                    Meet the Guardians
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ──────────────────────────────────────────────── */}
        <section>
          <div className="relative overflow-hidden rounded-3xl">
            <div className="h-px w-full bg-gradient-to-r from-atlantean-teal-aqua via-creation-prism-purple to-gold-bright" />

            <div className="px-8 py-16 sm:px-14 sm:py-20 text-center">
              <p className="text-xs font-mono tracking-[0.35em] uppercase text-text-muted mb-6">
                Begin here
              </p>

              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 leading-snug max-w-2xl mx-auto">
                Ready to build your universe?
              </h2>

              <p className="text-text-secondary leading-relaxed max-w-xl mx-auto mb-10">
                Start with the Academy to learn the system, or jump straight
                into the Studio to begin creating. The Arc turns — begin.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/academy"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-atlantean-teal-aqua text-cosmic-deep font-semibold shadow-[0_0_24px_rgba(0,188,212,0.25)] hover:shadow-[0_0_36px_rgba(0,188,212,0.4)] hover:scale-[1.02] transition-all duration-200"
                >
                  Enter the Academy
                  <Icons.ArrowRight />
                </Link>
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-atlantean-teal-aqua/30 hover:bg-atlantean-teal-aqua/5 transition-all duration-200"
                >
                  Open the Studio
                </Link>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-gold-bright via-creation-prism-purple to-atlantean-teal-aqua" />
          </div>
        </section>
      </main>
    </div>
  );
}
