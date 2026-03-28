import { redirect } from 'next/navigation';

interface LuminorChatPageProps {
  params: Promise<{ luminorId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function resolvePrompt(
  searchParams: Record<string, string | string[] | undefined>,
): string | null {
  const prompt = searchParams.prompt;

  if (typeof prompt === 'string' && prompt.trim()) {
    return prompt;
  }

  if (Array.isArray(prompt) && prompt[0]?.trim()) {
    return prompt[0];
  }

  return null;
}

export default async function LuminorChatPage({
  params,
  searchParams,
}: LuminorChatPageProps) {
  const [{ luminorId }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({}),
  ]);

  const nextParams = new URLSearchParams();
  nextParams.set('luminor', luminorId);

  const prompt = resolvePrompt(resolvedSearchParams);
  if (prompt) {
    nextParams.set('prompt', prompt);
  }

  redirect(`/chat?${nextParams.toString()}`);
}
