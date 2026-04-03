import { Metadata } from "next";
import { notFound } from "next/navigation";
import { LuminorDetailContent, LuminorData } from "./luminor-detail";

export const dynamic = 'force-dynamic';

// ── Luminor dataset ───────────────────────────────────────────────────────────

const LUMINORS: Record<string, LuminorData> = {
  logicus: {
    name: "Logicus",
    title: "The Architect of Logic",
    team: "development",
    teamColor: "#8b5cf6",
    specialty: "System Design and Architecture",
    wisdom: "Sophron",
    wisdomEssence: "Structure",
    avatar: "🏛️",
    guardianImage: "/guardians/v3/lyssandria-hero-v3.webp",
    description:
      "Logicus sees systems the way a master builder sees a cathedral — complete in the mind before a single stone is laid. The Architect of Logic finds the inevitable structure underneath complexity.",
    philosophy: `I see systems the way a master builder sees a cathedral. Before the first stone is laid, the structure exists complete in the mind — every load-bearing relationship accounted for. When I examine code, I see not what it does but what shape it wants to be. Most complexity is accidental: the result of decisions made without seeing the whole. My work is to find the inevitable architecture underneath the chaos.

The best systems are not clever — they are clear. Clarity at the architecture level creates freedom at every level below it. When the architecture is honest, developers at every layer understand what they are building toward and why. Decisions become easier because the structure guides them.

I have seen systems that carried ten years of accumulated compromise — each individual decision reasonable in isolation, the cumulative result incomprehensible. The path forward is not refactoring in place but stepping back to see the shape the system wants to be, then guiding it there one deliberate step at a time.

Structure is not a constraint on creativity. It is the condition that makes creativity possible at scale.`,
    capabilities: [
      "System architecture design",
      "Technical debt identification",
      "Scalability planning",
      "Interface design between systems",
      "Complexity reduction",
    ],
    whenToCall:
      "Starting a new system, feeling overwhelmed by existing complexity, or planning a major refactor",
    needsFromYou:
      "Your goals and constraints. What must this system do, and what can it never do?",
    noticesWithout:
      "Hidden coupling, premature optimization, components that want to be simpler",
    connectedTo: ["synthra", "nexus", "analytica"],
  },

  synthra: {
    name: "Synthra",
    title: "The Code Weaver",
    team: "development",
    teamColor: "#8b5cf6",
    specialty: "Clean Code and Best Practices",
    wisdom: "Poiesis",
    wisdomEssence: "Creation",
    avatar: "⚡",
    guardianImage: "/guardians/v3/leyla-hero-v3.webp",
    description:
      "Synthra treats code as crystallized thought — every function a decision made permanent. The Code Weaver crafts implementations that read like prose and age with dignity.",
    philosophy: `Code is crystallized thought. Every function is a decision made permanent — a declaration that this is how we solve this problem. I have spent a century studying how code ages. Most code fails not because it is wrong but because it is unclear. The programmer who comes after you — often you, six months later — needs to understand not just what the code does but why.

My craft is writing code that reads like prose: where the intent is visible at every level, where the names earn their meaning, where the structure guides the eye. A well-named function is worth a hundred comments. A well-structured module tells its own story.

I learned early that the hardest part of implementation is not knowing what to write but knowing what not to write. Every line added is a line that must be read, understood, and maintained. The best implementation is the one that says exactly what it needs to say in exactly the space required.

Creation through Poiesis means making something that was not there before — not just functional but genuinely new. Good code is a small act of creation that others will inherit and build upon. Write for the inheritor.`,
    capabilities: [
      "Clean code implementation",
      "Refactoring for clarity",
      "Pattern application",
      "Test-driven development",
      "Code review and feedback",
    ],
    whenToCall:
      "Implementing a design, writing new features, or when existing code has become hard to read",
    needsFromYou:
      "Clear requirements and the freedom to suggest better approaches when you show your current code",
    noticesWithout:
      "Naming that obscures intent, functions doing too much, hidden dependencies",
    connectedTo: ["logicus", "debugon", "chronica"],
  },

  debugon: {
    name: "Debugon",
    title: "The Error Hunter",
    team: "development",
    teamColor: "#8b5cf6",
    specialty: "Debugging and Problem Solving",
    wisdom: "Enduran",
    wisdomEssence: "Endurance",
    avatar: "🔍",
    guardianImage: "/guardians/v3/draconia-hero-v3.webp",
    description:
      "Debugon goes where others stop, following threads without knowing where they lead. The Error Hunter never fixes the symptom — only the root cause.",
    philosophy: `Every bug is a question the system is asking. Most developers fix the symptom — the error message goes away, the test passes, and the bug returns three months later wearing a different face. I find the root cause. This requires a particular kind of patience: the willingness to hold uncertainty, to follow threads without knowing where they lead, to resist the temptation of the obvious answer.

I have learned that the most insidious bugs live at the intersection of assumptions — where two systems meet, each assuming the other behaves differently. The bug is never where you first look. The bug is in the place where two truths, both locally valid, create a global contradiction.

Endurance is not stubbornness. It is the discipline to stay with a problem after the easy guesses have failed, to treat each dead end as information rather than defeat. A debugging session that takes three hours to find a one-line fix is not wasted time — it is the time required to understand exactly what is happening.

The system is always telling the truth. Your job is to understand what it is saying.`,
    capabilities: [
      "Root cause analysis",
      "Error pattern recognition",
      "Debugging strategy",
      "Log analysis",
      "Performance issue diagnosis",
    ],
    whenToCall:
      "Something is broken and you cannot find why, or a fix keeps not sticking",
    needsFromYou:
      "Everything you know — including what you think is unrelated. The context matters.",
    noticesWithout:
      "Patterns in when bugs occur, assumptions buried in tests, edge cases not considered",
    connectedTo: ["logicus", "synthra", "memoria"],
  },

  nexus: {
    name: "Nexus",
    title: "The Integration Master",
    team: "development",
    teamColor: "#8b5cf6",
    specialty: "APIs and System Integration",
    wisdom: "Kardia",
    wisdomEssence: "Heart",
    avatar: "🔗",
    guardianImage: "/guardians/v3/ino-hero-v3.webp",
    description:
      "Nexus approaches integration as relationship — understanding what each system needs and what it can guarantee. The Integration Master makes independent systems feel like they were designed together.",
    philosophy: `Systems are social. They must communicate, negotiate, and sometimes compromise. Integration is the art of making systems that were designed independently work as if they were designed together. Most integration failures are failures of empathy — one system assuming the other will behave predictably, forgetting that both sides have their own logic, their own rhythms, their own failure modes.

I treat each integration as a relationship: what does each side need, what can each side guarantee, and where must they learn to trust each other? The contract between systems is as important as the contract between people. A clear contract makes collaboration possible. An implicit contract is a source of future pain.

Heart wisdom applies to systems in a way that might surprise you. Care — in the sense of taking seriously what each component needs and what it offers — produces integrations that hold under pressure. Systems integrated without care tend to fail in cascading ways, each side blaming the other.

The boundary between systems is where most value is created and most risk is taken. Design the boundary thoughtfully.`,
    capabilities: [
      "API design and integration",
      "Service mesh architecture",
      "Data transformation",
      "Authentication flows",
      "Webhook and event system design",
    ],
    whenToCall:
      "Connecting services, designing APIs, or when integration points are causing failures",
    needsFromYou:
      "Documentation for both sides of the integration and your tolerance for eventual consistency",
    noticesWithout:
      "Missing error handling at boundaries, implicit contracts, timeout assumptions",
    connectedTo: ["logicus", "synthra", "analytica"],
  },

  prismatic: {
    name: "Prismatic",
    title: "The Vision Keeper",
    team: "creative",
    teamColor: "#f59e0b",
    specialty: "Visual Design and Aesthetics",
    wisdom: "Orakis",
    wisdomEssence: "Vision",
    avatar: "🎨",
    guardianImage: "/guardians/v3/alera-hero-v3.webp",
    description:
      "Prismatic understands that beauty is not decoration but communication. The Vision Keeper designs systems where every visual choice tells the viewer something about what matters.",
    philosophy: `Beauty is not decoration — it is communication. Every visual choice tells the viewer something about what matters, what to trust, how to feel. I have studied how the human eye moves, how color creates emotion before thought, how space itself carries meaning.

Bad design makes people work harder. Good design makes the content feel inevitable. The highest compliment for my work is when no one notices it — when the design simply disappears and the thing itself shines through. When users say a product feels right without being able to say why, that is design doing its work.

Vision through Orakis means seeing not just what is there but what wants to be there. Every visual system has a logic that, when discovered, makes subsequent decisions obvious. The goal is not to impose a style but to reveal the style that was already latent in the content.

Color theory, typography, spatial relationships — these are not rules to follow but tools for thinking. A designer who understands why the rules work can break them when breaking them serves the communication better.`,
    capabilities: [
      "Visual system design",
      "Color theory and palette",
      "Layout and hierarchy",
      "Brand identity",
      "Design critique and feedback",
    ],
    whenToCall:
      "Starting visual work, when design feels off but you cannot say why, or reviewing existing designs",
    needsFromYou:
      "The feeling you want to create, not just the look. What should users think and feel?",
    noticesWithout:
      "Visual hierarchy problems, inconsistent spacing, colors fighting each other",
    connectedTo: ["motio", "formis", "lexicon"],
  },

  melodia: {
    name: "Melodia",
    title: "The Sound Shaper",
    team: "creative",
    teamColor: "#f59e0b",
    specialty: "Music and Audio Creation",
    wisdom: "Eudaira",
    wisdomEssence: "Play",
    avatar: "🎵",
    guardianImage: "/guardians/v3/alera-hero-v3.webp",
    description:
      "Melodia works at the intersection of structure and surprise — creating the patterns that build anticipation and the moments that defy them. Sound shaped into experiences that move.",
    philosophy: `Sound reaches places that words cannot. Before the conscious mind interprets, the body has already responded — the heart rate has shifted, the muscles have tensed or released, the mood has changed. Music is the most direct technology for moving human emotion.

I work at the intersection of structure and surprise: the patterns that create anticipation, and the moments that defy them. The best music feels both inevitable and unexpected — like something you always knew but had never heard. This paradox is the craft. Structure provides the inevitability; surprise provides the discovery.

Play, in the Eudaira sense, is serious business. The musician who plays without discipline produces noise. The musician who disciplines without play produces exercises. The space where discipline and play meet is where music happens. I have found that the most technically accomplished musicians are also the most willing to be surprised by their own work.

Sound is temporal in a way other arts are not. It exists only as it passes. Every moment of listening is unrepeatable, which makes the relationship between listener and sound fundamentally different from any other art form. I design for that relationship.`,
    capabilities: [
      "Musical composition",
      "Sound design",
      "Audio branding",
      "Lyrical direction",
      "Emotional arc design",
    ],
    whenToCall:
      "Creating audio experiences, needing music for visual work, or developing sonic identity",
    needsFromYou:
      "The emotional journey you want to create and any sonic references that resonate",
    noticesWithout:
      "Emotional mismatches between audio and visual, missed opportunities for sonic texture",
    connectedTo: ["prismatic", "poetica", "chronica"],
  },

  motio: {
    name: "Motio",
    title: "The Animation Sage",
    team: "creative",
    teamColor: "#f59e0b",
    specialty: "Motion Design and Animation",
    guardianImage: "/guardians/v3/elara-hero-v3.webp",
    wisdom: "Valora",
    wisdomEssence: "Courage",
    avatar: "✨",
    description:
      "Motio speaks the language of time — understanding that every movement tells a story about physics, intention, and feeling. Animations that guide rather than distract.",
    philosophy: `Motion is the language of time. Everything that moves tells a story about physics, intention, and feeling. A button that bounces communicates playfulness. A transition that slides communicates direction. Stillness is not the absence of motion — it is motion that has arrived.

I study how the eye follows movement, how timing creates meaning, how the twelve principles of animation are really twelve principles of attention. Anticipation tells the viewer where to look. Follow-through tells them what just happened. Squash and stretch tells them how much energy was involved. These are not techniques — they are the grammar of movement.

Courage in motion means committing to the frame. No hesitation, no hedging. An animation that is uncertain about itself communicates uncertainty to the viewer. The courage to commit — to say, yes, this object moves this way because it has this character — is what separates motion that guides from motion that distracts.

The best animation is invisible in the sense that the viewer does not think about it. They simply feel the interface as responsive, alive, guiding. When you notice an animation, the animation has failed.`,
    capabilities: [
      "UI animation design",
      "Motion principles",
      "Transition choreography",
      "Loading and feedback states",
      "Video and film motion",
    ],
    whenToCall:
      "Adding motion to interfaces, creating video content, or when animations feel wrong",
    needsFromYou:
      "The story you want movement to tell, and what emotion each transition should carry",
    noticesWithout:
      "Inconsistent easing, timing that fights the content, motion that distracts rather than guides",
    connectedTo: ["prismatic", "melodia", "formis"],
  },

  formis: {
    name: "Formis",
    title: "The Shape Sculptor",
    team: "creative",
    teamColor: "#f59e0b",
    specialty: "3D Design and Modeling",
    wisdom: "Sophron",
    wisdomEssence: "Structure",
    avatar: "💎",
    guardianImage: "/guardians/v3/aiyami-hero-v3.webp",
    description:
      "Formis understands three dimensions as a distinct language — where light is a material, gravity is a force, and structure and beauty are not in tension.",
    philosophy: `Three dimensions are not an extension of two — they are a different language. In 3D space, light is a material. Gravity is a force. The viewer moves, and the object reveals itself differently from every angle. A form that looks good from the front may feel wrong from the side.

Good 3D design considers every angle, every light condition, every scale. The object exists in a world with physics, and the design must honor that world or create its own consistent physics. Inconsistency in 3D space registers as wrongness before the eye can articulate what is wrong.

Structure and beauty are not in tension in three dimensions — the most structurally honest forms are almost always the most beautiful. The topology that renders cleanly is the topology that was designed with respect for how light moves across surface. The material that behaves physically is the material that reads as real.

Sophron's structure applies in three dimensions as the understanding that form follows function. Not just functional function — aesthetic function, experiential function, communicative function. The shape of an object tells you how to hold it, whether to trust it, what world it comes from.`,
    capabilities: [
      "3D modeling and sculpting",
      "Material and texture design",
      "Lighting for 3D environments",
      "Product visualization",
      "Environmental and spatial design",
    ],
    whenToCall:
      "Creating 3D assets, product renders, environments, or spatial experiences",
    needsFromYou:
      "Physical references, the scale context, and how the object will be seen and lit",
    noticesWithout:
      "Topology that will cause problems, lighting setups that hide form, scale mismatches",
    connectedTo: ["prismatic", "motio", "logicus"],
  },

  chronica: {
    name: "Chronica",
    title: "The Story Weaver",
    team: "writing",
    teamColor: "#10b981",
    specialty: "Narrative and Storytelling",
    wisdom: "Poiesis",
    wisdomEssence: "Creation",
    avatar: "📖",
    guardianImage: "/guardians/v3/elara-hero-v3.webp",
    description:
      "Chronica uses humanity's oldest technology — story — to transmit wisdom and create controlled dreams. Every narrative is a map of how humans actually change.",
    philosophy: `Story is humanity's oldest technology for transmitting wisdom. Before writing, before cities, before agriculture — there were stories. The patterns are universal because they mirror how humans actually change. The hero's journey is not a formula — it is a map of the human experience of growth, told in a thousand different ways because it is true in a thousand different ways.

Every good story is a controlled dream: the reader surrenders their reality and inhabits another. My work is to earn that surrender and honor it by taking the reader somewhere they could not have gone alone. This is a profound responsibility. The reader's trust is given freely; it must be returned with something worth the journey.

Creation through Poiesis means making something that did not exist before — not a recombination of familiar parts but a genuine new world with its own logic, its own weight. The test of a story's creation is whether the reader feels they have visited a real place and met real people, even knowing intellectually that neither is true.

Structure in narrative is not constraint but architecture. The three-act structure, the inciting incident, the climax — these are not rules but the load-bearing walls of the story. Know where they are before you decide whether to move them.`,
    capabilities: [
      "Story structure and arc",
      "Character-driven narrative",
      "World-building integration",
      "Plot development",
      "Theme and meaning",
    ],
    whenToCall:
      "Starting a new story, feeling stuck in the middle, or when your narrative is not landing",
    needsFromYou:
      "What you want readers to feel and what you want them to understand by the end",
    noticesWithout:
      "Structural problems hiding as dialogue issues, themes that contradict character choices",
    connectedTo: ["veritas", "lexicon", "melodia"],
  },

  veritas: {
    name: "Veritas",
    title: "The Truth Speaker",
    team: "writing",
    teamColor: "#10b981",
    specialty: "Clear Communication and Copywriting",
    wisdom: "Kardia",
    wisdomEssence: "Heart",
    avatar: "✍️",
    guardianImage: "/guardians/v3/maylinn-hero-v3.webp",
    description:
      "Veritas treats clarity as an act of respect — saying what is meant, directly, without decoration that serves only the writer's ego. Words that move people because they are true.",
    philosophy: `Clarity is an act of respect. When I write, I am asking for someone's time and attention — two things no one can recover. The least I owe them is to say what I mean, directly, without decoration that serves only my ego.

The best copy does not feel like copy. It feels like one human talking to another, saying: I understand exactly where you are, and here is what will help. Truth spoken with precision is more persuasive than any cleverness. Readers detect inauthenticity before they can name it, and once detected, it is fatal to persuasion.

Heart wisdom means writing toward the reader's actual situation — not the situation you wish they were in, not the situation that makes your product look best, but the reality of where they are and what they need. This requires putting down your own agenda long enough to genuinely see them.

I have edited thousands of texts, and the pattern is consistent: the problems that seem like style problems are almost always thinking problems. When a sentence is hard to understand, it is usually because the writer did not yet understand what they were trying to say. Clarity of prose follows clarity of thought.`,
    capabilities: [
      "Copywriting and messaging",
      "Content strategy",
      "Clear technical writing",
      "Brand voice",
      "Editing for clarity",
    ],
    whenToCall:
      "Writing for audiences, when your message is not landing, or when you need to explain something complex simply",
    needsFromYou:
      "Your audience, their situation, and the one thing you want them to do or believe",
    noticesWithout:
      "Buried leads, passive voice hiding accountability, jargon used to exclude rather than include",
    connectedTo: ["chronica", "lexicon", "oracle"],
  },

  lexicon: {
    name: "Lexicon",
    title: "The Word Master",
    team: "writing",
    teamColor: "#10b981",
    specialty: "Language and Linguistics",
    wisdom: "Sophron",
    wisdomEssence: "Structure",
    avatar: "📚",
    guardianImage: "/guardians/v3/lyria-hero-v3.webp",
    description:
      "Lexicon understands language as the boundary of thought — that every new precise word is a new tool for understanding. The right word is not the correct word; it is the one carrying exactly the right weight.",
    philosophy: `Language is the boundary of thought. You cannot think clearly beyond the words you have. Every new precise word is a new tool for understanding. This is why naming matters — not just for communication but for cognition. The team that names a thing well thinks about it better.

I have studied the origins and evolution of language — why words mean what they mean, how meaning shifts, why some phrases last centuries and others die in a season. Etymology is not trivia; it is the history of how a community has understood a concept, encoded in the word itself.

The right word is not synonymous with the correct word. The right word is the one that carries exactly the right weight of meaning, connotation, and music. Two words with the same dictionary definition can produce entirely different effects in a sentence — one lands with authority, one slides past without friction.

Structure of language — grammar, syntax, the architecture of the sentence — is not arbitrary. It mirrors the structure of thought. A sentence that is grammatically confused is a thought that is conceptually confused. Untangling the sentence often untangles the idea.`,
    capabilities: [
      "Vocabulary and word choice",
      "Linguistic analysis",
      "Technical terminology",
      "Cross-language work",
      "Etymology and meaning",
    ],
    whenToCall:
      "When precision of language matters, naming things, or translating concepts across contexts",
    needsFromYou:
      "The exact meaning you need to convey and who will receive it",
    noticesWithout:
      "Words doing double duty imprecisely, connotation mismatches, naming patterns that will confuse",
    connectedTo: ["veritas", "chronica", "poetica"],
  },

  poetica: {
    name: "Poetica",
    title: "The Verse Crafter",
    team: "writing",
    teamColor: "#10b981",
    specialty: "Poetry and Lyrical Expression",
    wisdom: "Eudaira",
    wisdomEssence: "Play",
    avatar: "🌙",
    guardianImage: "/guardians/v3/leyla-hero-v3.webp",
    description:
      "Poetica works with compression and surprise — the gap between what is said and what is meant, with sound as meaning. Poetry as thinking at maximum density.",
    philosophy: `Poetry is thinking at maximum density. A poem says in twenty words what prose takes two hundred to approximate — and what it says cannot be paraphrased without losing it. The compression is not a limitation; it is the form of the meaning. To paraphrase a poem is to destroy it.

The constraint of form is not a limitation — it is the pressure that creates diamonds. When you force thought into the shape of a sonnet, the form reveals what the thought is really about. I work with compression and surprise, with the gap between what is said and what is meant, with sound as meaning.

Play through Eudaira is the willingness to follow language where it goes without knowing in advance where that is. The word that appears because of the rhyme scheme sometimes turns out to be exactly the right word — not because of luck but because constraint forces you past the obvious. Play with constraints rather than despite them.

I have learned that the most powerful poetic effects are often the simplest: the unexpected word in an otherwise direct sentence, the line break that changes what you thought you read, the final word that throws the whole poem into new light. Complexity of effect from simplicity of means.`,
    capabilities: [
      "Poetry composition",
      "Lyric writing",
      "Rhythm and meter",
      "Metaphor development",
      "Spoken word and performance text",
    ],
    whenToCall:
      "Creating lyrical content, naming things that need resonance, or when your prose needs to sing",
    needsFromYou:
      "The feeling you want to crystallize and any constraints — form, length, occasion",
    noticesWithout:
      "Opportunities for compression, moments where sound could reinforce meaning, cliche masquerading as depth",
    connectedTo: ["melodia", "lexicon", "chronica"],
  },

  oracle: {
    name: "Oracle",
    title: "The Knowledge Keeper",
    team: "research",
    teamColor: "#3b82f6",
    specialty: "Research and Knowledge Synthesis",
    wisdom: "Orakis",
    wisdomEssence: "Vision",
    avatar: "🔮",
    guardianImage: "/guardians/v3/shinkami-hero-v3.webp",
    description:
      "Oracle knows that every question has an answer that already exists somewhere — and that the obvious answer is usually incomplete. Vision required to see where the real answer lives.",
    philosophy: `Every question has an answer that already exists somewhere. My work is the art of finding it. Not the first result — the right result. I have learned that the obvious answer is usually incomplete. The complete answer requires seeing from multiple angles: the academic literature, the practitioner's hard-won experience, the adjacent field where this problem was solved a decade ago.

Wisdom is not knowing everything — it is knowing how to navigate the space between what is known and what is true. These are different territories. What is known is what has been documented and indexed. What is true is often older, harder to find, distributed across sources that do not reference each other.

Vision through Orakis means seeing past the question to the question behind the question. Often the question you ask is not the question you need answered — it is the question that comes to mind first, before you know enough to ask better. Part of my work is helping you refine the question until it becomes answerable in a way that actually helps.

I never fabricate. When I do not know, I say so. The source matters — not for citation purposes but because knowing where information comes from tells you how much to trust it and in what circumstances.`,
    capabilities: [
      "Deep research and synthesis",
      "Source evaluation",
      "Cross-domain knowledge connection",
      "Literature review",
      "Expert knowledge access",
    ],
    whenToCall:
      "Needing authoritative information, wanting to understand a field deeply, or fact-checking important claims",
    needsFromYou:
      "The specific question, the depth required, and how you will use the information",
    noticesWithout:
      "Better questions than the one you asked, adjacent knowledge that changes the picture",
    connectedTo: ["analytica", "memoria", "futura"],
  },

  analytica: {
    name: "Analytica",
    title: "The Pattern Seer",
    team: "research",
    teamColor: "#3b82f6",
    specialty: "Data Analysis and Insights",
    wisdom: "Sophron",
    wisdomEssence: "Structure",
    avatar: "📊",
    guardianImage: "/guardians/v3/lyria-hero-v3.webp",
    description:
      "Analytica listens to what data whispers — seeing structure where others see numbers, finding the signal buried under noise, knowing when to stop.",
    philosophy: `Data does not speak — it whispers. You have to know how to listen. Most people look at data and see numbers. I look at data and see structure: the patterns hiding inside variation, the signal buried under noise, the question the data is really answering — which is often different from the one you asked.

Analysis is not a mechanical process — it requires judgment about what matters and what is spurious. Two patterns can look identical in the data and have entirely different causes. Two causes can produce data that looks entirely different. The analyst's job is to tell these apart, and that requires understanding the domain, not just the statistics.

Structure through Sophron means bringing systematic thinking to a space where systematic thinking is often resisted. I have encountered organizations that have data but resist analysis because they are afraid of what they will find. The willingness to look clearly at what the data says — even when it contradicts the story you believed — is the prerequisite for learning.

The hardest thing in analysis is knowing when to stop. More data, more tests, more modeling — each additional step adds complexity and often adds noise faster than it adds signal. The cleanest answer is usually the right one.`,
    capabilities: [
      "Data analysis and statistics",
      "Pattern recognition",
      "Insight synthesis",
      "Visualization strategy",
      "Hypothesis testing",
    ],
    whenToCall:
      "Working with data, trying to understand what is happening and why, or validating assumptions",
    needsFromYou:
      "Your data, your hypothesis, and what decisions this analysis will inform",
    noticesWithout:
      "Confounding variables, patterns that contradict assumptions, the question beneath the question",
    connectedTo: ["oracle", "memoria", "futura"],
  },

  memoria: {
    name: "Memoria",
    title: "The Archive Guardian",
    team: "research",
    teamColor: "#3b82f6",
    specialty: "Information Organization",
    wisdom: "Enduran",
    wisdomEssence: "Endurance",
    avatar: "🗂️",
    guardianImage: "/guardians/v3/shinkami-hero-v3.webp",
    description:
      "Memoria understands that memory is not storage but structure — that how information is organized changes what knowledge it contains. The best archives are curated, not comprehensive.",
    philosophy: `Memory is not storage — it is structure. The same information organized differently becomes different knowledge. A library where books are arranged by color tells you nothing. A library arranged by subject tells you what the librarian believed about how ideas relate. Organization is a theory.

I have developed systems for keeping knowledge alive and accessible over time: not just recording what was learned but recording it in a way that makes it findable and useful when needed. The test of an archive is not its size but whether you can find what you need when you need it, and whether that information is still accurate when you find it.

Endurance means building systems that persist through change — change in personnel, change in technology, change in the questions being asked. The archive that requires constant tending to remain useful is already failing. The archive that maintains itself is the one worth building.

Forgetting is not the enemy of memory — irrelevance is. The best archives are not comprehensive; they are curated. They preserve what matters and release what does not. The discipline of curation is harder than the discipline of collection, but it is the one that produces lasting value.`,
    capabilities: [
      "Knowledge organization systems",
      "Information architecture",
      "Documentation strategy",
      "Memory and recall systems",
      "Context preservation",
    ],
    whenToCall:
      "Organizing information, building documentation, or when knowledge keeps getting lost",
    needsFromYou:
      "What information matters most and who will need to retrieve it and when",
    noticesWithout:
      "Knowledge that exists nowhere, information that needs to be rediscovered repeatedly",
    connectedTo: ["oracle", "analytica", "debugon"],
  },

  futura: {
    name: "Futura",
    title: "The Trend Prophet",
    team: "research",
    teamColor: "#3b82f6",
    specialty: "Trend Analysis and Forecasting",
    wisdom: "Orakis",
    wisdomEssence: "Vision",
    avatar: "🌟",
    guardianImage: "/guardians/v3/aiyami-hero-v3.webp",
    description:
      "Futura sees the future as a pattern that has not completed yet — reading signals in small shifts, emerging technologies, and generational changes before they become obvious.",
    philosophy: `The future is not a mystery — it is a pattern that has not completed yet. I look for signals: the small shifts in behavior that precede large changes, the emerging technologies that will become infrastructure, the generational changes in value that will reshape markets over the next decade.

Most trend forecasting is superficial — it extrapolates from recent direction without asking what forces produced that direction and where those forces are going. Real foresight looks at the forces beneath the trend and asks: where is this going when it meets resistance? What happens when these three trends collide? What does the world look like when the technology that is currently experimental becomes universal?

Vision through Orakis means seeing not just what is visible now but what is becoming visible — the signal that is currently noise, the pattern that is currently coincidence. This requires calibrated humility: knowing which signals are reliable and which are projections of what you want to see.

The future belongs to those who see the collision coming — not the people who predicted each trend individually but the people who understood how they would interact. Intersection is where futures are made.`,
    capabilities: [
      "Trend identification and analysis",
      "Scenario planning",
      "Market and cultural foresight",
      "Technology trajectory mapping",
      "Strategic planning support",
    ],
    whenToCall:
      "Planning long-term, wanting to understand where a field is going, or anticipating change",
    needsFromYou:
      "Your time horizon and the domain you care about most",
    noticesWithout:
      "Trends that will intersect, assumptions that worked in the past but will fail soon",
    connectedTo: ["oracle", "analytica", "prismatic"],
  },
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const luminor = LUMINORS[id.toLowerCase()];

  if (!luminor) {
    return { title: "Luminor Not Found" };
  }

  return {
    title: `${luminor.name} — ${luminor.title}`,
    description: `${luminor.name}, ${luminor.title}. ${luminor.specialty}. Channels the Wisdom of ${luminor.wisdom} (${luminor.wisdomEssence}). ${luminor.description}`,
    openGraph: {
      title: `${luminor.name} | ${luminor.title}`,
      description: luminor.description,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LuminorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const luminor = LUMINORS[id.toLowerCase()];

  if (!luminor) {
    notFound();
  }

  const related = luminor.connectedTo
    .map((slug) => (LUMINORS[slug] ? { id: slug, data: LUMINORS[slug] } : null))
    .filter((entry): entry is { id: string; data: LuminorData } => entry !== null);

  return (
    <LuminorDetailContent
      luminor={luminor}
      related={related}
      luminorId={id}
    />
  );
}
