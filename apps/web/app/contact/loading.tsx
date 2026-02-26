export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-12 w-48 bg-white/5 rounded-xl mb-4" />
      <div className="h-4 w-72 bg-white/5 rounded mb-12" />
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="h-12 bg-white/5 rounded-xl" />
          <div className="h-12 bg-white/5 rounded-xl" />
        </div>
        <div className="h-12 bg-white/5 rounded-xl" />
        <div className="h-12 bg-white/5 rounded-xl" />
        <div className="h-36 bg-white/5 rounded-xl" />
        <div className="h-12 w-40 bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}
