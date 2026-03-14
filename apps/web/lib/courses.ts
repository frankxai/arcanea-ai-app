// ── Academy Course System ────────────────────────────────────────────────────
// Courses map to Gates and provide structured learning paths.
// Each course has lessons with exercises tied to creative practice.

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g. "15 min"
  type: 'reading' | 'exercise' | 'reflection' | 'practice';
  content: string; // markdown content
}

export interface Course {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  gate: number; // which gate this course relates to (1-10)
  gateName: string;
  guardian: string;
  element: string;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // total estimated time
  lessons: Lesson[];
  prerequisites: string[]; // slugs of prerequisite courses
  outcomes: string[];
}

export const COURSES: Course[] = [
  {
    slug: 'foundations-of-creation',
    title: 'Foundations of Creation',
    subtitle: 'Establish your creative ground',
    description:
      'Build the daily practice, values, and commitment that sustain a lifetime of creative work. The Foundation Gate opens through consistency, not inspiration.',
    gate: 1,
    gateName: 'Foundation',
    guardian: 'Lyssandria',
    element: 'Earth',
    color: '#34d399',
    difficulty: 'beginner',
    duration: '2 hours',
    prerequisites: [],
    outcomes: [
      'A personal daily creative practice you can sustain',
      'Clarity on your core creative values',
      'Understanding of the Foundation Gate principles',
      'A 21-day practice commitment plan',
    ],
    lessons: [
      {
        id: 'why-foundations',
        title: 'Why Foundations Matter',
        description: 'Every lasting creation starts with solid ground.',
        duration: '10 min',
        type: 'reading',
        content: `## The Root of All Creation

Before you can build anything that lasts, you must have ground to stand on.

Most creators skip this step. They chase inspiration, waiting for lightning to strike. But the creators who endure — the ones whose work accumulates into something real — all share one thing: **a foundation they can rely on when inspiration is absent.**

Lyssandria, Guardian of the Foundation Gate, teaches a simple truth:

> "The earth does not hurry. Yet everything is accomplished."

This course is about building that ground. Not the exciting work of creating masterpieces, but the essential work of establishing the conditions where masterpieces become possible.

### What Foundation Means

Foundation is not talent. It is not inspiration. It is the daily commitment to show up, even when showing up feels pointless. It is:

- **A practice** — something you do every day, however small
- **Values** — what you will and will not compromise
- **A routine** — the container that holds your creative life
- **Patience** — the understanding that growth is slow and invisible before it is sudden and obvious`,
      },
      {
        id: 'your-creative-values',
        title: 'Define Your Creative Values',
        description: 'What will you build on? What will you not compromise?',
        duration: '20 min',
        type: 'exercise',
        content: `## Your Creative Values

Every creator builds on values, whether they name them or not. Naming them gives you power over them.

### Exercise: The Five Pillars

Take 15 minutes. Write down answers to these questions:

1. **What do you create for?** Not what you create — why you create at all. Is it expression? Connection? Understanding? Healing?

2. **What will you not compromise?** Every creator has a line. Some will not sacrifice honesty. Some will not sacrifice craft. Some will not sacrifice accessibility. Name yours.

3. **What kind of creator do you want to be in 10 years?** Not what you want to have made — who you want to have become.

4. **What creative habit would change everything if you kept it?** Be honest. You already know what it is.

5. **What are you avoiding?** The thing you keep meaning to start, keep putting off. Name it without judgment.

### Reflection

Look at your answers. These five responses are the foundation of your creative life. They do not need to be perfect — foundations are refined over time. But they need to exist.

Write them somewhere you will see them daily.`,
      },
      {
        id: 'the-daily-practice',
        title: 'The Daily Practice',
        description: 'Build a practice you can sustain for years, not days.',
        duration: '15 min',
        type: 'practice',
        content: `## Building a Daily Practice

The Academy teaches that a daily practice is the single most important thing a creator can establish. Not a daily masterpiece — a daily practice.

### The Rules of Practice

**1. Make it small enough to never skip.**
If your practice is "write for 2 hours," you will skip it. If your practice is "write one sentence," you will do it even on your worst day. Start absurdly small.

**2. Attach it to something you already do.**
After morning coffee. Before bed. During your commute. Habits stick when linked to existing routines.

**3. Protect it from negotiation.**
The practice is not optional. It is not something you do "if you have time." It is as non-negotiable as eating.

**4. Track it without judging it.**
Mark each day you practice. Do not grade the quality. Showing up is the only metric that matters for the first 21 days.

### Your Practice Plan

Choose ONE creative action. Make it small. Write it down:

"Every day, after ____________, I will ____________ for at least ____________."

This is your Foundation Gate practice. The gate opens after 21 consecutive days.`,
      },
      {
        id: 'the-routine',
        title: 'The Creative Routine',
        description: 'Design the container that holds your creative life.',
        duration: '20 min',
        type: 'reading',
        content: `## The Container

The Arcanean Academy follows a daily rhythm for a reason: **creativity needs a container.**

A container is not a cage. It is a garden bed — boundaries that give your creative energy somewhere to go instead of everywhere at once.

### The Academy Rhythm (Adapted)

You do not need to follow the Academy's exact schedule. But you need *a* schedule:

**Morning Block** — Your primary creative time. Protect it. Do your most important creative work when your mind is freshest.

**Afternoon Block** — Study, learn, practice skills. This is craft-building time, not creation time.

**Evening Block** — Reflect on what you made. Review. Let the subconscious begin processing overnight.

### The Key Insight

Most creators fail not because they lack talent but because they lack structure. They create when they "feel like it" — which means they create rarely and inconsistently.

The routine removes the decision. You do not decide whether to create today. You already decided — weeks ago, when you built the routine. Today you just follow it.

### Exercise

Map your ideal creative week. Be realistic — include your job, your responsibilities, your rest. Find the gaps where creation can live. Even 20 minutes a day, protected and consistent, will transform your creative output within a year.`,
      },
      {
        id: 'patience-and-time',
        title: 'The Patience of Earth',
        description: 'Why slow growth produces the strongest results.',
        duration: '15 min',
        type: 'reflection',
        content: `## Slow Growth

Lyssandria's element is Earth. Earth does not rush.

Seeds germinate underground for weeks before anything visible happens. The strongest trees grow slowly. Mountains form over millennia.

Your creative foundation works the same way. The first 21 days of daily practice will feel pointless. Nothing dramatic will happen. You will wonder if it is working.

It is working.

### Reflection Questions

Sit with these for a few minutes:

1. Where in your creative life have you been rushing? What would happen if you slowed down?

2. Think of something you have gotten genuinely good at. How long did it take? Was the progress visible day-to-day, or only in retrospect?

3. What would your creative life look like if you committed to one practice for an entire year? Not a month — a year.

### The Foundation Gate Opens

The Foundation Gate does not open through a dramatic moment. It opens through accumulation — the quiet, invisible kind.

21 days of consistent practice. Values you have named and committed to. A routine you protect.

When the gate opens, you will not hear thunder. You will simply notice, one morning, that you are no longer wondering whether you are a creator. You just are.

That is the foundation.`,
      },
    ],
  },
  {
    slug: 'creative-flow',
    title: 'Creative Flow',
    subtitle: 'Find and sustain your creative current',
    description:
      'Learn to enter flow states, work with emotion as creative fuel, and create across multiple mediums. The Flow Gate opens through creative range and emotional honesty.',
    gate: 2,
    gateName: 'Flow',
    guardian: 'Leyla',
    element: 'Water',
    color: '#60a5fa',
    difficulty: 'beginner',
    duration: '2.5 hours',
    prerequisites: ['foundations-of-creation'],
    outcomes: [
      'Techniques for entering creative flow states',
      'Using emotion as raw material for creation',
      'Cross-medium creative exploration',
      'A personal flow ritual',
    ],
    lessons: [
      {
        id: 'what-is-flow',
        title: 'What Flow Actually Is',
        description: 'Flow is not magic. It is a learnable state.',
        duration: '12 min',
        type: 'reading',
        content: `## The Current Beneath

Leyla, Guardian of the Flow Gate, teaches that creativity is not something you generate — it is something you enter.

Flow is the state where creation happens through you, not from you. Time distorts. Self-consciousness dissolves. The work moves forward with an ease that feels effortless, though it requires deep engagement.

### The Conditions of Flow

Flow is not random. It requires specific conditions:

**1. Challenge matches skill.** Too easy, you get bored. Too hard, you get anxious. The sweet spot — slightly beyond your current ability — is where flow lives.

**2. Clear goals.** You know what you are trying to do, even if the outcome is uncertain.

**3. Immediate feedback.** You can see whether what you are doing is working — the sentence sounds right, the brushstroke lands, the code compiles.

**4. No distractions.** Flow requires uninterrupted attention. A single notification can break it.

### The Water Principle

Water does not force its way. It finds the path of least resistance — and over time, it carves canyons.

Your creative flow works the same way. You cannot force it into existence. But you can create the conditions where it reliably appears.`,
      },
      {
        id: 'emotion-as-material',
        title: 'Emotion as Raw Material',
        description: 'Every feeling is fuel. Learn to use it.',
        duration: '15 min',
        type: 'exercise',
        content: `## Everything You Feel Is Usable

Most creators try to create from a specific emotional state — usually calm, focused, inspired. But Leyla teaches that **every emotion is creative fuel.**

Anger creates urgency and power. Sadness creates depth and tenderness. Fear creates tension and honesty. Joy creates warmth and generosity.

The creators who struggle most are the ones who wait to feel "right" before they create. The Flow Gate opens when you learn to create from whatever you feel.

### Exercise: Emotional Alchemy

1. Right now, name exactly what you are feeling. Not "fine" — be specific. Restless? Anxious? Bored? Tender? Frustrated?

2. Without trying to change that feeling, create something small from it. Write a paragraph. Sketch something. Hum a melody. Let the emotion shape the creation — do not fight it.

3. When you are done, look at what you made. Notice: the emotion gave the work a quality that "trying to be creative" never would.

This is emotional alchemy — the core skill of the Flow Gate. You are not waiting for the right feeling. You are using the feeling you already have.`,
      },
      {
        id: 'cross-medium-exploration',
        title: 'Creating Across Mediums',
        description: 'Fluency comes from range. Try something unfamiliar.',
        duration: '25 min',
        type: 'practice',
        content: `## The Range Principle

The Flow Gate opens when you demonstrate creative range — the ability to create across more than one medium.

This is not about becoming an expert in everything. It is about understanding that the creative impulse is medium-agnostic. The same force that writes a poem can paint a picture, compose a song, design a system, or build a structure.

### Practice: The Medium Swap

Choose a creative project you are currently working on. Now translate it into a completely different medium:

- If you write, **draw** your current project. Not well — just draw it.
- If you paint, **write** about what you paint. Describe the feeling, the colors, the intention.
- If you code, **compose** something. Use a tool, hum into your phone, tap a rhythm.
- If you make music, **write prose** about the feeling your music creates.

### Why This Works

Every medium has constraints that force different creative muscles. When you translate between mediums, you discover aspects of your ideas that were invisible in their original form.

The writer who draws discovers spatial relationships. The painter who writes discovers narrative. The musician who codes discovers structure.

Range does not dilute your primary skill. It deepens it.`,
      },
      {
        id: 'flow-ritual',
        title: 'Your Flow Ritual',
        description: 'Design a personal ritual for entering creative flow.',
        duration: '20 min',
        type: 'reflection',
        content: `## Building Your Flow Ritual

Every creator who reliably enters flow has a ritual — a sequence of actions that signals to their mind: "We are creating now."

The ritual is not superstition. It is conditioning. Your brain learns: "When these things happen, we enter flow."

### Components of a Flow Ritual

Choose one from each category:

**Physical signal** — Clean your desk. Make a specific drink. Light a candle. Put on headphones. Change your shirt. Something your body does.

**Mental signal** — Read one page of something inspiring. Review yesterday's work. Write a single sentence about what you will create today. Something your mind does.

**Environmental signal** — A specific playlist. A specific location. A specific time of day. Something your environment does.

### Create Your Ritual

Write down your three signals:

1. Physical: _____________
2. Mental: _____________
3. Environmental: _____________

Do this ritual before every creative session for the next 14 days. Do not judge the work that follows — just notice whether the ritual makes it easier to begin.

### The Flow Gate Opens

When you can reliably enter creative flow — when it is not random but something you can invite — the Flow Gate has opened. You have learned that creativity is not a gift you wait for. It is a current you step into.`,
      },
    ],
  },
  {
    slug: 'the-fire-within',
    title: 'The Fire Within',
    subtitle: 'Transform fear into creative power',
    description:
      'Confront resistance, build creative courage, and channel your will into focused creative action. The Fire Gate opens through transformation under pressure.',
    gate: 3,
    gateName: 'Fire',
    guardian: 'Draconia',
    element: 'Fire',
    color: '#ff6b35',
    difficulty: 'intermediate',
    duration: '3 hours',
    prerequisites: ['foundations-of-creation', 'creative-flow'],
    outcomes: [
      'Understanding of creative resistance and how to work with it',
      'Techniques for creative courage under pressure',
      'A personal relationship with failure as transformation',
      'The ability to ship imperfect work',
    ],
    lessons: [
      {
        id: 'resistance',
        title: 'Understanding Resistance',
        description: 'The force that blocks creation is predictable and manageable.',
        duration: '12 min',
        type: 'reading',
        content: `## The Enemy Within

Draconia, Guardian of the Fire Gate, teaches that the greatest obstacle to creation is not lack of skill or time. It is Resistance.

Resistance is the invisible force that rises whenever you try to create something meaningful. It manifests as:

- Procrastination ("I will start tomorrow")
- Perfectionism ("It is not good enough yet")
- Distraction ("Let me just check one thing first")
- Self-doubt ("Who am I to make this?")
- Rationalization ("The market is saturated anyway")

### The Rule of Resistance

**The more important a creative act is to your growth, the stronger Resistance will fight against it.**

This means Resistance is actually a compass. When you feel it strongest, you are pointed in exactly the right direction.

The Fire Gate does not ask you to eliminate Resistance. It asks you to create anyway — to walk into the fire and let it transform you instead of stop you.`,
      },
      {
        id: 'creative-courage',
        title: 'Creative Courage',
        description: 'Courage is not the absence of fear. It is action despite fear.',
        duration: '20 min',
        type: 'exercise',
        content: `## The Practice of Courage

Courage is a practice, not a personality trait. You build it the same way you build a muscle — through repeated use under increasing load.

### Exercise: The Fear Inventory

Write down three creative projects or actions you have been avoiding. For each one, name exactly what you fear:

**Project 1:** _____________
**What I fear:** _____________

**Project 2:** _____________
**What I fear:** _____________

**Project 3:** _____________
**What I fear:** _____________

Now look at your fears. Most creative fears fall into a few categories:

- **Fear of judgment** — "They will think it is bad"
- **Fear of failure** — "It will not work"
- **Fear of exposure** — "They will see the real me"
- **Fear of success** — "If it works, everything changes"

### The Draconia Response

Draconia does not say "Do not be afraid." Draconia says: **"Be afraid. Create anyway."**

Pick the smallest of your three projects. Set a timer for 25 minutes. Work on it. Do not stop when Resistance arrives — notice it, name it, and continue.

This is the Fire Gate practice: walking into the flame instead of away from it.`,
      },
      {
        id: 'shipping-imperfect-work',
        title: 'Ship It Imperfect',
        description: 'Perfect work that stays hidden helps no one.',
        duration: '15 min',
        type: 'practice',
        content: `## The Perfectionism Trap

Perfectionism is not a high standard. It is a hiding strategy.

The perfectionist does not ship because the work is not "ready." But the work is never ready — because the real fear is not about quality. It is about being seen.

### The 80% Rule

Draconia teaches the 80% rule: **When your work is 80% of what you envisioned, share it.**

Not 100%. Not 95%. 80%.

Why? Because:
1. Your 80% is better than most people's 100%, because you care more
2. The final 20% takes 80% of the time and rarely changes the impact
3. Feedback on shipped work teaches more than perfecting in isolation ever can
4. Shared imperfect work creates momentum. Hidden perfect work creates stagnation.

### Practice: Ship Something Today

Find something you have been holding back. A draft, a sketch, a demo, a prototype, a thought. Share it with one person. Not the world — one person.

Notice what happens. The fear was bigger than the reality.`,
      },
      {
        id: 'transformation-through-fire',
        title: 'Transformation Through Fire',
        description: 'Fire does not destroy — it transforms.',
        duration: '15 min',
        type: 'reflection',
        content: `## What Fire Does

Fire does not destroy. It transforms. Wood becomes heat and light. Ore becomes metal. Raw clay becomes ceramic.

Your creative failures work the same way. Every failed project, every rejected pitch, every work that did not land — these are not losses. They are transformations. The creator who emerges from failure is stronger, more skilled, and more resilient than the one who entered it.

### Reflection

Think about your most significant creative failure. The one that hurt.

1. What did you learn from it that you could not have learned any other way?
2. How did it change what you made next?
3. Would you undo it if you could — knowing you would also lose what it taught you?

Most creators, when honest, would keep their failures. The lessons were that valuable.

### The Fire Gate Opens

The Fire Gate opens when you stop running from creative discomfort and start running toward it. When shipping imperfect work feels natural. When failure feels like data instead of disaster.

You do not become fireproof. You become fire-friendly — willing to be changed by the heat instead of hiding from it.`,
      },
    ],
  },
  {
    slug: 'voice-and-truth',
    title: 'Voice and Truth',
    subtitle: 'Find and speak your authentic creative voice',
    description:
      'Discover your unique creative perspective, learn to express truth through your work, and develop the craft of clear, honest communication.',
    gate: 5,
    gateName: 'Voice',
    guardian: 'Alera',
    element: 'Sound',
    color: '#06b6d4',
    difficulty: 'intermediate',
    duration: '2.5 hours',
    prerequisites: ['foundations-of-creation'],
    outcomes: [
      'Clarity on your unique creative perspective',
      'Techniques for authentic self-expression',
      'Understanding of craft as a vehicle for truth',
      'A personal creative manifesto',
    ],
    lessons: [
      {
        id: 'finding-your-voice',
        title: 'Finding Your Voice',
        description: 'Your voice is not something you invent. It is something you uncover.',
        duration: '12 min',
        type: 'reading',
        content: `## The Voice Already Exists

Alera, Guardian of the Voice Gate, teaches that your creative voice is not something you construct. It is something you remove obstructions from.

You already have a unique perspective. You have seen things no one else has seen, felt things no one else has felt, connected ideas no one else has connected. Your voice is the sum of all that experience.

The problem is not finding your voice. The problem is all the other voices drowning it out — trends you follow, creators you imitate, expectations you absorb.

### The Three Layers of Voice

**Layer 1: Imitation** — Every creator begins by imitating others. This is natural and necessary. You learn by copying.

**Layer 2: Synthesis** — You begin combining influences. Your work starts to sound like "X meets Y." This is progress.

**Layer 3: Voice** — The influences dissolve. What remains is distinctly yours. Others may hear echoes of your influences, but the overall sound is unmistakably you.

Most creators stay at Layer 2 forever. The Voice Gate opens when you step into Layer 3 — when you stop asking "What should I make?" and start asking "What can only I make?"`,
      },
      {
        id: 'the-truth-test',
        title: 'The Truth Test',
        description: 'Does your work tell the truth? Would you know?',
        duration: '20 min',
        type: 'exercise',
        content: `## Truth in Creation

The Voice Gate is not about volume. It is about truth.

A creator can be loud and say nothing. A creator can whisper and change everything. The difference is truth — whether the work reflects genuine experience, genuine thought, genuine feeling.

### Exercise: The Truth Audit

Take your most recent creative work. Read, view, or listen to it with fresh eyes. For each piece, answer:

1. **Is this what I actually think, or what I think I should think?**
2. **Does this reflect my real experience, or a curated version?**
3. **If no one would ever see this, would I make it the same way?**
4. **What am I holding back?**

The gap between what you make and what you would make if no one was watching — that gap is where your real voice lives.

### The Discomfort Signal

If answering these questions makes you uncomfortable, good. Discomfort means you have found the edge of your authenticity. The Voice Gate opens at that edge.`,
      },
      {
        id: 'creative-manifesto',
        title: 'Write Your Manifesto',
        description: 'Declare what you stand for as a creator.',
        duration: '30 min',
        type: 'practice',
        content: `## Your Creative Manifesto

A manifesto is not a plan. It is a declaration — a statement of what you believe and what you will create from those beliefs.

### Writing Your Manifesto

Write 5-10 statements that begin with "I believe..." or "I will..." or "I refuse to..."

Examples (do not copy these — write your own):
- "I believe clarity is more valuable than complexity."
- "I will make work that respects my audience's intelligence."
- "I refuse to create from fear of missing out."

### Guidelines

- Be specific. "I believe in good art" means nothing. "I believe art should make the familiar strange" means something.
- Be honest. Do not write what sounds impressive. Write what is true.
- Be willing to be wrong. A manifesto is not a permanent contract. It is a snapshot of your current understanding. It will evolve.
- Keep it short. If you cannot state your creative beliefs in under a page, you have not distilled them enough.

### Use It

Put your manifesto where you can see it when you create. When you feel lost in a project, read it. It will remind you what you are doing and why.`,
      },
      {
        id: 'craft-and-clarity',
        title: 'Craft Serves Truth',
        description: 'Technical skill exists to carry your message further.',
        duration: '15 min',
        type: 'reflection',
        content: `## Why Craft Matters

Craft is not about impressing people. Craft is about reducing the distance between what you mean and what your audience receives.

A poorly crafted truth reaches fewer people. A well-crafted truth reaches everyone it needs to reach.

### Reflection

1. In your creative practice, where does poor craft get in the way of what you are trying to say?

2. What specific skill, if improved, would make your work reach further?

3. Who do you admire not for what they say, but for how clearly they say it?

### The Voice Gate Opens

The Voice Gate opens when your work becomes unmistakably yours — when someone can encounter it without your name attached and know it came from you.

This is not about style. Style can be imitated. Voice cannot — because voice is the sum of everything you are, expressed through everything you know how to do.

The gate opens quietly. One day you will make something and realize: "This could only have come from me." That is the moment.`,
      },
    ],
  },
  {
    slug: 'creative-vision',
    title: 'Creative Vision',
    subtitle: 'See what others cannot — yet',
    description:
      'Develop your creative intuition, learn to trust inner vision over external validation, and cultivate the ability to see projects through from insight to completion.',
    gate: 6,
    gateName: 'Sight',
    guardian: 'Lyria',
    element: 'Ether',
    color: '#a78bfa',
    difficulty: 'advanced',
    duration: '3 hours',
    prerequisites: ['foundations-of-creation', 'creative-flow', 'the-fire-within'],
    outcomes: [
      'A stronger relationship with creative intuition',
      'Techniques for developing and trusting inner vision',
      'The ability to hold a long-term creative vision',
      'Understanding of when to lead and when to follow your audience',
    ],
    lessons: [
      {
        id: 'intuition-as-skill',
        title: 'Intuition Is a Skill',
        description: 'Creative intuition is not random. It is pattern recognition operating below conscious awareness.',
        duration: '15 min',
        type: 'reading',
        content: `## The Sight Beyond Sight

Lyria, Guardian of the Sight Gate, teaches that creative intuition is not mystical. It is the result of deep experience processed below the level of conscious thought.

When you have immersed yourself in a domain long enough, your subconscious begins recognizing patterns your conscious mind cannot articulate. This is what we call "intuition" — and it is trainable.

### How Intuition Develops

**Stage 1: Noise.** Early in any creative domain, everything seems equally important. You cannot distinguish signal from noise.

**Stage 2: Recognition.** With experience, you start recognizing patterns. "This feels like something I have seen before." You cannot always explain why.

**Stage 3: Prediction.** Your pattern recognition becomes predictive. You can sense where a project is heading before it arrives. You know what will work before you test it.

**Stage 4: Vision.** At the deepest level, intuition becomes vision — the ability to see what does not yet exist and know it is real. This is the Sight Gate.

### Training Intuition

Intuition develops through three practices:
1. **Volume** — Create a lot. The more data your subconscious processes, the better its pattern recognition.
2. **Reflection** — Review your work. Notice what worked and what did not. Feed the results back to your subconscious.
3. **Trust** — Act on your hunches. When your intuition says "try this," try it. Right or wrong, the feedback loop strengthens the skill.`,
      },
      {
        id: 'seeing-the-unseen',
        title: 'Seeing What Is Not Yet',
        description: 'Hold a vision others cannot see — and bring it into existence.',
        duration: '20 min',
        type: 'exercise',
        content: `## Vision Work

The hardest part of creative vision is not having the vision. It is holding it — maintaining clarity about what you are building while everyone around you sees nothing.

### Exercise: Vision Casting

Close your eyes for two minutes. Picture a creative project you want to exist in the world — something that does not exist yet. Not the steps to get there. The finished thing.

Now write down:

1. **What does it look like completed?** Describe it in detail.
2. **How does someone feel when they experience it?** Not what they think — what they feel.
3. **Why does this need to exist?** What gap does it fill?
4. **What makes it unmistakably yours?** Why can only you make this?

### The Vision Test

Read what you wrote. Does it excite you? Does it scare you slightly? Does it feel too big?

If yes to all three — you have found a real vision. The excitement gives you energy. The fear confirms it matters. The scale confirms it is worth the effort.

### Holding the Vision

The challenge is not having this vision today. The challenge is still having it six months from now, when progress is slow and no one else can see what you see.

Write your vision somewhere permanent. You will need to re-read it on the days when the work feels pointless.`,
      },
      {
        id: 'trust-vs-validation',
        title: 'Trust Over Validation',
        description: 'When your vision conflicts with feedback, which wins?',
        duration: '15 min',
        type: 'reflection',
        content: `## The Validation Trap

Feedback is valuable. But there is a trap: if you follow feedback too closely, you create what the audience already wants instead of what they do not yet know they need.

The greatest creative works in history were not focus-grouped into existence. They emerged from a creator who saw something others could not see — and trusted their vision long enough to make it real.

### Reflection

1. Think of a time you changed your creative direction based on feedback and later regretted it. What would have happened if you had trusted your original instinct?

2. Think of a time feedback genuinely improved your work. What was different about that feedback?

3. How do you currently decide when to listen to feedback and when to trust your vision?

### The Lyria Principle

Lyria teaches: **Listen to feedback about execution. Ignore feedback about vision.**

If someone says "this paragraph is confusing" — listen. They are telling you about craft.
If someone says "you should make something different" — be cautious. They may be telling you to abandon your vision for theirs.

The Sight Gate opens when you can distinguish between the two — and act accordingly.`,
      },
      {
        id: 'long-vision',
        title: 'The Long Vision',
        description: 'Great creative work requires the ability to think in years, not weeks.',
        duration: '20 min',
        type: 'practice',
        content: `## Thinking in Years

Most creators plan in days or weeks. The Sight Gate asks you to plan in years.

Not a rigid plan — vision is not a schedule. But a direction. A sense of where you are headed that is measured in seasons and years, not sprints and deadlines.

### Practice: The Five-Year Creative Map

Draw or write a rough map of the next five years of your creative life:

**Year 1:** What will you build? What skills will you develop? What foundation are you laying?

**Year 2:** What will you deepen? Where will you take risks? What project will you commit to?

**Year 3:** What will you share with the world? Where will your work reach people it has not reached before?

**Years 4-5:** What will you have built by then that does not exist now? What kind of creator will you have become?

### The Point

This map will be wrong. That is fine. The point is not accuracy — the point is orientation.

A creator with a five-year vision makes different daily choices than one without. The daily practice matters more because you can see where it leads. The setbacks matter less because you can see past them.

### The Sight Gate Opens

When you can hold a vision that extends beyond the immediate — when you can see the arc of your creative life stretching forward, bending toward something you chose — the Sight Gate opens.

You do not need to see every detail. You need to see the direction. The rest reveals itself as you walk.`,
      },
    ],
  },
  {
    slug: 'arcanean-prompt-language',
    title: 'The Arcanean Prompt Language',
    subtitle: 'SPARK. SHAPE. SHARPEN.',
    description:
      'Master the three-word system that turns generic AI output into work you are proud of. Works on every model — Claude, GPT, Gemini, Grok, Midjourney, Suno — because it changes what you ask, not what the AI does.',
    gate: 5,
    gateName: 'Voice',
    guardian: 'Alera',
    element: 'Voice',
    color: '#fbbf24',
    difficulty: 'beginner',
    duration: '2 hours',
    prerequisites: [],
    outcomes: [
      'The SPARK.SHAPE.SHARPEN pattern — learnable in 60 seconds',
      'Five Sensory Palettes for building atmosphere in any medium',
      'The Seven Defaults to Cut — an anti-slop checklist',
      'A World DNA prefix that makes every prompt inherit your world',
      'Before-and-after portfolio showing your quality transformation',
    ],
    lessons: [
      {
        id: 'apl-1-spark',
        title: 'The SPARK',
        description: 'Find the one detail that makes your creation yours',
        duration: '20 min',
        type: 'exercise',
        content: `# The SPARK

> *"The gap between AI slop and something that haunts you is one sentence of truth."*

Every AI can generate a king, a warrior, a symphony. What it cannot do is find the detail that makes YOUR king different from every other king ever generated. That detail is your SPARK.

### What a SPARK Is

Not a description. A **truth**. The specific detail so precise it could only come from you.

**Generic:** "Write a story about a lonely king"
**Sparked:** "Write a story about a king who eats dinner alone and sets a place for his dead wife every night — including pouring her wine"

**Generic:** "Create an image of a warrior"
**Sparked:** "A warrior whose armor is covered in children's handprints — she lets them touch it for luck before she leaves"

**Generic:** "Compose an epic orchestral track"
**Sparked:** "An orchestral piece where a single piano keeps playing the wrong note — and by the end, the whole orchestra has shifted key to match it"

### How to Find Your SPARK

1. Close your eyes
2. See the thing you want to create
3. Find the detail that surprises YOU
4. That is your SPARK

### Exercise: Three SPARKs

Take three generic prompts and add a SPARK to each:

1. "Write a poem about the ocean" → find the truth
2. "Generate an image of a forest" → find the detail no one else would choose
3. "Create a character who is brave" → find the contradiction that makes them real

Write your three sparked prompts. Compare them to the originals. Feel the difference.

### The Quality Ladder — Level 1

Adding a SPARK alone takes 10 seconds and beats 80% of AI output immediately. This is Level 1 on the Quality Ladder. You are already better than most.`,
      },
      {
        id: 'apl-2-shape',
        title: 'The SHAPE',
        description: 'Build the sensory world your creation lives in',
        duration: '25 min',
        type: 'practice',
        content: `# The SHAPE

Your creation needs a world. Not a description — a **feeling**. What does this scene smell like? What does the air taste like? What sound is underneath everything?

### Five Sensory Palettes

| Palette | Feels Like | Sounds Like | Looks Like |
|---------|-----------|-------------|-----------|
| **Forge** | Heat on skin, rough metal, heartbeat | Crackle, percussion, roar | Ember, gold, molten glass, dawn |
| **Tide** | Cool stone, mist on face, deep breath | Echo, sustained notes, rainfall | Silver, deep blue, mirror surface |
| **Root** | Packed earth, bark, weight in the chest | Low hum, grinding, drum | Moss green, amber, bone, fossil |
| **Drift** | Wind through hair, electric tingle | Whistle, chime, distant thunder | Cloud white, pale blue, ozone |
| **Void** | Weightlessness, silence, vertigo | Sub-bass, overtone, nothing | Starfield, ink black, iridescent |

These are not rules. They are **starting points for your senses**. Pick the one that feels right and let your SPARK live inside it.

### Example: SPARK + SHAPE

\`\`\`
SPARK:  A king who sets a place for his dead wife
SHAPE:  TIDE — the dining hall echoes. Rain against tall windows.
        Everything is silver and cold and too clean.
        His wine tastes like the sea because he has been crying into it.
\`\`\`

### Practice: Shape Three Worlds

Take one of your SPARKs from Lesson 1. Write it in three different palettes:

1. Your SPARK in FORGE — how does it feel when everything is hot, rough, burning?
2. Your SPARK in VOID — how does it feel when everything is silent, weightless, infinite?
3. Your SPARK in the palette that feels most RIGHT — trust your instinct

### Blending Palettes

For complexity, blend two palettes:
- **FORGE + TIDE** = transformation through memory
- **ROOT + VOID** = ancient things and the unknown spaces between them
- **DRIFT + FORGE** = wind-fed fire, change that transforms

### The Quality Ladder — Level 2

SPARK + SHAPE takes 30 seconds. You now have a creation with a unique truth living in a sensory world. This beats 95% of AI output.`,
      },
      {
        id: 'apl-3-sharpen',
        title: 'The SHARPEN',
        description: 'Cut the seven defaults that make AI output generic',
        duration: '25 min',
        type: 'exercise',
        content: `# The SHARPEN

The most powerful prompt technique almost nobody uses: **tell the AI what to avoid.**

AI models have defaults. They reach for the obvious. They have been trained on everything, so they produce the average of everything unless you tell them not to. Sharpening is naming the obvious so the AI has to go somewhere more interesting.

### The Seven Defaults to Cut

| Default | What It Sounds Like | The Sharpen |
|---------|-------------------|------------|
| **The Opener** | "In a world where..." / "Once upon a time..." | Start in the middle. Start with a sound. Start with a lie. |
| **The Avalanche** | "Hauntingly beautiful ethereal cascading majesty" | One strong word beats five weak ones. |
| **The Slop** | "I'd be happy to help!" / "Great question!" | Respond AS the thing, not ABOUT the thing. |
| **The Explanation** | Telling the reader what the metaphor means | Trust them. They are smart. |
| **The Perfection** | Every hero is noble, every villain is evil | Scars are more interesting than polish. |
| **The Resolution** | Everything wraps up neatly in the last paragraph | Sometimes the best ending is a door left open. |
| **The Safety** | Generic, forgettable, could-be-anything output | If it does not make you feel something, it is not done. |

### Example: Full SPARK.SHAPE.SHARPEN

\`\`\`
SPARK:    She counts things when she is nervous — ceiling tiles, buttons, heartbeats
SHAPE:    ROOT — earthy, grounded, heavy. Smells like coffee and old paper.
SHARPEN:  NOT a manic pixie. NOT tragically broken. NOT saved by love.
          She is brilliant and she knows it, which makes her terrible
          at asking for help.

A data scientist who quit her job to open a bakery.
Her sourdough starter is named after her thesis advisor.
She is funnier than she realizes and sadder than she admits.
\`\`\`

### Exercise: The Anti-Slop Rewrite

Take any AI output you have generated recently — a story, an image prompt, a character description — and apply SHARPEN:

1. Read it aloud. Circle every adjective avalanche.
2. Find every place it chose the safe option.
3. Rewrite the prompt with explicit SHARPEN instructions.
4. Generate again. Compare.

### The Quality Ladder — Level 3

SPARK + SHAPE + SHARPEN takes 60 seconds. This is where you get the results that make people stop and ask "how did you make this?" You are now at Level 3. This beats 99% of AI output.`,
      },
      {
        id: 'apl-4-world-dna',
        title: 'World DNA',
        description: 'Build a prefix that makes every prompt inherit your world',
        duration: '30 min',
        type: 'practice',
        content: `# World DNA

If you are building a world — for a novel, a game, a campaign, a universe — APL becomes your world's genetic code.

### The World Prefix

\`\`\`
WORLD SPARK:    [the one thing true here that is false everywhere else]
WORLD SHAPE:    [primary palette] + [secondary palette]
WORLD SHARPEN:  [the three biggest cliches your world refuses]
\`\`\`

Use this as a **prefix for every prompt you write in that world**. Every character, location, song, and image inherits the world's DNA automatically.

### Example: A FORGE+TIDE World

\`\`\`
WORLD SPARK:    In this world, memories are literally flammable.
                The more painful the memory, the hotter it burns.
                Libraries are fireproof vaults. Forgetting is arson.
WORLD SHAPE:    FORGE + TIDE — everything is either burning or drowning.
                The air smells like heated copper and salt water.
                Buildings sweat. People carry cooling stones.
WORLD SHARPEN:  NOT medieval Europe. NOT a chosen one narrative.
                NOT magic without cost. Every spell burns a memory forever.
\`\`\`

Now EVERY prompt in this world starts with that prefix. A character prompt inherits the heat and the salt and the cost. A location prompt inherits the sweating buildings. A music prompt inherits the tension between fire and water.

### Practice: Build Your World DNA

1. **WORLD SPARK** — What is the one rule in your world that breaks a rule in ours?
2. **WORLD SHAPE** — Pick two palettes. Describe what the air feels like, what the default sound is, what color everything leans toward.
3. **WORLD SHARPEN** — Name three things your world will NEVER be. Three cliches it refuses.

Write your World DNA prefix. Then generate a character using it as the first three lines. Feel how the world shapes the character without you having to describe the world again.

### For Musicians

Your world has a sound. The World DNA becomes your album's sonic identity:

\`\`\`
WORLD SHAPE:    FORGE + VOID — percussive silence.
                Drums appear from nothing. Between hits: vacuum.
WORLD SHARPEN:  NOT orchestral. NOT reverb-heavy. Bone dry recording.
                Every sound is deliberate. Silence is an instrument.
\`\`\`

### For Visual Artists

Your world has a look. The World DNA becomes your series' visual identity:

\`\`\`
WORLD SHAPE:    ROOT + DRIFT — mossy ruins in high wind.
                Everything is ancient but nothing is still.
WORLD SHARPEN:  NOT dark fantasy. NOT clean lines.
                Everything has texture. Nothing is smooth.
\`\`\``,
      },
      {
        id: 'apl-5-mastery',
        title: 'The Quality Portfolio',
        description: 'Prove the transformation with before-and-after work',
        duration: '20 min',
        type: 'reflection',
        content: `# The Quality Portfolio

You now have the complete system. Three words. Sixty seconds. Every AI model. Let us prove it works.

### The Before-and-After Exercise

Choose three things you want to create. For each one:

1. **Write the prompt you WOULD HAVE written** before this course. The generic version. The one that sounds like everyone else.

2. **Write it again with SPARK.SHAPE.SHARPEN.** The version that could only come from you.

3. **Generate both.** Side by side.

4. **Feel the difference.** Not just see it — feel it. The sparked version should make you feel something the generic version does not.

### The Mastery Check

You have mastered APL when:

- [ ] You can find a SPARK in under 10 seconds
- [ ] You instinctively reach for a palette when imagining a scene
- [ ] You catch yourself writing defaults and cut them before hitting enter
- [ ] Your prompts produce results that surprise even you
- [ ] Other people ask you how you got that result

### What You Built in This Course

| Lesson | What You Learned | What You Made |
|--------|-----------------|--------------|
| SPARK | One unique detail changes everything | Three sparked prompts |
| SHAPE | Five sensory palettes for atmosphere | Three palette variations |
| SHARPEN | Seven defaults to cut | An anti-slop rewrite |
| World DNA | A prefix that inherits everywhere | Your world's genetic code |
| Mastery | Before vs. after proof | A quality portfolio |

### The Voice Gate Opens

The Arcanean Prompt Language lives at Gate 5 — the Voice Gate. Voice is not about volume. It is about saying something true in a way that is unmistakably yours.

When your prompts carry your truth, your taste, and your refusal to accept the generic — the Voice Gate opens. Not because you learned a system. Because the system helped you find what was already there.

### Keep Going

- Use the templates in \`/prompt-books\` for ready-made SPARK.SHAPE.SHARPEN structures
- Build your World DNA and use it as a prefix for everything
- Share your before-and-after results — they teach others by example
- Every time AI gives you something generic, SHARPEN it. The habit becomes instinct.

*SPARK. SHAPE. SHARPEN. That is the whole system. Everything else is practice.*`,
      },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getCoursesByDifficulty(difficulty: Course['difficulty']): Course[] {
  return COURSES.filter((c) => c.difficulty === difficulty);
}

export function getCourseForGate(gateNumber: number): Course | undefined {
  return COURSES.find((c) => c.gate === gateNumber);
}

export function getLesson(courseSlug: string, lessonId: string): Lesson | undefined {
  const course = getCourse(courseSlug);
  return course?.lessons.find((l) => l.id === lessonId);
}
