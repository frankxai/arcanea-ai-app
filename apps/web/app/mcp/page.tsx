import type { Metadata } from "next";
import { PlatformStudioShell, STUDIO_BY_ID } from "@/components/studio";
import { McpCommandCenter } from "./mcp-command-center";

export const metadata: Metadata = {
  title: "MCP & CLI - Arcanea",
  description:
    "Connect Arcanea to Claude, Codex, Cursor, local MCP clients, and studio workflows.",
  alternates: { canonical: "/mcp" },
};

export default function McpPage() {
  return (
    <>
      <PlatformStudioShell
        studio={STUDIO_BY_ID["agent-os"]}
        label="Arcanea for any AI"
        title="Arcanea MCP for Claude, Codex, Cursor, and local agents"
        subtitle="Install the open-core MCP server, load world and studio context, run creative production recipes, and export handoffs that other agents can build from."
      />
      <McpCommandCenter />
    </>
  );
}
