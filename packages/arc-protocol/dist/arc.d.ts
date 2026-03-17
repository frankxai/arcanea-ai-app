/**
 * Arc Protocol — Core Operations
 *
 * Create, parse, validate, advance, and bond .arc files.
 * Works in Node.js, browser, and any AI agent runtime.
 */
import type { Arc, ArcType, ArcHistoryEntry, ArcBond, Palette } from './types';
export declare function createId(prefix?: 'arc' | 'nea'): string;
export interface CreateArcOptions {
    type: ArcType;
    creator: string;
    spark?: string;
    palette?: Palette;
    sharpen?: string[];
    tags?: string[];
    gate?: number;
    element?: string;
}
export declare function createArc(options: CreateArcOptions): Arc;
export declare function advanceStage(arc: Arc, entry: Omit<ArcHistoryEntry, 'stage'>): Arc;
export declare function bond(arc: Arc, newBond: ArcBond): Arc;
/**
 * Generate a prompt context block from an arc file.
 * Any AI agent can use this to continue the creation.
 */
export declare function toAgentContext(arc: Arc): string;
/**
 * Serialize an Arc to YAML frontmatter + markdown body
 */
export declare function serialize(arc: Arc): string;
/**
 * Parse a .arc file string into an Arc object
 */
export declare function parse(content: string): Arc;
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
export declare function validate(arc: Arc): ValidationResult;
