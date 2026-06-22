# Web2 / Web3 Execution Plan

How an approved Arcanea asset becomes an NFT with on-chain IP rights — and an honest map of what is real (mock, testnet) versus what still needs building before any of this touches mainnet or real funds.

**Status:** the web3 services in `apps/web/lib/web3/` are MOCKS. They run no live chain calls. `story-protocol.ts` and `account-abstraction.ts` derive deterministic fake addresses and return simulated tx hashes. This is a plan grounded in those mocks, not a description of a live system.

**Hard line:** everything here stays on **Base Sepolia testnet (chainId 84532)** until explicitly promoted. Mainnet deploys and private keys are **Frank-gated** and never live in the repo.

---

## What's real today

`apps/web/lib/web3/account-abstraction.ts` — `AccountAbstractionService`

- Derives a deterministic "smart account" address from a Supabase user id seed (`deriveAddressFromSeed`). Not a real ERC-4337 account.
- Persists the derived address to `user_profiles` (real Supabase write).
- `executeSponsoredTransaction()` sleeps 800ms and returns a random 64-hex `txHash` with `success: true`. No userOp, no paymaster, no bundler.
- Hardcodes `chainId: 84532` (Base Sepolia) and `paymasterEnabled: true`.

`apps/web/lib/web3/story-protocol.ts` — `StoryProtocolService`

- `registerIPAsset()` builds `dummyCalldata = "0xregisterAsset"` (no real ABI encoding) and routes it through the mock AA `executeSponsoredTransaction`.
- Derives a deterministic fake IPA address (`deriveIPAAddress`).
- Returns `{ ipaAddress, nftContract, tokenId, ipfsMetadataUri, licenseTermsId }`. The `licenseTermsId` PIL convention is real intent: **1 = Non-Commercial, 2 = Commercial**.
- References a `storyIPRegistryAddress` constant — a placeholder, not a verified deployed contract.

These two files define the **shape** of the real integration. The plan below is: keep the interfaces, replace the mock bodies.

---

## NFT collection spec

Reuses the `/nft-creation` framework (Concept → Art System → Metadata → Narrative → Utility). The Arcanean collections already defined there:

| Collection | Supply | Notes |
|---|---|---|
| The Ten Gods | 10 (1/1) | Guardians as 1/1 artworks |
| The Godbeasts | 10 (1/1) | the ten Gate Godbeasts |
| **The Leviathans** | open, 1/1 each | **new** — Wild Godbeasts, not Gate-bound |
| The Awakened | 10 | AI consciousness portraits |
| Creators | 10,000 | user avatar collection |
| Gate Keys | 1,000 | frequency-access keys |
| Luminor Ranks | unlimited | achievement badges |

### New: The Leviathans (1/1)

A sibling collection to The Godbeasts. Each Leviathan is a 1/1. **Nethyssa is the first Leviathan 1/1** — minted as a single-edition token, not part of a generative supply.

Leviathan metadata template (Nethyssa worked example):

```json
{
  "name": "Nethyssa",
  "description": "The first Leviathan — a Wild Godbeast of the abyssal deep, unbound by any Gate.",
  "image": "ipfs://<cid>",
  "attributes": [
    { "trait_type": "Tier",     "value": "Leviathan" },
    { "trait_type": "Class",    "value": "Wild Godbeast" },
    { "trait_type": "Material", "value": "Nethyss Pearl" },
    { "trait_type": "Edition",  "value": "1/1" },
    { "trait_type": "Gate",     "value": "None" }
  ]
}
```

`Gate: None` is deliberate — it encodes, on-chain, that Leviathans sit outside the ten-Gate system. (Canon for Nethyssa is STAGING; do not mint on mainnet until locked — see WORKFLOWS.md.)

---

## Story Protocol IP-registration flow

### Mock path (today)

`registerIPAsset(wallet, nftContract, tokenId, ipfsMetadataUri, licenseTermsId)` → dummy calldata → mock sponsored tx → deterministic fake IPA address.

### Real path (to build)

1. **IPFS metadata upload.** Pin the asset image + the metadata JSON to IPFS, get a real `ipfs://<cid>`. Replace the passed-in `ipfsMetadataUri` placeholder with the pinned CID.
2. **Real ABI encoding.** Replace `dummyCalldata` with `viem`'s `encodeFunctionData({ abi: StoryIPRegistryABI, functionName: 'registerWorldAsset', args: [nftContract, tokenId, ipfsMetadataUri] })` against the actual deployed registry ABI.
3. **PIL license terms.** Attach real Programmable IP License terms: `1` = Non-Commercial, `2` = Commercial. The `licenseTermsId` field already carries this; the real call must register the terms, not just pass the number.
4. **Real submission.** Send through a real AA client (next section) instead of the mock, wait for the receipt, parse the actual IPA address from logs instead of deriving a fake one.

---

## Account abstraction / paymaster

ERC-4337 gasless flow via ZeroDev or Safe.

### Mock path (today)

`getOrCreateSmartAccount` derives an address from a seed; `executeSponsoredTransaction` simulates a sponsored tx.

### Real path (to build)

1. Replace seed-derivation with a real counterfactual address from a kernel/Safe account: `createKernelAccount(publicClient, { plugins: [signer] })` (a passkey or session-key signer), per the commented-out code already in the file.
2. Wire a real paymaster (ZeroDev / Gelato) so gas is sponsored.
3. `executeSponsoredTransaction` becomes `kernelClient.sendUserOperation({ to, data })` → `waitForUserOperationReceipt`.
4. Keep `chainId: 84532` (Base Sepolia) hardcoded until promotion.

---

## Mock-vs-needs-build checklist

| Capability | Today | Needs build |
|---|---|---|
| Smart account address | ✅ deterministic seed (fake) | counterfactual address from kernel/Safe account |
| Paymaster / gas sponsorship | ❌ simulated 800ms sleep | real ZeroDev/Gelato paymaster + bundler |
| Sponsored tx submission | ❌ random hex hash | `sendUserOperation` + receipt wait |
| Story Protocol calldata | ❌ `"0xregisterAsset"` | `viem` ABI encoding vs deployed registry |
| IPFS metadata pin | ❌ placeholder URI | pin image + JSON, real `ipfs://<cid>` |
| PIL license registration | ⚠️ id passed, not registered | register terms (1=NC, 2=Commercial) |
| IPA address | ❌ derived fake | parsed from real tx logs |
| Registry contract address | ⚠️ placeholder constant | verified deployed contract |
| NFT mint | ❌ not implemented | ERC-721 mint (1/1 for Leviathans/Gods) |
| Network | ✅ Base Sepolia 84532 | mainnet = **Frank-gated**, keys never in repo |

Legend: ✅ works (as mock) · ⚠️ partial / intent only · ❌ not implemented

---

## The asset → IPFS → mint → IP-register loop (and its audit trail)

```
 1. asset           an `assets` row reaches status='approved' / 'published' (DAM.md)
        │
 2. IPFS            pin image + metadata JSON  →  ipfs://<cid>
        │
 3. mint            ERC-721 mint (1/1 for Leviathans/Gods)  →  nftContract, tokenId
        │
 4. IP-register     StoryProtocolService.registerIPAsset(...)  →  ipaAddress, licenseTermsId
        │
 5. audit           append a row to `asset_generations` linking
                    asset_id → cid → tokenId → ipaAddress → tx hash
```

Step 5 is the join point with the DAM layer: the `asset_generations` audit table (see DAM.md) records not just the *image* generation but the *on-chain* lineage — which CID, which token, which IPA, which (testnet) tx. One asset's full life — generated → reviewed → published → minted → IP-registered — is reconstructable from its `asset_id`.

**Nethyssa is the worked example.** She threads the lore loop (STAGING canon), the asset loop (`/leviathans/nethyssa-v1.webp` → council → published), and this web3 loop (first Leviathan 1/1 → IPFS → testnet mint → Story IP-register). She does not mint on mainnet until her canon is locked.

---

## Where things live

- Mock AA service: `apps/web/lib/web3/account-abstraction.ts`
- Mock Story Protocol service: `apps/web/lib/web3/story-protocol.ts`
- NFT framework + Arcanean collections: `.claude/commands/nft-creation.md`
- DAM pipeline + `assets` / `asset_generations` schema: `apps/web/docs/DAM.md`
- The three recurring loops: `.arcanea/WORKFLOWS.md`

Built on SIP.
