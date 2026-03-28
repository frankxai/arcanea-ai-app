export default function Loading() {
  return (
    <div className="min-h-screen py-24 px-4 animate-pulse">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-48 h-8 bg-white/[0.08] rounded-xl mx-auto mb-3" />
          <div className="w-72 h-4 bg-white/[0.04] rounded mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-black/40 border border-white/[0.04] rounded-2xl overflow-hidden"
            >
              <div className="aspect-square bg-white/[0.04]" />
              <div className="p-4 space-y-2">
                <div className="w-3/4 h-4 bg-white/[0.08] rounded" />
                <div className="w-1/2 h-3 bg-white/[0.04] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
