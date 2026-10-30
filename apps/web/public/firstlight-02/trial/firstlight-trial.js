import {
  ACTIONS,
  createTrial,
  act,
  availableActions,
  compareHarnesses,
} from "./trial-engine.mjs";

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

/**
 * Mount the local collaboration trial. Call the returned function on unmount.
 * assetUrlFor receives a lowercase character ID and `hero`; return an immutable
 * published rendition URL or null. No storage access happens inside this module.
 */
export function mountTrial(container, { assetUrlFor = () => null } = {}) {
  if (!(container instanceof HTMLElement))
    throw new TypeError("A trial needs a DOM container.");
  let state = createTrial();
  let sequence = 0;
  let feedback = "Choose Seli to begin the crossing.";
  let comparison = null;
  let disposed = false;
  container.classList.add("firstlight-trial");

  function button(label, className, handler) {
    const node = el("button", className, label);
    node.type = "button";
    node.addEventListener("click", handler);
    return node;
  }

  function downloadReport() {
    const report = {
      simulation: true,
      run: state,
      comparison,
      exportedAt: new Date().toISOString(),
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }),
    );
    const link = el("a");
    link.href = url;
    link.download = `arcanea-trial-${state.seed}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function dispatch(kind) {
    const result = act(state, { kind, requestId: `player-${++sequence}` });
    state = result.state;
    feedback = result.message;
    render();
    const nextAction = container.querySelector('[data-next="true"]');
    if (nextAction) nextAction.focus({ preventScroll: true });
    else
      container.querySelector(".ft-feedback")?.focus({ preventScroll: true });
  }

  function renderComparison() {
    const panel = el("section", "ft-comparison");
    panel.setAttribute("aria-label", "Fixed-budget contract comparison");
    panel.tabIndex = -1;
    panel.append(
      el(
        "h4",
        "ft-section-label",
        "One contract changes. The world stays fixed.",
      ),
    );
    const context = el(
      "p",
      "ft-note",
      `Same seed ${comparison.fixed.seed}, ${comparison.fixed.budget} light, controller and severed-source fixture. Only the handoff policy changes.`,
    );
    panel.append(context);
    const table = el("table", "ft-table");
    const caption = el(
      "caption",
      "ft-sr-only",
      "Scripted local comparison, not an agent benchmark",
    );
    const head = el("thead");
    const headRow = el("tr");
    for (const text of ["Contract", "Evidence", "Light spent", "Recovery"]) {
      const th = el("th", null, text);
      th.scope = "col";
      headRow.append(th);
    }
    head.append(headRow);
    const body = el("tbody");
    for (const [name, run] of [
      ["Loose handoff", comparison.baseline],
      ["Sealed handoff", comparison.sealed],
    ]) {
      const row = el("tr");
      const title = el("th", null, name);
      title.scope = "row";
      row.append(
        title,
        el(
          "td",
          null,
          run.status === "accepted"
            ? "Accepted by Velis"
            : run.status === "rejected"
              ? "Rejected by Velis"
              : "Budget blocked",
        ),
        el("td", null, `${run.spent} / ${run.budget}`),
        el("td", null, `${run.repairAttempts} of 1`),
      );
      body.append(row);
    }
    table.append(caption, head, body);
    const wrap = el("div", "ft-table-wrap");
    wrap.append(table);
    panel.append(
      wrap,
      el(
        "p",
        "ft-note",
        "A scripted local test shows why an independently checked delivery contract matters. It measures no models, real agents or business outcomes.",
      ),
    );
    return panel;
  }

  function render() {
    if (disposed) return;
    const root = el("div", "ft-shell");
    const heading = el("header", "ft-heading");
    const intro = el("div");
    intro.append(
      el("p", "ft-kicker", "Playable trial · local simulation"),
      el("h3", "ft-title", "The Severed Crossing"),
      el(
        "p",
        "ft-intro",
        "Kethr has cut one thread in the team’s handoff. Carry a verified lantern through the pass before the shared light runs out.",
      ),
    );
    const reserve = el("div", "ft-reserve");
    reserve.append(
      el("span", "ft-note", "Shared light"),
      el(
        "strong",
        "ft-reserve-number",
        `${state.budget - state.spent} / ${state.budget}`,
      ),
    );
    heading.append(intro, reserve);
    root.append(heading);

    const stage = el("div", "ft-stage");
    stage.dataset.state = state.status;
    const sceneCharacter = state.status === "accepted" ? "pelora" : "kethr";
    const sceneUrl = assetUrlFor(sceneCharacter, "hero");
    if (sceneUrl) {
      const scene = el("img", "ft-scene");
      scene.src = sceneUrl;
      scene.alt =
        state.status === "accepted"
          ? "Pelora shelters the crossing after the verified light is restored."
          : "Kethr stands across the expedition’s route.";
      scene.width = 1280;
      scene.height = 720;
      scene.loading = "lazy";
      scene.decoding = "async";
      stage.append(scene);
    }
    const sceneCopy = el("div", "ft-scene-copy");
    sceneCopy.append(
      el(
        "span",
        "ft-kicker",
        state.status === "accepted" ? "The tideway opens" : "Kethr’s pass",
      ),
      el(
        "p",
        "ft-scene-line",
        state.status === "accepted"
          ? "The signal holds because every thread can be traced."
          : "No companion can finish the crossing alone.",
      ),
    );
    stage.append(sceneCopy);
    root.append(stage);

    const controls = el("div", "ft-controls");
    const policyLabel = el("label", "ft-policy");
    policyLabel.append(el("span", null, "Delivery contract"));
    const policy = el("select", "ft-select");
    for (const [value, label] of [
      ["sealed", "Sealed · source checked"],
      ["loose", "Loose · name only"],
    ]) {
      const option = el("option", null, label);
      option.value = value;
      policy.append(option);
    }
    policy.value = state.handoffPolicy;
    policy.disabled = state.completed.length > 0;
    policy.addEventListener("change", () => {
      state = createTrial({ handoffPolicy: policy.value });
      sequence = 0;
      feedback = "Contract selected. The seed and budget stay fixed.";
      render();
      container.querySelector(".ft-select")?.focus({ preventScroll: true });
    });
    policyLabel.append(policy);
    controls.append(
      policyLabel,
      button("Restart crossing", "ft-button ft-button-secondary", () => {
        state = createTrial({ handoffPolicy: state.handoffPolicy });
        sequence = 0;
        feedback = "Crossing reset. Same seed, same shared light.";
        render();
        container
          .querySelector('[data-next="true"]')
          ?.focus({ preventScroll: true });
      }),
    );
    root.append(controls);

    const available = availableActions(state);
    const actions = el("ol", "ft-actions");
    const visibleActions = ACTIONS.filter(
      (action) => action.kind !== "repair" || state.detectedFault,
    );
    for (const action of visibleActions) {
      const li = el("li", "ft-action");
      const completed = state.completed.includes(action.kind);
      const ready = available.some(
        (candidate) => candidate.kind === action.kind,
      );
      const affordable = state.spent + action.cost <= state.budget;
      li.dataset.complete = String(completed);
      const control = button("", "ft-action-button", () =>
        dispatch(action.kind),
      );
      control.disabled = completed || !ready || !affordable;
      control.dataset.next = String(
        ready && affordable && action.kind === available[0]?.kind,
      );
      control.append(
        el("span", "ft-action-name", action.role),
        el("span", "ft-action-verb", action.name),
        el(
          "span",
          "ft-action-cost",
          completed ? "Complete" : `${action.cost} light`,
        ),
      );
      if (completed)
        control.setAttribute(
          "aria-label",
          `${action.role}: ${action.name}, complete`,
        );
      li.append(control);
      actions.append(li);
    }
    root.append(actions);

    const status = el("p", "ft-feedback", feedback);
    status.setAttribute("aria-live", "polite");
    status.setAttribute("role", "status");
    status.tabIndex = -1;
    root.append(status);
    if (
      available.length > 0 &&
      available.every((action) => state.spent + action.cost > state.budget)
    )
      root.append(
        el(
          "p",
          "ft-note",
          "The team has exhausted its usable reserve. Restart the crossing to try another contract.",
        ),
      );

    const tools = el("div", "ft-tools");
    tools.append(
      button("Compare both contracts", "ft-button ft-button-primary", () => {
        comparison = compareHarnesses({
          seed: state.seed,
          budget: state.budget,
        });
        render();
        container
          .querySelector(".ft-comparison")
          ?.focus({ preventScroll: true });
        container
          .querySelector(".ft-comparison")
          ?.scrollIntoView({ block: "nearest", behavior: "auto" });
      }),
      button(
        "Export evidence",
        "ft-button ft-button-secondary",
        downloadReport,
      ),
    );
    root.append(tools);
    if (comparison) root.append(renderComparison());

    const journal = el("details", "ft-journal");
    journal.append(el("summary", null, "Read the expedition journal"));
    const entries = el("ol", "ft-log");
    for (const entry of state.log) {
      const item = el("li");
      item.append(
        el("strong", null, `${entry.role}. `),
        document.createTextNode(entry.message),
      );
      entries.append(item);
    }
    journal.append(entries);
    root.append(
      journal,
      el(
        "p",
        "ft-note ft-boundary",
        "This trial runs only in your browser. Character abilities grant no tool access. A production mission needs scoped permissions, immutable artifacts and independently recorded acceptance.",
      ),
    );
    container.replaceChildren(root);
  }

  render();
  return () => {
    disposed = true;
    container.replaceChildren();
    container.classList.remove("firstlight-trial");
  };
}
