const DUNGEON_ATLAS_MODELS = [
    "Codex Image Generation",
    "OpenAI gpt-image-2",
    "Grok Imagine",
    "Gemini Image",
    "Flux",
];
const DUNGEON_RIGHTS_NOTES = {
    original_arcanea: "Original Arcanea dungeon. Public prompts can use the full Arcanea variant.",
    public_domain: "Public-domain source. Keep attribution and avoid modern franchise styling.",
    open_rules: "Open rules source. Preserve license attribution and do not copy protected setting text.",
    licensed: "Licensed source. Publish or generate only inside the licensed usage boundary.",
    factual_reference_only: "Protected source reference. Store factual metadata and generate only the original Arcanea variant.",
    blocked: "Blocked for generation or publication until reviewed.",
};
const DUNGEON_POLICY_NOTES = {
    allowed_original_variant: "Allowed as an original Arcanea Resonance Vault variant.",
    prompt_only: "Prompt is safe to display; image generation requires operator review.",
    licensed_only: "Requires a license before image generation or publication.",
    blocked: "Do not generate images or public prompt packs.",
};
export function canGenerateDungeonArt(entry) {
    return (entry.rightsTier !== "blocked" &&
        entry.arcaneaVariant.generationPolicy !== "blocked" &&
        entry.arcaneaVariant.generationPolicy !== "licensed_only");
}
export function getDungeonAtlasSafetyNotes(entry) {
    const notes = [
        DUNGEON_RIGHTS_NOTES[entry.rightsTier],
        DUNGEON_POLICY_NOTES[entry.arcaneaVariant.generationPolicy],
        "Do not upload or imitate official franchise maps, logos, UI, encounter text, monster likenesses, or named boss designs.",
    ];
    if (entry.source.referenceMode === "factual_reference") {
        notes.push(`Reference source is ${entry.source.sourceWork}; keep source names and citations in metadata, not in generated artwork prompts.`);
    }
    if (entry.source.referenceMode === "open_rules_reference") {
        notes.push("Use open mechanics as inspiration; keep Arcanea lore, names, maps, and prose original.");
    }
    return notes;
}
export function dungeonAtlasEntryToPromptPack(entry) {
    const variant = entry.arcaneaVariant;
    const sourceBoundary = entry.source.referenceMode === "factual_reference"
        ? "transformed from protected-source dungeon pattern research into a distinct original Arcanea vault"
        : entry.source.referenceMode === "open_rules_reference"
            ? "structured with open-rule dungeon craft, expressed through original Arcanea lore"
            : `drawing from ${entry.source.referenceMode.replaceAll("_", " ")} material`;
    const shared = [
        "Original Arcanea Resonance Vault",
        "not a replica of any existing anime, game, tabletop module, comic, or book location",
        `${variant.name}, ${variant.vaultType}`,
        sourceBoundary,
        `Arcanea world context: ${variant.arcaneaWorld}`,
        `Gate alignment: ${variant.gateAlignment.join(", ")}`,
        `rank band: ${variant.rankBand}`,
        `vault laws: ${variant.laws.join(", ")}`,
        `costs: ${variant.costs.join(", ")}`,
        `prompt focus: ${variant.promptFocus}`,
        "cinematic mythic interface, readable spatial storytelling, premium restraint",
    ];
    const keyArtPrompt = [
        ...shared,
        `party size ${variant.partySize.min}-${variant.partySize.max}`,
        `time pressure: ${variant.timer.resonanceWindowMinutes} minute resonance window`,
        `hazards: ${variant.hazards.join(", ")}`,
        "wide establishing shot, no text, no watermark, no UI",
    ].join(", ");
    const bossPrompt = [
        ...shared,
        `boss: ${variant.boss.name}, ${variant.boss.archetype}`,
        `boss phases: ${variant.boss.phases.map((phase) => phase.name).join(", ")}`,
        "original boss silhouette, climactic confrontation, no franchise likeness",
    ].join(", ");
    const roomPrompt = [
        ...shared,
        `rooms: ${variant.rooms.map((room) => room.label).join(", ")}`,
        "clear path structure, environmental storytelling, navigable dungeon chamber",
    ].join(", ");
    const materialPrompt = [
        ...shared,
        `materials: ${variant.materials.map((material) => material.name).join(", ")}`,
        "artifact sheet, material swatches, crafted lore objects, no labels baked into image",
    ].join(", ");
    const negativePrompt = [
        "official franchise art",
        "recognizable copyrighted location",
        "copied map layout",
        "named franchise boss",
        "logo",
        "trademark symbol",
        "text",
        "watermark",
        "generic purple fantasy portal",
        "unreadable ornamental clutter",
        ...variant.negativeConstraints,
    ].join(", ");
    return {
        keyArtPrompt,
        bossPrompt,
        roomPrompt,
        materialPrompt,
        negativePrompt,
        aspectRatio: "16:9",
        suggestedModels: [...DUNGEON_ATLAS_MODELS],
        safetyNotes: getDungeonAtlasSafetyNotes(entry),
        tags: [
            "dungeon-atlas",
            "resonance-vault",
            variant.rankBand,
            entry.rightsTier,
            entry.source.referenceMode,
            ...variant.gateAlignment.map((gate) => `gate-${gate}`),
            ...entry.taxonomy.slice(0, 4),
        ],
    };
}
export function getDungeonMinutesRemaining(entry, elapsedMinutes) {
    return Math.max(0, entry.arcaneaVariant.timer.resonanceWindowMinutes - elapsedMinutes);
}
export function getDungeonCollapseStage(entry, elapsedMinutes) {
    return [...entry.arcaneaVariant.timer.collapseStages]
        .sort((a, b) => a.startsAtMinute - b.startsAtMinute)
        .filter((stage) => elapsedMinutes >= stage.startsAtMinute)
        .at(-1);
}
export function canChallengeDungeonBoss(entry, completedObjectiveIds) {
    const completed = new Set(completedObjectiveIds);
    return entry.arcaneaVariant.rooms
        .filter((room) => room.required)
        .every((room) => completed.has(room.id));
}
export function evaluateDungeonRun(entry, state) {
    const minutesRemaining = getDungeonMinutesRemaining(entry, state.elapsedMinutes);
    const activeCollapseStage = getDungeonCollapseStage(entry, state.elapsedMinutes);
    const bossUnlocked = canChallengeDungeonBoss(entry, state.completedObjectiveIds);
    const completed = new Set(state.completedObjectiveIds);
    const completedRooms = entry.arcaneaVariant.rooms.filter((room) => completed.has(room.id));
    const optionalRooms = entry.arcaneaVariant.rooms.filter((room) => !room.required);
    const completedOptionalRooms = optionalRooms.filter((room) => completed.has(room.id));
    const rewardsUnlocked = state.bossDefeated
        ? entry.arcaneaVariant.materials
        : entry.arcaneaVariant.materials.slice(0, Math.max(1, completedOptionalRooms.length));
    const notes = [];
    if (!bossUnlocked) {
        notes.push(entry.arcaneaVariant.boss.unlockCondition);
    }
    if (activeCollapseStage) {
        notes.push(`${activeCollapseStage.name}: ${activeCollapseStage.consequence}`);
    }
    if (state.partyIntegrity !== undefined && state.partyIntegrity < 40) {
        notes.push("Party integrity is below 40%; extraction or support is recommended.");
    }
    let verdict = "in_progress";
    if (state.bossDefeated && bossUnlocked && minutesRemaining > 0) {
        verdict = "victory";
        notes.push(entry.arcaneaVariant.boss.victoryCondition);
    }
    else if (minutesRemaining === 0 && state.bossDefeated && bossUnlocked) {
        verdict = "partial_extract";
        notes.push(entry.arcaneaVariant.timer.bossDeadlineBehavior);
    }
    else if (minutesRemaining === 0) {
        verdict = "collapse_failure";
        notes.push(entry.arcaneaVariant.timer.bossDeadlineBehavior);
    }
    else if (state.bossAttempted && !bossUnlocked) {
        verdict = "boss_locked";
    }
    const objectiveXp = completedRooms.reduce((total, room) => total + Math.max(25, room.estimatedMinutes * 10), 0);
    const bossXp = verdict === "victory" ? 500 + entry.arcaneaVariant.boss.phases.length * 75 : 0;
    const collapsePenalty = verdict === "collapse_failure" ? 0.5 : 1;
    return {
        verdict,
        minutesRemaining,
        bossUnlocked,
        activeCollapseStage,
        rewardsUnlocked,
        xp: Math.round((objectiveXp + bossXp) * collapsePenalty),
        notes,
    };
}
//# sourceMappingURL=dungeons.js.map