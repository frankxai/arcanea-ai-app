/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createChatProjectStore } from "@/lib/chat/project-store";
import { useAuth } from "@/lib/auth/context";

interface OpenProjectChatButtonProps {
  projectId: string;
}

export function OpenProjectChatButton({
  projectId,
}: OpenProjectChatButtonProps) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  return (
    <Button
      variant="creation"
      disabled={authLoading}
      onClick={() => {
        if (authLoading) return;
        createChatProjectStore(user?.id ?? null).setActiveChatProject(
          projectId,
        );
        router.push("/chat");
      }}
    >
      Open In Chat
    </Button>
  );
}
