"use client";

import Link from "next/link";
import { useState } from "react";

export function CheckoutAction({
  slug,
  available,
  previewHref,
}: {
  slug: string;
  available: boolean;
  previewHref: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function checkout() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data: unknown = await response.json();
      if (
        !response.ok ||
        !data ||
        typeof data !== "object" ||
        !("url" in data) ||
        typeof data.url !== "string"
      ) {
        throw new Error(
          "Checkout is unavailable. Your card has not been charged.",
        );
      }
      const url = new URL(data.url);
      if (
        url.origin !== "https://buy.polar.sh" ||
        url.username ||
        url.password ||
        url.hash ||
        url.search
      ) {
        throw new Error(
          "The checkout link could not be verified. Your card has not been charged.",
        );
      }
      window.location.assign(url.href);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Checkout could not be opened.",
      );
      setBusy(false);
    }
  }
  return (
    <div className="shop-action">
      {available ? (
        <button className="shop-button" onClick={checkout} disabled={busy}>
          {busy ? "Opening checkout…" : "Continue to secure checkout"}
        </button>
      ) : (
        <Link className="shop-button" href={previewHref}>
          Explore the sample{" "}
        </Link>
      )}
      {!available && (
        <p className="shop-small">Preview edition. Sales are not open.</p>
      )}
      {error && (
        <p role="alert" className="shop-small">
          {error}
        </p>
      )}
    </div>
  );
}
