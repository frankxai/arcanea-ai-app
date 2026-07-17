---
title: "Project handover and repository setup"
uuid: 768c79ee-42a1-456b-9ac6-f46dc74d7334
created: 2026-06-08T13:56:55.452392Z
updated: 2026-06-08T14:05:30.795917Z
source: claude.ai export
---

# Project handover and repository setup

**Frank**:

Evolve this further and ready to handover for Claude code and dedicated repos or whatever else to setup

[attached file: ]
```
Frank, yes. This is not a cute ocean app idea. This is a full Starlight vertical.

Marine Intelligence Systems

Working thesis: turn ocean love into ocean capability.

Most people experience the ocean as tourism, documentaries, guilt, or donations. The opportunity is to build the missing layer:

> A personal + agentic intelligence system that tells you where the ocean needs help, what is happening there, what you can learn, what you can do, who to join, what to monitor, and how your actions compound.



That Oceanogràfic map is basically the product spec: global places, species, projects, signals, journeys, missions.


---

The master architecture

1. Blue Atlas

A living ocean map inside Starlight Intelligence Systems.

It pulls from serious public data layers:

Copernicus Marine for physical, sea-ice, and biogeochemical ocean data, with APIs and Python tooling. 

NOAA ERDDAP for scientific ocean datasets, subset downloads, maps, and API-style access. 

OBIS for marine biodiversity occurrence data from thousands of datasets. 

GBIF for global species and occurrence data APIs. 

iNaturalist for citizen observations and species contribution loops. 

Global Fishing Watch for human activity / fishing transparency APIs, noting their API use is non-commercial by default. 

Marine Regions as the geospatial naming backbone for oceans, seas, and marine places. 


This becomes the ocean knowledge graph.

Not “a dashboard.”
A map of life, pressure, beauty, danger, and possible contribution.


---

2. Ocean Mission Passport

The traveler app.

You land in Valencia, Málaga, Amsterdam, Croatia, Canary Islands, Bali, Azores, Japan, wherever. The system says:

“You are here. These are the species, ecosystems, risks, sanctuaries, researchers, events, diving centers, beach cleanups, citizen-science missions, local foods, and ethical operators around you.”

Core loop:

> Travel → Learn → Observe → Contribute → Protect → Remember → Share



This is perfect for FrankX / Starlight because it turns travel into intelligent contribution, not consumption.

Example missions:

“Photograph 5 coastal species and submit to iNaturalist.”

“Visit one marine foundation and summarize their work.”

“Join one cleanup or reef/citizen-science event.”

“Generate a local ocean briefing before swimming/diving.”

“Create a public field report with photos, species, maps, and next actions.”


This can become your Starlight Field Journal.


---

3. Marine MCP Stack

The serious move: build a repo called something like:

starlight-marine-intelligence
marine-intelligence-mcp
blue-atlas-mcp

MCP is useful here because it standardizes how AI tools connect to external data sources and actions. 

The first servers should be read-only. No drama, no dangerous automation.

Core MCP servers

MCP Server	Purpose

marine-regions-mcp	Resolve ocean/place names into coordinates and regions
obis-mcp	Ask: “What species are recorded near this coast?”
gbif-mcp	Pull broader biodiversity occurrence data
inat-mcp	Retrieve citizen observations and suggest contribution missions
copernicus-marine-mcp	Pull sea temperature, currents, chlorophyll, oxygen, salinity
noaa-erddap-mcp	Access oceanographic datasets and generate visualizations
global-fishing-watch-mcp	Monitor fishing activity where permitted by license
ocean-decade-mcp	Connect projects, events, calls, and communities
field-report-mcp	Turn trips into structured reports, GitHub issues, posts, maps


The agent should answer things like:

“Where near Valencia can I contribute to marine biodiversity knowledge this week?”
“What changed in sea surface temperature around this coast?”
“What species should I learn before diving here?”
“Which protected areas are under pressure?”
“Create a 2-hour ocean mission for a tourist with blisters.”
“Generate a GitHub issue for this anomaly and assign research tasks.”

That is already a product.


---

4. Ocean Research Agent Crew

This is the lab layer.

Agents:

The Cartographer

Builds maps, layers, polygons, sanctuary zones, coastlines.

The Marine Biologist

Explains species, habitats, food webs, invasive species, threats.

The Data Diver

Pulls datasets from OBIS, GBIF, Copernicus, NOAA, GFW.

The Field Guide

Creates travel missions and ethical local action plans.

The Sanctuary Architect

Designs micro-sanctuaries, aquariums, reef tanks, pond systems, educational habitats.

The Policy Sentinel

Tracks protected areas, fishing pressure, restoration projects, local regulations.

The Storyteller

Turns research into cinematic maps, posts, videos, music, Arcanea-style ocean myth.

This gives SIS a new category:

> Domain Intelligence Systems for planetary stewardship.



Not abstract AI. AI with a coastline.


---

5. Home Sanctuary OS

This one is emotionally powerful.

A system for people who want to care for life at home:

ethical aquariums

planted tanks

coral reef education

aquaponics

jellyfish / seahorse learning modules only where responsible

water chemistry tracking

camera-based fish health observation

automated feeding logs

“do not buy wild-caught / endangered / incompatible species” guidance

child/family learning mode


The product is not “aquarium app.”

It is:

> Learn to become a guardian of living systems.



That connects directly to Arcanea, but grounded in real biology.


---

6. Blue Guardian Watchtower

Remote protection layer.

Pick a coastline or sanctuary:

Valencia Coast
Croatia / Zadar / Rovanjska
Amsterdam / North Sea
Canary Islands
Málaga / Marbella
Bali
Azores

Then the system monitors:

biodiversity observations

sea temperature anomalies

algal bloom signals

fishing activity

protected area reports

local events

research publications

cleanup opportunities

social/media alerts

donation / volunteer opportunities


Every week it generates:

Blue Guardian Briefing:
1. What changed?
2. What is beautiful?
3. What is threatened?
4. What can I do from here?
5. What can I do when I travel there?
6. What should agents investigate next?

That is a personal ocean intelligence subscription.


---

7. Starlight Ocean Academy

This is the education layer.

Not a generic course. A progression system.

Gates

Gate	Capability

Ocean Literacy	Understand currents, ecosystems, species, food webs
Field Observation	Record useful observations
Data Literacy	Read maps, datasets, anomalies
Sanctuary Building	Build responsible micro-habitats
Restoration	Learn coral, seagrass, mangroves, kelp, wetlands
AI for Oceans	Use agents, APIs, MCP, dashboards
Expedition Design	Travel with purpose
Stewardship	Contribute, fund, organize, teach


The UN Ocean Decade explicitly frames ocean science as participatory, with ways to join communities, submit activities, and engage in calls/actions. 

So Starlight Ocean Academy can become a bridge:

> from curious tourist → citizen scientist → ocean steward → intelligence-system builder.




---

The real business model

This should not begin as charity. It should begin as beautiful intelligence infrastructure.

Free

Ocean guide, species cards, travel missions, open-source MCP adapters.

Paid individual

Ocean Guardian subscription: weekly briefings, trip missions, learning paths, field journals.

Community

Blue Starlight Club: events, beach missions, travel retreats, sanctuary-building workshops.

B2B

Dashboards for eco-hotels, dive schools, sanctuaries, foundations, schools, coastal communities.

Premium

“Build your local Ocean Intelligence System” sprint for foundations, municipalities, schools, or conservation orgs.

Philanthropy layer

A percentage funds real sanctuaries, cleanups, reef restoration, education, and open data work.


---

Best first build

Do Valencia Marine Intelligence Pilot.

Not huge. Sharp.

/blue-atlas/valencia

It should include:

Valencia coastal map

Oceanogràfic-inspired project map

species near the region

local learning guide

“what to do today” missions

data-source citations

AI chat guide

first MCP adapter

field report generator

“become a Blue Guardian” email capture


Then clone the pattern:

/blue-atlas/amsterdam
/blue-atlas/croatia-zadar
/blue-atlas/malaga
/blue-atlas/canary-islands
/blue-atlas/bali

This becomes a global atlas with local souls.


---

Naming stack

Use this hierarchy:

Starlight Intelligence Systems
└── Marine Intelligence Systems
    ├── Blue Atlas
    ├── Ocean Mission Passport
    ├── Blue Guardian Watchtower
    ├── Home Sanctuary OS
    ├── Starlight Ocean Academy
    └── Marine Intelligence MCP

Public emotional name:

> Blue Starlight



Serious technical name:

> Marine Intelligence Systems



Arcanea bridge:

> The Ocean Sanctuaries



Tagline:

> Know the ocean. Serve the ocean. Become useful to life.



The move is clear: build the first beautiful planetary intelligence system where AI does not just help people make content — it helps them become capable stewards of living worlds.
```

[attached file:  -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

Frank wants me to take this Marine Intelligence Systems strategy document and transform it into something production-ready for handoff — setting up the repo structure, defining the MCP server specifications, and creating the registry.yaml configuration following his established patterns.

I need to produce actual artifacts in this turn: a sharpened architecture document with decisions already made, the monorepo structure, concrete MCP server specs that Claude Code can implement, the registry entry, and a build sequence for the Valencia pilot. Rather than listing options, I should make the calls and deliver scaffolding files he can immediately use.

On the monorepo question: given his existing pattern of 85+ repos governed by Foundry and registry.yaml, a single `marine-intelligence` monorepo with pnpm/turbo makes more sense than eight separate repos—it's lower operational friction and aligns with his sovereignty-first approach. The structure would be `packages/mcp-*` for the servers and `apps/blue-atlas` for the product, all coordinated through the registry.

Now I'm sharpening the strategy: the real spine is Blue Atlas (knowledge graph) feeding Ocean Mission Passport (consumer loop) feeding Blue Guardian Watchtower (recurring revenue), with Home Sanctuary OS, Academy, and Research Crew as downstream dependencies. The ocean knowledge graph itself is the moat—everything else is interface on top of that asset, which mirrors how he thinks about Arcanea as IP.

For licensing, I'm going open-core: the MCP adapters stay MIT/CC-BY-SA to match SIP, but the data graph and Watchtower briefings become the paid tier. This positions Marine Intelligence Systems as a new category—Domain Intelligence Systems for planetary stewardship—that bridges into his existing cosmology through Ocean Sanctuaries and Vel'Tara, though I need to keep the mythology grounded and not overemphasize the narrative.

For the technical handoff, I'm thinking through the MCP server decisions, starting with TypeScript for the SDK since that's his existing pattern.

Actually, I'm reconsidering the language choice. Python with FastMCP makes more sense for the data-layer servers because the scientific ecosystem—copernicusmarine, erddapy, pyobis, pygbif—are mature Python libraries that directly wrap these APIs. TypeScript handles the Blue Atlas web app, but for pulling from Copernicus Marine, ERDDAP, OBIS, and GBIF, Python is the first-principles choice since those are the actual client libraries.

A polyglot monorepo does add friction, but MCP servers are independent processes anyway, so I can structure this as `servers/` (Python, uv-managed) + `apps/blue-atlas` (Next.js) + `packages/core` (shared TypeScript types and generated schema). Using a shared JSON schema or OpenAPI contract for the knowledge graph entities keeps the Python servers and TypeScript app in sync.

Now I'm defining the core entities of the ocean knowledge graph—Places backed by Marine Regions MRGIDs (oceans, seas, EEZs, MPAs, coastlines) and Species entities tied to WoRMS and GBIF taxonomies.

Defining the full entity model... defining exit criteria and considering whether to add an MCP registration file, then deciding to actually scaffold this out on the filesystem and package it up.

I'm thinking through the effort-to-value ratio here — he wants high effort, so I should build real, load-bearing files rather than stubs. I'll focus on the core handoff documents like architecture and build sequence, the TypeScript entity schema with Zod validation and JSON-schema export, and a reference MCP server implementation.

For the monorepo structure, I need the workspace config, build orchestration, and root package setup. The OBIS server should be a working template that actually integrates with the real OBIS REST API at api.obis.org/v3, hitting endpoints like `/occurrence`, `/taxon`, and `/statistics`.

I'm confident enough in the OBIS API v3 structure to implement it—queries use geometry as WKT or areaid parameters, and the endpoints are stable scientific infrastructure. I could verify the exact current endpoints, but given the task is to make this handoff-ready, I'll build it with the structure I know and flag where verification might be needed. I'm zeroing in on the three APIs I'm least confident about—Marine Regions gazetteer endpoints, OBIS v3 occurrence parameters, and the Copernicus Marine toolbox Python commands—while relying on my solid knowledge of iNaturalist, GBIF, NOAA ERDDAP, and Global Fishing Watch. I'll run three targeted searches to lock down those specs, then build the filesystem scaffold and present it.

But stepping back, the real intellectual evolution here is sharpening the thesis beyond "turn ocean love into ocean capability"—the actual moat isn't the data itself since it's all public, it's the resolution layer that sits on top: entity-resolved records, place-anchored observations, pressure-scored priorities, and mission-generating insights. That's the proprietary asset.

Then there's the GTM angle: read-only isn't just a safety constraint, it's actually the distribution strategy. Publishing read-only MCP servers as open-core aligns with SIP and puts the tool in every Claude user's hands—that's the top-of-funnel for Blue Guardian, while the graph, Watchtower briefings, and Academy become the revenue drivers. It mirrors his existing open-core-moat playbook exactly.

And the third layer is positioning this as a new category entirely—Domain Intelligence Systems, with marine as the first instance, establishing a repeatable pattern. Policy Sentinel slots in as the B2B layer, and I'm treating the sequencing as a deliberate path rather than a menu of options. The Arcanea bridge ties everything together—Blue Starlight becomes both the public-facing emotional brand and the community engine (Blue Starlight Club feeds into the vibeclubs.ai pattern for recurring revenue), so Marine doesn't need new monetization infrastructure; it plugs directly into the existing ACOS rails alongside gencreator.ai and vibeclubs.ai. Now I'm ready to start building this out.I'll verify the live API surfaces for the load-bearing data sources so the scaffold is accurate enough to hand to Claude Code without it flailing, then build the repo.
```
This block is not supported on your current device yet.
```

 I'm reviewing the Marine Regions REST API endpoints, which include methods for searching gazetteer records by name, MRGID, or coordinates, plus geometry and relationship queries. Now moving on to OBIS v3.
```
This block is not supported on your current device yet.
```

 I'm confirming the OBIS v3 API endpoints for occurrence data, taxon information, and species composition statistics, along with the available query parameters like scientificname, taxonid, geometry, date ranges, depth filters, and the redlist flag for IUCN conservation status.

The `redlist=true` parameter surfaces endangered species as a conservation indicator, and `hab=true` filters for harmful algal bloom species. Now I'm moving on to explore the Copernicus Marine toolbox for Python.
```
This block is not supported on your current device yet.
```

 I've got what I need for the Copernicus Marine API—the `copernicusmarine` package with functions like `open_dataset()` and `read_dataframe()` for accessing data, plus subsetting parameters for spatial bounds, time ranges, variables, and depth. Authentication uses environment variables for username and password.

I'm also familiar with the other key APIs: GBIF and iNaturalist for species occurrence data, NOAA ERDDAP for gridded and tabular datasets, and Global Fishing Watch for vessel tracking. That gives me enough to write accurate adapter specifications.

Now I'm setting up the repository structure on the filesystem, focusing on the core load-bearing files—code and markdown—without needing to build the actual Blue Atlas UI this turn.

Laying out the directory structure... I'll include a dedicated `DATA-SOURCES.md` file documenting authentication, licensing, rate limits, base URLs, and key endpoints for each source. The entity contract should be the centerpiece of the architecture, and I'll fold mission/contribution-loop taxonomy into the entities and architecture docs rather than creating a separate file. Now I'm thinking through the OBIS server implementation to make sure it's actually functional—using FastMCP with tools like `resolve_place` for geographic lookups, though I need to be careful since OBIS is marine-focused.

For the OBIS tools specifically, I'm planning `species_near` to query the `/v3/checklist` endpoint with geometry parameters to return a species checklist with occurrence counts for a given area, `occurrences` to fetch raw occurrence records filtered by scientific name or taxon ID with spatial and temporal bounds, and `taxon_lookup` to resolve scientific names to their OBIS taxon IDs.

I also need a helper to convert bounding boxes to WKT polygon format, and I'll add `redlist_near` to flag conservation-relevant species by filtering for IUCN Red List entries within a region.

Now I'm writing the server implementation using httpx with clear tool descriptions and typed arguments following MCP conventions.

I'll build the files directly in the outputs directory since these are the final deliverables. Starting with the architecture documentation to capture the key design decisions and evolution points, then moving through the implementation files.

The core insight is that Marine Intelligence System is the first Domain Intelligence System—a template for planetary stewardship verticals. The real moat isn't the data itself but the resolution layer that anchors ocean knowledge to specific entities and places. Read-only MCP servers become the go-to-market strategy, distributing the open-core system while the graph, briefings, and academy drive revenue. The dependency chain flows from schema through adapters and resolvers into Blue Atlas, then the mission engine for write loops, Watchtower for recurring intelligence, and Academy for user retention, with expansions like Home Sanctuary OS and research tools built on top.

The monetization mirrors existing patterns—Blue Starlight Club follows the vibeclubs model, Ocean Guardian subscriptions use the gencreator SaaS approach, and B2B dashboards map to vertical-specific pricing like Meridian. Everything lives in a single monorepo with Python servers and TypeScript frontend sharing contracts. The real unit of value is the contribution loop itself—missions become first-class entities with verifiable types like observations, cleanups, reports, donations, and flagged anomalies.

I'm going to lead with the key decisions and evolution in tight prose, then present the actual files. No preamble, just the spine of what changed and the repo structure, then a single build command.Verified the live API surfaces (Marine Regions REST gazetteer, OBIS v3, Copernicus Marine Toolbox). Building the handoff repo now.
```
This block is not supported on your current device yet.
```

 I'll start writing out the core files, beginning with the architecture documentation and Claude's system prompt, then move into the contract definitions, server implementation, and configuration.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 I'm setting up a FastMCP server that connects to the OBIS API, defining tools to query species checklists by location, retrieve occurrence records, filter by conservation status and habitat, and look up taxonomic information.

Writing the server implementation...
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 I'm setting up the template server and core configuration files—the package.json, root configs, .mcp.json, documentation files, and registry entry—using bash heredocs to write them efficiently.
```
This block is not supported on your current device yet.
```

 I created the directory with `mkdir -p` for `servers/_template/src/template_mcp`, but the error suggests it doesn't exist — maybe the brace expansion didn't work as expected. Let me verify what was actually created.
```
This block is not supported on your current device yet.
```

 The README for servers got created successfully, but the template files didn't work out. Now I'm rewriting those template files since the directory exists and trying that block again.
```
This block is not supported on your current device yet.
```

Now the contract package, root config, registration, and the remaining handoff docs.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Now I'm writing the top-level README and running a quick validation to check the Python syntax on the servers and display the directory structure.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Handoff repo is built and self-consistent (Python servers compile, contract is the single source of truth, `.mcp.json` registers the reference adapter). `marine-intelligence/` — clone it straight into Claude Code.

**What I changed in the evolution — three moves the original doc didn't make:**

1. **Collapsed seven "products" into one asset + interfaces.** The thing being built is a *resolved ocean knowledge graph*, not seven apps. Blue Atlas, Watchtower, Academy etc. are reads and loops over it. This reframes MIS as the first **Domain Intelligence System** — a new SIS category, template-zero for forests/freshwater/soil/air. The cloneable pattern is the deliverable; ocean is instance one.

2. **Named the moat and the GTM explicitly.** Data is public and free — the proprietary layer is *resolution* (entity-resolution across WoRMS/GBIF/OBIS, place-anchoring to MRGID, and the **PressureIndex** composite that makes a Briefing worth paying for). Read-only servers are reframed from a safety choice into the *distribution channel*: ship them open-core/MIT, let agents install them, funnel into the hosted graph + Watchtower. Revenue rails reuse your existing engine — Ocean Guardian on gencreator.ai, Blue Starlight Club on vibeclubs.ai.

3. **Turned the menu into a DAG with a gate.** `core → adapters → graph-resolver → Blue Atlas → Mission engine → PressureIndex → Watchtower → Academy`. Valencia is the gate; nothing platform-scale starts until a stranger can land on `/blue-atlas/valencia` and get place-true species + live PressureIndex + 3 verifiable missions + a cited field report. Home Sanctuary OS / Research Crew / Policy Sentinel are explicitly deferred behind the first paid SKU.

**Load-bearing decisions locked in `CLAUDE.md`/`ARCHITECTURE.md`:** single polyglot monorepo (not 8 repos); Python/FastMCP for data adapters, TS for the app, one shared `core` contract; everything anchors to an MRGID; every datum carries provenance; missions are *verifiable* (a `contribution_type` with a completion signal, not self-attestation).

**One disagreement, then I built it anyway:** the original's instinct to ship Home Sanctuary OS and the Academy as co-equal surfaces dilutes the wedge. They're retention/expansion nodes — real, but downstream. I sequenced them behind Watchtower rather than cutting them.

First move for Claude Code is in `BUILD-SEQUENCE.md`: `cp -r servers/_template servers/marine-regions-mcp` — Place is the spine, so the gazetteer adapter is the next build, not another biodiversity source.

One open call worth your positioning input before Phase 1 hardens: **whether GFW (fishing pressure) stays out of the paid surface entirely** given its non-commercial license, or whether you resolve commercial terms with GFW now so `fishing_effort` can carry real weight in the PressureIndex. That's the one component where the proprietary metric is licensing-constrained rather than engineering-constrained.
