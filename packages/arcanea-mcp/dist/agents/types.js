// Arcanea Agent System - Type Definitions
// Inspired by oh-my-opencode's orchestration patterns
export var WorldMaturity;
(function (WorldMaturity) {
    WorldMaturity["VIRGIN"] = "virgin";
    WorldMaturity["EMERGING"] = "emerging";
    WorldMaturity["DEVELOPING"] = "developing";
    WorldMaturity["RICH"] = "rich";
    WorldMaturity["EPIC"] = "epic";
})(WorldMaturity || (WorldMaturity = {}));
export const CREATIVE_SKILLS = [
    {
        name: "character_creation",
        triggers: ["create character", "generate character", "new character", "design character"],
        agent: "worldsmith",
        priority: 1,
    },
    {
        name: "creative_coaching",
        triggers: ["stuck", "blocked", "help me", "can't write", "overwhelmed", "perfectionism"],
        agent: "luminor-council",
        priority: 2,
    },
    {
        name: "world_exploration",
        triggers: ["explore", "find connections", "related to", "path between"],
        agent: "seer",
        priority: 1,
    },
    {
        name: "narrative_development",
        triggers: ["story", "narrative", "plot", "expand on", "write about"],
        agent: "scribe",
        priority: 1,
    },
    {
        name: "batch_generation",
        triggers: ["generate multiple", "batch", "create several", "populate"],
        agent: "worldsmith",
        priority: 2,
    },
];
// Match request to skill (skill-first blocking pattern)
export function matchCreativeSkill(request) {
    const lower = request.toLowerCase();
    const matches = CREATIVE_SKILLS
        .filter(skill => skill.triggers.some(trigger => lower.includes(trigger)))
        .sort((a, b) => b.priority - a.priority);
    return matches[0] || null;
}
//# sourceMappingURL=types.js.map