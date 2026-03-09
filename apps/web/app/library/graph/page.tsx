import { Metadata } from "next";
import Link from "next/link";
import { buildContentGraph, getCollections } from "../../../lib/content";
import { GraphLoader } from "./graph-loader";

export const metadata: Metadata = {
  title: "The Web of Wisdom | Arcanea Library",
  description:
    "Explore the interconnected knowledge graph of the Library of Arcanea. See how texts relate through shared themes, situations, and reading paths.",
  openGraph: {
    title: "The Web of Wisdom | Arcanea Library",
    description:
      "An interactive force-directed graph of the Library of Arcanea — 17 collections, hundreds of connections.",
  },
};

export default async function GraphPage() {
  const graph = await buildContentGraph();
  const collections = await getCollections();

  const avgConnections =
    graph.nodes.length > 0
      ? (graph.edges.length / graph.nodes.length).toFixed(1)
      : "0";

  return (
    <main className="relative min-h-screen">
      {/* ── Tab Navigation ── */}
      <nav className="relative z-20 mx-auto max-w-7xl px-6 pt-12 pb-0">
        <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
          <Link
            href="/library"
            className="rounded-full border border-white/[0.06] px-4 py-2 text-sm text-text-muted hover:border-atlantean-teal-aqua/30 hover:text-atlantean-teal-aqua transition-all duration-300"
          >
            Browse Library
          </Link>
          <Link
            href="/library/codex"
            className="rounded-full border border-white/[0.06] px-4 py-2 text-sm text-text-muted hover:border-atlantean-teal-aqua/30 hover:text-atlantean-teal-aqua transition-all duration-300"
          >
            Luminor Codex
          </Link>
          <span className="rounded-full bg-atlantean-teal-aqua px-4 py-2 text-sm font-semibold text-cosmic-deep">
            Relationship Graph
          </span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-16 md:py-20">
        {/* Ambient glows */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(13,71,161,0.08) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,188,212,0.06) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute top-[50%] right-[30%] w-[300px] h-[300px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-5">
            <span className="text-gradient-cosmic">The Web of Wisdom</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed mb-10">
            Every text in the Library connects to others through shared themes,
            situations, and reading paths. Click a node to explore its
            connections.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            {[
              {
                value: String(graph.nodes.length),
                label: "Texts",
                color: "#00bcd4",
              },
              {
                value: String(collections.length),
                label: "Collections",
                color: "#ffd700",
              },
              {
                value: String(graph.edges.length),
                label: "Connections",
                color: "#0d47a1",
              },
              {
                value: avgConnections,
                label: "Avg per Text",
                color: "#ec4899",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl liquid-glass border border-white/[0.06]"
              >
                <span
                  className="text-xl font-display font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
                <span className="text-[11px] text-text-muted uppercase tracking-[0.15em]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Graph Visualization ── */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <GraphLoader graph={graph} collections={collections} />
      </section>

      {/* ── Legend ── */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="liquid-glass rounded-3xl border border-white/[0.06] p-6 md:p-8">
          <h2 className="text-[10px] font-mono font-semibold uppercase tracking-[0.25em] text-atlantean-teal-aqua/80 mb-5">
            Connection Types
          </h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[
              { type: "Related", color: "#00bcd4", dash: false },
              { type: "Prerequisite", color: "#ffd700", dash: false },
              { type: "Next Reading", color: "#ef4444", dash: false },
              { type: "Shared Tag", color: "#a78bfa", dash: true },
              { type: "Shared Situation", color: "#3b82f6", dash: true },
            ].map((item) => (
              <div key={item.type} className="flex items-center gap-3">
                <div className="relative w-10 h-3 flex items-center">
                  <div
                    className="w-full h-[2px]"
                    style={{
                      backgroundColor: item.color,
                      opacity: 0.8,
                      ...(item.dash
                        ? {
                            backgroundImage: `repeating-linear-gradient(90deg, ${item.color} 0px, ${item.color} 4px, transparent 4px, transparent 8px)`,
                            backgroundColor: "transparent",
                            height: "2px",
                          }
                        : {}),
                    }}
                  />
                </div>
                <span className="text-sm text-text-secondary">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
