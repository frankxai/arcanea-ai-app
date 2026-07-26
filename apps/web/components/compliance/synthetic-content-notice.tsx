/**
 * EU AI Act Article 50 disclosure for AI-generated ("synthetic") content.
 *
 * Article 50 requires that content generated or manipulated by an AI system is
 * disclosed as such to the people who encounter it. A description in page metadata
 * does not satisfy this: it is consumed by search engines, not shown to the viewer.
 * This renders in the page body, near the content it describes.
 *
 * This covers the visible-disclosure limb only. The machine-readable marking limb
 * (embedding provenance in the media itself, e.g. C2PA) is a separate obligation
 * and is NOT addressed by this component.
 *
 * Obligations apply from 2026-08-02.
 */
export function SyntheticContentNotice({
  medium,
  className = '',
}: {
  /** What was generated, in plain words — e.g. "music", "images and text". */
  medium: string;
  className?: string;
}) {
  return (
    <p
      className={`text-xs text-white/40 leading-relaxed ${className}`}
      data-ai-generated="true"
    >
      <span className="font-medium text-white/55">AI-generated.</span>{' '}
      {`The ${medium} here is produced by artificial intelligence.`}
    </p>
  );
}
