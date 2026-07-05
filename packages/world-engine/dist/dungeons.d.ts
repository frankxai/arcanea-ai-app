import type { DungeonAtlasEntry, DungeonCollapseStage, DungeonPromptPack, DungeonRunResult, DungeonRunState } from "./types.js";
export declare function canGenerateDungeonArt(entry: DungeonAtlasEntry): boolean;
export declare function getDungeonAtlasSafetyNotes(entry: DungeonAtlasEntry): string[];
export declare function dungeonAtlasEntryToPromptPack(entry: DungeonAtlasEntry): DungeonPromptPack;
export declare function getDungeonMinutesRemaining(entry: DungeonAtlasEntry, elapsedMinutes: number): number;
export declare function getDungeonCollapseStage(entry: DungeonAtlasEntry, elapsedMinutes: number): DungeonCollapseStage | undefined;
export declare function canChallengeDungeonBoss(entry: DungeonAtlasEntry, completedObjectiveIds: string[]): boolean;
export declare function evaluateDungeonRun(entry: DungeonAtlasEntry, state: DungeonRunState): DungeonRunResult;
//# sourceMappingURL=dungeons.d.ts.map