(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  $$("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      $$("[data-filter]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === button)),
      );
      let count = 0;
      $$("[data-category]").forEach((card) => {
        card.hidden =
          button.dataset.filter !== "all" &&
          card.dataset.category !== button.dataset.filter;
        if (!card.hidden) count++;
      });
      $("[data-filter-status]").textContent = `${count} starters shown`;
    }),
  );

  const steps = document.body.classList.contains("template-open-model")
    ? [
        "Intended use: describe the tasks this model was designed to support. This template includes no model.",
        "Evaluation: cite the dataset, version, test method and reproducible results. This example supplies no benchmark scores.",
        "Limitations: document failure cases, excluded uses, training-data uncertainty and license conditions. Verify them for your actual release.",
      ]
    : [
        "Question: does showing a source make a generated answer easier to inspect? This page demonstrates the interface only.",
        "Evidence: the example connects a question to a note and a review step. These are fixed fixtures, not a retrieval system or research findings.",
        "Review: attach the real source, record contradictory evidence, and report uncertainty. A diagram alone does not validate an answer.",
      ];
  $$("[data-step]").forEach((button) =>
    button.addEventListener("click", () => {
      $$("[data-step]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === button)),
      );
      $("[data-experiment]").textContent = steps[Number(button.dataset.step)];
    }),
  );

  let exported = "";
  const form = $("[data-builder]");
  if (form) {
    const input = $("#idea");
    const count = () => {
      $("[data-count]").textContent = `${input.value.length}/600`;
      input.setCustomValidity("");
    };
    input.addEventListener("input", count);
    count();
    const updateExport = () => {
      exported = $$("[data-result] p")
        .map((p) => p.textContent)
        .join("\n\n");
    };
    updateExport();
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value.trim().replace(/\s+/g, " ");
      if (!value) {
        input.setCustomValidity("Write a short idea to begin.");
        input.reportValidity();
        return;
      }
      const plan = form.dataset.mode === "plan";
      const rows = plan
        ? [
            ["Prepare", `Define an audience and a success check for: ${value}`],
            [
              "Create",
              "Build the smallest useful artifact. Keep its source editable and mark assumptions.",
            ],
            [
              "Verify",
              "Inspect the output, check every interaction and record what remains unverified.",
            ],
          ]
        : [
            ["Intent", value],
            [
              "Direction",
              "Choose one audience, one useful artifact and one clear invitation. Keep the language specific.",
            ],
            [
              "First step",
              "Make a small version, show it to someone it is for, then revise from their response.",
            ],
          ];
      const result = $("[data-result]");
      result.replaceChildren();
      rows.forEach(([heading, text], i) => {
        const p = document.createElement("p");
        const label = document.createElement("span");
        label.textContent = `0${i + 1} / ${heading}`;
        p.append(label, document.createTextNode(text));
        result.append(p);
      });
      exported = rows
        .map(([heading, text]) => `## ${heading}\n${text}`)
        .join("\n\n");
      $("[data-result-state]").textContent = "Formatted locally";
      $("[data-builder-status]").textContent =
        "Ready to copy. No model was called and no text was sent.";
    });
    $("[data-copy-result]").addEventListener("click", async () => {
      try {
        if (!navigator.clipboard?.writeText)
          throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(exported);
        $("[data-builder-status]").textContent =
          "Markdown copied to your clipboard.";
      } catch {
        const blob = new Blob([exported], {
          type: "text/markdown;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "creator-draft.md";
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        $("[data-builder-status]").textContent =
          "Clipboard unavailable. A Markdown download was requested instead.";
      }
    });
  }

  let audioContext,
    active = null,
    playing = -1,
    playToken = 0,
    endTimer;
  const audioStatus = (message) => {
    const node = $("[data-audio-status]");
    if (node) node.textContent = message;
  };
  const setPlaying = (index) =>
    $$("[data-audio]").forEach((button) => {
      const on = Number(button.dataset.audio) === index;
      button.setAttribute("aria-pressed", String(on));
      button
        .querySelector("svg path")
        ?.setAttribute("d", on ? "M8 8h8v8H8z" : "m9 5 11 7-11 7z");
      button.setAttribute(
        "aria-label",
        `${on ? "Stop" : "Play"} ${button.dataset.name} synthesized demo`,
      );
    });
  const stop = () => {
    playToken++;
    clearTimeout(endTimer);
    if (active) {
      active.onended = null;
      try {
        active.stop();
      } catch {}
      active.disconnect();
      active = null;
    }
    playing = -1;
    setPlaying(-1);
    document.body.classList.remove("is-playing");
  };
  $$("[data-audio]").forEach((button) =>
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.audio);
      const same = playing === index;
      stop();
      if (same) {
        audioStatus("Playback stopped.");
        audioContext?.suspend().catch(() => {});
        return;
      }
      const token = playToken;
      try {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) throw new Error("Web Audio unavailable");
        audioContext ||= new Audio();
        await audioContext.resume();
        if (token !== playToken) return;
        const rate = audioContext.sampleRate,
          seconds = 8,
          buffer = audioContext.createBuffer(1, rate * seconds, rate),
          data = buffer.getChannelData(0);
        const notes = [
          [130.81, 164.81, 196, 164.81],
          [220, 261.63, 329.63, 293.66],
          [65.41, 98, 82.41, 73.42],
        ][index];
        for (let i = 0; i < data.length; i++) {
          const time = i / rate,
            beat = time % 0.5,
            note = notes[Math.floor(time / 0.5) % notes.length];
          const fade = Math.min(time / 0.05, 1, (seconds - time) / 0.3),
            envelope = Math.exp(-beat * 7) * Math.min(beat / 0.015, 1);
          const tone =
            Math.sin(2 * Math.PI * note * time) +
            0.25 * Math.sin(2 * Math.PI * note * 2 * time);
          const bass = Math.sin(((2 * Math.PI * notes[0]) / 2) * time) * 0.2;
          data[i] = (tone * envelope + bass) * 0.12 * Math.max(0, fade);
        }
        active = audioContext.createBufferSource();
        active.buffer = buffer;
        active.connect(audioContext.destination);
        active.start();
        playing = index;
        setPlaying(index);
        document.body.classList.add("is-playing");
        audioStatus(
          `Playing ${button.dataset.name}. Original synthesized demo, 8 seconds.`,
        );
        endTimer = setTimeout(() => {
          stop();
          audioStatus("Sketch finished. Choose another sound to explore.");
          audioContext?.suspend().catch(() => {});
        }, seconds * 1000);
      } catch {
        stop();
        audioStatus(
          "Audio could not start in this browser. The track notes remain available.",
        );
      }
    }),
  );
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
      audioStatus("Playback paused while this page is hidden.");
      audioContext?.suspend().catch(() => {});
    }
  });
  window.addEventListener("pagehide", () => {
    stop();
    audioContext?.close().catch(() => {});
  });
})();
