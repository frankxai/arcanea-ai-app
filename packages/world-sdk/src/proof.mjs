// Local tagged proposals. Claims await an accepted profile-aware shared contract.

import { createHash } from "node:crypto";
import { CONTENT_HASH_PROFILE } from "./contenthash.mjs";
import { SCHEMA_VERSION } from "./manifest.mjs";

/** Local tagged proposal only; the profile-aware shared claim contract is pending. */
export function computeProof({
  manifest,
  hash,
  chain,
  repoPointer,
  wallet,
  now,
}) {
  return {
    worldId: manifest.id,
    creatorWallet: wallet,
    contentHash: hash,
    hashProfile: CONTENT_HASH_PROFILE,
    schemaVersion: SCHEMA_VERSION,
    ...(manifest.license?.pointer
      ? { licensePointer: manifest.license.pointer }
      : {}),
    ...(manifest.royalty?.policy
      ? { royaltyPolicy: manifest.royalty.policy }
      : {}),
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
      const h = createHash("sha256")
        .update("wallet:" + handle)
        .digest("hex");
      return { pubkey: "So1" + h.slice(0, 41) }; // solana-shaped, deterministic
    },
    async mint(proof) {
      const ref = createHash("sha256")
        .update(proof.contentHash + proof.worldId + chain)
        .digest("hex");
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
export async function claimWorldProof() {
  throw Object.assign(
    new Error(
      "Declared-source hashes require an accepted profile-aware proof contract before adapters or provenance writes.",
    ),
    { code: "WORLD_HASH_PROFILE_REQUIRES_REVIEW" },
  );
}
