/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { withAbortDeadline } from "@/lib/async-deadline";

interface Props {
  params: Promise<{ slug: string }>;
}

const METADATA_QUERY_TIMEOUT_MS = 3_000;

function fallbackMetadata(slug: string): Metadata {
  return {
    title: "World — Arcanea",
    description: "Explore a world in the Arcanea multiverse.",
    alternates: { canonical: `/worlds/${slug}` },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Metadata is public discovery: avoid request-cookie initialization and
    // keep the publishable key constrained by the same RLS policies.
    const sb = createPublicClient();
    if (!sb) return fallbackMetadata(slug);
    const { data: world, error } = await withAbortDeadline(
      "world metadata query",
      METADATA_QUERY_TIMEOUT_MS,
      (signal) =>
        sb
          .from("worlds")
          .select("name, tagline, description, hero_image_url")
          .eq("slug", slug)
          .abortSignal(signal)
          .single()
    );

    if (error || !world) {
      if (error) {
        console.error("[worlds/[slug]] metadata query failed", {
          errorName: error instanceof Error ? error.name : "SupabaseError",
        });
      }
      return fallbackMetadata(slug);
    }

    const title = `${world.name} — Arcanea`;
    const description =
      world.tagline ||
      world.description?.slice(0, 160) ||
      "A world in the Arcanea multiverse.";

    // Use dynamic OG image — generates beautiful social cards from world data
    const ogImage = world.hero_image_url || `/api/worlds/${slug}/og`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: [{ url: ogImage, width: 1200, height: 630, alt: world.name }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
      alternates: { canonical: `/worlds/${slug}` },
    };
  } catch (error) {
    console.error("[worlds/[slug]] metadata query aborted or threw", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return fallbackMetadata(slug);
  }
}

export default function WorldDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
