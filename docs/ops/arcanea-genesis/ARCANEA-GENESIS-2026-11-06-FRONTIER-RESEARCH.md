# Arcanea Genesis — Frontier Research (creator economy, programmable IP, provenance)

Date: 2026-11-06. Companion to the Reality Audit and the Architecture & Plan. Every external claim links to the source read this session; figures are as the source states them. Each section ends with the implication for Arcanea.

---

## 1. The NFT market Arcanea would be entering

- Blur, once the largest Ethereum NFT marketplace, shuts its website on 12 Nov 2026 after monthly volume fell from ~$1.43B (Mar 2023) to under $7M (Mar 2026), a >99.5% decline; it charged traders nothing and recorded $0 protocol revenue over three years ([CoinDesk](https://www.coindesk.com/tech/2026/10/13/once-largest-ethereum-nft-marketplace-blur-is-shutting-down-after-volumes-collapse-99)).
- Abstract, the consumer L2 built by Pudgy Penguins' parent Igloo, shuts on 15 Dec 2026 after losing "tens of millions"; Igloo declined to launch a token "without conviction" ([The Block](https://www.theblock.co/news/ecosystems/2026-10-06-abstract-ethereum-layer-2-shutting-down-pudgy-penguins-igloo-417855)).
- fxhash, the generative-art platform, closed on 17 Aug 2026 ([Right Click Save](https://www.rightclicksave.com/article/farewell-to-fxhash-a-heartbreaking-moment-in-the-history-of-digital-art)).
- NFT sales were $181.6M in Oct 2026 vs $6.05B in Jan 2022; Pudgy Penguins' floor is down 96.4% from its record, BAYC 96.9% ([BlockchainReporter](https://blockchainreporter.net/are-nfts-dead/)).
- Of 56 notable marketplaces launched 2017–2023, 21 still trade; OpenSea fee revenue fell from $1.55B (2022) to $25.1M (2025); Zora removed NFT minting in Feb 2025 in favour of "content coins" ([CryptoDiffer](https://cryptodiffer.com/feed/project-updates/nft-market-2026-marketplaces-survival)).
- OpenSea charges 1% on NFT sales; over 90% of its Oct 2025 volume was fungible-token trading; its SEA token launch was postponed with no new date by Oct 2026 ([NBTC](https://news.nbtc.finance/is-it-still-the-best-nft-marketplace/)).
- Royalties: OpenSea offers optional or enforced creator earnings (max 10%); enforcement needs ERC721-C/ERC1155-C contracts and is honoured only by marketplaces using Limit Break's payment processor ([OpenSea Help](https://support.opensea.io/en/articles/8867026-how-do-i-set-creator-earnings-on-opensea)); ERC-2981 records but does not enforce royalties; top-10 collection royalty income is down roughly 60% from the 2022 peak ([CryptoGrows](https://cryptogrowsnews.com/learn/nft-royalty-wars-2026/)); Limit Break's reference implementation is open source ([GitHub](https://github.com/LimitBreakInc/creator-token-standards)).

Implication: secondary-market royalties are not a business model. The mission's own rule — "Do not mistake secondary trading volume for creator revenue" — is now the market's consensus. First-party sales (TRUTH.md: Polar/Whop/Stripe/Etsy/Gumroad) come first; any token is a benefits pointer, which is how `arcanea.token-holder-benefits.v0` is defined.

## 2. What the survivors actually do

- Pudgy Penguins reports over 5M fans across social platforms and monetises via licensed toys, a party game with PlayMonster and branded claw machines at Urban Air parks — a consumer-products business where the NFT is the origin story, not the product ([License Global](https://www.licenseglobal.com/new-media-social/10-minutes-with-pudgy-penguins-on-the-collector-couple-initiative-and-the-pudgy-paradox-)).
- Art Blocks added an MCP server in Mar 2026 so agents can discover projects and scaffold scripts, created the "Art Blocks 500" canon of its first 500 releases, and refused an AI agent's application to release work: agents "aren't eligible to release work" — the artist side "remains human for now" ([Right Click Save](https://www.rightclicksave.com/article/art-blocks-embraces-ai-agents-jordan-lyall-interview)). About 90% of its projects are fully on-chain, framed as preservation ([Art Blocks](https://www.artblocks.io/articles/true-on-chain-preservation-a-four-year-journey)).
- Art Basel's collector survey: 51% of 3,100 HNW respondents bought a digital artwork in 2025; digital/film/video rose to 3% of transactions and 10% of sales value; reported Zero 10 sales ranged from USD 2,500 editions to a USD 500,000 John Gerrard ([Art Basel](https://www.artbasel.com/stories/art-basel-2026-digital-art-collectors-zero-10)).
- Physical-backed tokens are where volume went: Collector Crypt reported Q3 2026 revenue of $433.5M at a 5.9% gross margin, with marketplace trading only ~2% of the business ([Binance Square](https://www.binance.com/en/square/post/10-13-2026-collector-crypt-reports-record-third-quarter-revenue-of-433-5-million-and-gross-profit-of-25-4-million-376665034404212)); paid pack openings need FTC/CAP disclosure, and New York sued Valve in Feb 2026 over resellable loot boxes ([Surgence](https://surgence.io/blog/onchain-gacha-report)).

Implication: the durable patterns are (a) a human-authored canon with a curated "500"-style edition list, (b) licensing the world into other media, (c) low-margin physical-digital commerce that Arcanea should not chase. Art Blocks' human-artist rule matches Arcanea's canon rule: agents produce candidates, humans release.

## 3. Programmable IP

- Story Protocol rebranded to the DATA Foundation on 25 Jun 2026, pivoting from IP licensing to AI-training-data registries, with a token swap $IP → $DATA ([CoinDesk](https://www.coindesk.com/business/2026/06/25/a16z-backed-crypto-firm-rebrands-shifts-focus-to-solving-ai-s-global-copyright-headache)); $IP had fallen ~98% from its high ([Tiger Research](https://reports.tiger-research.com/p/ip-fell-98-data-was-the-last-card-eng)); in Oct 2026 DATA announced it will retire its own chain and migrate to Sui ([Cointelegraph](https://cointelegraph.com/news/data-network-to-migrate-to-sui-retire-its-own-chain)).
- ERC-7496 (dynamic traits) lets on-chain traits override metadata and gate sales on trait values ([Ethereum ERCs](https://ercs.ethereum.org/ERCS/erc-7496)) — useful for "benefit consumed" states if a token layer ever ships.
- Base processes ~9.9M tx/day with ~351K daily active addresses ([growthepie](https://www.growthepie.com/chains/base)); a Base network token is still only "exploring" with no date ([CryptoTicker](https://cryptoticker.io/en/base-token-base-chain-ecosystem/)).
- Filecoin Onchain Cloud offers verifiable storage from $2.50/TiB/month per copy with proofs every 24 hours ([Filecoin](https://filecoin.io/blog/filecoin-onchain-cloud-is-live-on-mainnet)).

Implication: the "programmable IP chain" category Arcanea's older docs assumed (Story) no longer exists in that form. A licence is enforceable because a human signed it and a court recognises it, not because a contract emitted it. Keep rights in a signed manifest; treat any chain as an optional registration layer with the disclaimer the validator enforces.

## 4. Provenance and disclosure standards

- C2PA Content Credentials 2.4; the Conformance Program launched 4 Jun 2025 and by 14 May 2026 54 products from 31 companies had passed; "valid" (intact) is distinct from "trusted" (signer on the Trust List) ([C2PA Deployment Guidance v1.0](https://c2pa.org/wp-content/uploads/sites/33/2026/07/Content-Credentials-Deployment-Guidance.pdf); [C2PA 2.2 explainer](https://spec.c2pa.org/specifications/specifications/2.2/explainer/Explainer.html)).
- OpenAI became a C2PA Conforming Generator Product, added SynthID watermarks to images and (Jul 2026) audio, and extended provenance to text in the EU for AI Act compliance ([OpenAI](https://openai.com/index/advancing-content-provenance/)).
- Creative Commons: CC licences are scoped to copyright and cannot add AI-training restrictions without losing the CC mark; CC Signals shifted from preference signals to structural interventions ([CC, Apr 2026](https://creativecommons.org/2026/04/23/update-on-cc-signals-what-changed-and-why/); [CC guidance, Sep 2026](https://creativecommons.org/2026/09/03/guidance-on-using-cc-licenses-in-an-ai-ecosystem/)).

Implication: the manifest's `disclosure.machineReadableMark` (c2pa / synthid / both) and `c2paManifestRef` fields map directly onto these; Arcanea's Luminor CC-BY-NC assets cannot carry an "no AI training" rider and still be called CC — hence the `aiTraining` permission lives in Arcanea's own templates, not in CC.

## 5. Copyright in AI-assisted work

- US Copyright Office, Part 2 (29 Jan 2025): no protection for "purely AI-generated material" or where there is "insufficient human control over the expressive elements"; over a thousand works registered with disclaimed AI material ([Library of Congress](https://blogs.loc.gov/copyright/2025/05/a-i-art-and-copyright-the-human-element-that-makes-all-the-difference/); [USCO AI page](https://www.copyright.gov/ai/)); Thaler's cert petition was filed 9 Oct 2025 ([Supreme Court docket](https://www.supremecourt.gov/DocketPDF/25/25-449/379262/20251009132618528_Thaler%20v%20Perlmutter%20-%20Petition.pdf)).
- EU: the EPRS briefing (21 Oct 2026) summarises Prague (2023), Frankfurt (Dec 2025, lyrics vs AI music treated separately), Munich (Feb 2026) and Düsseldorf (Apr 2026): creative human influence must be reflected in the output; merely selecting AI suggestions is insufficient; Italy's 2025 AI law protects AI-assisted works with substantial human contribution ([EPRS](<https://eprs.europarl.europa.eu/EPRS_BRI(2026)796995>)).
- EU AI Act Art. 50 applies from 2 Aug 2026: providers must machine-mark synthetic output; deployers must disclose deepfakes, with a light-touch rule for evidently artistic works ([AI Act Explorer](https://artificialintelligenceact.eu/article/50/); [Commission guidelines, Jul 2026](https://digital-strategy.ec.europa.eu/en/news/commission-publishes-guidelines-transparency-obligations-providers-and-deployers-certain-ai-systems); [Code of Practice, Jun 2026](https://digital-strategy.ec.europa.eu/en/news/commission-publishes-code-practice-marking-and-labelling-ai-generated-content)).

Implication: Arcanea's own rule ("a licence to sell AI output is not copyright in it") is the legally safe position in both the US and the EU. The manifest therefore distinguishes `copyrightClaim: claimed | partial | unclaimed | uncertain`, and the Living Cosmos draft claims only the booklet text, selection and arrangement.

## 6. Tool terms that govern the corpus

- Suno: from 3 Sep 2026 Pro gets 20 downloads/month and Premier 60; songs downloaded on paid plans may be used commercially; trial downloads are personal-use only; prior models are retired ([Suno](https://suno.com/blog/suno-updates-tos)); Suno v6 ships with Warner/BMG partnerships at $8/$24 tiers ([Reuters](https://www.reuters.com/legal/litigation/suno-releases-new-ai-music-models-partnership-with-warner-music-bmg-2026-09-09/)).
- Midjourney: users own the images they create; a business grossing over USD 1M/year needs a Pro or Mega plan; Midjourney explicitly will not advise on copyright ([Midjourney docs](https://docs.midjourney.com/hc/en-us/articles/27870375276557-Using-Images-Videos-Commercially)).

Implication: 845 Suno tracks created under earlier models and plans need per-track evidence of the plan in force at download time before any commercial licence; the RM004 rule makes this a hard stop for commercial grants and a warning otherwise.

## 7. Commerce rails

- Polar acts as merchant of record (VAT/GST/US sales tax, EU OSS registration in Ireland) ([Polar](https://polar.sh/features/merchant-of-record)).
- Whop: median product makes $74/month and ~88% of products have zero revenue; fees ~5.7% + $0.30 for typical gated sales ([The Course Times](https://www.thecoursetimes.com/story/whop-says-its-sellers-average-8-413-a-month-the-median-product-makes-74)); raised a $200M Series D at $5.1B ([ValueAdd VC](https://valueaddvc.com/pulse/whop-200m-series-d-5-1b-valuation-2026)).
- Gumroad runs with 14 people and has paid creators over $1B ([Gumroad](https://gumroad.com/blog/p/what-we-shipped-what-s-next-and-our-2026-annual-meeting)).
- Roblox Creator Store pays 100% of net proceeds in USD, models $2.99–$49.99, plugins $4.99–$249.99; opt-in only for AI training ([Roblox](https://create.roblox.com/docs/en-us/production/creator-store)). Unity Asset Store bans NFT-purpose submissions and runs a two-strike policy on undisclosed AI content ([Unity](https://unity.com/legal/asset-store-content-transparency)).
- Crossmint: from 1 Jul 2026 fungible-token checkout is unavailable to EEA/UK/Brazil buyers; NFT checkout remains; $2,000/user/day standard limit ([Crossmint](https://docs.crossmint.com/payments/introduction)).
- Agent payments: x402 moved to a Linux Foundation foundation in Apr 2026, $0.001 per settled transaction after 1,000 free ([Coinbase CDP](https://docs.cdp.coinbase.com/x402/support/faq)); Google donated AP2 to the FIDO Alliance with "Human Not Present" payments ([Google](https://blog.google/products-and-platforms/platforms/google-pay/agent-payments-protocol-fido-alliance/)).

Implication: Polar as MoR fits an Amsterdam sole proprietorship selling EU-wide; marketplace distribution (Roblox/Unity) needs the `arcanea.marketplace-distribution.v0` template plus mandatory AI disclosure; agent-to-agent payments are real but have no user need at Arcanea yet.

## 8. Community infrastructure

- Discourse launched a Free hosted plan (Jul 2026) with unlimited members ([Discourse](https://blog.discourse.org/2026/07/introducing-the-discourse-free-plan/)) and is "agent-ready" with MCP/llms.txt ([Discourse](https://blog.discourse.org/2026/05/discourse-is-agent-ready-heres-how/)).
- Farcaster changed owners twice in 2026 (Neynar in Jan, Network School in Oct) and will be renamed Network State Protocol ([Crypto Briefing](https://cryptobriefing.com/network-school-acquires-farcaster-network-state-protocol/)). Discord filed confidentially for an IPO on 6 Jan 2026 ([ValueAdd VC](https://valueaddvc.com/blog/is-discord-profitable-2026-adjusted-ebitda-ipo-filing)).

Implication: do not build a community platform. If/when a community surface is approved, Discourse Free is the zero-cost, zero-vendor-risk default.

## 9. Creator-economy baselines

- 56% of full-time US creators earn below ~$44k; paid memberships rose from 54% to 88% of creators; typical paid community pricing $26–$50/month; 32% of consumers say AI content hurt trust in creator partnerships ([SocialDay](https://socialday.live/features/creator-economy-hits-323bn-but-56-of-full-time-creators-still-earn-below-living-)).
- Kickstarter Publishing raised >$45M in 2025, its second-biggest year ([Kickstarter](https://updates.kickstarter.com/a-year-in-review-2025-kickstarter-highlights/)); Patreon has paid over $10B cumulatively ([Axios](https://www.axios.com/2025/08/05/patreon-10-billion-creator-economy-ai)).

Implication: Arcanea's durable value is the human-authored world and its curation, sold first-party, with disclosure as a trust asset rather than a liability. Memberships are the proven recurring model — but TRUTH §2 currently forbids subscriptions until a product gate passes.

## 10. Domain note

Unstoppable Domains cancelled its own ICANN applications for `.nft` and eight other TLDs in Aug 2026, so Web3 names like `arcanea.nft` will not become public DNS ([Domain Name Wire](https://domainnamewire.com/2026/08/26/unstoppable-domains-new-tlds/)).
