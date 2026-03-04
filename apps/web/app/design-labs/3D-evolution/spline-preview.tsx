"use client";

import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-white/60">
      Loading Spline scene...
    </div>
  ),
});

const sceneUrl = process.env.NEXT_PUBLIC_SPLINE_EVOLUTION_SCENE;

export function SplinePreview() {
  if (!sceneUrl) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-6 text-center text-sm text-white/65">
        Set <span className="mx-1 font-semibold text-cyan-100">`NEXT_PUBLIC_SPLINE_EVOLUTION_SCENE`</span>
        to enable live Spline background embedding in this proposal.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#060a14]">
      <div className="min-h-[320px] w-full">
        <Spline scene={sceneUrl} />
      </div>
    </div>
  );
}
