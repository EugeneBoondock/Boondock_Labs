"use client";

import Image from "next/image";
import {
  AudioLines,
  ArrowUpRight,
  Database,
  Braces,
  BrainCircuit,
  BriefcaseBusiness,
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
import HeroSection from "./HeroSection";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Pricing", href: "#pricing" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
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
    layout: "wide",
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
    layout: "tall",
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
    layout: "standard",
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
    layout: "standard",
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
      "linear-gradient(145deg, rgba(74, 154, 156, 0.85) 0%, rgba(10, 10, 12, 0.92) 100%)",
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
      "linear-gradient(145deg, rgba(29, 82, 99, 0.85) 0%, rgba(8, 8, 10, 0.92) 100%)",
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
      "linear-gradient(145deg, rgba(26, 74, 55, 0.85) 0%, rgba(8, 10, 9, 0.92) 100%)",
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
      "linear-gradient(145deg, rgba(108, 61, 34, 0.85) 0%, rgba(12, 10, 8, 0.92) 100%)",
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
    body:
      "Interfaces built with structure, conviction, and taste. Translating unclear requirements into products that feel composed from first impression to final interaction.",
    details: ["Next.js and React", "Responsive systems", "UX polish with intent"],
  },
  {
    icon: BrainCircuit,
    title: "AI-Native Systems",
    body:
      "AI is not decoration here. It is part of the product architecture — assistants, structured workflows, model orchestration, and protocol tooling designed as first-class features.",
    details: ["Gemini and LLM workflows", "MCP servers", "Prompt and tool design"],
  },
  {
    icon: Braces,
    title: "Backend and Integrations",
    body:
      "The invisible engineering most portfolios omit: authentication, API architecture, database design, third-party integration complexity, edge cases, and the structural work that makes products hold.",
    details: ["Custom APIs", "OAuth flows", "Databases and automation"],
  },
] as const;

const operatingPrinciples = [
  {
    number: "01",
    title: "Full surface ownership.",
    description:
      "Frontend, backend, AI systems, integrations, and design intent — connected, not siloed. One person, one coherent vision.",
  },
  {
    number: "02",
    title: "Speed without compromise.",
    description:
      "AI accelerates the workflow. Judgement stays human. Velocity is for going deeper, not cutting corners.",
  },
  {
    number: "03",
    title: "Complexity made legible.",
    description:
      "Ambitious products still need elegance. Flow, hierarchy, language, and the feel of a system in the hand — these are engineering decisions.",
  },
  {
    number: "04",
    title: "Drawn to hard problems.",
    description:
      "Protocol design, unusual integrations, unconventional product ideas, architecture from nothing. The difficult edge is where the best work lives.",
  },
] as const;

const toolStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Supabase",
  "MCP",
  "Gemini",
  "OpenAI",
  "Claude",
  "Tailwind CSS",
] as const;

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/EugeneBoondock",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/eboondock/",
    icon: Linkedin,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/eugeneboondock",
    icon: Twitter,
  },
] as const;

const staggerClasses = ["stagger-1", "stagger-2", "stagger-3", "stagger-4"] as const;

const processSteps = [
  {
    icon: Workflow,
    title: "Find the real brief",
    body:
      "Most projects hide their actual problem behind the initial ask. Better scope and better decisions begin with finding it.",
  },
  {
    icon: Rocket,
    title: "Design for leverage",
    body:
      "Architecture that survives growth: clean data flow, honest abstractions, and integration points established before they become painful.",
  },
  {
    icon: BrainCircuit,
    title: "Apply AI with intent",
    body:
      "Automation, assistants, and model capabilities added with purpose. Stronger products, not trend compliance.",
  },
  {
    icon: Mail,
    title: "Refine until it reads",
    body:
      "Good software communicates. Copy, motion, layout, and interaction quality are not cosmetic — they are structural credibility.",
  },
] as const;

const pricingTiers = [
  {
    icon: Layers3,
    title: "Starter Website",
    price: "R3,000 - R10,000",
    summary:
      "Portfolio sites, landing pages, and compact business websites that need to look sharp and ship cleanly.",
    details: ["Up to 3 pages", "Responsive build", "Basic SEO setup"],
  },
  {
    icon: BriefcaseBusiness,
    title: "Business Website",
    price: "R11,000 - R15,000",
    summary:
      "Fuller company sites with stronger structure, more content depth, and proper lead capture.",
    details: ["Up to 8 pages", "Forms and maps", "Blog and enhanced SEO"],
  },
  {
    icon: ShoppingBag,
    title: "E-commerce Build",
    price: "R15,000 - R20,000",
    summary:
      "Online stores with product structure, payment flow, and enough polish to feel trustworthy from day one.",
    details: ["Catalog and checkout", "Order flow", "Admin handover basics"],
  },
  {
    icon: Rocket,
    title: "Custom Product Build",
    price: "From R30,000+",
    summary:
      "Platforms, dashboards, AI-heavy products, and custom systems with deeper engineering and more moving parts.",
    details: ["Custom features", "Data systems", "Advanced UX and integrations"],
  },
  {
    icon: Network,
    title: "MCP Server Engineering",
    price: "R20,000 - R50,000",
    summary:
      "APIs turned into usable model tools with proper architecture, testing, and publishable packaging.",
    details: ["Custom MCP tools", "NPM packaging", "Docs and testing"],
  },
  {
    icon: Database,
    title: "API and Integration Work",
    price: "R15,000 - R40,000",
    summary:
      "Backend systems, auth flows, endpoint design, and platform integration work that powers the product behind the curtain.",
    details: ["REST architecture", "Auth and database work", "Documentation and security"],
  },
] as const;

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="mono-label">{eyebrow}</p>
      <h2 className="text-4xl font-semibold leading-tight text-[var(--ink-strong)] sm:text-5xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <ClippyAssistant>
      <main className="page-shell">
        <div className="page-grid" aria-hidden="true" />

        <header className="nav-shell">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4">
            <a href="#top" className="flex items-center gap-3 text-[var(--ink)]">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[rgba(255,255,255,0.04)]">
                <Image
                  src="/Boondocklabs.png"
                  alt="Boondock Labs logo"
                  fill
                  className="object-cover"
                  sizes="48px"
                  priority
                />
              </div>
              <div>
                <p className="mono-label !mb-1">Boondock Labs</p>
                <p className="text-sm font-medium text-[var(--muted)]">
                  Eugene Loyiso Boondock
                </p>
              </div>
            </a>

            <nav className="flex flex-wrap items-center justify-end gap-2 text-sm text-[var(--muted)]">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="nav-link">
                  {link.label}
                </a>
              ))}
              <a href="#contact" className="btn-solid">
                Start a conversation
              </a>
            </nav>
          </div>
        </header>

        <div
          id="top"
          className="mx-auto flex w-full max-w-7xl flex-col gap-28 px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:gap-36 lg:pt-32"
        >
          <HeroSection />

          <section className="section-wrap soft-rise stagger-3 p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
              <div className="space-y-4">
                <p className="mono-label">Why this studio</p>
                <h2 className="text-3xl font-semibold leading-tight text-[var(--ink-strong)] sm:text-4xl">
                  Bridging concept, interface, architecture, and execution — without
                  flattening the work.
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {operatingPrinciples.map((principle) => (
                  <article key={principle.number} className="principle-card">
                    <p className="mono-label">{principle.number}</p>
                    <h3 className="text-xl font-semibold text-[var(--ink-strong)]">
                      {principle.title}
                    </h3>
                    <p className="text-sm leading-7 text-[var(--muted)]">
                      {principle.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <div className="section-divider" />

          <section id="work" className="space-y-8">
            <SectionIntro
              eyebrow="Selected work"
              title="Built across the full surface. Judged by what holds."
              description="Each project demanded a different shape of thinking. The portfolio reads as range because the work required it — not because diversity was the goal."
            />

            <div className="grid gap-5 lg:grid-cols-12">
              {featuredProjects.map((project, index) => (
                <article
                  key={project.title}
                  className={`portfolio-card soft-rise ${
                    project.layout === "wide"
                      ? "lg:col-span-7"
                      : project.layout === "tall"
                        ? "lg:col-span-5"
                        : "lg:col-span-6"
                  } ${index % 2 === 0 ? "stagger-2" : "stagger-3"}`}
                >
                  <div className="project-media">
                    <Image
                      src={project.image}
                      alt={`${project.title} project preview`}
                      fill
                      className="object-cover"
                      sizes={
                        project.layout === "wide"
                          ? "(min-width: 1024px) 55vw, 100vw"
                          : "(min-width: 1024px) 40vw, 100vw"
                      }
                    />
                  </div>

                  <div className="space-y-4 p-6 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="mono-label">Case study</p>
                        <h3 className="text-2xl font-semibold text-[var(--ink-strong)]">
                          {project.title}
                        </h3>
                      </div>
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link"
                      >
                        Visit
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>

                    <p className="text-base leading-7 text-[var(--muted)]">
                      {project.description}
                    </p>
                    <p className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-4 py-4 text-sm leading-7 text-[var(--ink)]">
                      {project.impact}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="stack-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {additionalProjects.map((project, index) => {
                const Icon = project.icon;

                return (
                  <article
                    key={project.title}
                    className={`portfolio-card soft-rise ${staggerClasses[index % staggerClasses.length]}`}
                  >
                    <div className="project-media">
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={`${project.title} project preview`}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 45vw, 100vw"
                        />
                      ) : (
                        <div
                          className="relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden p-6 text-white"
                          style={{ background: project.surface }}
                        >
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute inset-x-[-12%] top-[16%] h-px rotate-[-12deg] bg-white/20" />
                            <div className="absolute inset-x-[-8%] top-[44%] h-px rotate-[8deg] bg-white/15" />
                            <div className="absolute inset-x-[-10%] bottom-[18%] h-px rotate-[-7deg] bg-white/18" />
                          </div>
                          <div className="relative z-10 flex items-center justify-between gap-4">
                            <div className="icon-badge border-white/10 bg-white/6 text-white">
                              <Icon className="h-5 w-5" />
                            </div>
                            <p className="mono-label !mb-0 !text-white/50">{project.domain}</p>
                          </div>
                          <div className="relative z-10 max-w-md space-y-2">
                            <p className="mono-label !mb-0 !text-white/40">Additional build</p>
                            <h3 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                              {project.title}
                            </h3>
                            <p className="text-sm leading-7 text-white/60">
                              Product work with a sharper operating mode than a generic brochure build.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 p-6 sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="mono-label">{project.domain}</p>
                          <h3 className="text-2xl font-semibold text-[var(--ink-strong)]">
                            {project.title}
                          </h3>
                        </div>
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noreferrer"
                          className="project-link"
                        >
                          Visit
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>

                      <p className="text-base leading-7 text-[var(--muted)]">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="stack-chip">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="section-divider" />

          <section className="space-y-8">
            <SectionIntro
              eyebrow="Open source & protocol engineering"
              title="The infrastructure underneath the interfaces."
              description="Wrappers, MCP servers, and developer tooling built for real integration depth and AI-native workflows. Published, documented, production-facing."
            />

            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
              {toolingProjects.map((project, index) => {
                const Icon = project.icon;

                return (
                  <article
                    key={project.title}
                    className={`pricing-card soft-rise ${staggerClasses[index % staggerClasses.length]}`}
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
                        <h3 className="text-2xl font-semibold text-[var(--ink-strong)]">
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
                          <span key={tag} className="stack-chip">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link w-fit"
                      >
                        {project.cta}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="section-divider" />

          <section id="capabilities" className="space-y-8">
            <SectionIntro
              eyebrow="Capabilities"
              title="Deep stack. Sharper taste."
              description="Most developers can wire frameworks together. The difference is knowing what to build, what to leave out, and how to make complex systems feel simple."
            />

            <div className="grid gap-5 lg:grid-cols-3">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon;

                return (
                  <article
                    key={capability.title}
                    className={`capability-card soft-rise ${staggerClasses[index]}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="icon-badge">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-semibold text-[var(--ink-strong)]">
                        {capability.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-7 text-[var(--muted)]">
                      {capability.body}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {capability.details.map((detail) => (
                        <span key={detail} className="stack-chip">
                          {detail}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <article className="section-wrap soft-rise stagger-4 p-6 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                <div className="space-y-4">
                  <p className="mono-label">Current toolkit</p>
                  <h3 className="text-3xl font-semibold text-[var(--ink-strong)]">
                    Working across modern web, AI infrastructure, and custom integration layers.
                  </h3>
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    Equally at home shipping clean frontends, backend systems,
                    data pipelines, and AI-enhanced workflows. The range produces
                    coherent systems rather than disconnected pieces.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {toolStack.map((tool) => (
                    <span key={tool} className="tool-chip">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <div className="section-divider" />

          <section id="pricing" className="space-y-8">
            <SectionIntro
              eyebrow="Investment"
              title="Scope-honest. No filler."
              description="Ranges for the work I usually take on. Final pricing follows complexity, integration depth, urgency, and how much of the system falls under my ownership."
            />

            <div className="grid gap-5 lg:grid-cols-3">
              {pricingTiers.map((tier, index) => {
                const Icon = tier.icon;

                return (
                  <article
                    key={tier.title}
                    className={`pricing-card soft-rise ${staggerClasses[index % staggerClasses.length]}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="icon-badge">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="mono-label">Engagement</p>
                          <h3 className="text-2xl font-semibold text-[var(--ink-strong)]">
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
                      {tier.details.map((detail) => (
                        <span key={detail} className="stack-chip">
                          {detail}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <article className="section-wrap p-6 sm:p-8">
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
            </article>
          </section>

          <div className="section-divider" />

          <section id="process" className="space-y-8">
            <SectionIntro
              eyebrow="Process"
              title="From ambiguity to architecture to artifact."
              description="The projects change shape. The rhythm stays: find the real problem, design the structure, build with precision, refine until it reads."
            />

            <div className="grid gap-5 lg:grid-cols-4">
              {processSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.title}
                    className={`process-card soft-rise ${staggerClasses[index]}`}
                  >
                    <div className="icon-badge">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mono-label">Step {index + 1}</p>
                    <h3 className="text-xl font-semibold text-[var(--ink-strong)]">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-7 text-[var(--muted)]">{step.body}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="section-divider" />

          <section id="contact" className="section-wrap contact-panel soft-rise stagger-4 p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
              <div className="space-y-5">
                <p className="mono-label">Contact</p>
                <h2 className="text-4xl font-semibold leading-tight text-[var(--ink-strong)] sm:text-5xl">
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
                  <a href="/Eugene_CV_Fullstack.pdf" className="btn-ghost" target="_blank" rel="noreferrer">
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
          </section>
        </div>
      </main>
    </ClippyAssistant>
  );
}
