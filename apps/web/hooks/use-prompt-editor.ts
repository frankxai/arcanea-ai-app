"use client";

import { useState, useCallback, useEffect, useSyncExternalStore } from "react";
import { usePromptBooksStore } from "@/lib/prompt-books/store";
import { PromptEditorSession } from "@/lib/prompt-books/editor-session";
import type { EditorState } from "@/lib/prompt-books/editor-session";
import { PROMPT_TYPES } from "@/lib/prompt-books/constants";

const hiddenDraft: EditorState = {
  title: "",
  content: "",
  negativeContent: "",
  systemPrompt: "",
  promptType: "general",
  contextConfig: {},
  fewShotExamples: [],
  chainSteps: [],
};

export function usePromptEditor(promptId: string | null) {
  const {
    prompts,
    updatePrompt,
    deletePrompt,
    duplicatePrompt,
    _userId: userId,
  } = usePromptBooksStore();
  const prompt = promptId
    ? (prompts.find((row) => row.id === promptId && row.userId === userId) ??
      null)
    : null;
  const loadedId = prompt?.id ?? null;
  const createSession = () => ({
    promptId,
    loadedId,
    userId,
    editor: new PromptEditorSession(
      prompt,
      () => {
        const current = usePromptBooksStore.getState();
        return Boolean(
          promptId &&
          userId &&
          current._client &&
          current._userId === userId &&
          current.prompts.some(
            (row) => row.id === promptId && row.userId === userId,
          ),
        );
      },
      async (input) => {
        const before = usePromptBooksStore.getState();
        const client = before._client;
        if (!client || !userId || !promptId) throw new Error("Not initialized");
        const verified = await client.auth.getUser();
        if (
          verified.error ||
          verified.data.user?.id !== userId ||
          usePromptBooksStore.getState()._client !== client ||
          usePromptBooksStore.getState()._userId !== userId ||
          usePromptBooksStore.getState()._sessionVersion !==
            before._sessionVersion
        )
          throw new Error("Editor identity changed");
        return updatePrompt(promptId, input);
      },
    ),
  });
  const [session, setSession] = useState(createSession);
  const previous = session.editor.getSnapshot();
  if (
    session.promptId !== promptId ||
    ((session.loadedId !== loadedId || session.userId !== userId) &&
      !previous.isDirty &&
      !previous.isSaving)
  )
    setSession(createSession());
  const snapshot = useSyncExternalStore(
    session.editor.subscribe,
    session.editor.getSnapshot,
    session.editor.getSnapshot,
  );
  const active =
    session.userId !== null &&
    session.userId === userId &&
    loadedId === session.promptId;
  const visible = active
    ? snapshot
    : {
        ...snapshot,
        state: hiddenDraft,
        lastSavedAt: null,
        saveError:
          session.userId !== null && session.userId !== userId
            ? "Your sign-in changed. Return to the owner account to recover this draft."
            : snapshot.saveError,
      };

  useEffect(() => {
    if (active) session.editor.refresh(prompt);
  }, [active, session, prompt, snapshot.isDirty, snapshot.isSaving]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      const current = session.editor.getSnapshot();
      if (current.isDirty || current.isSaving) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [session]);

  const handleDelete = useCallback(async () => {
    if (!active || !promptId) return false;
    await deletePrompt(promptId);
    return true;
  }, [active, promptId, deletePrompt]);
  const handleDuplicate = useCallback(async () => {
    if (active && promptId) return duplicatePrompt(promptId);
  }, [active, promptId, duplicatePrompt]);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(visible.state.content);
      return true;
    } catch {
      return false;
    }
  }, [visible.state.content]);
  const updateField = useCallback(
    <K extends keyof EditorState>(field: K, value: EditorState[K]) => {
      if (active) session.editor.updateField(field, value);
    },
    [active, session],
  );
  const text = visible.state.content;
  return {
    prompt,
    ...visible,
    wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
    charCount: text.length,
    typeConfig: PROMPT_TYPES[visible.state.promptType],
    updateField,
    save: session.editor.save,
    handleDelete,
    handleDuplicate,
    handleCopy,
  };
}
