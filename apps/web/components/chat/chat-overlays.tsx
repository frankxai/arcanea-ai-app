"use client";

import dynamic from "next/dynamic";
import type { Dispatch, SetStateAction } from "react";
import { AgentPicker } from "@/components/chat/agent-picker";
import type { Artifact } from "@/components/chat/artifacts-panel";
import type { useConversation } from "@/hooks/use-conversation";
import { getLuminor } from "@/lib/luminors/config";

const CommandPalette = dynamic(
  () =>
    import("@/components/chat/command-palette").then((m) => m.CommandPalette),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
    ),
  },
);
const ExportDialog = dynamic(
  () => import("@/components/chat/export-dialog").then((m) => m.ExportDialog),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
    ),
  },
);
const ArtifactsPanel = dynamic(
  () =>
    import("@/components/chat/artifacts-panel").then((m) => m.ArtifactsPanel),
  {
    ssr: false,
    loading: () => (
      <div className="fixed right-0 top-0 h-full w-80 bg-[var(--arc-cosmic-void)] border-l border-white/[0.06] animate-pulse" />
    ),
  },
);
const BeamMode = dynamic(
  () => import("@/components/chat/beam-mode").then((m) => m.BeamMode),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <span className="text-white/40 text-sm">Loading Beam Mode...</span>
      </div>
    ),
  },
);
type ActiveAgent = { type: "auto" | "luminor"; id: string } | null;
type ChatOverlaysProps = {
  conversation: ReturnType<typeof useConversation>;
  showAgentPicker: boolean;
  setShowAgentPicker: Dispatch<SetStateAction<boolean>>;
  activeAgent: ActiveAgent;
  setActiveAgent: Dispatch<SetStateAction<ActiveAgent>>;
  activeArtifact: Artifact | null;
  setActiveArtifact: Dispatch<SetStateAction<Artifact | null>>;
  showExport: boolean;
  setShowExport: Dispatch<SetStateAction<boolean>>;
  handleNewChat: () => void;
};

export function ChatOverlays({
  conversation,
  showAgentPicker,
  setShowAgentPicker,
  activeAgent,
  setActiveAgent,
  activeArtifact,
  setActiveArtifact,
  showExport,
  setShowExport,
  handleNewChat,
}: ChatOverlaysProps) {
  return (
    <>
      <AgentPicker
        open={showAgentPicker}
        onClose={() => setShowAgentPicker(false)}
        onSelect={(agent) => {
          setActiveAgent(agent);
          if (agent.type === "luminor") {
            const luminor = getLuminor(agent.id);
            if (luminor) conversation.handleSelectLuminor(luminor);
          } else {
            conversation.clearActiveLuminor();
          }
        }}
        currentAgentId={activeAgent?.id ?? conversation.activeLuminor?.id}
      />

      {activeArtifact && (
        <ArtifactsPanel
          artifact={activeArtifact}
          onClose={() => setActiveArtifact(null)}
        />
      )}

      {conversation.commandPaletteOpen && (
        <CommandPalette
          open={conversation.commandPaletteOpen}
          onClose={() => conversation.setCommandPaletteOpen(false)}
          onSelectModel={(id) => {
            conversation.setModelId(id);
            conversation.setCommandPaletteOpen(false);
          }}
          onSelectFocus={(id) => {
            conversation.setFocusMode(id);
            conversation.setCommandPaletteOpen(false);
          }}
          onNewChat={() => {
            handleNewChat();
            conversation.setCommandPaletteOpen(false);
          }}
          onBeamMode={() => {
            conversation.setBeamPrompt(
              conversation.input.trim() || "Compare models",
            );
            conversation.setCommandPaletteOpen(false);
          }}
        />
      )}

      {conversation.beamPrompt && (
        <BeamMode
          prompt={conversation.beamPrompt}
          provider={conversation.provider}
          clientApiKey={conversation.clientApiKey}
          focusHint={conversation.focusHint}
          onSelectResponse={() => {
            conversation.sendMessage({ text: conversation.beamPrompt! });
            conversation.setBeamPrompt(null);
          }}
          onClose={() => conversation.setBeamPrompt(null)}
        />
      )}

      {showExport && (
        <ExportDialog
          messages={conversation.messages}
          luminorName={conversation.activeLuminor?.name}
          modelLabel={conversation.providerLabel}
          onClose={() => setShowExport(false)}
        />
      )}
    </>
  );
}
