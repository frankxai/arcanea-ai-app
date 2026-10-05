/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePromptBooksStore } from "@/lib/prompt-books/store";
import { useQuickCapture } from "@/hooks/use-quick-capture";
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
  PhCommand,
  PhGridFour,
  PhList,
  PhMagnifyingGlass,
  PhPlus,
  PhSquaresFour,
  PhTag,
} from "@/lib/phosphor-icons";
import type {
  CreateCollectionInput,
  Prompt,
  UpdateTagInput,
} from "@/lib/prompt-books/types";

// Demo collections for unauthenticated preview
import { PromptBooksLanding } from "@/components/prompt-books/PromptBooksLanding";

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
    instantiateTemplate,
    promptLoadFailed,
    loadPrompts,
    _userId: userId,
  } = usePromptBooksStore();

  const router = useRouter();

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
      const before = usePromptBooksStore.getState();
      const prompt = await instantiateTemplate(
        templateId,
        variables,
        collectionId || activeCollectionId || undefined,
      );
      const current = usePromptBooksStore.getState();
      if (
        current._client !== before._client ||
        current._userId !== before._userId ||
        current._sessionVersion !== before._sessionVersion
      )
        throw new Error("Prompt Books identity changed");
      router.push(
        `/prompt-books/${prompt.collectionId || "_all"}/${prompt.id}`,
      );
    },
    [activeCollectionId, instantiateTemplate, router],
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

  // First HTML and signed-out users get the landing. Do not return null
  // while auth is pending, which hid "Your AI Prompt Library" from crawlers
  // and no-JS. Signed-in users swap to the library after initialize().
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
        {promptLoadFailed && (
          <div
            role="alert"
            className="border-b border-[var(--arc-cosmic-border)] px-4 py-3 text-sm text-text-primary"
          >
            Could not load prompts.{" "}
            <button
              type="button"
              className="min-h-11 rounded-lg border border-[var(--arc-cosmic-border)] px-3 py-2 focus-visible:ring-2 focus-visible:ring-atlantean-teal"
              onClick={() => {
                void loadPrompts().catch(() => {});
              }}
            >
              Retry loading
            </button>
          </div>
        )}
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
