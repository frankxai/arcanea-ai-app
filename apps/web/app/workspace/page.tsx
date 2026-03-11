"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { PhBookOpen, PhBrain, PhChatCircleText, PhDatabase, PhPaintBrush, PhSparkle } from '@/lib/phosphor-icons';

type WorkspaceTab = "ask" | "create" | "library" | "vault" | "agents";

const TABS: Array<{ id: WorkspaceTab; label: string }> = [
  { id: "ask", label: "Ask" },
  { id: "create", label: "Create" },
  { id: "library", label: "Library" },
  { id: "vault", label: "Vault" },
  { id: "agents", label: "Agents" },
];

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-brand-primary text-white shadow-glow-brand"
          : "bg-cosmic-surface/60 text-text-secondary hover:bg-cosmic-surface hover:text-text-primary"
      }`}
    >
      {label}
    </button>
  );
}

function Card({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/[0.06] bg-cosmic-surface/40 p-5 transition hover:border-brand-primary/40 hover:bg-cosmic-surface/70"
    >
      <div className="mb-3 inline-flex rounded-lg bg-brand-primary/15 p-2 text-brand-primary">{icon}</div>
      <h3 className="font-display text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
    </Link>
  );
}

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("ask");

  return (
    <div className="-mx-4 min-h-[calc(100dvh-2rem)] px-4 pb-10">
      <div className="mb-6 rounded-2xl border border-white/[0.06] bg-cosmic-deep/80 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-brand-primary/15 p-2 text-brand-primary">
            <PhSparkle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-text-primary">Arcanea Workspace</h1>
            <p className="text-sm text-text-secondary">
              One surface for sessions, creation, memory, and agent orchestration.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              label={tab.label}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>

      {activeTab === "ask" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            href="/chat"
            title="Open Chat Surface"
            description="Start with an intelligence and continue persistent sessions."
            icon={<PhChatCircleText className="h-5 w-5" />}
          />
          <Card
            href="/chat"
            title="Choose Companion"
            description="Select from 16 companions by team and specialty."
            icon={<PhBrain className="h-5 w-5" />}
          />
        </div>
      )}

      {activeTab === "create" && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            href="/studio/image"
            title="Image Forge"
            description="Generate and iterate visual assets."
            icon={<PhPaintBrush className="h-5 w-5" />}
          />
          <Card
            href="/studio"
            title="Creation Studio"
            description="Access multimodal creation tools."
            icon={<PhSparkle className="h-5 w-5" />}
          />
          <Card
            href="/records"
            title="Creations Record"
            description="Track generated and published work."
            icon={<PhDatabase className="h-5 w-5" />}
          />
        </div>
      )}

      {activeTab === "library" && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card href="/library" title="Library" description="Browse Arcanea collections and texts." icon={<PhBookOpen className="h-5 w-5" />} />
          <Card href="/library/graph" title="Lore Graph" description="Explore connected lore and references." icon={<PhBrain className="h-5 w-5" />} />
          <Card href="/prompt-books" title="Prompt Books" description="Capture and evolve reusable prompt assets." icon={<PhSparkle className="h-5 w-5" />} />
        </div>
      )}

      {activeTab === "vault" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card href="/arcanea-vault" title="Vault Surface" description="Secure asset and memory management." icon={<PhDatabase className="h-5 w-5" />} />
          <Card href="/profile/edit" title="Profile & Ownership" description="Manage creator identity and settings." icon={<PhBrain className="h-5 w-5" />} />
        </div>
      )}

      {activeTab === "agents" && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card href="/chat/logicus" title="Development Agents" description="Architecture, code quality, debugging, and integration." icon={<PhBrain className="h-5 w-5" />} />
          <Card href="/chat/prismatic" title="Creative Agents" description="Visual, music, motion, and form creation." icon={<PhPaintBrush className="h-5 w-5" />} />
          <Card href="/chat/oracle" title="Research Agents" description="Synthesis, analysis, memory, and forecasting." icon={<PhBookOpen className="h-5 w-5" />} />
        </div>
      )}
    </div>
  );
}
