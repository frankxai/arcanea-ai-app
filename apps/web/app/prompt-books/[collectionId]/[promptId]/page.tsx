/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePromptBooksStore } from "@/lib/prompt-books/store";
import type { SavePromptTemplateInput } from "@/lib/prompt-books/store-state";
import { usePromptEditor } from "@/hooks/use-prompt-editor";
import { EditorToolbar } from "@/components/prompt-books/editor/EditorToolbar";
import { PromptTypeTabs } from "@/components/prompt-books/editor/PromptTypeTabs";
import { ContentEditor } from "@/components/prompt-books/editor/ContentEditor";
import { SystemPromptEditor } from "@/components/prompt-books/editor/SystemPromptEditor";
import { NegativePromptEditor } from "@/components/prompt-books/editor/NegativePromptEditor";
import { MarkdownPreview } from "@/components/prompt-books/editor/MarkdownPreview";
import { WeightModifier } from "@/components/prompt-books/editor/WeightModifier";
import { VersionHistoryDrawer } from "@/components/prompt-books/editor/VersionHistoryDrawer";
import { TagChipBar } from "@/components/prompt-books/tags/TagChipBar";
import { TagSelector } from "@/components/prompt-books/tags/TagSelector";
import { ContextPanel } from "@/components/prompt-books/context/ContextPanel";
import { SaveAsTemplateDialog } from "@/components/prompt-books/templates/SaveAsTemplateDialog";
import { promptToMd } from "@/lib/prompt-books/markdown";
import { applyWeight } from "@/lib/prompt-books/weight-syntax";
import type { WeightSyntaxType } from "@/lib/prompt-books/constants";
import type {
  TagCategory,
  ContextConfig,
  FewShotExample,
  ChainStep,
} from "@/lib/prompt-books/types";
import { cn } from "@/lib/utils";

export default function PromptEditorPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.collectionId as string;
  const promptId = params.promptId as string;

  const {
    setActiveCollection,
    setActivePrompt,
    editorSplitView,
    toggleSplitView,
    updatePrompt,
    changePromptTag,
    savePromptAsTemplate,
    promptLoadFailed,
    loadPrompts,
    tags,
    createTag,
    prompts,
    _userId: userId,
    _sessionVersion: sessionVersion,
  } = usePromptBooksStore();

  const {
    prompt,
    state,
    isDirty,
    isSaving,
    lastSavedAt,
    saveError,
    wordCount,
    charCount,
    typeConfig,
    updateField,
    save,
    getConfirmedState,
    handleDelete,
    handleDuplicate,
    handleCopy,
  } = usePromptEditor(promptId);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Tag IDs assigned to this prompt
  const assignedTagIds = (prompt?.tags ?? []).map((t) => t.id);

  // Set active collection and prompt on mount
  useEffect(() => {
    if (!userId) return;
    if (collectionId) setActiveCollection(collectionId);
    if (promptId) setActivePrompt(promptId);
    return () => setActivePrompt(null);
  }, [
    collectionId,
    promptId,
    userId,
    sessionVersion,
    setActiveCollection,
    setActivePrompt,
  ]);

  const handleBack = useCallback(async () => {
    if (await save()) router.push(`/prompt-books/${collectionId}`);
  }, [router, collectionId, save]);

  const handleDeleteAndBack = useCallback(async () => {
    if (await handleDelete()) router.push(`/prompt-books/${collectionId}`);
  }, [handleDelete, router, collectionId]);

  const handleExport = useCallback(() => {
    if (!prompt) return;
    const md = promptToMd({ ...prompt, ...state });
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [prompt, state]);

  const handleToggleFavorite = useCallback(async () => {
    if (!prompt) return;
    await updatePrompt(prompt.id, { isFavorite: !prompt.isFavorite });
  }, [prompt, updatePrompt]);

  const handleWeightApply = useCallback(
    (weight: number, syntax: WeightSyntaxType) => {
      // Get the selection from the focused textarea
      const activeEl = document.activeElement as HTMLTextAreaElement;
      if (!activeEl || activeEl.tagName !== "TEXTAREA") return;

      const start = activeEl.selectionStart;
      const end = activeEl.selectionEnd;
      if (start === end) return;

      const newContent = applyWeight(state.content, start, end, weight, syntax);
      updateField("content", newContent);
    },
    [state.content, updateField],
  );

  const handleTagChange = useCallback(
    async (tagId: string, assigned: boolean) => {
      const before = usePromptBooksStore.getState();
      try {
        await changePromptTag(promptId, tagId, assigned);
        if (
          usePromptBooksStore.getState()._sessionVersion ===
          before._sessionVersion
        )
          setTagError(null);
      } catch {
        if (
          usePromptBooksStore.getState()._sessionVersion ===
          before._sessionVersion
        )
          setTagError("Could not update tags. Reopen tags to retry.");
      }
    },
    [promptId, changePromptTag],
  );
  const handleTagAssign = useCallback(
    (tagId: string) => handleTagChange(tagId, true),
    [handleTagChange],
  );
  const handleTagUnassign = useCallback(
    (tagId: string) => handleTagChange(tagId, false),
    [handleTagChange],
  );

  const handleCreateTag = useCallback(
    async (name: string, category: TagCategory) => {
      return await createTag({ name, category, isGlobal: false, collectionId });
    },
    [createTag, collectionId],
  );

  const handleRestore = useCallback(
    async (version: {
      content: string;
      negativeContent: string | null;
      systemPrompt: string | null;
    }) => {
      updateField("content", version.content);
      if (version.negativeContent !== null)
        updateField("negativeContent", version.negativeContent);
      if (version.systemPrompt !== null)
        updateField("systemPrompt", version.systemPrompt);
      setHistoryOpen(false);
    },
    [updateField],
  );

  // Context, examples and chain steps share the same draft/save barrier as text.
  const handleContextConfigChange = useCallback(
    (config: ContextConfig) => updateField("contextConfig", config),
    [updateField],
  );
  const handleFewShotChange = useCallback(
    (examples: FewShotExample[]) => updateField("fewShotExamples", examples),
    [updateField],
  );
  const handleChainStepsChange = useCallback(
    (steps: ChainStep[]) => updateField("chainSteps", steps),
    [updateField],
  );

  const handleSaveAsTemplate = useCallback(
    async (data: SavePromptTemplateInput) => {
      const before = usePromptBooksStore.getState();
      if (!(await save())) throw new Error("Could not save the latest prompt");
      const current = usePromptBooksStore.getState();
      if (
        current._client !== before._client ||
        current._userId !== before._userId ||
        current._sessionVersion !== before._sessionVersion
      )
        throw new Error("Prompt Books identity changed");
      await savePromptAsTemplate(promptId, data, getConfirmedState());
    },
    [save, savePromptAsTemplate, promptId, getConfirmedState],
  );

  // Cmd+S to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  if (!prompt) {
    return (
      <div className="flex-1 flex items-center justify-center">
        {promptLoadFailed && !saveError ? (
          <div role="alert" className="text-sm text-text-primary">
            <p>Could not load this prompt. Retry loading.</p>
            <button
              type="button"
              className="mt-2 min-h-11 rounded-lg border border-[var(--arc-cosmic-border)] px-3 py-2 focus-visible:ring-2 focus-visible:ring-atlantean-teal"
              onClick={() => {
                void loadPrompts(
                  collectionId === "_all" ? undefined : { collectionId },
                ).catch(() => {});
              }}
            >
              Retry loading
            </button>
          </div>
        ) : (
          <span className="text-text-muted text-sm font-sans">
            {saveError || "Loading prompt..."}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Editor Toolbar */}
      <EditorToolbar
        title={state.title}
        onTitleChange={(t) => updateField("title", t)}
        isDirty={isDirty}
        isSaving={isSaving}
        lastSavedAt={lastSavedAt}
        wordCount={wordCount}
        charCount={charCount}
        isFavorite={prompt.isFavorite}
        splitView={editorSplitView}
        onSave={save}
        onCopy={handleCopy}
        onDelete={handleDeleteAndBack}
        onBack={handleBack}
        onToggleSplit={toggleSplitView}
        onToggleFavorite={handleToggleFavorite}
        onShowHistory={() => setHistoryOpen(true)}
        onExport={handleExport}
        onSaveAsTemplate={() => setSaveTemplateOpen(true)}
      />

      {tagError && (
        <div
          role="alert"
          className="border-b border-[var(--arc-cosmic-border)] px-4 py-3 text-sm text-text-primary"
        >
          {tagError}
        </div>
      )}
      {saveError && (
        <div
          role="alert"
          className="border-b border-[var(--arc-cosmic-border)] px-4 py-3 text-sm text-text-primary"
        >
          <p>{saveError}</p>
          <button
            type="button"
            onClick={() => void save()}
            disabled={isSaving}
            className="mt-2 min-h-11 rounded-lg border border-[var(--arc-cosmic-border)] px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-atlantean-teal"
          >
            Retry save
          </button>
        </div>
      )}

      {/* Prompt Type Tabs */}
      <div className="border-b border-white/[0.04] px-4">
        <PromptTypeTabs
          value={state.promptType}
          onChange={(type) => updateField("promptType", type)}
        />
      </div>

      {/* Tags */}
      <div className="border-b border-white/[0.04] px-4 py-2 relative">
        <TagChipBar
          tags={prompt.tags ?? []}
          selectedIds={assignedTagIds}
          onToggle={(id) =>
            assignedTagIds.includes(id)
              ? handleTagUnassign(id)
              : handleTagAssign(id)
          }
          onRemove={handleTagUnassign}
          onAddClick={() => setTagSelectorOpen(!tagSelectorOpen)}
        />
        {tagSelectorOpen && (
          <div className="absolute top-full left-4 mt-1 z-40">
            <TagSelector
              tags={tags}
              assignedTagIds={assignedTagIds}
              onAssign={handleTagAssign}
              onUnassign={handleTagUnassign}
              onCreateTag={handleCreateTag}
              open={tagSelectorOpen}
              onClose={() => setTagSelectorOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Weight modifier bar (show for image types) */}
      {typeConfig.hasNegativePrompt && (
        <div className="border-b border-white/[0.04] px-4 py-2">
          <WeightModifier onApply={handleWeightApply} />
        </div>
      )}

      {/* Editor + Preview + Context */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor + Preview */}
        <div
          className={cn(
            "flex-1 flex overflow-hidden",
            editorSplitView && "divide-x divide-white/[0.04]",
          )}
        >
          {/* Editor pane */}
          <div
            className={cn(
              "flex-1 overflow-y-auto",
              editorSplitView ? "w-1/2" : "w-full",
            )}
          >
            <div className="px-6 py-4 space-y-0">
              {/* Main content editor */}
              <ContentEditor
                value={state.content}
                onChange={(v) => updateField("content", v)}
                placeholder={
                  typeConfig.hasNegativePrompt
                    ? "masterpiece, best quality, 1girl..."
                    : "Write your prompt here..."
                }
                label="Content"
                showToolbar={!typeConfig.hasNegativePrompt}
              />

              {/* Negative prompt (image types) */}
              {typeConfig.hasNegativePrompt && (
                <NegativePromptEditor
                  value={state.negativeContent}
                  onChange={(v) => updateField("negativeContent", v)}
                />
              )}

              {/* System prompt (chat/code/writing types) */}
              {typeConfig.hasSystemPrompt && (
                <SystemPromptEditor
                  value={state.systemPrompt}
                  onChange={(v) => updateField("systemPrompt", v)}
                />
              )}
            </div>
          </div>

          {/* Preview pane (split view) */}
          {editorSplitView && (
            <div className="w-1/2 overflow-y-auto px-6 py-4 bg-white/[0.01]">
              <div className="text-[10px] font-sans text-text-muted uppercase tracking-wider mb-3">
                Preview
              </div>
              <MarkdownPreview content={state.content} />
            </div>
          )}
        </div>

        {/* Context Engineering Panel */}
        <ContextPanel
          prompt={prompt}
          typeConfig={typeConfig}
          contextConfig={state.contextConfig}
          fewShotExamples={state.fewShotExamples}
          chainSteps={state.chainSteps}
          availablePrompts={prompts}
          onContextConfigChange={handleContextConfigChange}
          onFewShotChange={handleFewShotChange}
          onChainStepsChange={handleChainStepsChange}
        />
      </div>

      {/* Version History Drawer */}
      <VersionHistoryDrawer
        promptId={promptId}
        currentContent={state.content}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onRestore={handleRestore}
      />

      {/* Save as Template Dialog */}
      {saveTemplateOpen && (
        <SaveAsTemplateDialog
          prompt={{ ...prompt, ...state }}
          open={saveTemplateOpen}
          onClose={() => setSaveTemplateOpen(false)}
          onSave={handleSaveAsTemplate}
        />
      )}
    </div>
  );
}
