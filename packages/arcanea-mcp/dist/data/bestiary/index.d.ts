export interface BestiaryCreature {
    slug: string;
    name: string;
    type: string;
    description: string;
    symptoms: string[];
    gateAffected: number;
    remedies: string[];
    affirmation: string;
}
export declare const bestiary: Record<string, BestiaryCreature>;
//# sourceMappingURL=index.d.ts.map