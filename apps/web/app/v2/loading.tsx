export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-atlantean-aqua/30 border-t-atlantean-aqua rounded-full animate-spin mx-auto" />
        <p className="text-white/40 text-sm">Loading...</p>
      </div>
    </div>
  );
}
