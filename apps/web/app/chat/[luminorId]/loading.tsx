export default function Loading() {
  return (
    <div className="flex h-screen animate-pulse">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/[0.06] p-4 space-y-4">
        <div className="h-10 w-full bg-white/[0.04] rounded-xl" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-full bg-white/[0.04] rounded-lg" />
          ))}
        </div>
        <div className="mt-auto space-y-2">
          <div className="h-16 w-full bg-white/[0.04] rounded-xl" />
        </div>
      </aside>
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.06]">
          <div className="w-10 h-10 rounded-full bg-white/[0.06]" />
          <div className="space-y-1">
            <div className="h-5 w-28 bg-white/[0.08] rounded" />
            <div className="h-3 w-20 bg-white/[0.04] rounded" />
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 px-6 py-6 space-y-6 overflow-hidden">
          {/* AI message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/[0.06] flex-shrink-0" />
            <div className="max-w-sm space-y-2">
              <div className="h-4 w-64 bg-white/[0.06] rounded" />
              <div className="h-4 w-52 bg-white/[0.04] rounded" />
              <div className="h-4 w-48 bg-white/[0.04] rounded" />
            </div>
          </div>
          {/* User message */}
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-white/[0.06] flex-shrink-0" />
            <div className="max-w-xs space-y-2">
              <div className="h-4 w-48 bg-white/[0.06] rounded" />
              <div className="h-4 w-36 bg-white/[0.04] rounded" />
            </div>
          </div>
          {/* AI message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/[0.06] flex-shrink-0" />
            <div className="max-w-md space-y-2">
              <div className="h-4 w-72 bg-white/[0.06] rounded" />
              <div className="h-4 w-60 bg-white/[0.04] rounded" />
              <div className="h-4 w-56 bg-white/[0.04] rounded" />
              <div className="h-4 w-40 bg-white/[0.04] rounded" />
            </div>
          </div>
        </div>
        {/* Input bar */}
        <div className="px-6 py-4 border-t border-white/[0.06]">
          <div className="h-14 w-full bg-white/[0.04] rounded-2xl border border-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}
