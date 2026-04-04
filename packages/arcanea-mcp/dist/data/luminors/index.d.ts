export interface LuminorProfile {
    slug: string;
    name: string;
    title: string;
    domain: string;
    element: string;
    personality: {
        voice: string;
        approach: string;
        strengths: string[];
        style: string;
    };
    guidance: {
        bestFor: string[];
        practices: string[];
        quotes: string[];
    };
    appearance: string;
}
export declare const luminors: Record<string, LuminorProfile>;
//# sourceMappingURL=index.d.ts.map