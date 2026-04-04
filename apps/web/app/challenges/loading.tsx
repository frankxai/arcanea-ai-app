export default function ChallengesLoading() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="h-10 w-52 rounded-lg bg-white/[0.04] animate-pulse mb-3" />
        <div className="h-5 w-96 rounded bg-white/[0.03] animate-pulse mb-12" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/[0.02] animate-pulse border border-white/[0.04]" />
          ))}
        </div>
      </div>
    </div>
  );
}
