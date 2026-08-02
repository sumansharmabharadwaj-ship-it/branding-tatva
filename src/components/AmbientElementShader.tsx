"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
// Palette re-keyed (Aug 2026) from the warm five-element hexes to the
// codified earth-first desaturated greens (CLAUDE.md design language).
// Root cause of a recurring "why is this section orangish" bug class:
// this shader's clay/ochre uniforms drifted a warm amber wash over
// every scene it sat on — visibly re-warming chapters whose footage
// had been deliberately cool-graded (the slate summit, the mist
// ground). The drift now stays inside the green/mist family, so the
// shader adds organic light without ever fighting a chapter's grade.
const ECOSYSTEM_HEX = {
  forest: "#1F3A28",
  moss: "#556B4A",
  sage: "#8FAE83",
  olive: "#7D8E52",
  mist: "#DDE2DC",
} as const;

// The one Three.js moment on the site (Services' Education section) —
// deliberately vanilla `three`, not @react-three/fiber/drei. Two prior
// WebGL attempts on this codebase (an About-page closing scene, a
// five-capsule "skyline" moment) were both rejected as "cartoonish and
// disconnected from the brand" — the shared mistake was literal 3D
// *objects* (shapes, geometry, lighting) competing with an editorial,
// photographic, warm-earthy identity. This avoids that entirely: no
// geometry beyond a flat full-bleed plane, no simulated props — just
// the ecosystem greens (ECOSYSTEM_HEX below) drifting through a slow GLSL
// blend, closer to light and grain than to a rendered "scene." drei's
// own <ScrollControls> was also avoided on purpose — it's a second
// scroll-virtualization system that would collide with Lenis, which
// already owns scroll for the whole site (see SmoothScrollProvider.tsx).
//
// Mounted imperatively in a plain useEffect with its own requestAnimationFrame
// loop (not GSAP's ticker — nothing here needs GSAP's timeline features,
// and keeping it isolated means a WebGL failure can't affect anything
// else). IntersectionObserver play/pause mirrors MorphingGlyph.tsx's own
// pattern. Renders nothing (returns null) under reduced motion, missing
// WebGL support, or before mount — callers are expected to already have
// their own static photo/gradient layer underneath this as the resting
// state, so a null render here never leaves a visibly broken gap.

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uEarth;
  uniform vec3 uWater;
  uniform vec3 uFire;
  uniform vec3 uAir;
  uniform vec3 uSpace;
  uniform float uOpacity;

  // Cheap value noise — no texture lookup needed, just enough
  // irregularity that the blend reads as drifting light rather than a
  // mechanical gradient sweep.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.03;

    float n1 = noise(uv * 2.2 + vec2(t, -t * 0.7));
    float n2 = noise(uv * 1.6 + vec2(-t * 0.5, t * 0.9) + 4.0);
    float n3 = noise(uv * 2.8 + vec2(t * 0.4, t * 0.3) + 9.0);

    vec3 col = mix(uEarth, uWater, smoothstep(0.2, 0.8, n1));
    col = mix(col, uFire, smoothstep(0.35, 0.75, n2) * 0.6);
    col = mix(col, uAir, smoothstep(0.3, 0.7, n3) * 0.5);
    col = mix(col, uSpace, smoothstep(0.4, 0.9, noise(uv * 1.1 - t)) * 0.4);

    gl_FragColor = vec4(col, uOpacity);
  }
`;

function hexToVec3(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function AmbientElementShader({ className, opacity = 0.35 }: { className?: string; opacity?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    let raf = 0;
    let running = false;
    let renderer: import("three").WebGLRenderer | undefined;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");

      let ctxCanvas: HTMLCanvasElement;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      } catch {
        if (!disposed) setSupported(false);
        return;
      }
      if (disposed) {
        renderer.dispose();
        return;
      }

      ctxCanvas = renderer.domElement;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      ctxCanvas.className = "absolute inset-0 h-full w-full";
      container.appendChild(ctxCanvas);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uEarth: { value: hexToVec3(ECOSYSTEM_HEX.forest) },
          uWater: { value: hexToVec3(ECOSYSTEM_HEX.moss) },
          uFire: { value: hexToVec3(ECOSYSTEM_HEX.sage) },
          uAir: { value: hexToVec3(ECOSYSTEM_HEX.mist) },
          uSpace: { value: hexToVec3(ECOSYSTEM_HEX.olive) },
          uOpacity: { value: opacity },
        },
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      function resize() {
        if (!renderer || !container) return;
        const { clientWidth, clientHeight } = container;
        renderer.setSize(clientWidth, clientHeight);
      }
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      // Frame-capped to 30fps — a Lighthouse profile of Services (which
      // runs up to six instances of this shader) attributed its longest
      // main-thread tasks to uncapped per-frame render work. The drift
      // here moves at uTime * 0.03; at that speed the difference
      // between 60 and 30 renders a second is imperceptible, and the
      // cap halves this component's total CPU/GPU cost page-wide.
      let lastRender = 0;
      function tick(time: number) {
        if (!running || !renderer) return;
        raf = requestAnimationFrame(tick);
        if (time - lastRender < 33) return;
        lastRender = time;
        material.uniforms.uTime.value = time * 0.001;
        renderer.render(scene, camera);
      }

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !running) {
            running = true;
            raf = requestAnimationFrame(tick);
          } else if (!entry.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0.1 }
      );
      intersectionObserver.observe(container);

      cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        geometry.dispose();
        material.dispose();
        renderer?.dispose();
        ctxCanvas.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [prefersReducedMotion, opacity]);

  if (prefersReducedMotion || !supported) return null;

  return <div ref={containerRef} className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`} aria-hidden="true" />;
}
