import type { ReactNode } from "react";
import Link from "next/link";

export default function TemplatesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <aside
        aria-label="Creator starters"
        className="border-b border-white/10 bg-[#121819] px-6 py-5 text-white"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-white/80">
            <span className="font-medium text-white">Make your next page.</span>{" "}
            Nine editable music, research, and tool examples with working demos,
            source downloads, and v0 briefs.
          </p>
          <Link
            href="/creator-starters/index.html"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-white/25 px-5 text-sm font-medium transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Explore nine starters <span aria-hidden="true">&nbsp;↗</span>
          </Link>
        </div>
      </aside>
      {children}
    </>
  );
}
