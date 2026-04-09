export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="pt-20 pb-8 text-center animate-pulse">
          <div className="h-3 w-40 mx-auto rounded bg-white/[0.06] mb-4" />
          <div className="h-10 w-64 mx-auto rounded bg-white/[0.06] mb-4" />
          <div className="h-4 w-48 mx-auto rounded bg-white/[0.06]" />
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-7 w-24 rounded-full bg-white/[0.04]" />
            ))}
          </div>
        </div>
        <div className="h-[60vh] rounded-2xl bg-white/[0.02] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white/10 animate-ping" />
        </div>
      </div>
    </div>
  );
}
