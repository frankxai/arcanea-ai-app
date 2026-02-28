"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePromptBooksStore } from "@/lib/prompt-books/store";
import { useQuickCapture } from "@/hooks/use-quick-capture";
import { createClient } from "@/lib/supabase/client";
import { PromptBooksSidebar } from "@/components/prompt-books/sidebar/PromptBooksSidebar";
import { CollectionHeader } from "@/components/prompt-books/collections/CollectionHeader";
import { CollectionGrid } from "@/components/prompt-books/collections/CollectionGrid";
import { CollectionDialog } from "@/components/prompt-books/collections/CollectionDialog";
import { QuickCaptureModal } from "@/components/prompt-books/quick-capture/QuickCaptureModal";
import { QuickCaptureFAB } from "@/components/prompt-books/quick-capture/QuickCaptureFAB";
import { PromptSearch } from "@/components/prompt-books/search/PromptSearch";
import { FilterBar } from "@/components/prompt-books/search/FilterBar";
import { TemplateGallery } from "@/components/prompt-books/templates/TemplateGallery";
import { TagManager } from "@/components/prompt-books/tags/TagManager";
import * as service from "@/lib/prompt-books/service";
import type {
  CreateCollectionInput,
  Prompt,
  UpdateTagInput,
} from "@/lib/prompt-books/types";

// ─── Inline SVG Icons ───────────────────────────────────────────────────────────
const Icons = {
  Grid: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  List: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  Plus: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Search: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Command: () => (
    <svg
      className="w-3 h-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  ),
  LayoutGrid: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Tag: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
};

// ─── Demo collections for unauthenticated preview ─────────────────────────────
const DEMO_COLLECTIONS = [
  { id: "d1", name: "Guardian Invocations", icon: "✦", color: "#7fffd4", promptCount: 12, description: "Prompts for each of the 10 Gates" },
  { id: "d2", name: "World Building",       icon: "◈", color: "#8b5cf6", promptCount: 8,  description: "Universe creation with Shinkami" },
  { id: "d3", name: "Creative Rituals",     icon: "◉", color: "#ffd700", promptCount: 17, description: "Daily practice prompts from the Library" },
  { id: "d4", name: "Vault Imports",        icon: "⬡", color: "#78a6ff", promptCount: 24, description: "Captured from ChatGPT & Claude sessions" },
];

function PromptBooksLanding() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-arcane-crystal/30 bg-arcane-crystal/10 mb-8">
          <span className="text-xs font-mono tracking-widest uppercase text-arcane-crystal">Prompt Books</span>
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-4">Your AI Prompt Library</h1>
        <p className="text-text-secondary font-body leading-relaxed mb-10 max-w-2xl mx-auto">
          Organize, search, and reuse your best AI prompts across every platform.
          Import from the Arcanea Vault Chrome extension or capture directly.
        </p>

        {/* Demo grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left">
          {DEMO_COLLECTIONS.map((c) => (
            <div key={c.id} className="liquid-glass rounded-2xl p-5 border border-white/[0.04] opacity-75 select-none">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${c.color}18`, border: `1px solid ${c.color}30` }}>
                  {c.icon}
                </div>
                <div>
                  <p className="font-display font-semibold text-text-primary text-sm">{c.name}</p>
                  <p className="text-xs text-text-secondary">{c.promptCount} prompts</p>
                </div>
              </div>
              <p className="text-xs text-text-secondary">{c.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/auth/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-arcane-crystal text-cosmic-deep font-semibold hover:scale-[1.03] transition-all">
            Sign In to Access Your Books
          </Link>
          <Link href="/arcanea-vault"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-arcane-crystal/30 transition-all text-sm">
            Get Arcanea Vault →
          </Link>
        </div>
        <p className="text-xs text-text-secondary mt-6">
          Vault = Chrome extension that exports ChatGPT/Claude/Gemini conversations directly into your Prompt Books
        </p>
      </div>
    </div>
  );
}

export default function PromptBooksPage() {
  const {
    collections,
    prompts,
    tags,
    activeCollectionId,
    viewMode,
    setViewMode,
    createCollection,
    createPrompt,
    updatePrompt,
    updateTag,
    deleteTag,
    addPrompt,
    initialize,
    _userId: userId,
  } = usePromptBooksStore();

  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  // Initialize store with authenticated user's Supabase client
  useEffect(() => {
    const initAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await initialize(supabase, user.id);
        }
      } catch {
        // Supabase not configured or offline — show landing
      } finally {
        setAuthChecked(true);
      }
    };
    initAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    open: captureOpen,
    setOpen: setCaptureOpen,
    capture,
  } = useQuickCapture();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);

  const activeCollection = activeCollectionId
    ? collections.find((c) => c.id === activeCollectionId) || null
    : null;

  // ── Cmd+K / Ctrl+K keyboard shortcut ────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCreateCollection = useCallback(
    async (data: CreateCollectionInput) => {
      await createCollection(data);
    },
    [createCollection],
  );

  const handlePromptSelect = useCallback(
    (id: string) => {
      const collId = activeCollectionId || "_all";
      router.push(`/prompt-books/${collId}/${id}`);
    },
    [router, activeCollectionId],
  );

  const handleFavorite = useCallback(
    async (id: string) => {
      const prompt = prompts.find((p) => p.id === id);
      if (prompt) {
        await updatePrompt(id, { isFavorite: !prompt.isFavorite });
      }
    },
    [prompts, updatePrompt],
  );

  const handleCopy = useCallback(async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
    } catch {
      // Clipboard API not available
    }
  }, []);

  const handleInstantiateTemplate = useCallback(
    async (
      templateId: string,
      variables: Record<string, string>,
      collectionId?: string,
    ) => {
      if (!userId) return;
      const client = createClient();
      const prompt = await service.instantiateTemplate(
        client,
        userId,
        templateId,
        variables,
        collectionId || activeCollectionId || undefined,
      );
      addPrompt(prompt);
      router.push(
        `/prompt-books/${prompt.collectionId || "_all"}/${prompt.id}`,
      );
    },
    [userId, activeCollectionId, addPrompt, router],
  );

  const handleUpdateTag = useCallback(
    async (id: string, input: UpdateTagInput) => {
      await updateTag(id, input);
    },
    [updateTag],
  );

  const handleDeleteTag = useCallback(
    async (id: string) => {
      await deleteTag(id);
    },
    [deleteTag],
  );

  // Show nothing while auth is being determined
  if (!authChecked) return null;

  // Show landing page for unauthenticated users
  if (!userId) {
    return (
      <div className="flex h-[calc(100dvh-64px)] pt-16">
        <PromptBooksLanding />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-64px)] pt-16">
      {/* Sidebar */}
      <PromptBooksSidebar onCreateCollection={() => setDialogOpen(true)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Collection Header */}
        <CollectionHeader
          collection={activeCollection}
          onEdit={activeCollection ? () => setDialogOpen(true) : undefined}
        />

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-text-muted hover:text-text-primary"
              aria-label="Search prompts (Cmd+K)"
              onClick={() => setSearchOpen(true)}
            >
              <Icons.Search />
            </Button>

            {/* Cmd+K hint */}
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(
                "liquid-glass px-2 py-1 rounded-md",
                "flex items-center gap-1",
                "text-[10px] font-mono text-text-muted/50",
                "hover:text-text-muted hover:bg-white/[0.04] transition-all duration-150",
              )}
            >
              <Icons.Command />
              <span>K</span>
            </button>

            <Button
              variant="ghost"
              size="icon"
              className="text-text-muted hover:text-text-primary"
              aria-label="Template Gallery"
              onClick={() => setTemplateGalleryOpen(true)}
            >
              <Icons.LayoutGrid />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-text-muted hover:text-text-primary"
              aria-label="Manage Tags"
              onClick={() => setTagManagerOpen(true)}
            >
              <Icons.Tag />
            </Button>

            <span className="text-xs font-sans text-text-muted">
              {prompts.length} prompt{prompts.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="liquid-glass rounded-lg p-0.5 flex">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "grid"
                    ? "card-3d liquid-glass text-text-primary"
                    : "text-text-muted hover:text-text-secondary",
                )}
                aria-label="Grid view"
              >
                <Icons.Grid />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "list"
                    ? "card-3d liquid-glass text-text-primary"
                    : "text-text-muted hover:text-text-secondary",
                )}
                aria-label="List view"
              >
                <Icons.List />
              </button>
            </div>

            {/* New Prompt */}
            <Button
              onClick={() => setCaptureOpen(true)}
              className="card-3d liquid-glass hover:scale-[1.02] transition-transform gap-2"
            >
              <Icons.Plus />
              <span className="font-sans font-medium text-sm">New Prompt</span>
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Prompts Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <CollectionGrid
            prompts={prompts}
            viewMode={viewMode}
            onSelect={handlePromptSelect}
            onFavorite={handleFavorite}
            onCopy={handleCopy}
          />
        </div>
      </div>

      {/* FAB */}
      <QuickCaptureFAB onClick={() => setCaptureOpen(true)} />

      {/* Command Palette Search Overlay */}
      <PromptSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectPrompt={handlePromptSelect}
      />

      {/* Dialogs */}
      <CollectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        collection={editingCollection}
        onSave={handleCreateCollection}
      />

      <QuickCaptureModal
        open={captureOpen}
        onOpenChange={setCaptureOpen}
        onCapture={capture}
        collections={collections.map((c) => ({ id: c.id, name: c.name }))}
      />

      {/* Template Gallery */}
      <TemplateGallery
        open={templateGalleryOpen}
        onClose={() => setTemplateGalleryOpen(false)}
        collections={collections.map((c) => ({ id: c.id, name: c.name }))}
        onInstantiate={handleInstantiateTemplate}
      />

      {/* Tag Manager */}
      <TagManager
        tags={tags}
        onUpdate={handleUpdateTag}
        onDelete={handleDeleteTag}
        open={tagManagerOpen}
        onClose={() => setTagManagerOpen(false)}
      />
    </div>
  );
}
