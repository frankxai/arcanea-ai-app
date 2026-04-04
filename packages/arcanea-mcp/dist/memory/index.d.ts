export interface CreativeSession {
    id: string;
    startedAt: string | Date;
    gatesExplored: number[];
    luminorsConsulted: string[];
    creaturesEncountered: string[];
    creations: CreationRef[];
    preferences: {
        favoriteElement?: string;
        preferredHouse?: string;
        creativeStyle?: string;
    };
}
export interface CreationRef {
    id: string;
    type: "character" | "location" | "creature" | "artifact" | "magic" | "story";
    name: string;
    element?: string;
    gate?: number;
    createdAt?: string | Date;
    summary: string;
}
export interface CreativeJourney {
    userId: string;
    gatesOpened: number[];
    totalCreations: number;
    recurringBlocks: string[];
    defeatedBlocks: string[];
    milestones: Milestone[];
    wisdomReceived: string[];
}
export interface Milestone {
    name: string;
    description: string;
    achievedAt: Date;
    gate?: number;
    luminor?: string;
}
export declare function getMemoryFilePath(): string;
export declare function listSessions(): string[];
export declare function deleteSession(sessionId: string): boolean;
export declare function getOrCreateSession(sessionId: string): CreativeSession;
export declare function updateSession(sessionId: string, updates: Partial<CreativeSession>): void;
export declare function recordGateExplored(sessionId: string, gate: number): void;
export declare function recordLuminorConsulted(sessionId: string, luminor: string): void;
export declare function recordCreatureEncountered(sessionId: string, creature: string): void;
export declare function recordCreation(sessionId: string, creation: CreationRef): void;
export declare function getSessionSummary(sessionId: string): {
    gatesExplored: number;
    luminorsConsulted: number;
    creaturesDefeated: number;
    creationsGenerated: number;
    duration: number;
};
export declare function checkMilestones(sessionId: string): Milestone[];
//# sourceMappingURL=index.d.ts.map