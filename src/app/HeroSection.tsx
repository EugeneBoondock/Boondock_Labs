"use client";

import { createScope, createTimeline, animate, splitText, stagger } from "animejs";
import Image from "next/image";
import { Bot, FileDown, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

const signalStats = [
  {
    value: "17+",
    label: "APIs orchestrated inside a single live platform",
  },
  {
    value: "30+",
    label: "AI tools shaped into one coherent product suite",
  },
  {
    value: "3",
    label: "Published packages spanning wrappers and MCP servers",
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
    description: "Platform engineering and protocol tooling",
  },
  {
    className: "hero-panel hero-panel-secondary hero-float",
    image: "/earthie-world.png",
    alt: "Earthie interface preview",
    title: "Earthie.world",
    description: "Integrated data, mapping, and realtime signals",
  },
  {
    className: "hero-panel hero-panel-tertiary hero-float",
    image: "/bikode.png",
    alt: "Bikode interface preview",
    title: "Bikode",
    description: "Native editor engineering with AI assistance",
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
          duration: 900,
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
            rotateZ: [6, 0],
            delay: stagger(14),
            duration: 720,
          },
          "-=620",
        )
        .add(
          "[data-hero-body]",
          {
            opacity: [0, 1],
            translateY: [18, 0],
          },
          "-=420",
        )
        .add(
          ".hero-action",
          {
            opacity: [0, 1],
            translateY: [18, 0],
            delay: stagger(90),
            duration: 640,
          },
          "-=350",
        )
        .add(
          ".hero-stat-card",
          {
            opacity: [0, 1],
            translateY: [24, 0],
            scale: [0.94, 1],
            delay: stagger(85),
            duration: 680,
          },
          "-=340",
        )
        .add(
          ".hero-panel",
          {
            opacity: [0, 1],
            translateX: ["10%", "0%"],
            translateY: ["8%", "0%"],
            rotate: [3, 0],
            delay: stagger(120),
            duration: 980,
          },
          "-=880",
        )
        .add(
          ".hero-emblem, .hero-accent-orb, .hero-side-rail",
          {
            opacity: [0, 1],
            scale: [0.92, 1],
            delay: stagger(120),
            duration: 760,
          },
          "-=640",
        )
        .init();

      animate(".hero-speed-line", {
        scaleX: [0.1, 1],
        opacity: [0, 0.9, 0],
        ease: "inOutSine",
        duration: 1800,
        delay: (_, index) => Number(speedLines[index]?.delay ?? 0),
        loop: true,
      });

      animate(".hero-float", {
        translateY: [-8, 8],
        alternate: true,
        loop: true,
        ease: "inOutSine",
        duration: 2600,
        delay: stagger(220),
      });

      animate(".hero-accent-orb", {
        scale: [0.96, 1.06],
        rotate: ["-10deg", "10deg"],
        alternate: true,
        loop: true,
        ease: "inOutQuad",
        duration: 3400,
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
          <p className="mono-label">Portfolio / engineered with intent</p>
          <h1 className="hero-title" data-hero-title>
            Anime energy, product discipline, and code that actually holds up.
          </h1>
        </div>

        <p className="hero-body" data-hero-body>
          I build web products and AI systems with a storyboard mindset: strong
          pacing, sharp composition, and enough engineering underneath the style
          to survive real use. The goal is not gimmick. The goal is impact.
        </p>

        <div className="hero-action-row">
          <a href="#work" className="btn-solid hero-action">
            Enter selected work
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
            Clippy is still here as the chat layer. Ask for project fit, stack
            depth, rates, or the fast summary.
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
            signal / motion / systems
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
            <p className="mono-label">Current vector</p>
            <h2>Building systems that still feel cinematic.</h2>
            <p>
              Full-stack product work, AI-native tooling, MCP architecture, and
              interfaces with sharper visual rhythm than the usual template stack.
            </p>
          </article>

          <div className="hero-emblem hero-float" aria-hidden="true">
            <span>ELB</span>
          </div>

          <div className="hero-accent-orb hero-float" aria-hidden="true" />

          <div className="hero-stage-caption">
            <Sparkles className="h-4 w-4" />
            storyboarding the portfolio instead of stacking generic sections
          </div>
        </div>
      </div>
    </section>
  );
}
