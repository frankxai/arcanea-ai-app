import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SHOP_EDITIONS } from "@/lib/shop/catalog";
import { EditionCard } from "@/components/shop/edition-card";

export const metadata: Metadata = {
  title: "Shop — worldbuilding kits and original editions",
  description:
    "Explore Arcanea's original art editions and worldbuilding production kits. Inspect a free worked example, editable templates and proposed individual or studio editions.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Arcanea Editions",
    description: "Enter a world worth exploring. Create one of your own.",
    url: "https://www.arcanea.ai/shop",
    type: "website",
  },
};

export default function ShopPage() {
  return (
    <>
      <section className="shop-hero">
        <div className="shop-hero-copy">
          <p className="shop-eyebrow">The first collection / Preview</p>
          <h1>
            Worlds worth
            <br />
            entering.
            <br />
            <em>Make one yours.</em>
          </h1>
          <p className="shop-intro">
            Art to live with. Stories to carry. A production method for the
            world only you can create.
          </p>
          <div className="shop-inline-actions">
            <Link href="/shop/sample" className="shop-button">
              Start with the free edition{" "}
            </Link>
            <a href="#editions" className="shop-text-link">
              Explore the collection
            </a>
          </div>
          <div className="shop-hero-note">
            <span>01</span>
            <p>
              Begin with a finished scene and an editable world brief. Keep your
              work. Choose your tools.
            </p>
          </div>
        </div>
        <figure className="shop-hero-art">
          <Image
            src="/images/sovereign-depths/b03.webp"
            alt="A vast luminous sea creature passes through the arches of a submerged city."
            fill
            sizes="(max-width: 760px) 100vw, 48vw"
            priority
          />
          <figcaption>
            <span>From the Arcanea gallery</span>
            <Link href="/lore/sovereign-depths">Explore Sovereign Depths </Link>
          </figcaption>
        </figure>
      </section>
      <section id="editions" className="shop-section">
        <div className="shop-section-heading">
          <div>
            <p className="shop-eyebrow">A small catalog, with a purpose</p>
            <h2>
              Explore. Create. <em>Carry it forward.</em>
            </h2>
          </div>
          <p>
            Each edition has a defined audience, contents and license. These are
            previews with proposed prices; the free sample is available now.
          </p>
        </div>
        <div className="shop-editions-grid">
          {SHOP_EDITIONS.map((edition, i) => (
            <EditionCard
              key={edition.slug}
              edition={edition}
              number={String(i + 1).padStart(2, "0")}
            />
          ))}
        </div>
      </section>
      <section className="shop-proof">
        <div className="shop-proof-number">
          The work
          <br />
          <em>before the promise.</em>
        </div>
        <div>
          <h2>Read the scene. Inspect the method.</h2>
          <p>
            The free World Starter contains an original example world, a scene
            that makes its central rule visible, and editable materials to adapt
            for your own project.
          </p>
          <Link href="/shop/sample" className="shop-text-link">
            Open the World Starter{" "}
          </Link>
        </div>
      </section>
      <section className="shop-section shop-field-notes">
        <p className="shop-eyebrow">Field notes</p>
        <h2>
          Give the imagination <em>something to stand on.</em>
        </h2>
        <div className="shop-guide-row">
          <Link href="/shop/guides/worldbuilding-bible">
            <span>01 / Worldbuilding</span>
            <h3>A world bible that earns its pages.</h3>
            <p>
              Start with a rule, a cost and a scene. Add only what the story
              needs.
            </p>
            <span className="shop-text-link">Read the field note </span>
          </Link>
          <Link href="/shop/guides/visual-continuity">
            <span>02 / Art direction</span>
            <h3>Keep a character recognizable.</h3>
            <p>
              Use reference sheets and review decisions across images, scenes
              and tools.
            </p>
            <span className="shop-text-link">Read the field note </span>
          </Link>
        </div>
      </section>
    </>
  );
}
