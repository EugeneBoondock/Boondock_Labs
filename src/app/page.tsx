"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Bot,
  Braces,
  BrainCircuit,
  FileDown,
  Github,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Rocket,
  Twitter,
  Workflow,
} from "lucide-react";
import ClippyAssistant from "./ClippyAssistant";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

const signalStats = [
  {
    value: "17+",
    label: "API integrations brought into one live platform",
  },
  {
    value: "30+",
    label: "AI tools shipped inside a single productivity suite",
  },
  {
    value: "1,027",
    label: "Poems and reflections shaped into a searchable PWA archive",
  },
  {
    value: "3",
    label: "Published NPM packages spanning wrappers and MCP servers",
  },
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
                  Eugene Ncube portfolio
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
          <section className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <div className="space-y-8 soft-rise stagger-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-white/60 px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-teal)]" />
                <p className="text-sm text-[var(--muted)]">
                  Available for product engineering, AI integrations, and ambitious builds
                </p>
              </div>

              <div className="space-y-6">
                <p className="mono-label">Portfolio / selected systems / 2026</p>
                <h1 className="display-title max-w-5xl">
                  I build internet products that feel sharper than the brief they started with.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                  I am Eugene Ncube, a self-taught full-stack developer from Edenvale,
                  South Africa. I build AI-native tools, custom platform systems, MCP
                  servers, and interfaces that look intentional because the thinking
                  behind them is intentional.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="#work" className="btn-solid">
                  View selected work
                </a>
                <a href="/Eugene_CV_Fullstack.pdf" className="btn-ghost" target="_blank" rel="noreferrer">
                  <FileDown className="h-4 w-4" />
                  Download CV
                </a>
              </div>

              <div className="live-pill">
                <Bot className="h-4 w-4 text-[var(--accent-teal)]" />
                <p className="text-sm text-[var(--muted)]">
                  Clippy is live in the corner. Ask about project fit, stack depth,
                  pricing, or which build best shows range.
                </p>
              </div>
            </div>

            <div className="grid gap-4 soft-rise stagger-2">
              <article className="section-wrap overflow-hidden p-4 sm:p-5">
                <div className="project-preview-card">
                  <div className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-white/50 bg-[var(--panel-dark)] sm:min-h-[440px]">
                    <Image
                      src="/morphed.png"
                      alt="Morphed.io interface preview"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.05)_0%,rgba(10,10,10,0.68)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 text-white">
                      <p className="mono-label !text-white/70">Featured proof</p>
                      <h2 className="text-3xl font-semibold sm:text-4xl">Morphed.io</h2>
                      <p className="max-w-md text-sm leading-6 text-white/80">
                        Platform engineering, API design, and protocol-level tooling in
                        one product story.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              <div className="grid gap-4 sm:grid-cols-2">
                {signalStats.map((stat, index) => (
                  <article
                    key={stat.label}
                    className={`metric-card soft-rise ${index > 1 ? "stagger-4" : "stagger-3"}`}
                  >
                    <p className="metric-value">{stat.value}</p>
                    <p className="text-sm leading-6 text-[var(--muted)]">{stat.label}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

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
              description="These are the projects that best show how I think: full-stack ownership, difficult integrations, memorable interfaces, and a willingness to take on work that is slightly more ambitious than comfortable."
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
