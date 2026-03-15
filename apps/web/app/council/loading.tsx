export default function CouncilLoading() {
  return (
    <div className="min-h-screen bg-[hsl(240,6%,4%)] flex flex-col items-center justify-center p-8">
      <div className="animate-pulse space-y-10 w-full max-w-4xl">
        {/* Title skeleton */}
        <div className="space-y-3 flex flex-col items-center">
          <div className="h-8 w-52 bg-white/[0.06] rounded-lg" />
          <div className="h-4 w-80 bg-white/[0.04] rounded" />
        </div>

        {/* Council grid skeleton - 9 advisors */}
        <div className="relative w-80 h-80 mx-auto">
          {/* Center glow */}
          <div className="absolute inset-[35%] rounded-full bg-[#00bcd4]/[0.04]" />

          {Array.from({ length: 9 }).map((_, i) => {
            const angle = (i * 40 - 90) * (Math.PI / 180);
            const x = 50 + 40 * Math.cos(angle);
            const y = 50 + 40 * Math.sin(angle);
            return (
              <div
                key={i}
                className="absolute w-11 h-11 rounded-full bg-white/[0.06] border border-white/[0.04]"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${i * 120}ms`,
                }}
              />
            );
          })}
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-white/[0.04] rounded-xl border border-white/[0.04] flex flex-col items-center justify-center gap-2"
            >
              <div className="h-5 w-10 bg-white/[0.06] rounded" />
              <div className="h-3 w-16 bg-white/[0.04] rounded" />
            </div>
          ))}
        </div>

        {/* Action skeleton */}
        <div className="flex justify-center">
          <div className="h-11 w-44 bg-white/[0.06] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
