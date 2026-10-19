import type { Metadata } from "next";
import Link from "next/link";
import { SHOP_EDITIONS, editionReleased } from "@/lib/shop/catalog";

export const metadata: Metadata = {
  title: "Edition delivery and licenses",
  description:
    "Understand Arcanea edition previews, free sample access, proposed digital delivery and separate creator, art and software permissions.",
  alternates: { canonical: "/shop/delivery" },
};

export default function DeliveryPage() {
  const hasReleasedEdition = SHOP_EDITIONS.some(editionReleased);
  return (
    <article className="shop-reading">
      <p className="shop-eyebrow">Editions / Delivery & licenses</p>
      <h1>
        Know what
        <br />
        <em>you are keeping.</em>
      </h1>
      <p className="shop-intro">
        The free World Starter is available without an account. Each edition
        shows its release state, contents, price and license scope.
        {!hasReleasedEdition &&
          " Paid editions are previews and are not currently available for purchase."}
      </p>
      <h2>Free sample access</h2>
      <p>
        Download the Markdown or JSON files from the sample page. Keep a local
        copy and open it in your usual editor. The sample text and blank
        templates have an explicit adaptation permission included in the file.
      </p>
      <h2>Paid edition delivery</h2>
      <p>
        {hasReleasedEdition
          ? "Released editions use hosted checkout with file-download access after confirmed payment."
          : "The intended first payment route is hosted checkout with file-download access after confirmed payment."}{" "}
        Before sales open, each edition must have a complete file manifest,
        approved merchant and price, published sale terms, and a tested
        purchase, failed payment, delivery recovery and refund path.
      </p>
      <p>
        A browser return page does not establish payment or ownership. No
        receipt, paid download entitlement or card charge is created by
        exploring this shop.
      </p>
      <h2>Each material has its own permission</h2>
      <ul>
        <li>
          Individual creator editions are scoped to one creator using the kit
          for their own original work. The edition page marks preview terms.
        </li>
        <li>
          Studio editions are scoped to five named people in one organization.
          Public teaching, redistribution and sublicensing are outside that
          scope.
        </li>
        <li>
          Collector editions are scoped to personal display and reading.
          Commercial reproduction needs a separate permission.
        </li>
        <li>
          Software follows its actual repository license. That license does not
          automatically cover sample art, music, characters or trademarks.
        </li>
      </ul>
      <h2>Sale terms before payment</h2>
      <p>
        A released product must show its actual seller/contact information,
        contents, compatibility, total price and applicable tax, delivery
        arrangements, support and withdrawal/refund conditions. For immediate
        digital delivery, any applicable consent and acknowledgment must be
        captured in the actual checkout and confirmation, rather than inferred
        from a page visit.
      </p>
      <p>
        This page describes the release requirements. It is not a finalized
        sales contract or a blanket waiver of consumer rights.
      </p>
      <h2>Get a useful result now</h2>
      <p>
        Begin with the free worked example or inspect the edition specification.
        Existing Arcanea tools and public material keep their own availability
        and terms.
      </p>
      <Link href="/shop/sample" className="shop-button">
        Open the free starter
      </Link>
      <Link href="/contact" className="shop-text-link">
        Contact Arcanea
      </Link>
    </article>
  );
}
