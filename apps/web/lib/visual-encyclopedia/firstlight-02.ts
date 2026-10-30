import characterProjection from "@/data/firstlight-02/characters.json";
import assetProjection from "@/data/firstlight-02/assets.json";

export type FirstlightCategory = "companion" | "guardian" | "opponent";
export type FirstlightAssetKind = "sheet" | "hero";

export interface FirstlightCharacter {
  id: string;
  slug: string;
  name: string;
  title: string;
  category: FirstlightCategory;
  tagline: string;
  description: string;
  emotional_core: string;
  world_function: string;
  story: {
    vow: string;
    cost: string;
    limitation: string;
    flaw: string;
    affection_detail: string;
    hook: string;
  };
  visual: {
    silhouette: string;
    palette: string[];
    materials: string[];
    scale_m: number;
    habitat: string;
    gesture: string;
  };
  teamwork: {
    role: string;
    metaphor: string;
    acceptance_criterion: string;
  };
  asset_ids: string[];
}

export interface FirstlightAsset {
  id: string;
  character_id: string;
  kind: FirstlightAssetKind;
  url: string | null;
  width: number;
  height: number;
  sha256: string;
  prompt: string;
  alt: string;
  availability: "registered" | "pending";
  continuity_notes?: string[];
  master_sha256?: string;
  derived_from_sha256?: string;
  exhibition_release?: {
    state: string;
    source_sha256: string;
    reviewer: string;
    authorization_ref: string;
  };
}

export const FIRSTLIGHT_CHARACTERS =
  characterProjection.characters as FirstlightCharacter[];
export const FIRSTLIGHT_ASSETS = assetProjection.assets as FirstlightAsset[];
export const FIRSTLIGHT_SOURCE = characterProjection.authority;

export function firstlightAsset(
  character: FirstlightCharacter,
  kind: FirstlightAssetKind,
): FirstlightAsset | undefined {
  return FIRSTLIGHT_ASSETS.find(
    (asset) => asset.character_id === character.id && asset.kind === kind,
  );
}

export function publishedFirstlightAsset(
  character: FirstlightCharacter,
  kind: FirstlightAssetKind,
): FirstlightAsset | undefined {
  const asset = firstlightAsset(character, kind);
  if (
    !asset ||
    asset.availability !== "registered" ||
    !asset.url ||
    !/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(
      asset.url,
    ) ||
    !/^[a-f0-9]{64}$/.test(asset.sha256) ||
    !asset.master_sha256 ||
    !/^[a-f0-9]{64}$/.test(asset.master_sha256) ||
    asset.derived_from_sha256 !== asset.master_sha256 ||
    asset.exhibition_release?.state !== "approved" ||
    asset.exhibition_release?.source_sha256 !== asset.master_sha256 ||
    !asset.exhibition_release.reviewer ||
    !asset.exhibition_release.authorization_ref
  )
    return undefined;
  return asset;
}
