"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  AudioLines,
  Bot,
  Braces,
  BrainCircuit,
  BriefcaseBusiness,
  Database,
  FileDown,
  Github,
  HeartPulse,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  MessageSquareText,
  Network,
  Package,
  Rocket,
  ShoppingBag,
  Twitter,
  UtensilsCrossed,
  Workflow,
} from "lucide-react";
import ClippyAssistant from "./ClippyAssistant";
import OpeningGate from "./OpeningGate";

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */

const signalStats = [
  { value: "17+", label: "Live APIs orchestrated inside one platform" },
  { value: "30+", label: "AI tools unified into a single product surface" },
  { value: "4+", label: "Published packages — wrappers and MCP servers" },
  { value: "1,027", label: "Poems archived into a searchable, discussable PWA" },
] as const;

const featuredProjects = [
  {
    title: "Morphed.io",
    description:
      "End-to-end platform architecture — frontend systems, backend infrastructure, custom API design, and a complete MCP server engineered from the ground up.",
    impact:
      "The kind of build that reveals range: product instinct, systems thinking, implementation depth, and protocol fluency in a single engagement.",
    image: "/morphed.png",
    href: "https://morphed.io",
    tags: ["Full-stack architecture", "Custom APIs", "MCP tooling"],
  },
  {
    title: "Earthie.world",
    description:
      "A living Earth2 intelligence layer — real-time market telemetry, interactive cartography, and an AI companion hardened against platform complexity.",
    impact:
      "Seventeen APIs integrated without losing clarity. Complex integrations are where the work gets interesting.",
    image: "/earthie-world.png",
    href: "https://earthie.world",
    tags: ["17+ integrations", "Realtime data", "Interactive maps"],
  },
  {
    title: "EntropySuite.co.za",
    description:
      "Thirty-plus AI instruments for analysis, conversion, and experimentation — unified into one product surface that stays fast and navigable.",
    impact:
      "The challenge was not the tools themselves. It was making a broad feature surface feel coherent and effortless.",
    image: "/entropysuite.png",
    href: "https://entropysuite.co.za",
    tags: ["AI product design", "Tool ecosystems", "React"],
  },
  {
    title: "Bikode",
    description:
      "A native Windows code editor built in C and Win32 — AI-assisted, Git-integrated, plugin-ready. Close to the metal by choice.",
    impact:
      "Evidence that the work here is not limited to the web stack. Hard problems. Low-level engineering. By preference.",
    image: "/bikode.png",
    href: "https://bikode.co.za",
    tags: ["C / Win32", "Editor engineering", "AI integration"],
  },
] as const;

const additionalProjects = [
  {
    title: "KinSpace",
    domain: "kinspace.co.za",
    description:
      "A community architecture for people living with chronic and mental health challenges — built around safety, meaningful connection, and clinical resource access.",
    href: "https://www.kinspace.co.za/",
    tags: ["Community platform", "Support UX", "React"],
    icon: HeartPulse,
    image: "/kinspace.png",
    surface:
      "linear-gradient(145deg, rgba(74, 154, 156, 0.8) 0%, rgba(8, 8, 10, 0.92) 100%)",
  },
  {
    title: "PathNote",
    domain: "pathnote.co.za",
    description:
      "An audible location engine that transforms walks into narrative audio journeys — using live geolocation, mapping intelligence, and AI-directed storytelling.",
    href: "https://www.pathnote.co.za/",
    tags: ["Geolocation", "Audio UX", "AI storytelling"],
    icon: AudioLines,
    image: null,
    surface:
      "linear-gradient(145deg, rgba(29, 82, 99, 0.8) 0%, rgba(6, 6, 8, 0.92) 100%)",
  },
  {
    title: "MessageCFO",
    domain: "messagecfo.com",
    description:
      "WhatsApp-native financial operations — invoicing, expense tracking, balance sheets, and client management through conversational interface.",
    href: "https://messagecfo.com",
    tags: ["WhatsApp workflows", "Fintech ops", "PostgreSQL"],
    icon: MessageSquareText,
    image: null,
    surface:
      "linear-gradient(145deg, rgba(26, 74, 55, 0.8) 0%, rgba(6, 8, 7, 0.92) 100%)",
  },
  {
    title: "Platedom",
    domain: "platedom.com",
    description:
      "AI-powered restaurant merchandising — transforming menus into high-fidelity visual experiences and stronger digital presence for food brands.",
    href: "https://platedom.com",
    tags: ["Hospitality tech", "Generative media", "Firebase"],
    icon: UtensilsCrossed,
    image: null,
    surface:
      "linear-gradient(145deg, rgba(108, 61, 34, 0.8) 0%, rgba(10, 8, 6, 0.92) 100%)",
  },
] as const;

const toolingProjects = [
  {
    title: "earth2-api-wrapper",
    label: "Published package",
    description:
      "A clean TypeScript wrapper around the Earth2 API — properties, accounts, transactions, and marketplace data made composable for downstream builds.",
    href: "https://www.npmjs.com/package/earth2-api-wrapper",
    cta: "View on npm",
    icon: Database,
    tags: ["TypeScript", "API wrapper", "Earth2"],
  },
  {
    title: "earth2-mcp-server",
    label: "Protocol tooling",
    description:
      "A complete MCP server that lets AI clients access Earth2 account data, wallet activity, properties, and marketplace actions through structured tools.",
    href: "https://www.npmjs.com/package/earth2-mcp-server",
    cta: "View on npm",
    icon: Network,
    tags: ["MCP server", "Claude tools", "Earth2"],
  },
  {
    title: "morphed-mcp-server",
    label: "Protocol tooling",
    description:
      "Built from scratch for Morphed.io — platform APIs turned into usable AI tools with authentication, data access, and production-grade architecture.",
    href: "https://www.npmjs.com/package/morphed-mcp-server",
    cta: "View on npm",
    icon: Rocket,
    tags: ["MCP server", "Custom tools", "Platform APIs"],
  },
  {
    title: "hubspot-mcp-server",
    label: "Protocol tooling",
    description:
      "An extended HubSpot MCP implementation with deeper CRM operations, stronger integration ergonomics, and more serious backend architecture than standard demos.",
    href: "https://www.npmjs.com/package/hubspot-mcp-server",
    cta: "View on npm",
    icon: Package,
    tags: ["HubSpot", "MCP server", "CRM integration"],
  },
] as const;

const capabilities = [
  {
    icon: Layers3,
    title: "Product Engineering",
    body: "Interfaces built with structure, conviction, and taste. Translating unclear requirements into products that feel composed from first impression to final interaction.",
    details: ["Next.js and React", "Responsive systems", "UX polish with intent"],
  },
  {
    icon: BrainCircuit,
    title: "AI-Native Systems",
    body: "AI is not decoration here. It is part of the product architecture — assistants, structured workflows, model orchestration, and protocol tooling designed as first-class features.",
    details: ["Gemini and LLM workflows", "MCP servers", "Prompt and tool design"],
  },
  {
    icon: Braces,
    title: "Backend and Integrations",
    body: "The invisible engineering most portfolios omit: authentication, API architecture, database design, third-party integration complexity, edge cases, and the structural work that makes products hold.",
    details: ["Custom APIs", "OAuth flows", "Databases and automation"],
  },
] as const;

const principles = [
  {
    number: "01",
    title: "Full surface ownership.",
    body: "Frontend, backend, AI systems, integrations, and design intent — connected, not siloed. One person, one coherent vision.",
  },
  {
    number: "02",
    title: "Speed without compromise.",
    body: "AI accelerates the workflow. Judgement stays human. Velocity is for going deeper, not cutting corners.",
  },
  {
    number: "03",
    title: "Complexity made legible.",
    body: "Ambitious products still need elegance. Flow, hierarchy, language, and the feel of a system in the hand — these are engineering decisions.",
  },
  {
    number: "04",
    title: "Drawn to hard problems.",
    body: "Protocol design, unusual integrations, unconventional product ideas, architecture from nothing. The difficult edge is where the best work lives.",
  },
] as const;

const toolStack = [
  "Next.js", "React", "TypeScript", "Node.js", "Python",
  "PostgreSQL", "Supabase", "MCP", "Gemini", "OpenAI",
  "Claude", "Tailwind CSS",
] as const;

const processSteps = [
  {
    icon: Workflow,
    title: "Find the real brief",
    body: "Most projects hide their actual problem behind the initial ask. Better scope and better decisions begin with finding it.",
  },
  {
    icon: Rocket,
    title: "Design for leverage",
    body: "Architecture that survives growth: clean data flow, honest abstractions, and integration points established before they become painful.",
  },
  {
    icon: BrainCircuit,
    title: "Apply AI with intent",
    body: "Automation, assistants, and model capabilities added with purpose. Stronger products, not trend compliance.",
  },
  {
    icon: Mail,
    title: "Refine until it reads",
    body: "Good software communicates. Copy, motion, layout, and interaction quality are not cosmetic — they are structural credibility.",
  },
] as const;

const pricingTiers = [
  {
    icon: Layers3,
    title: "Starter Website",
    price: "R3,000 - R10,000",
    summary: "Portfolio sites, landing pages, and compact business websites that need to look sharp and ship cleanly.",
    details: ["Up to 3 pages", "Responsive build", "Basic SEO setup"],
  },
  {
    icon: BriefcaseBusiness,
    title: "Business Website",
    price: "R11,000 - R15,000",
    summary: "Fuller company sites with stronger structure, more content depth, and proper lead capture.",
    details: ["Up to 8 pages", "Forms and maps", "Blog and enhanced SEO"],
  },
  {
    icon: ShoppingBag,
    title: "E-commerce Build",
    price: "R15,000 - R20,000",
    summary: "Online stores with product structure, payment flow, and enough polish to feel trustworthy from day one.",
    details: ["Catalog and checkout", "Order flow", "Admin handover basics"],
  },
  {
    icon: Rocket,
    title: "Custom Product Build",
    price: "From R30,000+",
    summary: "Platforms, dashboards, AI-heavy products, and custom systems with deeper engineering and more moving parts.",
    details: ["Custom features", "Data systems", "Advanced UX and integrations"],
  },
  {
    icon: Network,
    title: "MCP Server Engineering",
    price: "R20,000 - R50,000",
    summary: "APIs turned into usable model tools with proper architecture, testing, and publishable packaging.",
    details: ["Custom MCP tools", "NPM packaging", "Docs and testing"],
  },
  {
    icon: Database,
    title: "API and Integration Work",
    price: "R15,000 - R40,000",
    summary: "Backend systems, auth flows, endpoint design, and platform integration work that powers the product behind the curtain.",
    details: ["REST architecture", "Auth and database work", "Documentation and security"],
  },
] as const;

const socialLinks = [
  { label: "GitHub", href: "https://github.com/EugeneBoondock", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/eboondock/", icon: Linkedin },
  { label: "Twitter", href: "https://twitter.com/eugeneboondock", icon: Twitter },
] as const;

/* ═══════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════ */

function SceneBreak() {
  return (
    <div className="scene-break" aria-hidden="true">
      <div className="scene-break-line" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════ */

export default function Home() {
  const gateRef = useRef<HTMLDivElement>(null);
  const [navVisible, setNavVisible] = useState(false);

  /* Nav visibility — appears when gate exits viewport */
  useEffect(() => {
    if (!gateRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNavVisible(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(gateRef.current);
    return () => observer.disconnect();
  }, []);

  /* Scroll reveal system */
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ClippyAssistant>
      {/* Atmospheric fixed overlay */}
      <div className="page-atmosphere" aria-hidden="true" />

      {/* ── Gate ── */}
      <div ref={gateRef}>
        <OpeningGate />
      </div>

      {/* ── Fixed nav ── */}
      <header className={`fixed-nav ${navVisible ? "fixed-nav-visible" : ""}`}>
        <div className="fixed-nav-inner">
          <a href="#top" className="fixed-nav-mark">BL</a>
          <nav className="fixed-nav-links">
            <a href="#work">Work</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#investment">Investment</a>
            <a href="#contact">Contact</a>
            <a href="#contact" className="fixed-nav-cta">
              Start a conversation
            </a>
          </nav>
        </div>
      </header>

      {/* ── Main flow ── */}
      <div className="main-flow">

        {/* ─────────── STATEMENT ─────────── */}
        <section className="statement">
          <h2 className="statement-declaration" data-reveal>
            I build software that holds up.
          </h2>
          <p className="statement-body" data-reveal data-reveal-delay="1">
            Full-stack products, AI-native systems, and protocol tooling —
            shaped with architectural depth, visual conviction, and the kind
            of care that makes complex things feel inevitable.
          </p>

          <div className="statement-actions" data-reveal data-reveal-delay="2">
            <a href="#work" className="btn-solid">
              View the work
            </a>
            <a
              href="/Eugene_CV_Fullstack.pdf"
              className="btn-ghost"
              target="_blank"
              rel="noreferrer"
            >
              <FileDown className="h-4 w-4" />
              Download CV
            </a>
          </div>

          <div className="statement-callout" data-reveal data-reveal-delay="3">
            <Bot className="h-4 w-4 shrink-0 text-[var(--accent-teal)]" />
            <p>
              Clippy is active. Ask about project depth, stack details,
              rates, or the short version.
            </p>
          </div>

          <div className="statement-stats" data-reveal data-reveal-delay="4">
            {signalStats.map((stat) => (
              <div key={stat.label} className="stat-block">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <SceneBreak />

        {/* ─────────── CONVICTIONS ─────────── */}
        <section data-reveal>
          <div className="section-wrap p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
              <div className="space-y-4">
                <p className="mono-label">Why this studio</p>
                <h2 className="section-heading">
                  Bridging concept, interface, architecture, and execution —
                  without flattening the work.
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {principles.map((p) => (
                  <article key={p.number} className="principle-card">
                    <p className="mono-label">{p.number}</p>
                    <h3 className="text-lg font-semibold text-[var(--ink-strong)]">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-7 text-[var(--muted)]">
                      {p.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SceneBreak />

        {/* ─────────── SELECTED WORK ─────────── */}
        <section id="work">
          <div className="max-w-3xl space-y-4 mb-12" data-reveal>
            <p className="mono-label">Selected work</p>
            <h2 className="section-heading">
              Built across the full surface. Judged by what holds.
            </h2>
            <p className="section-body">
              Each project demanded a different shape of thinking. The portfolio
              reads as range because the work required it — not because diversity
              was the goal.
            </p>
          </div>

          {/* Featured project scenes */}
          <div className="space-y-8">
            {featuredProjects.map((project, index) => (
              <div
                key={project.title}
                className={`scene ${index % 2 === 1 ? "scene-alt" : ""}`}
                data-reveal
              >
                <div className="scene-content">
                  <p className="scene-number">
                    {String(index + 1).padStart(2, "0")} / Case study
                  </p>
                  <h3 className="scene-title">{project.title}</h3>
                  <p className="scene-description">{project.description}</p>
                  <p className="scene-impact">{project.impact}</p>
                  <div className="scene-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="stack-chip">{tag}</span>
                    ))}
                  </div>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="scene-link"
                  >
                    Visit project
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="scene-media">
                  <Image
                    src={project.image}
                    alt={`${project.title} project preview`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Additional projects */}
          <div className="grid gap-5 lg:grid-cols-2 mt-12">
            {additionalProjects.map((project) => {
              const Icon = project.icon;
              return (
                <article key={project.title} className="portfolio-card" data-reveal>
                  <div className="project-media">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={`${project.title} preview`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 45vw, 100vw"
                      />
                    ) : (
                      <div
                        className="relative flex h-full min-h-[240px] flex-col justify-between overflow-hidden p-6 text-white"
                        style={{ background: project.surface }}
                      >
                        <div className="absolute inset-0 opacity-25">
                          <div className="absolute inset-x-[-12%] top-[18%] h-px rotate-[-12deg] bg-white/15" />
                          <div className="absolute inset-x-[-8%] top-[46%] h-px rotate-[8deg] bg-white/10" />
                          <div className="absolute inset-x-[-10%] bottom-[20%] h-px rotate-[-7deg] bg-white/12" />
                        </div>
                        <div className="relative z-10 flex items-center justify-between gap-4">
                          <div className="icon-badge border-white/8 bg-white/6 text-white">
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="mono-label !mb-0 !text-white/40">{project.domain}</p>
                        </div>
                        <div className="relative z-10 max-w-md space-y-2">
                          <h3 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="mono-label">{project.domain}</p>
                        <h3 className="text-xl font-semibold text-[var(--ink-strong)]">
                          {project.title}
                        </h3>
                      </div>
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link"
                      >
                        Visit <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                    <p className="text-sm leading-7 text-[var(--muted)]">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="stack-chip">{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <SceneBreak />

        {/* ─────────── INFRASTRUCTURE ─────────── */}
        <section>
          <div className="max-w-3xl space-y-4 mb-8" data-reveal>
            <p className="mono-label">Open source & protocol engineering</p>
            <h2 className="section-heading">
              The infrastructure underneath the interfaces.
            </h2>
            <p className="section-body">
              Wrappers, MCP servers, and developer tooling built for real
              integration depth and AI-native workflows. Published, documented,
              production-facing.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {toolingProjects.map((project, index) => {
              const Icon = project.icon;
              return (
                <article
                  key={project.title}
                  className="pricing-card"
                  data-reveal
                  data-reveal-delay={String(index + 1)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="icon-badge">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="pricing-pill">{project.label}</div>
                    </div>
                    <div className="space-y-2">
                      <p className="mono-label">Package / protocol</p>
                      <h3 className="text-xl font-semibold text-[var(--ink-strong)]">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-7 text-[var(--muted)]">
                      {project.description}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="stack-chip">{tag}</span>
                      ))}
                    </div>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link w-fit"
                    >
                      {project.cta} <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <SceneBreak />

        {/* ─────────── CAPABILITIES ─────────── */}
        <section id="capabilities">
          <div className="max-w-3xl space-y-4 mb-8" data-reveal>
            <p className="mono-label">Capabilities</p>
            <h2 className="section-heading">
              Deep stack. Sharper taste.
            </h2>
            <p className="section-body">
              Most developers can wire frameworks together. The difference is
              knowing what to build, what to leave out, and how to make complex
              systems feel simple.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {capabilities.map((cap, index) => {
              const Icon = cap.icon;
              return (
                <article
                  key={cap.title}
                  className="capability-card"
                  data-reveal
                  data-reveal-delay={String(index + 1)}
                >
                  <div className="flex items-center gap-3">
                    <div className="icon-badge">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--ink-strong)]">
                      {cap.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    {cap.body}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cap.details.map((d) => (
                      <span key={d} className="stack-chip">{d}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="section-wrap mt-8 p-6 sm:p-8" data-reveal>
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div className="space-y-4">
                <p className="mono-label">Current toolkit</p>
                <h3 className="text-2xl font-semibold text-[var(--ink-strong)] lg:text-3xl">
                  Working across modern web, AI infrastructure, and custom
                  integration layers.
                </h3>
                <p className="text-sm leading-7 text-[var(--muted)]">
                  Equally at home shipping clean frontends, backend systems,
                  data pipelines, and AI-enhanced workflows. The range produces
                  coherent systems rather than disconnected pieces.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {toolStack.map((t) => (
                  <span key={t} className="tool-chip">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SceneBreak />

        {/* ─────────── INVESTMENT ─────────── */}
        <section id="investment">
          <div className="max-w-3xl space-y-4 mb-8" data-reveal>
            <p className="mono-label">Investment</p>
            <h2 className="section-heading">
              Scope-honest. No filler.
            </h2>
            <p className="section-body">
              Ranges for the work I usually take on. Final pricing follows
              complexity, integration depth, urgency, and how much of the
              system falls under my ownership.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {pricingTiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <article
                  key={tier.title}
                  className="pricing-card"
                  data-reveal
                  data-reveal-delay={String((index % 3) + 1)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="icon-badge">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="mono-label">Engagement</p>
                        <h3 className="text-xl font-semibold text-[var(--ink-strong)]">
                          {tier.title}
                        </h3>
                      </div>
                    </div>
                    <div className="pricing-pill">{tier.price}</div>
                  </div>
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    {tier.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tier.details.map((d) => (
                      <span key={d} className="stack-chip">{d}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="section-wrap mt-8 p-6 sm:p-8" data-reveal>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="mono-label">Pricing note</p>
                <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">
                  When a project spans product strategy, interface design, backend
                  architecture, AI workflows, and custom integrations — it enters
                  the custom range. For a faster estimate, Clippy can qualify scope
                  before you reach out.
                </p>
              </div>
              <a href="#contact" className="btn-solid self-start lg:self-auto">
                Ask for a quote
              </a>
            </div>
          </div>
        </section>

        <SceneBreak />

        {/* ─────────── PROCESS ─────────── */}
        <section>
          <div className="max-w-3xl space-y-4 mb-8" data-reveal>
            <p className="mono-label">Process</p>
            <h2 className="section-heading">
              From ambiguity to architecture to artifact.
            </h2>
            <p className="section-body">
              The projects change shape. The rhythm stays: find the real problem,
              design the structure, build with precision, refine until it reads.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="process-card"
                  data-reveal
                  data-reveal-delay={String(index + 1)}
                >
                  <div className="icon-badge">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mono-label">Step {index + 1}</p>
                  <h3 className="text-lg font-semibold text-[var(--ink-strong)]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    {step.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <SceneBreak />

        {/* ─────────── CONTACT ─────────── */}
        <section id="contact" data-reveal>
          <div className="section-wrap contact-panel p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
              <div className="space-y-5">
                <p className="mono-label">Contact</p>
                <h2 className="section-heading !text-[clamp(2rem,4vw,3rem)]">
                  If the work is serious, the door is open.
                </h2>
                <p className="max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                  Taking on contract work, freelance builds, and teams that want
                  a developer with real ownership range. Serious briefs. Real
                  ambition. That is the filter.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="mailto:philosncube@gmail.com" className="btn-solid">
                    <Mail className="h-4 w-4" />
                    philosncube@gmail.com
                  </a>
                  <a
                    href="/Eugene_CV_Fullstack.pdf"
                    className="btn-ghost"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FileDown className="h-4 w-4" />
                    View CV
                  </a>
                </div>
              </div>

              <div className="grid gap-4">
                <article className="contact-card">
                  <div className="flex items-center gap-3">
                    <div className="icon-badge">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="mono-label">Location</p>
                      <p className="text-lg font-medium text-[var(--ink-strong)]">
                        Edenvale, South Africa
                      </p>
                    </div>
                  </div>
                </article>

                <article className="contact-card">
                  <p className="mono-label">Profiles</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {socialLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="social-card"
                        >
                          <Icon className="h-5 w-5" />
                          <span>{link.label}</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                </article>

                <article className="contact-card">
                  <p className="mono-label">Before you email</p>
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    Try Clippy first: ask which project demonstrates backend depth,
                    how AI fits into the real workflow, or whether this is the right
                    fit for a product engineering engagement.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="site-footer-rule" />
        <div className="site-footer-text">
          <span>Boondock Labs</span>
          <span>Edenvale, South Africa</span>
        </div>
      </footer>
    </ClippyAssistant>
  );
}
