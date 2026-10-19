import type { Metadata } from "next";
import { PlatformStudioShell, STUDIO_BY_ID } from "@/components/studio";
import { McpCommandCenter } from "./mcp-command-center";

export const metadata: Metadata = {
  title: "MCP reader",
  description:
    "Connect Claude, Codex, or Cursor to the free Arcanea reader. Public rubric prompts, limited deterministic canon checks and client-specific setup. No local server package or provider key.",
  alternates: { canonical: "/mcp" },
};

export default function McpPage() {
  return (
    <>
      <PlatformStudioShell
        studio={STUDIO_BY_ID["agent-os"]}
        label="Remote Arcanea reader"
        title="A reader your agent can call before it invents the world"
        subtitle="Connect your agent to public rubric prompts and limited deterministic draft checks. Review canon in the public app repository. Studio availability has a separate waitlist."
      />
      <McpCommandCenter />
    </>
  );
}
