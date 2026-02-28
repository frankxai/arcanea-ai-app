export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-12 w-64 bg-white/[0.04] rounded-xl mb-4 mx-auto" />
      <div className="h-4 w-80 bg-white/[0.04] rounded mb-16 mx-auto" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-56 bg-white/[0.04] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
