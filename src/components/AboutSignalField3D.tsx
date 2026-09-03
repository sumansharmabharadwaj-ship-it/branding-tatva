"use client";

import { useEffect, useRef } from "react";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

type SignalFieldMode = "recognition" | "synthesis";

type AboutSignalField3DProps = {
  mode: SignalFieldMode;
  stage: number;
  pair?: number;
  className?: string;
};

export function AboutSignalField3D({
  mode,
  stage,
  pair = 0,
  className,
}: AboutSignalField3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef(stage);
  const pairRef = useRef(pair);
  const prefersReducedMotion = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    pairRef.current = pair;
  }, [pair]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    function mountCanvasFallback() {
      if (!container || disposed) return () => undefined;

      const canvas = document.createElement("canvas");
      canvas.setAttribute("data-about-signal-canvas", mode);
      canvas.setAttribute("data-about-signal-renderer", "canvas-2d");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      container.appendChild(canvas);

      const context = canvas.getContext("2d");
      if (!context) {
        canvas.remove();
        return () => undefined;
      }

      let width = 1;
      let height = 1;
      let ratio = 1;
      let raf = 0;
      let running = false;
      let lastRender = 0;
      const pointer = { x: 0, y: 0 };
      const pointerTarget = { x: 0, y: 0 };
      const pointerSurface =
        (container.closest("[data-scroll-story]") as HTMLElement | null) ??
        container.parentElement ??
        container;

      function resize() {
        if (!container) return;
        width = Math.max(container.clientWidth, 1);
        height = Math.max(container.clientHeight, 1);
        ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
      }

      function onPointerMove(event: PointerEvent) {
        if (event.pointerType === "touch") return;
        const bounds = pointerSurface.getBoundingClientRect();
        pointerTarget.x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
        pointerTarget.y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
      }

      function onPointerLeave() {
        pointerTarget.x = 0;
        pointerTarget.y = 0;
      }

      function drawRecognition(time: number) {
        const activeStage = Math.max(0, Math.min(2, stageRef.current));
        const unit = Math.min(width, height);
        const centerX = width * 0.5 + pointer.x * unit * 0.035;
        const centerY = height * 0.51 - pointer.y * unit * 0.025;
        const spacing = Math.min(width * 0.245, unit * 0.66);
        const ringWidth = Math.min(width * 0.13, unit * 0.35);
        const ringHeight = ringWidth * 1.34;
        const drift = Math.sin(time * 0.00055) * unit * 0.018;

        const atmosphere = context.createRadialGradient(
          centerX,
          centerY,
          unit * 0.03,
          centerX,
          centerY,
          unit * 0.68,
        );
        atmosphere.addColorStop(0, "rgba(212, 122, 79, 0.14)");
        atmosphere.addColorStop(0.42, "rgba(150, 91, 67, 0.055)");
        atmosphere.addColorStop(1, "rgba(13, 23, 19, 0)");
        context.fillStyle = atmosphere;
        context.fillRect(0, 0, width, height);

        const anchors = [-1, 0, 1].map((offset, index) => ({
          x: centerX + offset * spacing,
          y: centerY + drift + (index === 1 ? -unit * 0.025 : unit * 0.012),
        }));

        anchors.forEach((anchor, index) => {
          const active = index === activeStage;
          const scale = active ? 1.15 : index < activeStage ? 0.94 : 0.82;
          const rotation = (index - 1) * 0.13 + pointer.x * 0.035;
          const planeWidth = ringWidth * 1.28 * scale;
          const planeHeight = ringHeight * 1.34 * scale;
          const plane = context.createLinearGradient(
            anchor.x - planeWidth * 0.5,
            anchor.y - planeHeight * 0.5,
            anchor.x + planeWidth * 0.5,
            anchor.y + planeHeight * 0.5,
          );
          plane.addColorStop(0, active ? "rgba(232, 223, 208, 0.13)" : "rgba(101, 114, 93, 0.055)");
          plane.addColorStop(0.55, active ? "rgba(150, 91, 67, 0.1)" : "rgba(150, 91, 67, 0.035)");
          plane.addColorStop(1, "rgba(13, 23, 19, 0)");

          context.save();
          context.translate(anchor.x, anchor.y);
          context.rotate(rotation);
          context.fillStyle = plane;
          context.strokeStyle = active ? "rgba(232, 223, 208, 0.22)" : "rgba(101, 114, 93, 0.13)";
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(-planeWidth * 0.42, -planeHeight * 0.5);
          context.lineTo(planeWidth * 0.5, -planeHeight * 0.37);
          context.lineTo(planeWidth * 0.39, planeHeight * 0.5);
          context.lineTo(-planeWidth * 0.5, planeHeight * 0.34);
          context.closePath();
          context.fill();
          context.stroke();

          context.shadowColor = active ? "rgba(212, 122, 79, 0.9)" : "rgba(150, 91, 67, 0.38)";
          context.shadowBlur = active ? 26 : 12;
          context.strokeStyle = active ? "rgba(244, 239, 230, 0.92)" : "rgba(212, 185, 154, 0.55)";
          context.lineWidth = active ? 2.4 : 1.35;
          context.beginPath();
          context.ellipse(
            0,
            0,
            ringWidth * 0.5 * scale,
            ringHeight * 0.5 * scale,
            Math.sin(time * 0.00038 + index) * 0.1,
            0,
            Math.PI * 2,
          );
          context.stroke();

          context.shadowBlur = 0;
          context.strokeStyle = active ? "rgba(212, 122, 79, 0.76)" : "rgba(101, 114, 93, 0.38)";
          context.lineWidth = 1;
          context.setLineDash([3, 9]);
          context.lineDashOffset = -time * 0.012 * (index % 2 === 0 ? 1 : -1);
          context.beginPath();
          context.ellipse(0, 0, ringWidth * 0.67 * scale, ringHeight * 0.31 * scale, -0.18, 0, Math.PI * 2);
          context.stroke();
          context.setLineDash([]);
          context.restore();
        });

        context.save();
        context.shadowColor = "rgba(212, 122, 79, 0.9)";
        context.shadowBlur = 16;
        const thread = context.createLinearGradient(anchors[0].x, 0, anchors[2].x, 0);
        thread.addColorStop(0, "rgba(150, 91, 67, 0.42)");
        thread.addColorStop(0.5, "rgba(244, 239, 230, 0.95)");
        thread.addColorStop(1, "rgba(212, 122, 79, 0.52)");
        context.strokeStyle = thread;
        context.lineWidth = 1.8;
        context.beginPath();
        context.moveTo(anchors[0].x - ringWidth * 0.7, anchors[0].y + unit * 0.035);
        context.bezierCurveTo(
          anchors[0].x,
          anchors[0].y - unit * 0.03,
          anchors[1].x - unit * 0.14,
          anchors[1].y + unit * 0.035,
          anchors[1].x,
          anchors[1].y,
        );
        context.bezierCurveTo(
          anchors[1].x + unit * 0.14,
          anchors[1].y - unit * 0.035,
          anchors[2].x,
          anchors[2].y + unit * 0.04,
          anchors[2].x + ringWidth * 0.7,
          anchors[2].y - unit * 0.02,
        );
        context.stroke();
        context.restore();

        anchors.forEach((anchor, index) => {
          const pulse = 1 + Math.sin(time * 0.002 + index * 1.7) * 0.18;
          context.fillStyle = index === activeStage ? "rgba(244, 239, 230, 0.96)" : "rgba(212, 185, 154, 0.72)";
          context.shadowColor = "rgba(212, 122, 79, 0.9)";
          context.shadowBlur = index === activeStage ? 18 : 8;
          context.beginPath();
          context.arc(anchor.x, anchor.y, (index === activeStage ? 5.5 : 3.4) * pulse, 0, Math.PI * 2);
          context.fill();
        });
        context.shadowBlur = 0;
      }

      function drawSynthesis(time: number) {
        const activeStage = Math.max(0, Math.min(2, stageRef.current));
        const unit = Math.min(width, height);
        const centerX = width * 0.5 + pointer.x * unit * 0.03;
        const centerY = height * 0.5 - pointer.y * unit * 0.025;
        const resolve = activeStage / 2;
        const pairTilt = (pairRef.current - 1.5) * 0.018;

        const atmosphere = context.createRadialGradient(
          centerX,
          centerY,
          unit * 0.015,
          centerX,
          centerY,
          unit * 0.64,
        );
        atmosphere.addColorStop(0, "rgba(232, 223, 208, 0.18)");
        atmosphere.addColorStop(0.18, "rgba(212, 122, 79, 0.095)");
        atmosphere.addColorStop(0.58, "rgba(101, 114, 93, 0.065)");
        atmosphere.addColorStop(1, "rgba(13, 23, 19, 0)");
        context.fillStyle = atmosphere;
        context.fillRect(0, 0, width, height);

        context.save();
        context.translate(centerX, centerY);
        context.rotate(pairTilt + pointer.x * 0.018);

        const spread = unit * (0.27 - resolve * 0.045);
        const sheetHeight = unit * 0.5;
        for (let index = 0; index < 7; index += 1) {
          const depth = index / 6;
          const inset = depth * unit * (0.032 + resolve * 0.012);
          const y = (index - 3) * unit * 0.018 + Math.sin(time * 0.0007 + index) * unit * 0.008;
          const sheetWidth = unit * (0.095 - depth * 0.018);
          const opacity = 0.1 + depth * 0.055;

          [-1, 1].forEach((side) => {
            const x = side * (spread - inset);
            const moss = side === 1;
            const fill = context.createLinearGradient(
              x - side * sheetWidth,
              -sheetHeight * 0.5,
              x,
              sheetHeight * 0.5,
            );
            fill.addColorStop(0, moss ? `rgba(101, 114, 93, ${opacity})` : `rgba(212, 122, 79, ${opacity + 0.03})`);
            fill.addColorStop(0.55, moss ? `rgba(232, 223, 208, ${opacity * 0.82})` : `rgba(150, 91, 67, ${opacity})`);
            fill.addColorStop(1, "rgba(13, 23, 19, 0.015)");
            context.fillStyle = fill;
            context.strokeStyle = moss ? "rgba(184, 194, 174, 0.22)" : "rgba(230, 177, 145, 0.25)";
            context.lineWidth = depth > 0.7 ? 1.2 : 0.8;
            context.beginPath();
            context.moveTo(x - side * sheetWidth, y - sheetHeight * (0.4 + depth * 0.03));
            context.lineTo(x + side * sheetWidth * 0.13, y - sheetHeight * 0.5);
            context.lineTo(x + side * sheetWidth * 0.02, y + sheetHeight * 0.48);
            context.lineTo(x - side * sheetWidth * 0.84, y + sheetHeight * (0.36 + depth * 0.04));
            context.closePath();
            context.fill();
            context.stroke();
          });
        }

        context.shadowColor = "rgba(212, 122, 79, 0.88)";
        context.shadowBlur = 24;
        const beamWidth = unit * (0.018 + activeStage * 0.004);
        const beam = context.createLinearGradient(-beamWidth, 0, beamWidth, 0);
        beam.addColorStop(0, "rgba(150, 91, 67, 0)");
        beam.addColorStop(0.35, "rgba(212, 122, 79, 0.62)");
        beam.addColorStop(0.5, "rgba(244, 239, 230, 0.96)");
        beam.addColorStop(0.65, "rgba(212, 122, 79, 0.62)");
        beam.addColorStop(1, "rgba(150, 91, 67, 0)");
        context.fillStyle = beam;
        context.fillRect(-beamWidth, -sheetHeight * (0.52 + activeStage * 0.06), beamWidth * 2, sheetHeight * (1.04 + activeStage * 0.12));
        context.shadowBlur = 0;

        [0.16, 0.25, 0.35].forEach((radius, index) => {
          const pulse = 1 + Math.sin(time * 0.0012 + index) * 0.035 + activeStage * 0.03;
          context.save();
          context.rotate((index % 2 === 0 ? 1 : -1) * time * 0.000055 + index * 0.23);
          context.strokeStyle = index === 1 ? "rgba(212, 122, 79, 0.52)" : "rgba(101, 114, 93, 0.38)";
          context.lineWidth = index === 1 ? 1.6 : 1;
          context.beginPath();
          context.ellipse(0, 0, unit * radius * pulse, unit * radius * 0.24 * pulse, 0, 0, Math.PI * 2);
          context.stroke();
          context.restore();
        });

        context.fillStyle = "rgba(244, 239, 230, 0.96)";
        context.shadowColor = "rgba(212, 122, 79, 0.95)";
        context.shadowBlur = 18;
        context.beginPath();
        context.arc(0, 0, 5.5 + activeStage, 0, Math.PI * 2);
        context.fill();
        context.restore();
        context.shadowBlur = 0;
      }

      function tick(time: number) {
        if (!running) return;
        raf = requestAnimationFrame(tick);
        if (time - lastRender < 33) return;
        lastRender = time;
        pointer.x += (pointerTarget.x - pointer.x) * 0.055;
        pointer.y += (pointerTarget.y - pointer.y) * 0.055;
        context.clearRect(0, 0, width, height);
        if (mode === "recognition") drawRecognition(time);
        else drawSynthesis(time);
      }

      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      pointerSurface.addEventListener("pointermove", onPointerMove, { passive: true });
      pointerSurface.addEventListener("pointerleave", onPointerLeave);

      const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !running) {
            running = true;
            raf = requestAnimationFrame(tick);
          } else if (!entry.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0.05 },
      );
      visibilityObserver.observe(container);

      return () => {
        running = false;
        cancelAnimationFrame(raf);
        visibilityObserver.disconnect();
        resizeObserver.disconnect();
        pointerSurface.removeEventListener("pointermove", onPointerMove);
        pointerSurface.removeEventListener("pointerleave", onPointerLeave);
        canvas.remove();
      };
    }

    async function boot() {
      const probe = document.createElement("canvas");
      const supportsWebGL = Boolean(
        probe.getContext("webgl2", { alpha: true }) ||
          probe.getContext("webgl", { alpha: true }),
      );
      if (!supportsWebGL) {
        cleanup = mountCanvasFallback();
        return;
      }

      const THREE = await import("three");
      if (disposed || !container) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch {
        cleanup = mountCanvasFallback();
        return;
      }

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = mode === "recognition" ? 1.08 : 1.18;
      renderer.domElement.setAttribute("data-about-signal-canvas", mode);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
      camera.position.set(0, 0, mode === "recognition" ? 6.4 : 6.8);

      const root = new THREE.Group();
      scene.add(root);

      const hemisphere = new THREE.HemisphereLight(
        mode === "recognition" ? 0xf4efe6 : 0xfff7ea,
        mode === "recognition" ? 0x0d1713 : 0x65725d,
        mode === "recognition" ? 1.7 : 2.2,
      );
      const keyLight = new THREE.DirectionalLight(0xffe5c8, 3.3);
      keyLight.position.set(-3.5, 4.5, 5.5);
      const rimLight = new THREE.DirectionalLight(
        mode === "recognition" ? 0x965b43 : 0x65725d,
        2.4,
      );
      rimLight.position.set(4.5, -1.5, 3);
      scene.add(hemisphere, keyLight, rimLight);

      const recognitionRings: import("three").Mesh[] = [];
      const recognitionVeils: import("three").Mesh[] = [];
      const synthesisLeft: import("three").Mesh[] = [];
      const synthesisRight: import("three").Mesh[] = [];
      const synthesisHalos: import("three").Mesh[] = [];
      let synthesisSignal: import("three").Mesh | undefined;

      if (mode === "recognition") {
        const positions = [-1.72, 0, 1.72];
        positions.forEach((x, index) => {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.62, 0.042, 18, 88),
            new THREE.MeshPhysicalMaterial({
              color: index === 1 ? 0xd4b99a : 0x965b43,
              emissive: index === 1 ? 0x493323 : 0x321b13,
              emissiveIntensity: 0.34,
              metalness: 0.42,
              roughness: 0.28,
              clearcoat: 0.8,
              clearcoatRoughness: 0.24,
            }),
          );
          ring.position.set(x, index === 1 ? 0.12 : -0.04, (index - 1) * 0.16);
          ring.rotation.set(0.1 * (index - 1), 0.28 * (index - 1), 0);
          recognitionRings.push(ring);
          root.add(ring);

          const veil = new THREE.Mesh(
            new THREE.PlaneGeometry(1.28, 1.72),
            new THREE.MeshPhysicalMaterial({
              color: index === 1 ? 0xe8dfd0 : 0x65725d,
              transparent: true,
              opacity: index === 1 ? 0.18 : 0.1,
              roughness: 0.7,
              metalness: 0,
              side: THREE.DoubleSide,
              depthWrite: false,
            }),
          );
          veil.position.set(x, 0, -0.28 + index * 0.05);
          veil.rotation.y = 0.18 * (index - 1);
          recognitionVeils.push(veil);
          root.add(veil);
        });

        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-2.85, -0.22, 0.18),
          new THREE.Vector3(-1.72, -0.04, 0.18),
          new THREE.Vector3(0, 0.12, 0.22),
          new THREE.Vector3(1.72, -0.04, 0.2),
          new THREE.Vector3(2.85, 0.18, 0.26),
        ]);
        const thread = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 112, 0.018, 10, false),
          new THREE.MeshStandardMaterial({
            color: 0xd47a4f,
            emissive: 0x965b43,
            emissiveIntensity: 1.2,
            metalness: 0.22,
            roughness: 0.36,
          }),
        );
        root.add(thread);

        for (let index = 0; index < 9; index += 1) {
          const point = curve.getPoint(index / 8);
          const node = new THREE.Mesh(
            new THREE.SphereGeometry(index === 4 ? 0.08 : 0.045, 18, 18),
            new THREE.MeshStandardMaterial({
              color: index === 4 ? 0xf4efe6 : 0xd4b99a,
              emissive: 0x965b43,
              emissiveIntensity: index === 4 ? 1.4 : 0.7,
              roughness: 0.28,
            }),
          );
          node.position.copy(point);
          root.add(node);
        }
      } else {
        const sheetGeometry = new THREE.BoxGeometry(0.055, 1.65, 0.72);
        for (let index = 0; index < 7; index += 1) {
          const offset = index * 0.18;
          const left = new THREE.Mesh(
            sheetGeometry.clone(),
            new THREE.MeshPhysicalMaterial({
              color: index % 2 === 0 ? 0x965b43 : 0xd4b99a,
              transparent: true,
              opacity: 0.42 + index * 0.045,
              roughness: 0.58,
              metalness: 0.05,
              side: THREE.DoubleSide,
            }),
          );
          left.position.set(-1.55 + offset, (index - 3) * 0.09, -0.55 + index * 0.15);
          left.rotation.set(0.03 * (index - 3), -0.34 + index * 0.045, -0.08);
          synthesisLeft.push(left);
          root.add(left);

          const right = new THREE.Mesh(
            sheetGeometry.clone(),
            new THREE.MeshPhysicalMaterial({
              color: index % 2 === 0 ? 0x65725d : 0xebe3d6,
              transparent: true,
              opacity: 0.4 + index * 0.045,
              roughness: 0.62,
              metalness: 0.04,
              side: THREE.DoubleSide,
            }),
          );
          right.position.set(1.55 - offset, (3 - index) * 0.09, -0.55 + index * 0.15);
          right.rotation.set(-0.03 * (index - 3), 0.34 - index * 0.045, 0.08);
          synthesisRight.push(right);
          root.add(right);
        }
        sheetGeometry.dispose();

        synthesisSignal = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 2.65, 0.14),
          new THREE.MeshPhysicalMaterial({
            color: 0x965b43,
            emissive: 0x6f3524,
            emissiveIntensity: 0.62,
            metalness: 0.3,
            roughness: 0.32,
            clearcoat: 0.7,
          }),
        );
        root.add(synthesisSignal);

        [0.58, 0.92, 1.28].forEach((radius, index) => {
          const halo = new THREE.Mesh(
            new THREE.TorusGeometry(radius, 0.018, 12, 96),
            new THREE.MeshStandardMaterial({
              color: index === 1 ? 0x965b43 : 0x65725d,
              transparent: true,
              opacity: 0.34 - index * 0.06,
              emissive: index === 1 ? 0x5c2f22 : 0x314234,
              emissiveIntensity: 0.38,
              depthWrite: false,
            }),
          );
          halo.rotation.x = Math.PI * 0.5;
          halo.rotation.z = index * 0.42;
          synthesisHalos.push(halo);
          root.add(halo);
        });
      }

      function resize() {
        if (!container) return;
        const width = Math.max(container.clientWidth, 1);
        const height = Math.max(container.clientHeight, 1);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }
      resize();

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      const pointer = { x: 0, y: 0 };
      const pointerTarget = { x: 0, y: 0 };
      const pointerSurface =
        (container.closest("[data-scroll-story]") as HTMLElement | null) ??
        container.parentElement ??
        container;
      function onPointerMove(event: PointerEvent) {
        if (event.pointerType === "touch") return;
        const bounds = pointerSurface.getBoundingClientRect();
        pointerTarget.x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
        pointerTarget.y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
      }
      function onPointerLeave() {
        pointerTarget.x = 0;
        pointerTarget.y = 0;
      }
      pointerSurface.addEventListener("pointermove", onPointerMove, { passive: true });
      pointerSurface.addEventListener("pointerleave", onPointerLeave);

      let raf = 0;
      let running = false;
      let lastRender = 0;
      function tick(time: number) {
        if (!running) return;
        raf = requestAnimationFrame(tick);
        if (time - lastRender < 33) return;
        lastRender = time;

        pointer.x = THREE.MathUtils.lerp(pointer.x, pointerTarget.x, 0.055);
        pointer.y = THREE.MathUtils.lerp(pointer.y, pointerTarget.y, 0.055);
        const activeStage = Math.max(0, Math.min(2, stageRef.current));

        root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, pointer.x * 0.18, 0.045);
        root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, -pointer.y * 0.12, 0.045);
        root.position.y = Math.sin(time * 0.00055) * 0.045;

        if (mode === "recognition") {
          recognitionRings.forEach((ring, index) => {
            const targetScale = index === activeStage ? 1.34 : index < activeStage ? 0.96 : 0.78;
            const nextScale = THREE.MathUtils.lerp(ring.scale.x, targetScale, 0.07);
            ring.scale.setScalar(nextScale);
            ring.rotation.z += (index % 2 === 0 ? 1 : -1) * 0.0022;
            const material = ring.material as import("three").MeshPhysicalMaterial;
            material.emissiveIntensity = THREE.MathUtils.lerp(
              material.emissiveIntensity,
              index === activeStage ? 1.25 : 0.22,
              0.07,
            );
          });
          recognitionVeils.forEach((veil, index) => {
            const material = veil.material as import("three").MeshPhysicalMaterial;
            material.opacity = THREE.MathUtils.lerp(
              material.opacity,
              index === activeStage ? 0.28 : 0.07,
              0.06,
            );
            veil.position.z = THREE.MathUtils.lerp(
              veil.position.z,
              index === activeStage ? -0.08 : -0.35,
              0.05,
            );
          });
        } else {
          const resolve = activeStage / 2;
          synthesisLeft.forEach((sheet, index) => {
            sheet.position.x = THREE.MathUtils.lerp(
              sheet.position.x,
              -1.5 + index * (0.16 + resolve * 0.045),
              0.05,
            );
            sheet.rotation.y += 0.0012 + index * 0.00008;
          });
          synthesisRight.forEach((sheet, index) => {
            sheet.position.x = THREE.MathUtils.lerp(
              sheet.position.x,
              1.5 - index * (0.16 + resolve * 0.045),
              0.05,
            );
            sheet.rotation.y -= 0.0012 + index * 0.00008;
          });
          synthesisHalos.forEach((halo, index) => {
            halo.rotation.z += (index % 2 === 0 ? 1 : -1) * (0.0018 + activeStage * 0.0006);
            const pulse = 1 + Math.sin(time * 0.0012 + index) * 0.025;
            halo.scale.setScalar(pulse + activeStage * 0.035);
          });
          if (synthesisSignal) {
            const targetY = 0.58 + activeStage * 0.22;
            synthesisSignal.scale.y = THREE.MathUtils.lerp(synthesisSignal.scale.y, targetY, 0.06);
            synthesisSignal.rotation.y += 0.003 + pairRef.current * 0.0007;
          }
          root.rotation.z = THREE.MathUtils.lerp(
            root.rotation.z,
            (pairRef.current - 1.5) * 0.025,
            0.045,
          );
        }

        renderer.render(scene, camera);
      }

      const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !running) {
            running = true;
            raf = requestAnimationFrame(tick);
          } else if (!entry.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0.05 },
      );
      visibilityObserver.observe(container);

      cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        visibilityObserver.disconnect();
        resizeObserver.disconnect();
        pointerSurface.removeEventListener("pointermove", onPointerMove);
        pointerSurface.removeEventListener("pointerleave", onPointerLeave);
        root.traverse((object) => {
          const mesh = object as import("three").Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry.dispose();
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => material.dispose());
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loadObserver.disconnect();
        void boot().catch(() => {
          if (!disposed && !cleanup) cleanup = mountCanvasFallback();
        });
      },
      { rootMargin: "520px 0px", threshold: 0 },
    );
    loadObserver.observe(container);

    return () => {
      disposed = true;
      loadObserver.disconnect();
      cleanup?.();
    };
  }, [mode, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className={["pointer-events-none absolute inset-0 overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    />
  );
}
