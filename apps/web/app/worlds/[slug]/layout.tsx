import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sb = await createClient();

  const { data: world } = await sb
    .from("worlds")
    .select("name, tagline, description, hero_image_url")
    .eq("slug", slug)
    .single();

  if (!world) {
    return {
      title: "World Not Found — Arcanea",
      description: "This world does not exist or is private.",
    };
  }

  const title = `${world.name} — Arcanea`;
  const description =
    world.tagline || world.description?.slice(0, 160) || "A world in the Arcanea multiverse.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(world.hero_image_url
        ? {
            images: [
              {
                url: world.hero_image_url,
                width: 1200,
                height: 630,
                alt: world.name,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(world.hero_image_url ? { images: [world.hero_image_url] } : {}),
    },
    alternates: { canonical: `/worlds/${slug}` },
  };
}

export default function WorldDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
