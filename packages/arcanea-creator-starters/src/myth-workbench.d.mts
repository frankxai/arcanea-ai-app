import type { MythAtlas, MythBrief, MythPacket } from "./myth-packets.mjs";
export const packetTag: string;
export interface SnapshotRow {
  id: string;
  user_id: string;
  title: string;
  type: string;
  status: string;
  visibility: string;
  tags: string[];
  created_at: string;
  content: {
    schema: string;
    brief: MythBrief;
    atlas: MythAtlas;
    packet: MythPacket;
  };
}
export interface StoreResult<T> {
  data: T | null;
  error: { code?: string } | null;
}
export interface SnapshotReceipt {
  creationId: string;
  packetId: string;
  createdAt: string;
  disposition: "created" | "existing";
  storage: "creations";
  visibility: "private";
}
export interface WorkbenchResult {
  brief: MythBrief;
  packet: MythPacket;
  markdown: string;
  handoff: ReturnType<typeof handoff>;
  receipt?: SnapshotReceipt;
}
export function handoff(packet: MythPacket): {
  schema: string;
  packetId: string;
  briefDigest: string;
  state: string;
  sourceDigests: { id: string; sourceDigest: string }[];
  executionAuthorized: false;
  releaseEligible: false;
  tasks: {
    id: string;
    format: string;
    acceptedUnitsTarget: number;
    maxAttempts: number;
    estimatedCostMicros: number;
    currency: string;
    requires: string[];
    acceptance: string;
  }[];
  nextDecision: string;
  limits: string;
};
export function snapshotId(owner: string, packetId: string): string;
export function handleWorkbench(
  request: Request,
  dependencies: {
    atlas: MythAtlas;
    getOwner(): Promise<string | null>;
    store: {
      insert(
        row: Omit<SnapshotRow, "created_at">,
      ): Promise<StoreResult<SnapshotRow>>;
      find(id: string, owner: string): Promise<StoreResult<SnapshotRow>>;
      list(owner: string): Promise<StoreResult<SnapshotRow[]>>;
    };
  },
): Promise<Response>;
