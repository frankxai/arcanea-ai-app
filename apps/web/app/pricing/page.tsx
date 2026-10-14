import type { Metadata } from "next";
import { billingReadiness } from "@/lib/billing/catalog";
import { PricingClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing — Your keys are free. Continuity is what you pay for.",
  description:
    "Explore free BYOK chat and worlds. Creator and Studio plans, hosted memory, publishing and managed generation are planned. Join the release list for availability updates.",
  openGraph: {
    title: "Arcanea Pricing — BYOK free, continuity paid",
    description:
      "Free BYOK chat and worlds. Planned paid plans for hosted memory and publishing. Join the release list for availability updates.",
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
