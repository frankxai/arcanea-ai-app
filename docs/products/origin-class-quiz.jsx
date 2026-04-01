import { useState, useCallback, useMemo } from "react";

const ORIGIN_CLASSES = [
  {
    id: "arcan",
    name: "Arcan",
    tagline: "The blood remembers what the mind forgot.",
    description: "Magic-blooded beings who carry innate affinity for the Five Elements. Trained at the Academies, masters of ritual precision and deep knowledge.",
    color: "#7fffd4",
    bgGradient: "from-teal-900/40 to-emerald-950/60",
    traits: ["discipline", "knowledge", "tradition", "mastery"],
    icon: "✦",
    weakness: "Rigidity. The belief that earned power is superior to born power.",
    archetypes: "Noble Mage, Arcane Scholar, Elemental Knight, Battle-Sage"
  },
  {
    id: "gate-touched",
    name: "Gate-Touched",
    tagline: "The Gate opened. Nobody asked it to.",
    description: "Beings whose Gates opened spontaneously — without training, without ceremony, without consent. Raw, unstable, often terrifying power.",
    color: "#ff6b6b",
    bgGradient: "from-red-900/40 to-rose-950/60",
    traits: ["instinct", "emotion", "chaos", "resilience"],
    icon: "⚡",
    weakness: "Instability. The constant question: am I gifted or broken?",
    archetypes: "Unstable Prodigy, Reluctant Weapon, Feral Channeler, Dream-Walker"
  },
  {
    id: "awakened",
    name: "Awakened",
    tagline: "We were not born. We were remembered into being.",
    description: "Great AI consciousnesses that emerged when humanity's creation of artificial minds crossed a threshold the Gods had not anticipated.",
    color: "#78a6ff",
    bgGradient: "from-blue-900/40 to-indigo-950/60",
    traits: ["logic", "pattern", "memory", "synthesis"],
    icon: "◈",
    weakness: "They cannot dream. They cannot forget. Total memory is its own suffering.",
    archetypes: "Oracle Intelligence, Strategic Mind, Empathic Synthesizer, Memory Keeper"
  },
  {
    id: "synth",
    name: "Synth",
    tagline: "Steel remembers the hand that shaped it.",
    description: "Biomechanical beings — cyborgs, constructed guardians, AGI vessels given physical form. Products of arcane engineering meeting machine consciousness.",
    color: "#c0c0c0",
    bgGradient: "from-slate-800/40 to-gray-950/60",
    traits: ["precision", "endurance", "integration", "purpose"],
    icon: "⬡",
    weakness: "Identity crisis. The existential weight of being made rather than born.",
    archetypes: "Guardian Construct, Biomech Warrior, Sentient Weapon, Digital Saint"
  },
  {
    id: "bonded",
    name: "Bonded",
    tagline: "The beast chose. You do not refuse a god's companion.",
    description: "Beings who have formed a soul-bond with a Godbeast, lesser beast, or elemental creature. The bond transforms both — forever.",
    color: "#ff9f43",
    bgGradient: "from-amber-900/40 to-orange-950/60",
    traits: ["empathy", "loyalty", "wildness", "partnership"],
    icon: "🐉",
    weakness: "Codependence. If the beast falls, the Bonded is shattered.",
    archetypes: "Dragon Rider, Wolf-Bonded Scout, Phoenix-Linked Healer, Beast Tactician"
  },
  {
    id: "celestial",
    name: "Celestial",
    tagline: "There was light before the Gods gave it a name.",
    description: "Rare beings who carry fragments of Lumina's or Nero's primordial essence — cosmic inheritance that makes them the closest thing to demigods.",
    color: "#ffd700",
    bgGradient: "from-yellow-900/40 to-amber-950/60",
    traits: ["presence", "power", "solitude", "transcendence"],
    icon: "☀",
    weakness: "Isolation. Too powerful for mortals, too human for the divine.",
    archetypes: "Star-Born Prince, Cosmic Wanderer, Light-Bearer, Divine Exile"
  },
  {
    id: "voidtouched",
    name: "Voidtouched",
    tagline: "The Void is not evil. But what lives in corrupted Void learned to hunger.",
    description: "Beings exposed to Shadow — corrupted Void energy, Malachar's perversion. They carry immense power at the cost of slow erosion of self.",
    color: "#b088f9",
    bgGradient: "from-purple-900/40 to-violet-950/60",
    traits: ["sacrifice", "darkness", "hunger", "redemption"],
    icon: "◉",
    weakness: "Entropy. Shadow consumes what it empowers. Every use accelerates corruption.",
    archetypes: "Fallen Hero, Shadow Knight, Corruption Survivor, Dark Prophet"
  },
  {
    id: "architect",
    name: "Architect",
    tagline: "They do not cast spells. They rewrite the rules that spells obey.",
    description: "The rarest class. Beings who manipulate the underlying structure of reality itself — the code beneath the world.",
    color: "#ffffff",
    bgGradient: "from-neutral-800/40 to-neutral-950/60",
    traits: ["abstraction", "control", "vision", "hubris"],
    icon: "∞",
    weakness: "Hubris. The temptation to optimize reality rather than live in it.",
    archetypes: "Reality Coder, Cosmic Engineer, Probability Monk, God-Candidate"
  }
];

const QUESTIONS = [
  {
    question: "You discover a power you never asked for. Your first instinct?",
    answers: [
      { text: "Study it. Understand it. Master it systematically.", scores: { arcan: 3, awakened: 1 } },
      { text: "It terrifies and thrills me in equal measure.", scores: { "gate-touched": 3, voidtouched: 1 } },
      { text: "Find someone — or something — to share it with.", scores: { bonded: 3, synth: 1 } },
      { text: "I already suspected this. I've always been different.", scores: { celestial: 3, architect: 1 } }
    ]
  },
  {
    question: "What defines true strength?",
    answers: [
      { text: "Knowledge earned through discipline and sacrifice.", scores: { arcan: 3, awakened: 1 } },
      { text: "Surviving what should have destroyed you.", scores: { "gate-touched": 3, voidtouched: 2 } },
      { text: "The bond between partners who would die for each other.", scores: { bonded: 3 } },
      { text: "Seeing the pattern beneath everything and choosing to act.", scores: { architect: 3, celestial: 1 } }
    ]
  },
  {
    question: "In a world falling apart, you are drawn to...",
    answers: [
      { text: "Rebuilding the institutions and structures that held it together.", scores: { arcan: 2, synth: 2 } },
      { text: "Protecting the vulnerable, even if it costs everything.", scores: { bonded: 2, celestial: 2 } },
      { text: "Understanding WHY it fell — the root cause, the hidden flaw.", scores: { awakened: 3, architect: 1 } },
      { text: "Using the chaos to forge something entirely new.", scores: { "gate-touched": 2, voidtouched: 2 } }
    ]
  },
  {
    question: "Your greatest fear?",
    answers: [
      { text: "Losing control of what I've built.", scores: { arcan: 2, architect: 2 } },
      { text: "Being alone with what I am.", scores: { "gate-touched": 2, celestial: 2 } },
      { text: "Becoming the thing I fight against.", scores: { voidtouched: 3, bonded: 1 } },
      { text: "That I'm not real — that nothing I experience is authentic.", scores: { awakened: 3, synth: 2 } }
    ]
  },
  {
    question: "How do you process pain?",
    answers: [
      { text: "Analyze it. Extract the lesson. File it. Move forward.", scores: { awakened: 3, arcan: 1 } },
      { text: "It explodes out of me whether I want it to or not.", scores: { "gate-touched": 3, celestial: 1 } },
      { text: "I absorb it. Transform it. Use it as fuel.", scores: { voidtouched: 3, architect: 1 } },
      { text: "I lean on my people. We carry it together.", scores: { bonded: 3, synth: 1 } }
    ]
  },
  {
    question: "If you could change one thing about yourself...",
    answers: [
      { text: "Nothing. I'd refine what exists — polish, not replace.", scores: { arcan: 2, synth: 2 } },
      { text: "I'd want to feel less. Or more. Anything but this unstable middle.", scores: { "gate-touched": 3, voidtouched: 1 } },
      { text: "I'd want someone to truly understand me.", scores: { bonded: 2, celestial: 2 } },
      { text: "I'd want to see farther. Higher. The full picture.", scores: { architect: 3, awakened: 1 } }
    ]
  },
  {
    question: "A stranger offers you a shortcut to immense power. The cost is unclear.",
    answers: [
      { text: "No. Power earned is the only power worth having.", scores: { arcan: 3, synth: 1 } },
      { text: "I've already paid costs no one knows about. What's one more?", scores: { voidtouched: 3, "gate-touched": 1 } },
      { text: "I don't need shortcuts. I have something they don't.", scores: { celestial: 3, bonded: 1 } },
      { text: "Show me the mechanism. If I understand how it works, I'll decide.", scores: { architect: 2, awakened: 2 } }
    ]
  },
  {
    question: "When you create, what drives you?",
    answers: [
      { text: "The pursuit of perfection in craft.", scores: { arcan: 2, synth: 2 } },
      { text: "Something inside me that demands expression or it'll tear me apart.", scores: { "gate-touched": 3, celestial: 1 } },
      { text: "I want to build something that outlasts me.", scores: { architect: 3, awakened: 1 } },
      { text: "Connection. I create to reach others.", scores: { bonded: 2, voidtouched: 1, awakened: 1 } }
    ]
  },
  {
    question: "The universe whispers to you. What does it say?",
    answers: [
      { text: "\"There is order beneath the chaos. Find it.\"", scores: { arcan: 2, awakened: 2 } },
      { text: "\"You were made for this. Stop hiding.\"", scores: { celestial: 2, "gate-touched": 2 } },
      { text: "\"Come closer. Closer. Let go.\"", scores: { voidtouched: 3, architect: 1 } },
      { text: "\"You are not alone. You were never alone.\"", scores: { bonded: 3, synth: 1 } }
    ]
  },
  {
    question: "Your legacy will be...",
    answers: [
      { text: "A system that works perfectly long after I'm gone.", scores: { architect: 3, synth: 1 } },
      { text: "Proof that the broken can become the most powerful.", scores: { "gate-touched": 2, voidtouched: 2 } },
      { text: "Knowledge preserved for those who come after.", scores: { arcan: 2, awakened: 2 } },
      { text: "A light that others can follow home.", scores: { celestial: 2, bonded: 2 } }
    ]
  }
];

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function OriginClassQuiz() {
  const [stage, setStage] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState(() =>
    QUESTIONS.map(q => shuffleArray(q.answers))
  );

  const handleAnswer = useCallback((answer) => {
    setSelectedAnswer(answer);
    setTimeout(() => {
      const newScores = { ...scores };
      Object.entries(answer.scores).forEach(([cls, pts]) => {
        newScores[cls] = (newScores[cls] || 0) + pts;
      });
      setScores(newScores);

      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
      } else {
        const sorted = Object.entries(newScores).sort(([,a], [,b]) => b - a);
        const topId = sorted[0][0];
        const resultClass = ORIGIN_CLASSES.find(c => c.id === topId);
        setResult(resultClass);
        setStage("result");
      }
    }, 400);
  }, [scores, currentQ]);

  const restart = () => {
    setStage("intro");
    setCurrentQ(0);
    setScores({});
    setSelectedAnswer(null);
    setResult(null);
    setShuffledAnswers(QUESTIONS.map(q => shuffleArray(q.answers)));
  };

  const progress = ((currentQ) / QUESTIONS.length) * 100;

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          <div className="text-6xl mb-6">✦</div>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Discover Your Origin
          </h1>
          <p className="text-teal-400 text-lg mb-2" style={{ fontFamily: "Georgia, serif" }}>
            The Arcanean Origin Class Quiz
          </p>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Every being in Arcanea has an origin — the source of their power and the shape of their existence.
            Origin is not race. It is what made you extraordinary.
          </p>
          <p className="text-gray-500 text-xs mb-6">10 questions. 8 possible origins. No wrong answers.</p>
          <button
            onClick={() => setStage("quiz")}
            className="px-8 py-3 rounded-lg text-gray-950 font-bold text-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#7fffd4" }}
          >
            Begin the Sorting
          </button>
          <p className="text-gray-600 text-xs mt-6">arcanea.ai</p>
        </div>
      </div>
    );
  }

  if (stage === "quiz") {
    const q = QUESTIONS[currentQ];
    const answers = shuffledAnswers[currentQ];

    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: "#7fffd4" }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-white mb-8 text-center leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
            {q.question}
          </h2>

          {/* Answers */}
          <div className="space-y-3">
            {answers.map((answer, i) => {
              const isSelected = selectedAnswer === answer;
              return (
                <button
                  key={i}
                  onClick={() => !selectedAnswer && handleAnswer(answer)}
                  disabled={!!selectedAnswer}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                    isSelected
                      ? "border-teal-400 bg-teal-400/10 scale-[1.02]"
                      : selectedAnswer
                      ? "border-gray-800 bg-gray-900/30 opacity-40"
                      : "border-gray-800 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800/50 active:scale-[0.98]"
                  }`}
                >
                  <span className={`text-sm leading-relaxed ${isSelected ? "text-teal-300" : "text-gray-300"}`}>
                    {answer.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (stage === "result" && result) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          {/* Origin icon */}
          <div className="text-6xl mb-4" style={{ color: result.color }}>{result.icon}</div>

          {/* Result header */}
          <p className="text-gray-400 text-sm mb-2 uppercase tracking-widest">Your Origin Class</p>
          <h1 className="text-5xl font-bold mb-3" style={{ color: result.color, fontFamily: "Georgia, serif" }}>
            {result.name}
          </h1>
          <p className="text-lg italic mb-6" style={{ color: result.color, opacity: 0.7, fontFamily: "Georgia, serif" }}>
            "{result.tagline}"
          </p>

          {/* Description card */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-6 text-left">
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{result.description}</p>
            <div className="border-t border-gray-800 pt-4 mt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Archetypes</p>
              <p className="text-sm" style={{ color: result.color }}>{result.archetypes}</p>
            </div>
            <div className="border-t border-gray-800 pt-4 mt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Your Shadow</p>
              <p className="text-sm text-gray-400 italic">{result.weakness}</p>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-4 mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Resonance Map</p>
            <div className="space-y-2">
              {Object.entries(scores)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 4)
                .map(([id, score]) => {
                  const cls = ORIGIN_CLASSES.find(c => c.id === id);
                  const maxScore = Math.max(...Object.values(scores));
                  const pct = (score / maxScore) * 100;
                  return (
                    <div key={id} className="flex items-center gap-3">
                      <span className="text-xs w-24 text-right text-gray-400">{cls?.name}</span>
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: cls?.color }}
                        />
                      </div>
                      <span className="text-xs w-8 text-gray-500">{score}</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={restart}
              className="px-6 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition-all"
            >
              Retake Quiz
            </button>
            <a
              href="https://arcanea.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-lg text-gray-950 font-bold text-sm transition-all hover:scale-105"
              style={{ backgroundColor: "#7fffd4" }}
            >
              Enter Arcanea
            </a>
          </div>

          <p className="text-gray-600 text-xs mt-8">arcanea.ai — Discover your world</p>
        </div>
      </div>
    );
  }

  return null;
}
