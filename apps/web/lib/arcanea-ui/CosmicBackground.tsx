import React from "react";
import { cn } from "./utils";

type Props = {
  className?: string;
};

export function CosmicBackground({ className }: Props) {
  return (
    <div className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Ambient aurora — very subtle */}
      <div
        className="absolute -top-48 left-1/2 -translate-x-1/2 h-[70vh] w-[140vw] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(35% 50% at 40% 40%, rgba(0,188,212,0.06), transparent 70%)," +
            "radial-gradient(40% 60% at 65% 55%, rgba(0,137,123,0.05), transparent 70%)",
        }}
      />

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[40vh] w-[120vw] rounded-full opacity-20 blur-[100px]"
        style={{
          background: "radial-gradient(50% 50% at 50% 80%, rgba(13,71,161,0.05), transparent 70%)",
        }}
      />

      {/* Noise texture — extremely subtle */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.5%27/%3E%3C/svg%3E')",
        mixBlendMode: "overlay",
      }} />
    </div>
  );
}
