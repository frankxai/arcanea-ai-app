import type {
  Prompt,
  PromptType,
  UpdatePromptInput,
  ContextConfig,
  FewShotExample,
  ChainStep,
} from "./types";
import { comparePromptRevisions } from "./revisions";
import { PromptDraftConflict } from "./draft-write";

export interface EditorState {
  title: string;
  content: string;
  negativeContent: string;
  systemPrompt: string;
  promptType: PromptType;
  contextConfig: ContextConfig;
  fewShotExamples: FewShotExample[];
  chainSteps: ChainStep[];
}

export function promptEditorFields(prompt: Prompt | null): EditorState {
  return {
    title: prompt?.title ?? "",
    content: prompt?.content ?? "",
    negativeContent: prompt?.negativeContent ?? "",
    systemPrompt: prompt?.systemPrompt ?? "",
    promptType: prompt?.promptType ?? "general",
    contextConfig: structuredClone(prompt?.contextConfig ?? {}),
    fewShotExamples: structuredClone(prompt?.fewShotExamples ?? []),
    chainSteps: structuredClone(prompt?.chainSteps ?? []),
  };
}

export function sameEditorFields(left: EditorState, right: EditorState) {
  return (
    left.title === right.title &&
    left.content === right.content &&
    left.negativeContent === right.negativeContent &&
    left.systemPrompt === right.systemPrompt &&
    left.promptType === right.promptType &&
    JSON.stringify(left.contextConfig) ===
      JSON.stringify(right.contextConfig) &&
    JSON.stringify(left.fewShotExamples) ===
      JSON.stringify(right.fewShotExamples) &&
    JSON.stringify(left.chainSteps) === JSON.stringify(right.chainSteps)
  );
}

// A session owns one prompt/actor's draft and outstanding writes. A delayed
// response can confirm its snapshot, never a later edit or another session.
export class PromptEditorSession {
  private saved: EditorState;
  private baseUpdatedAt: string | null;
  private conflictPending = false;
  private listeners = new Set<() => void>();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private flight: Promise<boolean> | null = null;
  private snapshot: {
    state: EditorState;
    isDirty: boolean;
    isSaving: boolean;
    lastSavedAt: string | null;
    saveError: string | null;
  };

  constructor(
    prompt: Prompt | null,
    private canSave: () => boolean,
    private commit: (
      input: UpdatePromptInput,
      expectedUpdatedAt: string,
    ) => Promise<Prompt>,
  ) {
    this.saved = promptEditorFields(prompt);
    this.baseUpdatedAt = prompt?.updatedAt ?? null;
    this.snapshot = {
      state: this.saved,
      isDirty: false,
      isSaving: false,
      lastSavedAt: prompt?.updatedAt ?? null,
      saveError: null,
    };
  }

  getSnapshot = () => this.snapshot;
  getConfirmedState = () => structuredClone(this.saved);

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    if (this.snapshot.isDirty && !this.flight) this.schedule();
    return () => {
      this.listeners.delete(listener);
      if (!this.listeners.size) this.clearTimer();
    };
  };

  private emit(patch: Partial<typeof this.snapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    for (const listener of this.listeners) listener();
  }

  private clearTimer() {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }

  private schedule() {
    this.clearTimer();
    if (!this.snapshot.isDirty || !this.listeners.size || this.conflictPending)
      return;
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.save();
    }, 2000);
  }

  updateField = <K extends keyof EditorState>(
    field: K,
    value: EditorState[K],
  ) => {
    const state = { ...this.snapshot.state, [field]: structuredClone(value) };
    this.emit({
      state,
      isDirty: !sameEditorFields(state, this.saved),
      saveError: this.conflictPending ? this.snapshot.saveError : null,
    });
    this.schedule();
  };

  refresh = (prompt: Prompt | null) => {
    if (!prompt || this.snapshot.isDirty || this.snapshot.isSaving) return;
    if (this.snapshot.lastSavedAt) {
      const revision = comparePromptRevisions(
        prompt.updatedAt,
        this.snapshot.lastSavedAt,
      );
      if (revision === null || revision <= 0) return;
    }
    const state = promptEditorFields(prompt);
    if (
      sameEditorFields(state, this.saved) &&
      this.snapshot.lastSavedAt === prompt.updatedAt
    )
      return;
    this.saved = state;
    this.baseUpdatedAt = prompt.updatedAt;
    this.emit({ state, lastSavedAt: prompt.updatedAt, saveError: null });
  };

  save = async (): Promise<boolean> => {
    this.clearTimer();
    if (this.flight) {
      const success = await this.flight;
      return success ? this.save() : false;
    }
    if (!this.snapshot.isDirty) return true;
    if (!this.canSave() || !this.baseUpdatedAt) {
      this.emit({
        saveError: "Your sign-in changed. Reopen this prompt before saving.",
      });
      return false;
    }
    const state = { ...this.snapshot.state };
    const expectedUpdatedAt = this.baseUpdatedAt;
    this.conflictPending = false;
    const input: UpdatePromptInput = {
      ...state,
      negativeContent: state.negativeContent || null,
      systemPrompt: state.systemPrompt || null,
    };
    this.emit({ isSaving: true, saveError: null });
    this.flight = (async () => {
      try {
        const stored = await this.commit(input, expectedUpdatedAt);
        if (!sameEditorFields(promptEditorFields(stored), state))
          throw new PromptDraftConflict(stored);
        this.saved = state;
        this.baseUpdatedAt = stored.updatedAt;
        this.emit({
          isDirty: !sameEditorFields(this.snapshot.state, state),
          lastSavedAt: stored.updatedAt,
        });
        return true;
      } catch (error) {
        if (error instanceof PromptDraftConflict) {
          const remote = promptEditorFields(error.current);
          if (sameEditorFields(remote, state)) {
            this.saved = remote;
            this.baseUpdatedAt = error.current.updatedAt;
            this.emit({
              isDirty: !sameEditorFields(this.snapshot.state, remote),
              lastSavedAt: error.current.updatedAt,
            });
            return true;
          }
          const merged = { ...remote };
          // Keep fields the creator edited; take remote changes to untouched
          // fields. A subsequent explicit retry confirms the creator's choice.
          for (const key of Object.keys(merged) as (keyof EditorState)[]) {
            if (
              JSON.stringify(this.snapshot.state[key]) !==
              JSON.stringify(this.saved[key])
            )
              Object.assign(merged, {
                [key]: structuredClone(this.snapshot.state[key]),
              });
          }
          this.saved = remote;
          this.baseUpdatedAt = error.current.updatedAt;
          this.conflictPending = true;
          this.clearTimer();
          this.emit({
            state: merged,
            isDirty: !sameEditorFields(merged, remote),
            saveError:
              "Newer changes arrived. Your draft is still here. Retry save to keep your edits.",
          });
          return false;
        }
        this.emit({
          saveError: "Could not save. Your draft is still here. Retry save.",
        });
        return false;
      } finally {
        this.emit({ isSaving: false });
      }
    })();
    const success = await this.flight;
    this.flight = null;
    if (success && this.snapshot.isDirty) return this.save();
    if (success) this.schedule();
    return success;
  };
}
