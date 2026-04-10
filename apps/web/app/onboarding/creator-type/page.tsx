'use client';

import { useState } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PhMusicNote, PhBookOpen, PhPalette, PhCode, PhFilmStrip, PhGameController, PhArrowLeft, PhSparkle } from '@/lib/phosphor-icons';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';

const CREATOR_TYPES = [
  {
    id: 'musician' as const,
    name: 'Music',
    icon: PhMusicNote,
    description: 'Compose melodies, write lyrics, explore soundscapes',
    luminorId: 'composer',
    gradient: 'from-creation-prism-orange to-creation-prism-yellow',
    color: 'text-creation-prism-orange',
  },
  {
    id: 'storyteller' as const,
    name: 'Stories',
    icon: PhBookOpen,
    description: 'Craft narratives, build worlds, develop characters',
    luminorId: 'storyteller',
    gradient: 'from-atlantean-teal to-atlantean-primary',
    color: 'text-atlantean-teal',
  },
  {
    id: 'visual-artist' as const,
    name: 'Visual Art',
    icon: PhPalette,
    description: 'Design visuals, create concepts, imagine worlds',
    luminorId: 'visual-designer',
    gradient: 'from-draconic-crimson to-draconic-gold',
    color: 'text-draconic-crimson',
  },
  {
    id: 'architect' as const,
    name: 'Code',
    icon: PhCode,
    description: 'Build software, architect systems, solve problems',
    luminorId: 'systems-architect',
    gradient: 'from-creation-prism-blue to-creation-prism-purple',
    color: 'text-creation-prism-blue',
  },
  {
    id: 'filmmaker' as const,
    name: 'Video',
    icon: PhFilmStrip,
    description: 'Edit films, create content, tell visual stories',
    luminorId: 'director',
    gradient: 'from-draconic-sky to-atlantean-primary',
    color: 'text-draconic-sky',
  },
  {
    id: 'game-designer' as const,
    name: 'Games',
    icon: PhGameController,
    description: 'Design experiences, craft mechanics, build fun',
    luminorId: 'gamemaster',
    gradient: 'from-creation-prism-green to-atlantean-teal',
    color: 'text-creation-prism-green',
  },
];

export default function CreatorTypePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSelect = async (type: typeof CREATOR_TYPES[0]) => {
    // Store selection locally as fallback
    localStorage.setItem('arcanea_creator_type', type.id);

    // Persist to Supabase profile if authenticated
    if (user) {
      setSaving(true);
      try {
        const supabase = createClient();
        await supabase
          .from('profiles')
          .update({ metadata: { creator_type: type.id } })
          .eq('id', user.id);
      } catch {
        // Profile update failed silently — localStorage fallback is active
      } finally {
        setSaving(false);
      }
    }

    router.push(`/onboarding/meet-luminor/${type.luminorId}`);
  };

  return (
    <LazyMotion features={domAnimation} strict>
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
      {/* Back button */}
      <m.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Link
          href="/welcome"
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <PhArrowLeft className="w-4 h-4" />
          <span className="font-body">Back</span>
        </Link>
      </m.div>

      {/* Header */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
          What do you create?
        </h1>
        <p className="font-body text-xl text-text-secondary">
          Your superintelligence adapts to your craft. Pick one to begin.
        </p>
      </m.div>

      {/* Creator type grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-8">
        {CREATOR_TYPES.map((type, index) => {
          const Icon = type.icon;
          return (
            <m.button
              key={type.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => handleSelect(type)}
              className="group relative p-6 rounded-2xl card-3d liquid-glass hover:glass-heavy transition-all duration-300 hover:scale-105 text-left"
            >
              {/* Hover gradient */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className={`font-display text-xl font-semibold mb-2 ${type.color} group-hover:text-text-primary transition-colors`}>
                  {type.name}
                </h3>

                <p className="font-body text-sm text-text-muted line-clamp-2">
                  {type.description}
                </p>
              </div>
            </m.button>
          );
        })}
      </div>

      {/* Explore all option */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link
          href="/lore/guardians"
          className="flex items-center gap-2 text-text-muted hover:text-gold-bright transition-colors font-body"
        >
          <PhSparkle className="w-4 h-4" />
          Not sure? Explore all intelligences
        </Link>
      </m.div>
    </div>
    </LazyMotion>
  );
}
