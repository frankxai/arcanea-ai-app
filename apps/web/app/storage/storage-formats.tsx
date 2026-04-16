"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { SectionShell, SectionHeader } from "@/components/premium";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FormatTab {
  id: string;
  label: string;
  color: string;
  description: string;
  code: string;
}

const FORMATS: FormatTab[] = [
  {
    id: "markdown",
    label: "Markdown",
    color: "#7fffd4",
    description:
      "Every piece of content is plain Markdown with YAML frontmatter. Human-writable, version-controllable, readable in any editor.",
    code: `---
type: character
name: Kael Dawnstrider
gate: Source
element: Wind
faction: Starlight Corps
relationships:
  - { target: "Rina Ashveil", type: "ally" }
  - { target: "The Vault", type: "home" }
tags: [detective, wind-user, lore-anchor]
created: 2026-04-14
---

# Kael Dawnstrider

Former intelligence analyst turned rogue archivist. Kael carries
a fractured Source shard — enough to read memory echoes, not
enough to stay sane doing it.

## Abilities

- **Echo Reading** — touch an object and see its last 3 owners
- **Wind-Skip** — short teleport using ambient air currents
- **Signal Null** — block remote sensing within 10m radius`,
  },
  {
    id: "jsonml",
    label: "JSONML",
    color: "#00bcd4",
    description:
      "World graph nodes and edges use JSONML — a typed superset of JSON with native support for linked data and versioned schema.",
    code: `{
  "$schema": "arcanea/world-node/v2",
  "id": "world:fractured-meridian",
  "type": "world",
  "name": "The Fractured Meridian",
  "gate": "Forge",
  "metadata": {
    "era": "Post-Convergence",
    "scale": "continental",
    "factions": ["Starlight Corps", "Vel'Tara", "Free Leagues"]
  },
  "edges": [
    {
      "type": "contains",
      "target": "location:the-vault",
      "weight": 1.0
    },
    {
      "type": "references",
      "target": "world:origin-sea",
      "weight": 0.4,
      "note": "Parallel dimension split at Convergence"
    }
  ],
  "embedding": {
    "model": "text-embedding-3-large",
    "dims": 1536,
    "indexed_at": "2026-04-14T09:32:11Z"
  }
}`,
  },
  {
    id: "rdf",
    label: "Linked Data",
    color: "#ffd700",
    description:
      "For interoperability, any world exports as RDF/Turtle — standard linked data that external tools and knowledge graphs can consume.",
    code: `@prefix arcanea: <https://arcanea.ai/ontology#> .
@prefix schema: <https://schema.org/> .
@prefix ex:     <https://arcanea.ai/worlds/fractured-meridian#> .

ex:KaelDawnstrider
  a arcanea:Character ;
  schema:name "Kael Dawnstrider" ;
  arcanea:gate arcanea:SourceGate ;
  arcanea:element arcanea:Wind ;
  arcanea:faction ex:StarlightCorps ;
  arcanea:homeWorld ex:FracturedMeridian ;
  arcanea:ability [
    a arcanea:Ability ;
    schema:name "Echo Reading" ;
    arcanea:tier 2
  ] ;
  arcanea:linkedIdentity [
    arcanea:platform "Arcanea" ;
    arcanea:profileUrl "https://arcanea.ai/c/kael-dawnstrider"
  ] .

ex:FracturedMeridian
  a arcanea:World ;
  schema:name "The Fractured Meridian" ;
  arcanea:gate arcanea:ForgeGate ;
  arcanea:contains ex:TheVault .`,
  },
];

export function StorageFormats() {
  const [active, setActive] = useState<string>("markdown");
  const current = FORMATS.find((f) => f.id === active) ?? FORMATS[0];

  return (
    <LazyMotion features={domAnimation}>
      <SectionShell ambient="none" id="formats">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="File formats"
            title="The open guarantee"
            subtitle="Every file you create is stored in open formats. No proprietary lock. Export, edit, move, or delete with zero friction."
            accent="teal"
          />

          {/* Tab bar */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {FORMATS.map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setActive(fmt.id)}
                className="relative px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200"
                style={{
                  background: active === fmt.id ? `${fmt.color}12` : "transparent",
                  border: `1px solid ${active === fmt.id ? fmt.color + "30" : "rgba(255,255,255,0.07)"}`,
                  color: active === fmt.id ? fmt.color : "rgba(255,255,255,0.35)",
                }}
              >
                {fmt.label}
                {active === fmt.id && (
                  <m.span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    layoutId="format-dot"
                    style={{ background: fmt.color }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Description */}
          <AnimatePresence mode="wait">
            <m.p
              key={current.id + "-desc"}
              className="text-sm text-white/45 mb-5 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {current.description}
            </m.p>
          </AnimatePresence>

          {/* Code block */}
          <AnimatePresence mode="wait">
            <m.div
              key={current.id}
              className="relative rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {/* Header bar */}
              <div
                className="flex items-center gap-3 px-5 py-3 border-b"
                style={{
                  background: `${current.color}06`,
                  borderColor: `${current.color}15`,
                }}
              >
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <span
                  className="text-[11px] font-mono tracking-wider"
                  style={{ color: `${current.color}60` }}
                >
                  {current.label === "Markdown"
                    ? "character.md"
                    : current.label === "JSONML"
                    ? "world.jsonml"
                    : "world.ttl"}
                </span>
                <div className="ml-auto">
                  <span
                    className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded"
                    style={{
                      background: `${current.color}10`,
                      color: `${current.color}70`,
                    }}
                  >
                    {current.label}
                  </span>
                </div>
              </div>

              {/* Code */}
              <pre
                className="overflow-x-auto p-6 text-[13px] leading-relaxed font-mono"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  color: "rgba(255,255,255,0.6)",
                  borderLeft: `2px solid ${current.color}20`,
                  borderRight: `1px solid rgba(255,255,255,0.04)`,
                  borderBottom: `1px solid rgba(255,255,255,0.04)`,
                  borderBottomLeftRadius: "1rem",
                  borderBottomRightRadius: "1rem",
                }}
              >
                {highlightCode(current.code, current.id, current.color)}
              </pre>
            </m.div>
          </AnimatePresence>
        </div>
      </SectionShell>
    </LazyMotion>
  );
}

// Lightweight syntax highlighting — no external dep
function highlightCode(code: string, format: string, color: string) {
  if (format === "markdown") {
    return (
      <code>
        {code.split("\n").map((line, i) => {
          if (line.startsWith("---")) {
            return <span key={i} style={{ color: `${color}50` }}>{line}{"\n"}</span>;
          }
          if (line.startsWith("# ") || line.startsWith("## ")) {
            return <span key={i} style={{ color }}>{line}{"\n"}</span>;
          }
          if (line.match(/^[a-z_]+:/)) {
            const [k, ...rest] = line.split(":");
            return (
              <span key={i}>
                <span style={{ color: `${color}cc` }}>{k}</span>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>:{rest.join(":")}</span>
                {"\n"}
              </span>
            );
          }
          if (line.startsWith("- **")) {
            return (
              <span key={i}>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>- </span>
                <span style={{ color, fontWeight: 600 }}>
                  {line.replace(/^- /, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                </span>
                {"\n"}
              </span>
            );
          }
          return <span key={i} style={{ color: "rgba(255,255,255,0.5)" }}>{line}{"\n"}</span>;
        })}
      </code>
    );
  }
  if (format === "jsonml") {
    return (
      <code>
        {code.split("\n").map((line, i) => {
          const keyMatch = line.match(/^(\s*)("[\w$]+")(\s*:\s*)(.*)/);
          if (keyMatch) {
            return (
              <span key={i}>
                {keyMatch[1]}
                <span style={{ color: `${color}cc` }}>{keyMatch[2]}</span>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>{keyMatch[3]}</span>
                <span style={{ color: "rgba(255,255,255,0.55)" }}>{keyMatch[4]}</span>
                {"\n"}
              </span>
            );
          }
          if (line.match(/^[{}[\],]/)) {
            return <span key={i} style={{ color: "rgba(255,255,255,0.2)" }}>{line}{"\n"}</span>;
          }
          return <span key={i} style={{ color: "rgba(255,255,255,0.45)" }}>{line}{"\n"}</span>;
        })}
      </code>
    );
  }
  // RDF/Turtle
  return (
    <code>
      {code.split("\n").map((line, i) => {
        if (line.startsWith("@prefix")) {
          return <span key={i} style={{ color: `${color}70` }}>{line}{"\n"}</span>;
        }
        if (line.match(/^ex:\w/)) {
          return <span key={i} style={{ color }}>{line}{"\n"}</span>;
        }
        if (line.match(/^\s+a\s/)) {
          return <span key={i} style={{ color: `${color}90` }}>{line}{"\n"}</span>;
        }
        if (line.match(/^\s+arcanea:|schema:/)) {
          const [pred, ...rest] = line.trim().split(" ");
          return (
            <span key={i}>
              {"  "}
              <span style={{ color: `${color}80` }}>{pred}</span>
              {" "}
              <span style={{ color: "rgba(255,255,255,0.5)" }}>{rest.join(" ")}</span>
              {"\n"}
            </span>
          );
        }
        return <span key={i} style={{ color: "rgba(255,255,255,0.4)" }}>{line}{"\n"}</span>;
      })}
    </code>
  );
}
