import Link from "next/link";
import type { ReactNode } from "react";
import "./product.css";
import "./shop.css";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="arc-shop">
      <div className="shop-topline">
        <Link href="/shop" className="shop-wordmark">
          Arcanea <span> / Editions</span>
        </Link>
        <nav aria-label="Shop navigation">
          <Link href="/shop/collections/creators">Creator kits</Link>
          <Link href="/shop/collections/collectors">Art editions</Link>
          <Link href="/shop/guides/worldbuilding-bible">Field notes</Link>
        </nav>
      </div>
      {children}
      <div className="shop-colophon">
        <p>Original worlds. Portable work. A clear place for each.</p>
        <div>
          <Link href="/shop/sample">Free sample</Link>
          <Link href="/shop/delivery">Delivery & licenses</Link>
          <Link href="/worlds">Worlds</Link>
        </div>
      </div>
    </div>
  );
}
