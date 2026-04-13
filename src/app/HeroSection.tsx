"use client";

import { createScope, createTimeline, animate, splitText, stagger } from "animejs";
import Image from "next/image";
import { Bot, FileDown, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

const signalStats = [
  {
    value: "17+",
    label: "Live APIs orchestrated inside one platform",
  },
  {
    value: "30+",
    label: "AI tools unified into a single product surface",
  },
  {
    value: "4+",
    label: "Published packages — wrappers and MCP servers",
  },
  {
    value: "1,027",
    label: "Poems archived into a searchable, discussable PWA",
  },
] as const;

const stagePanels = [
  {
    className: "hero-panel hero-panel-main",
    image: "/morphed.png",
    alt: "Morphed interface preview",
    title: "Morphed.io",
    description: "Platform architecture and protocol engineering",
  },
  {
    className: "hero-panel hero-panel-secondary hero-float",
    image: "/earthie-world.png",
    alt: "Earthie interface preview",
    title: "Earthie.world",
    description: "Integrated telemetry, cartography, and realtime data",
  },
  {
    className: "hero-panel hero-panel-tertiary hero-float",
    image: "/bikode.png",
    alt: "Bikode interface preview",
    title: "Bikode",
    description: "Native editor engineering with AI integration",
  },
] as const;

const speedLines = [
  { top: "14%", width: "68%", delay: 0 },
  { top: "28%", width: "82%", delay: 180 },
  { top: "46%", width: "74%", delay: 320 },
  { top: "67%", width: "88%", delay: 120 },
  { top: "84%", width: "63%", delay: 260 },
] as const;

export default function HeroSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const scope = createScope({ root: rootRef }).add(() => {
      const split = splitText("[data-hero-title]", {
        chars: { class: "hero-char" },
      });

      createTimeline({
        defaults: {
          ease: "outExpo",
          duration: 1100,
        },
      })
        .add("[data-hero-kicker]", {
          opacity: [0, 1],
          translateY: [18, 0],
        })
        .add(
          split.chars,
          {
            opacity: [0, 1],
            translateY: ["1.1em", "0em"],
            rotateZ: [4, 0],
            delay: stagger(18),
            duration: 880,
          },
          "-=720",
        )
        .add(
          "[data-hero-body]",
          {
            opacity: [0, 1],
            translateY: [18, 0],
          },
          "-=520",
        )
        .add(
          ".hero-action",
          {
            opacity: [0, 1],
            translateY: [18, 0],
            delay: stagger(90),
            duration: 740,
          },
          "-=450",
        )
        .add(
          ".hero-stat-card",
          {
            opacity: [0, 1],
            translateY: [24, 0],
            scale: [0.94, 1],
            delay: stagger(85),
            duration: 780,
          },
          "-=440",
        )
        .add(
          ".hero-panel",
          {
            opacity: [0, 1],
            translateX: ["10%", "0%"],
            translateY: ["8%", "0%"],
            rotate: [3, 0],
            delay: stagger(140),
            duration: 1100,
          },
          "-=980",
        )
        .add(
          ".hero-emblem, .hero-accent-orb, .hero-side-rail",
          {
            opacity: [0, 1],
            scale: [0.92, 1],
            delay: stagger(120),
            duration: 860,
          },
          "-=740",
        )
        .init();

      animate(".hero-speed-line", {
        scaleX: [0.1, 1],
        opacity: [0, 0.7, 0],
        ease: "inOutSine",
        duration: 2200,
        delay: (_, index) => Number(speedLines[index]?.delay ?? 0),
        loop: true,
      });

      animate(".hero-float", {
        translateY: [-6, 6],
        alternate: true,
        loop: true,
        ease: "inOutSine",
        duration: 3200,
        delay: stagger(280),
      });

      animate(".hero-accent-orb", {
        scale: [0.96, 1.06],
        rotate: ["-10deg", "10deg"],
        alternate: true,
        loop: true,
        ease: "inOutQuad",
        duration: 4000,
      });

      return () => {
        split.revert();
      };
    });

    return () => scope.revert();
  }, []);

  return (
    <section ref={rootRef} className="hero-layout">
      <div className="hero-copy">
        <div className="hero-kicker-row" data-hero-kicker>
          <span className="hero-index">Act 01</span>
          <span className="hero-kicker-dot" />
          <span>Boondock Labs</span>
          <span className="hero-kicker-dot" />
          <span>Eugene Loyiso Boondock</span>
        </div>

        <div className="hero-heading-wrap">
          <p className="mono-label">Portfolio / built with conviction</p>
          <h1 className="hero-title" data-hero-title>
            Interfaces with conviction. Architecture with teeth. Code that holds.
          </h1>
        </div>

        <p className="hero-body" data-hero-body>
          Full-stack products and AI systems built with structural care,
          visual tension, and the kind of engineering depth that template
          stacks cannot approximate.
        </p>

        <div className="hero-action-row">
          <a href="#work" className="btn-solid hero-action">
            View the work
          </a>
          <a
            href="/Eugene_CV_Fullstack.pdf"
            className="btn-ghost hero-action"
            target="_blank"
            rel="noreferrer"
          >
            <FileDown className="h-4 w-4" />
            Download CV
          </a>
        </div>

        <div className="hero-callout hero-action">
          <Bot className="h-4 w-4 text-[var(--accent-teal)]" />
          <p>
            Clippy is active. Ask about project depth, stack details,
            rates, or the short version.
          </p>
        </div>

        <div className="hero-stats-grid">
          {signalStats.map((stat) => (
            <article key={stat.label} className="hero-stat-card">
              <p className="hero-stat-value">{stat.value}</p>
              <p className="hero-stat-label">{stat.label}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="hero-stage">
        <div className="hero-stage-shell">
          <div className="hero-stage-lines" aria-hidden="true">
            {speedLines.map((line) => (
              <span
                key={`${line.top}-${line.width}`}
                className="hero-speed-line"
                style={{ top: line.top, width: line.width }}
              />
            ))}
          </div>

          <div className="hero-side-rail" aria-hidden="true">
            signal · craft · systems
          </div>

          {stagePanels.map((panel) => (
            <article key={panel.title} className={panel.className}>
              <div className="hero-panel-media">
                <Image
                  src={panel.image}
                  alt={panel.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
              </div>
              <div className="hero-panel-copy">
                <p className="mono-label">{panel.title}</p>
                <p>{panel.description}</p>
              </div>
            </article>
          ))}

          <article className="hero-panel hero-panel-data hero-float">
            <p className="mono-label">Current trajectory</p>
            <h2>Systems that feel authored.</h2>
            <p>
              Full-stack product work, AI-native tooling, MCP architecture, and
              interfaces built with sharper rhythm than the template standard.
            </p>
          </article>

          <div className="hero-emblem hero-float" aria-hidden="true">
            <span>ELB</span>
          </div>

          <div className="hero-accent-orb hero-float" aria-hidden="true" />

          <div className="hero-stage-caption">
            <Sparkles className="h-4 w-4" />
            motion, contrast, and signal — not generic layout
          </div>
        </div>
      </div>
    </section>
  );
}
