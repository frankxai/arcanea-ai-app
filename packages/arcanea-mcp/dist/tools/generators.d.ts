export declare function pick<T>(arr: readonly T[] | T[]): T;
type ToolResult = {
    content: Array<{
        type: string;
        text: string;
    }>;
};
export declare function generateCharacter(options: {
    archetype?: string;
    primaryElement?: string;
    gatesOpen?: number;
    house?: string;
    nameGender?: "masculine" | "feminine" | "neutral";
}): Promise<ToolResult>;
export declare function generateMagicAbility(options: {
    element: string;
    gateLevel: number;
    purpose?: string;
}): Promise<ToolResult>;
export declare function generateLocation(options: {
    type?: string;
    dominantElement?: string;
    alignment?: "light" | "dark" | "balanced";
}): Promise<ToolResult>;
export declare function generateCreature(options: {
    element?: string;
    size?: "tiny" | "small" | "medium" | "large" | "massive";
    temperament?: "hostile" | "neutral" | "friendly" | "sacred";
}): Promise<ToolResult>;
export declare function generateArtifact(options: {
    type?: string;
    element?: string;
    power?: "minor" | "moderate" | "major" | "legendary";
}): Promise<ToolResult>;
export declare function generateName(options: {
    element?: string;
    gender?: "masculine" | "feminine" | "neutral";
    type?: "character" | "place" | "artifact" | "creature";
    count?: number;
}): Promise<ToolResult>;
export declare function generateStoryPrompt(options: {
    theme?: string;
    gate?: number;
    includeConflict?: boolean;
}): Promise<ToolResult>;
export {};
//# sourceMappingURL=generators.d.ts.map