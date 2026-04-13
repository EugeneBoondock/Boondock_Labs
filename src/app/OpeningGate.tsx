"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, animate } from "animejs";

export default function OpeningGate() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const scope = createScope({ root: rootRef }).add(() => {
      createTimeline({
        defaults: { ease: "outExpo" },
      })
        .add("[data-gate-rule]", {
          scaleX: [0, 1],
          opacity: [0, 0.25],
          duration: 1400,
          ease: "outQuart",
        })
        .add(
          "[data-gate-name]",
          {
            opacity: [0, 1],
            letterSpacing: ["0.4em", "0.2em"],
            duration: 1600,
          },
          "-=700"
        )
        .add(
          "[data-gate-sub]",
          {
            opacity: [0, 1],
            translateY: [10, 0],
            duration: 1000,
          },
          "-=500"
        )
        .add(
          "[data-gate-scroll]",
          {
            opacity: [0, 0.45],
            translateY: [6, 0],
            duration: 800,
          },
          "-=200"
        )
        .init();

      animate("[data-gate-pulse]", {
        scaleY: [1, 1.6],
        opacity: [0.4, 0.1],
        alternate: true,
        loop: true,
        ease: "inOutSine",
        duration: 2400,
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <section ref={rootRef} className="gate" id="top">
      <div className="gate-vignette" aria-hidden="true" />
      <div className="gate-atmosphere" aria-hidden="true" />

      <div className="gate-rule" data-gate-rule aria-hidden="true" />

      <div className="gate-content">
        <h1 className="gate-name" data-gate-name>
          Boondock Labs
        </h1>
        <p className="gate-sub" data-gate-sub>
          Software studio — Edenvale, South Africa
        </p>
      </div>

      <div className="gate-scroll" data-gate-scroll>
        <span className="gate-scroll-label">Scroll</span>
        <span className="gate-scroll-line" data-gate-pulse />
      </div>
    </section>
  );
}
