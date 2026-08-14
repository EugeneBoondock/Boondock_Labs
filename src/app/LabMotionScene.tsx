"use client";

import { createCssSpriteRenderer, createFrameAnimator } from "@/lib/oil-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./portfolio.module.css";

const FRAME_COUNT = 24;

export default function LabMotionScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const sprite = spriteRef.current;
    if (!root || !sprite) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const image = new Image();
    let animator: ReturnType<typeof createFrameAnimator> | null = null;
    let raf = 0;

    const updateFromScroll = () => {
      raf = 0;
      if (!animator) return;
      const bounds = root.getBoundingClientRect();
      const travel = window.innerHeight + bounds.height;
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - bounds.top) / travel),
      );
      animator.setProgress(progress);
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(updateFromScroll);
    };

    image.onload = () => {
      animator = createFrameAnimator({
        frameCount: FRAME_COUNT,
        initialFrame: reducedMotion ? 11 : 0,
        smoothTime: 0.18,
        maxSpeed: 54,
        reducedMotion,
        render: createCssSpriteRenderer(sprite, 6, 4),
      });
      setReady(true);
      updateFromScroll();
      if (!reducedMotion) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
      }
    };
    image.src = "/motion/lab-workbench-atlas.webp?v=2";

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
      animator?.destroy();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.labMotion}
      data-ready={ready}
      role="img"
      aria-label="A dark software workbench with an oscilloscope, server rack, circuit boards and a robotic arm"
    >
      <div className={styles.labMotionFallback} aria-hidden="true" />
      <div
        ref={spriteRef}
        className={styles.labMotionSprite}
        aria-hidden="true"
      />
      <div className={styles.labSweep} aria-hidden="true" />
      <p className={styles.labMotionHint}>Scroll to inspect the bench</p>
    </div>
  );
}
