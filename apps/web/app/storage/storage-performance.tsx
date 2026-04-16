"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { SectionShell, SectionHeader, StatCard } from "@/components/premium";

const PERF_STATS = [
  {
    value: "150x",
    label: "faster vs keyword search",
    color: "#7fffd4",
    delay: 0,
  },
  {
    value: "12ms",
    label: "avg semantic query latency",
    color: "#00bcd4",
    delay: 0.08,
  },
  {
    value: "4x",
    label: "memory reduction w/ quantization",
    color: "#ffd700",
    delay: 0.16,
  },
  {
    value: "1M+",
    label: "vectors indexed per world",
    color: "#c084fc",
    delay: 0.24,
  },
];

const TECH_NOTES = [
  {
    title: "HNSW indexing",
    body: "Hierarchical Navigable Small World graph achieves O(log n) search — stays fast whether you have 1,000 or 10,000,000 vectors.",
    color: "#7fffd4",
  },
  {
    title: "Half-precision quantization",
    body: "Float32 embeddings compressed to Float16 via pgvector's built-in quantization. Same recall, half the storage, 2x cache utilization.",
    color: "#00bcd4",
  },
  {
    title: "Hybrid retrieval",
    body: "BM25 keyword search + cosine similarity combined with RRF fusion. Every query uses both pathways and ranks the merged result.",
    color: "#ffd700",
  },
  {
    title: "Connection pooling",
    body: "PgBouncer handles up to 10,000 concurrent connections per world. No cold starts. No connection exhaustion.",
    color: "#c084fc",
  },
];

export function StoragePerformance() {
  return (
    <LazyMotion features={domAnimation}>
      <SectionShell ambient="gold" id="performance">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Performance"
            title="Fast at any scale"
            subtitle="pgvector with HNSW indexing — the same engine powering production AI apps at billions of embeddings."
            accent="gold"
          />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
            {PERF_STATS.map((stat) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                color={stat.color}
                delay={stat.delay}
              />
            ))}
          </div>

          {/* Tech notes grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TECH_NOTES.map((note, i) => (
              <div
                key={note.title}
                className="p-6 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.1] transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                    style={{
                      background: note.color,
                      boxShadow: `0 0 8px ${note.color}60`,
                    }}
                  />
                  <div>
                    <h3
                      className="text-base font-display font-semibold mb-2"
                      style={{ color: note.color }}
                    >
                      {note.title}
                    </h3>
                    <p className="text-sm text-white/45 leading-relaxed">
                      {note.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
    </LazyMotion>
  );
}
