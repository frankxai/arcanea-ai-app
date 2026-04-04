export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      {/* Instant-ready chat UI skeleton — feels like the real thing */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4">
        {/* Header bar */}
        <div className="flex items-center justify-between py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00bcd4]/10" style={{
              background: 'linear-gradient(135deg, rgba(0,188,212,0.15), rgba(124,58,237,0.1))',
            }} />
            <div>
              <div className="w-20 h-4 bg-white/[0.08] rounded" />
              <div className="w-32 h-3 bg-white/[0.04] rounded mt-1.5" />
            </div>
          </div>
          <div className="w-20 h-7 rounded-lg bg-white/[0.04]" />
        </div>

        {/* Empty chat area with welcome message */}
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-xl mx-auto" style={{
              background: 'linear-gradient(135deg, rgba(0,188,212,0.2), rgba(124,58,237,0.15))',
            }} />
            <p className="text-white/30 text-sm">Loading your creative studio...</p>
            {/* Quick action hints */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['Write a story', 'Generate art', 'Build a world', 'Compose music'].map((label) => (
                <div key={label} className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05]">
                  <span className="text-xs text-white/20">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input bar at bottom — looks ready to type */}
        <div className="py-4 border-t border-white/[0.06]">
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 flex items-end gap-3">
            <div className="flex-1 min-h-[20px]">
              <span className="text-sm text-white/15">Type a message...</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#00bcd4]/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
