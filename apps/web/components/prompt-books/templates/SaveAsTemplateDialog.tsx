/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState, useMemo, useId } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PhX, PhFloppyDisk, PhGlobe, PhLock } from "@/lib/phosphor-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { templateVariablesForContent } from "@/lib/prompt-books/template-variables";
import type { Prompt, TemplateVariable } from "@/lib/prompt-books/types";

interface SaveAsTemplateDialogProps {
  prompt: Prompt;
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    requestId: string;
    name: string;
    description: string;
    category: string;
    variables: TemplateVariable[];
    isPublic: boolean;
  }) => Promise<void>;
}

const CATEGORIES = [
  "starter",
  "professional",
  "creative",
  "technical",
  "community",
];

export function SaveAsTemplateDialog({
  prompt,
  open,
  onClose,
  onSave,
}: SaveAsTemplateDialogProps) {
  const formId = useId();
  const [requestId] = useState(() => crypto.randomUUID());
  const [name, setName] = useState(prompt.title + " Template");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("starter");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [variables, setVariables] = useState<TemplateVariable[]>(() =>
    templateVariablesForContent(prompt.content, []),
  );
  const currentVariables = useMemo(
    () => templateVariablesForContent(prompt.content, variables),
    [prompt.content, variables],
  );

  const updateVariable = (
    index: number,
    field: keyof TemplateVariable,
    value: unknown,
  ) => {
    setVariables((prev) =>
      templateVariablesForContent(prompt.content, prev).map((v, i) =>
        i === index ? { ...v, [field]: value } : v,
      ),
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSave({
        requestId,
        name,
        description,
        category,
        variables: currentVariables,
        isPublic,
      });
      onClose();
    } catch {
      setError(
        "Could not save template. Your draft is still here. Retry saving.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && !loading) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 glass-strong rounded-2xl border border-white/[0.06] w-[480px] max-w-[calc(100vw-2rem)] max-h-[80vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between">
            <Dialog.Title className="text-sm font-display text-text-primary">
              Save as template
            </Dialog.Title>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={loading}
              aria-label="Close template dialog"
              className="min-h-11 min-w-11 text-text-muted hover:text-text-primary"
            >
              <PhX className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor={`${formId}-name`}
                className="text-[10px] font-sans font-medium text-text-secondary  mb-1 block"
              >
                Template name
              </label>
              <input
                id={`${formId}-name`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-xs font-sans text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/20 focus-visible:border-brand-accent/40"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor={`${formId}-description`}
                className="text-[10px] font-sans font-medium text-text-secondary  mb-1 block"
              >
                Description
              </label>
              <textarea
                id={`${formId}-description`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="What is this template for?"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-xs font-sans text-text-primary placeholder:text-text-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/20 focus-visible:border-brand-accent/40 resize-none"
              />
            </div>

            {/* Category + Visibility */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label
                  htmlFor={`${formId}-category`}
                  className="text-[10px] font-sans font-medium text-text-secondary  mb-1 block"
                >
                  Category
                </label>
                <select
                  id={`${formId}-category`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-xs font-sans text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-sans font-medium text-text-secondary  mb-1 block">
                  Visibility
                </label>
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={cn(
                    "min-h-11 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-sans border transition-colors",
                    isPublic
                      ? "border-brand-accent/30 text-brand-accent liquid-glass"
                      : "border-white/[0.06] text-text-muted bg-white/[0.03]",
                  )}
                >
                  {isPublic ? (
                    <PhGlobe className="w-3 h-3" />
                  ) : (
                    <PhLock className="w-3 h-3" />
                  )}
                  {isPublic ? "Public" : "Private"}
                </button>
              </div>
            </div>

            {/* Variables */}
            {currentVariables.length > 0 && (
              <div>
                <label className="text-[10px] font-sans font-medium text-text-secondary  mb-2 block">
                  Template variables ({currentVariables.length} detected)
                </label>
                <div className="space-y-2">
                  {currentVariables.map((v, i) => (
                    <div
                      key={v.name}
                      className="liquid-glass rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-brand-gold">
                          {"{{" + v.name + "}}"}
                        </span>
                        <input
                          type="text"
                          aria-label={`${v.name} label`}
                          value={v.label}
                          onChange={(e) =>
                            updateVariable(i, "label", e.target.value)
                          }
                          className="flex-1 bg-transparent text-xs font-sans text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/20 border-b border-transparent focus-visible:border-white/[0.06]"
                          placeholder="Label"
                        />
                      </div>
                      <div className="flex gap-2">
                        <select
                          aria-label={`${v.name} type`}
                          value={v.type}
                          onChange={(e) =>
                            updateVariable(i, "type", e.target.value)
                          }
                          className="bg-white/[0.03] border border-white/[0.06] rounded px-2 py-1 text-[10px] font-sans text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/20"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="select">Select</option>
                          <option value="boolean">Boolean</option>
                        </select>
                        <input
                          type="text"
                          aria-label={`${v.name} default`}
                          value={v.default || ""}
                          onChange={(e) =>
                            updateVariable(i, "default", e.target.value)
                          }
                          className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded px-2 py-1 text-[10px] font-mono text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/20"
                          placeholder="Default value"
                        />
                        <label className="flex items-center gap-1 text-[10px] font-sans text-text-muted cursor-pointer">
                          <input
                            type="checkbox"
                            checked={v.required || false}
                            onChange={(e) =>
                              updateVariable(i, "required", e.target.checked)
                            }
                            className="rounded border-white/[0.12] bg-white/[0.04] text-brand-accent w-3 h-3"
                          />
                          Req
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {error && (
            <p
              role="alert"
              className="px-5 py-3 border-t border-[var(--arc-cosmic-border)] text-sm text-text-primary"
            >
              {error}
            </p>
          )}
          <div className="px-5 py-3 border-t border-white/[0.04] flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="min-h-11 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !name.trim()}
              className="min-h-11 text-xs liquid-glass gap-2"
            >
              <PhFloppyDisk className="w-3.5 h-3.5" />
              {loading ? "Saving..." : "Save template"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
