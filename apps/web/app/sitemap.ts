import { MetadataRoute } from 'next';
import { COLLECTIONS, getAllTexts } from '@/lib/content';
import { BLOG_POSTS } from '@/lib/blog-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://arcanea.ai';

  const staticPages: MetadataRoute.Sitemap = [
    // ── Core Product ───────────────────────────────────────
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/chat`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/worlds`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/worlds/create`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/imagine`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/voice`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/quiz`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/showcase`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },

    // ── Luminors & Agents ──────────────────────────────────
    { url: `${baseUrl}/luminors`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/companions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/agents`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

    // ── Library & Knowledge ────────────────────────────────
    { url: `${baseUrl}/library`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/library/codex`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/library/graph`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // ── Lore ───────────────────────────────────────────────
    { url: `${baseUrl}/lore`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lore/guardians`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/lore/gates`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lore/elements`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lore/godbeasts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lore/wisdoms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lore/malachar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/lore/library`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/factions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },

    // ── Academy ────────────────────────────────────────────
    { url: `${baseUrl}/academy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/academy/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/academy/certification`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/academy/gate-quiz`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },

    // ── Living Lore ────────────────────────────────────────
    { url: `${baseUrl}/living-lore`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/living-lore/crew`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/living-lore/chronicle`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/living-lore/journal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/living-lore/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/living-lore/book`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/living-lore/encounter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },

    // ── Books ──────────────────────────────────────────────
    { url: `${baseUrl}/books`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

    // ── Creation Tools ─────────────────────────────────────
    { url: `${baseUrl}/studio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/music`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/records`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/forge`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/claw`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // ── Community ──────────────────────────────────────────
    { url: `${baseUrl}/community`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/discover`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/skills`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/challenges`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },

    // ── Ecosystem & Developers ─────────────────────────────
    { url: `${baseUrl}/ecosystem`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/developers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/arcanea-code`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/arcanea-vault`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/arcanea-os`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/install`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // ── Info Pages ─────────────────────────────────────────
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/changelog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/roadmap`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/contribute`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/welcome`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/research`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },

    // ── Intelligence ──────────────────────────────────────
    { url: `${baseUrl}/models`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/models/image`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },

    // ── Legal ──────────────────────────────────────────────
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ];

  // Guardian lore pages
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

  // Library collections (17)
  const libraryCollectionPages: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${baseUrl}/library/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Library texts (76+)
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
    // Content not available at build time
  }

  // Academy gate pages (10)
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

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic worlds (from Supabase)
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
    // Supabase not available at build
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
