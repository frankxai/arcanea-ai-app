import type { Metadata } from "next";
import { MythWorkbench } from "./workbench";

export const metadata: Metadata = {
  title: "Myth Studio — Arcanea",
  description:
    "Select source references, shape an original story brief and export a costed research packet.",
  robots: { index: false, follow: false },
};

export default function MythStudioPage() {
  return <MythWorkbench />;
}
