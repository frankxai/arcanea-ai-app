import type { Metadata } from "next";
import { PricingClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "Creator plan proposals",
  description:
    "Review Arcanea’s proposed creator plans and register interest. Prices, features and availability remain under consideration.",
  openGraph: {
    title: "Creator plan proposals",
    description:
      "Review proposed creator plans and register interest while release and pricing decisions are made.",
    type: "website",
  },
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return <PricingClient />;
}
