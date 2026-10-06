/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { usePromptBooksStore } from "@/lib/prompt-books/store";

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.collectionId as string;
  const { user, isLoading } = useAuth();
  const {
    setActiveCollection,
    _userId: storeOwner,
    _sessionVersion: version,
  } = usePromptBooksStore();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/prompt-books");
      return;
    }
    if (storeOwner !== user.id) return;
    if (collectionId) {
      setActiveCollection(collectionId);
      // Redirect to main page which reads activeCollectionId from store
      router.replace("/prompt-books");
    }
  }, [
    collectionId,
    setActiveCollection,
    router,
    isLoading,
    user,
    storeOwner,
    version,
  ]);

  return (
    <p role="status" className="p-6 text-text-secondary">
      Loading collection...
    </p>
  );
}
