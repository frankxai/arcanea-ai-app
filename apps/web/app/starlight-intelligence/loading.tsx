export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-5xl mx-auto px-6 animate-pulse">
        <div className="pt-20 pb-16 text-center">
          <div className="h-3 w-24 mx-auto rounded bg-white/[0.06] mb-4" />
          <div className="h-12 w-80 mx-auto rounded bg-white/[0.06] mb-6" />
          <div className="h-4 w-96 mx-auto rounded bg-white/[0.04]" />
        </div>
        <div className="space-y-2 mb-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </div>
  );
}
