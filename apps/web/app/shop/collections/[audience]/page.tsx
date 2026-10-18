import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SHOP_EDITIONS } from "@/lib/shop/catalog";
import { EditionCard } from "@/components/shop/edition-card";

export const dynamicParams = false;

const collections = {
  creators: {
    title: "Create a world of your own.",
    subtitle: "Worldbuilding production kits",
    description:
      "Inspect individual and studio editions for original-world production, continuity and portable handoff. Each edition shows its release state.",
  },
  collectors: {
    title: "Keep a piece of the world.",
    subtitle: "Original art editions",
    description:
      "Explore original art editions and the current Arcanea gallery. Each edition shows its release state and download scope.",
  },
};

function collectionFor(value: string) {
  return value === "creators" || value === "collectors"
    ? collections[value]
    : null;
}

export function generateStaticParams() {
  return [{ audience: "creators" }, { audience: "collectors" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ audience: string }>;
}): Promise<Metadata> {
  const { audience } = await params;
  const collection = collectionFor(audience);
  return collection
    ? {
        title: collection.subtitle,
        description: collection.description,
        alternates: { canonical: `/shop/collections/${audience}` },
      }
    : { title: "Collection not found", robots: { index: false } };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ audience: string }>;
}) {
  const { audience } = await params;
  const collection = collectionFor(audience);
  if (!collection) notFound();
  const editions = SHOP_EDITIONS.filter(
    (edition) => edition.audience === audience,
  );
  return (
    <section className="shop-section">
      <p className="shop-eyebrow">{collection.subtitle}</p>
      <h1 className="shop-collection-heading">{collection.title}</h1>
      <p className="shop-intro">{collection.description}</p>
      <div className="shop-editions-grid">
        {editions.map((edition, i) => (
          <EditionCard
            key={edition.slug}
            edition={edition}
            number={String(i + 1).padStart(2, "0")}
          />
        ))}
      </div>
    </section>
  );
}
