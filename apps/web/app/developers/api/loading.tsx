export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "#00bcd4", borderTopColor: "transparent" }}
        />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
