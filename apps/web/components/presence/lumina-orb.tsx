'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { AudioSnapshot } from './use-audio-analyser';

export type OrbState = 'listening' | 'thinking' | 'speaking';

export interface LuminaOrbProps {
  state: OrbState;
  snapshotRef?: React.MutableRefObject<AudioSnapshot>;
  color?: string;
  accent?: string;
  size?: number;
  className?: string;
}

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uLow;
  uniform float uHigh;
  uniform float uChaos;
  uniform float uRadius;
  uniform float uPulse;
  uniform float uInhale;
  attribute float aSeed;
  varying float vGlow;
  varying float vSeed;
  varying float vRim;

  vec3 hash3(float n) {
    return fract(sin(vec3(n, n + 1.0, n + 2.0)) * vec3(43758.5453, 22578.1459, 19642.3490));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 57.0 + i.z * 113.0;
    return mix(
      mix(mix(fract(sin(n) * 43758.5), fract(sin(n + 1.0) * 43758.5), f.x),
          mix(fract(sin(n + 57.0) * 43758.5), fract(sin(n + 58.0) * 43758.5), f.x), f.y),
      mix(mix(fract(sin(n + 113.0) * 43758.5), fract(sin(n + 114.0) * 43758.5), f.x),
          mix(fract(sin(n + 170.0) * 43758.5), fract(sin(n + 171.0) * 43758.5), f.x), f.y),
      f.z
    );
  }

  void main() {
    vec3 p = normalize(position);
    float t = uTime * 0.3;
    float n = noise(p * 1.6 + vec3(t, t * 0.8, -t));
    float n2 = noise(p * 3.2 + vec3(-t, t, t * 1.3));

    float breath = 1.0 + sin(uTime * 1.15 + aSeed * 6.28) * 0.045;
    float amp = uAmplitude * 1.9 + uLow * 0.7;
    float radial = uRadius * breath * (1.0 - uInhale * 0.38) + n * 0.22 + n2 * 0.13 * uChaos + amp * 0.6 + uPulse * 0.3;

    vec3 pos = p * radial;
    pos += hash3(aSeed * 97.0) * uChaos * 0.18;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = length(mv.xyz);
    float sizeBoost = 1.0 + amp * 2.4 + uHigh * 0.9 + uInhale * 0.9;
    gl_PointSize = (44.0 / dist) * sizeBoost * (0.65 + fract(aSeed * 13.0) * 0.7);

    vGlow = 0.6 + amp * 1.0 + n * 0.25 + uInhale * 0.3;
    vSeed = aSeed;
    vRim = smoothstep(0.6, 1.4, length(pos));
  }
`;

const FRAG = /* glsl */ `
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

    float ar = smoothstep(0.50, 0.00, r);
    float ag = smoothstep(0.48, 0.02, r);
    float ab = smoothstep(0.46, 0.04, r);
    vec3 alpha = vec3(ar, ag, ab) * vec3(ar, ag, ab);

    vec3 c = mix(uColor, uAccent, fract(vSeed * 7.0) * 0.55 + 0.15);
    c *= vGlow * 1.45;
    c = mix(c, uAccent, vRim * 0.28);

    gl_FragColor = vec4(c * alpha, max(max(alpha.r, alpha.g), alpha.b) * uFade);
  }
`;

const CORE_VERT = /* glsl */ `
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

const CORE_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uAmp;
  uniform float uFade;
  varying float vFresnel;

  void main() {
    vec3 base = mix(uColor, uAccent, 0.35);
    vec3 glow = base * (0.35 + uAmp * 0.9) + uAccent * vFresnel * 0.9;
    float a = (0.22 + vFresnel * 0.7 + uAmp * 0.3) * uFade;
    gl_FragColor = vec4(glow, a);
  }
`;

const STATE_CONFIG: Record<OrbState, { radius: number; chaos: number; spin: number; baseAmp: number; pulseFreq: number }> = {
  listening: { radius: 1.0, chaos: 0.25, spin: 0.08, baseAmp: 0.0, pulseFreq: 0.0 },
  thinking: { radius: 0.95, chaos: 1.0, spin: 0.6, baseAmp: 0.08, pulseFreq: 2.2 },
  speaking: { radius: 1.05, chaos: 0.45, spin: 0.22, baseAmp: 0.0, pulseFreq: 0.0 },
};

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace('#', '');
  const n = parseInt(v.length === 3 ? v.split('').map(c => c + c).join('') : v, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function buildGeometry(count: number): THREE.BufferGeometry {
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
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  return geo;
}

export function LuminaOrb({
  state,
  snapshotRef,
  color = '#00bcd4',
  accent = '#ffd700',
  size = 360,
  className,
}: LuminaOrbProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || typeof window === 'undefined') return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(dpr);
    renderer.setSize(size, size, false);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 20);
    camera.position.z = 4.2;

    const geometry = buildGeometry(4096);
    const [cr, cg, cb] = hexToRgb(color);
    const [ar, ag, ab] = hexToRgb(accent);
    const colorVec = new THREE.Color(cr, cg, cb);
    const accentVec = new THREE.Color(ar, ag, ab);

    const coreGeometry = new THREE.IcosahedronGeometry(1, 4);
    const coreMaterial = new THREE.ShaderMaterial({
      vertexShader: CORE_VERT,
      fragmentShader: CORE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0 },
        uInhale: { value: 0 },
        uFade: { value: 0 },
        uColor: { value: colorVec.clone() },
        uAccent: { value: accentVec.clone() },
      },
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: 0 },
        uLow: { value: 0 },
        uHigh: { value: 0 },
        uChaos: { value: STATE_CONFIG[state].chaos },
        uRadius: { value: STATE_CONFIG[state].radius },
        uPulse: { value: 0 },
        uInhale: { value: 0 },
        uFade: { value: 0 },
        uColor: { value: colorVec },
        uAccent: { value: accentVec },
      },
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const clock = new THREE.Clock();
    let raf = 0;
    let fade = 0;
    const u = material.uniforms;
    const cu = coreMaterial.uniforms;
    let lastState = state;
    let stateChangedAt = 0;

    const render = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();
      const current = stateRef.current;
      const cfg = STATE_CONFIG[current];

      if (current !== lastState) {
        lastState = current;
        stateChangedAt = t;
      }

      const snap = snapshotRef?.current;
      const rawAmp = snap?.amplitude ?? 0;
      const low = snap?.low ?? 0;
      const high = snap?.high ?? 0;

      const targetAmp = current === 'speaking'
        ? rawAmp
        : current === 'thinking'
          ? cfg.baseAmp + Math.sin(t * cfg.pulseFreq) * 0.04
          : rawAmp * 0.6;

      u.uAmplitude.value += (targetAmp - u.uAmplitude.value) * Math.min(dt * 14, 1);
      u.uLow.value += (low - u.uLow.value) * Math.min(dt * 10, 1);
      u.uHigh.value += (high - u.uHigh.value) * Math.min(dt * 10, 1);
      u.uRadius.value += (cfg.radius - u.uRadius.value) * Math.min(dt * 4, 1);
      u.uChaos.value += (cfg.chaos - u.uChaos.value) * Math.min(dt * 4, 1);

      const targetPulse = current === 'thinking' ? Math.abs(Math.sin(t * 2.8)) * 0.2 : 0;
      u.uPulse.value += (targetPulse - u.uPulse.value) * Math.min(dt * 8, 1);

      const inhaleTarget = current === 'thinking'
        ? Math.max(0, 1 - (t - stateChangedAt) / 0.9)
        : 0;
      u.uInhale.value += (inhaleTarget - u.uInhale.value) * Math.min(dt * 12, 1);
      cu.uInhale.value = u.uInhale.value;
      cu.uAmp.value = u.uAmplitude.value;

      u.uTime.value = t;
      cu.uTime.value = t;
      fade += (1 - fade) * Math.min(dt * 3, 1);
      u.uFade.value = fade;
      cu.uFade.value = fade;

      points.rotation.y += cfg.spin * dt;
      points.rotation.x = Math.sin(t * 0.2) * 0.12;
      core.rotation.y -= cfg.spin * 0.6 * dt;
      core.rotation.x = Math.sin(t * 0.3 + 1.2) * 0.08;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth || size;
      const h = mount.clientHeight || size;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [color, accent, size, snapshotRef, state]);

  return <div ref={mountRef} className={className} style={{ width: size, height: size }} aria-hidden />;
}
