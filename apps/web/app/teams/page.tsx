import { Metadata } from "next";
import { TeamsContent } from "./teams-content";

export const metadata: Metadata = {
  title: "Teams — How we build Arcanea — Arcanea",
  description:
    "Seven teams. One protocol. Transparent ownership, public blog, open-source everything. See how Arcanea is built in the open.",
  openGraph: {
    title: "Teams — How we build Arcanea — Arcanea",
    description:
      "Seven teams. One protocol. Transparent ownership, public blog, open-source everything. See how Arcanea is built in the open.",
  },
  alternates: { canonical: "/teams" },
};

export default function TeamsPage() {
  return <TeamsContent />;
}
