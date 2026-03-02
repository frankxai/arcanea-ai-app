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
import {
  PhGridFour,
  PhList,
  PhPlus,
  PhMagnifyingGlass,
  PhCommand,
  PhTag,
  PhSquaresFour,
  PhBookOpen,
  PhArrowRight,
  PhSparkle,
  PhLightning,
  PhBooks,
} from "@/lib/phosphor-icons";
import { GlowCard } from "@/components/ui/glow-card";
import * as service from "@/lib/prompt-books/service";
import type {
  CreateCollectionInput,
  Prompt,
  UpdateTagInput,
} from "@/lib/prompt-books/types";

// ─── Demo collections for unauthenticated preview ─────────────────────────────
const DEMO_COLLECTIONS = [
  {
    id: "d1",
    name: "Creative Writing",
    icon: PhSparkle,
    color: "#7fffd4",
    promptCount: 12,
    description: "Story prompts, character builders, and narrative frameworks",
  },
  {
    id: "d2",
    name: "World Building",
    icon: PhBooks,
    color: "#8b5cf6",
    promptCount: 8,
    description: "Universe creation, lore systems, and setting design",
  },
  {
    id: "d3",
    name: "Code & Technical",
    icon: PhLightning,
    color: "#ffd700",
    promptCount: 17,
    description: "Development prompts, debugging helpers, architecture guides",
  },
  {
    id: "d4",
    name: "Vault Imports",
    icon: PhBookOpen,
    color: "#78a6ff",
    promptCount: 24,
    description: "Captured from ChatGPT, Claude, and Gemini sessions",
  },
];

function PromptBooksLanding() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-atlantean-teal-aqua/20 bg-atlantean-teal-aqua/5 mb-8">
            <PhBookOpen className="w-3.5 h-3.5 text-atlantean-teal-aqua" weight="duotone" />
            <span className="text-xs font-mono tracking-widest uppercase text-atlantean-teal-aqua/80">
              Prompt Books
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-5 leading-tight">
            Your AI Prompt Library
          </h1>
          <p className="text-base sm:text-lg text-text-secondary font-body leading-relaxed max-w-xl mx-auto">
            Organize, search, and reuse your best AI prompts across every platform.
            Import from the Arcanea Vault extension or capture directly.
          </p>
        </div>

        {/* Demo grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-14">
          {DEMO_COLLECTIONS.map((c) => {
            const Icon = c.icon;
            return (
              <GlowCard
                key={c.id}
                glass="none"
                className="group rounded-2xl p-5 sm:p-6 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${c.color}12`,
                      border: `1px solid ${c.color}25`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: c.color }} weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-text-primary text-sm truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-text-muted">{c.promptCount} prompts</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{c.description}</p>
              </GlowCard>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/login?next=/prompt-books"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-aqua/80 text-cosmic-deep font-semibold text-sm hover:shadow-[0_0_30px_rgba(127,255,212,0.25)] hover:scale-[1.02] transition-all duration-300"
          >
            Sign In to Access
            <PhArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/signup?next=/prompt-books"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-text-primary font-semibold text-sm hover:border-atlantean-teal-aqua/30 hover:bg-white/[0.06] transition-all duration-300"
          >
            Create Free Account
          </Link>
        </div>

        <p className="text-center text-xs text-text-muted mt-8 max-w-md mx-auto leading-relaxed">
          Vault is a Chrome extension that exports ChatGPT, Claude, and Gemini
          conversations directly into your Prompt Books.
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
        const {
          data: { user },
        } = await supabase.auth.getUser();
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

  // Cmd+K / Ctrl+K keyboard shortcut
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
      <div className="flex min-h-[calc(100dvh-4rem)]">
        <PromptBooksLanding />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)]">
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
        <div className="px-6 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-text-muted hover:text-text-primary"
              aria-label="Search prompts (Cmd+K)"
              onClick={() => setSearchOpen(true)}
            >
              <PhMagnifyingGlass className="w-4 h-4" />
            </Button>

            {/* Cmd+K hint */}
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(
                "px-2 py-1 rounded-md border border-white/[0.06] bg-white/[0.02]",
                "flex items-center gap-1",
                "text-[10px] font-mono text-text-muted/60",
                "hover:text-text-muted hover:bg-white/[0.04] transition-all duration-150",
              )}
            >
              <PhCommand className="w-3 h-3" />
              <span>K</span>
            </button>

            <Button
              variant="ghost"
              size="icon"
              className="text-text-muted hover:text-text-primary"
              aria-label="Template Gallery"
              onClick={() => setTemplateGalleryOpen(true)}
            >
              <PhSquaresFour className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-text-muted hover:text-text-primary"
              aria-label="Manage Tags"
              onClick={() => setTagManagerOpen(true)}
            >
              <PhTag className="w-4 h-4" />
            </Button>

            <span className="text-xs font-sans text-text-muted ml-1">
              {prompts.length} prompt{prompts.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="rounded-lg p-0.5 flex border border-white/[0.06] bg-white/[0.02]">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "grid"
                    ? "bg-white/[0.08] text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-secondary",
                )}
                aria-label="Grid view"
              >
                <PhGridFour className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "list"
                    ? "bg-white/[0.08] text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-secondary",
                )}
                aria-label="List view"
              >
                <PhList className="w-4 h-4" />
              </button>
            </div>

            {/* New Prompt */}
            <Button
              onClick={() => setCaptureOpen(true)}
              className="bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/20 text-atlantean-teal-aqua hover:bg-atlantean-teal-aqua/20 hover:scale-[1.02] transition-all gap-2"
            >
              <PhPlus className="w-4 h-4" />
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
