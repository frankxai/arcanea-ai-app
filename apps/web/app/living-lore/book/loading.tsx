export default function Loading() {
  return (
    <div className="min-h-screen py-24 px-4 animate-pulse">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-64 h-8 bg-white/[0.08] rounded-xl mx-auto mb-3" />
          <div className="w-80 h-4 bg-white/[0.04] rounded mx-auto" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-black/40 border border-white/[0.04] rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="w-48 h-4 bg-white/[0.08] rounded" />
                <div className="w-24 h-3 bg-white/[0.04] rounded" />
              </div>
              <div className="w-16 h-3 bg-white/[0.04] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
