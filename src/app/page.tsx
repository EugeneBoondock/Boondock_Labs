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
      "Full platform development across frontend, backend infrastructure, custom API endpoints, and a complete MCP server built from scratch.",
    impact:
      "This is the kind of project that shows range: product thinking, systems architecture, implementation depth, and AI protocol fluency in one build.",
    image: "/morphed.png",
    href: "https://morphed.io",
    tags: ["Full-stack architecture", "Custom APIs", "MCP tooling"],
    layout: "wide",
  },
  {
    title: "Earthie.world",
    description:
      "A comprehensive Earth2 platform with real-time market data, interactive mapping, and an AI companion grounded in platform mechanics.",
    impact:
      "Complex integrations are where I do some of my best work. Earthie tied together 17+ APIs without losing clarity in the interface.",
    image: "/earthie-world.png",
    href: "https://earthie.world",
    tags: ["17+ integrations", "Realtime data", "Interactive maps"],
    layout: "tall",
  },
  {
    title: "EntropySuite.co.za",
    description:
      "A bundle of 30+ AI-powered tools for summarisation, conversion, editing, analysis, and experimentation in one coherent product.",
    impact:
      "The challenge here was not just building tools. It was making a large feature surface feel navigable, useful, and fast.",
    image: "/entropysuite.png",
    href: "https://entropysuite.co.za",
    tags: ["AI product design", "Tool ecosystems", "React"],
    layout: "standard",
  },
  {
    title: "Bikode",
    description:
      "An AI-first native Windows code editor built in C with Win32, Scintilla, multi-provider AI assistance, Git UI, and plugin support.",
    impact:
      "Bikode is proof that I am not boxed into the average web stack. I like hard software problems and I enjoy building close to the metal.",
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
      "A support-focused community product for people living with chronic and mental illness, built around safety, connection, and useful resources.",
    href: "https://www.kinspace.co.za/",
    tags: ["Community platform", "Support UX", "React"],
    icon: HeartPulse,
    image: "/kinspace.png",
    surface:
      "linear-gradient(145deg, rgba(37, 93, 95, 0.96) 0%, rgba(18, 19, 15, 0.92) 100%)",
  },
  {
    title: "PathNote",
    domain: "pathnote.co.za",
    description:
      "An audible location explorer that turns walks into interactive audio journeys using live location, mapping data, and AI-assisted storytelling.",
    href: "https://www.pathnote.co.za/",
    tags: ["Geolocation", "Audio UX", "AI storytelling"],
    icon: AudioLines,
    image: null,
    surface:
      "linear-gradient(145deg, rgba(29, 82, 99, 0.96) 0%, rgba(12, 28, 35, 0.92) 100%)",
  },
  {
    title: "MessageCFO",
    domain: "messagecfo.com",
    description:
      "A WhatsApp-native finance workflow for invoices, expenses, balances, and customer management handled directly through conversation.",
    href: "https://messagecfo.com",
    tags: ["WhatsApp workflows", "Fintech ops", "PostgreSQL"],
    icon: MessageSquareText,
    image: null,
    surface:
      "linear-gradient(145deg, rgba(26, 74, 55, 0.96) 0%, rgba(16, 24, 20, 0.92) 100%)",
  },
  {
    title: "Platedom",
    domain: "platedom.com",
    description:
      "An AI restaurant platform that turns menus into high-end visual presentation and stronger digital merchandising for food brands.",
    href: "https://platedom.com",
    tags: ["Hospitality tech", "Generative media", "Firebase"],
    icon: UtensilsCrossed,
    image: null,
    surface:
      "linear-gradient(145deg, rgba(108, 61, 34, 0.96) 0%, rgba(27, 17, 12, 0.92) 100%)",
  },
] as const;

const toolingProjects = [
  {
    title: "earth2-api-wrapper",
    label: "Published package",
    description:
      "A clean TypeScript wrapper around the Earth2 API that makes properties, accounts, transactions, and marketplace data easier to build on top of.",
    href: "https://www.npmjs.com/package/earth2-api-wrapper",
    cta: "View on npm",
    icon: Database,
    tags: ["TypeScript", "API wrapper", "Earth2"],
  },
  {
    title: "earth2-mcp-server",
    label: "Protocol tooling",
    description:
      "A complete MCP server that lets AI clients access Earth2 account data, wallet activity, properties, and marketplace actions through tools instead of manual clicks.",
    href: "https://www.npmjs.com/package/earth2-mcp-server",
    cta: "View on npm",
    icon: Network,
    tags: ["MCP server", "Claude tools", "Earth2"],
  },
  {
    title: "morphed-mcp-server",
    label: "Protocol tooling",
    description:
      "Built from scratch for Morphed.io, turning platform APIs into usable AI tools with authentication, data access, and production-facing architecture.",
    href: "https://www.npmjs.com/package/morphed-mcp-server",
    cta: "View on npm",
    icon: Rocket,
    tags: ["MCP server", "Custom tools", "Platform APIs"],
  },
  {
    title: "hubspot-mcp-server",
    label: "Protocol tooling",
    description:
      "An extended HubSpot MCP implementation with deeper CRM operations, stronger integration ergonomics, and a more serious backend shape than a basic demo server.",
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
      "I build interfaces with structure, edge, and taste. That means translating messy requirements into products that feel composed from the first screen to the last interaction.",
    details: ["Next.js and React", "Responsive systems", "UX polish with intent"],
  },
  {
    icon: BrainCircuit,
    title: "AI-Native Systems",
    body:
      "I do not bolt AI on as decoration. I design with it as part of the product architecture, whether that means assistants, structured workflows, model orchestration, or protocol tooling.",
    details: ["Gemini and LLM workflows", "MCP servers", "Prompt and tool design"],
  },
  {
    icon: Braces,
    title: "Backend and Integrations",
    body:
      "I am comfortable in the part most portfolios skip: auth, APIs, databases, third-party integration chaos, edge cases, and the invisible engineering work that makes products actually hold together.",
    details: ["Custom APIs", "OAuth flows", "Databases and automation"],
  },
] as const;

const operatingPrinciples = [
  {
    number: "01",
    title: "I can own the whole surface area.",
    description:
      "Frontend, backend, AI workflows, integrations, and design intent all stay connected. You do not need three people to move one idea forward.",
  },
  {
    number: "02",
    title: "I move fast without becoming sloppy.",
    description:
      "AI is part of my workflow, but judgement stays human. I use acceleration to increase depth, not to bypass it.",
  },
  {
    number: "03",
    title: "I make ambitious work feel readable.",
    description:
      "Complex products still need elegance. I care about flow, hierarchy, wording, and how a system feels in the hand.",
  },
  {
    number: "04",
    title: "I like hard problems.",
    description:
      "Protocols, strange integrations, unusual product ideas, architecture from scratch. That is where I usually become most useful.",
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
    title: "Clarify the real brief",
    body:
      "I look for the actual product problem hiding behind the initial ask. That is how better scope and better decisions happen early.",
  },
  {
    icon: Rocket,
    title: "Architect for leverage",
    body:
      "I design structure that can survive growth: clean data flow, sensible abstractions, and room for integrations before they become painful.",
  },
  {
    icon: BrainCircuit,
    title: "Build with AI where it adds force",
    body:
      "Automation, assistants, and LLM capabilities get added deliberately. The goal is stronger products, not trend compliance.",
  },
  {
    icon: Mail,
    title: "Polish until it reads well",
    body:
      "Good software communicates. Copy, motion, layout, and interaction quality are not decoration. They are part of the product's credibility.",
  },
] as const;

const pricingTiers = [
  {
    icon: Layers3,
    title: "Starter Website",
    price: "R3,000 - R10,000",
    summary:
      "For lean portfolio sites, landing pages, and compact business websites that need to look sharp and launch cleanly.",
    details: ["Up to 3 pages", "Responsive build", "Basic SEO setup"],
  },
  {
    icon: BriefcaseBusiness,
    title: "Business Website",
    price: "R11,000 - R15,000",
    summary:
      "For more complete company sites that need stronger structure, more content, and proper lead capture.",
    details: ["Up to 8 pages", "Forms and maps", "Blog and enhanced SEO"],
  },
  {
    icon: ShoppingBag,
    title: "E-commerce Build",
    price: "R15,000 - R20,000",
    summary:
      "For online stores that need product structure, payment flow, and enough polish to feel trustworthy from day one.",
    details: ["Catalog and checkout", "Order flow", "Admin handover basics"],
  },
  {
    icon: Rocket,
    title: "Custom Product Build",
    price: "From R30,000+",
    summary:
      "For platforms, dashboards, AI-heavy products, and custom systems with deeper engineering and more moving parts.",
    details: ["Custom features", "Data systems", "Advanced UX and integrations"],
  },
  {
    icon: Network,
    title: "MCP Server Engineering",
    price: "R20,000 - R50,000",
    summary:
      "For teams that need APIs turned into usable model tools with proper architecture, testing, and publishable packaging.",
    details: ["Custom MCP tools", "NPM packaging", "Docs and testing"],
  },
  {
    icon: Database,
    title: "API and Integration Work",
    price: "R15,000 - R40,000",
    summary:
      "For backend systems, auth flows, endpoint design, and platform integration work that powers the product behind the scenes.",
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
      <h2 className="text-4xl font-semibold leading-tight text-[var(--ink)] sm:text-5xl">
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
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-white/70">
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
                  Eugene Loyiso Boondock portfolio
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
          className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:gap-32 lg:pt-32"
        >
          <HeroSection />

          <section className="section-wrap soft-rise stagger-3 p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
              <div className="space-y-4">
                <p className="mono-label">Why teams hire me</p>
                <h2 className="text-3xl font-semibold leading-tight text-[var(--ink)] sm:text-4xl">
                  I can bridge concept, interface, architecture, and execution without
                  flattening the work.
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {operatingPrinciples.map((principle) => (
                  <article key={principle.number} className="principle-card">
                    <p className="mono-label">{principle.number}</p>
                    <h3 className="text-xl font-semibold text-[var(--ink)]">
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

          <section id="work" className="space-y-8">
            <SectionIntro
              eyebrow="Selected work"
              title="Built for range, not just screenshots."
              description="These projects show the mix I want employers to notice: strong frontends, difficult integrations, product judgement, and the willingness to ship both polished experiences and the harder infrastructure underneath them."
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
                        <h3 className="text-2xl font-semibold text-[var(--ink)]">
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
                    <p className="rounded-[22px] border border-[var(--line)] bg-white/55 px-4 py-4 text-sm leading-7 text-[var(--ink)]">
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
                          <div className="absolute inset-0 opacity-40">
                            <div className="absolute inset-x-[-12%] top-[16%] h-px rotate-[-12deg] bg-white/30" />
                            <div className="absolute inset-x-[-8%] top-[44%] h-px rotate-[8deg] bg-white/20" />
                            <div className="absolute inset-x-[-10%] bottom-[18%] h-px rotate-[-7deg] bg-white/25" />
                          </div>
                          <div className="relative z-10 flex items-center justify-between gap-4">
                            <div className="icon-badge border-white/15 bg-white/10 text-white">
                              <Icon className="h-5 w-5" />
                            </div>
                            <p className="mono-label !mb-0 !text-white/62">{project.domain}</p>
                          </div>
                          <div className="relative z-10 max-w-md space-y-2">
                            <p className="mono-label !mb-0 !text-white/58">Additional build</p>
                            <h3 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                              {project.title}
                            </h3>
                            <p className="text-sm leading-7 text-white/78">
                              Product work with a more specific operating mode than a generic brochure build.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 p-6 sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="mono-label">{project.domain}</p>
                          <h3 className="text-2xl font-semibold text-[var(--ink)]">
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

          <section className="space-y-8">
            <SectionIntro
              eyebrow="Published tooling"
              title="The product work is backed by packages and protocol engineering."
              description="The portfolio should not read like design-only output. These projects show the lower-level side too: wrappers, MCP servers, and tooling built for real data access and AI-native workflows."
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
                        <h3 className="text-2xl font-semibold text-[var(--ink)]">
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

          <section id="capabilities" className="space-y-8">
            <SectionIntro
              eyebrow="Capabilities"
              title="The stack is broad. The taste matters just as much."
              description="A lot of developers can wire together frameworks. What teams usually need is someone who can also choose what matters, simplify the interface, and still handle the deeper engineering work."
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
                      <h3 className="text-2xl font-semibold text-[var(--ink)]">
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
                  <h3 className="text-3xl font-semibold text-[var(--ink)]">
                    I work across modern web, AI tooling, and custom integration layers.
                  </h3>
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    I am equally comfortable shipping clean frontends, backend logic,
                    data pipelines, and AI-enhanced workflows. That range is what lets me
                    build coherent systems rather than disconnected pieces.
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

          <section id="pricing" className="space-y-8">
            <SectionIntro
              eyebrow="Pricing"
              title="Typical project ranges, priced by scope not fluff."
              description="These are directional ranges for the kinds of work I usually take on. Final pricing depends on complexity, integrations, urgency, and how much of the system I am owning end to end."
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
                          <h3 className="text-2xl font-semibold text-[var(--ink)]">
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
                    If a project mixes product strategy, interface design, backend
                    architecture, AI workflows, and custom integrations, it lands in
                    the custom range. If you want a sharper quote quickly, Clippy can
                    help qualify scope before you reach out.
                  </p>
                </div>
                <a href="#contact" className="btn-solid self-start lg:self-auto">
                  Ask for a quote
                </a>
              </div>
            </article>
          </section>

          <section id="process" className="space-y-8">
            <SectionIntro
              eyebrow="Process"
              title="How I usually turn loose ambition into shipped software."
              description="The work changes, but the rhythm stays similar: clarify the real problem, shape the product, build the system properly, and then push past merely functional until the thing feels finished."
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
                    <h3 className="text-xl font-semibold text-[var(--ink)]">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-7 text-[var(--muted)]">{step.body}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="contact" className="section-wrap contact-panel soft-rise stagger-4 p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
              <div className="space-y-5">
                <p className="mono-label">Contact</p>
                <h2 className="text-4xl font-semibold leading-tight text-[var(--ink)] sm:text-5xl">
                  If you need someone who can think, build, and ship with taste, let us talk.
                </h2>
                <p className="max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                  I am open to contract work, freelance builds, and teams looking for
                  a developer who can take substantial ownership. If the brief is serious
                  and the ambition is real, I am interested.
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
                      <p className="text-lg font-medium text-[var(--ink)]">
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
                  <p className="mono-label">What to ask Clippy</p>
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    If you want the short version before you email, click Clippy and ask:
                    "Which project best proves backend depth?", "How does Eugene use AI in
                    real work?", or "Is he a fit for a product engineering role?"
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
