(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const search = $("[data-search]");
  if (search) {
    const params = new URLSearchParams(location.search);
    let category = ["music", "labs", "tools"].includes(params.get("category"))
      ? params.get("category")
      : "all";
    search.value = (params.get("q") || "").slice(0, 100);
    const filter = (persist = true) => {
      const query = search.value.trim().toLowerCase();
      $$("[data-filter]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.filter === category)),
      );
      let count = 0;
      $$("[data-category]").forEach((card) => {
        card.hidden =
          (category !== "all" && card.dataset.category !== category) ||
          !card.dataset.searchText.includes(query);
        if (!card.hidden) count++;
      });
      $("[data-filter-status]").textContent =
        `${count} ${count === 1 ? "starter" : "starters"} shown`;
      $("[data-empty]").hidden = count !== 0;
      if (persist) {
        const url = new URL(location.href);
        category === "all"
          ? url.searchParams.delete("category")
          : url.searchParams.set("category", category);
        query
          ? url.searchParams.set("q", search.value.trim())
          : url.searchParams.delete("q");
        try {
          history.replaceState(null, "", url);
        } catch {
          /* file URLs can refuse history updates */
        }
      }
    };
    $$("[data-filter]").forEach((button) =>
      button.addEventListener("click", () => {
        category = button.dataset.filter;
        filter();
      }),
    );
    search.addEventListener("input", () => filter());
    $("[data-reset-search]").addEventListener("click", () => {
      category = "all";
      search.value = "";
      filter();
      search.focus();
    });
    filter(false);
  }

  async function copyText(text, status, filename) {
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      status.textContent = "Copied to your clipboard.";
    } catch {
      const url = URL.createObjectURL(
        new Blob([text], { type: "text/plain;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent =
        "Clipboard unavailable. A file download was requested instead.";
    }
  }
  $$("[data-copy-brief]").forEach((button) =>
    button.addEventListener("click", () =>
      copyText(
        button.dataset.prompt,
        button.closest("article").querySelector("[data-copy-status]"),
        "v0-prompt.txt",
      ),
    ),
  );
  $("[data-copy-paper]")?.addEventListener("click", () =>
    copyText(
      "# Research outline\n\n## Question\nWhat would let a reader check the claim?\n\n## Method\nDefine the task, source versions and protocol.\n\n## Evidence\nAttach real artifacts. No empirical results are supplied by this template.\n\n## Limitations\nRecord failures, uncertainty and open questions.\n",
      $("[data-paper-status]"),
      "research-outline.md",
    ),
  );

  const jsonForm = $("[data-json-form]");
  if (jsonForm) {
    const input = $("#json-input"),
      output = $("[data-json-output]"),
      status = $("[data-json-status]");
    const example = input.value;
    let formatted = output.textContent;
    const copy = $("[data-copy-json]");
    const markStale = () => {
      copy.disabled = true;
      $("[data-json-state]").textContent = "Input changed";
      status.textContent = "Validate the edited input to update the output.";
      input.removeAttribute("aria-invalid");
    };
    input.addEventListener("input", markStale);
    jsonForm.addEventListener("submit", (event) => {
      event.preventDefault();
      try {
        if (input.value.length > 8000)
          throw new Error("Input exceeds 8,000 characters.");
        formatted = JSON.stringify(JSON.parse(input.value), null, 2);
        output.textContent = formatted;
        input.removeAttribute("aria-invalid");
        $("[data-json-state]").textContent = "Valid JSON";
        status.textContent =
          "Valid JSON syntax. No schema check, API request or model call was made.";
        copy.disabled = false;
      } catch {
        formatted = "";
        output.textContent =
          "No formatted output. Fix the request and validate again.";
        input.setAttribute("aria-invalid", "true");
        input.setAttribute("aria-describedby", "json-feedback");
        status.id = "json-feedback";
        $("[data-json-state]").textContent = "Check the input";
        status.textContent =
          "Invalid JSON. Check double quotes, commas and matching brackets. Your input is preserved.";
        copy.disabled = true;
      }
    });
    $("[data-json-example]").addEventListener("click", () => {
      input.value = example;
      markStale();
      input.focus();
    });
    copy.addEventListener("click", () => {
      if (!copy.disabled) copyText(formatted, status, "request.json");
    });
  }

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
    $("[data-copy-result]").addEventListener("click", () =>
      copyText(exported, $("[data-builder-status]"), "creator-draft.md"),
    );
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
