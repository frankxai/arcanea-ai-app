/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileShowcase } from "./profile-showcase";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Creator identity page — linked Custom GPTs, Suno profile, websites, agents, and on-chain identity. Verified, signed, portable.",
  openGraph: {
    title: "Profile",
    description:
      "Creator identity page — linked Custom GPTs, Suno profile, websites, agents, and on-chain identity.",
  },
  alternates: { canonical: "/profile" },
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  let user = null;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  } catch {
    // Supabase not configured — show showcase
  }

  if (user) redirect(`/profile/${user.id}`);

  // Unauthenticated: show the profile showcase (creator demo + sign-in CTA)
  return <ProfileShowcase />;
}
