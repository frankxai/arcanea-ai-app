import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ACTION_COSTS,
  CREDIT_PACKS,
  ENTITLEMENTS,
  billingReadiness,
  getPlan,
} from "@/lib/billing/catalog";
import {
  BillingError,
  getAccount,
  type BillingAccount,
} from "@/lib/billing/ledger";
import { BillingActions } from "./billing-actions";

export const metadata: Metadata = {
  title: "Billing",
  description: "Your plan, credits and invoices.",
  alternates: { canonical: "/settings/billing" },
};

export const dynamic = "force-dynamic";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; sku?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent("/settings/billing")}`);
  }

  const params = await searchParams;
  const readiness = billingReadiness();

  let account: BillingAccount | null = null;
  let ledgerError: string | null = null;
  try {
    account = await getAccount(user.id);
  } catch (error) {
    ledgerError =
      error instanceof BillingError
        ? "The credit ledger is not reachable right now. Your plan and balance will appear once it is."
        : "Billing could not be loaded.";
  }

  const plan = account ? getPlan(account.plan) : null;
  const entitlements = account ? ENTITLEMENTS[account.plan] : null;

  return (
    <main className="mx-auto max-w-3xl px-6 pt-16 pb-24 text-white">
      <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">
        Settings
      </p>
      <h1 className="font-display text-3xl font-bold tracking-tight mb-8">
        Billing
      </h1>

      {params.checkout === "success" && (
        <div className="mb-8 rounded-2xl border border-green-500/25 bg-green-500/5 p-5 text-sm">
          <p className="font-semibold">Thank you.</p>
          <p className="text-white/60 text-xs mt-1">
            Your {params.sku ? `${params.sku} ` : ""}purchase is being
            confirmed. Credits and plan changes appear here within a minute of
            the payment clearing.
          </p>
        </div>
      )}

      {ledgerError && (
        <div className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 text-xs text-amber-200/80">
          {ledgerError}
        </div>
      )}

      {account && (
        <section className="grid sm:grid-cols-3 gap-4 mb-10">
          <Stat
            label="Plan"
            value={plan?.name ?? account.plan}
            sub={
              account.planStatus === "none"
                ? "free"
                : account.planStatus.replace("_", " ")
            }
          />
          <Stat
            label="Credits"
            value={account.balance.toLocaleString("en-US")}
            sub={
              account.reserved > 0
                ? `${account.reserved} in flight`
                : "available"
            }
          />
          <Stat
            label="Renews"
            value={
              account.currentPeriodEnd
                ? new Date(account.currentPeriodEnd).toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "short" },
                  )
                : "—"
            }
            sub={
              account.cancelAtPeriodEnd
                ? "cancels at period end"
                : plan && plan.monthlyCredits > 0
                  ? `+${plan.monthlyCredits.toLocaleString("en-US")} credits`
                  : "no subscription"
            }
          />
        </section>
      )}

      <BillingActions
        live={readiness.live}
        hasSubscription={Boolean(account?.polarSubscriptionId)}
        packs={CREDIT_PACKS.filter((p) =>
          readiness.packsReady.includes(p.id),
        ).map((p) => ({
          id: p.id,
          credits: p.credits,
          priceCents: p.priceCents,
        }))}
      />

      {entitlements && (
        <section className="mt-12">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-4">
            What your plan includes
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs text-white/70">
            <li>Hosted worlds: {entitlements.hostedWorlds}</li>
            <li>Published world sites: {entitlements.publishedSites}</li>
            <li>Seats: {entitlements.seats}</li>
            <li>API keys: {entitlements.apiKeys ? "yes" : "no"}</li>
            <li>
              Hosted MCP write tools:{" "}
              {entitlements.hostedMcpWrite ? "yes" : "no"}
            </li>
            <li>Priority queue: {entitlements.priorityQueue ? "yes" : "no"}</li>
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-4">
          Credit costs on Arcanea keys
        </h2>
        <ul className="divide-y divide-white/[0.05] rounded-2xl border border-white/[0.06] bg-white/[0.015] px-5">
          {ACTION_COSTS.filter((a) => a.credits > 0).map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between py-2.5 text-xs"
            >
              <span className="text-white/70">{a.label}</span>
              <span className="font-mono text-white/90">
                {a.credits} <span className="text-white/35">/ {a.unit}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-white/40 mt-3">
          Anything you run on your own API key costs zero credits. Manage keys
          under{" "}
          <Link
            href="/settings/providers"
            className="underline underline-offset-2 hover:text-white/70"
          >
            Providers
          </Link>
          .
        </p>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
      <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p className="font-display text-2xl font-bold mt-2">{value}</p>
      <p className="text-[11px] text-white/45 mt-1 capitalize">{sub}</p>
    </div>
  );
}
