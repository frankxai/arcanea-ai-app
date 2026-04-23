---
title: Three-Pile Portfolio
aliases: [three-bucket, capital structure, optionality stacking]
tags: [atom, wealth, business]
status: stable
domain: wealth
created: 2026-04-21
links:
  - [[../frameworks/karpathy-llm-wiki]]
  - [[../concepts/wealth-velocity]]
  - [[../../00-MOCs/MOC-Patterns]]
---

# Three-Pile Portfolio

Structure capital into three piles: runway (12-24mo cash), compound (index + crypto core), asymmetric (concentrated bets).

**Pile 1: Runway (12-24 months cash).** Bank accounts, bonds, stablecoins. Nothing fancy. This is your optionality. This is your "I can say no" fund. When runway drops below 18 months, you contract or earn until it's back. When it hits 24 months, you re-deploy into piles 2 or 3. For Frank: €180K from Trinity deal + €30K/mo freelance income = 36mo runway. That's the ceiling. Target is 18-24mo.

**Pile 2: Compound (index + crypto core).** The bulk of medium-term capital. Index funds (MSCI World, S&P 500) + Bitcoin + Ethereum + maybe one small-cap crypto thesis. Not for yield-farming or DeFi (too risky, too time-intensive). Just boring accumulation. This grows at 8-15% per year with low management overhead. For Frank: ~40% of liquid net worth, split 60/40 stocks/crypto, no leverage.

**Pile 3: Asymmetric (concentrated bets).** 5-15% of liquid net worth, allocated to things with 10-100x upside and 0-100% downside. Biotech startups. Early crypto tokens. Frank's own Arcanea (unrealized but internally valued ~$2-5M, subject to vesting over 5 years). Pre-seed rounds you believe in personally.

The rebalancing rule: every 90 days, compute (Pile 1 + Pile 2 / 2) → if Pile 1 < 18mo, stop trading Pile 3. If Pile 1 > 24mo, move excess to Pile 2. If Pile 2 drops below floor (say, 50% of liquid net worth), liquidate Pile 3 to restore it.

The leverage: this structure lets you be aggressive (Pile 3) without blowing up (Pile 1 protects you), and it lets you compound (Pile 2) without capital starvation (you can always fund Pile 3 from Pile 1 if the bet is hot).

## Related
- [[../concepts/wealth-velocity]] — how velocity flows across piles
- [[../../00-MOCs/MOC-Patterns]] — portfolio construction
