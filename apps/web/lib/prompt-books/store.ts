"use client";

// Arcanea Prompt Books — Zustand Store
// Client-side state management with localStorage persistence

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { promptBooksPreferences } from "./preferences";
import {
  PromptBooksLoads,
  mergeResourceRead,
  replaceResourceRevision,
} from "./resource-loads";
import { comparePromptRevisions } from "./revisions";
import { templateVariablesForContent } from "./template-variables";
import { writePromptTemplate } from "./template-write";
import { promptEditorFields, sameEditorFields } from "./editor-session";
import type { PromptBooksState } from "./store-state";
import * as service from "./service";
import {
  actor as verifiedActor,
  currentActor as matchesActor,
  assertActor as verifyActor,
  changePromptTag as mutatePromptTag,
  updateOwnedPrompt as mutatePrompt,
} from "./actor-session";
import type { SupabaseClient } from "@supabase/supabase-js";

// Store Implementation

let searchGeneration = 0;

const readActor = () => usePromptBooksStore.getState();
const currentActor = (
  client: SupabaseClient,
  userId: string,
  version: number,
) => matchesActor(readActor, client, userId, version);
const actor = () => verifiedActor(readActor);
const assertActor = (client: SupabaseClient, userId: string, version: number) =>
  verifyActor(readActor, client, userId, version);

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
  promptLoadFailed: false,
};

export const usePromptBooksStore = create<PromptBooksState>()(
  persist(
    (set, get): PromptBooksState => ({
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
      promptLoadFailed: false,
      lastSyncAt: null,

      _client: null,
      _userId: null,
      _sessionVersion: 0,

      reset: () => {
        loads.reset();
        searchGeneration += 1;
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
        set({ _client: client, _userId: userId, syncStatus: "syncing" });
        // Each loader owns its status, including failures not superseded by a route.
        await Promise.allSettled([
          get().loadCollections(),
          get().loadTags(),
          get().loadPrompts(),
        ]);
      },

      // Collections

      loadCollections: async () => {
        const { _client: client, _userId: userId } = get();
        if (!client || !userId) return;
        const before = get().collections;
        await loads.run(
          "collections",
          () => service.listCollections(client, userId),
          (collections) =>
            set({
              collections: mergeResourceRead(
                before,
                get().collections,
                collections.filter((row) => row.userId === userId),
              ),
            }),
        );
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
          collections: replaceResourceRevision(s.collections, collection),
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
        set({ activeCollectionId: selection, activePromptId: null });
        void Promise.allSettled([
          get().loadPrompts(
            selection ? { collectionId: selection } : undefined,
          ),
          get().loadTags(selection ?? undefined),
        ]);
      },

      // Prompts

      loadPrompts: async (filters) => {
        const { _client: client, _userId: userId, activeCollectionId } = get();
        if (!client || !userId) return;
        const before = get().prompts;
        await loads.run(
          "prompts",
          () =>
            service.listPrompts(client, {
              collectionId:
                filters?.collectionId || activeCollectionId || undefined,
              promptType: filters?.promptType || undefined,
              ...filters,
              userId,
            }),
          (prompts) =>
            set((state) => ({
              prompts: mergeResourceRead(
                before,
                state.prompts,
                prompts.filter((row) => row.userId === userId),
                (incoming, current) => ({
                  ...incoming,
                  tags: incoming.tags ?? current.tags,
                }),
              ),
            })),
        );
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
            (comparePromptRevisions(prompt.updatedAt, p.updatedAt) ?? -1) >= 0
              ? { ...prompt, tags: prompt.tags ?? p.tags }
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

      updatePrompt: (id, input, revision) =>
        mutatePrompt(readActor, id, input, revision),

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

      instantiateTemplate: async (templateId, variables, collectionId) => {
        const { client, userId, version } = await actor();
        const prompt = await service.instantiateTemplate(
          client,
          userId,
          templateId,
          variables,
          collectionId,
        );
        assertActor(client, userId, version);
        if (prompt.userId !== userId)
          throw new Error("Unexpected Prompt Books owner");
        get().addPrompt(prompt);
        return prompt;
      },

      setActivePrompt: (id) => set({ activePromptId: id }),
      savePromptAsTemplate: async (id, data, confirmedDraft) => {
        const { client, userId, version } = await actor();
        const prompt = get().prompts.find(
          (row) => row.id === id && row.userId === userId,
        );
        if (!prompt) throw new Error("Prompt not available");
        if (
          confirmedDraft &&
          !sameEditorFields(promptEditorFields(prompt), confirmedDraft)
        )
          throw new Error(
            "Prompt changed after saving. Retry template creation.",
          );
        // Preserve the accepted template mapping; retries reuse the primary key.
        const { requestId, ...details } = data;
        const { template, acknowledge } = await writePromptTemplate(
          client,
          userId,
          id,
          {
            ...details,
            variables: templateVariablesForContent(
              prompt.content,
              data.variables,
            ),
            userId,
            content: prompt.content,
            negativeContent: prompt.negativeContent,
            systemPrompt: prompt.systemPrompt,
            promptType: prompt.promptType,
            contextConfig: prompt.contextConfig,
            fewShotExamples: prompt.fewShotExamples,
            chainSteps: prompt.chainSteps,
            guardianId: null,
            element: null,
            tags: (prompt.tags ?? []).map((tag) => tag.name),
          },
          requestId,
          () => assertActor(client, userId, version),
        );
        assertActor(client, userId, version);
        if (template.userId !== userId)
          throw new Error("Unexpected Prompt Books owner");
        acknowledge();
        return template;
      },
      setActivePromptType: (type) => set({ activePromptType: type }),

      changePromptTag: (id, tagId, assigned) =>
        mutatePromptTag(readActor, id, tagId, assigned),

      // Tags

      loadTags: async (collectionId) => {
        const { _client: client, _userId: userId } = get();
        if (!client || !userId) return;
        const before = get().tags;
        await loads.run(
          "tags",
          () => service.listTags(client, userId, collectionId),
          (tags) =>
            set({
              tags: mergeResourceRead(
                before,
                get().tags,
                tags.filter((row) => row.userId === userId),
              ),
            }),
        );
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
          tags: replaceResourceRevision(s.tags, tag),
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

      setSyncStatus: (status) => set({ syncStatus: loads.status(status) }),
      setLastSyncAt: (time) => set({ lastSyncAt: time }),
    }),
    promptBooksPreferences,
  ),
);

const loads = new PromptBooksLoads(readActor, (state) =>
  usePromptBooksStore.setState(state),
);
