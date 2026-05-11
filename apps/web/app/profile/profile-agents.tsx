/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Agent {
  name: string;
  role: string;
  description: string;
  glyph: string;
  color: string;
  badge: string;
  platform: string;
  url?: string;
}

const AGENTS: Agent[] = [
  {
    name: "Kael Dawnstrider",
    role: "Detective Luminor",
    description:
      "Wind-element investigator from the Fractured Meridian. Runs Echo Reading protocols and Signal Null operations.",
    glyph: "✶",
    color: "var(--arc-brand-atlantean-teal)",
    badge: "CUSTOM GPT",
    platform: "ChatGPT",
    url: "https://chatgpt.com/g/",
  },
  {
    name: "Rina Ashveil",
    role: "Archive Keeper",
    description:
      "Keeper of the Vault. Source-aligned AI librarian trained on 40+ chapters of world canon.",
    glyph: "◈",
    color: "var(--arc-brand-atlantean-teal)",
    badge: "ARCANEA AGENT",
    platform: "Arcanea",
    url: "/agents",
  },
  {
    name: "Shinkami",
    role: "Guardian Companion",
    description:
      "Evolved guardian. Specialises in world-building co-creation, lore consistency, and creative direction.",
    glyph: "◎",
    color: "var(--arc-brand-arcanean-gold)",
    badge: "GUARDIAN",
    platform: "Arcanea",
    url: "/agents",
  },
  {
    name: "Lumina",
    role: "Orchestrator",
    description:
      "The default Arcanea orchestrator. Coordinates creative workflows, routes tasks across Luminors.",
    glyph: "◉",
    color: "var(--arc-void)",
    badge: "ORCHESTRATOR",
    platform: "Arcanea",
    url: "/luminors",
  },
];

export function ProfileAgents() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="mb-16">
        <m.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div>
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/25 mb-1">
              Luminors &amp; AI
            </p>
            <h2 className="text-xl font-display font-bold text-white tracking-[-0.02em]">
              Agents I&apos;ve forged
            </h2>
          </div>
          <a
            href="/agents"
            className="text-xs font-mono text-[var(--arc-brand-atlantean-teal)]/60 hover:text-[var(--arc-brand-atlantean-teal)] transition-colors flex items-center gap-1"
          >
            View all
            <span>&rarr;</span>
          </a>
        </m.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AGENTS.map((agent, i) => (
            <m.div
              key={agent.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
            >
              <AgentCard agent={agent} />
            </m.div>
          ))}
        </div>
      </section>
    </LazyMotion>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const Comp = agent.url ? "a" : "div";
  const linkProps = agent.url
    ? agent.url.startsWith("http")
      ? { href: agent.url, target: "_blank", rel: "noopener noreferrer" }
      : { href: agent.url }
    : {};

  return (
    <Comp
      {...linkProps}
      className="group flex items-start gap-4 p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
    >
      {/* Avatar glyph */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{
          background: `${agent.color}12`,
          border: `1px solid ${agent.color}25`,
          color: agent.color,
        }}
      >
        {agent.glyph}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
          <h3 className="text-sm font-display font-semibold text-white/90 group-hover:text-white transition-colors">
            {agent.name}
          </h3>
          <span
            className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded shrink-0"
            style={{
              background: `${agent.color}12`,
              color: `${agent.color}90`,
            }}
          >
            {agent.badge}
          </span>
        </div>

        <p className="text-[11px] text-white/40 font-mono mb-2">
          {agent.role} &middot; {agent.platform}
        </p>

        <p className="text-xs text-white/45 leading-relaxed line-clamp-2">
          {agent.description}
        </p>
      </div>
    </Comp>
  );
}
