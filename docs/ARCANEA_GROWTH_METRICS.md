# Arcanea Growth Metrics

Status: analytics operating spec. Measure the smallest set of events that changes product, offer, and release decisions.

Updated: 2026-06-26

## Metric Philosophy

Arcanea should not measure attention addiction. It should measure meaningful return:

```text
Did the creator make proof?
Did the world become more coherent?
Did ownership and rights become clearer?
Did the creator return to continue or publish?
```

## Funnel Map

| Stage | User question | Product proof | Core metric |
|---|---|---|---|
| Awareness | What is Arcanea? | Promise understood. | qualified visits |
| Intent | Can this help my world? | Call submitted. | call submit rate |
| Activation | Did I get something real? | Gift + proof artifact. | first gift completion |
| Ownership | Is this mine? | Export or SIS record. | ownership action rate |
| Monetization | Can this become value? | Package CTA or checkout. | package intent rate |
| Retention | Does the world remember? | Return mission. | week-2 proof return |
| Referral | Can I show this? | Shared world/proof. | proof share rate |

## Executive Scorecard

Review weekly.

| Metric | Owner | Decision |
|---|---|---|
| First Gift completion rate | Product | Improve onboarding or generation quality. |
| Median time to proof | Product/Engineering | Reduce steps, latency, or confusion. |
| World Seed save rate | World Engine | Improve seed quality and editing. |
| Export/ownership click rate | Trust/Product | Clarify ownership promise. |
| Package CTA rate | Forge/Growth | Improve offer fit. |
| Week-2 proof return | Product/Growth | Improve next mission and memory. |
| Cost per activated world | Engineering/Finance | Tune models and caps. |
| Right Use review failure rate | Publishing/Rights | Improve source and license capture. |

## Event Taxonomy

Use stable, human-readable event names.

| Event | Required properties |
|---|---|
| `landing_viewed` | route, variant, referrer_group |
| `genesis_cta_clicked` | route, cta_label, variant |
| `first_session_started` | source, variant, auth_state |
| `call_submitted` | drift_face, mission_lane, length_bucket |
| `gift_generated` | gift_type, model, latency_ms, cost_bucket |
| `gift_accepted` | gift_type, edited |
| `world_seed_generated` | model, latency_ms, characters_count, laws_count |
| `proof_created` | artifact_type, mission_lane, time_to_proof_sec |
| `sis_record_created` | canon_status, rights_state, exportable |
| `ownership_viewed` | canon_status, rights_state |
| `export_clicked` | export_format, world_state |
| `package_recommended` | package_name, trigger |
| `package_cta_clicked` | package_name, price_rung |
| `share_clicked` | artifact_type, visibility |
| `return_mission_started` | mission_lane, days_since_last_proof |

## Privacy And Consent

- Prefer aggregate funnel metrics.
- Do not store full prompt text in analytics by default.
- Store prompt length buckets, mission lanes, and explicit tags unless the user consents to deeper research logging.
- Keep source/provenance records separate from growth analytics.
- Never expose private world content in dashboards intended for broad teams.

## Dashboard Views

| Dashboard | Audience | Shows |
|---|---|---|
| Founder Scorecard | Founder/operators | Activation, revenue intent, retention, blockers. |
| Genesis Funnel | Product | Step conversion, latency, edit/regenerate rates. |
| Forge Revenue | Business | Package CTA, checkout, consultation, fulfillment. |
| World Quality | Canon/QA | Right Use failures, generic-output flags, proof types. |
| Model Cost | Engineering | Cost per Gift, cost per world seed, latency. |
| Experiment Board | Growth | Hypotheses, variants, decisions, next actions. |

## Experiment Backlog

| Hypothesis | Change | Success metric | Guardrail | Stop rule |
|---|---|---|---|---|
| Specific crisis framing improves activation. | Landing CTA says "Answer The Drift with a world." | call submit rate | no increase in bounce | 1,000 qualified visits or 14 days |
| Gift ceremony beats blank prompt. | Show structured Call/Gift cards before textarea. | first gift completion | time to start not worse by 20% | 500 sessions |
| Ownership clarity improves package intent. | Add ownership panel after proof. | package CTA rate | no support confusion spike | 14 days |
| Visual DNA increases perceived quality. | Add generated visual brief to every seed. | proof save rate | latency under threshold | 500 sessions |
| Next mission improves retention. | Offer 3 mission choices after SIS record. | week-2 proof return | unsub/support complaints | 4 weeks |

## Weekly Growth Review

Agenda:

1. What changed in the funnel?
2. Which metric has an owner and decision this week?
3. What user proof did we inspect?
4. What did we ship?
5. What do we cut, keep, or double down?

Decision log format:

```text
Date:
Metric:
Observation:
Decision:
Owner:
Change shipped:
Review date:
```

## Instrumentation Acceptance Gate

No activation feature is complete until:

- Events are named in this document.
- Properties avoid sensitive content by default.
- Product owner knows what decision each metric enables.
- Test path can verify at least one event fires.
- Dashboard or temporary report path is documented.
