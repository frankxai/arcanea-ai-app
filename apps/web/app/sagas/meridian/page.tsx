import type { Metadata } from "next";
import { MeridianExperience } from "./meridian-experience";
import type { EntryVariant } from "./meridian-data";

export const metadata: Metadata = {
  title: "Arcanea: Meridian — The Concordant Cycle",
  description:
    "Enter Meridian: Elyon Vale, five living relics, and an honorable enemy who can sever any bond he understands.",
  openGraph: {
    title: "Arcanea: Meridian",
    description: "The elements do not obey him. They remember through him.",
    images: ["/images/sagas/meridian/meridian-world-entry.webp"],
  },
};

type MeridianPageProps = {
  searchParams: Promise<{ entry?: string | string[] }>;
};

export default async function MeridianPage({ searchParams }: MeridianPageProps) {
  const params = await searchParams;
  const requested = Array.isArray(params.entry) ? params.entry[0] : params.entry;
  const variant: EntryVariant = requested === "story" ? "story" : "world";

  return <MeridianExperience variant={variant} />;
}
