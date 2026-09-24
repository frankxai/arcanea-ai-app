import type { Metadata } from "next";
import { ChapterZeroReader } from "./reader";

export const metadata: Metadata = {
  title: "Chapter Zero: The Sea Rose — Arcanea: Meridian",
  description:
    "The day the sea climbed into the sky, Elyon Vale was stealing his mother's name back from a government archive.",
  openGraph: {
    title: "The Sea Rose — Arcanea: Meridian",
    description: "Read Chapter Zero of The Concordant Cycle.",
    images: ["/images/sagas/meridian/meridian-chapter-zero-panels.webp"],
  },
};

type ChapterZeroPageProps = {
  searchParams: Promise<{ entry?: string | string[] }>;
};

export default async function ChapterZeroPage({ searchParams }: ChapterZeroPageProps) {
  const params = await searchParams;
  const requested = Array.isArray(params.entry) ? params.entry[0] : params.entry;
  const variant = requested === "story" ? "story" : "world";

  return <ChapterZeroReader variant={variant} />;
}
