/**
 * Library Search Tool
 * Searches the Arcanea Library (book/ directory) by keyword.
 * Returns matching texts with collection, title, and relevant excerpts.
 */
export interface LibraryMatch {
    collection: string;
    title: string;
    file: string;
    excerpt: string;
    relevanceScore: number;
}
/**
 * Search the Arcanea Library by keyword.
 *
 * @param query  - Search terms (space-separated)
 * @param limit  - Maximum results to return (1–20)
 * @returns      - MCP content envelope
 */
export declare function searchLibrary(query: string, limit?: number): Promise<{
    content: Array<{
        type: "text";
        text: string;
    }>;
}>;
//# sourceMappingURL=library-search.d.ts.map