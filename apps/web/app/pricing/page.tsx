import type { Metadata } from "next";
import { billingReadiness } from "@/lib/billing/catalog";
import { PricingClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing — Your keys are free. Continuity is what you pay for.",
  description:
    "Bring your own API keys and build for nothing, forever. Creator and Studio plans keep your world's memory alive and publish it under your name. Credits buy generation on Arcanea-managed keys. Export anytime, no lock-in.",
  openGraph: {
    title: "Arcanea Pricing — BYOK free, continuity paid",
    description:
      "Free on your own keys. Plans for hosted world memory and publishing. Credits for managed generation. Export anytime.",
    type: "website",
  },
  alternates: { canonical: "/pricing" },
};

export const dynamic = "force-dynamic";

export default function PricingPage() {
  const readiness = billingReadiness();
  return (
    <PricingClient
      billing={{
        live: readiness.live,
        packsReady: readiness.packsReady,
        sandbox: readiness.sandbox,
      }}
    />
  );
}
