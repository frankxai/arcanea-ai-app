import type { Metadata } from "next";
import { PlatformStudioShell, STUDIO_BY_ID } from "@/components/studio";
import { CanvasFlowLab } from "./canvas-flow-lab";
import { CanvasWorkspace } from "./canvas-workspace";

export const metadata: Metadata = {
  title: "Canvas - Arcanea",
  description:
    "A node workflow for chaining worlds, books, games, music, video, code, and agent handoffs.",
  alternates: { canonical: "/canvas" },
};

export default function CanvasPage() {
  return (
    <>
      <CanvasWorkspace />
      <PlatformStudioShell
        studio={STUDIO_BY_ID.canvas}
        title="One canvas for every creative workflow"
        subtitle="Drop a world, book, song, scene, or repo into a node graph. Chain agents, assets, prompts, models, and exports into repeatable studio workflows."
      />
      <CanvasFlowLab />
    </>
  );
}
