"use client";

import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/client";
import { usePromptBooks } from "@/hooks/use-prompt-books";
import { usePromptBooksStore } from "@/lib/prompt-books/store";

export function PromptBooksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [client] = useState(createClient);
  usePromptBooks(client, user?.id ?? null);
  const owner = usePromptBooksStore((state) => state._userId);
  return (
    <div
      style={{ display: owner === (user?.id ?? null) ? "contents" : "none" }}
    >
      {children}
    </div>
  );
}
