function json(data) {
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function splitWords(input) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 10);
}
function titleFromIdea(idea, fallback) {
    const words = splitWords(idea).filter((word) => !["a", "an", "the", "and", "of", "for"].includes(word));
    if (words.length === 0)
        return fallback;
    return words
        .slice(0, 4)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
function basePacket(kind, idea, audience) {
    return {
        kind,
        title: titleFromIdea(idea, `Arcanea ${kind}`),
        seed: idea,
        audience: audience || "creators and studios",
        openCoreBoundary: {
            public: ["local MCP tools", "workflow recipes", "portable exports", "docs and examples"],
            gated: ["hosted vault", "media automation", "credits", "private team workspaces"],
            support: "async docs and issue intake only",
        },
    };
}
export const ARC_STUDIOS = [
    {
        id: "world",
        name: "World Studio",
        route: "/worlds",
        outcome: "World bible, factions, locations, timelines, canon graph",
        tools: ["plan_world", "world_report", "export_project_context"],
    },
    {
        id: "book",
        name: "Book Studio",
        route: "/books/drafts",
        outcome: "Book bible, chapter spine, sample scene, cover brief, publishing checklist",
        tools: ["plan_book", "generate_asset_brief", "save_to_arcanea_vault"],
    },
    {
        id: "game",
        name: "Game Studio",
        route: "/games",
        outcome: "Game design doc, core loop, levels, asset kit, prototype handoff",
        tools: ["plan_game", "generate_quest", "export_project_context"],
    },
    {
        id: "music",
        name: "Music Studio",
        route: "/music-studio",
        outcome: "Artist lore, song brief, cover brief, visualizer, release pack",
        tools: ["plan_music_project", "generate_asset_brief", "get_workflow_recipe"],
    },
    {
        id: "cinema",
        name: "Cinema Studio",
        route: "/cinema-studio",
        outcome: "Scene plan, shot list, camera language, character references, render prompts",
        tools: ["plan_cinematic_scene", "generate_asset_brief", "export_project_context"],
    },
    {
        id: "marketing",
        name: "Marketing Studio",
        route: "/create#campaign",
        outcome: "Audience map, ad angles, launch assets, creator content pack",
        tools: ["get_workflow_recipe", "generate_asset_brief", "export_project_context"],
    },
    {
        id: "canvas",
        name: "Canvas",
        route: "/canvas",
        outcome: "Node workflow, chained studios, reusable production graph",
        tools: ["list_arcanea_studios", "get_workflow_recipe", "export_project_context"],
    },
    {
        id: "agent-os",
        name: "Agent OS",
        route: "/mcp",
        outcome: "MCP setup, tool recipes, repo context, Claude and Codex handoff",
        tools: ["list_arcanea_studios", "get_workflow_recipe", "export_project_context"],
    },
];
export const WORKFLOW_RECIPES = {
    book_to_publish: {
        name: "Book bible to publishable package",
        route: "/books/drafts",
        steps: ["world and audience premise", "book bible", "chapter spine", "sample chapter", "cover brief", "publishing checklist"],
        outputs: ["outline.md", "world-bible.json", "cover-brief.md", "publish-checklist.md"],
        recommendedTools: ["plan_book", "generate_asset_brief", "export_project_context"],
    },
    world_to_game: {
        name: "World bible to playable prototype brief",
        route: "/games",
        steps: ["world premise", "player promise", "core loop", "levels", "asset kit", "engine handoff"],
        outputs: ["game-design-doc.md", "prototype-plan.json", "asset-list.md", "agent-handoff.md"],
        recommendedTools: ["plan_world", "plan_game", "export_project_context"],
    },
    artist_release: {
        name: "Artist lore to release asset pack",
        route: "/music-studio",
        steps: ["artist identity", "song brief", "cover direction", "visualizer plan", "release copy"],
        outputs: ["artist-bible.md", "song-brief.md", "album-art-brief.md", "visualizer-brief.md"],
        recommendedTools: ["plan_music_project", "generate_asset_brief", "get_workflow_recipe"],
    },
    cinematic_trailer: {
        name: "World or product to cinematic trailer",
        route: "/cinema-studio",
        steps: ["scene intent", "shot list", "reference assets", "render prompts", "edit notes"],
        outputs: ["shot-list.md", "camera-language.md", "render-prompts.md", "edit-notes.md"],
        recommendedTools: ["plan_cinematic_scene", "generate_asset_brief", "export_project_context"],
    },
    campaign_pack: {
        name: "Product or world to campaign content pack",
        route: "/create#campaign",
        steps: ["offer", "audience", "angles", "creative matrix", "distribution checklist"],
        outputs: ["campaign-brief.md", "ad-angles.json", "content-pack.md", "publish-plan.md"],
        recommendedTools: ["generate_asset_brief", "export_project_context"],
    },
};
export function planWorld(args) {
    const packet = basePacket("world", args.idea, args.audience);
    return json({
        ...packet,
        tone: args.tone || "mythic, usable, and internally consistent",
        scope: args.scope || "studio bible",
        studios: ["World Studio", "Canvas", "Agent OS"],
        deliverables: [
            "one-page premise",
            "laws of the world",
            "factions and tensions",
            "locations and travel logic",
            "character roster seeds",
            "visual and audio palette",
            "MCP-ready context packet",
        ],
        nextActions: ["generate core factions", "create 3 locations", "define conflict engine", "export to Claude or Codex"],
    });
}
export function planBook(args) {
    const packet = basePacket("book", args.idea, args.audience);
    return json({
        ...packet,
        format: args.format || "novel, serial, or nonfiction guide",
        voice: args.voice || "clear, cinematic, emotionally specific",
        studios: ["Book Studio", "World Studio", "Cinema Studio"],
        deliverables: [
            "reader promise",
            "book bible",
            "chapter spine",
            "sample scene or essay",
            "cover and launch visual brief",
            "publishing checklist",
        ],
        nextActions: ["draft chapter architecture", "lock point of view", "generate cover brief", "save to vault"],
    });
}
export function planGame(args) {
    const packet = basePacket("game", args.idea, args.audience);
    return json({
        ...packet,
        engine: args.engine || "browser prototype first, exportable to Godot, Unity, Roblox, or Unreal",
        playStyle: args.playStyle || "clear core loop with small playable slice",
        studios: ["Game Studio", "World Studio", "Canvas", "Agent OS"],
        deliverables: [
            "player promise",
            "core loop",
            "mechanics and progression",
            "level or scene list",
            "asset kit",
            "prototype implementation checklist",
        ],
        nextActions: ["define win condition", "map first level", "generate asset list", "export Codex handoff"],
    });
}
export function planMusicProject(args) {
    const packet = basePacket("music", args.idea, args.audience);
    return json({
        ...packet,
        genre: args.genre || "artist-defined hybrid",
        releaseType: args.releaseType || "single, EP, album, or AI artist launch",
        studios: ["Music Studio", "Cinema Studio", "Marketing Studio"],
        deliverables: [
            "artist identity",
            "song or album brief",
            "lyric and sonic motifs",
            "cover art direction",
            "visualizer or trailer plan",
            "release copy",
        ],
        nextActions: ["name the artist world", "write song brief", "create cover prompt", "plan visualizer"],
    });
}
export function planCinematicScene(args) {
    const packet = basePacket("cinema", args.idea, args.audience);
    return json({
        ...packet,
        duration: args.duration || "10-30 seconds",
        format: args.format || "trailer, scene, pitch animatic, or social video",
        studios: ["Cinema Studio", "World Studio", "Music Studio"],
        deliverables: [
            "scene intent",
            "shot list",
            "camera and lens language",
            "character and location references",
            "audio direction",
            "render-ready prompts",
        ],
        nextActions: ["choose hook frame", "define 4 shots", "generate asset brief", "export render packet"],
    });
}
export function generateAssetBrief(args) {
    return json({
        kind: args.kind,
        subject: args.subject,
        style: args.style || "Arcanea luxury dark fantasy, cinematic, precise, non-generic",
        aspectRatio: args.aspectRatio || "16:9 for scenes, 1:1 for avatars, 2:3 for covers",
        references: args.references || [],
        prompt: [
            `Create ${args.kind} for: ${args.subject}.`,
            `Style: ${args.style || "Arcanea luxury dark fantasy, cinematic, precise, non-generic"}.`,
            "Prioritize readable composition, distinctive silhouette, coherent palette, and reusable identity.",
            "Avoid generic fantasy, flat vector art, muddy contrast, and illegible typography.",
        ].join(" "),
        productionNotes: ["preflight cost for premium media", "save job ids or asset urls", "store final brief in vault"],
    });
}
export function exportProjectContext(args) {
    const targetAgent = args.targetAgent || "generic";
    return json({
        projectName: args.projectName,
        targetAgent,
        goal: args.goal,
        contextPacket: {
            mission: args.goal,
            assets: args.assets || [],
            constraints: args.constraints || ["preserve creator IP", "keep outputs portable", "avoid live support promises"],
            recommendedFirstPrompt: `You are helping build ${args.projectName}. Goal: ${args.goal}. Use Arcanea MCP recipes, keep outputs structured, and return file-ready artifacts.`,
            acceptanceCriteria: ["clear deliverables", "portable markdown/json output", "next action list", "no hidden vendor lock-in"],
        },
    });
}
export function listArcaneaStudios() {
    return json({ studios: ARC_STUDIOS });
}
export function getWorkflowRecipe(args) {
    return json({
        recipe: args.recipe,
        ...WORKFLOW_RECIPES[args.recipe],
    });
}
//# sourceMappingURL=production-planning.js.map