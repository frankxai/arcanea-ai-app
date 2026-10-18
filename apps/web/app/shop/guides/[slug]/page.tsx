import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SHOP_GUIDES, findGuide } from "@/lib/shop/guides";
import { SHOP_ORIGIN, SHOP_UPDATED } from "@/lib/shop/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return SHOP_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuide(slug);
  return guide
    ? {
        title: guide.searchTitle,
        description: guide.description,
        alternates: { canonical: `/shop/guides/${guide.slug}` },
        openGraph: {
          type: "article",
          title: guide.searchTitle,
          description: guide.description,
        },
      }
    : { title: "Field note not found", robots: { index: false } };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.searchTitle,
    description: guide.description,
    datePublished: SHOP_UPDATED,
    dateModified: SHOP_UPDATED,
    publisher: { "@type": "Organization", name: "Arcanea" },
    mainEntityOfPage: `${SHOP_ORIGIN}/shop/guides/${guide.slug}`,
  };
  return (
    <article className="shop-reading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <p className="shop-eyebrow">Field notes / {guide.category}</p>
      <h1>{guide.title}</h1>
      <p className="shop-intro">{guide.intro}</p>
      {guide.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
      <h2>Try the worked example.</h2>
      <p>
        Read the free demonstration scene and download the editable World
        Starter. The example is an AI-assisted proposal outside official Arcanea
        canon; adapt its method to your own original project.
      </p>
      <Link href="/shop/sample" className="shop-button">
        Open the free World Starter
      </Link>
      <Link
        href="/shop/worldbuilder-production-edition"
        className="shop-text-link"
      >
        Inspect the Production Edition
      </Link>
    </article>
  );
}
