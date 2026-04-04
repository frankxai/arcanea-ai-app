import { MetadataRoute } from 'next';
import { COLLECTIONS, getAllTexts } from '@/lib/content';
import { BLOG_POSTS } from '@/lib/blog-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://arcanea.ai';

  // Static public pages with SEO value
  const staticPages: MetadataRoute.Sitemap = [
    // ── Core ────────────────────────────────────────────────
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/vision`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // ── Ecosystem & Products ────────────────────────────────
    { url: `${baseUrl}/ecosystem`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/research`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/platform`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/arcanea-code`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/arcanea-vault`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/arcanea-os`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/acos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/overlays`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/workflows`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/install`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/developers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // ── Luminor Intelligence ────────────────────────────────
    { url: `${baseUrl}/luminor-intelligence`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.95 },
    { url: `${baseUrl}/luminors`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/companions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/chat`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/agents`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

    // ── Academy ─────────────────────────────────────────────
    { url: `${baseUrl}/academy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/academy/gates`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/academy/houses`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/academy/ranks`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/academy/gate-quiz`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/academy/assessment`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/academy/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/academy/courses/foundations-of-creation`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/academy/courses/creative-flow`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/academy/courses/the-fire-within`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/academy/courses/voice-and-truth`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/academy/courses/creative-vision`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // ── Living Lore ─────────────────────────────────────────
    { url: `${baseUrl}/living-lore`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/living-lore/crew`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/living-lore/chronicle`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/living-lore/journal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/living-lore/meet`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/living-lore/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },

    // ── Lore ────────────────────────────────────────────────
    { url: `${baseUrl}/lore`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lore/guardians`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/lore/gates`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lore/elements`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lore/godbeasts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lore/wisdoms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lore/malachar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/lore/library`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },

    // ── Library ─────────────────────────────────────────────
    { url: `${baseUrl}/library`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/library/codex`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/library/graph`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // ── Creation Tools ──────────────────────────────────────
    { url: `${baseUrl}/studio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/studio/image`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/character-book`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/world-builder`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/universe-builder`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/vision-board`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prompt-books`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },

    // ── Community ───────────────────────────────────────────
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/discover`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/skills`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/bestiary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chess`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },

    // ── Architecture ────────────────────────────────────────
    { url: `${baseUrl}/architecture`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // ── Books ───────────────────────────────────────────────
    { url: `${baseUrl}/books`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/books/book1`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/books/book2`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },

    // ── Core Product Pages ──────────────────────────────────
    { url: `${baseUrl}/worlds`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/worlds/create`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/quiz`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/factions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/showcase`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/voice`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // ── Creation Tools (additional) ────────────────────────
    { url: `${baseUrl}/imagine`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/creations`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/music`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/claw`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/forge`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/design-lab`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // ── Community (additional) ─────────────────────────────
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/challenges`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },

    // ── Living Lore (additional) ───────────────────────────
    { url: `${baseUrl}/living-lore/book`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/living-lore/encounter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },

    // ── Contribute ──────────────────────────────────────────
    { url: `${baseUrl}/contribute`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // ── Academy (additional) ────────────────────────────────
    { url: `${baseUrl}/academy/certification`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // ── Codex ──────────────────────────────────────────────
    { url: `${baseUrl}/codex/materials`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // ── Council ────────────────────────────────────────────
    { url: `${baseUrl}/council`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },

    // ── APL ────────────────────────────────────────────────
    { url: `${baseUrl}/apl`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // ── Standards ──────────────────────────────────────────
    { url: `${baseUrl}/standards`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // ── Ops ────────────────────────────────────────────────
    { url: `${baseUrl}/ops`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.5 },
    { url: `${baseUrl}/ops/agents`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.5 },

    // ── Content ─────────────────────────────────────────────
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/glossary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/changelog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/roadmap`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },

    // ── Hub ─────────────────────────────────────────────────
    { url: `${baseUrl}/hub`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/hub/guides`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/hub/tools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/hub/updates`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.65 },

    // ── Onboarding ──────────────────────────────────────────
    { url: `${baseUrl}/welcome`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // ── Legal & Info ────────────────────────────────────────
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/feedback`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/status`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.5 },
    { url: `${baseUrl}/records`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/records/vibe-gods`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/linktree`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/user-flows`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Individual Guardian lore pages
  const guardianNames = [
    'lyssandria', 'leyla', 'draconia', 'maylinn', 'alera',
    'lyria', 'aiyami', 'elara', 'ino', 'shinkami',
  ];
  const guardianPages: MetadataRoute.Sitemap = guardianNames.map((name) => ({
    url: `${baseUrl}/lore/guardians/${name}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Library collection pages (17 collections)
  const libraryCollectionPages: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${baseUrl}/library/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Library text pages (76+ individual texts)
  let libraryTextPages: MetadataRoute.Sitemap = [];
  try {
    const allTexts = await getAllTexts();
    libraryTextPages = allTexts.map((text) => ({
      url: `${baseUrl}/library/${text.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }));
  } catch {
    // Content not available at build time — skip dynamic texts
  }

  // Academy gate detail pages (10 gates)
  const gateIds = [
    'foundation', 'flow', 'fire', 'heart', 'voice',
    'sight', 'crown', 'shift', 'unity', 'source',
  ];
  const gatePages: MetadataRoute.Sitemap = gateIds.map((id) => ({
    url: `${baseUrl}/academy/gates/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Blog post pages (dynamic from shared data)
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic world pages (from Supabase)
  let worldPages: MetadataRoute.Sitemap = [];
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const sb = createClient(url, key);
      const { data } = await sb
        .from('worlds')
        .select('slug, updated_at')
        .eq('visibility', 'public')
        .order('star_count', { ascending: false })
        .limit(100);
      if (data) {
        worldPages = data.map((w) => ({
          url: `${baseUrl}/worlds/${w.slug}`,
          lastModified: w.updated_at ? new Date(w.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
      }
    }
  } catch {
    // Supabase not available at build — skip dynamic worlds
  }

  return [
    ...staticPages,
    ...guardianPages,
    ...libraryCollectionPages,
    ...libraryTextPages,
    ...gatePages,
    ...blogPages,
    ...worldPages,
  ];
}
