export default function VoiceLoading() {
  return (
    <div className="min-h-screen bg-[#09090b] animate-pulse">
      <div className="max-w-4xl mx-auto px-6 pt-32">
        {/* Hero skeleton */}
        <div className="text-center mb-16">
          <div className="h-4 w-24 mx-auto rounded bg-white/[0.04] mb-6" />
          <div className="h-12 w-80 mx-auto rounded-lg bg-white/[0.03] mb-4" />
          <div className="h-5 w-64 mx-auto rounded bg-white/[0.02]" />
        </div>
        {/* Persona cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
            />
          ))}
        </div>
        {/* Modes skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-white/[0.02] border border-white/[0.04]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
