import type { Metadata } from "next";
import { PlatformStudioShell, STUDIO_BY_ID } from "@/components/studio";
import { McpCommandCenter } from "./mcp-command-center";

export const metadata: Metadata = {
  title: "MCP reader",
  description:
    "Connect Claude, Codex, or Cursor to the free Arcanea reader. Rubrics, canon lint, and a score that cannot grant ship. No install and no API key.",
  alternates: { canonical: "/mcp" },
};

export default function McpPage() {
  return (
    <>
      <PlatformStudioShell
        studio={STUDIO_BY_ID["agent-os"]}
        label="Free reader, live now"
        title="A reader your agent can call before it invents the world"
        subtitle="No install and no API key. The public door returns the rubrics, a deterministic lint, and a score that will not call a draft ship."
      />
      <McpCommandCenter />
    </>
  );
}
