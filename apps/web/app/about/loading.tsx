/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,rgba(0,188,212,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,0.1),transparent_50%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Skeleton */}
        <section className="pt-20 pb-16">
          <div className="max-w-4xl">
            <Skeleton variant="rect" className="w-56 h-8 rounded-full mb-8" />
            <Skeleton variant="text" className="w-96 h-12 mb-4" />
            <Skeleton variant="text" className="w-full h-8 mb-2" />
            <Skeleton variant="text" className="w-3/4 h-8 mb-6" />
            <SkeletonText lines={3} className="max-w-3xl" />
          </div>
        </section>

        {/* Cards Skeleton */}
        <section className="py-16 border-t border-white/[0.04]">
          <Skeleton variant="text" className="w-64 h-8 mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/[0.06] liquid-glass"
              >
                <Skeleton variant="text" className="w-24 h-3 mb-3" />
                <Skeleton variant="text" className="w-full h-6 mb-2" />
                <SkeletonText lines={3} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
