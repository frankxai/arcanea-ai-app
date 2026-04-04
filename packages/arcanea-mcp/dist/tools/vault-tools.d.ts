/**
 * Arcanea Vault MCP Tools — Memory System Interface for Claude Code
 *
 * These tools expose the Starlight Vault Memory System through MCP,
 * allowing Claude Code to remember, recall, and manage memories
 * across 6 semantic vaults with Guardian routing.
 *
 * Guardian: Alera (Voice Gate, 528 Hz) — Truth, Expression
 *
 * Tools:
 *   1. vault_remember  — Store a memory in the appropriate Starlight Vault
 *   2. vault_recall    — Search across vaults for relevant memories
 *   3. vault_stats     — Get statistics about memory across all vaults
 *   4. horizon_append  — Append a benevolent wish to the Horizon Vault
 *   5. horizon_read    — Read entries from the Horizon Vault
 *   6. vault_classify  — Classify content into a vault type without storing
 */
export type VaultType = 'strategic' | 'technical' | 'creative' | 'operational' | 'wisdom' | 'horizon';
export declare const VAULT_TYPES: readonly VaultType[];
export type ConfidenceLevel = 'low' | 'medium' | 'high' | 'verified';
export declare const CONFIDENCE_VALUES: readonly ConfidenceLevel[];
export type GuardianName = 'Lyssandria' | 'Leyla' | 'Draconia' | 'Maylinn' | 'Alera' | 'Lyria' | 'Aiyami' | 'Elara' | 'Ino' | 'Shinkami';
export declare const GUARDIAN_NAMES: readonly GuardianName[];
export interface VaultEntry {
    id: string;
    vault: VaultType;
    content: string;
    summary?: string;
    tags: string[];
    confidence: ConfidenceLevel;
    guardian?: GuardianName;
    source?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
export interface HorizonEntry {
    id: string;
    wish: string;
    context: string;
    author: string;
    coAuthored: boolean;
    tags: string[];
    createdAt: string;
}
export interface VaultSearchResult {
    entry: VaultEntry;
    score: number;
    matchedTerms: string[];
}
export interface ClassificationResult {
    vault: VaultType;
    confidence: number;
    reasoning: string;
    alternateVault?: VaultType;
}
export interface VaultStats {
    vault: VaultType;
    entryCount: number;
    oldestEntry?: string;
    newestEntry?: string;
    topTags: Array<{
        tag: string;
        count: number;
    }>;
    guardianDistribution: Partial<Record<string, number>>;
}
export interface MemorySystemStats {
    totalEntries: number;
    vaultStats: VaultStats[];
    horizonEntries: number;
    storageBackend: string;
    lastActivity?: string;
}
type ToolResult = {
    content: Array<{
        type: string;
        text: string;
    }>;
};
declare class VaultManager {
    private readonly basePath;
    private initialized;
    constructor(basePath?: string);
    init(): Promise<void>;
    private vaultFile;
    private horizonFile;
    remember(content: string, vault?: VaultType, tags?: string[], guardian?: GuardianName, confidence?: ConfidenceLevel, source?: string): Promise<VaultEntry>;
    recall(query: string, vaults?: VaultType[], guardian?: GuardianName, limit?: number, sortBy?: 'relevance' | 'recency' | 'confidence'): Promise<VaultSearchResult[]>;
    stats(): Promise<MemorySystemStats>;
    horizonAppend(wish: string, context: string, author?: string, tags?: string[]): Promise<HorizonEntry>;
    horizonRead(limit?: number, search?: string): Promise<HorizonEntry[]>;
    private readVaultEntries;
    private readHorizonEntries;
    /** Clear all vault data (for testing). */
    clear(): Promise<void>;
}
/** Get or create the singleton VaultManager. */
export declare function getVaultManager(basePath?: string): VaultManager;
/**
 * Reset the singleton (for testing only).
 * This allows tests to provide a fresh manager with a custom path.
 */
export declare function resetVaultManager(): void;
export declare const VAULT_TOOL_DEFINITIONS: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            content: {
                type: string;
                description: string;
            };
            vault: {
                type: string;
                enum: string[];
                description: string;
            };
            tags: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            guardian: {
                type: string;
                enum: string[];
                description: string;
            };
            confidence: {
                type: string;
                enum: string[];
                description: string;
            };
            source: {
                type: string;
                description: string;
            };
            query?: undefined;
            vaults?: undefined;
            limit?: undefined;
            sortBy?: undefined;
            wish?: undefined;
            context?: undefined;
            author?: undefined;
            search?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            query: {
                type: string;
                description: string;
            };
            vaults: {
                type: string;
                items: {
                    type: string;
                    enum: string[];
                };
                description: string;
            };
            guardian: {
                type: string;
                enum: string[];
                description: string;
            };
            limit: {
                type: string;
                description: string;
            };
            sortBy: {
                type: string;
                enum: string[];
                description: string;
            };
            content?: undefined;
            vault?: undefined;
            tags?: undefined;
            confidence?: undefined;
            source?: undefined;
            wish?: undefined;
            context?: undefined;
            author?: undefined;
            search?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            content?: undefined;
            vault?: undefined;
            tags?: undefined;
            guardian?: undefined;
            confidence?: undefined;
            source?: undefined;
            query?: undefined;
            vaults?: undefined;
            limit?: undefined;
            sortBy?: undefined;
            wish?: undefined;
            context?: undefined;
            author?: undefined;
            search?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            wish: {
                type: string;
                description: string;
            };
            context: {
                type: string;
                description: string;
            };
            author: {
                type: string;
                description: string;
            };
            tags: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            content?: undefined;
            vault?: undefined;
            guardian?: undefined;
            confidence?: undefined;
            source?: undefined;
            query?: undefined;
            vaults?: undefined;
            limit?: undefined;
            sortBy?: undefined;
            search?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            limit: {
                type: string;
                description: string;
            };
            search: {
                type: string;
                description: string;
            };
            content?: undefined;
            vault?: undefined;
            tags?: undefined;
            guardian?: undefined;
            confidence?: undefined;
            source?: undefined;
            query?: undefined;
            vaults?: undefined;
            sortBy?: undefined;
            wish?: undefined;
            context?: undefined;
            author?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            content: {
                type: string;
                description: string;
            };
            guardian: {
                type: string;
                enum: string[];
                description: string;
            };
            vault?: undefined;
            tags?: undefined;
            confidence?: undefined;
            source?: undefined;
            query?: undefined;
            vaults?: undefined;
            limit?: undefined;
            sortBy?: undefined;
            wish?: undefined;
            context?: undefined;
            author?: undefined;
            search?: undefined;
        };
        required: string[];
    };
})[];
export declare function handleVaultRemember(args: Record<string, unknown>): Promise<ToolResult>;
export declare function handleVaultRecall(args: Record<string, unknown>): Promise<ToolResult>;
export declare function handleVaultStats(): Promise<ToolResult>;
export declare function handleHorizonAppend(args: Record<string, unknown>): Promise<ToolResult>;
export declare function handleHorizonRead(args: Record<string, unknown>): Promise<ToolResult>;
export declare function handleVaultClassify(args: Record<string, unknown>): Promise<ToolResult>;
export declare function handleVaultTool(name: string, args: Record<string, unknown>): Promise<ToolResult | null>;
export {};
//# sourceMappingURL=vault-tools.d.ts.map