export declare function conveneCouncil(leadLuminorSlug: string, supportingSlugs: string[], topic: string): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
export declare function luminorDebate(luminor1Slug: string, luminor2Slug: string, question: string): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=council.d.ts.map