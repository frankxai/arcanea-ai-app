'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ChatCircleDots } from '@/lib/phosphor-icons';
import { Button, type ButtonProps } from '@/components/ui/button';
import { setActiveChatProject } from '@/lib/chat/project-store';

interface OpenProjectChatButtonProps {
  projectId: string;
  children?: ReactNode;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
}

export function OpenProjectChatButton({
  projectId,
  children,
  variant = 'creation',
  size = 'default',
  className,
}: OpenProjectChatButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        setActiveChatProject(projectId);
        router.push('/chat');
      }}
    >
      {children ?? (
        <>
          <ChatCircleDots size={16} />
          Open in chat
        </>
      )}
    </Button>
  );
}
