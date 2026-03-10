"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FORGE_ASSETS,
  SHIP_OF_THE_WEEK,
  DOMAIN_LABELS,
  DOMAIN_COLORS,
  DOMAIN_BG,
  type VesselDomain,
  type ForgeAsset,
} from "./forge-data";

// ---------------------------------------------------------------------------
// Domain filter tabs
// ---------------------------------------------------------------------------

const DOMAINS: { key: VesselDomain | "all"; label: string }[] = [
  { key: "all", label: "All Domains" },
  { key: "space", label: "Space" },
  { key: "sea", label: "Sea" },
  { key: "sky", label: "Sky" },
  { key: "void", label: "Void" },
  { key: "hybrid", label: "Hybrid" },
];

// ---------------------------------------------------------------------------
// Card component
// ---------------------------------------------------------------------------

function ForgeCard({ asset }: { asset: ForgeAsset }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group relative rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/20 transition-all duration-300">
      {/* Image */}
      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={() => setExpanded(!expanded)}
      >
        <Image
          src={asset.image}
          alt={asset.title}
          width={asset.width}
          height={asset.height}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Domain badge */}
        <div
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${DOMAIN_BG[asset.domain]}`}
        >
          <span className={DOMAIN_COLORS[asset.domain]}>
            {DOMAIN_LABELS[asset.domain]}
          </span>
        </div>

        {/* Class badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 backdrop-blur-sm text-neutral-300 capitalize">
          {asset.vesselClass}
        </div>

        {/* Title on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-sm font-semibold text-white">{asset.title}</h3>
        </div>
      </div>

      {/* Expanded description */}
      {expanded && (
        <div className="p-4 border-t border-white/[0.06]">
          <p className="text-sm text-neutral-400 leading-relaxed">
            {asset.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              by {asset.createdBy}
            </span>
            <span className="text-xs text-neutral-600">#{asset.id}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Featured / Ship of the Week
// ---------------------------------------------------------------------------

function FeaturedShip({ asset }: { asset: ForgeAsset }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-cyan-500/10 bg-white/[0.02]">
      <Image
        src={asset.image}
        alt={asset.title}
        width={asset.width}
        height={asset.height}
        className="w-full h-auto object-cover"
        priority
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            Featured
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${DOMAIN_BG[asset.domain]}`}
          >
            <span className={DOMAIN_COLORS[asset.domain]}>
              {DOMAIN_LABELS[asset.domain]}
            </span>
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          {asset.title}
        </h2>
        <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">
          {asset.description}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stats bar
// ---------------------------------------------------------------------------

function StatsBar() {
  const domainCounts = FORGE_ASSETS.reduce(
    (acc, a) => {
      acc[a.domain] = (acc[a.domain] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
      <div>
        <span className="text-neutral-500">Total vessels</span>{" "}
        <span className="text-white font-medium">{FORGE_ASSETS.length}</span>
      </div>
      {Object.entries(domainCounts).map(([domain, count]) => (
        <div key={domain}>
          <span className="text-neutral-500 capitalize">{domain}</span>{" "}
          <span className={`font-medium ${DOMAIN_COLORS[domain as VesselDomain]}`}>
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Community CTA
// ---------------------------------------------------------------------------

function CommunityCTA() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
      <div className="max-w-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">
          Design Your Own Vessel
        </h3>
        <p className="text-sm text-neutral-400 leading-relaxed mb-4">
          Every creator has a dream ship. Use the Arcanea Forge to design yours
          — across space, sea, sky, or void. Share it with the community and see
          it featured here.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
          >
            Open Studio
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-neutral-300 text-sm font-medium border border-white/10 hover:bg-white/10 transition-colors"
          >
            Back to Gallery
          </Link>
        </div>
      </div>

      {/* Roadmap */}
      <div className="mt-6 pt-6 border-t border-white/[0.06]">
        <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
          Coming Soon
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: "Community Uploads",
              desc: "Submit your vessel designs for the gallery",
            },
            {
              title: "Voting",
              desc: "Upvote your favorite designs each week",
            },
            {
              title: "Ship of the Week",
              desc: "Featured vessel chosen by the community",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
            >
              <p className="text-sm font-medium text-neutral-300">
                {item.title}
              </p>
              <p className="text-xs text-neutral-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ForgeGalleryPage() {
  const [activeDomain, setActiveDomain] = useState<VesselDomain | "all">(
    "all",
  );

  const filtered =
    activeDomain === "all"
      ? FORGE_ASSETS
      : FORGE_ASSETS.filter((a) => a.domain === activeDomain);

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/gallery"
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Gallery
            </Link>
            <span className="text-neutral-700">/</span>
            <span className="text-xs text-neutral-300">The Forge</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            The Forge
          </h1>
          <p className="text-neutral-400 mt-2 max-w-xl">
            Vessel art across every domain. Space, sea, sky, and void.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <StatsBar />
        </div>

        {/* Featured */}
        {SHIP_OF_THE_WEEK && (
          <div className="mb-10">
            <FeaturedShip asset={SHIP_OF_THE_WEEK} />
          </div>
        )}

        {/* Domain filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DOMAINS.map((d) => (
            <button
              key={d.key}
              onClick={() => setActiveDomain(d.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                activeDomain === d.key
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-white/[0.02] border-white/[0.06] text-neutral-500 hover:text-neutral-300 hover:border-white/10"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {filtered.map((asset) => (
            <ForgeCard key={asset.id} asset={asset} />
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <p className="text-neutral-500">
                No vessels in this domain yet. Be the first to forge one.
              </p>
            </div>
          )}
        </div>

        {/* Community CTA */}
        <CommunityCTA />
      </div>
    </div>
  );
}
