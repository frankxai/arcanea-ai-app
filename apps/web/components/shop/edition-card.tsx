import Link from "next/link";
import { editionReleased, type ShopEdition } from "@/lib/shop/catalog";

export function EditionCard({
  edition,
  number,
}: {
  edition: ShopEdition;
  number: string;
}) {
  return (
    <Link className="shop-edition-card" href={`/shop/${edition.slug}`}>
      <div className="shop-card-top">
        <span>
          {number} / {edition.audience === "collectors" ? "Explore" : "Create"}
        </span>
      </div>
      <div className="shop-card-title">
        <h3>{edition.title}</h3>
        <p>{edition.subtitle}</p>
      </div>
      <p className="shop-card-description">{edition.outcome}</p>
      <div className="shop-card-bottom">
        <span>{edition.format}</span>
        <span>
          {editionReleased(edition) ? "" : "Proposed "}€{edition.priceEur}
        </span>
      </div>
    </Link>
  );
}
