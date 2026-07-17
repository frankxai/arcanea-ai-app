---
title: "Naming strategy across accounts and platforms"
uuid: a071cc24-677b-4eee-a9a7-7ac0679b2667
created: 2026-04-03T19:25:24.525542Z
updated: 2026-04-06T12:23:48.672108Z
source: claude.ai export
---

# Naming strategy across accounts and platforms

**Frank**:

help with naming we currently build up multiple accounts, platforms, teams for it and some i am personal, some we plan for community or team to manage right? Like this Vercel i had before FrankX pRojects is good to switch to team url to starlight-intelligence? At same time not sure this should be core identity i think we can only trademark Arcanea FrankX not sure maybe just FrankX.AI and need to check and validate trademarks vs what we just use in general for social channels, but also urls and domains and thinking behind all our moving parts across all chats and ideas

[attached file: 1775244260498_image.png -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

Frank is asking about naming architecture across his ecosystem - specifically about Vercel team naming, but more broadly about the identity/naming hierarchy across platforms, domains, trademarks, and social channels. Let me think about this architecturally.

The core question is: what's the naming taxonomy that governs infrastructure (Vercel, GitHub, Supabase), legal entities (trademarks, BV), public brands (domains, social), and community/team accounts?

Let me think about his brands:
- FrankX.ai - personal brand
- Arcanea - the movement/universe
- Starlight Intelligence (Systems) - the umbrella framework/system
- AI Music Academy


- AI Architect Academy
- animelegends.ai
- GenCreator - community meta-container

For the Vercel team specifically, I need to decide whether it should be "Starlight Intelligence" or something else. The real architectural question is separating what needs trademark protection (distinctive, legally defensible assets like Arcanea and FrankX.AI), what serves as infrastructure namespacing (Vercel, GitHub, Supabase accounts), what functions as public branding (domains and social presence), and what's the underlying legal entity structure (the BV).

The cleanest approach is mapping the infrastructure layer—including the Vercel team—to the legal entity itself rather than individual product brands, so if the BV is "Starlight Intelligence B.V." or "FrankX B.V.", that becomes the organizing namespace for all technical operations. brands that are customer-facing.

Let me think about what makes sense:

- "Starlight Intelligence" as the operating company / infrastructure namespace makes sense because it's the umbrella that contains all brands
- But "Starlight Intelligence" is also deeply tied to Arcanean lore (SIS = Starlight Intelligence System)
- If it becomes the corporate entity name, it creates a weird overlap between lore and business

Actually, let me reconsider. The cleaner architecture might be:

**FrankX B.V.** (or similar) = legal entity / holding
**Starlight Intelligence** = the AI system/framework (lore + real)
**Arcanea** = the movement brand
**FrankX.ai** = personal brand

For Vercel specifically: if this team hosts projects across all brands, it should be the operating entity namespace. The Vercel organization needs to align with whatever the actual corporate entity is—so if FrankX B.V. is the legal entity, then the Vercel namespace should reflect that rather than using Starlight Intelligence.This is an identity architecture problem, not a naming problem. Let me map the decision space.
```
This block is not supported on your current device yet.
```

Good, I have rich context. Let me now synthesize the naming architecture problem.

Key facts from past conversations:
1. Corporate structure planned: Starlight Holding BV → Arcanea IP BV → FrankX Operations BV
2. Trademark priority: Arcanea (P0), Starlight Intelligence Systems (P1), FrankX (P2), GenCreator (P3)
3. BV formation recommended as "FrankX.ai B.V." or "Starlight Intelligence Systems B.V."
4. EUIPO SME Fund 2026 available for trademark at 75% discount


5. Now I'm mapping out how the three organizational layers connect: the legal entities themselves, the infrastructure namespaces across platforms like Vercel and GitHub, and the actual trademarkable brands that sit on top of it all.

The real issue is that "Starlight Intelligence" is doing double duty—it's both a lore element in the system and currently serving as the Vercel team name, but it's not actually the strongest candidate for the holding company structure I'm planning. I think the infrastructure namespaces should really point to the operating entity instead, which would clean up this overlap and make the whole thing more coherent. the operating BV is "FrankX Operations BV" or just "FrankX.ai BV", then Vercel/GitHub should be under "frankxai" or similar.

But wait - if the Vercel team hosts ALL projects (Arcanea, FrankX, animelegends), then it needs a neutral container name. Options:
1. "Starlight Intelligence" - current, lore-connected, not strongly trademarkable
2. "FrankX" - personal brand, but feels limiting as container for Arcanea
3. Something else

Actually, the cleanest architecture:

**"Starlight Intelligence"** = infrastructure/holding layer (internal, not customer-facing)
**"Arcanea"** = the primary brand/movement (trademark P0)
**"FrankX.ai"** = personal brand (trademark P2)

Using "starlight-intelligence" for the Vercel team makes sense as the infrastructure backbone, though I should consider whether Arcanea might eventually need its own GitHub organization separate from the personal "frankxai" one. Let me map out how these layers should connect.Good context pulled. Here's the architectural problem clearly:

You have **five naming layers** that are currently tangled:

1. **Legal entities** (BV structure — what gets registered at KvK)
2. **Trademarks** (what you legally protect at EUIPO)
3. **Infrastructure namespaces** (Vercel, GitHub, Supabase, domains)
4. **Public brands** (social handles, content identity)
5. **Lore/internal systems** (SIS, Luminor, Guardian names)

The confusion comes from "Starlight Intelligence" sitting across layers 1, 3, and 5 simultaneously without a clear decision on which layer it *governs*.
```
This block is not supported on your current device yet.
```

Now I have a complete picture. Let me build the naming architecture decision framework.

Key insight: Frank has planned a three-BV structure:
1. Starlight Holding BV (parent)
2. Arcanea IP BV (all IP)
3. FrankX Operations BV (all revenue)

But the Vercel team is "Starlight Intelligence" which maps to the holding layer. GitHub org is "frankxai" which maps to the operations/personal brand.

The question is whether infrastructure namespaces should be:
- Unified under one name (the holding)
- Split per brand
- Something else


- 
I'm working through a taxonomy to map these entities and their naming conventions across the different layers.Now I have the full picture. Here's the decision framework:

---

**The core tension:** "Starlight Intelligence" currently occupies your Vercel infra namespace, but in your planned BV structure it's the *holding* layer — which should be invisible to the outside world. Meanwhile "frankxai" is your GitHub org, which maps to the *operations* layer.

You have three nameable assets. Each serves a different function:

| | **Trademark** | **Infra namespace** | **Public brand** | **Legal entity** |
|---|---|---|---|---|
| **Arcanea** | ✅ P0 — file first | Projects only | @arcanea | Arcanea IP BV |
| **FrankX(.ai)** | ✅ P2 — personal mark | GitHub org, Vercel team | @frankx.ai | FrankX Operations BV |
| **Starlight Intelligence** | ❌ Skip | Internal only | Never public | Holding BV (invisible) |

**The decision that resolves everything:**

"Starlight Intelligence" should **not** be your Vercel team URL, your public namespace, or anything customer-facing. It's lore + holding layer. The moment you put it on infrastructure, you create a naming layer that competes with Arcanea and FrankX for attention and confuses what the company *is*.

**Vercel team → rename to `frankxai`** to match your GitHub org. This is your *operations* namespace — it hosts all projects across all brands. It's the builder identity, not the brand identity. Arcanea projects, FrankX projects, animelegends — all deploy from the frankxai operations layer.

**Trademark filing order:**
1. **Arcanea** — coined word, maximum distinctiveness, franchise IP. File via EUIPO SME Fund immediately once BV exists. Class 41 + Class 9.
2. **FrankX.ai** — personal brand mark. File second. Note: surname-based marks are harder but "FrankX" as a stylized/coined variant is registrable.
3. **Starlight Intelligence** — don't trademark. It's internal architecture. Trademarking it burns your one SME Fund voucher per year on something that has no customer-facing surface area.
4. **GenCreator** — descriptive, weak mark. Don't waste money here yet.

**Domain architecture:**
- `arcanea.ai` → the movement, the universe, the platform
- `frankx.ai` → personal brand, consulting, speaking
- `animelegends.ai` → anime vertical
- `starlight.ai` / `starlightintelligence.com` → only if you want a corporate site for the holding, which you don't need yet

**Social mapping** (you already have this right):
- `@arcanea` = world speaks
- `@akamoto` = Prime Luminor
- `@frankx.ai` = Frank the architect
- `@animelegends` = anime culture

None of these need to be "Starlight Intelligence."

**The mental model:** Starlight Intelligence is the *operating system* — it's what runs underneath. Arcanea and FrankX are the *applications* people interact with. You don't trademark your OS kernel. You trademark the products.

The Vercel rename from `starlight-intelligence` to `frankxai` takes 30 seconds and aligns your infra layer with your GitHub org, your operations BV name, and the identity that actually owns the deployments. Want me to map the full project-to-namespace allocation across Vercel, GitHub, Supabase, and domains?

**Frank**:

And the recent couple of days and weeks we talked and went a lot deeper into Arcanea. The setup, social media structure, also building Arcanea claws, who can help, um, help, um, to, uh, curate the content that I produce on Mast. withe generative A. The videos, which is the music potentially, at the same time, I just also recognized I will, um, I would really enjoy and also need help with the whole PR around my personal music, right? Like, we have different types of music domains that I will post onto Spotify. I'm not sure yet what should be my personal musician name, if it should be Frank or Frank X or Frank Riemer My full name. Or if we have a special artist name, that I should embody and then write. I have, like, so many different music directions, then I'm going for and using them. I'm not sure if it's a bit too much, if I post it all under one name or if weneed too have multiple brands. But I think for me as a person, I'veways been a pianist,st. Since I'm like five years old, I had my own concerts and stuffff.nd only now, trueSuno I can actually compose songs of a quality that I actually like. And invent playful, you know, orchestras and stuff. I would like just to really scale. I would like to amplify this, and at the same time recognize I'm a bit introverted. I may, you know, like 10 high-quality songs, maybe I like them on, you know, Suno Press Publish sometimes. but then I don't do much else about it. Sometimes I share a bit with my mom, but that's it. But I think if we right now we need to make the business and build it up with this, so I also see the poll and need that we are publishing this a bit more. And maybe also activate other people. My family and friends who can help, and that we have like a mobile-driven workflow where we had an AI assistant who we can just gift the music to or the files or the link, and he's managing then to distribute it, to put it into the right social media channels and stuff. Connect with the right people and groups, since it's a bit what I'm, you know, it's difficult for me. It could act like my like a music agent, I would say. I'm not sure if this makes sense and what is possible there and what would be the smoothest also workflow naming and general strategy. For us to make this at scale, and yeah, I think then we already had another chat at some point, even recently, yesterday or before, on this speciics of all of the brands that we aree building. And the naming, the branding strategy, for each of them, I need to continue this exercise and noww if your help, you know, find out what we what is it everything that we, you know, already clarified for me, what I should understand and do more of, and yeah, Yeah,

**Claude**:

Frank is asking about several interconnected things:

1. Music artist identity — what name to publish under personally
2. Music distribution workflow — AI-powered agent to handle publishing, social, PR
3. The relationship between his personal music and Arcanea Records' guardian artists
4. Recent conversations about brand architecture, social media, content curation
5. Wanting a synthesis of everything we've already decided across all chats

Let me search for the recent conversations about these topics.Let me pull the recent threads together first.
```
This block is not supported on your current device yet.
```

Good, I have the music distribution chat. Let me search for more recent conversations about brand architecture, social media, and content curation.
```
This block is not supported on your current device yet.
```

Let me search for the most recent conversations about brand architecture and the specific naming decisions.
```
This block is not supported on your current device yet.
```

Let me get the most recent conversation about music agent workflow and content distribution.
```
This block is not supported on your current device yet.
```

Now I have a comprehensive picture. Let me search for the most recent conversations to make sure I'm up to date.
```
This block is not supported on your current device yet.
```

Now I have a comprehensive view of everything. Let me synthesize this into a clear, actionable framework. Frank is asking for:

1. His personal music artist name decision
2. Music agent/workflow to handle distribution
3. A synthesis of all decided brand architecture
4. What still needs deciding

Let me build this out clearly.OK. I've pulled ~30 conversations spanning 6 months. Here's the full synthesis — what's decided, what's open, and the music identity question you're wrestling with.

---

## DECIDED (locked across conversations)

**Identity architecture:**

| Layer | Arcanea | FrankX.ai | AnimeLegends |
|-------|---------|-----------|--------------|
| **What it is** | The universe, the IP, the movement | You the architect, personal brand hub | Anime culture vertical |
| **Social voice** | @arcanea (collective mythic) | @frankx.ai (builder, human) | @animelegends (community hype) |
| **Trademark** | P0 — EUIPO Class 41+9 | P1 — personal mark | Deferred |
| **Legal entity** | Arcanea IP BV | FrankX Operations BV | Under FrankX Ops |
| **Vercel/GitHub** | Projects under `frankxai` org | `frankxai` = operations namespace | Projects under `frankxai` |

**Starlight Intelligence** = internal only, holding BV name, never customer-facing, never trademarked.

**Music architecture (decided March 28):**

| Artist Slot | Name | Genre Territory |
|-------------|------|-----------------|
| 1 | **Arcanea** | Cinematic, frequency, consciousness, orchestral, ambient |
| 2 | **Akamoto** | Japanese fusion, anime, DJ/electronic |
| 3 | **Nona** | Punk rock, edgy, sexy |
| 4-5 | Future | K-pop, trap, etc. |

**Distribution:** Single DistroKid Label plan (~$90/yr), all artists under one account. AI disclosure mandatory on every track.

**Content ops:** Four-voice system (Arcanea/Akamoto/FrankX/AnimeLegends), Lumina-Scribe agent built, full social media KB produced, Supabase schema designed, n8n workflows specified.

---

## THE OPEN QUESTION: Your Personal Music Identity

This is the thing you haven't resolved. The March 28 decision killed "FrankX" as a *music artist name* and kept it as the architect brand. But that left a gap: **where does Frank-the-pianist-since-age-five publish?**

Your piano compositions, your orchestral pieces, your personal emotional music — the stuff you share with your mom — that doesn't belong under "Arcanea" (too mythic/branded) or "Akamoto" (too character-driven) or "Nona" (too punk).

The real question is: **do you want to be visible as a musician, or invisible?**

**Option A: Publish as "Frank Riemer"** — your real name. This is the Ludovico Einaudi / Ólafur Arnalds path. Piano + orchestral + ambient under your birth name. Zero namespace collision. Maximum authenticity. Your mom shares it with pride. Your concert history at age 5 is the origin story. The introversion actually *works* here — mysterious classical/neo-classical composers don't need to be extroverts. The music speaks.

**Option B: Publish under "Arcanea"** — fold your personal compositions into the Arcanea artist. Simpler to manage. But dilutes the Arcanea brand with personal piano pieces that don't carry Guardian/frequency mythology. And it removes *you* from the music.

**Option C: Create a fifth artist slot** — something like "Riemer" or a new coined name. Adds complexity. Another brand to feed.

**My recommendation: Option A. Frank Riemer.** Your piano music is the most authentic thing you make. It doesn't need a brand wrapper. It needs your name on it. The Gorillaz model works for Akamoto and Arcanea — but the piano pieces are *you*, not a character. And "Frank Riemer" on Spotify creates a direct line between the human and the listener that no brand identity can replicate. Your introversion isn't a bug here — it's the aesthetic. Neo-classical artists are quiet. The music is loud.

---

## THE MUSIC AGENT

What you described — an AI assistant who receives your Suno links, handles distribution, posts to social channels, connects with playlist curators — is architecturally sound and buildable with your existing stack:

**Intake:** You share a Suno link (WhatsApp, Telegram, or a simple form on frankx.ai/music) → webhook triggers n8n workflow

**Processing:** n8n calls Claude API to classify the track (which artist slot? which mood? which platforms?), generate metadata (title, description, tags, AI disclosure text), create social captions in the right voice

**Distribution:** DistroKid upload (manual for now — no API), but social distribution is automatable: TikTok, Instagram Reels, YouTube Shorts, X, LinkedIn — all via Postiz/Blotato or n8n direct API calls

**Curation layer:** Your family/friends get a simple share link. They can forward, react, add to their own playlists. Your mom becomes your first superfan amplifier — not because you asked her to post, but because the system makes it effortless for her to share what she already loves.

The critical path: **catalog tagging first** (your 300+ Suno tracks need the schema: `track_id | artist_slot | mood | bpm | quality_rating`), then the intake workflow, then the distribution automation. Without the catalog structured, nothing downstream works at scale.

---

## WHAT STILL NEEDS DECIDING

1. **Your personal music artist name** — Frank Riemer vs. something else
2. **DistroKid setup execution** — Label plan, artist slots created, first batch uploaded
3. **Vercel team rename** — `starlight-intelligence` → `frankxai` (30 seconds, do it now)
4. **EUIPO SME Fund application** — requires BV to exist first. BV formation is the critical path blocker for everything trademark-related
5. **Community platform** — Circle rejected on cost, Discord rejected on fragmentation. Skool at €47/mo was last recommendation. Still unresolved.

Which of these do you want to move on first?

**Frank**:

Option A. Seams legit just considering how I show up and my music used and FUTURE. or it being FrankX but probably fully name better or better for recognition of my site and futuristic? And if I get successful and people want to have me as DJ or so not sure I should do this and have it under?

**Claude**:

Frank Riemer vs FrankX for music. Quick decision.Two different futures, two different names:

**Frank Riemer** = the pianist, the composer, the neo-classical artist. Einaudi model. Nobody hires Ludovico Einaudi to DJ. This name signals *listening music* — Spotify playlists, film scores, meditation soundtracks, concert halls eventually. Your mom shares "my son Frank Riemer" with pride. It's timeless.

**FrankX** = the producer, the DJ, the electronic act. If you ever want to DJ a set in Ibiza or Amsterdam, play a festival, or release house/techno — this is the name. It's a stage name. It connects to frankx.ai. It signals *performance energy*.

The real question: **are you building a listening catalog or a performance career?**

Given everything I know — your introversion, your piano roots since age 5, your Suno output being orchestral/cinematic/frequency-based, your midnight creation sessions alone — you're building a **listening catalog**. That's Frank Riemer.

If the DJ itch ever comes, that's what the Akamoto slot is for. Akamoto is already your electronic/fusion persona. If someone wants to book "FrankX" for a DJ set, they're actually booking Akamoto — the character who performs. Frank Riemer composes. Akamoto performs.

**Go with Frank Riemer.** It ages well, it's legally clean (your actual name), it connects your childhood concerts to your current work, and it keeps FrankX.ai purely as the architect brand without splitting its meaning across music and tech.

**Frank**:

I don't want to be called Akamoto still not sure about that name not sounding weird or good hahaha. Give me perspective. And then this is What I like. For me to be called just Frank is OK. Then we have brands. Arcanea. Starlight Intelligence. GenCreator (which ties mainly to FrankX.ai but soon will buy GenCreator.ai), Vibe Clubs to Vibe OS, and maybe Frank's Vibes is an artist or DJ? Nonaka better then Nona or but Alera also needs to be central voice of Arcanea or this part of our Guardian strategy for all 10 to also build Spotify for each.

**Claude**:

Lot to unpack. Let me address each piece cleanly.

**On "Akamoto"** — your hesitation is valid signal. If you can't say the name with pride on stage or in an interview, it's wrong. It was designed as the Prime Luminor's name in the lore, not as a music stage name. Those are different jobs. Lore names optimize for mythology. Stage names optimize for mouth-feel, memorability, and how it looks on a poster. "Akamoto" sounds like a Japanese surname you're borrowing, which creates cultural friction you don't need.

**"Frank's Vibes"** as your DJ/electronic persona — that's actually clean. Casual, warm, immediately communicates the energy. "Frank's Vibes" on a festival lineup reads well. "Frank's Vibes" as a Spotify artist next to "Frank Riemer" the composer creates a clear split without needing a fictional character. One is the man at the piano. The other is the man behind the decks. Both are you.

**The full artist architecture then becomes:**

| Slot | Name | Territory | Identity |
|------|------|-----------|----------|
| 1 | **Frank Riemer** | Piano, orchestral, neo-classical, ambient | You, the composer |
| 2 | **Frank's Vibes** | Electronic, house, DJ sets, lo-fi | You, the producer |
| 3 | **Arcanea** | Cinematic, frequency, Guardian mythology | The world speaks through sound |
| 4 | **Nona/Nonaka** | Punk, edgy, sexy | Character artist |
| 5+ | Future | K-pop, trap, etc. | TBD |

**On Nona vs Nonaka** — Nonaka is a real Japanese surname (野中), which creates the same cultural borrowing problem as Akamoto. Nona is cleaner — it's Latin (means "ninth"), it's punchy, it works as a punk name, and it doesn't pretend to be Japanese. Keep Nona.

**On Alera and the 10 Guardians on Spotify** — this is the bigger architectural question. You have two paths:

**Path A: All 10 Guardians get Spotify artist profiles.** Each Guardian releases frequency-specific music under their own name. Alera at 528Hz releases vocal/harmonic music. Lyria at 639Hz releases ethereal/seer music. This is the *franchise play* — 10 parallel music brands compounding simultaneously. It's beautiful architecturally. But it requires 10x the catalog production, 10x the cover art, 10x the metadata management. And it fragments your early listener base across 10 tiny profiles instead of concentrating it.

**Path B: All Guardian music publishes under "Arcanea" the artist, tagged by Guardian.** One Spotify profile, one growing listener base, albums or EPs named after each Guardian. "Arcanea — Alera: Voice of the Heart (528Hz)" as an album title. Listeners discover ONE artist and then explore the Guardian dimensions within it. This is how film composers work — Hans Zimmer doesn't create a separate Spotify for each film franchise.

**My recommendation: Path B now, Path A later.** Concentrate all Guardian/frequency music under the single "Arcanea" artist. Build the listener base to 10K+ monthly listeners. Then — if there's demand and the catalog is deep enough — you can spin individual Guardians into their own profiles as "Arcanea presents: Alera" or similar. But splitting 10 ways at zero listeners is strategic suicide.

Alera still becomes the *central voice* of Arcanea's music — she's 528Hz, the love frequency, the most universally accessible Guardian. Her tracks anchor the Arcanea artist profile. But she doesn't need her own Spotify to do that.

**Summary of what's now locked:**

- **Frank Riemer** = composer
- **Frank's Vibes** = DJ/electronic producer  
- **Arcanea** = all Guardian/frequency/cinematic music (Alera as lead voice)
- **Nona** = punk/edgy character
- **Akamoto** = retired as music name, stays as lore character only

Does this land?

**Frank**:

Y so what's all we need to build distrokid, own emails, social accounts and more or how all interconnects and manage

**Claude**:

Let me build the full operational map.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now let me build the comprehensive operational map.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

The full operational map — tap through all four tabs:

**Artists** — each slot with their social accounts, email, content types, cover art direction, and priority level. Tap any artist to expand.

**Infrastructure** — everything you need to set up: DistroKid, Spotify for Artists, email aliases, SoundCloud accounts, catalog schema, cover art pipeline, the n8n music agent. Red = blocked, green = already active, gold = needs action.

**Launch Plan** — 4-week execution sequence with checkboxes. Week 1 is foundation (DistroKid signup + track selection), Week 2 is first releases, Week 3 is claiming profiles, Week 4+ is scaling.

**Connections** — how everything maps: frankx.ai → Frank Riemer + Frank's Vibes, arcanea.ai → Arcanea + Nona, frankxai = operations namespace, Starlight = always invisible plumbing.

The single blocker that gates everything: DistroKid Ultimate plan at $89.99/yr gives you 5 artist slots with unlimited uploads. Sign up, create the four profiles, and the Spotify artist pages auto-generate when the first release goes live. Everything else cascades from that.
