"use client";

// Arcanea Prompt Books — Zustand Store
// Client-side state management with localStorage persistence

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PromptBooksState } from "./store-state";
import * as service from "./service";
import type { SupabaseClient } from "@supabase/supabase-js";

// Store Implementation

let searchGeneration = 0;
let promptLoadGeneration = 0;
let collectionLoadGeneration = 0;
let tagLoadGeneration = 0;
let selectionGeneration = 0;

function currentActor(client: SupabaseClient, userId: string, version: number) {
  const state = usePromptBooksStore.getState();
  return (
    state._client === client &&
    state._userId === userId &&
    state._sessionVersion === version
  );
}

async function actor() {
  const {
    _client: client,
    _userId: userId,
    _sessionVersion: version,
  } = usePromptBooksStore.getState();
  if (!client || !userId) throw new Error("Not initialized");
  const verified = await client.auth.getUser();
  if (
    verified.error ||
    verified.data.user?.id !== userId ||
    !currentActor(client, userId, version)
  )
    throw new Error("Prompt Books identity changed");
  return { client, userId, version };
}

function assertActor(client: SupabaseClient, userId: string, version: number) {
  if (!currentActor(client, userId, version))
    throw new Error("Prompt Books identity changed");
}

const privateState = {
  collections: [],
  prompts: [],
  tags: [],
  activeCollectionId: null,
  activePromptId: null,
  activePromptType: null,
  searchQuery: "",
  searchResults: [],
  isSearching: false,
  lastSyncAt: null,
};

export const usePromptBooksStore = create<PromptBooksState>()(
  persist(
    (set, get) => ({
      collections: [],
      prompts: [],
      tags: [],

      activeCollectionId: null,
      activePromptId: null,
      activePromptType: null,

      sidebarCollapsed: false,
      editorSplitView: false,
      viewMode: "grid",

      searchQuery: "",
      searchResults: [],
      isSearching: false,

      syncStatus: "offline",
      lastSyncAt: null,

      _client: null,
      _userId: null,
      _sessionVersion: 0,

      reset: () => {
        selectionGeneration += 1;
        searchGeneration += 1;
        promptLoadGeneration += 1;
        collectionLoadGeneration += 1;
        tagLoadGeneration += 1;
        set({
          ...privateState,
          _client: null,
          _userId: null,
          _sessionVersion: get()._sessionVersion + 1,
          syncStatus: "offline",
        });
      },
      initialize: async (client, userId) => {
        get().reset();
        const version = get()._sessionVersion;
        set({ _client: client, _userId: userId, syncStatus: "syncing" });
        try {
          await Promise.all([
            get().loadCollections(),
            get().loadTags(),
            get().loadPrompts(),
          ]);
          if (currentActor(client, userId, version))
            set({ syncStatus: "synced", lastSyncAt: new Date().toISOString() });
        } catch {
          if (currentActor(client, userId, version))
            set({ syncStatus: "error" });
        }
      },

      // Collections

      loadCollections: async () => {
        const {
          _client: client,
          _userId: userId,
          _sessionVersion: version,
        } = get();
        if (!client || !userId) return;
        const generation = ++collectionLoadGeneration;

        const collections = await service.listCollections(client, userId);
        if (
          generation === collectionLoadGeneration &&
          currentActor(client, userId, version)
        )
          set({
            collections: collections.filter((row) => row.userId === userId),
          });
      },

      addCollection: (collection) => {
        if (collection.userId !== get()._userId) return;
        set((s) => ({
          collections: [
            ...s.collections.filter((c) => c.id !== collection.id),
            collection,
          ],
        }));
      },

      updateCollectionInStore: (collection) => {
        if (collection.userId !== get()._userId) return;
        set((s) => ({
          collections: s.collections.map((c) =>
            c.id === collection.id ? collection : c,
          ),
        }));
      },

      removeCollection: (id) => {
        set((s) => ({
          collections: s.collections.filter((c) => c.id !== id),
          activeCollectionId:
            s.activeCollectionId === id ? null : s.activeCollectionId,
        }));
      },

      createCollection: async (input) => {
        const { client, userId, version } = await actor();

        const collection = await service.createCollection(
          client,
          userId,
          input,
        );
        assertActor(client, userId, version);
        if (collection.userId !== userId)
          throw new Error("Unexpected Prompt Books owner");
        get().addCollection(collection);
        return collection;
      },

      updateCollection: async (id, input) => {
        const { client, userId, version } = await actor();

        const collection = await service.updateCollection(client, id, input);
        assertActor(client, userId, version);
        if (collection.userId !== userId)
          throw new Error("Unexpected Prompt Books owner");
        get().updateCollectionInStore(collection);
        return collection;
      },

      deleteCollection: async (id) => {
        const { client, userId, version } = await actor();

        await service.deleteCollection(client, id);
        assertActor(client, userId, version);
        get().removeCollection(id);
      },

      setActiveCollection: (id) => {
        const selection = id === "_all" ? null : id;
        const generation = ++selectionGeneration;
        const {
          _client: client,
          _userId: userId,
          _sessionVersion: version,
        } = get();
        const onFailure = () => {
          if (
            client &&
            userId &&
            currentActor(client, userId, version) &&
            generation === selectionGeneration &&
            get().activeCollectionId === selection
          ) {
            get().setSyncStatus("error");
          }
        };
        set({ activeCollectionId: selection, activePromptId: null });
        void get()
          .loadPrompts(id && id !== "_all" ? { collectionId: id } : undefined)
          .catch(onFailure);
        void get()
          .loadTags(id && id !== "_all" ? id : undefined)
          .catch(onFailure);
      },

      // Prompts

      loadPrompts: async (filters) => {
        const {
          _client: client,
          _userId: userId,
          activeCollectionId,
          _sessionVersion: version,
        } = get();
        if (!client || !userId) return;
        const generation = ++promptLoadGeneration;

        const prompts = await service.listPrompts(client, {
          collectionId:
            filters?.collectionId || activeCollectionId || undefined,
          promptType: filters?.promptType || undefined,
          ...filters,
          userId,
        });
        if (
          generation !== promptLoadGeneration ||
          !currentActor(client, userId, version) ||
          get().activeCollectionId !== activeCollectionId
        )
          return;
        set((state) => ({
          prompts: prompts
            .filter((row) => row.userId === userId)
            .map((incoming) => {
              const current = state.prompts.find(
                (row) => row.id === incoming.id && row.userId === userId,
              );
              return current &&
                Date.parse(current.updatedAt) >= Date.parse(incoming.updatedAt)
                ? current
                : incoming;
            }),
        }));
      },

      addPrompt: (prompt) => {
        if (prompt.userId !== get()._userId) return;
        set((s) => ({
          prompts: [...s.prompts.filter((p) => p.id !== prompt.id), prompt],
        }));
      },

      updatePromptInStore: (prompt) => {
        if (prompt.userId !== get()._userId) return;
        set((s) => ({
          prompts: s.prompts.map((p) =>
            p.id === prompt.id &&
            Date.parse(prompt.updatedAt) >= Date.parse(p.updatedAt)
              ? prompt
              : p,
          ),
        }));
      },

      removePrompt: (id) => {
        set((s) => ({
          prompts: s.prompts.filter((p) => p.id !== id),
          activePromptId: s.activePromptId === id ? null : s.activePromptId,
        }));
      },

      createPrompt: async (input) => {
        const { client, userId, version } = await actor();

        const prompt = await service.createPrompt(client, userId, input);
        assertActor(client, userId, version);
        if (prompt.userId !== userId)
          throw new Error("Unexpected Prompt Books owner");
        get().addPrompt(prompt);
        return prompt;
      },

      updatePrompt: async (id, input) => {
        const { client, userId, version } = await actor();

        const prompt = await service.updatePrompt(client, id, input);
        assertActor(client, userId, version);
        if (prompt.userId !== userId)
          throw new Error("Unexpected Prompt Books owner");
        get().updatePromptInStore(prompt);
        return prompt;
      },

      deletePrompt: async (id) => {
        const { client, userId, version } = await actor();

        await service.deletePrompt(client, id);
        assertActor(client, userId, version);
        get().removePrompt(id);
      },

      duplicatePrompt: async (id) => {
        const { client, userId, version } = await actor();
        const prompt = await service.duplicatePrompt(client, id, userId);
        assertActor(client, userId, version);
        if (prompt.userId !== userId)
          throw new Error("Unexpected Prompt Books owner");
        get().addPrompt(prompt);
        return prompt;
      },

      setActivePrompt: (id) => set({ activePromptId: id }),
      setActivePromptType: (type) => set({ activePromptType: type }),

      // Tags

      loadTags: async (collectionId) => {
        const {
          _client: client,
          _userId: userId,
          _sessionVersion: version,
        } = get();
        if (!client || !userId) return;
        const generation = ++tagLoadGeneration;

        const tags = await service.listTags(client, userId, collectionId);
        if (
          generation === tagLoadGeneration &&
          currentActor(client, userId, version)
        )
          set({ tags: tags.filter((row) => row.userId === userId) });
      },

      addTag: (tag) => {
        if (tag.userId !== get()._userId) return;
        set((s) => ({
          tags: [...s.tags.filter((t) => t.id !== tag.id), tag],
        }));
      },

      updateTagInStore: (tag) => {
        if (tag.userId !== get()._userId) return;
        set((s) => ({
          tags: s.tags.map((t) => (t.id === tag.id ? tag : t)),
        }));
      },

      removeTag: (id) => {
        set((s) => ({ tags: s.tags.filter((t) => t.id !== id) }));
      },

      createTag: async (input) => {
        const { client, userId, version } = await actor();

        const tag = await service.createTag(client, userId, input);
        assertActor(client, userId, version);
        if (tag.userId !== userId)
          throw new Error("Unexpected Prompt Books owner");
        get().addTag(tag);
        return tag;
      },

      updateTag: async (id, input) => {
        const { client, userId, version } = await actor();

        const tag = await service.updateTag(client, id, input);
        assertActor(client, userId, version);
        if (tag.userId !== userId)
          throw new Error("Unexpected Prompt Books owner");
        get().updateTagInStore(tag);
        return tag;
      },

      deleteTag: async (id) => {
        const { client, userId, version } = await actor();

        await service.deleteTag(client, id);
        assertActor(client, userId, version);
        get().removeTag(id);
      },

      search: async (query) => {
        const {
          _client: client,
          _userId: userId,
          _sessionVersion: version,
        } = get();
        if (!client || !userId) return;

        const generation = ++searchGeneration;
        const isCurrent = () =>
          generation === searchGeneration &&
          currentActor(client, userId, version);
        set({ searchQuery: query, searchResults: [], isSearching: true });

        try {
          const results = await service.searchPrompts(client, userId, query);
          if (isCurrent())
            set({
              searchResults: results.filter((row) => row.userId === userId),
              isSearching: false,
            });
        } catch {
          if (isCurrent()) set({ searchResults: [], isSearching: false });
        }
      },

      clearSearch: () => {
        searchGeneration += 1;
        set({ searchQuery: "", searchResults: [], isSearching: false });
      },

      // UI

      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleSplitView: () =>
        set((s) => ({ editorSplitView: !s.editorSplitView })),
      setViewMode: (mode) => set({ viewMode: mode }),

      setSyncStatus: (status) => set({ syncStatus: status }),
      setLastSyncAt: (time) => set({ lastSyncAt: time }),
    }),
    {
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
    },
  ),
);
