import { redirect } from "next/navigation";

interface BestiarySlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BestiarySlugPage({ params }: BestiarySlugPageProps) {
  const { slug } = await params;
  redirect(`/atlas/creatures/${slug}`);
}
