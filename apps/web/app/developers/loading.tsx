export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded-lg mb-4" />
      <div className="h-4 w-96 bg-white/5 rounded mb-12" />
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-white/5 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
