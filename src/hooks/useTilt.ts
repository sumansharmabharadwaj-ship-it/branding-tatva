import { useEffect, type RefObject } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

export type Tilt = {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
};

const TILT_SPRING = { stiffness: 300, damping: 30, mass: 0.5 };

// A 3D perspective tilt that follows the cursor within an element —
// rotateX/rotateY only (both GPU-composited transform properties), no
// layout involved. Moving the mouse toward the top tilts the far edge
// away from the viewer, like the card is a physical card being turned
// under a light. `maxDegrees` caps how far it can tilt; kept modest by
// callers (a handful of degrees) so it reads as responsive rather than
// gimmicky.
export function useTilt(
  ref: RefObject<HTMLElement | null>,
  maxDegrees = 8,
  disabled = false
): Tilt {
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rawRotateX.set(-py * maxDegrees * 2);
      rawRotateY.set(px * maxDegrees * 2);
    }
    function handleLeave() {
      rawRotateX.set(0);
      rawRotateY.set(0);
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref, maxDegrees, disabled, rawRotateX, rawRotateY]);

  return { rotateX, rotateY };
}
