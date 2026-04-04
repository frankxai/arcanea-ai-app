/**
 * Arcanea Media MCP Tools
 * Exposes @arcanea/media through the MCP server so I (Claude) can manage
 * your media library directly without leaving the conversation.
 *
 * Guardian: Elara (Starweave Gate, 852 Hz) — Transformation
 *
 * Tools:
 *   media_scan    — Scan a directory and catalog all media
 *   media_stats   — Get stats from the manifest
 *   media_search  — Search the catalog by query
 *   media_approve — Set status on entries
 *   media_dedup   — Archive all duplicates
 *   media_process — Run image conversion + thumbnails
 */
export declare const MEDIA_TOOLS: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            root_path: {
                type: string;
                description: string;
            };
            manifest_path: {
                type: string;
                description: string;
                default: string;
            };
            query?: undefined;
            limit?: undefined;
            ids?: undefined;
            status?: undefined;
            quality_tier?: undefined;
            apply?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            manifest_path: {
                type: string;
                description: string;
                default?: undefined;
            };
            root_path?: undefined;
            query?: undefined;
            limit?: undefined;
            ids?: undefined;
            status?: undefined;
            quality_tier?: undefined;
            apply?: undefined;
        };
        required?: undefined;
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
            manifest_path: {
                type: string;
                description?: undefined;
                default?: undefined;
            };
            limit: {
                type: string;
                default: number;
            };
            root_path?: undefined;
            ids?: undefined;
            status?: undefined;
            quality_tier?: undefined;
            apply?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            ids: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            status: {
                type: string;
                enum: string[];
            };
            quality_tier: {
                type: string;
                enum: number[];
            };
            manifest_path: {
                type: string;
                description?: undefined;
                default?: undefined;
            };
            root_path?: undefined;
            query?: undefined;
            limit?: undefined;
            apply?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            apply: {
                type: string;
                description: string;
                default: boolean;
            };
            manifest_path: {
                type: string;
                description?: undefined;
                default?: undefined;
            };
            root_path?: undefined;
            query?: undefined;
            limit?: undefined;
            ids?: undefined;
            status?: undefined;
            quality_tier?: undefined;
        };
        required?: undefined;
    };
})[];
export declare function handleMediaTool(name: string, args: Record<string, unknown>): Promise<string>;
//# sourceMappingURL=media-tools.d.ts.map