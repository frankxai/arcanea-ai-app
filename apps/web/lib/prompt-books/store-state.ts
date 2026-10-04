import type {
  Collection,
  Prompt,
  Tag,
  PromptType,
  SyncStatus,
  CreateCollectionInput,
  UpdateCollectionInput,
  CreatePromptInput,
  UpdatePromptInput,
  CreateTagInput,
  UpdateTagInput,
  PromptFilters,
  Template,
  TemplateVariable,
} from "./types";
import type { SupabaseClient } from "@supabase/supabase-js";
export interface SavePromptTemplateInput {
  name: string;
  description: string;
  category: string;
  variables: TemplateVariable[];
  isPublic: boolean;
}
export interface PromptBooksState {
  // Data
  collections: Collection[];
  prompts: Prompt[];
  tags: Tag[];

  // Active state
  activeCollectionId: string | null;
  activePromptId: string | null;
  activePromptType: PromptType | null;

  // UI state
  sidebarCollapsed: boolean;
  editorSplitView: boolean;
  viewMode: "grid" | "list";

  // Search
  searchQuery: string;
  searchResults: Prompt[];
  isSearching: boolean;

  // Sync
  syncStatus: SyncStatus;
  lastSyncAt: string | null;

  // Supabase client reference (set on init)
  _client: SupabaseClient | null;
  _userId: string | null;

  // Actions — Initialization
  initialize: (client: SupabaseClient, userId: string) => Promise<void>;
  reset: () => void;
  _sessionVersion: number;

  // Actions — Collections
  loadCollections: () => Promise<void>;
  addCollection: (collection: Collection) => void;
  updateCollectionInStore: (collection: Collection) => void;
  removeCollection: (id: string) => void;
  createCollection: (input: CreateCollectionInput) => Promise<Collection>;
  updateCollection: (
    id: string,
    input: UpdateCollectionInput,
  ) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<void>;
  setActiveCollection: (id: string | null) => void;

  // Actions — Prompts
  loadPrompts: (filters?: PromptFilters) => Promise<void>;
  addPrompt: (prompt: Prompt) => void;
  updatePromptInStore: (prompt: Prompt) => void;
  removePrompt: (id: string) => void;
  createPrompt: (input: CreatePromptInput) => Promise<Prompt>;
  updatePrompt: (id: string, input: UpdatePromptInput) => Promise<Prompt>;
  deletePrompt: (id: string) => Promise<void>;
  duplicatePrompt: (id: string) => Promise<Prompt>;
  instantiateTemplate: (
    templateId: string,
    variables: Record<string, string>,
    collectionId?: string,
  ) => Promise<Prompt>;
  savePromptAsTemplate: (
    id: string,
    data: SavePromptTemplateInput,
  ) => Promise<Template>;
  setActivePrompt: (id: string | null) => void;
  setActivePromptType: (type: PromptType | null) => void;

  changePromptTag: (
    id: string,
    tagId: string,
    assigned: boolean,
  ) => Promise<void>;

  // Actions — Tags
  loadTags: (collectionId?: string) => Promise<void>;
  addTag: (tag: Tag) => void;
  updateTagInStore: (tag: Tag) => void;
  removeTag: (id: string) => void;
  createTag: (input: CreateTagInput) => Promise<Tag>;
  updateTag: (id: string, input: UpdateTagInput) => Promise<Tag>;
  deleteTag: (id: string) => Promise<void>;

  // Actions — Search
  search: (query: string) => Promise<void>;
  clearSearch: () => void;

  // Actions — UI
  toggleSidebar: () => void;
  toggleSplitView: () => void;
  setViewMode: (mode: "grid" | "list") => void;

  // Actions — Sync
  setSyncStatus: (status: SyncStatus) => void;
  setLastSyncAt: (time: string) => void;
}
