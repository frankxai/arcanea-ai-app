export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-atlantean-teal-aqua border-t-transparent" />
        <p className="text-sm text-white/60 font-body">Preparing the Image Forge...</p>
      </div>
    </div>
  );
}
