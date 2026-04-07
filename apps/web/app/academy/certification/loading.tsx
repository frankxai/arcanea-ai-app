export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#00bcd4]/20 border-t-[#00bcd4] rounded-full animate-spin" />
        <p className="text-sm text-white/30">Loading certification...</p>
      </div>
    </div>
  );
}
