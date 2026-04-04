import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a World | Arcanea",
  description:
    "Describe your world in one sentence and watch AI bring it to life with characters, locations, and lore.",
  openGraph: {
    title: "Create a World | Arcanea",
    description:
      "Describe your world in one sentence and watch AI bring it to life.",
  },
};

export default function CreateWorldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
