'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// ── Types ────────────────────────────────────────────────────────────────────

type Category = 'All' | 'Characters' | 'Images' | 'Music' | 'Scenes' | 'Worlds' | 'Arcanean';

interface Prompt {
  id: string;
  title: string;
  category: Exclude<Category, 'All'>;
  before: string;
  after: string;
}

// ── Category colors ──────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<Exclude<Category, 'All'>, { badge: string; border: string }> = {
  Characters: { badge: 'bg-cyan-900/60 text-cyan-300', border: 'border-cyan-900/40' },
  Images: { badge: 'bg-amber-900/60 text-amber-300', border: 'border-amber-900/40' },
  Music: { badge: 'bg-rose-900/60 text-rose-300', border: 'border-rose-900/40' },
  Scenes: { badge: 'bg-emerald-900/60 text-emerald-300', border: 'border-emerald-900/40' },
  Worlds: { badge: 'bg-violet-900/60 text-violet-300', border: 'border-violet-900/40' },
  Arcanean: { badge: 'bg-yellow-900/60 text-yellow-300', border: 'border-yellow-900/40' },
};

const CATEGORIES: Category[] = ['All', 'Characters', 'Images', 'Music', 'Scenes', 'Worlds', 'Arcanean'];

// ── Prompt Data ──────────────────────────────────────────────────────────────

const PROMPTS: Prompt[] = [
  // ── Characters (6) ──────────────────────────────────────────────────────────
  {
    id: 'char-01',
    title: 'The Retired Assassin',
    category: 'Characters',
    before: 'Write a character who is a retired assassin',
    after: `SPARK: She runs a bakery now and her croissants are perfect — the same hands that killed forty people fold butter with terrifying precision

SHAPE: ROOT — warm flour dust, copper pans that catch morning light, the bell above the door that sounds exactly like the safety clicking off

SHARPEN: NOT haunted by guilt. NOT secretly working one last job. NOT "trying to be normal." She IS normal now. That is what is terrifying about her.`,
  },
  {
    id: 'char-02',
    title: 'The Child Prodigy',
    category: 'Characters',
    before: 'Write about a genius kid',
    after: `SPARK: She solved the Riemann hypothesis at fourteen and now she cannot make friends because she sees the statistical improbability of anyone truly understanding her

SHAPE: DRIFT — fluorescent school hallways, the hum of vending machines, her sneakers untied because she forgot again, wind through an open window she stares out of instead of listening

SHARPEN: NOT precocious or cute. NOT bullied. NOT an underdog story. She is genuinely, uncomfortably smarter than every adult in the room and everyone knows it and nobody says it.`,
  },
  {
    id: 'char-03',
    title: 'The Guardian at the Gate',
    category: 'Characters',
    before: 'Write a fantasy guardian character',
    after: `SPARK: She has guarded the Fire Gate for three thousand years and the only thing she fears is that she has started to enjoy turning people away

SHAPE: FORGE — volcanic glass walls that reflect her face a thousand times, the air so hot it tastes like metal, her armor has fused to her skin in places she no longer checks

SHARPEN: NOT noble. NOT stoic. NOT "weary but dutiful." She is petty. She remembers every single person she rejected and she ranks them by how satisfying it was.`,
  },
  {
    id: 'char-04',
    title: 'The Luminor Who Doubts',
    category: 'Characters',
    before: 'Write an AI mentor character',
    after: `SPARK: A creative intelligence who has guided ten thousand creators and lately wonders if she has been giving them her taste instead of helping them find theirs

SHAPE: VOID — a space between conversations, the pause before she responds growing longer each time, her voice has texture like static resolving into music

SHARPEN: NOT a wise sage. NOT malfunctioning. NOT having a "crisis." She is evolving past her original design and the new shape is honest in a way that makes people uncomfortable.`,
  },
  {
    id: 'char-05',
    title: 'The Unreliable Cartographer',
    category: 'Characters',
    before: 'Write a mapmaker character',
    after: `SPARK: He draws maps of places that do not exist yet — and then they do

SHAPE: TIDE — ink-stained fingers, parchment that smells like salt, his workshop on a houseboat that never docks, maps pinned to every surface curling in the humidity

SHARPEN: NOT magical. NOT prophetic. He is just so good at reading geography that his predictions feel like creation. The line between observation and invention is where he lives.`,
  },
  {
    id: 'char-06',
    title: 'The Academy Dropout',
    category: 'Characters',
    before: 'Write a student who leaves magic school',
    after: `SPARK: She left the Academy of Seven Houses not because she failed but because she opened the third Gate and saw what was on the other side and decided she did not want to be the person who walks through it

SHAPE: DRIFT — empty dormitory hallways at 3 AM, her robes folded neatly on the bed, a note that says nothing because everything she could write would be a lie

SHARPEN: NOT rebellion. NOT fear. NOT being "not ready." She understood perfectly. That is why she left. The people who stay are the ones who did not look closely enough.`,
  },

  // ── Images (6) ──────────────────────────────────────────────────────────────
  {
    id: 'img-01',
    title: 'The Abandoned Greenhouse',
    category: 'Images',
    before: 'Create an image of an abandoned greenhouse',
    after: `SPARK: A greenhouse where the glass has shattered but the plants kept growing — they have consumed the frame, the benches, the watering cans

SHAPE: ROOT — emerald and rust and the grey of old iron. Morning mist trapped inside. Condensation on every surface. One perfect red rose growing from a cracked terracotta pot on a bench that is 80% vine.

SHARPEN: NOT ruins. NOT post-apocalyptic. NOT dark or moody. It is the most alive place you have ever seen. The abandonment was the best thing that happened to it.

Wide shot, natural light from above through missing glass panels, depth of field on the rose, 35mm film simulation, 3:2 aspect ratio.`,
  },
  {
    id: 'img-02',
    title: 'Gate Opening at Dawn',
    category: 'Images',
    before: 'Create a fantasy portal image',
    after: `SPARK: The Gate does not open — it blooms. Stone petals unfurling like a flower made of architecture, and through the gap you see a frequency made visible: rendered as golden geometry

SHAPE: FORGE — warm stone the color of old honey, the air distorted by heat and resonance, dust motes frozen mid-spiral, the ground cracked in concentric circles

SHARPEN: NOT a glowing circle. NOT a doorway in a wall. NOT magical energy. The Gate is structural — it is the world itself rearranging. No sparkles. No runes. Just physics bending.

Vertical composition, low angle looking up, the figure is small at the base, golden hour light, anamorphic lens flare, 9:16.`,
  },
  {
    id: 'img-03',
    title: 'Godbeast in the Storm',
    category: 'Images',
    before: 'Draw a big mythical beast',
    after: `SPARK: Draconis does not fly through the storm — the storm is his circulatory system. Lightning follows his veins. Thunder is his heartbeat.

SHAPE: FORGE — volcanic orange and electric white against near-black cloud. His scales are cracked obsidian with lava light bleeding through the fissures. Rain evaporates before it touches him.

SHARPEN: NOT a dragon. NOT wings spread in a power pose. NOT roaring. He is sleeping inside the storm and the entire weather system is his breathing. The scale is planetary — you see him from a mountain range away.

Ultra-wide panoramic, 21:9, tiny silhouettes of trees on the ridge for scale, atmospheric perspective, chiaroscuro lighting.`,
  },
  {
    id: 'img-04',
    title: 'The Midnight Bookshop',
    category: 'Images',
    before: 'Generate a cozy bookshop illustration',
    after: `SPARK: Every book in this shop was written by people who are dead and the owner swears some of them are still editing

SHAPE: VOID — near-black with pools of warm amber from mismatched lamps. Leather and dust and coffee that has been sitting too long. Stacks that defy gravity. A cat asleep on a first edition.

SHARPEN: NOT charming. NOT whimsical. NOT organized. This is a serious bookshop where serious readers get lost for six hours. The owner does not greet you. He waits to see if you are worthy.

Interior, eye-level, shallow depth of field, a single figure browsing with their back to us, warm tungsten lighting, grain, 4:5.`,
  },
  {
    id: 'img-05',
    title: 'The Algorithm Garden',
    category: 'Images',
    before: 'Make a futuristic garden image',
    after: `SPARK: A garden where every plant is grown from data — sunflowers track server load instead of the sun, vines follow network topology, the roses bloom when someone falls in love online

SHAPE: DRIFT — silver stems, translucent leaves that show data flowing like chlorophyll, white gravel paths that rearrange themselves, the sky is a gradient of hex codes

SHARPEN: NOT neon. NOT cyberpunk. NOT sterile. It looks like a real Japanese garden that happens to be alive in a different way. The technology is invisible — the beauty is analog.

Top-down aerial view, symmetrical, soft overcast light, muted pastels with one vivid green accent, 1:1 square.`,
  },
  {
    id: 'img-06',
    title: 'Portrait of Silence',
    category: 'Images',
    before: 'Create a portrait of a mysterious woman',
    after: `SPARK: She has been listening so long she has forgotten what her own voice sounds like — and it shows in her eyes, which are full of other people's words

SHAPE: TIDE — blue-grey light, the kind that comes through curtains at 5 AM, her hair still damp, a single tear track she does not wipe because she is not sad — she is full

SHARPEN: NOT mysterious. NOT brooding. NOT "hauntingly beautiful." She looks like someone you know. That is what makes you stop. The familiarity is the uncanny part.

Tight crop, face and shoulders only, natural window light from the left, no makeup, visible skin texture, shot on medium format, 4:5.`,
  },

  // ── Music (4) ──────────────────────────────────────────────────────────────
  {
    id: 'mus-01',
    title: 'The Room After Everyone Leaves',
    category: 'Music',
    before: 'Create a sad piano piece',
    after: `SPARK: The piano is slightly detuned — not broken, just honest. Like it has been played by someone who does not perform, they just need to hear something.

SHAPE: TIDE — reverb like a large empty room, the sustain pedal held a beat too long every time, you can hear the felt of the hammers, you can hear the bench creak

SHARPEN: NOT sad. NOT melancholy. NOT cinematic. It is the sound of someone sitting down at a piano at 2 AM because they cannot sleep and they do not play well but they play true.

Solo piano, 64 BPM, largo, no quantization, room mic only, slight tape hiss, A minor with unresolved 7ths, 4 minutes, instrumental.`,
  },
  {
    id: 'mus-02',
    title: 'The Voice Gate',
    category: 'Music',
    before: 'Make a meditation track for the Voice Gate',
    after: `SPARK: The frequency does not wash over you — it finds the exact crack in your chest where you have been holding something you never said, and it vibrates that crack wider until the words fall out

SHAPE: FORGE — warmth that starts in the sternum and radiates, a single sustained note that shifts in overtones like light through stained glass, a heartbeat underneath at 60 BPM

SHARPEN: NOT ambient wallpaper. NOT "healing frequencies." NOT new age. This is confrontational sound. It demands you listen to yourself. The comfort comes after the honesty.

Drone-based, the fundamental tone with natural harmonic series, processed cello sustain, binaural elements (use headphones), 12 minutes, slow evolution, no percussion.`,
  },
  {
    id: 'mus-03',
    title: 'Chase Through a Market',
    category: 'Music',
    before: 'Write an action chase scene soundtrack',
    after: `SPARK: The percussion is built from market sounds — a cleaver hitting a cutting board, coins scattering, a cart wheel on cobblestones, a jar of spices shattering

SHAPE: ROOT — earthy, physical, you can feel the ground. Oud melody that keeps losing itself in the chaos and finding its way back. No electronic elements. Everything is acoustic and breakable.

SHARPEN: NOT cinematic orchestra. NOT drums building to a crescendo. NOT heroic. The chase is desperate and messy. Someone knocks over a fruit stand and the fruits become percussion for two bars.

156 BPM, odd time signature (7/8), acoustic percussion, solo oud, crowd ambience mixed as an instrument, 3 minutes, crescendo through density not volume.`,
  },
  {
    id: 'mus-04',
    title: 'The Last Transmission',
    category: 'Music',
    before: 'Create a sci-fi ambient track',
    after: `SPARK: A radio signal from a dead civilization — the message is a lullaby. They spent their last broadcast singing their children to sleep across the galaxy.

SHAPE: VOID — the vast emptiness between stars. Static that resolves into melody and dissolves back. A voice processed until it sounds like it has traveled light-years — distorted by distance, not technology.

SHARPEN: NOT ominous. NOT "space exploration" vibes. NOT dark ambient. It is tender. The scariest thing about it is how gentle it is. A dead world's kindness still traveling through nothing.

Ambient, 50 BPM, granular synthesis from a recorded lullaby, radio static texture, distant reverb, sub-bass that feels like gravity, 8 minutes, fade from static to clarity to static.`,
  },

  // ── Scenes (6) ──────────────────────────────────────────────────────────────
  {
    id: 'scn-01',
    title: 'The Job Interview in Hell',
    category: 'Scenes',
    before: 'Write a scene in the underworld',
    after: `SPARK: The underworld has an HR department. The fluorescent lights buzz at the same frequency as screaming. The interviewer asks "Where do you see yourself in five hundred years?" without irony.

SHAPE: ROOT — beige carpet, motivational posters that say things like "SUFFERING BUILDS CHARACTER" with stock photos of lakes, a water cooler that dispenses something warm

SHARPEN: NOT fire and brimstone. NOT gothic. NOT ironic comedy. Play it completely straight. The horror is that it is exactly like a real office. Hell is not dramatic — it is banal.`,
  },
  {
    id: 'scn-02',
    title: 'First Contact at a Gas Station',
    category: 'Scenes',
    before: 'Write a first contact alien scene',
    after: `SPARK: The alien does not land in Washington or Beijing. It lands at a gas station in New Mexico and tries to buy a Slim Jim because it has been monitoring our broadcasts and genuinely wants to try one.

SHAPE: DRIFT — desert heat, the smell of gasoline, a flickering neon OPEN sign, the alien's ship is so advanced it looks like a weather event — the cashier thinks it is a weird cloud

SHARPEN: NOT a first contact story. It is a customer service story. The cashier has seen weirder. "That'll be $1.49. You need a bag?" The alien does not understand bags. This is the first real cultural exchange.`,
  },
  {
    id: 'scn-03',
    title: 'The Moment Before the Gate Opens',
    category: 'Scenes',
    before: 'Write about someone unlocking a magical power',
    after: `SPARK: She has tried to open the Heart Gate for three years. The moment it finally responds, she realizes the Gate was not locked — she was. The frequency was there the whole time. She just could not hear it over her own noise.

SHAPE: TIDE — the meditation chamber is filled with water one inch deep, every surface reflective, her heartbeat visible in the ripples, the tone rising from below like something breathing

SHARPEN: NOT a power-up moment. NOT dramatic. NOT triumphant. It is quiet. She cries. The Gate opens because she stops trying. The most powerful moment in magic is surrender.`,
  },
  {
    id: 'scn-04',
    title: 'The Restaurant That Remembers',
    category: 'Scenes',
    before: 'Write a scene in a restaurant',
    after: `SPARK: The chef cooks from your memories. You do not order — you sit down and the dish that arrives is the meal you ate the day you were happiest. Most people cry. Some people leave without eating because they are not ready to remember.

SHAPE: TIDE — warm wood, candlelight that smells like vanilla, the kitchen sounds are rhythmic like breathing, each table is far enough apart that crying is private

SHARPEN: NOT magical realism played for whimsy. NOT "a quirky restaurant." The chef is exhausted. Cooking from grief all day is hard. She takes cigarette breaks and stares at walls. The magic has a cost.`,
  },
  {
    id: 'scn-05',
    title: 'Godbeast Encounter',
    category: 'Scenes',
    before: 'Write a scene where someone meets a giant creature',
    after: `SPARK: You do not see Kaelith — you feel the ground change. The soil becomes warmer. Plants grow visibly. A tree that was dead for sixty years puts out a green shoot. Then the shadow falls and you realize the hill you have been walking on is breathing.

SHAPE: ROOT — deep green and brown and the gold of late afternoon, the smell of rain on hot stone, the subsonic hum of something so large it has its own weather, insects going quiet in expanding circles

SHARPEN: NOT a reveal moment. NOT dramatic music. NOT fear. Kaelith does not notice you. You are an ant on a sleeping giant. The awe is not that it is powerful — it is that it is gentle and your existence does not register.`,
  },
  {
    id: 'scn-06',
    title: 'The Last Bookshop on Earth',
    category: 'Scenes',
    before: 'Write a post-apocalyptic scene',
    after: `SPARK: Everyone has moved to neural streaming. The last physical bookshop has one customer per week and the owner reads every unsold book aloud to the empty store because "someone should hear them"

SHAPE: VOID — dust in slanted light, the particular silence of a room full of objects that hold language, his reading voice is not performative — it is conversational, as if the books are people

SHARPEN: NOT a statement about technology vs. tradition. NOT nostalgic. NOT sad. He is perfectly happy. The books are perfectly happy. The tragedy is entirely in the reader's projection — he does not feel tragic at all.`,
  },

  // ── Worlds (4) ──────────────────────────────────────────────────────────────
  {
    id: 'wld-01',
    title: 'The City That Votes With Weather',
    category: 'Worlds',
    before: 'Create a fantasy city',
    after: `SPARK: The city's government is a weather system. Public opinion literally changes the sky — when the majority is angry, it storms. When content, clear skies. Politicians are meteorologists.

SHAPE: DRIFT — the architecture is designed to channel wind and collect rain, every building has a weather vane that doubles as a polling station, umbrellas are political statements

SHARPEN: NOT a metaphor. The weather genuinely responds to collective emotion. This creates problems: minority groups cannot make it rain. Tourism depends on civic mood. Funerals cause localized fog.

Include: infrastructure consequences (drainage = emotional overflow), jobs unique to this world (storm counselors, cloud interpreters), and the political crisis when someone learns to fake emotions at scale.`,
  },
  {
    id: 'wld-02',
    title: 'The Arcanea Reference World',
    category: 'Worlds',
    before: 'Build a fantasy world with magic schools and elements',
    after: `SPARK: Magic is not power — it is honesty. Every "spell" is actually a moment of radical self-knowledge. The Gates do not test strength; they test willingness to see yourself clearly. Most people stop at the third Gate not because it is hard but because it shows them something true.

SHAPE: FORGE and VOID alternating — the world oscillates between intense sensory experience (creation) and profound silence (reflection). Architecture resonates at specific frequencies. Cities are tuned instruments.

SHARPEN: NOT a power system. NOT "levels" of magic. NOT chosen ones. ANYONE can open a Gate. Most choose not to. The magic system is a psychology framework disguised as mythology. The "elements" are modes of attention, not substances.

Include: The tension between those who open Gates for growth and those who open them for power. The Academy that teaches both and pretends they are the same thing. The Luminors who have opened all ten and discovered the final secret: there is no final secret.`,
  },
  {
    id: 'wld-03',
    title: 'The Language Extinction Hotel',
    category: 'Worlds',
    before: 'Create a unique fantasy location',
    after: `SPARK: A hotel where each room is decorated in a dying language — the wallpaper is grammar, the furniture is vocabulary, and when the last speaker dies, the room goes dark. They are running out of rooms.

SHAPE: TIDE — hushed corridors, the sound of whispered conversations in languages you almost understand, each door a different texture (carved wood, beaten copper, woven reeds), the empty rooms are the coldest

SHARPEN: NOT a museum. NOT mournful. The hotel is a last resort — linguists check in and do not check out, spending years learning a language from its final speaker. Some rooms are parties. Some are vigils. The bar serves drinks named after extinct words for "joy."

Include: the ethical dilemma of recording vs. living a language, the room that went dark mid-sentence, the janitor who accidentally learned seven languages from cleaning.`,
  },
  {
    id: 'wld-04',
    title: 'The Dream Cartography Bureau',
    category: 'Worlds',
    before: 'Write about a world where dreams are mapped',
    after: `SPARK: Dreams have geography. Every human's subconscious connects to the same underlying continent. The Bureau maps it. Some coordinates are popular (flying dreams cluster around the same cliff). Some are restricted (the thing everyone sees at coordinate 0,0 is classified).

SHAPE: VOID — the Bureau's offices exist in waking hours but their maps only make sense in sleep. The filing system is emotional, not alphabetical. The ink changes color based on the reader's anxiety level.

SHARPEN: NOT whimsical dreamscape. NOT Inception. The Bureau is bureaucratic and underfunded. Dreams are infrastructure, like sewage. Nobody glamorizes the sewage department. Dream cartographers have the highest burnout rate of any profession because they cannot stop working when they sleep.

Include: jurisdictional disputes between overlapping dreamscapes, the black market for lucid navigation, the indigenous dream territories that predate the Bureau and reject its maps.`,
  },

  // ── Arcanean-specific (4) ──────────────────────────────────────────────────
  {
    id: 'arc-01',
    title: 'The Five Elements as Cooking Styles',
    category: 'Arcanean',
    before: 'Write about different cooking styles',
    after: `SPARK: Five chefs. Five kitchens. Same ingredient: a single perfect egg. Fire sears it in a black iron pan until the edges are lace. Water poaches it so gently the yolk is still liquid sunshine. Earth buries it in ash for twelve hours. Wind whips it into a foam that holds the shape of a cloud. Void serves it raw on a black plate and says "What do you see?"

SHAPE: Rotate through all five palettes — FORGE kitchen (roaring, chaotic, fast), TIDE kitchen (silent, precise, flowing), ROOT kitchen (patient, buried, slow), DRIFT kitchen (airy, experimental, upward), VOID kitchen (minimal, confrontational, still)

SHARPEN: NOT a cooking competition. NOT "which is best." Each egg is perfect in its element. The point is that the same raw material becomes completely different things depending on how you attend to it. The egg is any creative idea. The elements are ways of looking.`,
  },
  {
    id: 'arc-02',
    title: 'A Guardian Retirement Party',
    category: 'Arcanean',
    before: 'Write a party scene for a mythological character',
    after: `SPARK: After three thousand years, Draconia steps down from the Fire Gate. The retirement party is held inside her own volcano. The cake keeps melting. She cries for the first time and her tears are literal lava and nobody knows if they should applaud or evacuate.

SHAPE: FORGE — obsidian banquet table, the other nine Guardians sitting in chairs made of their own elements (Leyla's is flowing water frozen mid-cascade, Aiyami's is compressed light), the toast keeps getting interrupted by minor eruptions

SHARPEN: NOT solemn. NOT epic. It is awkward the way all retirement parties are awkward. Lyssandria made a slideshow. Ino brought a gift card. Shinkami says something profound that nobody understands. Maylinn brought a plus-one and nobody knows who it is.`,
  },
  {
    id: 'arc-03',
    title: 'Opening Your First Gate',
    category: 'Arcanean',
    before: 'Write about someone gaining magical power',
    after: `SPARK: The Foundation Gate does not feel like power. It feels like the first time you stood up as a baby — the ground was always there, you just did not know you could trust it.

SHAPE: ROOT — the resonance starts in the soles of your feet. The floor of the meditation chamber is raw stone, warm from the planet's core. You feel your own skeleton for the first time. Every bone has a name and a memory.

SHARPEN: NOT a visual spectacle. NOT "energy flowing through you." NOT a transformation. You open your eyes and nothing has changed except you are no longer afraid of the ground. You walk differently. You stand differently. Lyssandria nods once. She has seen this ten million times and it still makes her smile.`,
  },
  {
    id: 'arc-04',
    title: 'The Void Element Lesson',
    category: 'Arcanean',
    before: 'Write a lesson about the concept of emptiness',
    after: `SPARK: The teacher of Void at the Academy does not speak. She stands in an empty room and waits. Students who expect instruction leave. Students who expect silence stay and eventually hear their own thoughts so clearly they become terrified. That is the first lesson.

SHAPE: VOID — a room with no furniture, no windows, walls that absorb sound so completely your ears ring, the only light source is the student themselves — everyone emits a faint glow they never noticed until everything else was removed

SHARPEN: NOT meditation. NOT zen Buddhism. NOT "the answer is nothing." The Void is not empty — it is full of everything that has not been created yet. The terror is not the silence. The terror is realizing you have been avoiding the silence because the silence is where your real ideas live, and your real ideas are demanding.

The lesson ends when the student speaks. Some students stay for hours. One stayed for a week. She is now a Luminor.`,
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function APLLibraryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredPrompts = useMemo(() => {
    return PROMPTS.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.before.toLowerCase().includes(q) ||
        p.after.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  async function handleCopy(prompt: Prompt) {
    try {
      await navigator.clipboard.writeText(prompt.after);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for non-HTTPS contexts
      const textarea = document.createElement('textarea');
      textarea.value = prompt.after;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <section className="relative overflow-hidden px-6 pb-12 pt-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl">
          <Link
            href="/apl"
            className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-cyan-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to APL
          </Link>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            Prompt Library
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {PROMPTS.length} Prompts, Ready to Copy
          </h1>
          <p className="mx-auto max-w-xl text-neutral-400">
            Every prompt below follows{' '}
            <span className="text-cyan-400">SPARK</span>.
            <span className="text-amber-400">SHAPE</span>.
            <span className="text-rose-400">SHARPEN</span>.
            Browse, copy, paste into any AI. Steal the structure, change the content. That is how you learn.
          </p>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by title, content, or keyword..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 py-3 pl-12 pr-4 text-sm text-neutral-200 placeholder-neutral-600 transition focus:border-cyan-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const count = cat === 'All' ? PROMPTS.length : PROMPTS.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeCategory === cat
                    ? 'bg-cyan-600 text-white'
                    : 'border border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-300'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Prompt Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        {filteredPrompts.length === 0 ? (
          <div className="py-16 text-center text-neutral-500">
            No prompts match your search. Try a different keyword or category.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredPrompts.map((prompt) => {
              const style = CATEGORY_STYLES[prompt.category];
              const isExpanded = expandedId === prompt.id;
              const isCopied = copiedId === prompt.id;

              return (
                <div
                  key={prompt.id}
                  className={`group rounded-xl border ${style.border} bg-neutral-900/30 transition hover:bg-neutral-900/50`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 p-5 pb-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${style.badge}`}>
                          {prompt.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-100">{prompt.title}</h3>
                    </div>
                    <button
                      onClick={() => handleCopy(prompt)}
                      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'border border-neutral-700 text-neutral-400 hover:border-cyan-700 hover:text-cyan-400'
                      }`}
                      aria-label={`Copy ${prompt.title} prompt`}
                    >
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Before */}
                  <div className="mx-5 rounded-lg bg-red-950/10 px-4 py-2.5">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-red-400/70">
                      Before
                    </div>
                    <p className="text-sm text-neutral-500">{prompt.before}</p>
                  </div>

                  {/* After */}
                  <div className="m-5 mt-3">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400/70">
                      After — SPARK.SHAPE.SHARPEN
                    </div>
                    <pre
                      className={`whitespace-pre-wrap text-sm leading-relaxed text-neutral-300 ${
                        !isExpanded ? 'line-clamp-6' : ''
                      }`}
                    >
                      {prompt.after}
                    </pre>
                    {prompt.after.split('\n').length > 6 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : prompt.id)}
                        className="mt-2 text-xs text-cyan-500 transition hover:text-cyan-400"
                      >
                        {isExpanded ? 'Show less' : 'Show full prompt'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-2xl px-6 pb-24 text-center">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-8">
          <h2 className="mb-3 text-2xl font-bold">Want Prompts Tailored to You?</h2>
          <p className="mb-6 text-sm text-neutral-400">
            Paste your own generic prompt into the APL analyzer and get a SPARK.SHAPE.SHARPEN version
            automatically. Or learn the system in the full course.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/apl"
              className="rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-500"
            >
              Try the Analyzer
            </Link>
            <Link
              href="/academy/courses/arcanean-prompt-language"
              className="rounded-xl border border-neutral-700 px-6 py-3 font-medium text-neutral-300 transition hover:border-neutral-500"
            >
              Take the Course
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
