import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileShowcase } from "./profile-showcase";

export const metadata: Metadata = {
  title: "Profile — Arcanea",
  description:
    "Creator identity page — linked Custom GPTs, Suno profile, websites, agents, and on-chain identity. Verified, signed, portable.",
  openGraph: {
    title: "Profile — Arcanea",
    description:
      "Creator identity page — linked Custom GPTs, Suno profile, websites, agents, and on-chain identity.",
  },
  alternates: { canonical: "/profile" },
};

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
