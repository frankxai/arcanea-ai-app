/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { setActiveChatProject } from '@/lib/chat/project-store';

interface OpenProjectChatButtonProps {
  projectId: string;
}

export function OpenProjectChatButton({ projectId }: OpenProjectChatButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="creation"
      onClick={() => {
        setActiveChatProject(projectId);
        router.push('/chat');
      }}
    >
      Open In Chat
    </Button>
  );
}
