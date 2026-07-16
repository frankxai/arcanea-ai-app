import type { Metadata } from "next";
import { PricingClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing — Sovereign by Default, SaaS by Choice",
  description:
    "Arcanea is BYOK-first. Your API keys stay in your browser. Your creations stay yours. Export anytime. No vendor lock-in. 27 open source repos you can fork.",
  openGraph: {
    title: "Pricing — Sovereign by Default, SaaS by Choice",
    description:
      "BYOK. Own your keys, IP, and data. Forge custom Luminors. Build worlds. Export anytime.",
    type: "website",
  },
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return <PricingClient />;
}
