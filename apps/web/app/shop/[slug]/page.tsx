import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SHOP_EDITIONS,
  SHOP_ORIGIN,
  findEdition,
  editionReleased,
  editionDescription,
  editionPageCopy,
  productStructuredData,
} from "@/lib/shop/catalog";
import { checkoutUrlForEdition } from "@/lib/shop/checkout";
import { CheckoutAction } from "@/components/shop/checkout-action";

export const dynamicParams = false;

export function generateStaticParams() {
  return SHOP_EDITIONS.map((edition) => ({ slug: edition.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const edition = findEdition(slug);
  if (!edition) return { title: "Edition not found", robots: { index: false } };
  return {
    title: `${edition.title} — ${edition.subtitle}`,
    description: editionDescription(edition),
    alternates: { canonical: `/shop/${edition.slug}` },
    openGraph: {
      title: `${edition.title} — ${edition.subtitle}`,
      description: edition.outcome,
      url: `${SHOP_ORIGIN}/shop/${edition.slug}`,
      type: "website",
    },
  };
}

export default async function EditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const edition = findEdition(slug);
  if (!edition) notFound();
  const released = editionReleased(edition);
  const copy = editionPageCopy(edition);
  const available = Boolean(checkoutUrlForEdition(edition, process.env));
  const schema = productStructuredData(edition);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="shop-breadcrumb">
        <Link href="/shop">Editions</Link>
        <span aria-hidden="true">/</span>
        <span>{edition.title}</span>
      </div>
      <section className="shop-product">
        <div className="shop-product-main">
          <p className="shop-eyebrow">
            {edition.sku} / {edition.format}
          </p>
          <h1>
            {edition.title}
            <br />
            <em>{edition.subtitle}</em>
          </h1>
          <p className="shop-intro">{edition.outcome}</p>
          <p className="shop-product-description">
            {editionDescription(edition)}
          </p>
          <div
            className="shop-cover"
            aria-label={`${edition.title} edition cover${released ? "" : " preview"}`}
          >
            <span>Arcanea / Editions</span>
            <div>
              <p>{edition.title}</p>
              <em>{edition.subtitle}</em>
            </div>
            <span>
              {edition.sku} · {released ? "Edition" : "Preview specification"}
            </span>
          </div>
        </div>
        <aside className="shop-purchase" aria-label="Edition details">
          <p className="shop-eyebrow">
            {released ? "One-time edition" : "Offer preview"}
          </p>
          <div className="shop-price">
            €{edition.priceEur}
            <span>{released ? "one payment" : "proposed price"}</span>
          </div>
          <p className="shop-small">
            {released
              ? "The checkout shows your final price and applicable tax before payment."
              : "Final price, tax presentation and sale terms will be confirmed before sales open."}
          </p>
          <CheckoutAction
            slug={edition.slug}
            available={available}
            released={released}
            previewHref={edition.previewHref}
            previewNoun={copy.previewNoun}
          />
          <dl>
            <div>
              <dt>License</dt>
              <dd>
                {!released && "Proposed: "}
                {edition.license}
              </dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>
                {released
                  ? "Hosted download access after confirmed payment"
                  : copy.previewDelivery}
              </dd>
            </div>
            {copy.tools && (
              <div>
                <dt>Tools</dt>
                <dd>{copy.tools}</dd>
              </div>
            )}
          </dl>
          <Link href="/shop/delivery" className="shop-text-link">
            Read delivery & license details{" "}
          </Link>
        </aside>
      </section>
      <section className="shop-section shop-specification">
        <div>
          <p className="shop-eyebrow">The edition specification</p>
          <h2>
            What belongs <em>in the package.</em>
          </h2>
          <ul className="shop-contents">
            {edition.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Scope</h3>
          <ul className="shop-exclusions">
            {edition.excludes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="shop-small">
            {released
              ? "The contents of this edition match its versioned file manifest."
              : copy.previewScope}
          </p>
        </div>
      </section>
      {copy.rights && (
        <section className="shop-proof">
          <div className="shop-proof-number">
            Your world.
            <br />
            <em>Your authorship.</em>
          </div>
          <div>
            <h2>Keep what you create.</h2>
            <p>{copy.rights}</p>
            <Link href="/shop/sample" className="shop-text-link">
              Inspect the original example{" "}
            </Link>
          </div>
        </section>
      )}
      <div className="shop-next-edition">
        <Link href="/shop"> Explore all editions</Link>
        <Link
          href={
            edition.audience === "collectors"
              ? "/shop/collections/creators"
              : "/shop/collections/collectors"
          }
        >
          {edition.audience === "collectors"
            ? "Create a world of your own"
            : "Explore original art editions"}{" "}
        </Link>
      </div>
    </>
  );
}
