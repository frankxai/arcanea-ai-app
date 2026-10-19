// Distinct artifacts share the surrounding navigation and delivery workflow.
export function renderComposition(t, escape, play) {
  if (t.layout === "session")
    return `<div class="session-console">
    <div class="artifact-head"><span>Listening notes / session 03</span><span>Original synthesis</span></div>
    <div class="session-title"><span>Three sketches.<br>One listening room.</span><i>03</i></div>
    <div class="session-takes">${t.items.map((name, i) => `<button data-audio="${i}" data-name="${escape(name)}" aria-label="Play ${escape(name)} synthesized demo" aria-pressed="false"><span class="take-number">0${i + 1}</span><span><b>${escape(name)}</b><small>${["Warm pulse / opening", "Glass melody / middle", "Low drift / closing"][i]}</small></span>${play}</button>`).join("")}</div>
    <p class="fine" role="status" data-audio-status>Sound is off. Choose a sketch to listen.</p>
    <div class="session-note"><span>Listening note</span><p>Give the quieter details somewhere to live.</p><span>Three local demos · 8 seconds each</span></div>
  </div>`;
  if (t.layout === "publication")
    return `<article class="paper-art">
    <div class="artifact-head"><span>Working paper / design specimen</span><span>Not a published study</span></div>
    <p class="paper-series">Notes on inspectable systems</p><h2>When an answer<br>shows its sources.</h2>
    <p class="paper-byline">A fictional research note · No empirical results</p>
    <div class="paper-abstract"><h3>Abstract</h3><p>This specimen asks how an interface could make a claim, its source and an unresolved question visible together. The method and review below are examples to replace with your own research.</p></div>
    <div class="paper-margin"><span>01 / Question</span><p>What would let a reader check the claim?</p></div>
    <details open><summary>Method outline</summary><p>Define the task, record source versions, document the protocol and preserve failures. No participant study was conducted for this template.</p></details>
    <details><summary>Review and limitations</summary><p>A polished example does not establish reliability. Publish the actual method, artifacts and uncertainty before making a performance claim.</p></details>
    <button type="button" class="text-button" data-copy-paper>Copy the research outline</button><p class="fine" data-paper-status role="status">An editable outline, not a citation to an existing paper.</p>
  </article>`;
  if (t.layout === "developer")
    return `<div class="request-art">
    <div class="artifact-head"><span>Request workbench</span><span class="status-dot">Local parser</span></div>
    <div class="request-address"><span>Input</span><code>application/json</code></div>
    <form data-json-form><label for="json-input">Inspect a JSON request</label><textarea id="json-input" name="request" rows="7" maxlength="8000" spellcheck="false" required>{
  "project": "Evening studies",
  "format": "release-notes",
  "includeCredits": true
}</textarea><div class="request-actions"><button class="button solid" type="submit">Validate and format</button><button class="text-button" type="button" data-json-example>Load example</button></div></form>
    <div class="request-response"><div class="result-head"><span>Formatted request</span><span data-json-state>Example</span></div><pre data-json-output tabindex="0" aria-label="Formatted JSON output">{
  "project": "Evening studies",
  "format": "release-notes",
  "includeCredits": true
}</pre><button class="text-button" data-copy-json type="button">Copy JSON</button></div>
    <p class="fine" data-json-status role="status">Syntax validation only. Nothing is sent to an API.</p>
  </div>`;
  return "";
}

export function compositionThumbnail(t) {
  if (t.layout === "session")
    return '<div class="mini-session"><span>01 — Opening</span><span>02 — Middle</span><span>03 — Closing</span></div>';
  if (t.layout === "publication")
    return '<div class="mini-paper"><span>Working paper</span><b>Question.<br>Method.<br>Limitations.</b></div>';
  if (t.layout === "developer")
    return '<div class="mini-request"><span>{</span><code>"project":<br>"your next idea"</code><span>}</span></div>';
  return "";
}
