"use client";

import { useEffect, useRef, useState } from "react";
import {
  FIRSTLIGHT_CHARACTERS,
  publishedFirstlightAsset,
} from "@/lib/visual-encyclopedia/firstlight-02";
import styles from "./firstlight-02.module.css";
import "@/public/firstlight-02/trial/firstlight-trial.css";

interface TrialModule {
  mountTrial: (
    target: HTMLElement,
    options?: {
      assetUrlFor?: (characterId: string, kind: string) => string | undefined;
    },
  ) => (() => void) | void;
}

export function CooperationTrial() {
  const target = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("Loading the local simulation…");
  useEffect(() => {
    let cancelled = false;
    let unmount: (() => void) | void;
    const modulePath = "/firstlight-02/trial/firstlight-trial.js";
    void import(/* webpackIgnore: true */ modulePath)
      .then((module: TrialModule) => {
        if (cancelled || !target.current) return;
        unmount = module.mountTrial(target.current, {
          assetUrlFor: (id, kind) => {
            const character = FIRSTLIGHT_CHARACTERS.find(
              (entry) => entry.id === id || entry.slug === id,
            );
            if (!character) return undefined;
            return (
              publishedFirstlightAsset(
                character,
                kind === "sheet" ? "sheet" : "hero",
              )?.url ?? undefined
            );
          },
        });
        setStatus("");
      })
      .catch(() => {
        if (!cancelled)
          setStatus(
            "The simulation could not load. Reload this page to try again. The character collection remains available above.",
          );
      });
    return () => {
      cancelled = true;
      unmount?.();
    };
  }, []);
  return (
    <div className={styles.trialFrame}>
      {status && <p role="status">{status}</p>}
      <div ref={target} />
    </div>
  );
}
