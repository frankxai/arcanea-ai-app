"use client";

import Image from "next/image";
import { useState } from "react";
import { getGuardianAlt } from "@/lib/guardian-alt-texts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GuardianVersion =
  | "v3"
  | "v2-divine"
  | "v2-godbeast"
  | "v1"
  | "gallery";

export type GuardianImageSize = "sm" | "md" | "lg" | "hero";

export interface GuardianImageProps {
  /** Guardian identifier, e.g. "shinkami", "lyssandria" */
  name: string;
  version?: GuardianVersion;
  size?: GuardianImageSize;
  /** Override className on the outermost container */
  className?: string;
  /** Override the resolved alt text */
  alt?: string;
  /** For godbeast images, pass the godbeast name separately, e.g. "kaelith" */
  godbeastName?: string;
  /** For gallery images, pass the gallery number (default 2) */
  galleryNum?: number;
  /** Additional className applied to the <Image> element */
  imageClassName?: string;
  /** Priority-load this image (disables lazy loading) */
  priority?: boolean;
}

// ---------------------------------------------------------------------------
// Size map — pixel dimensions + responsive sizes hint
// ---------------------------------------------------------------------------

const SIZE_MAP: Record<
  GuardianImageSize,
  { width: number; height: number; sizes: string }
> = {
  sm: {
    width: 48,
    height: 48,
    sizes: "48px",
  },
  md: {
    width: 256,
    height: 320,
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  },
  lg: {
    width: 512,
    height: 640,
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  },
  hero: {
    width: 896,
    height: 1120,
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw",
  },
};

// ---------------------------------------------------------------------------
// Path resolution
// ---------------------------------------------------------------------------

function resolveSrc(
  name: string,
  version: GuardianVersion,
  godbeastName?: string,
  galleryNum = 2
): string {
  switch (version) {
    case "v3":
      return `/guardians/v3/${name}-hero-v3.webp`;
    case "v2-divine":
      return `/guardians/v2/${name}-divine-bond.webp`;
    case "v2-godbeast":
      return `/guardians/v2/${godbeastName ?? name}-godbeast.webp`;
    case "v1":
      return `/guardians/${name}-hero.webp`;
    case "gallery":
      return `/guardians/gallery/${name}-gallery-${galleryNum}.webp`;
    default:
      return `/guardians/v3/${name}-hero-v3.webp`;
  }
}

function resolveAlt(
  name: string,
  version: GuardianVersion,
  godbeastName?: string,
  galleryNum = 2
): string {
  // Derive the path and try the canonical alt text mapping first
  const src = resolveSrc(name, version, godbeastName, galleryNum);
  const mapped = getGuardianAlt(src);
  if (!mapped.startsWith('Guardian artwork:')) {
    return mapped;
  }

  // Fallback to generated alt text
  const label = name.charAt(0).toUpperCase() + name.slice(1);
  switch (version) {
    case "v3":
      return `${label} — ultra-quality portrait v3`;
    case "v2-divine":
      return `${label} — divine bond art`;
    case "v2-godbeast": {
      const beast = godbeastName
        ? godbeastName.charAt(0).toUpperCase() + godbeastName.slice(1)
        : label;
      return `${beast} — Godbeast of ${label}`;
    }
    case "v1":
      return `${label} — original hero portrait`;
    case "gallery":
      return `${label} — gallery art`;
    default:
      return label;
  }
}

// ---------------------------------------------------------------------------
// Placeholder — a simple CSS gradient that matches the cosmic palette
// ---------------------------------------------------------------------------

function Placeholder({ size }: { size: GuardianImageSize }) {
  const dim = SIZE_MAP[size];
  return (
    <div
      style={{ width: dim.width, height: dim.height }}
      className="absolute inset-0 bg-gradient-to-b from-[#0d0d1a] to-[#080810] animate-pulse"
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// GuardianImage component
// ---------------------------------------------------------------------------

/**
 * Optimised Guardian portrait via Next.js <Image>.
 *
 * Usage:
 *   <GuardianImage name="shinkami" version="v3" size="md" />
 *   <GuardianImage name="kaelith" version="v2-godbeast" godbeastName="kaelith" size="sm" />
 */
export function GuardianImage({
  name,
  version = "v3",
  size = "md",
  className,
  alt,
  godbeastName,
  galleryNum = 2,
  imageClassName,
  priority = false,
}: GuardianImageProps) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { width, height, sizes } = SIZE_MAP[size];
  const src = resolveSrc(name, version, godbeastName, galleryNum);
  const resolvedAlt = alt ?? resolveAlt(name, version, godbeastName, galleryNum);

  // sm size is always square; use fill=false with fixed w/h
  const isThumbnail = size === "sm";

  if (errored) {
    // Graceful fallback: monogram inside a colored square
    const initial = name.charAt(0).toUpperCase();
    return (
      <div
        className={`flex items-center justify-center bg-[#1a1a2e] text-white/30 text-xs font-mono select-none ${className ?? ""}`}
        style={{ width, height }}
        aria-label={resolvedAlt}
      >
        {initial}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={isThumbnail ? { width, height } : undefined}
    >
      {/* Blur placeholder shown until image loads */}
      {!loaded && <Placeholder size={size} />}

      <Image
        src={src}
        alt={resolvedAlt}
        width={width}
        height={height}
        sizes={isThumbnail ? `${width}px` : sizes}
        quality={size === "hero" ? 90 : 80}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`
          transition-opacity duration-500
          ${loaded ? "opacity-100" : "opacity-0"}
          ${isThumbnail ? "w-full h-full object-cover" : "w-full h-auto"}
          ${imageClassName ?? ""}
        `}
      />
    </div>
  );
}
