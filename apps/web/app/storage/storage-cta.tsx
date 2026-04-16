"use client";

import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function StorageCTA() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[#09090b]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <m.div
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Card gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00bcd4]/10 via-[#7fffd4]/05 to-[#0d47a1]/10" />
            <div className="absolute inset-0 bg-white/[0.015]" />
            <div className="absolute inset-0 border border-white/[0.06] rounded-3xl" />

            {/* Ambient orb */}
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#7fffd4]/[0.04] blur-[120px] rounded-full" />

            <div className="relative p-10 md:p-16 text-center">
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#7fffd4]/50 mb-5">
                Open. Sovereign. Yours.
              </p>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-[-0.03em] text-white mb-5 leading-[1.1]">
                Your world lives where{" "}
                <span className="bg-gradient-to-r from-[#7fffd4] via-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
                  you decide
                </span>
              </h2>

              <p className="text-base text-white/40 max-w-xl mx-auto mb-10 leading-relaxed font-body">
                Start with Arcanea Cloud, migrate to your own Supabase, sync to
                your Obsidian vault, or publish to Arweave. Open standards all
                the way down.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/settings/storage"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#00bcd4] px-8 py-3.5 text-sm font-semibold text-[#09090b] transition hover:shadow-[0_0_40px_rgba(127,255,212,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Set up sync
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/docs/storage"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-8 py-3.5 text-sm font-medium text-white/60 backdrop-blur-sm transition hover:border-white/20 hover:text-white"
                >
                  See storage docs
                </Link>
              </div>

              <p className="mt-8 text-[11px] font-mono text-white/20 tracking-wider">
                MIT licensed core. No vendor lock-in. Export anytime.
              </p>
            </div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
