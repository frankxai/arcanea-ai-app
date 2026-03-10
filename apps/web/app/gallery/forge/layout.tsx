import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Forge — Vessel Gallery",
  description:
    "Cinematic vessel art across space, sea, sky, and void. Design your ship, share it with the community, and explore what others have built.",
  openGraph: {
    title: "The Forge — Vessel Gallery",
    description:
      "Cinematic vessel art across space, sea, sky, and void. Design your ship, share it with the community.",
  },
};

export default function ForgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
