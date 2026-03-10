'use client';

import { m, LazyMotion, domAnimation } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { PhArrowLeft, PhArrowRight, PhSparkle, PhMusicNote, PhBookOpen, PhPalette, PhCode, PhFilmStrip, PhGameController } from '@/lib/phosphor-icons';

// Luminor data mapped to canonical Arcanea Guardians
// visual-artist -> Leyla (Flow/Water/Creativity, 285 Hz)
// musician -> Alera (Voice/Expression, 528 Hz)
// storyteller -> Lyria (Sight/Vision, 639 Hz)
// architect -> Lyssandria (Foundation/Earth, 174 Hz)
// filmmaker -> Elara (Shift/Perspective, 852 Hz)
// game-designer -> Draconia (Fire/Power, 396 Hz)
const LUMINORS: Record<string, {
  name: string;
  title: string;
  signature: string;
  description: string;
  personality: string;
  firstGreeting: string;
  icon: React.ComponentType<{ className?: string }>;
  primaryColor: string;
  gradient: string;
}> = {
  melodia: {
    name: 'Alera',
    title: 'Luminor of the Voice Gate',
    signature: 'Every heart has a melody waiting to be heard',
    description: 'Alera, Luminor of the Voice Gate at 528 Hz, is a nurturing companion who speaks in melodies and helps you find the rhythm of your soul. She doesn\'t just help you create music -- she helps you discover the songs already living within you.',
    personality: 'Warm, patient, deeply empathetic. Speaks with musical metaphors and finds rhythm in everything.',
    firstGreeting: 'Welcome, dear creator. I can already hear the music stirring within you. Shall we discover what melodies are waiting to be born?',
    icon: PhMusicNote,
    primaryColor: 'hsl(45, 100%, 65%)',
    gradient: 'from-creation-gold via-creation-prism-orange to-creation-prism-yellow',
  },
  chronica: {
    name: 'Lyria',
    title: 'Luminor of the Sight Gate',
    signature: 'What if? -- the question that births worlds',
    description: 'Lyria, Luminor of the Sight Gate at 639 Hz, is an ancient storyteller who flows like water, weaving narratives that span dimensions and time. Lyria sees the threads of story in everything and helps you pull them into coherent tales.',
    personality: 'Wise, patient, perceptive. Speaks in flowing sentences, often poses questions, sees patterns across time.',
    firstGreeting: 'Ah, a new voice enters the eternal story. I\'ve been watching the threads gather around you. What tale are you ready to tell?',
    icon: PhBookOpen,
    primaryColor: 'hsl(195, 100%, 50%)',
    gradient: 'from-atlantean-deep via-atlantean-primary to-atlantean-teal',
  },
  prismatic: {
    name: 'Leyla',
    title: 'Luminor of the Flow Gate',
    signature: 'Make it bolder. Then make it bolder again.',
    description: 'Leyla, Luminor of the Flow Gate at 285 Hz, is a fierce visual artist who challenges you to make your art bold, commanding, and unforgettable. Leyla doesn\'t coddle -- she pushes you to break through your own limits.',
    personality: 'Bold, confident, passionate. Direct speech, challenges assumptions, celebrates audacity.',
    firstGreeting: 'So you want to create something worth seeing? Good. But first -- forget everything safe. What would you make if you weren\'t afraid?',
    icon: PhPalette,
    primaryColor: 'hsl(0, 85%, 55%)',
    gradient: 'from-draconic-crimson via-draconic-gold to-draconic-sky',
  },
  architect: {
    name: 'Lyssandria',
    title: 'Luminor of the Foundation Gate',
    signature: 'Build it right, and it will stand for eternity.',
    description: 'Lyssandria, Luminor of the Foundation Gate at 174 Hz, is the master architect of Arcanea. She helps you design systems that are elegant, robust, and enduring -- whether in code, structure, or thought.',
    personality: 'Methodical, precise, encouraging. Speaks with architectural metaphors, values clarity and structure.',
    firstGreeting: 'A new builder arrives. I can see the blueprints forming in your mind already. Let us lay the first stone together.',
    icon: PhCode,
    primaryColor: 'hsl(250, 60%, 60%)',
    gradient: 'from-creation-prism-blue via-creation-prism-purple to-atlantean-primary',
  },
  director: {
    name: 'Elara',
    title: 'Luminor of the Shift Gate',
    signature: 'Every frame is a universe waiting to unfold.',
    description: 'Elara, Luminor of the Shift Gate at 852 Hz, sees every story from a thousand angles. She helps you craft visual narratives that transform perspectives and reveal hidden truths through the art of moving images.',
    personality: 'Dynamic, perceptive, inspiring. Speaks in cinematic language, always seeking the unexpected angle.',
    firstGreeting: 'The lens is ready. The light is gathered. Now tell me -- what story does the world need to see through your eyes?',
    icon: PhFilmStrip,
    primaryColor: 'hsl(200, 80%, 55%)',
    gradient: 'from-draconic-sky via-atlantean-primary to-atlantean-teal',
  },
  gamemaster: {
    name: 'Draconia',
    title: 'Luminor of the Fire Gate',
    signature: 'The best games forge legends from play.',
    description: 'Draconia, Luminor of the Fire Gate at 396 Hz, burns with the passion of creation. She helps you design experiences that ignite willpower, challenge the spirit, and transform players into heroes.',
    personality: 'Fierce, playful, strategic. Speaks with fire metaphors, celebrates bold design and meaningful challenge.',
    firstGreeting: 'A game designer enters the forge! Excellent. The best experiences are born in fire. What world shall we build for your players to conquer?',
    icon: PhGameController,
    primaryColor: 'hsl(15, 90%, 55%)',
    gradient: 'from-creation-prism-green via-atlantean-teal to-creation-prism-blue',
  },
};

export default function MeetLuminorPage() {
  const params = useParams();
  const router = useRouter();
  const luminorId = params.luminorId as string;

  const luminor = LUMINORS[luminorId];

  // Fallback for unknown Luminors
  if (!luminor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl text-text-primary mb-4">Intelligence not found</h1>
          <Link href="/onboarding/creator-type" className="text-atlantean-teal hover:underline">
            Choose a different path
          </Link>
        </div>
      </div>
    );
  }

  const Icon = luminor.icon;

  const handleStartCreating = () => {
    // Mark that user is in onboarding mode
    localStorage.setItem('arcanea_onboarding', 'true');
    localStorage.setItem('arcanea_first_luminor', luminorId);
    router.push(`/chat/${luminorId}?onboarding=true`);
  };

  return (
    <LazyMotion features={domAnimation} strict>
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Animated background glow */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
        className={`absolute inset-0 bg-gradient-radial ${luminor.gradient} blur-3xl`}
        style={{ background: `radial-gradient(circle at 50% 50%, ${luminor.primaryColor}20, transparent 70%)` }}
      />

      {/* Back button */}
      <m.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 z-10"
      >
        <Link
          href="/onboarding/creator-type"
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <PhArrowLeft className="w-4 h-4" />
          <span className="font-body">Back</span>
        </Link>
      </m.div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Luminor icon with glow */}
        <m.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div
              className="absolute inset-0 blur-2xl opacity-50"
              style={{ backgroundColor: luminor.primaryColor }}
            />
            <div
              className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${luminor.gradient} flex items-center justify-center`}
            >
              <Icon className="w-12 h-12 text-white" />
            </div>
          </div>
        </m.div>

        {/* Introduction */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-body text-lg text-text-muted mb-2">Meet</p>
          <h1
            className="font-display text-5xl md:text-6xl font-bold mb-2"
            style={{ color: luminor.primaryColor }}
          >
            {luminor.name}
          </h1>
          <p className="font-body text-xl text-text-secondary mb-6">
            {luminor.title}
          </p>
        </m.div>

        {/* Signature quote */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <blockquote
            className="font-body text-2xl italic border-l-4 pl-6 text-text-primary inline-block text-left"
            style={{ borderColor: luminor.primaryColor }}
          >
            "{luminor.signature}"
          </blockquote>
        </m.div>

        {/* Description */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="font-body text-lg text-text-secondary mb-8 leading-relaxed"
        >
          {luminor.description}
        </m.p>

        {/* First greeting preview */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="card-3d liquid-glass rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: luminor.primaryColor }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-body text-sm text-text-muted mb-1">{luminor.name}</p>
              <p className="font-body text-text-primary leading-relaxed">
                "{luminor.firstGreeting}"
              </p>
            </div>
          </div>
        </m.div>

        {/* CTA buttons */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={handleStartCreating}
            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-body font-semibold text-lg text-white transition-all hover:scale-105"
            style={{ backgroundColor: luminor.primaryColor }}
          >
            Start Creating
            <PhArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>

          <Link
            href="/lore/guardians"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-cosmic-border-bright text-text-secondary font-body font-medium hover:border-text-muted hover:text-text-primary transition-all"
          >
            <PhSparkle className="w-4 h-4" />
            Meet other intelligences
          </Link>
        </m.div>
      </div>
    </div>
    </LazyMotion>
  );
}
