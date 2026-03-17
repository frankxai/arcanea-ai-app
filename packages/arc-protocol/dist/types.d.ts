/**
 * Arc Protocol — Type Definitions
 *
 * The creation genome format for AI-human co-creation.
 */
export type ArcType = 'character' | 'world' | 'location' | 'creature' | 'artifact' | 'scene' | 'story' | 'image' | 'music' | 'video' | 'code' | 'agent' | 'system' | 'collection';
export type ArcStage = 'potential' | 'manifestation' | 'experience' | 'dissolution' | 'evolved';
export type Relation = 'inhabits' | 'creates' | 'opposes' | 'evolves_from' | 'soundtrack' | 'illustrates' | 'teaches' | 'forks' | 'collection_of' | 'inspired_by';
export type Palette = 'forge' | 'tide' | 'root' | 'drift' | 'void';
export type NeaType = 'badge' | 'certificate' | 'collectible' | 'license';
export interface ArcAPL {
    spark: string;
    palette?: Palette;
    palette_secondary?: Palette;
    sharpen?: string[];
}
export interface ArcHistoryEntry {
    stage: ArcStage;
    at: string;
    input?: string;
    model?: string;
    output?: string;
    output_hash?: string;
    quality?: number;
    note?: string;
}
export interface ArcBond {
    target: string;
    relation: Relation;
    note?: string;
}
export interface ArcAgent {
    context: string;
    instructions?: string;
    next_step?: string;
    constraints?: string[];
}
export interface ArcProvenance {
    models_used?: Array<{
        id: string;
        role: string;
    }>;
    license?: string;
    chain?: {
        network: string;
        contract?: string;
        token_id?: string;
    };
}
export interface Arc {
    arc: '1.0';
    id: string;
    type: ArcType;
    stage: ArcStage;
    created: string;
    updated?: string;
    creator: string;
    apl?: ArcAPL;
    history?: ArcHistoryEntry[];
    bonds?: ArcBond[];
    agent?: ArcAgent;
    provenance?: ArcProvenance;
    tags?: string[];
    gate?: number;
    element?: string;
    body?: string;
}
export interface Nea {
    nea: '1.0';
    id: string;
    type: NeaType;
    name: string;
    description?: string;
    image?: string;
    criteria?: {
        description: string;
        arcs_required?: number;
        palette?: Palette;
        min_quality?: number;
        gate?: number;
    };
    holder?: {
        id: string;
        earned: string;
        arcs?: string[];
    };
    grants?: Array<{
        feature?: string;
        unlock?: string;
    }>;
}
