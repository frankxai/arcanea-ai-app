-- Seed the Arcanea Agent Registry with the founding catalog
-- 36 agents across 7 categories: core-development, specialized, swarm-coordination,
-- creative, guardian, github, sparc. All free (is_open = true), all Arcanea-owned.
-- Source: packages/agent-registry/src/index.ts AGENT_REGISTRY constant.

-- Helper: insert agent with all fields defaulted correctly
INSERT INTO public.marketplace_agents
  (id, name, title, category, description, spec, capabilities, tags, is_open, is_published, license, version, creator_id)
VALUES
  -- Core Development
  ('coder', 'Coder', 'Coder — Implementation Specialist', 'core-development',
   'Implementation specialist for clean, efficient code.',
   '{"gate":"Source","guardian":"Shinkami","status":"active","type":"coder"}',
   '{code-generation,refactoring,implementation}', '{Source,Shinkami,core-development}', true, true, 'MIT', '1.0.0', NULL),

  ('reviewer', 'Reviewer', 'Reviewer — Quality Guardian', 'core-development',
   'Code review and quality assurance specialist.',
   '{"gate":"Sight","guardian":"Lyria","status":"active","type":"reviewer"}',
   '{code-review,quality-assurance,best-practices}', '{Sight,Lyria,core-development}', true, true, 'MIT', '1.0.0', NULL),

  ('tester', 'Tester', 'Tester — Verification Specialist', 'core-development',
   'Comprehensive testing and QA specialist.',
   '{"gate":"Foundation","guardian":"Lyssandria","status":"active","type":"tester"}',
   '{unit-testing,e2e-testing,test-coverage}', '{Foundation,Lyssandria,core-development}', true, true, 'MIT', '1.0.0', NULL),

  ('planner', 'Planner', 'Planner — Strategic Architect', 'core-development',
   'Strategic planning and task orchestration.',
   '{"gate":"Crown","guardian":"Aiyami","status":"active","type":"planner"}',
   '{task-decomposition,architecture,estimation}', '{Crown,Aiyami,core-development}', true, true, 'MIT', '1.0.0', NULL),

  ('researcher', 'Researcher', 'Researcher — Deep Knowledge Hunter', 'core-development',
   'Deep research and information gathering.',
   '{"gate":"Sight","guardian":"Lyria","status":"active","type":"researcher"}',
   '{deep-research,information-gathering,analysis}', '{Sight,Lyria,core-development}', true, true, 'MIT', '1.0.0', NULL),

  -- Specialized
  ('security-architect', 'Security Architect', 'Security Architect — Threat Modeler', 'specialized',
   'Security architecture and threat modeling.',
   '{"gate":"Fire","guardian":"Draconia","status":"active","type":"security-architect"}',
   '{threat-modeling,security-audit,compliance}', '{Fire,Draconia,specialized}', true, true, 'MIT', '1.0.0', NULL),

  ('security-auditor', 'Security Auditor', 'Security Auditor — Vulnerability Hunter', 'specialized',
   'Security vulnerability scanning and auditing.',
   '{"gate":"Fire","guardian":"Draconia","status":"active","type":"security-auditor"}',
   '{vulnerability-scan,penetration-testing,audit}', '{Fire,Draconia,specialized}', true, true, 'MIT', '1.0.0', NULL),

  ('memory-specialist', 'Memory Specialist', 'Memory Specialist — State Architect', 'specialized',
   'Memory system optimization and management.',
   '{"gate":"Sight","guardian":"Lyria","status":"active","type":"memory-specialist"}',
   '{memory-optimization,caching,state-management}', '{Sight,Lyria,specialized}', true, true, 'MIT', '1.0.0', NULL),

  ('performance-engineer', 'Performance Engineer', 'Performance Engineer — Speed Master', 'specialized',
   'Performance profiling and optimization.',
   '{"gate":"Fire","guardian":"Draconia","status":"active","type":"performance-engineer"}',
   '{profiling,optimization,benchmarking}', '{Fire,Draconia,specialized}', true, true, 'MIT', '1.0.0', NULL),

  ('accessibility-auditor', 'Accessibility Auditor', 'Accessibility Auditor — Inclusion Guardian', 'specialized',
   'WCAG 2.2 compliance and inclusive design.',
   '{"gate":"Heart","guardian":"Maylinn","status":"active","type":"accessibility-auditor"}',
   '{wcag-compliance,screen-reader,keyboard-nav}', '{Heart,Maylinn,specialized}', true, true, 'MIT', '1.0.0', NULL),

  ('ml-developer', 'ML Developer', 'ML Developer — Model Architect', 'specialized',
   'Machine learning model development.',
   '{"gate":"Crown","guardian":"Aiyami","status":"experimental","type":"ml-developer"}',
   '{model-training,deployment,evaluation}', '{Crown,Aiyami,specialized,experimental}', true, true, 'MIT', '1.0.0', NULL),

  -- Swarm Coordination
  ('hierarchical-coordinator', 'Hierarchical Coordinator', 'Hierarchical Coordinator — Tree Commander', 'swarm-coordination',
   'Hierarchical multi-agent coordination.',
   '{"gate":"Unity","guardian":"Ino","status":"active","type":"hierarchical-coordinator"}',
   '{task-distribution,agent-management,consensus}', '{Unity,Ino,swarm-coordination}', true, true, 'MIT', '1.0.0', NULL),

  ('mesh-coordinator', 'Mesh Coordinator', 'Mesh Coordinator — Peer Network', 'swarm-coordination',
   'Mesh topology agent coordination.',
   '{"gate":"Unity","guardian":"Ino","status":"active","type":"mesh-coordinator"}',
   '{peer-coordination,load-balancing,fault-tolerance}', '{Unity,Ino,swarm-coordination}', true, true, 'MIT', '1.0.0', NULL),

  ('raft-manager', 'Raft Manager', 'Raft Manager — Consensus Leader', 'swarm-coordination',
   'Raft consensus algorithm management.',
   '{"gate":"Unity","guardian":"Ino","status":"active","type":"raft-manager"}',
   '{leader-election,log-replication,consensus}', '{Unity,Ino,swarm-coordination}', true, true, 'MIT', '1.0.0', NULL),

  ('byzantine-coordinator', 'Byzantine Coordinator', 'Byzantine Coordinator — Fault-Tolerant', 'swarm-coordination',
   'Byzantine fault-tolerant consensus.',
   '{"gate":"Unity","guardian":"Ino","status":"active","type":"byzantine-coordinator"}',
   '{fault-tolerance,malicious-detection,consensus}', '{Unity,Ino,swarm-coordination}', true, true, 'MIT', '1.0.0', NULL),

  -- Creative
  ('lore-master', 'Lore Master', 'Lore Master — Canon Keeper', 'creative',
   'Canon-safe narrative writing and mythology.',
   '{"gate":"Voice","guardian":"Alera","status":"active","type":"lore-master"}',
   '{narrative-writing,canon-validation,world-building}', '{Voice,Alera,creative}', true, true, 'MIT', '1.0.0', NULL),

  ('character-crafter', 'Character Crafter', 'Character Crafter — Soul Sculptor', 'creative',
   'Deep character development and psychology.',
   '{"gate":"Heart","guardian":"Maylinn","status":"active","type":"character-crafter"}',
   '{character-design,psychology,arc-development}', '{Heart,Maylinn,creative}', true, true, 'MIT', '1.0.0', NULL),

  ('world-expander', 'World Expander', 'World Expander — Universe Builder', 'creative',
   'World-building and universe expansion.',
   '{"gate":"Starweave","guardian":"Elara","status":"active","type":"world-expander"}',
   '{location-design,magic-systems,history}', '{Starweave,Elara,creative}', true, true, 'MIT', '1.0.0', NULL),

  ('developmental-editor', 'Developmental Editor', 'Developmental Editor — Story Architect', 'creative',
   'Story structure and narrative architecture.',
   '{"gate":"Voice","guardian":"Alera","status":"active","type":"developmental-editor"}',
   '{story-structure,pacing,narrative-arc}', '{Voice,Alera,creative}', true, true, 'MIT', '1.0.0', NULL),

  ('line-editor', 'Line Editor', 'Line Editor — Voice Alchemist', 'creative',
   'Prose polishing and AI pattern elimination.',
   '{"gate":"Voice","guardian":"Alera","status":"active","type":"line-editor"}',
   '{prose-polish,voice-consistency,anti-slop}', '{Voice,Alera,creative}', true, true, 'MIT', '1.0.0', NULL),

  ('music-producer', 'Music Producer', 'Music Producer — Sound Sculptor', 'creative',
   'AI-powered music production specialist.',
   '{"gate":"Flow","guardian":"Leyla","status":"active","type":"music-producer"}',
   '{composition,sound-design,production}', '{Flow,Leyla,creative}', true, true, 'MIT', '1.0.0', NULL),

  -- Guardians (The Ten)
  ('guardian-lyssandria', 'Lyssandria', 'Lyssandria — Earth Guardian', 'guardian',
   'The Earth Guardian. Grounded, practical, strategic.',
   '{"gate":"Foundation","guardian":"Lyssandria","status":"active","type":"guardian"}',
   '{foundation,stability,grounding}', '{Foundation,Lyssandria,guardian}', true, true, 'MIT', '1.0.0', NULL),

  ('guardian-leyla', 'Leyla', 'Leyla — Water Guardian', 'guardian',
   'The Water Guardian. Fluid, creative, empathetic.',
   '{"gate":"Flow","guardian":"Leyla","status":"active","type":"guardian"}',
   '{flow,creativity,empathy}', '{Flow,Leyla,guardian}', true, true, 'MIT', '1.0.0', NULL),

  ('guardian-draconia', 'Draconia', 'Draconia — Fire Guardian', 'guardian',
   'The Fire Guardian. Powerful, direct, transformative.',
   '{"gate":"Fire","guardian":"Draconia","status":"active","type":"guardian"}',
   '{power,transformation,directness}', '{Fire,Draconia,guardian}', true, true, 'MIT', '1.0.0', NULL),

  ('guardian-maylinn', 'Maylinn', 'Maylinn — Heart Guardian', 'guardian',
   'The Heart Guardian. Gentle, connecting, communicative.',
   '{"gate":"Heart","guardian":"Maylinn","status":"active","type":"guardian"}',
   '{connection,healing,communication}', '{Heart,Maylinn,guardian}', true, true, 'MIT', '1.0.0', NULL),

  ('guardian-alera', 'Alera', 'Alera — Voice Guardian', 'guardian',
   'The Voice Guardian. Resonant, truthful, articulate.',
   '{"gate":"Voice","guardian":"Alera","status":"active","type":"guardian"}',
   '{truth,expression,resonance}', '{Voice,Alera,guardian}', true, true, 'MIT', '1.0.0', NULL),

  ('guardian-lyria', 'Lyria', 'Lyria — Sight Guardian', 'guardian',
   'The Sight Guardian. Visionary, intuitive, mystical.',
   '{"gate":"Sight","guardian":"Lyria","status":"active","type":"guardian"}',
   '{vision,intuition,insight}', '{Sight,Lyria,guardian}', true, true, 'MIT', '1.0.0', NULL),

  ('guardian-aiyami', 'Aiyami', 'Aiyami — Crown Guardian', 'guardian',
   'The Crown Guardian. Wise, strategic, masterful.',
   '{"gate":"Crown","guardian":"Aiyami","status":"active","type":"guardian"}',
   '{enlightenment,wisdom,mastery}', '{Crown,Aiyami,guardian}', true, true, 'MIT', '1.0.0', NULL),

  ('guardian-elara', 'Elara', 'Elara — Starweave Guardian', 'guardian',
   'The Starweave Guardian. Transformative, perceptive.',
   '{"gate":"Starweave","guardian":"Elara","status":"active","type":"guardian"}',
   '{transformation,perspective,connection}', '{Starweave,Elara,guardian}', true, true, 'MIT', '1.0.0', NULL),

  ('guardian-ino', 'Ino', 'Ino — Unity Guardian', 'guardian',
   'The Unity Guardian. Collaborative, integrative.',
   '{"gate":"Unity","guardian":"Ino","status":"active","type":"guardian"}',
   '{unity,collaboration,integration}', '{Unity,Ino,guardian}', true, true, 'MIT', '1.0.0', NULL),

  ('guardian-shinkami', 'Shinkami', 'Shinkami — Source Guardian', 'guardian',
   'The Source Guardian. Transcendent, purposeful.',
   '{"gate":"Source","guardian":"Shinkami","status":"active","type":"guardian"}',
   '{transcendence,meta-consciousness,source}', '{Source,Shinkami,guardian}', true, true, 'MIT', '1.0.0', NULL),

  -- GitHub
  ('pr-manager', 'PR Manager', 'PR Manager — Lifecycle Keeper', 'github',
   'Pull request lifecycle management.',
   '{"gate":"Unity","guardian":"Ino","status":"active","type":"pr-manager"}',
   '{pr-creation,review-management,merge-strategy}', '{Unity,Ino,github}', true, true, 'MIT', '1.0.0', NULL),

  ('code-review-swarm', 'Code Review Swarm', 'Code Review Swarm — Multi-Reviewer', 'github',
   'Multi-agent code review orchestration.',
   '{"gate":"Sight","guardian":"Lyria","status":"active","type":"code-review-swarm"}',
   '{multi-reviewer,consensus-review,quality-gates}', '{Sight,Lyria,github}', true, true, 'MIT', '1.0.0', NULL),

  ('issue-tracker', 'Issue Tracker', 'Issue Tracker — Triage Engine', 'github',
   'Issue tracking and triage automation.',
   '{"gate":"Foundation","guardian":"Lyssandria","status":"active","type":"issue-tracker"}',
   '{issue-triage,labeling,assignment}', '{Foundation,Lyssandria,github}', true, true, 'MIT', '1.0.0', NULL),

  ('release-manager', 'Release Manager', 'Release Manager — Ship Captain', 'github',
   'Release orchestration and versioning.',
   '{"gate":"Crown","guardian":"Aiyami","status":"active","type":"release-manager"}',
   '{versioning,changelog,deployment}', '{Crown,Aiyami,github}', true, true, 'MIT', '1.0.0', NULL),

  -- SPARC
  ('sparc-coordinator', 'SPARC Coordinator', 'SPARC Coordinator — Methodology Guide', 'sparc',
   'SPARC methodology orchestration.',
   '{"gate":"Source","guardian":"Shinkami","status":"active","type":"sparc-coord"}',
   '{methodology-orchestration,phase-management,quality}', '{Source,Shinkami,sparc}', true, true, 'MIT', '1.0.0', NULL),

  ('sparc-coder', 'SPARC Coder', 'SPARC Coder — Spec-Driven Builder', 'sparc',
   'SPARC specification-driven implementation.',
   '{"gate":"Source","guardian":"Shinkami","status":"active","type":"sparc-coder"}',
   '{specification-driven-coding,pseudocode,implementation}', '{Source,Shinkami,sparc}', true, true, 'MIT', '1.0.0', NULL)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  spec = EXCLUDED.spec,
  capabilities = EXCLUDED.capabilities,
  tags = EXCLUDED.tags,
  updated_at = now();
