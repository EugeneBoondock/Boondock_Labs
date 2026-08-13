"use client";

import { createCssSpriteRenderer, createFrameAnimator } from "@/lib/oil-motion";
import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 36;
const REST_FRAME = 18;

export default function OilLogoMotion({ className }: { className?: string }) {
  const spriteRef = useRef<HTMLDivElement>(null);
  const animatorRef = useRef<ReturnType<typeof createFrameAnimator> | null>(
    null,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sprite = spriteRef.current;
    if (!sprite) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const image = new Image();
    let idleTimer = 0;
    let userIsDriving = false;

    image.onload = () => {
      const renderFrame = createCssSpriteRenderer(sprite, 6, 6);
      animatorRef.current = createFrameAnimator({
        frameCount: FRAME_COUNT,
        initialFrame: REST_FRAME,
        smoothTime: 0.16,
        maxSpeed: 72,
        reducedMotion: mediaQuery.matches,
        render: renderFrame,
      });
      setReady(true);

      if (!mediaQuery.matches) {
        idleTimer = window.setInterval(() => {
          if (userIsDriving) return;
          const drift = Math.sin(performance.now() / 1500) * 2.5;
          animatorRef.current?.setTarget(REST_FRAME + drift);
        }, 700);
      }
    };
    image.src = "/motion/boondock-logo-atlas.webp";

    const setFromPointer = (event: PointerEvent) => {
      const bounds = sprite.getBoundingClientRect();
      userIsDriving = true;
      const progress = Math.min(
        1,
        Math.max(0, (event.clientX - bounds.left) / bounds.width),
      );
      animatorRef.current?.setProgress(progress);
    };

    const returnToRest = () => {
      userIsDriving = false;
      animatorRef.current?.setTarget(REST_FRAME);
    };

    sprite.addEventListener("pointermove", setFromPointer, { passive: true });
    sprite.addEventListener("pointerleave", returnToRest);

    return () => {
      window.clearInterval(idleTimer);
      sprite.removeEventListener("pointermove", setFromPointer);
      sprite.removeEventListener("pointerleave", returnToRest);
      animatorRef.current?.destroy();
      animatorRef.current = null;
    };
  }, []);

  return (
    <div className={className} data-ready={ready} aria-hidden="true">
      <div className="oil-logo-fallback" />
      <div ref={spriteRef} className="oil-logo-sprite" />
    </div>
  );
}
