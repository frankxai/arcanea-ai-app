import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Animated Loader */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 animate-ping bg-blue-500/20 rounded-full" />
          <Loader2 className="relative w-20 h-20 text-blue-400 animate-spin" />
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-semibold text-white mb-2 animate-pulse">
          Manifesting Reality
        </h2>

        <p className="text-slate-400 mb-8">
          Weaving the cosmic threads...
        </p>

        {/* Loading Bar */}
        <div className="max-w-xs mx-auto h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
