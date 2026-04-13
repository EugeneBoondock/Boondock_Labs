"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, animate } from "animejs";

const MOTES = [
  { x: 12, y: 18, delay: 0, dur: 11 },
  { x: 68, y: 25, delay: 2.2, dur: 14 },
  { x: 25, y: 72, delay: 0.8, dur: 10 },
  { x: 82, y: 55, delay: 3.0, dur: 13 },
  { x: 45, y: 10, delay: 1.2, dur: 9 },
  { x: 55, y: 88, delay: 3.8, dur: 12 },
  { x: 8, y: 45, delay: 0.4, dur: 11 },
  { x: 92, y: 38, delay: 2.6, dur: 10 },
  { x: 35, y: 32, delay: 1.6, dur: 14 },
  { x: 78, y: 76, delay: 1.0, dur: 12 },
  { x: 18, y: 60, delay: 4.2, dur: 13 },
  { x: 60, y: 42, delay: 2.0, dur: 11 },
] as const;

export default function OpeningGate() {
  const rootRef = useRef<HTMLDivElement>(null);

  /* ── Parallax: gate content floats away as you scroll ── */
  useEffect(() => {
    const onScroll = () => {
      if (!rootRef.current) return;
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      rootRef.current.style.setProperty("--gp", String(progress));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Entrance choreography ── */
  useEffect(() => {
    if (!rootRef.current) return;

    const scope = createScope({ root: rootRef }).add(() => {
      createTimeline({
        defaults: { ease: "outExpo" },
      })
        /* corner brackets fade in */
        .add("[data-gate-corner]", {
          opacity: [0, 0.4],
          duration: 800,
          delay: 200,
          ease: "outQuart",
        })
        /* vertical rule draws downward */
        .add(
          "[data-gate-rule-v]",
          {
            scaleY: [0, 1],
            opacity: [0, 0.12],
            duration: 1200,
            ease: "outQuart",
          },
          "-=400"
        )
        /* horizontal rule draws outward */
        .add(
          "[data-gate-rule]",
          {
            scaleX: [0, 1],
            opacity: [0, 0.2],
            duration: 1400,
            ease: "outQuart",
          },
          "-=800"
        )
        /* ambient orb fades in */
        .add(
          "[data-gate-orb]",
          {
            opacity: [0, 0.5],
            scale: [0.6, 1],
            duration: 2000,
            ease: "outQuad",
          },
          "-=1200"
        )
        /* studio name emerges */
        .add(
          "[data-gate-name]",
          {
            opacity: [0, 1],
            letterSpacing: ["0.45em", "0.2em"],
            translateY: [8, 0],
            duration: 1800,
          },
          "-=1400"
        )
        /* subtitle appears */
        .add(
          "[data-gate-sub]",
          {
            opacity: [0, 0.7],
            translateY: [12, 0],
            duration: 1100,
          },
          "-=600"
        )
        /* motes fade in */
        .add(
          ".gate-mote",
          {
            opacity: [0, 1],
            duration: 1200,
          },
          "-=800"
        )
        /* scroll indicator appears */
        .add(
          "[data-gate-scroll]",
          {
            opacity: [0, 0.5],
            translateY: [8, 0],
            duration: 900,
          },
          "-=400"
        )
        .init();

      /* Ambient loops */
      animate("[data-gate-pulse]", {
        scaleY: [1, 1.8],
        opacity: [0.45, 0.08],
        alternate: true,
        loop: true,
        ease: "inOutSine",
        duration: 2400,
      });

      animate("[data-gate-orb]", {
        scale: [1, 1.25],
        opacity: [0.5, 0.75],
        alternate: true,
        loop: true,
        ease: "inOutSine",
        duration: 7000,
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <section ref={rootRef} className="gate" id="top">
      {/* Atmosphere */}
      <div className="gate-vignette" aria-hidden="true" />
      <div className="gate-atmosphere" aria-hidden="true" />

      {/* Ambient orb — warm breathing glow */}
      <div className="gate-orb" data-gate-orb aria-hidden="true" />

      {/* Floating motes — dust in a darkened theater */}
      {MOTES.map((m, i) => (
        <div
          key={i}
          className="gate-mote"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.dur}s`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Crosshair rules */}
      <div className="gate-rule" data-gate-rule aria-hidden="true" />
      <div className="gate-rule-v" data-gate-rule-v aria-hidden="true" />

      {/* Viewfinder corners */}
      <div className="gate-corner gate-corner-tl" data-gate-corner aria-hidden="true" />
      <div className="gate-corner gate-corner-tr" data-gate-corner aria-hidden="true" />
      <div className="gate-corner gate-corner-bl" data-gate-corner aria-hidden="true" />
      <div className="gate-corner gate-corner-br" data-gate-corner aria-hidden="true" />

      {/* Content */}
      <div className="gate-content">
        <h1 className="gate-name" data-gate-name>
          Boondock Labs
        </h1>
        <p className="gate-sub" data-gate-sub>
          Software studio, Edenvale, South Africa
        </p>
      </div>

      {/* Scroll cue */}
      <div className="gate-scroll" data-gate-scroll>
        <span className="gate-scroll-label">Scroll</span>
        <span className="gate-scroll-line" data-gate-pulse />
      </div>
    </section>
  );
}
