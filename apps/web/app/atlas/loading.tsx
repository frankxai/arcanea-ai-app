export default function AtlasLoading() {
  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void,#05070f)] text-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="h-4 w-32 bg-white/10 rounded-full mx-auto" />
          <div className="h-10 w-96 bg-white/10 rounded-xl mx-auto" />
          <div className="h-4 w-80 bg-white/5 rounded mx-auto" />
        </div>
        <div className="h-12 w-full max-w-xl mx-auto bg-white/5 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="h-72 bg-white/5 rounded-2xl border border-white/5" />
          <div className="h-72 bg-white/5 rounded-2xl border border-white/5" />
          <div className="h-72 bg-white/5 rounded-2xl border border-white/5" />
        </div>
      </div>
    </div>
  );
}
