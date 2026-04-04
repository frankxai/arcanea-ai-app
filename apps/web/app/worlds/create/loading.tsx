export default function CreateWorldLoading() {
  return (
    <main className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Pulsing orb */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-[#00bcd4]/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-[#00bcd4]/30 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#00bcd4] to-[#7c3aed] opacity-60" />
        </div>
        {/* Skeleton text */}
        <div className="space-y-3 max-w-md mx-auto">
          <div className="h-8 w-48 mx-auto rounded-lg bg-white/[0.04] animate-pulse" />
          <div className="h-4 w-64 mx-auto rounded bg-white/[0.03] animate-pulse" />
        </div>
      </div>
    </main>
  );
}
