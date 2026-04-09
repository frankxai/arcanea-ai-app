export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-6 animate-pulse">
        <div className="pt-8"><div className="h-3 w-32 rounded bg-white/[0.06]" /></div>
        <div className="flex gap-2 mt-6 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-white/[0.04]" />
          ))}
        </div>
        <div className="h-8 w-48 rounded bg-white/[0.06] mb-2" />
        <div className="h-4 w-32 rounded bg-white/[0.04] mb-10" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </div>
  );
}
