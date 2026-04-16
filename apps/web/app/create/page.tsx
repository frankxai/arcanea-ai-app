import type { Metadata } from "next";
import { CreateHub } from "./create-hub";

export const metadata: Metadata = {
  title: "Create — Start building — Arcanea",
  description:
    "Start from a template or build from scratch. Worlds, characters, stories, agents, music, images — all in one place.",
  openGraph: {
    title: "Create — Start building — Arcanea",
    description:
      "Start from a template or build from scratch. Worlds, characters, stories, agents, music, images — all in one place.",
  },
  alternates: { canonical: "/create" },
};

export default function CreatePage() {
  return <CreateHub />;
}
