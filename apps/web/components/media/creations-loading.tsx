export function CreationsLoading() {
  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] p-[var(--arc-space-media-page-gutter)]">
      <div
        className="mx-auto h-[var(--arc-size-media-loading)] max-w-[var(--arc-size-media-page-max)] rounded-[var(--arc-radius-2xl)] bg-[var(--arc-cosmic-surface)]"
        role="status"
        aria-label="Loading creations"
      />
    </div>
  );
}
