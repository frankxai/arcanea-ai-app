export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-56 bg-white/5 rounded-3xl mb-16" />

      {/* 3 workflow cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-32 bg-white/5 rounded" />
            <div className="h-48 bg-white/5 rounded-2xl" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-3/4 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* How to use */}
      <div className="h-48 bg-white/5 rounded-2xl mb-8" />
      <div className="h-24 bg-white/5 rounded-2xl" />
    </div>
  );
}
