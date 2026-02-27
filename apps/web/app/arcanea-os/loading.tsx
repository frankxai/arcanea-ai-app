export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-12 w-64 bg-white/5 rounded-xl mb-4 mx-auto" />
      <div className="h-4 w-80 bg-white/5 rounded mb-16 mx-auto" />
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="h-64 bg-white/5 rounded-2xl" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-36 bg-white/5 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
