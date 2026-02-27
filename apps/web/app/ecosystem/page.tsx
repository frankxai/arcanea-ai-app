import { Metadata } from "next";
import Link from "next/link";
import { EcosystemDiagram } from "@/components/ecosystem/ecosystem-diagram";

export const metadata: Metadata = {
  title: "Ecosystem | Arcanea",
  description:
    "The complete Arcanea creator ecosystem — platform, tools, overlays, on-chain, and automation.",
};

// ─── Inline SVG Icons ───────────────────────────────────────────────────────
const Icons = {
  Planet: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M240,128A112,112,0,1,1,128,16,112.13,112.13,0,0,1,240,128Zm-16.34-20.54C215.17,79.25,190.51,56,160,56c-20.26,0-38.15,9.36-51.73,24.74A95.9,95.9,0,0,0,32.67,147.93C40.83,176.75,65.49,200,96,200c20.26,0,38.15-9.36,51.73-24.74A95.9,95.9,0,0,0,223.66,107.46ZM128,40a88,88,0,0,0-85.77,68.27C55.09,91.73,74.77,80,96,80c28.22,0,52.37,16.34,65.08,40.48A77.59,77.59,0,0,1,128,216a88,88,0,0,0,0-176Z" />
    </svg>
  ),
  Vault: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M216,56H40A16,16,0,0,0,24,72V184a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56Zm0,128H40V72H216V184ZM96,128a32,32,0,1,1,32,32A32,32,0,0,1,96,128Zm16,0a16,16,0,1,0,16-16A16,16,0,0,0,112,128Zm80,0a8,8,0,0,1-8,8H176a8,8,0,0,1,0-16h8A8,8,0,0,1,192,128Z" />
    </svg>
  ),
  Graph: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M200,152a31.84,31.84,0,0,0-19.53,6.68L143,126.23a32.19,32.19,0,0,0,0-20.46l37.5-32.45A31.84,31.84,0,0,0,200,80a32,32,0,1,0-32-32,31.84,31.84,0,0,0,6.68,19.53L137.23,100A32,32,0,0,0,96,100L56.43,67.53A31.84,31.84,0,0,0,56,48a32,32,0,1,0-32,32,31.84,31.84,0,0,0,19.53-6.68L83.23,106A32,32,0,0,0,96,152v24a32,32,0,1,0,16,0V152a32,32,0,0,0-19.53-29.32l36.84-31.14A32,32,0,0,0,156.77,106l27.7,23.79A32,32,0,1,0,200,152Z" />
    </svg>
  ),
  Code: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.25,12.3Zm176,27.7-48-40a8,8,0,1,0-10.25,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z" />
    </svg>
  ),
  Browsers: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm-32,160H40V88H184Zm32-32H200V88a16,16,0,0,0-16-16H72V56H216Z" />
    </svg>
  ),
  Gear: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.08a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.48a8,8,0,0,0-3.93,6L67.32,64.19q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.08,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.9,123.66Z" />
    </svg>
  ),
  Link: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L72.5,104.28A56,56,0,0,1,149.31,102a8,8,0,1,1-10.64,12,40,40,0,0,0-54.85,1.63L59.7,139.72a40,40,0,0,0,56.58,56.58l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56.08,56.08,0,0,0-79.22,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.58,56.58L172.18,140.4A40,40,0,0,1,117.33,142a8,8,0,0,0-10.64,12,56,56,0,0,0,76.82-2.26l24.12-24.12A56.08,56.08,0,0,0,207.62,48.38Z" />
    </svg>
  ),
  GraduationCap: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87V200a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V117.87l16-8.81a8,8,0,0,0,0-14.12ZM192,136v56H64V121.56l56,29.87a8,8,0,0,0,7.52,0Zm-64,8.68L35.42,96,128,47.06,220.58,96Z" />
    </svg>
  ),
  Books: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M231.65,194.53,198.46,36.75a16,16,0,0,0-19.58-12.36l-48.62,10.13a16.08,16.08,0,0,0-10.89,8.15A16,16,0,0,0,104,40H56A16,16,0,0,0,40,56V224a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V169.8l14.61,3a16.13,16.13,0,0,0,3.18.31,16,16,0,0,0,15.71-12.88.61.61,0,0,0,0-.1Zm-120-34.14V224H56V56h48V204A16,16,0,0,0,111.65,160.39ZM192,224H127.69a.46.46,0,0,0,.06-.09l-3.75-18L192,191.5Zm-48-63.05V67.89l48.78-10.17,32.44,156.1Z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  ),
  ArrowUpRight: () => (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
    </svg>
  ),
  Sparkles: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M208,144a16,16,0,1,0,16,16A16,16,0,0,0,208,144Zm0,24a8,8,0,1,1,8-8A8,8,0,0,1,208,168ZM48,112A16,16,0,1,0,32,96,16,16,0,0,0,48,112Zm0-24a8,8,0,1,1-8,8A8,8,0,0,1,48,96Zm80,16a8,8,0,0,0,7.59-5.47l8.1-24.31,24.31-8.1a8,8,0,0,0,0-15.18L143.69,50.9l-8.1-24.31a8,8,0,0,0-15.18,0L112.31,50.9,88,59a8,8,0,0,0,0,15.18l24.31,8.1,8.1,24.31A8,8,0,0,0,128,112Zm-9.54-55.06,9.54-28.61,9.54,28.61a8,8,0,0,0,5.06,5.06L171.21,72l-28.61,9.54a8,8,0,0,0-5.06,5.06L128,115.21l-9.54-28.61a8,8,0,0,0-5.06-5.06L84.79,72l28.61-9.54A8,8,0,0,0,118.46,56.94Zm93.51,85.53a8,8,0,0,0-10.12,5.06L192,173.21l-9.85-29.68a8,8,0,0,0-5.06-5.06L147.41,128.57a8,8,0,0,0,0-15.14l29.68-9.85a8,8,0,0,0,5.06-5.06l9.85-29.68,9.85,29.68a8,8,0,0,0,5.06,5.06l29.68,9.85a8,8,0,0,0,0,15.14l-29.68,9.85A8,8,0,0,0,211.97,142.47ZM124.12,152.57a8,8,0,0,0-10.12,5.07L104.15,186.5l-9.85-28.86a8,8,0,0,0-5.06-5.07L60.37,142.72a8,8,0,0,0,0-15.14l28.87-9.86a8,8,0,0,0,5.06-5.06l9.85-28.87a8,8,0,0,0,15.14,0l9.85,28.87a8,8,0,0,0,5.07,5.06l28.86,9.86a8,8,0,0,0,0,15.14l-28.86,9.85A8,8,0,0,0,124.12,152.57Z" />
    </svg>
  ),
};

// ─── Data ───────────────────────────────────────────────────────────────────

type StatusVariant = "live" | "beta" | "oss" | "templates" | "coming";

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  statusVariant: StatusVariant;
  href: string;
  external: boolean;
  icon: () => JSX.Element;
  accent: string;
}

const PRODUCTS: Product[] = [
  {
    id: "platform",
    name: "arcanea.ai",
    tagline: "Platform Hub",
    description:
      "Chat, Imagine, Studio, and Records — four surfaces of one mythology. Create universes, stories, and art alongside Guardian intelligences tuned to your creative frequency.",
    status: "Live",
    statusVariant: "live",
    href: "/chat",
    external: false,
    icon: Icons.Planet,
    accent: "#7fffd4",
  },
  {
    id: "vault",
    name: "Arcanea Vault",
    tagline: "Chrome Extension",
    description:
      "Export AI conversations from ChatGPT, Claude, Gemini, Grok, and DeepSeek directly into your creative library. Your best thinking, captured and organized.",
    status: "Live",
    statusVariant: "live",
    href: "https://github.com/frankxai/arcanea-vault",
    external: true,
    icon: Icons.Vault,
    accent: "#7fffd4",
  },
  {
    id: "flow",
    name: "Arcanea Flow",
    tagline: "Agent Orchestration",
    description:
      "Multi-agent swarm orchestration with 60+ specialized agents. Hierarchical coordination, HNSW memory, and Byzantine fault-tolerant consensus. MIT licensed.",
    status: "MIT Open Source",
    statusVariant: "oss",
    href: "https://github.com/frankxai/arcanea-flow",
    external: true,
    icon: Icons.Graph,
    accent: "#22c55e",
  },
  {
    id: "code",
    name: "Arcanea Code",
    tagline: "VS Code Extension",
    description:
      "Guardian-assisted coding inside VS Code. Your AI companions follow you into the editor — context-aware, domain-specialized, and cosmically aligned.",
    status: "Beta",
    statusVariant: "beta",
    href: "/arcanea-code",
    external: false,
    icon: Icons.Code,
    accent: "#ffd700",
  },
  {
    id: "overlays",
    name: "AI Overlays",
    tagline: "Platform Integrations",
    description:
      "Inject Arcanea intelligence into ChatGPT, Claude, Gemini, Copilot, and Cursor. Your Guardians follow you everywhere — every platform, every session.",
    status: "Beta",
    statusVariant: "beta",
    href: "/overlays",
    external: false,
    icon: Icons.Browsers,
    accent: "#ffd700",
  },
  {
    id: "n8n",
    name: "n8n Workflows",
    tagline: "Automation",
    description:
      "Daily creator cycle automation: content pipelines, learning loops, and community workflows. Pre-built templates for the structured creative practice.",
    status: "Templates Available",
    statusVariant: "templates",
    href: "/install",
    external: false,
    icon: Icons.Gear,
    accent: "#78a6ff",
  },
  {
    id: "onchain",
    name: "Arcanea On-Chain",
    tagline: "IP Protection",
    description:
      "Mint your creations as NFTs on Base. Story Protocol licensing gives creators sovereign ownership of their universes, characters, and lore.",
    status: "Coming Soon",
    statusVariant: "coming",
    href: "https://github.com/frankxai/arcanea-onchain",
    external: true,
    icon: Icons.Link,
    accent: "#9966ff",
  },
  {
    id: "academy",
    name: "The Academy",
    tagline: "Progression System",
    description:
      "Ten Gates from Apprentice to Luminor. Each Gate unlocks new creative domains, deeper Guardian relationships, and expanded access to the Arcanea universe.",
    status: "Live",
    statusVariant: "live",
    href: "/academy",
    external: false,
    icon: Icons.GraduationCap,
    accent: "#7fffd4",
  },
  {
    id: "library",
    name: "The Library",
    tagline: "Knowledge System",
    description:
      "17 collections, 34+ sacred texts of timeless creator wisdom. Not entertainment — equipment for living. Enter seeking, leave transformed.",
    status: "Live",
    statusVariant: "live",
    href: "/library",
    external: false,
    icon: Icons.Books,
    accent: "#7fffd4",
  },
];

const STATUS_STYLES: Record<StatusVariant, string> = {
  live: "bg-atlantean-teal-aqua/15 text-atlantean-teal-aqua border-atlantean-teal-aqua/30",
  beta: "bg-gold-bright/15 text-gold-bright border-gold-bright/30",
  oss: "bg-green-500/15 text-green-400 border-green-500/30",
  templates: "bg-cosmic-blue/15 text-cosmic-blue border-cosmic-blue/30",
  coming: "bg-white/5 text-text-muted border-white/10",
};

// ─── Connection Pillars ───────────────────────────────────────────────────────

const PILLARS = [
  {
    label: "Create",
    description:
      "Platform Hub and Vault form the creative core — where ideas are generated and captured.",
    products: ["arcanea.ai", "Arcanea Vault"],
    accent: "#7fffd4",
  },
  {
    label: "Automate",
    description:
      "Flow, Overlays, and n8n extend your creative reach — agents, integrations, and workflows.",
    products: ["Arcanea Flow", "AI Overlays", "n8n Workflows"],
    accent: "#ffd700",
  },
  {
    label: "Protect and Grow",
    description:
      "On-Chain, Academy, and Library secure your work and deepen your mastery over time.",
    products: ["Arcanea On-Chain", "The Academy", "The Library"],
    accent: "#9966ff",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EcosystemPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(153,102,255,0.08),transparent_55%)]" />
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
                <Icons.Sparkles />
                <span className="text-xs font-mono tracking-widest uppercase text-atlantean-teal-aqua">
                  The Ecosystem
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                One mythology.
                <span className="block bg-gradient-to-r from-atlantean-teal-aqua via-cosmic-blue to-creation-prism-purple bg-clip-text text-transparent">
                  Nine surfaces.
                </span>
                <span className="block text-text-primary">
                  Every stage of creation.
                </span>
              </h1>

              <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mb-10">
                Arcanea is not a single tool — it is a living ecosystem built
                for the complete creative life. A platform, a browser extension,
                an agent orchestration layer, a VS Code companion, platform
                overlays, automation workflows, on-chain IP protection, a
                progression system, and a library of timeless wisdom. Each
                product works alone. Together, they become something else
                entirely.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-atlantean-teal-aqua text-cosmic-deep font-semibold hover:shadow-[0_0_24px_rgba(127,255,212,0.4)] transition-all duration-200"
                >
                  Start building your universe
                  <Icons.ArrowRight />
                </Link>
                <Link
                  href="/academy"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-text-primary font-semibold hover:border-atlantean-teal-aqua/30 hover:bg-atlantean-teal-aqua/5 transition-all duration-200"
                >
                  Begin the Academy
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Ecosystem Diagram ─────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="glass rounded-3xl p-8 sm:p-12">
            <EcosystemDiagram />
          </div>
        </section>

        {/* ── Product Grid ──────────────────────────────────────────────── */}
        <section className="mb-16" aria-labelledby="products-heading">
          <div className="mb-10">
            <h2
              id="products-heading"
              className="text-xs font-mono tracking-[0.35em] uppercase text-atlantean-teal-aqua mb-2"
            >
              All Products
            </h2>
            <p className="text-2xl font-display font-bold">
              The complete map
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => {
              const ProductIcon = product.icon;
              const Tag = product.external ? "a" : Link;
              const tagProps = product.external
                ? {
                    href: product.href,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : { href: product.href };

              return (
                <Tag
                  key={product.id}
                  {...(tagProps as Record<string, string>)}
                  className="group relative glass rounded-2xl p-7 overflow-hidden transition-all hover:border-white/20 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                  aria-label={`${product.name} — ${product.tagline}`}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 25% 25%, ${product.accent}12, transparent 65%)`,
                    }}
                  />

                  <div className="relative">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${product.accent}18` }}
                      >
                        <span style={{ color: product.accent }}>
                          <ProductIcon />
                        </span>
                      </div>

                      <span
                        className="text-xs font-mono px-3 py-1 rounded-full border"
                        style={{
                          backgroundColor: `${product.accent}12`,
                          color:
                            product.statusVariant === "coming"
                              ? "var(--color-text-muted, #6b7280)"
                              : product.accent,
                          borderColor: `${product.accent}30`,
                        }}
                      >
                        {product.status}
                      </span>
                    </div>

                    {/* Names */}
                    <p className="text-xs font-mono tracking-widest uppercase text-text-muted mb-1">
                      {product.tagline}
                    </p>
                    <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      {product.description}
                    </p>

                    {/* CTA row */}
                    <div
                      className="flex items-center gap-1.5 text-sm font-semibold opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ color: product.accent }}
                    >
                      <span>
                        {product.external ? "View on GitHub" : "Explore"}
                      </span>
                      {product.external ? (
                        <Icons.ArrowUpRight />
                      ) : (
                        <Icons.ArrowRight />
                      )}
                    </div>
                  </div>
                </Tag>
              );
            })}
          </div>
        </section>

        {/* ── How It Connects ───────────────────────────────────────────── */}
        <section className="mb-16" aria-labelledby="pillars-heading">
          <div className="mb-10">
            <h2
              id="pillars-heading"
              className="text-xs font-mono tracking-[0.35em] uppercase text-gold-bright mb-2"
            >
              How It Connects
            </h2>
            <p className="text-2xl font-display font-bold">
              Three phases of the creative life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map((pillar, index) => (
              <div
                key={pillar.label}
                className="relative glass rounded-2xl p-7 overflow-hidden"
              >
                {/* Subtle gradient accent */}
                <div
                  className="absolute inset-0 opacity-[0.06] rounded-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 30% 0%, ${pillar.accent}, transparent 70%)`,
                  }}
                />

                <div className="relative">
                  {/* Phase number */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-5"
                    style={{
                      backgroundColor: `${pillar.accent}18`,
                      color: pillar.accent,
                    }}
                  >
                    {index + 1}
                  </div>

                  <h3
                    className="font-display text-xl font-bold mb-3"
                    style={{ color: pillar.accent }}
                  >
                    {pillar.label}
                  </h3>

                  <p className="text-text-secondary text-sm leading-relaxed mb-5">
                    {pillar.description}
                  </p>

                  {/* Product tags */}
                  <div className="flex flex-wrap gap-2">
                    {pillar.products.map((name) => (
                      <span
                        key={name}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg border"
                        style={{
                          backgroundColor: `${pillar.accent}10`,
                          color: pillar.accent,
                          borderColor: `${pillar.accent}25`,
                        }}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────────────── */}
        <section>
          <div className="relative overflow-hidden rounded-3xl">
            <div className="h-px w-full bg-gradient-to-r from-atlantean-teal-aqua via-creation-prism-purple to-gold-bright" />

            <div className="px-8 py-16 sm:px-14 sm:py-20 text-center">
              <p className="text-xs font-mono tracking-[0.35em] uppercase text-text-muted mb-6">
                Begin here
              </p>

              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 leading-snug max-w-2xl mx-auto">
                Start building your universe
              </h2>

              <p className="text-text-secondary leading-relaxed max-w-xl mx-auto mb-10">
                Every product in the ecosystem is designed to grow with you.
                Start with the platform. Add tools as your practice deepens.
                The Arc turns — begin.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-atlantean-teal-aqua text-cosmic-deep font-semibold shadow-[0_0_24px_rgba(127,255,212,0.25)] hover:shadow-[0_0_36px_rgba(127,255,212,0.4)] hover:scale-[1.02] transition-all duration-200"
                >
                  Open the platform
                  <Icons.ArrowRight />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass border border-white/10 text-text-primary font-semibold hover:border-atlantean-teal-aqua/30 hover:bg-atlantean-teal-aqua/5 transition-all duration-200"
                >
                  Learn about Arcanea
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
