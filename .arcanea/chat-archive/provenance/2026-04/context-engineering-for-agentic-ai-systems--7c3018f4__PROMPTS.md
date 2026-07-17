# Frank's prompts -- Context engineering for agentic AI systems

Source uuid: 7c3018f4-4a69-47b9-b0f8-5a883b2e2802
Created: 2026-04-21T16:45:05.833611Z

Verbatim, chronological.

## Turn 0

Ai house notes. 
Claude Code Context engineering. 

Context injection is what makes agentic systems useful for us. 

If someone tells you how it goes its bullshit its so complex and context unique to each! 

Deterministic and probalistic & human. 

Deterministic. Claude.md general rules (less always more for context) different for subagents. 
System prompt for conventions for language is not ideal that should be in rule. 
Hooks. Useful for monitor tmux each user input rewrite all details that. 
Opus 4.7 highly opinonated does always what you say not alwads good. 

Auto memory - he doesnt really like it. Doesnt know when to save and just md based memory system. 

Loops - set a cron job and god back all 30 min. 

Probalistic:
Subagents, not inherit the Claude personality memory or so, setting for model and mxp we xould change. He found it nor just coding but whole business. Create invoices transcripts, ideation and research and more. Coding agent fir non coding job not optimal. Subagents you can ingest at runtime build team to do xyz and skills and mcp. Task more than once default agents make adaption to runtime. 
- models and skills it has access to 

- skills - slashcommand with something underneet. Basic is md. Can extend with scripts or got task what Claude not goof. Video analysid - gemini 3.1 only model where you can ingest. What if you make agenz and package in skill and communicate with gemini agent. 
- plugins - get from community. Downloading from distributor on your own risk (i need to check all we absorbed!) Making skills through chat 
- over time hundreds of skills and things get bit too big. Skills and mcp if not doing yet you should. One flag to cut down. 
200 skills and you need the llm to help you choose - probably biggest use. Deload of the things we make choices about. 
- recommends project scope. 
- observered tilux? Made skill now new terminal with Claude or Codex session. Terminsl can talk with tilux to each other. Can have observer watch the observer. 
- RTFM - read rhe fucking manual. More importsnt than ever to read documentation. Not need to know all in detail. Need to know concept. Read doxs gives ideas of what possible! You get jew ideas. 

Llm memory and how attention and context winfow works its super complex you need something to abstract things away. 
The way how human work how we perceive how we store memory and context is finite. Knowledge is abundant you need way to store things. 

Attention & memory. 
There is muxh more going on then we can perceive. And heavily influenced by Priors. Long term memory and emotion. 

Knowledge not embeeded in vaccum it means something. Makes you happy, scared. And then updares memory when memory received get altered by our messy working menory. 

Memory is a folder if markdown files. Andrey Karpathy. See memory and storage as md files. Rag is good for lot of files and lot of moving parts you cant influence. 
Index of obsidian visualization is something you want to see to find something. 
Where Karpathy stopped. Build what you want on top. 
He is enthusiastic and hopes someone else to help 
System bow working. Store ecerdthing nothing meaning. So needs polixy what is important and polixy how to retrieve it. Like rule of 30k. Knowledge not used gets lower score. Concept get added snd connexted get higher score. Send agent to site for paper research it works on it. The unexpected things are most beautiful not just confirm but updste priors. 
Have dynamic agents process and put in wiki, 5% in context but other 95 for later use. 

Wiki can just fetch context and wiki. Also time constraint do faster. Time is important. 

Challenge for tonight. What kind of real world things can we do with AI. There is so much ignorance around. Many dont understand and magic thinking that model needs to know all to be impactful. You can have many models that do little things. When you engineer systems very well train the models and find the way to find what model is what you want. Nor good idea to write essays with llm. Or do customer services with AI. Rule of economics. Freely available it looses value. CS is that you perceive value. 
Extracting structured information from technical drawings that are part 2D of reality. You eant to get information back. Its a big problem. He owned restaurant and issue with accountant he had to so 3 years in reverse. When you extract that you can chexk deterministic or probablistic. 
Pre made terminal and start with readme and take you through it. 

Challenge. Have 55 min to figure things out. Recommend someone sets up wiki system. Actual thing will just 5min. Get all with research in 5 min. Someone need kb. Karpathy suggestion copy paste or own thing. 
(Check for me linear notion how good is sis is this what i should suggest ti use for the wiki? But i think its not tested atm, maybe easier karpathy prompt? 

Humans 
- chat turns 
Slash commands 
Reframes 


Question during talk: context window solution for problem, you want it

## Turn 2

There will be explicit info and info you can deduce and can ask do it. Jsonl files stored on computer. Tilux and message to send message to main agent who can load infex to context window. Or observer can confirm knowledge in db/Wiki add rules and triggers (experiment), 3. Write or retrieve. Fetch the raw files. Protected. Processed and any message and chapter. What agent decide to get something out of piece of informstion .

4. Storage perceive images and rule when things over 14 30 days lower value. 

5. Head - get into context window. Token limit. Now codex mainly processing wholer thing whole time. Summary by llm throgh certsin lense.

## Turn 4

So what i should do in the group what you think i do best claude md or prompt or wiki? And what i need to do then xD

## Turn 6

Human emotion stores memory. How to store and encode information into. We want agent to understand what i found importsnt. What anthropic points out recognize emotion. As a user observer agent add extra weight? 
In the md file has trust score. 

Agents can learn and more. 

Claude setup to tackle complex problems we steer in 5 min later. Idea is to play around if we can make it happen to force the agent to use our wiki. Make a hook before it decidee research - did you consider wiki (and lot things

## Turn 8

https://22222-tewkqnb7nb0tqqig.daytonaproxy01.eu/

## Turn 11

Current state and enviroment. 

Help me how good is our claude.md really need to refine it and make better? 

# Technical Drawing Extraction
## Output contract
- Write to `output/output.json`
- Overwrite on every run
- No partial writes — write full object or nothing
## Schema
See `/schema.json`. Required fields: [...]. 
Nullable fields: [...]. Enum fields: [...].
## Extraction rules
- Units: convert everything to mm. Log original unit in `_meta.source_units`.
- Unknown/illegible → null, never guess. Log in `_meta.gaps[]`.
- Confidence < 0.7 → null + gap entry.
- Revision block is authoritative over title block on conflicts.
## Wiki
Drawing conventions in `wiki/`. Read before extracting.
## Validator
`node validate.js` reads output/output.json against schema.json. 
Run every 2 min. Misses land in wiki/gaps.md.

## Turn 13

how do we define the schema now in the best possible way? or just prompt you gave me enough?

## Turn 15

Give me prompt I need to give the claude in sequence what we start with now ?  i didnt put any of your prompts in, quick answer

## Turn 17

But i didnt give it the prompts or schema you gave before that needs to be done first right? refine claude.md and schema

## Turn 19

lets also consider the 4 categories they use for scoring somewhere in there, lets make the claude.md and also consider that my colleague said i need to change claude md to not reference wiki but memory yes? or any challges ? do this first he needs now

## Turn 21

and some things in the repo might still reference wiki we need to change so we nothing of claude.md or so references wiki again all need memory or maybe they just need to update we done all? also you agree should we do this you did things with not enough context? 

❯ Read CLAUDE.md and schema.json. Then:                                                                                                                             
                                                                                                                                                                    
  1. Write a valid skeleton output/output.json now — all required fields nulled, _meta populated with source_units="unknown", extracted_at=ISO timestamp,           
  gaps=[]. Atomic write.                                                                                                                                            
  2. Run: node validate.js                                                                                                                                          
  3. Report PASS/FAIL and list every required field from schema.json.                                                                                               
  4. Do NOT extract yet. Wait for my go.                                                                                                                            
                                                                                                                                                                    
● Read(CLAUDE.md)                                                                                                                                                   
  ⎿  PreToolUse:Read hook error                                                                                                                                     
  ⎿  Read 39 lines                                                                                                                                                  
                                                                                                                                                                    
● Read(schema.json)                                                                                                                                                 
  ⎿  PreToolUse:Read hook error                                                                                                                                     
  ⎿  Read 95 lines                                                                                                                                                  
                                                                                                                                                                    
● Write(output/output.json.tmp)                                                                                                                                     
  ⎿  PreToolUse:Write hook error                                                                                                                                    
  ⎿  Wrote 26 lines to output/output.json.tmp                                                                                                                       
     {                                                                                                                                                              
       "title_block": {                                                                                                                                             
         "drawing_number": null,                                                                                                                                    
         "title": null,                                                                                                                                             
         "revision": null,                                                                                                                                          
         "date": null,                                                                                                                                              
         "scale": null,                                                                                                                                             
         "sheet": null,                                                                                                                                             
         "drawn_by": null,                                                                                                                                          
         "checked_by": null,                                                                                                                                        
     … +16 lines (ctrl+o to expand)                                                                                                                                 
                                                                                                                                                                    
● Bash(mv /home/daytona/workspace/output/output.json.tmp /home/daytona/workspace/output/output.json && node /home/daytona/workspace/validate.js)                    
  ⎿  PreToolUse:Bash hook error                                                                                                                                     
  ⎿  PASS 6 top-level keys                                                                                                                                          
                                                                                                                                                                    
● Result: PASS — 6 top-level keys                                                                                                                                   
                                                                                                                                                                    
  Required Fields from schema.json                                                                                                                                  
                                                                                                                                                                    
  Top-level (all required):                                                                                                                                         
  - title_block                                                                                                                                                     
  - revisions                                                                                                                                                       
  - dimensions                                                                                                                                                      
  - notes                                                                                                                                                           
  - _meta                                                                                                                                                           
                                                                                                                                                                    
  title_block (required sub-fields):                                                                                                                                
  - drawing_number                                                                                                                                                  
  - revision                                                                                                                                                        
  - title                                                                                                                                                           
                                                                                                                                                                    
  revisions[] items (required per item):                                                                                                                            
  - rev                                                                                                                                                             
  - description                                                                                                                                                     
                                                                                                                                                                    
  dimensions[] items (required per item):                                                                                                                           
  - value_mm                                                                                                                                                        
                                                                                                                                                                    
  _meta (required sub-fields):                                                                                                                                      
  - source_units                                                                                                                                                    
  - gaps                                                                                                                                                            
  - extracted_at                                                                                                                                                    
                                                                                                                                                                    
  ---                                                                                                                                                               
  Skeleton written and validated. Awaiting your go.                                                                                                                 
                                                                                                                                                                    
❯ we need to align schema.json to aligned with evaluater and docs/output-contract.md better  proopose how get context all how this repo works                       
                                                                                                                                                                    
● Explore(Explore evaluator alignment)                                                                                                                              
  ⎿  PreToolUse:Task hook error                                                                                                                                     
  ⎿  Done (15 tool uses · 40.9k tokens · 47s)                                                                                                                       
                                                                                                                                                                    
● Analysis Complete                                                                                                                                                 
                                                                                                                                                                    
  Critical Finding: schema.json is entirely misaligned with the evaluator                                                                                           
                                                                                                                                                                    
  The current schema describes generic technical drawing metadata. The evaluator expects steel fabrication extraction data.                                         
                                                                                                                                                                    
  ---                                                                                                                                                               
  Current schema.json (WRONG)                                                                                                                                       
                                                                                                                                                                    
  Required: title_block, revisions, dimensions[], notes, _meta                                                                                                      
                                                                                                                                                                    
  Evaluator Expects (from docs/output-contract.md + scripts/check_output.py)                                                                                        
                                                                                                                                                                    
  Required: profile, shape_code, length, material, angles,                                                                                                          
            height, flange_width, flange_thickness, web_thickness,                                                                                                  
            holes[], contours[]                                                                                                                                     
                                                                                                                                                                    
  ---                                                                                                                                                               
  Field Mapping Difference                                                                                                                                          
  ┌──────────────────┬────────┬────────────────┬──────────┐                                                                                                         
  │ Evaluator Field  │ Points │ Current Schema │  Status  │                                                                                                         
  ├──────────────────┼────────┼────────────────┼──────────┤                                                                                                         
  │ profile          │ 1      │ missing        │ CRITICAL │                                                                                                         
  ├──────────────────┼────────┼────────────────┼──────────┤                                                                                                         
  │ shape_code       │ 1      │ missing        │ CRITICAL │                                                                                                         
  ├──────────────────┼────────┼────────────────┼──────────┤                                                                                                         
  │ length           │ 1      │ missing        │ CRITICAL │                                                                                                         
  ├──────────────────┼────────┼────────────────┼──────────┤                                                                                                         
  │ material         │ 1      │ missing        │ CRITICAL │                                                                                                         
  ├──────────────────┼────────┼────────────────┼──────────┤                                                                                                         
  │ angles           │ 1      │ missing        │ CRITICAL │                                                                                                         
  ├──────────────────┼────────┼────────────────┼──────────┤                                                                                                         
  │ height           │ 1      │ missing        │ CRITICAL │                                                                                                         
  ├──────────────────┼────────┼────────────────┼──────────┤                                                                                                         
  │ flange_width     │ 1      │ missing        │ CRITICAL │                                                                                                         
  ├──────────────────┼────────┼────────────────┼──────────┤                                                                                                         
  │ flange_thickness │ 1      │ missing        │ CRITICAL │                                                                                                         
  ├──────────────────┼────────┼────────────────┼──────────┤                                                                                                         
  │ web_thickness    │ 1      │ missing        │ CRITICAL │                                                                                                         
  ├──────────────────┼────────┼────────────────┼──────────┤                                                                                                         
  │ holes[]          │ 6      │ missing        │ CRITICAL │                                                                                                         
  ├──────────────────┼────────┼────────────────┼──────────┤                                                                                                         
  │ contours[]       │ 5      │ missing        │ CRITICAL │                                                                                                         
  └──────────────────┴────────┴────────────────┴──────────┘                                                                                                         
  ---                                                                                                                                                               
  Proposal: Replace schema.json                                                                                                                                     
                                                                                                                                                                    
  Do you want me to rewrite schema.json to match the evaluator's expected format (flat JSON with steel profile fields, holes, contours)?                            
                                                                                                                                                                    
  This would also require updating:                                                                                                                                 
  1. CLAUDE.md workflow references                                                                                                                                  
  2. output/output.json skeleton                                                                                                                                    
  3. Re-run node validate.js                                                                                                                                        
                                                                                                                                                                    
  Awaiting your go.                                                                                                                                                 
                                                                                                                                                                    
✻ Cooked for 1m 4s

## Turn 23

alright do we really need schema.json? another says output-contract.md defines all we dont need it?

## Turn 27

why also delete validate.js? what is it?

## Turn 33

did we still just work on claude.md and what i should work or overlap with other people? your do this now is fine to do?

## Turn 35

should we add the gemini layer? interesting idea?

## Turn 37

Tipps - chec pdf - scanned, vector pdf, certain industry. what industry. which file fomrats in the industry. and whats common in there. We got some tipps. Very important extraction model - field names - we need and get research and insight on the problem.

## Turn 39

Cant you do the research now?  and then give to it?

## Turn 41

all looks good now right?

## Turn 43

❯ zpr152pr new file appeared?                                                                                                                                       
                                                                                                                                                                    
● Bash(ls -la /home/daytona/workspace/data/)                                                                                                                        
  ⎿  PreToolUse:Bash hook error                                                                                                                                     
  ⎿  total 488                                                                                                                                                      
     drwxr-xr-x  2 daytona daytona     85 Apr 21 18:04 .                                                                                                            
     drwxr-xr-x 11 daytona daytona   4096 Apr 21 18:03 ..                                                                                                           
     … +3 lines (ctrl+o to expand)                                                                                                                                  
                                                                                                                                                                    
● JUDGED DRAWING DETECTED                                                                                                                                           
                                                                                                                                                                    
  ZPr152.pdf — 265,906 bytes — arrived 18:04                                                                                                                        
                                                                                                                                                                    
  This is likely the final judged drawing. Different from practice (ZPr137).                                                                                        
                                                                                                                                                                    
  Ready to extract on your GO.                                                                                                                                      
                                                                                                                                                                    
  Shall I proceed with extraction workflow?    

What i tell it now?

## Turn 45

alright other team member is running his own prompt can i do at same time my prompt? not making confusing or could make better and 2nd version would help?

## Turn 47

maybe give a prompt to review his output?  it just got

## Turn 53

ok couldnt change it
