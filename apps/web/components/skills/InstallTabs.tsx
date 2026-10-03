import Link from "next/link";
import type { Skill } from "@/lib/skills/loader";

export default function InstallTabs({ skill }: { skill: Skill }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-4">
      <p className="mb-3 text-sm leading-relaxed text-white/60">
        Read the source and installation guidance for this reviewed revision.
        Follow the skill’s own terms and preserve its notices when you reuse it.
      </p>
      <Link
        href={skill.installGuideUrl}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-[var(--arc-brand-atlantean-teal)] hover:underline"
      >
        Read installation guidance
      </Link>
    </div>
  );
}
