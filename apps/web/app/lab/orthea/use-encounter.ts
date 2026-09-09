"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  act,
  advance,
  createEncounter,
  exportProof,
  importProof,
  type EncounterAction,
} from "@/lib/encounters/orthea-engine.mjs";

export function useEncounter() {
  const [state, setState] = useState(createEncounter);
  const [live, setLive] = useState(false);
  const [fileStatus, setFileStatus] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const generation = useRef(0);
  const pendingFile = useRef<number | null>(null);
  const mounted = useRef(false);

  const stopTimer = useCallback(() => {
    if (timer.current !== null) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const pause = useCallback(() => {
    generation.current += 1;
    stopTimer();
    setLive(false);
  }, [stopTimer]);

  useEffect(() => {
    mounted.current = true;
    const onVisibility = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", pause);
    return () => {
      mounted.current = false;
      generation.current += 1;
      stopTimer();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", pause);
    };
  }, [pause, stopTimer]);

  useEffect(() => {
    if (live && !state.outcome) {
      timer.current = setInterval(() => {
        generation.current += 1;
        setState((current) => advance(current));
      }, 100);
    }
    return stopTimer;
  }, [live, state.outcome, stopTimer]);

  function perform(action: EncounterAction) {
    generation.current += 1;
    setState((current) => act(current, action));
  }

  function toggleLive() {
    if (live) pause();
    else {
      generation.current += 1;
      setLive(true);
    }
  }

  function step() {
    pause();
    setState((current) => advance(current, 1000));
  }

  function setExtendedCues(extendedCues: boolean) {
    generation.current += 1;
    setState((current) =>
      current.attack.stage === "windup" || current.outcome
        ? current
        : { ...current, extendedCues },
    );
  }

  function restart() {
    pause();
    setState((current) =>
      createEncounter({ extendedCues: current.extendedCues }),
    );
    setFileStatus(
      "A new playthrough has begun. Previously downloaded files are unchanged.",
    );
  }

  function download() {
    const blob = new Blob([exportProof(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "orthea-encounter-snapshot.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFileStatus(
      "Download requested. Keep the snapshot to reopen this state.",
    );
  }

  async function openSnapshot(file: File) {
    pause();
    const request = ++generation.current;
    pendingFile.current = request;
    setFileStatus("Opening the snapshot locally…");
    try {
      if (file.size > 32_768)
        throw new Error("Choose a snapshot smaller than 32 KiB.");
      const restored = importProof(await file.text());
      if (!mounted.current) return;
      if (generation.current !== request) {
        if (pendingFile.current === request) {
          setFileStatus(
            "Snapshot opening canceled because the encounter changed. Your current play is preserved.",
          );
        }
        return;
      }
      setState(restored);
      setFileStatus("Snapshot reopened locally. Time is paused.");
    } catch (error) {
      if (!mounted.current || generation.current !== request) return;
      setFileStatus(
        `Snapshot not opened: ${error instanceof Error ? error.message : "Invalid file."} Your current encounter is preserved.`,
      );
    } finally {
      if (pendingFile.current === request) pendingFile.current = null;
    }
  }

  return {
    state,
    live: live && !state.outcome,
    fileStatus,
    perform,
    toggleLive,
    step,
    setExtendedCues,
    restart,
    download,
    openSnapshot,
  };
}
