export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-pulse">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 mx-auto mb-8" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 mb-6 mx-auto w-36 h-8" />
          <div className="w-56 h-9 bg-white/8 rounded-xl mx-auto mb-3" />
          <div className="w-48 h-4 bg-white/5 rounded mx-auto" />
        </div>

        {/* Form card */}
        <div className="liquid-glass rounded-3xl border border-white/[0.04] p-8 sm:p-10 space-y-6">
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

          {/* Forgot password link */}
          <div className="flex justify-end -mt-2">
            <div className="w-28 h-4 bg-white/5 rounded" />
          </div>

          {/* Submit button */}
          <div className="h-14 rounded-xl bg-white/8" />

          {/* Divider */}
          <div className="relative my-8">
            <div className="w-full border-t border-white/5" />
            <div className="absolute inset-0 flex justify-center -top-3">
              <div className="w-32 h-5 bg-cosmic-deep rounded" />
            </div>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 rounded-xl bg-white/5 border border-white/5" />
            <div className="h-12 rounded-xl bg-white/5 border border-white/5" />
          </div>
        </div>

        {/* Sign up link */}
        <div className="flex justify-center mt-8">
          <div className="w-48 h-4 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}
