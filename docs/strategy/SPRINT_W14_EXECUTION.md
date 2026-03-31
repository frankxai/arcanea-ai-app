# Sprint W14 Execution Plan — Revenue-First Engineering

> **Sprint**: March 31 - April 6, 2026
> **Theme**: From Beautiful Platform to Revenue Machine
> **North Star**: First paying customer by Friday April 4

---

## Day 1 (Monday March 31): Foundation Unlocks

### Block 1: Admin Tasks (Frank, 30 min)
- [ ] **Supabase Dashboard**: Site URL → arcanea.ai, redirect → arcanea.ai/auth/callback, enable Google + GitHub OAuth
- [ ] **Sentry**: Set DSN env var on Vercel
- [ ] **PostHog**: Set project key env var on Vercel
- [ ] **Verify**: Visit arcanea.ai/auth/signup → test OAuth flow

### Block 2: Navigation Surgery (Agent, 2 hours)
**File**: `apps/web/components/navigation/navbar.tsx`

Current 8 items → 5 items:
```typescript
const navLinks = [
  { href: "/chat", label: "Create", also: ["/imagine", "/studio", "/forge"] },
  { href: "/gallery", label: "Explore", also: ["/discover", "/library", "/lore", "/agents", "/living-lore"] },
  { href: "/academy", label: "Learn", also: ["/academy/courses", "/academy/gates"] },
  { href: "/pricing", label: "Pricing", also: [] },
];
```
- Create mega-dropdown for "Explore" on hover/click:
  - Gallery, Library, Agents, Lore, Living Lore
- UserNav (avatar/sign in) stays as the 5th element

**File**: `apps/web/components/navigation/footer.tsx`

Reduce from 6 columns to 4:
```
Create          | Learn           | Community       | Company
Chat            | Academy         | Gallery         | About
Studio          | Courses         | Discord         | Blog
Imagine         | Library         | GitHub          | Pricing
Forge           | Lore            |                 | Contact
Music           |                 |                 | Terms/Privacy
```

### Block 3: Dead Page Triage (Agent, 2 hours)
Add `noindex` robots meta to all STUB/PARTIAL pages:
```typescript
export const metadata = { robots: { index: false, follow: true } };
```

Pages to noindex (not exhaustive — verify each):
- /workspace, /world-builder, /universe-builder, /vision-board
- /character-book, /bestiary, /sanctum
- /apl, /arcs, /code, /claw
- /command-center, /command, /components, /docs
- /v1, /v2, /v3, /v4 (version archives)
- /forge/companion, /forge/luminor
- /gallery/luminors, /gallery/guardians
- /community/create, /community/strategy

Smart redirects:
- /workspace → /studio (308)
- /world-builder → /chat?mode=world (308)
- /universe-builder → /chat?mode=world (308)
- /vision-board → /studio (308)

---

## Day 2 (Tuesday April 1): Stripe Integration

### Block 1: Stripe Setup (Agent, 4-6 hours)

**New files needed**:
```
apps/web/app/api/stripe/checkout/route.ts     — Create checkout session
apps/web/app/api/stripe/webhook/route.ts      — Handle payment events
apps/web/app/api/stripe/portal/route.ts       — Customer portal
apps/web/lib/stripe.ts                        — Stripe client + helpers
```

**Supabase migration**:
```sql
CREATE TABLE user_credits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  balance integer DEFAULT 5 NOT NULL,  -- 5 free daily credits
  total_purchased integer DEFAULT 0,
  total_spent integer DEFAULT 0,
  stripe_customer_id text,
  subscription_tier text DEFAULT 'free',  -- free, forge
  subscription_status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE credit_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  amount integer NOT NULL,  -- positive = add, negative = spend
  type text NOT NULL,  -- 'purchase', 'subscription', 'daily_free', 'spend', 'refund'
  description text,
  stripe_payment_id text,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own credits" ON user_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can update credits" ON user_credits FOR ALL USING (auth.uid() = user_id);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);
```

**Stripe Products**:
- Credit Pack 50 ($5) — one-time
- Credit Pack 250 ($19) — one-time
- Credit Pack 750 ($49) — one-time
- Forge Monthly ($29/mo) — subscription

**Webhook handlers**:
- `checkout.session.completed` → Add credits or activate subscription
- `invoice.paid` → Renew subscription credits
- `customer.subscription.deleted` → Downgrade to free

### Block 2: Wire Pricing Page (Agent, 1-2 hours)
**File**: `apps/web/app/pricing/page.tsx`

Replace `href="/auth/signup?plan=credits"` with actual Stripe checkout:
```typescript
const handlePurchase = async (productId: string) => {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
  const { url } = await res.json();
  window.location.href = url;
};
```

Add credit balance display in navbar for logged-in users.

---

## Day 3 (Wednesday April 2): Creation Flow

### Block 1: First-Creation Flow (Agent, 4 hours)
Post-signup redirect → `/onboarding/create`:

```
Step 1: "What will you create first?"
  [Write a Story] [Generate an Image] [Compose Music] [Build Something]

Step 2: AI generates result (real API call, costs 1 credit)
  - Story: Gemini generates 300-word opening
  - Image: Imagen/DALL-E generates concept art
  - Music: Suno generates 30-sec clip
  - Code: Gemini generates starter template

Step 3: "Your first creation"
  - Beautifully displayed result
  - Auto-saved to profile
  - [Share This] button → generates branded card
  - [Create More] button → go to /chat

Step 4: Redirect to /dashboard
  - First creation visible in "Recent Creations"
  - Credit balance shown (4 remaining of daily 5)
```

### Block 2: Shareable Creation Cards (Agent, 2 hours)
**New file**: `apps/web/app/api/og/creation/[id]/route.tsx`

Dynamic OG image for each creation:
- Arcanea branding at top
- Creation content (text preview or image thumbnail)
- Creator name + avatar
- "Made with Arcanea" watermark
- Links to arcanea.ai/gallery/[id]

This enables:
- Twitter/LinkedIn sharing with beautiful cards
- Each share = free marketing
- Viral loop: see card → visit → create → share → repeat

---

## Day 4 (Thursday April 3): Gallery & Discovery

### Block 1: Gallery Seed (Agent, 2 hours)
- Generate 50 high-quality images via AI (or curate from existing Guardian art)
- Generate 20 story excerpts
- Generate 10 music descriptions
- Populate gallery with real-looking content
- Each item has creator attribution (use "Arcanea Team" or Guardian names)

### Block 2: Gallery Social Features (Agent, 3 hours)
- Like button (heart) → increments counter in Supabase
- View counter → tracks unique views
- Share button → copies creation URL
- Creator profile link → /profile/[username]
- Filter: Stories | Images | Music | Worlds | All

### Block 3: Homepage Refinement (Agent, 1 hour)
- Update subtitle copy
- Add social proof line ("500+ creators" or dynamic count)
- Add 3 featured creations from gallery below the hero
- Verify mobile experience

---

## Day 5 (Friday April 4): Polish & Launch

### Block 1: Origin Quiz Viral Loop (Agent, 2 hours)
- Quiz already exists at /quiz or /academy/gate-quiz
- Add shareable result card generation
- "I'm a [Origin Class]. What are you?" + quiz link
- Social meta tags for quiz results

### Block 2: Email Capture (Agent, 1 hour)
- Simple email list for non-signup visitors
- "Get notified when we launch new creation tools"
- Store in Supabase or Resend list

### Block 3: End-to-End Testing (Agent, 2 hours)
Full flow verification:
1. Land on homepage → looks beautiful
2. Click "Write a story" → redirects to chat
3. Chat works → AI responds with streaming
4. Sign up → OAuth works
5. Onboarding → first creation flow works
6. Dashboard → shows creation
7. Gallery → creation visible
8. Pricing → click "Buy Credits" → Stripe checkout opens
9. Share → creation card renders correctly
10. Mobile → all of the above works on phone

### Block 4: Soft Launch (Frank, 30 min)
- Post on X/Twitter: "Arcanea is live. Create stories, images, music, and worlds with AI."
- Post on LinkedIn: "Building the creative engine for AI-native world builders"
- Share Origin Quiz: "What kind of creator are you?"
- Enable PostHog tracking → watch real user flows

---

## Success Metrics for This Sprint

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Auth working | Yes/No | Can sign up with Google/GitHub |
| Stripe working | Yes/No | Can buy credit pack |
| First creation flow | Yes/No | Signup → creation in <2 min |
| Nav items | 5 | Visual check |
| Stub pages noindexed | 50+ | robots meta check |
| Gallery items | 50+ | Supabase count |
| Shareable cards | Working | Share and check preview |
| First paying customer | 1+ | Stripe dashboard |
| PostHog events | Tracking | PostHog dashboard |

---

## Agent Assignment

| Task | Agent Type | Model | Priority |
|------|-----------|-------|----------|
| Nav surgery | `Arcanea Frontend Specialist` | Sonnet | P0 |
| Dead page triage | `coder` | Haiku | P0 |
| Stripe integration | `Arcanea Backend Specialist` | Opus | P0 |
| Pricing page wiring | `Arcanea Frontend Specialist` | Sonnet | P0 |
| First-creation flow | `Arcanea Frontend Specialist` | Opus | P0 |
| Shareable cards | `coder` | Sonnet | P1 |
| Gallery seed | `coder` | Haiku | P1 |
| Gallery social | `Arcanea Frontend Specialist` | Sonnet | P1 |
| Homepage refinement | `Arcanea Frontend Specialist` | Sonnet | P1 |
| Quiz viral loop | `coder` | Sonnet | P1 |
| E2E testing | `tester` | Sonnet | P1 |

---

*This plan is designed to be executed primarily by Claude Code agents with Frank providing API keys and strategic direction.*
