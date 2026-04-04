/**
 * Library Search Tool
 * Searches the Arcanea Library (book/ directory) by keyword.
 * Returns matching texts with collection, title, and relevant excerpts.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
// Resolve the book/ directory relative to the package root
// packages/arcanea-mcp/src/tools/ → ../../../../book/
const BOOK_DIR = join(__dirname, "..", "..", "..", "..", "book");
/**
 * Scan a single markdown file and return scored excerpts.
 */
function scoreFile(filePath, keywords, maxExcerptLength = 300) {
    let raw;
    try {
        raw = readFileSync(filePath, "utf-8");
    }
    catch {
        return null;
    }
    const lower = raw.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
        const re = new RegExp(kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
        const matches = [...lower.matchAll(re)];
        score += matches.length;
    }
    if (score === 0)
        return null;
    // Find the best excerpt — the paragraph containing the first keyword hit
    const firstKw = keywords[0].toLowerCase();
    const hitIndex = lower.indexOf(firstKw);
    if (hitIndex === -1)
        return null;
    // Walk backwards to a paragraph start
    let start = raw.lastIndexOf("\n\n", hitIndex);
    if (start === -1)
        start = 0;
    else
        start += 2;
    // Walk forwards to a paragraph end
    let end = raw.indexOf("\n\n", hitIndex);
    if (end === -1)
        end = raw.length;
    let excerpt = raw.slice(start, end).replace(/\n+/g, " ").trim();
    if (excerpt.length > maxExcerptLength) {
        excerpt = excerpt.slice(0, maxExcerptLength).trimEnd() + "...";
    }
    return { excerpt, score };
}
/**
 * Derive a human-readable title from a markdown file.
 * Reads the first H1/H2 heading; falls back to filename.
 */
function getTitleFromFile(filePath, fallbackName) {
    try {
        const content = readFileSync(filePath, "utf-8");
        const headingMatch = content.match(/^#{1,2}\s+(.+)/m);
        if (headingMatch)
            return headingMatch[1].trim();
    }
    catch {
        // Ignore
    }
    return fallbackName.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "");
}
/**
 * Recursively list all markdown files under a directory.
 */
function listMarkdownFiles(dir) {
    const files = [];
    if (!existsSync(dir))
        return files;
    let entries;
    try {
        entries = readdirSync(dir, { withFileTypes: false });
    }
    catch {
        return files;
    }
    for (const entry of entries) {
        const fullPath = join(dir, entry);
        // Recurse into subdirectories
        try {
            const stat = readdirSync(fullPath);
            // It's a directory
            files.push(...listMarkdownFiles(fullPath));
        }
        catch {
            // It's a file
            if (entry.endsWith(".md") && entry !== "README.md") {
                files.push(fullPath);
            }
        }
    }
    return files;
}
/**
 * Get a human-readable collection name from a directory path.
 */
function getCollectionName(filePath) {
    // The collection is the first subdirectory under book/
    const relative = filePath.slice(BOOK_DIR.length + 1);
    const parts = relative.split(/[/\\]/);
    return parts[0].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
/**
 * Search the Arcanea Library by keyword.
 *
 * @param query  - Search terms (space-separated)
 * @param limit  - Maximum results to return (1–20)
 * @returns      - MCP content envelope
 */
export async function searchLibrary(query, limit = 5) {
    const safeLimit = Math.min(Math.max(1, limit), 20);
    const keywords = query
        .split(/\s+/)
        .map(k => k.trim())
        .filter(k => k.length >= 2);
    if (keywords.length === 0) {
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        error: "Query must contain at least one word of two or more characters.",
                        query,
                        results: [],
                    }),
                }],
        };
    }
    if (!existsSync(BOOK_DIR)) {
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        error: "Library (book/) directory not found.",
                        query,
                        results: [],
                        bookDir: BOOK_DIR,
                    }),
                }],
        };
    }
    // Collect all markdown files
    const allFiles = listMarkdownFiles(BOOK_DIR);
    // Score every file
    const scored = [];
    for (const filePath of allFiles) {
        const result = scoreFile(filePath, keywords);
        if (!result)
            continue;
        const fileName = filePath.split(/[/\\]/).pop() ?? filePath;
        scored.push({
            collection: getCollectionName(filePath),
            title: getTitleFromFile(filePath, fileName),
            file: filePath.slice(BOOK_DIR.length + 1).replace(/\\/g, "/"),
            excerpt: result.excerpt,
            relevanceScore: result.score,
            _score: result.score,
        });
    }
    // Sort by score descending, take top N
    scored.sort((a, b) => b._score - a._score);
    const top = scored.slice(0, safeLimit);
    // Remove internal _score from output
    const results = top.map(({ _score, ...rest }) => rest);
    return {
        content: [{
                type: "text",
                text: JSON.stringify({
                    query,
                    keywords,
                    totalMatches: scored.length,
                    returned: results.length,
                    results,
                    message: results.length > 0
                        ? `Found ${scored.length} matching text(s) in the Arcanea Library. Showing top ${results.length}.`
                        : "No matching texts found. Try broader search terms.",
                }, null, 2),
            }],
    };
}
//# sourceMappingURL=library-search.js.map