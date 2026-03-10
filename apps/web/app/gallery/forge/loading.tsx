export default function ForgeLoading() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-sm text-neutral-500">Loading the Forge...</p>
      </div>
    </div>
  );
}
