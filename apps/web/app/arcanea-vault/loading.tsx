export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-12 w-72 bg-white/[0.04] rounded-xl mb-4 mx-auto" />
      <div className="h-4 w-96 bg-white/[0.04] rounded mb-6 mx-auto" />
      <div className="h-12 w-48 bg-white/[0.06] rounded-xl mb-16 mx-auto" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 bg-white/[0.04] rounded-2xl" />
        ))}
      </div>
      <div className="h-14 w-56 bg-white/[0.06] rounded-xl mx-auto" />
    </div>
  );
}
