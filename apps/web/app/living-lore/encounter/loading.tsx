export default function EncounterLoading() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="h-10 w-56 rounded-lg bg-white/[0.04] animate-pulse mb-3" />
        <div className="h-5 w-80 rounded bg-white/[0.03] animate-pulse mb-12" />
        <div className="rounded-2xl bg-white/[0.02] animate-pulse border border-white/[0.04] h-96" />
      </div>
    </div>
  );
}
