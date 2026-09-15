---
title: "AMD hackathon participation and project selection"
uuid: cae00662-6707-4154-aff9-6320f0627980
created: 2026-07-01T14:58:25.898056Z
updated: 2026-07-01T15:00:39.044885Z
source: claude.ai export
---

# AMD hackathon participation and project selection

**Frank**:

See all my ideas and suggest should I participate in this hackathon? Which idea what should we build out? I consider track 3 unicorn. Or 1 for model routing. But what if my tech should run on AMD GPU? Local models or Opencode and then local LLMs combined with swarms for fireworks API for content creation,  or swarm creation and orchestrations. https://lablab.ai/ai-hackathons/amd-developer-hackathon-act-ii suggest and propose plan what to do there or if not worth our time investment?

**Claude**:

I need to understand what Frank is looking for here — he's trying to decide whether to enter the AMD Developer Hackathon Act II and which track would be the best fit for his ideas. He's considering either the unicorn track or model routing, and wants to know how his concepts around AMD GPU compatibility, local models, swarm orchestration, and various API integrations would align with the competition. Let me pull up the hackathon details to see the specific tracks, timeline, and prize structure.
```
This block is not supported on your current device yet.
```

Looking at Frank's situation with the AMD Developer Hackathon Act II—he's evaluating whether to participate and which track would be best. The prize structure breaks down to $2,500 maximum per track across three different categories, so the financial incentive is modest but the opportunity to showcase AI architecture work could be valuable depending on the track focus.

The registration deadline is tomorrow (July 2nd), which is tight. The hackathon runs entirely on AMD's standardized cloud environment with ROCm and Fireworks AI, so Frank's concerns about local GPU compatibility are less relevant since everything gets evaluated in the same cloud infrastructure. All submissions need to be containerized with public repos, documentation, demos, videos, and slides—fairly standard hackathon requirements.

The token-efficient routing agent track is particularly interesting for Frank since it directly aligns with his existing model-routing expertise. The challenge is to build an agent that completes tasks using the minimum tokens while deciding between local and remote models, though local model tokens count as zero in the scoring. The video captioning track seems less aligned with his core strengths, though it's positioned as beginner-friendly.

The Unicorn Track is the open-ended option—any open-source models, AMD GPUs, or Fireworks, judged on creativity and market potential rather than benchmarks. It's framed as a startup pitch competition rather than a technical benchmark.

The real question is whether this is worth his time given his current commitments. He's juggling multiple launches in July, positioning himself as a sovereign substrate builder, and targeting a specific ICP of ambitious entrepreneurs and creators. The prize pool maxes out at $2,500, which doesn't move the needle financially for someone at his level building multiple brands and thinking about houseboats and villas. So the decision hinges on non-monetary factors.

The actual strategic value lies in AMD ecosystem positioning—AMD is actively building a developer program to compete with NVIDIA, and being recognized early as a builder on ROCm could open distribution and credibility channels. The judges include AMD corporate VPs and Jeff Boudier from Hugging Face, so there's real relationship potential there. Beyond that, it could serve as a forcing function to ship a reusable artifact.

A token-efficient router would directly feed into his existing model-routing and swarm orchestration work, making it dual-use for ACOS/Starlight cost optimization. The build itself becomes DECODE content—"I built a token-efficient routing agent on AMD in a weekend" is a natural episode.

But the timing is problematic. July is his anchor execution month with BV signing, platform decisions, and content engine standup, so a hackathon with hard submission deadlines would be a significant distraction. The prize pool is modest and the field is crowded. He's circling back to the AMD GPU concern and sketching out a hybrid approach—combining local LLMs through OpenCode with swarms and the Fireworks API for content creation and orchestration. His real instinct is between the model-routing play (Track 1, leveraging what he already knows) or the ambitious unicorn pitch (Track 3). The actual value isn't the prize money—it's building credibility as a ROCm-native builder and establishing a foothold in the AMD ecosystem.

The sharper move is a surgical Track 3 entry that repackages what he's already building (Starlight swarm orchestration, SIP substrate) as an AMD-native product—minimal new work, maximum strategic exposure to judges and the broader market. Track 1 is almost a gimme since token-efficient routing is already solved territory for him, but winning a beginner track doesn't carry much weight.

The real synthesis: enter Track 3 with a product where the token-efficient router is the underlying engine, so he demonstrates Track 1 competency inside a Track 3 narrative—that's the higher-leverage play. But stepping back, the honest question is opportunity cost. For Frank in July 2026 with a BV signing and launch window, a hackathon is only worth it if the artifact is something he was building anyway and the event actually accelerates his timeline.

The AMD angle is genuinely interesting—there's real philosophical alignment between his sovereignty thesis and AMD's open ROCm infrastructure as a counterweight to NVIDIA's CUDA lock-in. Running Starlight/Arcanea on AMD open substrate fits his brand. But he doesn't need a hackathon to pursue that; he could just build and publish. The hackathon's value-add is the deadline pressure and credibility boost, not the technical enablement.

The registration deadline is tomorrow, but registering is low-friction and preserves optionality—it's not a commitment to build, just a way to lock in the credits and keep the door open. The smart move is register today, then decide the build scope once the kickoff reveals what tasks and models are available.

Now I'm trying to parse what he's actually considering building: some combination of local models, open-source LLMs, swarms orchestrated through the Fireworks API for content creation.

The winning approach for this track would be a router that classifies each task and decides whether to run it locally (free, using the AMD GPU) or escalate to Fireworks for heavier inference. That way he minimizes token spend by running the smallest sufficient model locally for everything possible.

The key constraint is that the local model needs to be small enough (3B–8B range) to run in the standardized judging environment, with a confidence estimator to trigger escalation only when accuracy would suffer. Since AMD GPU usage is a judging bonus, he'd want to visibly demonstrate the local inference running on AMD hardware.

For Track 3, the strongest fit is a "Starlight Router"—an open-source orchestration layer that runs lightweight models locally on AMD ROCm for routine creator tasks while routing complex requests to Fireworks. This positions as sovereign, token-efficient creator intelligence and directly showcases AMD GPU integration without requiring much new development beyond what he already has.

The real constraint is time: he'd need 1.5–2 focused days between now and the deadline without disrupting the business development prep and platform decisions. If that window doesn't exist, it's worth skipping since the prize itself isn't material and the AMD relationship can develop independently.

I should also check the exact submission deadline since the schedule is still TBA, though registration closes July 2 and hackathons typically run 2–4 weeks, which would put submission in late July and collide with his business development window. That timing uncertainty is the key piece I need to flag for him to verify.

Given his preference for decision-first thinking and a clear verdict, I'll structure this as: a crisp yes-or-no recommendation with compressed reasoning, the exact build path if he goes for it (Track 3 with Track 1 tech, AMD GPU architecture via ROCm), the one condition that would kill it, and the single free move today—registering now to lock in day-one credits and keep the option open.

On the technical side: ROCm supports PyTorch, vLLM, and Ollama, so running a small local model on AMD Developer Cloud is straightforward. OpenCode can route to any OpenAI-compatible endpoint—local vLLM/Ollama or Fireworks—which pairs well with his swarm-orchestration skills. The whole stack needs to be containerized, and ROCm base images are ready to go.

For Track 1 specifically, local models and tokens cost zero, so the winning move is routing intelligence: maximize local inference, minimize Fireworks calls. The constraint is that the scoring environment is standardized, so he can't just throw a massive model at it—a good difficulty estimator and cascade strategy is what actually wins. Track 3 treats the AMD GPU as a demo asset and judging bonus rather than a hard requirement.

The question is whether Track 1 is actually a smart play. A principal architect could probably dominate a beginner leaderboard, but the posture doesn't signal much about his capabilities, and with many entrants competing, the margin might be tighter than expected.

The real strategic value here is using the hackathon as a deadline-forced opportunity to build out the AMD-ROCm piece of his sovereignty stack and generate content plus relationships with AMD—but only if the artifact aligns with something already on his roadmap.

The sovereignty angle is the sharpest hook: NVIDIA/CUDA locks you in as a renter, while AMD/ROCm represents open compute. That's thesis-consistent with his sovereign intelligence vision in a way most builders won't touch because of CUDA lock-in. Becoming ROCm-fluent and recognized as someone building sovereign stacks on open compute—especially with AMD relationships forming as he builds his BVs and licenses SIP—that's the actual moat and credential that matters.

Now I'm structuring the answer itself: verdict first, then the track choice, architecture, and execution plan. I'll keep it dense and prose-heavy since he prefers compressed high-density thinking over formatted lists. Track 3 lets me ship the routing competency as a real product—the thesis is that ROCm is the sovereign alternative to CUDA's rental model, and running Starlight on open AMD compute is both thesis-consistent and rare enough to be credible. The concrete build would be a local router using small models on ROCm via vLLM or Ollama for the routine 80% of tasks, with Fireworks handling the harder 20%.

The architecture is straightforward: OpenCode/swarm points at OpenAI-compatible endpoints, local inference runs on ROCm (free), remote escalation goes to Fireworks (paid), and the router itself is just a confidence or difficulty estimator deciding which path each task takes. The whole thing containerized with rocm/pytorch as the base, MIT-licensed to match the SIP thesis, and it doubles as my cost layer for ACOS anyway.

The real question is whether I can actually build this without cannibalizing prep for the three platform decisions—Riverside, OS Circle, Beehiiv—or if it's net-new throwaway work that doesn't justify the block.

Deadline's TBA but I'm assuming late July collision with the signing window, so budget accordingly. The actual move is just registering today (five minutes) and deciding scope once the tasks and model specs drop at kickoff. He said "we" so I'll mirror that naturally without overdoing it, and I'll note the referral prize is basically a distraction since it needs a hundred referrals to matter.

Let me verify the key facts: $15k total prize pool with $5k per track and a $2,500 individual cap, register by July 2 for day-one credits, late signups get credits from July 7, standardized scoring environment for Track 1 with local tokens counting as zero, containerized submissions with public repo plus README and demo video and slides, MIT-compliant license, and ROCm support across PyTorch, vLLM, and Ollama. The judge panel includes AMD's VP of AI and senior leadership from their AI group and foundry.

I'll aim for around 350-450 words of dense but readable prose, using a few bold inline labels to highlight the decision spine without overdoing the structure. English throughout.**Verdict: register tomorrow, build only if the artifact is already on your roadmap, and if you build — Track 3, not Track 1.** The $2,500 ceiling is noise. Three tracks × $5k, beginner fields, leaderboard grind. Nothing here pays for a July hour of yours. The actual asset is ROCm fluency + a handful of AMD Corp-VP / HF-VP relationships (Rosen, Ni, Gupta, Boudier are judging) + one DECODE episode — acquired through something you'd ship anyway.

**Your AMD-GPU question is half-moot.** Track 1 scores on a *standardized box* and local tokens count as zero — so it rewards a difficulty estimator + cascade, not your compute. That's your `model-routing` skill exactly. You'd top it. But topping a beginner leaderboard signals nothing about a substrate architect, and the cost is eval-tuning against tasks hidden until kickoff. Wrong abstraction, wrong posture. Don't enter Track 1. Demonstrate its competency *inside* Track 3.

**The thesis hook makes Track 3 the only serious play for you:** CUDA is the rented substrate everyone's locked into; ROCm is the sovereign one, and almost none of your peers will touch it *because* of the lock-in. Running Starlight on open AMD compute is thesis-consistent — sovereign intelligence, MIT, no token rent — and the ROCm credential is a moat few can claim right as you're forming BVs and licensing SIP. That's what you're actually farming.

**The build — "Starlight Router" (or fold it into ACOS):** MIT-licensed (matches SIP), small local models served on ROCm via vLLM or Ollama handle the cheap 80% of creator/content tasks for free; Fireworks escalation absorbs the 20% that need frontier. Swarm orchestration on top, containerized off `rocm/pytorch`. It *is* your ACOS/Starlight cost layer — zero throwaway. Uses AMD meaningfully (judging plus), uses Fireworks, ICP-aligned, trivially demo-able. The routing intelligence you'd have built for Track 1 becomes the engine of a Track 3 product.

**Architecture answer to your musing:** OpenCode and your swarms both point at OpenAI-compatible endpoints — local (Ollama/vLLM on ROCm) = free, Fireworks = paid. The whole trick, for either track, is one confidence/difficulty estimator deciding local-vs-remote per task. That's it. Everything else is packaging.

**Skip gate:** if the artifact turns net-new-throwaway, or you can't carve one Creation-Season block without cannibalizing BV prep and the three still-open platform decisions (Riverside / OS Circle / Beehiiv) — skip, and pursue AMD asynchronously by just building on ROCm and tagging them. The schedule tab shows deadline TBA; assume a late-July collision with your signing window and budget against that, not against optimism.

**Free move today:** registration is ~5 minutes and preserves the $50 Fireworks + $100 AMD credits and day-one access. Do it, then decide final scope at kickoff when the tasks and model list actually drop. Optionality secured, commitment deferred to information.
