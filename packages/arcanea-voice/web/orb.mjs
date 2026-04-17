// God-tier Lumina orb — vanilla three.js, zero build step.
// Six upgrades from the web component:
//   1. Translucent inner core sphere (emissive, amplitude-driven)
//   2. Chromatic aberration per-channel on the particle shell
//   3. Background radial glow (handled in CSS, reacts to amplitude via CSS var)
//   4. Breathing idle — continuous sine modulation even at zero audio
//   5. Dramatic thinking inhale (particles collapse, then burst)
//   6. Premium motion curves, subtle axis wobble, smooth lerp

import * as THREE from 'three';

const PARTICLE_VERT = /* glsl */`
  uniform float uTime;
  uniform float uAmp;
  uniform float uLow;
  uniform float uHigh;
  uniform float uChaos;
  uniform float uRadius;
  uniform float uInhale;
  attribute float aSeed;
  varying float vGlow;
  varying float vSeed;
  varying float vRim;

  vec3 hash3(float n) {
    return fract(sin(vec3(n, n + 1.0, n + 2.0)) * vec3(43758.5453, 22578.1459, 19642.3490));
  }

  float noise(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 57.0 + i.z * 113.0;
    return mix(
      mix(mix(fract(sin(n) * 43758.5), fract(sin(n + 1.0) * 43758.5), f.x),
          mix(fract(sin(n + 57.0) * 43758.5), fract(sin(n + 58.0) * 43758.5), f.x), f.y),
      mix(mix(fract(sin(n + 113.0) * 43758.5), fract(sin(n + 114.0) * 43758.5), f.x),
          mix(fract(sin(n + 170.0) * 43758.5), fract(sin(n + 171.0) * 43758.5), f.x), f.y), f.z);
  }

  void main() {
    vec3 dir = normalize(position);
    float t = uTime * 0.3;
    float n = noise(dir * 1.6 + vec3(t, t * 0.8, -t));
    float n2 = noise(dir * 3.4 + vec3(-t * 1.1, t, t * 1.4));

    float breath = 1.0 + sin(uTime * 1.15 + aSeed * 6.28) * 0.045;
    float amp = uAmp * 1.9 + uLow * 0.7;
    float inhale = uInhale;
    float radial = uRadius * breath * (1.0 - inhale * 0.38) + n * 0.22 + n2 * 0.13 * uChaos + amp * 0.6;

    vec3 pos = dir * radial;
    pos += hash3(aSeed * 97.0) * uChaos * 0.18;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = length(mv.xyz);
    float sizeBoost = 1.0 + amp * 2.4 + uHigh * 0.9 + inhale * 0.9;
    gl_PointSize = (44.0 / dist) * sizeBoost * (0.65 + fract(aSeed * 13.0) * 0.7);

    vGlow = 0.6 + amp * 1.0 + n * 0.25 + inhale * 0.3;
    vSeed = aSeed;
    vRim = smoothstep(0.6, 1.4, length(pos));
  }
`;

const PARTICLE_FRAG = /* glsl */`
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uFade;
  varying float vGlow;
  varying float vSeed;
  varying float vRim;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;

    // Chromatic aberration: each channel has a slightly different falloff radius.
    float ar = smoothstep(0.50, 0.00, r);
    float ag = smoothstep(0.48, 0.02, r);
    float ab = smoothstep(0.46, 0.04, r);
    vec3 alpha = vec3(ar, ag, ab) * vec3(ar, ag, ab);

    vec3 c = mix(uColor, uAccent, fract(vSeed * 7.0) * 0.55 + 0.15);
    c *= vGlow * 1.45;
    // Tint the rim more toward accent (AI-lab polish).
    c = mix(c, uAccent, vRim * 0.28);

    gl_FragColor = vec4(c * alpha, max(max(alpha.r, alpha.g), alpha.b) * uFade);
  }
`;

const CORE_VERT = /* glsl */`
  uniform float uTime;
  uniform float uAmp;
  uniform float uInhale;
  varying vec3 vNormal;
  varying float vFresnel;

  void main() {
    vec3 pos = position * (0.52 + sin(uTime * 1.4) * 0.02 + uAmp * 0.10 - uInhale * 0.08);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    vNormal = normalize(normalMatrix * normal);
    vec3 viewDir = normalize(-mv.xyz);
    vFresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.4);
  }
`;

const CORE_FRAG = /* glsl */`
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uAmp;
  uniform float uFade;
  varying vec3 vNormal;
  varying float vFresnel;

  void main() {
    vec3 base = mix(uColor, uAccent, 0.35);
    vec3 glow = base * (0.35 + uAmp * 0.9) + uAccent * vFresnel * 0.9;
    float a = (0.22 + vFresnel * 0.7 + uAmp * 0.3) * uFade;
    gl_FragColor = vec4(glow, a);
  }
`;

const STATE = {
  listening: { radius: 1.0,  chaos: 0.26, spin: 0.09, pulse: 0.0 },
  thinking:  { radius: 0.92, chaos: 1.15, spin: 0.70, pulse: 2.4 },
  speaking:  { radius: 1.08, chaos: 0.48, spin: 0.22, pulse: 0.0 },
  idle:      { radius: 0.95, chaos: 0.18, spin: 0.04, pulse: 0.0 },
};

function hexToRgb(hex) {
  const v = hex.replace('#', '');
  const n = parseInt(v.length === 3 ? v.split('').map(c => c + c).join('') : v, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function sphereAttrs(count) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    positions[i * 3] = Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = Math.cos(phi);
    seeds[i] = Math.random();
  }
  return { positions, seeds };
}

export class LuminaOrb {
  constructor(mount, { color = '#ffd700', accent = '#00bcd4', particles = 5200 } = {}) {
    this.mount = mount;
    this.state = 'idle';
    this.prevState = 'idle';
    this.stateChangedAt = 0;
    this.snapshot = { amp: 0, low: 0, high: 0 };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor(0x000000, 0);
    mount.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
    this.camera.position.z = 4.6;

    const [cr, cg, cb] = hexToRgb(color);
    const [ar, ag, ab] = hexToRgb(accent);
    const colorVec = new THREE.Color(cr, cg, cb);
    const accentVec = new THREE.Color(ar, ag, ab);

    // Inner core sphere
    const coreGeo = new THREE.IcosahedronGeometry(1, 4);
    this.coreMat = new THREE.ShaderMaterial({
      vertexShader: CORE_VERT, fragmentShader: CORE_FRAG,
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }, uAmp: { value: 0 }, uInhale: { value: 0 }, uFade: { value: 0 },
        uColor: { value: colorVec.clone() }, uAccent: { value: accentVec.clone() },
      },
    });
    this.core = new THREE.Mesh(coreGeo, this.coreMat);
    this.scene.add(this.core);

    // Particle shell
    const { positions, seeds } = sphereAttrs(particles);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    this.particleMat = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERT, fragmentShader: PARTICLE_FRAG,
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }, uAmp: { value: 0 }, uLow: { value: 0 }, uHigh: { value: 0 },
        uChaos: { value: STATE.idle.chaos }, uRadius: { value: STATE.idle.radius },
        uInhale: { value: 0 }, uFade: { value: 0 },
        uColor: { value: colorVec }, uAccent: { value: accentVec },
      },
    });
    this.points = new THREE.Points(geo, this.particleMat);
    this.scene.add(this.points);

    this.clock = new THREE.Clock();
    this.fade = 0;
    this.raf = 0;

    this._resize = this._resize.bind(this);
    this.ro = new ResizeObserver(this._resize);
    this.ro.observe(mount);
    this._resize();

    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  setState(next) {
    if (next === this.state) return;
    this.prevState = this.state;
    this.state = next;
    this.stateChangedAt = this.clock.getElapsedTime();
  }

  setAudioSnapshot(snap) {
    this.snapshot = snap;
  }

  setPalette(color, accent) {
    const [cr, cg, cb] = hexToRgb(color);
    const [ar, ag, ab] = hexToRgb(accent);
    this.particleMat.uniforms.uColor.value.setRGB(cr, cg, cb);
    this.particleMat.uniforms.uAccent.value.setRGB(ar, ag, ab);
    this.coreMat.uniforms.uColor.value.setRGB(cr, cg, cb);
    this.coreMat.uniforms.uAccent.value.setRGB(ar, ag, ab);
  }

  _resize() {
    const w = this.mount.clientWidth;
    const h = this.mount.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  loop() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.getElapsedTime();
    const s = STATE[this.state] || STATE.idle;

    const rawAmp = this.snapshot?.amp ?? 0;
    const targetAmp = this.state === 'speaking'
      ? rawAmp
      : this.state === 'listening'
        ? rawAmp * 0.6
        : this.state === 'thinking'
          ? 0.08 + Math.abs(Math.sin(t * s.pulse)) * 0.06
          : 0.0;

    const pu = this.particleMat.uniforms;
    const cu = this.coreMat.uniforms;

    pu.uAmp.value += (targetAmp - pu.uAmp.value) * Math.min(dt * 14, 1);
    pu.uLow.value += ((this.snapshot?.low ?? 0) - pu.uLow.value) * Math.min(dt * 10, 1);
    pu.uHigh.value += ((this.snapshot?.high ?? 0) - pu.uHigh.value) * Math.min(dt * 10, 1);
    pu.uChaos.value += (s.chaos - pu.uChaos.value) * Math.min(dt * 4, 1);
    pu.uRadius.value += (s.radius - pu.uRadius.value) * Math.min(dt * 4, 1);

    cu.uAmp.value = pu.uAmp.value;

    // Dramatic thinking inhale: sharp collapse on entry, decay over 0.9s.
    if (this.state === 'thinking') {
      const age = t - this.stateChangedAt;
      const inhale = Math.max(0, 1 - age / 0.9);
      pu.uInhale.value += (inhale - pu.uInhale.value) * Math.min(dt * 12, 1);
      cu.uInhale.value = pu.uInhale.value;
    } else {
      pu.uInhale.value += (0 - pu.uInhale.value) * Math.min(dt * 6, 1);
      cu.uInhale.value = pu.uInhale.value;
    }

    pu.uTime.value = t;
    cu.uTime.value = t;

    this.fade += (1 - this.fade) * Math.min(dt * 3, 1);
    pu.uFade.value = this.fade;
    cu.uFade.value = this.fade;

    this.points.rotation.y += s.spin * dt;
    this.points.rotation.x = Math.sin(t * 0.2) * 0.12;
    this.core.rotation.y -= s.spin * 0.6 * dt;
    this.core.rotation.x = Math.sin(t * 0.3 + 1.2) * 0.08;

    // Publish the smoothed amplitude to CSS so the room background glow can react.
    this.mount.style.setProperty('--orb-amp', pu.uAmp.value.toFixed(3));

    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.loop);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.particleMat.dispose();
    this.coreMat.dispose();
    this.points.geometry.dispose();
    this.core.geometry.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.mount) {
      this.mount.removeChild(this.renderer.domElement);
    }
  }
}
