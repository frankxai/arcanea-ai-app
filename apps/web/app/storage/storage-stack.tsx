"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { SectionShell, SectionHeader, FeatureCard, FeatureIcon } from "@/components/premium";

const LAYERS = [
  {
    number: "01",
    glyph: "◰",
    color: "#7fffd4",
    title: "Content",
    format: "Markdown + JSONML",
    body:
      "Every chapter, character, world note, and dialogue is stored as plain Markdown with YAML frontmatter. Structured nodes use JSONML — a superset that keeps human readability while adding typed edges.",
    example: "character.md · world.jsonml",
  },
  {
    number: "02",
    glyph: "◱",
    color: "#00bcd4",
    title: "Metadata",
    format: "Frontmatter + Linked Data",
    body:
      "Frontmatter carries structured metadata: gate, type, tags, relationships. Linked-data triples let you query across worlds with SPARQL-style selectors. Machines read it; humans edit it.",
    example: "YAML · RDF/Turtle · JSON-LD",
  },
  {
    number: "03",
    glyph: "◲",
    color: "#0d47a1",
    title: "Embedding",
    format: "pgvector + HNSW",
    body:
      "On every save, content is embedded using your model of choice (text-embedding-3-large, Gemini, or local). Stored as pgvector in Supabase. HNSW indexing makes retrieval sub-12ms at any scale.",
    example: "1536-dim vectors · cosine sim",
  },
  {
    number: "04",
    glyph: "◳",
    color: "#ffd700",
    title: "Index",
    format: "HNSW Graph",
    body:
      "The Hierarchical Navigable Small World graph sits over your vectors. Approximate nearest-neighbor search that stays fast as your world grows — from 100 nodes to 1M+.",
    example: "M=16 · ef_construction=200",
  },
  {
    number: "05",
    glyph: "◎",
    color: "#c084fc",
    title: "Retrieval",
    format: "Semantic + Graph Queries",
    body:
      "The query layer combines semantic similarity with graph traversal. Ask 'what characters are linked to this location across all my worlds?' and get typed, ranked results in milliseconds.",
    example: "hybrid search · graph walk",
  },
];

export function StorageStack() {
  return (
    <LazyMotion features={domAnimation}>
      <SectionShell ambient="teal" id="stack">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="The storage stack"
            title="Five layers. One unified graph."
            subtitle="From raw markdown to semantic retrieval — every layer is open, inspectable, and replaceable."
            accent="teal"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {LAYERS.map((layer, i) => (
              <FeatureCard key={layer.number} glowColor={layer.color} delay={i * 0.06} compact>
                <FeatureIcon color={layer.color} size="sm">
                  <span className="text-base font-bold">{layer.glyph}</span>
                </FeatureIcon>

                <p
                  className="text-[10px] font-mono tracking-[0.2em] uppercase mb-1"
                  style={{ color: `${layer.color}60` }}
                >
                  Layer {layer.number}
                </p>

                <h3
                  className="text-base font-display font-semibold mb-1"
                  style={{ color: layer.color }}
                >
                  {layer.title}
                </h3>

                <p className="text-[11px] font-mono text-white/40 mb-3">
                  {layer.format}
                </p>

                <p className="text-xs text-white/45 leading-relaxed mb-4">
                  {layer.body}
                </p>

                <div
                  className="mt-auto px-2.5 py-1.5 rounded-lg text-[10px] font-mono"
                  style={{
                    background: `${layer.color}08`,
                    border: `1px solid ${layer.color}18`,
                    color: `${layer.color}80`,
                  }}
                >
                  {layer.example}
                </div>
              </FeatureCard>
            ))}
          </div>

          {/* Stack diagram hint */}
          <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
            {LAYERS.map((layer, i) => (
              <div key={layer.number} className="flex items-center gap-2">
                <div
                  className="px-3 py-1.5 rounded-full text-[11px] font-mono border"
                  style={{
                    background: `${layer.color}08`,
                    borderColor: `${layer.color}20`,
                    color: `${layer.color}90`,
                  }}
                >
                  {layer.title}
                </div>
                {i < LAYERS.length - 1 && (
                  <svg
                    className="w-4 h-4 text-white/20 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
    </LazyMotion>
  );
}
