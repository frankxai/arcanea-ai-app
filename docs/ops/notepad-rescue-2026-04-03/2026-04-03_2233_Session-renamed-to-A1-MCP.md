# Notepad Tab Rescued — 2026-04-03_2233

<!-- Source: 3d74d563-2134-4788-a0a9-1f1aeba72e16.bin | Size: 23666B -->

 A1 MCP  
  Session renamed to: A1 MCP
 Before we do this our strategy map clearer, all outlined for me and plan for monetization with other branches unified and how wemaintain and what build open how used for monetize and how all agents keep overview and use it and feedback and improvements ensured
 Let me think strategically rather than build more code. This is an architecture decision 
 needs clarity first.  Arcanea MCP 
 Strategy Map  What We Built (The Product Stack)  LAYER 1: PROTOCOL (open)  
 @arcanea/mcp-server     
 39 worldbuilding tools, SDK 1.29  
 @arcanea/memory-mcp     
 8 vault tools, semantic memory  
 @arcanea/flow           
 Luminor prompt injection system  
 10 Luminor modules      
 kernel + 9 domain specializations  LAYER 2: PLATFORM (freemium)  
 arcanea.ai/worlds       
 WorldGraph, CharacterCard, Dashboard  
 arcanea.ai/docs/mcp     
 Developer docs (3 pages)  
 arcanea.ai/blog         
 "Mythology Engine" distribution post  
 /api/worlds/*           
 Gemini image gen, world persistence  
 Components              
 ElementBadge, WorldGraph, CharacterCard, WorldDashboard  LAYER 3: INTELLIGENCE (moat)  
 World Intelligence      
 world_report, generate_conflict, weave_narrative  
 Canon validation        
 automated mythology consistency  
 Creation graph          
 relationship network with gap detection  
 Art direction system    
 element × rank 
 visual style mapping  
 Luminor Engineering     
 composable prompt intelligence  Open vs Monetized 
 The Strategy  
        Layer        
                License                
                                            Why                                             
 MCP Server (tools)  
 MIT / Open Source                     
 Distribution flywheel 
 more users = more worlds = more creators = more premium conversion 
 Memory Vaults       
 MIT                                   
 Same 
 open tools drive adoption                                                           
 arcanea-flow        
 MIT                                   
 Developer ecosystem play 
 every agent user becomes an Arcanea user                        
 Luminor Modules     
 Open (in repo)                        
 The prompts are the ad 
 they showcase what Arcanea thinking looks like                    
 arcanea.ai platform 
 Freemium                              
 Free: create, visualize, share. Paid: AI image gen, cloud persistence, NFT pipeline        
 World Intelligence  
 In MCP (open) but premium on platform 
 Free locally, premium cloud features (multi-user, real-time collab, export)                
 NFT Pipeline        
 Premium                               
 Style Packs, collection gen, mint integration                                              
 Academy             
 Premium                               
 Courses on worldbuilding, agent design, prompt craft                                       
  Monetization Model  FREE (MCP + arcanea.ai basic)  
 39 MCP tools via npx (unlimited, local)  
 Create characters, locations, worlds  
 WorldGraph visualization (your worlds)  
 World report + conflict gen  
 Save/load worlds locally  
 Community feed (browse other worlds)  CREATOR ($9/mo)  
 AI portrait generation (Gemini)  
 Cloud world persistence (Supabase)  
 Share worlds publicly  
 Export to novel outline / game doc  
 Premium art direction styles  
 5 worlds, 100 creations/mo  PRO ($29/mo)  
 Unlimited worlds + creations  
 Multi-user collaborative worldbuilding  
 NFT-ready exports (Style Packs)  
 API access for integration  
 Priority image generation  
 Custom Luminor modules  
 White-label MCP server (your branding)  ENTERPRISE (custom)  
 Self-hosted MCP server  
 Custom mythology frameworks  
 Studio-grade world management  
 Game studio / publisher integrations  
 Training data licensing  How All 7+ Sessions Stay Coordinated  The problem: 7 Claude instances running, each making changes, potential conflicts everywhere.  The solution (what we built + what needs enforcement):  SYSTEMS OF RECORD (ground truth)  
 AGENTS.md          
 Execution Law (machine-enforced)  
 MASTER_PLAN.md     
 Strategic state (updated this session)  
 Linear             
 Issue tracking (ARC-71
78, synced)  
 .arcanea/projects/ 
 Action plans (MCP, Luminor, NFT)  
 Memory system      
 Cross-session context (61 files)  
 CI pipeline        
 Build/typecheck/lint gate  COORDINATION PROTOCOL (for all sessions)  1. Read AGENTS.md + MASTER_PLAN.md before any work  2. Check Linear for active issues  3. Use feature branches, not main (except promotions)  4. Commit with conventional format  5. Run build verification before push  6. Update MASTER_PLAN.md after significant changes  7. Save session notes to memory system  What Each Branch/Session Should Focus On  
      Session      
                     Focus                      
             MCP Connection              
 This one (A1 MCP) 
 MCP product, Luminor system, visual components 
 Core                                    
 Agent OS          
 Agent control plane, task routing              
 Uses arcanea-flow for Luminor injection 
 AgentDB/Starlight 
 Memory backend, HNSW search                    
 Powers memory-mcp persistence           
 Web/Frontend      
 arcanea.ai pages, UX polish                    
 Renders MCP output via components       
 Lore/Content      
 Books, mythology, canon                        
 Feeds MCP generators with richer data   
 NFT Forge         
 Collection engine, art pipeline                
 Uses visualize_* 
 Gemini 
 Style Pack  
 Ops/SIS           
 Hooks, health, monitoring                      
 Luminor hooks, /pp guardian protocol    
  Feedback & Improvement Loop  USER creates with MCP tools    
  WORLD REPORT identifies gaps 
 suggests next tool    
  CREATION GRAPH tracks relationships 
 detects orphans    
  USAGE DATA (Luminor agent-report.mjs) 
 logs agent type, module, success    
  MEMORY SYSTEM 
 persists patterns, preferences, style    
  WEEKLY: /weekly-recap 
 cross-session analysis    
  LUMINOR MODULES updated 
 all future agents get smarter    
  NEXT USER benefits from improved tools  What's Still Missing for True E2E  
                    Gap                     
 Priority 
                     Blocks                      
 npm login + publish                        
 P0       
 Nobody outside this machine can use MCP tools   
 Gemini API key on Vercel                   
 P1       
 Image gen returns prompts but no images         
 Wire WorldGraph to /worlds page            
 P1       
 Components built but not connected to real data 
 Supabase world storage                     
 P2       
 Worlds only persist locally, not in cloud       
 Multi-user worlds                          
 P2       
 No collaboration yet                            
 Marketplace listings (Anthropic, Smithery) 
 P1       
 Distribution beyond npm                         
 NFT Style Pack integration                 
 P3       
 Premium feature, not core                       
  The One-Page Pitch  Arcanea MCP is the creative development kit for AI-powered worldbuilding.  Open source MCP tools (free) 
 arcanea.ai platform (freemium) 
 creator economy (premium). Every world built with the tools feeds the ecosystem. Every creator who publishes attracts more creators. The  Luminor prompt system makes every AI smarter at worldbuilding. The moat is the mythology framework + world intelligence + community network 
 not the code.  Revenue path: Free tools 
 platform adoption 
 creator subscriptions 
 NFT/enterprise.  First milestone: npm publish 
 100 installs 
 10 worlds created 
 1 paying creator. Everything after scales.  ---  This is the strategy. Want me to save this as a formal document in .arcanea/strategy/ and update Linear with the monetization milestones? Or should we refine any part of this before committing to it?