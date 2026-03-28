'use client';

export function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-[720px] mx-auto w-full px-4 py-8 animate-empty-fade-in">
      {/* Simulates 3 message pairs */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-4" style={{ animationDelay: `${i * 100}ms` }}>
          {/* User message skeleton */}
          <div className="flex justify-end">
            <div className="w-[60%] h-12 rounded-2xl rounded-br-sm bg-white/[0.03] animate-pulse" />
          </div>
          {/* Assistant message skeleton */}
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-white/[0.04] animate-pulse shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="w-[80%] h-4 rounded bg-white/[0.03] animate-pulse" />
              <div className="w-[65%] h-4 rounded bg-white/[0.03] animate-pulse" />
              <div className="w-[45%] h-4 rounded bg-white/[0.03] animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
