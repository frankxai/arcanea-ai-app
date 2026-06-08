// Proof rail — onchain underneath, invisible on top. Onchain stores PROOFS, not the world.
// Real chains (Solana/Metaplex via Helius, EVM via thirdweb) implement the same two adapters.

import { createHash } from "node:crypto";
import { readWorld, writeManifest } from "./fs-world.mjs";
import { contentHash } from "./contenthash.mjs";
import { SCHEMA_VERSION } from "./manifest.mjs";

/** The onchain record shape (see WORLD_REPO_STANDARD.md §5). */
export function computeProof({ manifest, hash, chain, repoPointer, wallet, now }) {
  return {
    worldId: manifest.id,
    creatorWallet: wallet,
    contentHash: hash,
    schemaVersion: SCHEMA_VERSION,
    licensePointer: manifest.license?.pointer || "licenses/LICENSE.md",
    royaltyPolicy: manifest.royalty?.policy || "licenses/royalty.json",
    repoOrBundlePointer: repoPointer || manifest.repoUrl || "",
    timestamp: now,
    chain,
  };
}

/**
 * A WalletAdapter creates/returns an embedded wallet from a login identity (Privy/Dynamic).
 * A MintAdapter writes the proof to a chain and returns its reference.
 * mockChain() implements both deterministically so the flow runs with no chain or keys.
 */
export function mockChain(chain = "solana", standard = "metaplex-core") {
  return {
    chain,
    async getOrCreateWallet(handle) {
      const h = createHash("sha256").update("wallet:" + handle).digest("hex");
      return { pubkey: "So1" + h.slice(0, 41) }; // solana-shaped, deterministic
    },
    async mint(proof) {
      const ref = createHash("sha256").update(proof.contentHash + proof.worldId + chain).digest("hex");
      return { ref, standard };
    },
  };
}

/**
 * The "Claim World Proof" button, server-side.
 * @param {object} args
 * @param {string} args.dir
 * @param {object} [args.adapter]  wallet+mint adapter (defaults to mockChain())
 * @param {string} [args.chain]
 * @param {string} [args.repoPointer]
 * @param {string} [args.now]      ISO timestamp (inject for determinism; defaults to wall clock)
 */
export async function claimWorldProof({ dir, adapter = mockChain(), chain, repoPointer, now }) {
  const world = await readWorld(dir);
  const { manifest, files } = world;
  const hash = contentHash(files, manifest);
  const targetChain = chain || adapter.chain || "solana";

  const wallet = await adapter.getOrCreateWallet(manifest.creator?.handle || "anon");
  manifest.creator = { ...(manifest.creator || {}), wallet: wallet.pubkey };

  const proof = computeProof({ manifest, hash, chain: targetChain, repoPointer, wallet: wallet.pubkey, now: now || new Date().toISOString() });
  const minted = await adapter.mint(proof);

  const entry = {
    contentHash: hash,
    chain: targetChain,
    standard: minted.standard,
    ref: minted.ref,
    schemaVersion: SCHEMA_VERSION,
    timestamp: proof.timestamp,
  };
  manifest.provenance = [...(manifest.provenance || []), entry];
  await writeManifest(dir, manifest);

  return { entry, contentHash: hash, wallet: wallet.pubkey, manifest };
}
