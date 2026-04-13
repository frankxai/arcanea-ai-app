export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-6 animate-pulse">
        <div className="pt-24 pb-16 text-center">
          <div className="h-3 w-48 mx-auto rounded bg-white/[0.06] mb-6" />
          <div className="h-14 w-72 mx-auto rounded bg-white/[0.06] mb-4" />
          <div className="h-5 w-96 mx-auto rounded bg-white/[0.04]" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </div>
  );
}
