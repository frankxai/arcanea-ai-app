export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-12 w-48 bg-white/5 rounded-xl mb-4" />
      <div className="h-4 w-72 bg-white/5 rounded mb-16" />
      <div className="space-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-6">
            <div className="w-4 h-4 rounded-full bg-white/10 mt-1 shrink-0" />
            <div className="flex-1 h-32 bg-white/5 rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
