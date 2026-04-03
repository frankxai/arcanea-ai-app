# Deployment Guide — IPFS + Smart Contract

## IPFS Upload Pipeline

### Pinata SDK (TypeScript)

```typescript
import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: 'your-gateway.mypinata.cloud',
});

// Upload collection images
async function uploadImages(imageDir: string): Promise<string> {
  // Upload entire directory as a single CID
  const result = await pinata.upload.folder(imageDir);
  return result.cid; // ipfs://QmXxx.../0.png, ipfs://QmXxx.../1.png, etc.
}

// Upload metadata
async function uploadMetadata(metadataDir: string): Promise<string> {
  const result = await pinata.upload.folder(metadataDir);
  return result.cid; // ipfs://QmXxx.../0.json, ipfs://QmXxx.../1.json, etc.
}

// Full pipeline
async function deployToIPFS(collection: {
  imageDir: string;
  metadataDir: string;
}): Promise<{ imageCID: string; metadataCID: string }> {
  const imageCID = await uploadImages(collection.imageDir);
  const metadataCID = await uploadMetadata(collection.metadataDir);
  return { imageCID, metadataCID };
}
```

### Cost Estimates
- 10K images (1024x1024 PNG, ~1MB each): ~10GB storage
- Pinata Free: 1GB. Paid: $20/mo for 50GB.
- Alternative: Arweave via Irys for permanent storage (~$0.01-0.05/MB)

## Smart Contract Deployment

### Using thirdweb SDK

```typescript
import { createThirdwebClient, getContract } from 'thirdweb';
import { base } from 'thirdweb/chains';

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

// Deploy via ForgeFactory
async function deployCollection(params: {
  name: string;
  symbol: string;
  maxSupply: number;
  mintPrice: string; // In ETH
  maxPerWallet: number;
  placeholderURI: string;
  royaltyBps: number;
}) {
  const factory = getContract({
    client,
    chain: base,
    address: FORGE_FACTORY_ADDRESS,
  });

  // Call createCollection on factory
  // Returns deployed clone address
}
```

### Supported Chains
| Chain | Gas Cost (Deploy) | Gas Cost (Mint 1) | Notes |
|-------|------------------|-------------------|-------|
| Base | ~$0.01 | ~$0.001 | Coinbase L2, large audience |
| Ethereum | ~$50-200 | ~$5-20 | Prestige, highest liquidity |
| Optimism | ~$0.05 | ~$0.005 | OP Stack, growing ecosystem |
| Arbitrum | ~$0.10 | ~$0.01 | Large DeFi ecosystem |
| Zora | ~$0.01 | ~$0.001 | Art-focused, protocol rewards |

### Merkle Tree Allowlist

```typescript
import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'ethers';

function generateMerkleTree(addresses: string[]): {
  root: string;
  proofs: Record<string, string[]>;
} {
  const leaves = addresses.map((addr) => keccak256(addr));
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  const proofs: Record<string, string[]> = {};
  for (const addr of addresses) {
    const leaf = keccak256(addr);
    proofs[addr] = tree.getHexProof(leaf);
  }

  return {
    root: tree.getHexRoot(),
    proofs,
  };
}
```

### Reveal Mechanism

1. Deploy with `placeholderURI` pointing to a single unrevealed image
2. All tokens show the same placeholder until reveal
3. After minting closes: upload real metadata to IPFS
4. Call `reveal(realBaseURI)` on contract
5. All tokens update to their real metadata/images

### Post-Deploy Checklist
- [ ] Verify contract on block explorer (Etherscan/Basescan)
- [ ] Set royalty recipient and BPS
- [ ] Configure mint phases (CLOSED → ALLOWLIST → PUBLIC)
- [ ] Set Merkle root for allowlist
- [ ] Test mint on testnet before mainnet
- [ ] Set up OpenSea/Blur collection page
- [ ] Configure royalty enforcement
