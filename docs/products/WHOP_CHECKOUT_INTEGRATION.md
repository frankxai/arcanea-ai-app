# Whop + arcanea.ai Checkout Integration
## Implementation Guide for Claude Code

---

## Architecture

```
┌─────────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   arcanea.ai/store   │───→│   Whop API        │───→│   Stripe          │
│   Product cards       │    │   Digital delivery │    │   Payment         │
│   "Buy" buttons       │    │   License keys     │    │   Processing      │
└─────────────────────┘    └──────────────────┘    └──────────────────┘
         │                           │
         │                           ▼
         │                  ┌──────────────────┐
         │                  │  Email (Beehiiv)   │
         │                  │  Welcome sequence  │
         └─────────────────→│  Product delivery  │
                            └──────────────────┘

ALSO:
┌─────────────────────┐    ┌──────────────────┐
│   Base L2 Wallet     │───→│   Token-Gated      │
│   wagmi + viem       │    │   Content on        │
│   Connect button     │    │   arcanea.ai        │
└─────────────────────┘    └──────────────────┘
```

---

## Phase 1: Whop Storefront (Tuesday — 2 hours total)

### Frank Does (15 min)
1. Go to whop.com → Create account
2. Create company "Arcanea"
3. Upload logo (Starweave symbol ✦, teal on dark)
4. Set up Stripe Connect (Whop handles this during onboarding)

### Claude Code Does (1.5 hours)

#### Products to List
```
Product 1: The Arcanean Grimoire — Vol. I
- Type: Digital download (PDF)
- Price: $19.99
- Description: "146 pages of curated wisdom from the Library of Arcanea.
  Legends, Laws, Meditations, Poetry. Six chapters that will transform
  how you think about creation."
- File: docs/products/grimoire-vol1.pdf
- Tags: grimoire, lore, mythology, world-building

Product 2: World-Builder Overlay Pack
- Type: Digital download (ZIP)
- Price: $49.00
- Description: "20 AI agents, 10 Guardian personalities, canonical lore,
  faction architecture. Drop into Claude Code or Cursor and instantly
  gain the Arcanea world-building framework."
- File: docs/products/overlay-pack-v1/ (ZIP)
- Tags: claude-code, cursor, ai-tools, overlay, agents

Product 3: Guardian Skill Bundle (Coming Soon)
- Type: Digital download (ZIP)
- Price: $29.00
- Description: "10 premium Claude Code skills from the Arcanea ecosystem.
  World-building, lore checking, character design, and more."
- Status: PLANNED — package from .arcanea/skills/
```

#### Whop API Integration (for arcanea.ai/store)
```typescript
// apps/web/lib/whop/client.ts
// Whop API v5 integration

const WHOP_API_BASE = 'https://api.whop.com/api/v5';

export async function getProducts() {
  const res = await fetch(`${WHOP_API_BASE}/company/products`, {
    headers: {
      'Authorization': `Bearer ${process.env.WHOP_API_KEY}`,
    },
  });
  return res.json();
}

export function getCheckoutUrl(productId: string): string {
  return `https://whop.com/arcanea/?product=${productId}`;
}
```

```typescript
// apps/web/app/store/page.tsx
// Product listing page on arcanea.ai

// Renders product cards with:
// - Product image
// - Title + description
// - Price
// - "Get It" button → links to Whop checkout
// Design: dark cosmic theme, gold prices, teal CTA buttons
```

---

## Phase 2: Self-Hosted Checkout on arcanea.ai (Wednesday — 4 hours)

### Stripe Direct Integration

For premium/custom products that bypass Whop (e.g., enterprise, custom worlds):

```typescript
// apps/web/app/api/checkout/route.ts

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { productId, email } = await request.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: PRICE_IDS[productId], quantity: 1 }],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_URL}/store/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/store`,
    metadata: { productId },
  });

  return Response.json({ url: session.url });
}
```

```typescript
// apps/web/app/api/webhook/stripe/route.ts

// Handles:
// - checkout.session.completed → deliver product (email download link)
// - customer.subscription.created → activate premium access
// - customer.subscription.deleted → revoke premium access
```

### Environment Variables Needed
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
WHOP_API_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Phase 3: Base L2 Wallet + Token-Gated Content (Thursday — 3 hours)

### Wallet Connect

```bash
# Install dependencies
pnpm add wagmi viem @tanstack/react-query
```

```typescript
// apps/web/lib/web3/config.ts
import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';

export const config = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
});
```

### Token-Gated Middleware

```typescript
// apps/web/middleware.ts (add to existing)

// Protected routes: /codex/premium/*, /library/full/*, /agents/premium/*
// Check: user has Arcanea NFT OR has active Stripe subscription
// Fallback: redirect to /store with "unlock this content" message
```

### NFT Drop Architecture
```
Collection: Arcanea Origin Cards
Chain: Base L2
Supply: 8 origin classes × 100 each = 800 total
Price: 0.01 ETH (~$25)
Utility: Token-gated access to premium Codex, early content, community
```

---

## Claude Code Pickup Prompt

```text
Read docs/products/WHOP_CHECKOUT_INTEGRATION.md.

Today's tasks:
1. Build /store page — 3 product cards (Grimoire, Overlay Pack, Skill Bundle)
   Design: dark cosmic theme from ARCANEA_BRAND_GUIDELINES.md
   Each card: image, title, price, description, "Get It" button
   Button links to Whop checkout URL (placeholder until Frank creates Whop account)

2. Build /api/checkout route — Stripe payment intent scaffold
   Use BYOK pattern (env vars, not hardcoded keys)
   Include webhook endpoint for delivery

3. Build /api/webhook/stripe route — handle checkout.session.completed
   On success: send email with download link via Beehiiv API

4. Wire quiz result page to include product CTA:
   "Ready to go deeper? Get the Grimoire →"

Verify: type-check, build, deploy.
Do not touch homepage, /chat, /imagine, or middleware beyond token-gate scaffold.
```

---

*Integration plan: 2026-03-31*
*Estimated total build: 9 hours across Tue-Thu*
