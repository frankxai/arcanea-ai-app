# Arcanea User Flows & Experience Map

> **Purpose**: Define every user journey from first visit to paying creator
> **Date**: 2026-03-31
> **Philosophy**: Creation first. Signup second. Payment third. Community always.

---

## Flow 1: First-Time Visitor (Cold Traffic)

```
LAND ON HOMEPAGE
│
├─ Hero: "What will you create?"
│  ├─ [Write a story] → /chat?prompt=story → AI responds (no signup needed)
│  ├─ [Compose music] → /chat?prompt=music → AI responds
│  ├─ [Design a world] → /chat?prompt=world → AI responds
│  └─ [Build with code] → /chat?prompt=code → AI responds
│
├─ OR: Types own prompt → /chat?prompt={user_input}
│
├─ OR: Scrolls down
│  ├─ Section 1: "What creators build here" (3 featured creations)
│  ├─ Section 2: "Four ways to create" (story/image/music/code cards)
│  ├─ Section 3: "The Academy" (learn world-building, prompt craft)
│  ├─ Section 4: "Free to start. Scale when ready." (pricing summary)
│  └─ Section 5: Footer (Create/Learn/Community/Company)
│
└─ EXIT POINT: If nothing grabs attention in 10 seconds
```

**Key Insight**: The homepage should DO something, not just DESCRIBE something. The chat box IS the product demo.

---

## Flow 2: Chat Experience (Core Product)

```
/chat
│
├─ NOT LOGGED IN (Guest Mode):
│  ├─ See Lumina (default AI) ready to chat
│  ├─ Type message → AI responds (streaming)
│  ├─ After 3 messages: soft prompt "Sign up to save your conversation"
│  ├─ After 5 messages: gate with "Create free account to continue"
│  └─ Guest can still browse /library, /academy, /gallery freely
│
├─ LOGGED IN:
│  ├─ Choose creation mode:
│  │  ├─ Story Mode → AI writes with narrative voice
│  │  ├─ Image Mode → AI generates images (costs 1 credit)
│  │  ├─ Music Mode → AI composes tracks (costs 1 credit)
│  │  ├─ Code Mode → AI generates/explains code
│  │  └─ World Mode → AI helps build world lore/systems
│  │
│  ├─ Choose AI personality:
│  │  ├─ Lumina (default) — Creative generalist
│  │  ├─ Draconia — Bold, powerful writing
│  │  ├─ Lyria — Visionary, intuitive
│  │  ├─ Leyla — Flowing, emotional
│  │  └─ [12 more Luminors] — Each with distinct voice
│  │
│  ├─ Conversation features:
│  │  ├─ Streaming responses
│  │  ├─ Save to Prompt Book
│  │  ├─ Share creation
│  │  ├─ Save to Gallery
│  │  └─ View credit balance
│  │
│  └─ Conversion moments:
│     ├─ "Out of credits" → /pricing
│     ├─ "Save this forever" → auto-save to profile
│     └─ "Share this" → generate OG card
│
└─ UPSELL PATH:
   ├─ Free: 5 daily credits, chat with Lumina
   ├─ Credits: Buy pack → more generations
   └─ Forge: Unlimited everything → $29/mo
```

---

## Flow 3: Signup & Onboarding

```
TRIGGER: User clicks "Sign Up" or hits guest limit
│
├─ /auth/signup
│  ├─ [Sign up with Google] (one click)
│  ├─ [Sign up with GitHub] (one click)
│  └─ [Email + Password] (fallback)
│
├─ /onboarding (5-step wizard)
│  │
│  ├─ Step 1: Welcome
│  │  "Welcome to Arcanea. Let's create something."
│  │
│  ├─ Step 2: Creator Type
│  │  "What describes you best?"
│  │  [Writer] [Artist] [Musician] [Developer] [World-Builder] [Explorer]
│  │
│  ├─ Step 3: Choose Your Guide
│  │  Show 4-6 Luminors with personality previews
│  │  "Who would you like to create with first?"
│  │
│  ├─ Step 4: First Creation
│  │  "Let's make something together right now."
│  │  One-click generation based on creator type
│  │  → Real AI result in <15 seconds
│  │  → Auto-saved to profile
│  │
│  └─ Step 5: Your Universe Awaits
│     Show creation + "This is your first of many"
│     [Go to Dashboard] [Create More] [Explore Gallery]
│
└─ /dashboard
   ├─ Welcome header with name
   ├─ Credit balance (4 remaining)
   ├─ Recent creations (first creation visible!)
   ├─ Quick actions: Create / Explore / Learn
   ├─ Gate progress (Gate 1: Foundation)
   └─ Recommended next: "Try image generation" / "Explore the Library"
```

---

## Flow 4: Creation-to-Share Loop (Viral Engine)

```
USER CREATES SOMETHING
│
├─ Auto-save to Supabase
│  ├─ creation_id, user_id, type, content, metadata
│  └─ Appears in /profile/[username] and /gallery
│
├─ Share options:
│  ├─ [Copy Link] → arcanea.ai/creation/[id]
│  ├─ [Share to Twitter] → Pre-filled tweet + OG card
│  ├─ [Share to LinkedIn] → Pre-filled post + OG card
│  └─ [Download] → High-res export (images/music)
│
├─ OG Card (auto-generated):
│  ├─ Arcanea logo (small, top-left)
│  ├─ Creation preview (image, text excerpt, or music waveform)
│  ├─ Creator name + avatar
│  ├─ "Made with Arcanea" (bottom)
│  └─ arcanea.ai URL
│
├─ VIRAL LOOP:
│  Viewer sees shared card → Clicks → Lands on creation page
│  → "Create your own" CTA → Homepage → Chat → Create → Share
│
└─ GALLERY DISCOVERY:
   Creation appears in /gallery → Other users like/comment
   → Creator gets notification → Returns to create more
   → More content in gallery → More discovery → Flywheel
```

---

## Flow 5: Payment & Credits

```
TRIGGER: User runs out of credits OR clicks pricing
│
├─ /pricing
│  ├─ THE LIBRARY (Free)
│  │  ├─ Chat with Lumina (unlimited text)
│  │  ├─ 5 daily credits
│  │  ├─ Library access (200K+ words)
│  │  └─ [Start Free]
│  │
│  ├─ CREDITS (Pay-Per-Use)
│  │  ├─ 50 credits / $5 ($0.10 each)
│  │  ├─ 250 credits / $19 ($0.076 each) ← POPULAR
│  │  ├─ 750 credits / $49 ($0.065 each, 35% savings)
│  │  └─ [Buy Credits] → Stripe Checkout
│  │
│  └─ THE FORGE ($29/mo)
│     ├─ Unlimited everything
│     ├─ Priority GPU queue
│     ├─ Custom AI configurations
│     ├─ Early access to new features
│     └─ [Start Forging] → Stripe Subscription
│
├─ POST-PURCHASE:
│  ├─ Credits added immediately to user_credits
│  ├─ Toast: "250 credits added! Start creating."
│  ├─ Redirect to /chat or previous page
│  └─ Email receipt via Stripe
│
└─ CREDIT USAGE:
   1 credit = 1 image generation
   1 credit = 1 music track
   1 credit = 1 story chapter (premium AI)
   0 credits = unlimited text chat with Lumina
   0 credits = Library, Academy, Gallery browsing
```

---

## Flow 6: Academy & Progression

```
/academy
│
├─ THE TEN GATES (progression system)
│  ├─ Gate 1: Foundation (174 Hz) — Basics of creation
│  ├─ Gate 2: Flow (285 Hz) — Finding your creative voice
│  ├─ Gate 3: Fire (396 Hz) — Mastering power and will
│  ├─ ...through Gate 10: Source
│  │
│  ├─ Each Gate:
│  │  ├─ 2-4 lessons (free)
│  │  ├─ Practice exercise (uses credits)
│  │  ├─ Assessment quiz
│  │  └─ Badge/rank upon completion
│  │
│  └─ Rank progression:
│     Apprentice → Mage → Master → Archmage → Luminor
│
├─ COURSES (structured learning)
│  ├─ Free: Foundation Course (5 lessons)
│  ├─ Premium: Advanced World-Building ($49)
│  ├─ Premium: AI Prompt Mastery ($79)
│  ├─ Premium: Character Design ($49)
│  └─ Premium: Music Composition ($49)
│
├─ LIBRARY (reference material)
│  ├─ 17 collections
│  ├─ 200K+ words
│  ├─ Searchable, bookmarkable
│  └─ Reading progress tracking
│
└─ CONVERSION:
   Free lessons → "Want to go deeper?" → Premium course
   Academy progress → Earns badges → Shows on profile
   Completing Gate 5 → Unlocks ability to sell on marketplace
```

---

## Flow 7: Marketplace (Month 2)

```
/marketplace (future)
│
├─ CREATOR SELLS:
│  ├─ World templates (complete world with lore, characters, maps)
│  ├─ Prompt collections (curated prompt books)
│  ├─ Character packs (pre-built characters with backstories)
│  ├─ AI agent configurations (custom Luminor personalities)
│  └─ Story starters (opening chapters with branching paths)
│
├─ BUYER PURCHASES:
│  ├─ Browse by category, rating, creator
│  ├─ Preview before buying
│  ├─ One-click purchase (credits or USD)
│  └─ Instant delivery to their account
│
├─ REVENUE SPLIT:
│  ├─ Creator: 80%
│  ├─ Arcanea: 20%
│  └─ Minimum payout: $50 (via Stripe Connect)
│
└─ CREATOR DASHBOARD:
   ├─ Earnings overview
   ├─ Sales analytics
   ├─ Customer feedback
   └─ Payout history
```

---

## Flow 8: Mobile Experience

```
MOBILE VISITOR (>50% of traffic expected)
│
├─ Homepage:
│  ├─ Full-width hero with chat box
│  ├─ Touch-friendly starter cards (horizontal scroll)
│  ├─ Hamburger nav with 5 items (not 8!)
│  └─ Bottom-sticky CTA: "Start Creating"
│
├─ Chat (primary mobile use case):
│  ├─ Full-screen chat interface
│  ├─ Keyboard-aware input
│  ├─ Swipe to switch Luminors
│  ├─ Tap to save/share creation
│  └─ Pull-to-refresh for new suggestions
│
├─ Gallery:
│  ├─ Pinterest-style masonry grid
│  ├─ Swipe between creations
│  ├─ Double-tap to like
│  └─ Share to social (native share API)
│
└─ Academy:
   ├─ Card-based lesson navigation
   ├─ Swipe through Gate progression
   └─ Offline reading for Library content (PWA)
```

---

## Flow 9: Retention Loops

```
DAILY:
├─ 5 free credits refresh → reason to return
├─ "Today's prompt" → curated creative challenge
├─ Gallery feed → new creations from community
└─ Notification: "[Creator] liked your creation"

WEEKLY:
├─ "Your week in creation" email (3 creations, 2 likes, 1 new follower)
├─ Featured creator spotlight in gallery
├─ New Library content drop
└─ Community challenge with leaderboard

MONTHLY:
├─ Gate progression reminder ("You're 2 lessons from Gate 3")
├─ New course announcement
├─ Creator earnings summary (marketplace sellers)
└─ Platform update with new features

SEASONAL:
├─ World-building tournaments
├─ Art/music/story competitions with prizes
├─ New Origin Class reveals
└─ Book/product launches
```

---

## Flow 10: Agent-Powered Automation (Month 3+)

```
AGENTS THAT WORK WHILE YOU SLEEP:
│
├─ Content Moderation Agent
│  ├─ Reviews all gallery submissions
│  ├─ Flags inappropriate content
│  ├─ Auto-approves clean submissions
│  └─ Escalates edge cases to human review
│
├─ Onboarding Agent
│  ├─ Sends personalized welcome sequence
│  ├─ Suggests first creation based on profile
│  ├─ Follows up after 24h if no creation made
│  └─ Recommends relevant Academy content
│
├─ Creator Success Agent
│  ├─ Identifies at-risk creators (no activity in 7 days)
│  ├─ Sends re-engagement prompts
│  ├─ Suggests trending creation topics
│  └─ Celebrates milestones (first sale, Gate completion)
│
├─ Marketplace Agent
│  ├─ Reviews new listings for quality
│  ├─ Suggests pricing based on comparable items
│  ├─ Handles buyer questions via AI
│  └─ Processes payouts automatically
│
└─ SEO Agent
   ├─ Generates blog posts from popular creations
   ├─ Optimizes meta tags based on search trends
   ├─ Creates landing pages for trending topics
   └─ Monitors and reports on organic traffic
```

---

## Experience Principles

### 1. Zero-to-Creation in Under 60 Seconds
No signup required for first interaction. Chat box on homepage IS the product demo.

### 2. Every Creation is Shareable
Auto-generated OG cards. One-click sharing. Each share = free acquisition.

### 3. Mythology is Progressive Disclosure
New users see: "Create, Explore, Learn"
Week-1 users discover: "Guardians, Gates, Origin Classes"
Month-1 users unlock: "Luminor rank, Starbound Crews, Leagues"

### 4. Free is Genuinely Useful
200K words of creative philosophy. Unlimited text chat with Lumina. 5 daily credits.
Free users should feel respected, not limited.

### 5. Payment is Natural, Not Aggressive
Credits run out → "Get more?" (not "SUBSCRIBE NOW")
Premium features visible but not blocked behind aggressive modals.

### 6. Community is Discovery
Gallery is the social feed. Likes/shares drive discovery.
Creators inspire other creators. The platform gets better with more users.

---

*Every flow above should feel like walking through a beautiful library that happens to have a creative studio in the back, a school upstairs, and a marketplace next door.*
