"use client";

import {
  useMemo,
  useEffect,
  useCallback,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { readProviderPreferences } from "@/lib/ai/provider-preferences";
import { validateCustomerKey } from "@/lib/gateway/credential-policy.mjs";
import { createWorldHandoffSession } from "@/lib/chat/world-handoff";

const WORLD_BUILDER_PROMPT = [
  "You are a world-building assistant for Arcanea.",
  "Help the creator develop their own setting, its rules, cultures, characters and founding events.",
  "Keep each response focused on one area and distinguish your suggestions from the creator's decisions.",
  "Preserve their names and defining constraints. Do not insert official Arcanea mythology into an unrelated world.",
  "When enough material exists, suggest preparing a world draft using the button below.",
  "That action uses the creator's Google quota and opens an editable draft; it does not save or publish a world.",
  "Speak naturally. Do not generate JSON or claim that a world has been saved.",
].join("\n");

export function useChatWorldMode() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { credentialScope } = useAuth();
  const token = credentialScope.get();
  const [messageCount, setMessageCount] = useState(0);
  const [downloadError, setDownloadError] = useState<{
    token: typeof token;
    message: string;
  } | null>(null);
  const isWorldMode = searchParams.get("mode") === "world";
  const session = useMemo(
    () =>
      createWorldHandoffSession({
        actor: token.actor?.startsWith("user:") ? token.actor.slice(5) : null,
        isCurrent: () => credentialScope.isCurrent(token),
        storage: () => window.sessionStorage,
        customerKey: () => {
          if (!credentialScope.isCurrent(token)) return "";
          const key = readProviderPreferences(window.localStorage, token.actor)
            .keys.google;
          return key ? validateCustomerKey(key) : "";
        },
        fetch: (url, options) => fetch(url, options),
      }),
    [credentialScope, token],
  );
  const snapshot = useSyncExternalStore(
    session.subscribe,
    session.snapshot,
    session.snapshot,
  );
  useEffect(() => {
    if (isWorldMode) session.restore();
    return () => session.cancel();
  }, [session, isWorldMode]);
  const createWorld = useCallback(
    async (messages: Array<{ role: string; content: string }>) => {
      setDownloadError(null);
      await session.generate(messages);
    },
    [session],
  );
  const exportDraft = useCallback(() => {
    let url: string | null = null;
    try {
      const text = session.exportText();
      if (!text || !credentialScope.isCurrent(token)) return;
      url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = (snapshot.draft?.world.slug || "world") + "-draft.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDownloadError(null);
    } catch {
      if (credentialScope.isCurrent(token))
        setDownloadError({
          token,
          message:
            "The download did not start. Your draft is still here; retry download or transfer.",
        });
    } finally {
      if (url) {
        const captured = url;
        setTimeout(() => URL.revokeObjectURL(captured), 1000);
      }
    }
  }, [session, credentialScope, token, snapshot.draft]);
  return {
    ...snapshot,
    isWorldMode,
    worldPrompt: WORLD_BUILDER_PROMPT,
    canCreateWorld: isWorldMode && messageCount >= 2,
    createdSlug: null,
    createError:
      downloadError?.token === token ? downloadError.message : snapshot.error,
    updateCount: useCallback((count: number) => setMessageCount(count), []),
    createWorld,
    exportDraft,
    openDraft: () => {
      if (session.transfer()) router.push("/worlds/create?resume=1");
    },
    retryTransfer: session.transfer,
    cancelGeneration: session.cancel,
    startAnotherDraft: () => {
      if (
        !credentialScope.isCurrent(token) ||
        !window.confirm(
          "Start another world draft? Finish or export and clear the working draft in the world creator first. Its original source will remain in this tab.",
        )
      )
        return false;
      return session.startAnotherDraft();
    },
    allowAnotherAttempt: () => {
      if (
        credentialScope.isCurrent(token) &&
        window.confirm(
          "Google may already have used quota for the earlier request. Allow a new attempt that could use quota again?",
        )
      )
        session.allowAnotherAttempt();
    },
  };
}
