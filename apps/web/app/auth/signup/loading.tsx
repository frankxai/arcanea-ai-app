export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 animate-pulse">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mx-auto mb-6" />
          <div className="w-52 h-8 bg-white/8 rounded-xl mx-auto mb-2" />
          <div className="w-44 h-4 bg-white/5 rounded mx-auto" />
        </div>

        {/* Form card */}
        <div className="card-3d liquid-glass rounded-2xl border border-white/[0.06] p-8 space-y-5">
          {/* Name field */}
          <div>
            <div className="w-24 h-4 bg-white/5 rounded mb-2" />
            <div className="h-12 rounded-xl bg-white/5" />
          </div>

          {/* Email field */}
          <div>
            <div className="w-12 h-4 bg-white/5 rounded mb-2" />
            <div className="h-12 rounded-xl bg-white/5" />
          </div>

          {/* Password field */}
          <div>
            <div className="w-16 h-4 bg-white/5 rounded mb-2" />
            <div className="h-12 rounded-xl bg-white/5" />
          </div>

          {/* Terms text */}
          <div className="w-full h-3 bg-white/3 rounded" />

          {/* Submit button */}
          <div className="h-14 rounded-xl bg-white/8" />

          {/* Divider */}
          <div className="relative my-8">
            <div className="w-full border-t border-white/5" />
            <div className="absolute inset-0 flex justify-center -top-3">
              <div className="w-28 h-5 bg-cosmic-deep rounded" />
            </div>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 rounded-xl bg-white/5 border border-white/5" />
            <div className="h-12 rounded-xl bg-white/5 border border-white/5" />
          </div>
        </div>

        {/* Login link */}
        <div className="flex justify-center mt-6">
          <div className="w-44 h-4 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}
