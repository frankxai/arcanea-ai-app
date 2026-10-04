import type { SupabaseClient } from "@supabase/supabase-js";
import type { PromptBooksState } from "./store-state";
import type { SyncStatus } from "./types";
import { currentActor } from "./actor-session";

type Resource = "collections" | "prompts" | "tags";
interface Load {
  status: "syncing" | "synced" | "error";
}

// Currentness belongs to each resource. Selecting a route replaces prompt/tag
// reads, but must not conceal a still-current collection failure.
export class PromptBooksLoads {
  private loads = new Map<Resource, Load>();
  constructor(
    private read: () => PromptBooksState,
    private publish: (
      state: Pick<PromptBooksState, "syncStatus"> &
        Partial<Pick<PromptBooksState, "lastSyncAt">>,
    ) => void,
  ) {}

  reset(): void {
    this.loads.clear();
  }

  status(fallback: SyncStatus): SyncStatus {
    const loads = [...this.loads.values()];
    if (loads.some((load) => load.status === "error")) return "error";
    if (loads.some((load) => load.status === "syncing")) return "syncing";
    return fallback;
  }

  private report(): void {
    const syncStatus = this.status("synced");
    this.publish({
      syncStatus,
      ...(syncStatus === "synced"
        ? { lastSyncAt: new Date().toISOString() }
        : {}),
    });
  }

  async run<T>(
    resource: Resource,
    work: () => Promise<T>,
    apply: (value: T) => void,
  ): Promise<void> {
    const state = this.read();
    const client: SupabaseClient | null = state._client;
    const userId = state._userId;
    if (!client || !userId) return;
    const version = state._sessionVersion;
    const load: Load = { status: "syncing" };
    this.loads.set(resource, load);
    const isCurrent = () =>
      this.loads.get(resource) === load &&
      currentActor(this.read, client, userId, version);
    this.report();
    try {
      const value = await work();
      if (!isCurrent()) return;
      apply(value);
      load.status = "synced";
      this.report();
    } catch (error) {
      if (isCurrent()) {
        load.status = "error";
        this.report();
      }
      throw error;
    }
  }
}
