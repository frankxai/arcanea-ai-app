"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { SectionShell, SectionHeader } from "@/components/premium";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PILLARS = [
  {
    glyph: "◎",
    color: "#7fffd4",
    title: "Set up daily backups",
    body: "Point to any S3-compatible bucket — Cloudflare R2, AWS S3, Backblaze B2. Backups run on your schedule with AES-256 encryption at rest.",
    tag: "Backup",
  },
  {
    glyph: "◱",
    color: "#00bcd4",
    title: "Export entire worlds as .zip",
    body: "One click to download your entire world — every character, chapter, asset, and metadata — as a structured .zip you can open in any editor.",
    tag: "Export",
  },
  {
    glyph: "◰",
    color: "#ffd700",
    title: "Version history via git",
    body: "Every save can push a commit to your GitHub repo. Full diff history, branching, rollback — your worlds get full software-grade version control.",
    tag: "Version Control",
  },
  {
    glyph: "△",
    color: "#c084fc",
    title: "Delete means delete",
    body: "When you delete content, it is gone. No 30-day retention. No shadow backups. Cascade deletes remove embeddings, metadata, and linked data immediately.",
    tag: "Privacy",
  },
];

export function StorageSovereignty() {
  return (
    <LazyMotion features={domAnimation}>
      <SectionShell ambient="none" id="sovereignty">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Your backup, your rules"
            title="You own every bit of it"
            subtitle="Arcanea never holds your data hostage. Export, backup, version, or delete on your terms."
            accent="teal"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PILLARS.map((pillar, i) => (
              <m.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                whileHover={{ y: -3 }}
                className="group relative p-7 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-500"
              >
                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(400px circle at 50% 0%, ${pillar.color}08, transparent 50%)`,
                  }}
                />

                <div className="relative flex items-start gap-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
                    style={{
                      background: `${pillar.color}10`,
                      border: `1px solid ${pillar.color}20`,
                      color: pillar.color,
                    }}
                  >
                    {pillar.glyph}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3
                        className="text-base font-display font-semibold"
                        style={{ color: pillar.color }}
                      >
                        {pillar.title}
                      </h3>
                      <span
                        className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded shrink-0"
                        style={{
                          background: `${pillar.color}10`,
                          color: `${pillar.color}80`,
                        }}
                      >
                        {pillar.tag}
                      </span>
                    </div>
                    <p className="text-sm text-white/45 leading-relaxed">
                      {pillar.body}
                    </p>
                  </div>
                </div>
              </m.div>
            ))}
          </div>

          {/* Open source callout */}
          <m.div
            className="mt-10 p-8 rounded-2xl bg-white/[0.015] border border-white/[0.05] text-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-white/20 mb-3">
              Open source
            </p>
            <p className="text-base text-white/50 max-w-xl mx-auto leading-relaxed">
              The entire storage schema, embedding pipeline, and sync protocol is MIT licensed on GitHub.
              Fork it, extend it, run it on your own infrastructure.
            </p>
            <a
              href="https://github.com/frankxai/arcanea"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm font-mono text-[#7fffd4]/70 hover:text-[#7fffd4] transition-colors"
            >
              github.com/frankxai/arcanea
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </m.div>
        </div>
      </SectionShell>
    </LazyMotion>
  );
}
