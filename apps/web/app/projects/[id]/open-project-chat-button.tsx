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
