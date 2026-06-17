type AssetKind = "character" | "location" | "cover" | "poster" | "trailer" | "sprite" | "album_art" | "brand_pack" | "ui";
type RecipeId = "book_to_publish" | "world_to_game" | "artist_release" | "cinematic_trailer" | "campaign_pack";
interface TextEnvelope {
    [key: string]: unknown;
    content: Array<{
        type: "text";
        text: string;
    }>;
}
export declare const ARC_STUDIOS: readonly [{
    readonly id: "world";
    readonly name: "World Studio";
    readonly route: "/worlds";
    readonly outcome: "World bible, factions, locations, timelines, canon graph";
    readonly tools: readonly ["plan_world", "world_report", "export_project_context"];
}, {
    readonly id: "book";
    readonly name: "Book Studio";
    readonly route: "/books/drafts";
    readonly outcome: "Book bible, chapter spine, sample scene, cover brief, publishing checklist";
    readonly tools: readonly ["plan_book", "generate_asset_brief", "save_to_arcanea_vault"];
}, {
    readonly id: "game";
    readonly name: "Game Studio";
    readonly route: "/games";
    readonly outcome: "Game design doc, core loop, levels, asset kit, prototype handoff";
    readonly tools: readonly ["plan_game", "generate_quest", "export_project_context"];
}, {
    readonly id: "music";
    readonly name: "Music Studio";
    readonly route: "/music-studio";
    readonly outcome: "Artist lore, song brief, cover brief, visualizer, release pack";
    readonly tools: readonly ["plan_music_project", "generate_asset_brief", "get_workflow_recipe"];
}, {
    readonly id: "cinema";
    readonly name: "Cinema Studio";
    readonly route: "/cinema-studio";
    readonly outcome: "Scene plan, shot list, camera language, character references, render prompts";
    readonly tools: readonly ["plan_cinematic_scene", "generate_asset_brief", "export_project_context"];
}, {
    readonly id: "marketing";
    readonly name: "Marketing Studio";
    readonly route: "/create#campaign";
    readonly outcome: "Audience map, ad angles, launch assets, creator content pack";
    readonly tools: readonly ["get_workflow_recipe", "generate_asset_brief", "export_project_context"];
}, {
    readonly id: "canvas";
    readonly name: "Canvas";
    readonly route: "/canvas";
    readonly outcome: "Node workflow, chained studios, reusable production graph";
    readonly tools: readonly ["list_arcanea_studios", "get_workflow_recipe", "export_project_context"];
}, {
    readonly id: "agent-os";
    readonly name: "Agent OS";
    readonly route: "/mcp";
    readonly outcome: "MCP setup, tool recipes, repo context, Claude and Codex handoff";
    readonly tools: readonly ["list_arcanea_studios", "get_workflow_recipe", "export_project_context"];
}];
export declare const WORKFLOW_RECIPES: Record<RecipeId, object>;
export declare function planWorld(args: {
    idea: string;
    audience?: string;
    tone?: string;
    scope?: string;
}): TextEnvelope;
export declare function planBook(args: {
    idea: string;
    audience?: string;
    format?: string;
    voice?: string;
}): TextEnvelope;
export declare function planGame(args: {
    idea: string;
    audience?: string;
    engine?: string;
    playStyle?: string;
}): TextEnvelope;
export declare function planMusicProject(args: {
    idea: string;
    audience?: string;
    genre?: string;
    releaseType?: string;
}): TextEnvelope;
export declare function planCinematicScene(args: {
    idea: string;
    audience?: string;
    duration?: string;
    format?: string;
}): TextEnvelope;
export declare function generateAssetBrief(args: {
    kind: AssetKind;
    subject: string;
    style?: string;
    references?: string[];
    aspectRatio?: string;
}): TextEnvelope;
export declare function exportProjectContext(args: {
    projectName: string;
    goal: string;
    targetAgent?: "claude" | "codex" | "cursor" | "generic";
    assets?: string[];
    constraints?: string[];
}): TextEnvelope;
export declare function listArcaneaStudios(): TextEnvelope;
export declare function getWorkflowRecipe(args: {
    recipe: RecipeId;
}): TextEnvelope;
export {};
//# sourceMappingURL=production-planning.d.ts.map