import type { PersistOptions } from "zustand/middleware";
import type { PromptBooksState } from "./store-state";

type Preferences = Pick<
  PromptBooksState,
  "sidebarCollapsed" | "editorSplitView" | "viewMode"
>;

export const promptBooksPreferences: PersistOptions<
  PromptBooksState,
  Preferences
> = {
  name: "arcanea-prompt-books",
  // Older installations may contain arbitrary private fields. Hydrate only
  // validated preferences, regardless of their stored version.
  merge: (persisted, current) => {
    const preferences =
      persisted && typeof persisted === "object"
        ? (persisted as Record<string, unknown>)
        : {};
    return {
      ...current,
      sidebarCollapsed:
        typeof preferences.sidebarCollapsed === "boolean"
          ? preferences.sidebarCollapsed
          : current.sidebarCollapsed,
      editorSplitView:
        typeof preferences.editorSplitView === "boolean"
          ? preferences.editorSplitView
          : current.editorSplitView,
      viewMode:
        preferences.viewMode === "grid" || preferences.viewMode === "list"
          ? preferences.viewMode
          : current.viewMode,
    };
  },
  partialize: (state) => ({
    // Only persist UI preferences, not data
    sidebarCollapsed: state.sidebarCollapsed,
    editorSplitView: state.editorSplitView,
    viewMode: state.viewMode,
  }),
};
