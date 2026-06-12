// Render a world repo into a single, standalone, undeniable HTML page.
// Pure function: (world, tokensCss) -> html string. No framework, no secrets.

import { parseFrontmatter } from "../../packages/world-sdk/src/index.mjs";

const ELEMENT_VAR = {
  water: "--arc-water", void: "--arc-void", crystal: "--arc-crystal",
  fire: "--arc-fire", wind: "--arc-wind", earth: "--arc-earth",
};

const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function leadParagraph(body) {
  for (const block of body.split(/\n{2,}/)) {
    const t = block.trim();
    if (t && !t.startsWith("#") && !t.startsWith("---")) return t.replace(/\s+/g, " ");
  }
  return "";
}

function docs(files, prefix) {
  return files
    .filter((f) => f.path.startsWith(prefix) && /\.mdx?$/.test(f.path))
    .map((f) => {
      const text = typeof f.bytes === "string" ? f.bytes : f.bytes.toString("utf8");
      const { data, body } = parseFrontmatter(text);
      return { data, lead: leadParagraph(body), path: f.path };
    })
    .filter((d) => (d.data.visibility || "public") === "public");
}

export function renderWorldPage(world, tokensCss) {
  const m = world.manifest;
  const palette = m.visualDna?.palette || ["#0d47a1", "#00bcd4"];
  const [p0, p1, p2 = p1, p3 = p0, accent = "#ffd700"] = palette;
  const characters = docs(world.files, "characters/");
  const locations = docs(world.files, "locations/");
  const emergent = docs(world.files, "canon/").filter((d) => Number(d.data.canonLevel || 1) >= 2);
  const proof = (m.provenance || [])[0];
  const shortHash = proof ? proof.contentHash.replace("sha256:", "").slice(0, 12) : null;

  const lawCards = (m.laws || [])
    .map(
      (law, i) => `<article class="card law">
        <span class="law-no">${String(i + 1).padStart(2, "0")}</span>
        <p>${esc(law)}</p>
      </article>`,
    )
    .join("");

  const charCards = characters
    .map((c) => {
      const el = (c.data.element || "").toLowerCase();
      const v = ELEMENT_VAR[el] || "--arc-brand-atlantean-teal";
      const evo = c.data.evolution ? `<span class="chip evo">🌱 ${esc(c.data.evolution)}</span>` : "";
      return `<article class="card char" style="--accent: var(${v})">
        <div class="char-orb"></div>
        <h3>${esc(c.data.name || "")}</h3>
        <span class="chip">${esc(c.data.role || "inhabitant")}${el ? ` · ${esc(el)}` : ""}</span>${evo}
        <p>${esc(c.lead)}</p>
      </article>`;
    })
    .join("");

  const locCards = locations
    .map(
      (l) => `<article class="card loc">
        <h3>${esc(l.data.name || "")}</h3>
        <p>${esc(l.lead)}</p>
      </article>`,
    )
    .join("");

  const splits = (m.royalty?.splits || [])
    .map((s) => `<div class="split"><span>${esc(s.to)}</span><div class="bar"><i style="width:${(s.bps / 100).toFixed(0)}%"></i></div><span>${(s.bps / 100).toFixed(0)}%</span></div>`)
    .join("");

  const paletteDots = palette.map((c) => `<span class="dot" style="background:${esc(c)}" title="${esc(c)}"></span>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(m.name)} — an Arcanea world</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
<style>
${tokensCss}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--arc-font-body);
  color: var(--arc-text-primary);
  background: var(--arc-cosmic-void);
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
.bg { position: fixed; inset: 0; z-index: -2; background:
  radial-gradient(60% 50% at 20% 12%, ${p2}33, transparent 70%),
  radial-gradient(55% 45% at 82% 22%, ${p1}2e, transparent 70%),
  radial-gradient(70% 60% at 50% 100%, ${p0}66, transparent 70%),
  linear-gradient(180deg, var(--arc-cosmic-void), #060a14 60%, var(--arc-cosmic-void));
  animation: drift 24s var(--arc-ease-expo-out) infinite alternate;
}
.bg::after { content:""; position:absolute; inset:0; background:
  radial-gradient(circle at 50% 0%, transparent 60%, rgba(0,0,0,.5));
  mix-blend-mode: multiply; }
@keyframes drift { to { transform: translate3d(0,-2%,0) scale(1.05); } }
.wrap { max-width: 1080px; margin: 0 auto; padding: 0 28px; }
.eyebrow { font-family: var(--arc-font-mono); font-size: .72rem; letter-spacing: .42em;
  text-transform: uppercase; color: var(--arc-brand-arcanean-gold); }

/* Proof badge */
.proof { position: fixed; top: 18px; right: 18px; z-index: 5; display: flex; gap: 9px; align-items: center;
  font-family: var(--arc-font-mono); font-size: .68rem; letter-spacing: .12em; color: var(--arc-text-secondary);
  padding: 8px 14px; border-radius: var(--arc-radius-full);
  background: rgba(255,255,255,.04); border: 1px solid var(--arc-cosmic-border-bright);
  backdrop-filter: blur(14px); box-shadow: var(--arc-shadow-glass); }
.proof .gem { color: var(--arc-brand-atlantean-teal); }

/* Hero */
.hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 96px 28px 64px; position: relative; }
.hero .eyebrow { margin-bottom: 26px; opacity: 0; animation: rise .9s var(--arc-ease-expo-out) .1s forwards; }
.hero h1 { font-family: var(--arc-font-editorial); font-weight: 400; letter-spacing: -.01em;
  font-size: clamp(3.2rem, 11vw, 8rem); line-height: .95;
  background: linear-gradient(180deg, #fff, ${p2} 55%, ${p1});
  -webkit-background-clip: text; background-clip: text; color: transparent;
  opacity: 0; animation: rise 1s var(--arc-ease-expo-out) .22s forwards; }
.hero .tagline { font-family: var(--arc-font-editorial); font-style: italic;
  font-size: clamp(1.15rem, 2.6vw, 1.7rem); color: var(--arc-text-secondary); max-width: 640px; margin: 26px auto 0;
  opacity: 0; animation: rise 1s var(--arc-ease-expo-out) .4s forwards; }
.genesis { margin-top: 34px; font-family: var(--arc-font-mono); font-size: .82rem; letter-spacing: .04em;
  color: var(--arc-text-muted); padding: 10px 20px; border-radius: var(--arc-radius-full);
  background: rgba(255,255,255,.03); border: 1px solid var(--arc-cosmic-border);
  opacity: 0; animation: rise 1s var(--arc-ease-expo-out) .55s forwards; }
.dots { display: flex; gap: 10px; margin-top: 32px; opacity: 0; animation: rise 1s var(--arc-ease-expo-out) .7s forwards; }
.dot { width: 26px; height: 26px; border-radius: 50%; box-shadow: 0 0 16px currentColor, inset 0 0 0 1px rgba(255,255,255,.18); }
.cue { position: absolute; bottom: 28px; font-family: var(--arc-font-mono); font-size: .64rem; letter-spacing: .3em;
  color: var(--arc-text-muted); animation: pulse 2.4s ease-in-out infinite; }
@keyframes rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes pulse { 50% { opacity: .35; } }

/* Sections */
section { padding: 92px 0; }
.shead { display: flex; align-items: baseline; gap: 18px; margin-bottom: 40px; }
.shead h2 { font-family: var(--arc-font-editorial); font-weight: 400; font-size: clamp(2rem, 5vw, 3.2rem);
  letter-spacing: -.01em; }
.shead .rule { flex: 1; height: 1px; background: linear-gradient(90deg, var(--arc-cosmic-border-bright), transparent); }

.grid { display: grid; gap: 20px; }
.cols-3 { grid-template-columns: repeat(3, 1fr); }
.cols-2 { grid-template-columns: repeat(2, 1fr); }
@media (max-width: 860px) { .cols-3, .cols-2 { grid-template-columns: 1fr; } }

/* Glass card */
.card { position: relative; padding: 28px; border-radius: var(--arc-radius-2xl);
  background: rgba(255,255,255,.04); border: 1px solid var(--arc-cosmic-border-bright);
  backdrop-filter: blur(14px); box-shadow: var(--arc-shadow-glass);
  transition: transform .4s var(--arc-ease-magnetic), border-color .3s, box-shadow .3s; }
.card:hover { transform: translateY(-6px); border-color: var(--accent, var(--arc-brand-atlantean-teal));
  box-shadow: var(--arc-shadow-elevation-3); }
.law-no { font-family: var(--arc-font-mono); font-size: 1.1rem; color: var(--arc-brand-arcanean-gold); }
.law p { margin-top: 14px; font-size: 1.05rem; color: var(--arc-text-primary); }
.char { padding-top: 34px; }
.char-orb { width: 54px; height: 54px; border-radius: 50%; margin-bottom: 18px;
  background: radial-gradient(circle at 35% 30%, #fff6, transparent 60%), var(--accent);
  box-shadow: 0 0 28px -2px var(--accent); }
.char h3, .loc h3 { font-family: var(--arc-font-display); font-weight: 600; font-size: 1.35rem; }
.chip { display: inline-block; margin: 10px 0 14px; font-family: var(--arc-font-mono); font-size: .68rem;
  letter-spacing: .14em; text-transform: uppercase; color: var(--accent, var(--arc-text-secondary));
  padding: 4px 11px; border-radius: var(--arc-radius-full); border: 1px solid var(--arc-cosmic-border-bright); }
.card p { color: var(--arc-text-secondary); }
.loc h3 { margin-bottom: 12px; }
.chip.evo { margin-left: 8px; color: var(--arc-wind); border-color: color-mix(in srgb, var(--arc-wind) 40%, transparent); }
.live { border-color: color-mix(in srgb, var(--arc-wind) 28%, var(--arc-cosmic-border-bright)); }
.live h3 { font-family: var(--arc-font-editorial); font-weight: 400; font-size: 1.5rem; margin: 12px 0 10px; }
.living-note { font-family: var(--arc-font-editorial); font-style: italic; font-size: 1.15rem; color: var(--arc-text-secondary); margin: -18px 0 30px; }

/* Soundtrack */
.sound { display: flex; gap: 26px; align-items: center; }
.eq { display: flex; gap: 4px; align-items: flex-end; height: 64px; }
.eq i { width: 5px; background: linear-gradient(var(--arc-brand-atlantean-teal), var(--arc-brand-cosmic-blue));
  border-radius: 3px; animation: eq 1.1s ease-in-out infinite; }
.eq i:nth-child(2){animation-delay:.15s} .eq i:nth-child(3){animation-delay:.3s}
.eq i:nth-child(4){animation-delay:.45s} .eq i:nth-child(5){animation-delay:.6s}
.eq i:nth-child(6){animation-delay:.2s} .eq i:nth-child(7){animation-delay:.5s}
@keyframes eq { 0%,100%{height:14px} 50%{height:58px} }
.sound .prompt { font-family: var(--arc-font-editorial); font-style: italic; font-size: 1.25rem; color: var(--arc-text-secondary); }

/* Footer / provenance */
footer { padding: 80px 0 120px; border-top: 1px solid var(--arc-cosmic-border); margin-top: 40px; }
.prov { display: grid; gap: 28px; grid-template-columns: 1.3fr 1fr; }
@media (max-width: 860px){ .prov { grid-template-columns: 1fr; } }
.kv { font-family: var(--arc-font-mono); font-size: .8rem; color: var(--arc-text-secondary); }
.kv b { color: var(--arc-text-muted); font-weight: 400; display: block; letter-spacing: .14em; text-transform: uppercase; font-size: .64rem; margin-bottom: 4px; }
.kv code { color: var(--arc-brand-atlantean-teal); word-break: break-all; }
.split { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; font-family: var(--arc-font-mono); font-size: .76rem; color: var(--arc-text-secondary); }
.split .bar { flex: 1; height: 6px; background: var(--arc-cosmic-raised); border-radius: 4px; overflow: hidden; }
.split .bar i { display: block; height: 100%; background: linear-gradient(90deg, var(--arc-gold-deep), var(--arc-brand-arcanean-gold)); }
.sov { margin-top: 30px; font-family: var(--arc-font-editorial); font-style: italic; font-size: 1.3rem; color: var(--arc-text-primary); }
.sig { margin-top: 10px; font-family: var(--arc-font-mono); font-size: .66rem; letter-spacing: .3em; text-transform: uppercase; color: var(--arc-text-muted); }
</style>
</head>
<body>
<div class="bg"></div>
${proof ? `<div class="proof"><span class="gem">◆</span> PROVEN ON ${esc(proof.chain).toUpperCase()} · ${esc(shortHash)}</div>` : ""}

<header class="hero">
  <span class="eyebrow">An Arcanea World</span>
  <h1>${esc(m.name)}</h1>
  <p class="tagline">${esc(m.tagline)}</p>
  <div class="genesis">❝ ${esc(m.genesisPrompt)} ❞</div>
  <div class="dots">${paletteDots}</div>
  <div class="cue">scroll to enter ↓</div>
</header>

<main class="wrap">
  ${m.premise ? `<section><div class="shead"><h2>The World</h2><span class="rule"></span></div><p style="font-size:1.2rem;max-width:760px;color:var(--arc-text-secondary)">${esc(m.premise)}</p></section>` : ""}

  ${lawCards ? `<section><div class="shead"><h2>The Laws</h2><span class="rule"></span></div><div class="grid cols-3">${lawCards}</div></section>` : ""}

  ${charCards ? `<section><div class="shead"><h2>Inhabitants</h2><span class="rule"></span></div><div class="grid cols-3">${charCards}</div></section>` : ""}

  ${locCards ? `<section><div class="shead"><h2>Places</h2><span class="rule"></span></div><div class="grid cols-2">${locCards}</div></section>` : ""}

  ${m.theme?.prompt ? `<section><div class="shead"><h2>The Soundtrack</h2><span class="rule"></span></div><div class="card sound"><div class="eq"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><p class="prompt">${esc(m.theme.prompt)}</p></div></section>` : ""}

  ${emergent.length ? `<section><div class="shead"><h2>The Living Canon</h2><span class="rule"></span></div>
    <p class="living-note">This world is alive. What is lived in it becomes canon — written by no one, earned by everyone.</p>
    <div class="grid cols-2">${emergent
      .map(
        (d) => `<article class="card live">
        <span class="chip evo">🌱 emergent · level ${esc(String(d.data.canonLevel))}</span>
        <h3>${esc((d.data.subject || "").toString() || d.path.split("/").pop().replace(/\\.mdx?$/, ""))}</h3>
        <p>${esc(d.lead)}</p>
      </article>`,
      )
      .join("")}</div></section>` : ""}
</main>

<footer class="wrap">
  <div class="prov">
    <div>
      <p class="kv"><b>World ID</b><code>${esc(m.id)}</code></p>
      ${proof ? `<p class="kv" style="margin-top:16px"><b>Content Hash · ${esc(proof.standard)}</b><code>${esc(proof.contentHash)}</code></p>` : ""}
      <p class="kv" style="margin-top:16px"><b>License</b><code>${esc(m.license?.spdx || "")} · remix ${esc(m.license?.remix || "")}</code></p>
    </div>
    <div>
      <p class="kv"><b>Royalty Splits</b></p>
      ${splits}
    </div>
  </div>
  <p class="sov">Sovereign. Content-addressed. Yours to export.</p>
  <p class="sig">Arcanea · the Living Universe Engine</p>
</footer>
</body>
</html>`;
}
