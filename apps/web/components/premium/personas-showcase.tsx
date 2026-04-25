"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { Feather, Sword, FilmStrip, Terminal, Sparkle } from "@/lib/phosphor-icons";
import type { PhosphorIcon } from "@/lib/phosphor-icons";
import { creatorAccents } from "@arcanea/design-system";

// ---------------------------------------------------------------------------
// PersonasShowcase — "Who Arcanea is for" — five creator archetypes
// with concrete use cases. Helps visitors self-identify.
// ---------------------------------------------------------------------------

interface Persona {
  Icon: PhosphorIcon;
  title: string;
  tagline: string;
  useCase: string;
  accent: string;
  cta: { label: string; href: string };
}

const PERSONAS: Persona[] = [
  {
    Icon: Feather,
    title: "Novelists & Authors",
    tagline: "For writers building long-form fiction",
    useCase:
      "Draft chapters, keep 50+ characters consistent across a trilogy, publish to markdown or EPUB.",
    accent: creatorAccents.novelist,
    cta: { label: "Open Studio", href: "/studio/author" },
  },
  {
    Icon: Sword,
    title: "Game Designers",
    tagline: "For campaign architects and world-builders",
    useCase:
      "Generate factions, design magic systems, keep lore consistent across dozens of sessions.",
    accent: creatorAccents.gameDesigner,
    cta: { label: "Build a World", href: "/worlds" },
  },
  {
    Icon: FilmStrip,
    title: "Filmmakers & Showrunners",
    tagline: "For visual storytellers",
    useCase:
      "Pitch decks, character sheets, mood boards, scene-by-scene beats — with cover art generated in-line.",
    accent: creatorAccents.filmmaker,
    cta: { label: "Open Imagine", href: "/imagine" },
  },
  {
    Icon: Terminal,
    title: "Developers & Engineers",
    tagline: "For AI-native builders",
    useCase:
      "27 repos, MCP server, agent framework, BYOK inference. Fork anything. Deploy your own Luminors.",
    accent: creatorAccents.developer,
    cta: { label: "See Ecosystem", href: "/ecosystem" },
  },
  {
    Icon: Sparkle,
    title: "Solo Creators",
    tagline: "For everyone building a universe from scratch",
    useCase:
      "One creator, one platform, one connected world. Text, image, music — all linked, all exportable.",
    accent: creatorAccents.soloCreator,
    cta: { label: "Start Chatting", href: "/chat" },
  },
];

export function PersonasShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {PERSONAS.map((persona, i) => {
        const Icon = persona.Icon;
        return (
        <m.div
          key={persona.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.55,
            delay: i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`
            group relative overflow-hidden rounded-2xl
            bg-white/[0.025] border border-white/[0.06]
            backdrop-blur-sm p-6 md:p-7
            hover:border-white/[0.14] hover:bg-white/[0.04]
            transition-colors duration-500
            ${i === 4 ? "lg:col-span-1 md:col-start-1 lg:col-start-2" : ""}
          `}
        >
          {/* Accent glow on hover */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(400px circle at 50% 0%, ${persona.accent}12, transparent 60%)`,
            }}
          />

          {/* Accent line top */}
          <m.div
            className="absolute top-0 left-6 right-6 h-px"
            style={{ background: `linear-gradient(to right, transparent, ${persona.accent}80, transparent)` }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.08 + 0.2 }}
          />

          <div className="relative">
            {/* Icon */}
            <div
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4"
              style={{
                background: `${persona.accent}10`,
                border: `1px solid ${persona.accent}25`,
                color: persona.accent,
              }}
            >
              <Icon size={18} weight="duotone" color={persona.accent} />
            </div>

            {/* Title */}
            <h3 className="text-base font-display font-semibold text-white mb-1">
              {persona.title}
            </h3>

            {/* Tagline */}
            <p
              className="text-[11px] font-mono tracking-wider uppercase mb-4"
              style={{ color: `${persona.accent}aa` }}
            >
              {persona.tagline}
            </p>

            {/* Use case */}
            <p className="text-sm text-white/50 leading-relaxed mb-5 min-h-[60px]">
              {persona.useCase}
            </p>

            {/* CTA */}
            <Link
              href={persona.cta.href}
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-transform group-hover:translate-x-0.5"
              style={{ color: persona.accent }}
            >
              {persona.cta.label}
              <span className="text-xs">&rarr;</span>
            </Link>
          </div>
        </m.div>
        );
      })}
    </div>
  );
}
