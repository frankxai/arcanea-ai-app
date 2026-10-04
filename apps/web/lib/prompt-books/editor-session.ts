import type {
  Prompt,
  PromptType,
  UpdatePromptInput,
  ContextConfig,
  FewShotExample,
  ChainStep,
} from "./types";

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

function fields(prompt: Prompt | null): EditorState {
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

function equal(left: EditorState, right: EditorState) {
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
    private commit: (input: UpdatePromptInput) => Promise<Prompt>,
  ) {
    this.saved = fields(prompt);
    this.snapshot = {
      state: this.saved,
      isDirty: false,
      isSaving: false,
      lastSavedAt: prompt?.updatedAt ?? null,
      saveError: null,
    };
  }

  getSnapshot = () => this.snapshot;

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
    if (!this.snapshot.isDirty || !this.listeners.size) return;
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
    this.emit({ state, isDirty: !equal(state, this.saved), saveError: null });
    this.schedule();
  };

  refresh = (prompt: Prompt | null) => {
    if (!prompt || this.snapshot.isDirty || this.snapshot.isSaving) return;
    if (
      this.snapshot.lastSavedAt &&
      (!Number.isFinite(Date.parse(prompt.updatedAt)) ||
        Date.parse(prompt.updatedAt) <= Date.parse(this.snapshot.lastSavedAt))
    )
      return;
    const state = fields(prompt);
    if (
      equal(state, this.saved) &&
      this.snapshot.lastSavedAt === prompt.updatedAt
    )
      return;
    this.saved = state;
    this.emit({ state, lastSavedAt: prompt.updatedAt, saveError: null });
  };

  save = async (): Promise<boolean> => {
    this.clearTimer();
    if (this.flight) {
      const success = await this.flight;
      return success ? this.save() : false;
    }
    if (!this.snapshot.isDirty) return true;
    if (!this.canSave()) {
      this.emit({
        saveError: "Your sign-in changed. Reopen this prompt before saving.",
      });
      return false;
    }
    const state = { ...this.snapshot.state };
    const input: UpdatePromptInput = {
      ...state,
      negativeContent: state.negativeContent || null,
      systemPrompt: state.systemPrompt || null,
    };
    this.emit({ isSaving: true, saveError: null });
    this.flight = (async () => {
      try {
        const stored = await this.commit(input);
        this.saved = state;
        this.emit({
          isDirty: !equal(this.snapshot.state, state),
          lastSavedAt: stored.updatedAt,
        });
        return true;
      } catch {
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
