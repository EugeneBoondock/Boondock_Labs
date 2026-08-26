"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Database,
  Download,
  Github,
  Mail,
  MapPin,
  Moon,
  Network,
  Package,
  Smartphone,
  Sparkles,
  Sun,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ClippyAssistant from "./ClippyAssistant";
import ContactForm from "./ContactForm";
import GitHubActivity from "./GitHubActivity";
import styles from "./home.module.css";
import { getNextTheme, resolveThemePreference } from "./theme-preference.mjs";
import {
  retainVisualAfterFirstEntry,
  shouldMountAnimatedVisual,
} from "./visual-loading.mjs";

const AtTheHorizon = dynamic(
  () =>
    import("@designcodeio/threeui/components/AtTheHorizon").then(
      (module) => module.AtTheHorizon,
    ),
  { ssr: false },
);

const ConnectivityGraph = dynamic(
  () =>
    import("@designcodeio/threeui/components/ConnectivityGraph").then(
      (module) => module.ConnectivityGraph,
    ),
  { ssr: false },
);

type Theme = "light" | "dark";

const projects = [
  {
    index: "01",
    name: "PactLoop",
    description:
      "One customer record for chats, calls, invoices, payment promises, field visits and consent, with country packs for South Africa, Nigeria, Kenya and Ghana.",
    why: "I built it because customer-facing teams lose context when conversations, money, field work and consent live in separate tools.",
    stack: "Next.js / TypeScript / Cloudflare D1",
    image: "/pactloop.webp",
    href: "https://pactloop.com",
  },
  {
    index: "02",
    name: "Centralbrain",
    description:
      "An agent-first business workspace for company AI tools, controlled automation and day-to-day operations.",
    why: "I built it to give companies one governed place where AI agents can act across everyday tools while people remain in control.",
    stack: "Next.js / MCP / Business software",
    image: "/centralbrain.webp",
    href: "https://centralbrain.io",
  },
  {
    index: "03",
    name: "Platedom",
    description:
      "Restaurant software that produces menus, food-service copy and branded visual output in minutes.",
    why: "I built it to help restaurants turn existing menu knowledge into polished service materials and visuals without a slow agency process.",
    stack: "Generative AI / Firebase / Hospitality",
    image: "/platedom.webp",
    href: "https://platedom.com",
  },
  {
    index: "04",
    name: "Morphed.io",
    description:
      "Observability software with live dashboards, reports, customer portals and MCP tools for business data.",
    why: "I built it to make business data easier to inspect, explain and act on through live reporting and AI-ready tools.",
    stack: "Next.js / HubSpot / MCP",
    image: "/morphed.webp",
    href: "https://morphed.io",
  },
  {
    index: "05",
    name: "Earthie.world",
    description:
      "Community tools, market data, maps and API access for Earth2 users, backed by more than seventeen data sources.",
    why: "I built it because Earth2 players had to jump between scattered data sources to understand markets, land and community activity.",
    stack: "Next.js / Maps / Live data",
    image: "/earthie-world.webp",
    href: "https://earthie.world",
  },
  {
    index: "06",
    name: "Trolley Scout",
    description:
      "A South African grocery price-comparison app with a verifiable source behind every special, shipped on web and Android.",
    why: "I built it to help South Africans compare real grocery specials and verify each price before deciding where to shop.",
    stack: "Web / Android / Retail data",
    image: "/trolleyscout.webp",
    href: "https://trolleyscout.co.za",
  },
  {
    index: "07",
    name: "MessageCFO",
    description:
      "WhatsApp invoicing, expense tracking and client records for small businesses.",
    why: "I built it so small-business owners can handle everyday finance from WhatsApp instead of learning a full accounting suite.",
    stack: "WhatsApp / PostgreSQL / Fintech",
    image: "/messagecfo.webp",
    href: "https://messagecfo.com",
  },
  {
    index: "08",
    name: "EntropySuite",
    description:
      "More than thirty AI tools for analysis, file conversion and everyday tasks in one product.",
    why: "I built it to put useful AI and file tools in one practical workspace instead of sending people across dozens of single-purpose sites.",
    stack: "React / AI tools / File processing",
    image: "/entropysuite.webp",
    href: "https://entropysuite.co.za",
  },
  {
    index: "09",
    name: "KinSpace",
    description:
      "A private community for people living with chronic and mental health conditions.",
    why: "I built it to create a private, supportive place for people whose health experiences can feel isolating.",
    stack: "React / Community / Support",
    image: "/kinspace.webp",
    href: "https://www.kinspace.co.za",
  },
  {
    index: "10",
    name: "PathNote",
    description:
      "Location-aware audio walks generated from live maps and the route around the listener.",
    why: "I built it to make ordinary walks more meaningful by turning the places around a listener into timely audio stories.",
    stack: "Geolocation / Audio / Maps",
    image: "/pathnote.webp",
    href: "https://www.pathnote.co.za",
  },
  {
    index: "11",
    name: "Bikode",
    description:
      "A native Windows code editor written in C and Win32, with Git, plugins and AI features.",
    why: "I built it to keep the speed and directness of a native Windows editor while adding modern Git and AI tools.",
    stack: "C / Win32 / Desktop",
    image: "/bikode.webp",
    href: "https://bikode.co.za",
  },
  {
    index: "12",
    name: "AI Readiness",
    description:
      "A plain-language assessment that scores six areas of business readiness and recommends the next practical step before an AI investment.",
    why: "I built it to help South African businesses test whether AI work is worth funding and identify what must change before a pilot begins.",
    stack: "AI assessment / Business strategy / South Africa",
    image: "/aireadiness.webp",
    href: "https://aireadiness.co.za",
  },
] as const;

const packages = [
  {
    name: "earth2-api-wrapper",
    description:
      "A TypeScript wrapper for Earth2 properties, accounts, transactions and marketplace data.",
    href: "https://www.npmjs.com/package/earth2-api-wrapper",
  },
  {
    name: "earth2-mcp-server",
    description:
      "MCP tools for Earth2 account data, wallet activity, properties and marketplace actions.",
    href: "https://www.npmjs.com/package/earth2-mcp-server",
  },
  {
    name: "morphed-mcp-server",
    description:
      "Morphed platform APIs exposed as authenticated tools for AI clients.",
    href: "https://www.npmjs.com/package/morphed-mcp-server",
  },
  {
    name: "hubspot-mcp-server",
    description:
      "HubSpot CRM tools for contacts, companies, deals and activity data.",
    href: "https://www.npmjs.com/package/hubspot-mcp-server",
  },
] as const;

const capabilities = [
  {
    label: "Product engineering",
    note: "Next.js, React, TypeScript",
    icon: Braces,
  },
  {
    label: "AI systems",
    note: "Agents, LLM features, RAG",
    icon: Sparkles,
  },
  { label: "Backend APIs", note: "Postgres, D1, serverless", icon: Database },
  { label: "MCP tooling", note: "Four published servers", icon: Network },
  {
    label: "Cross-platform apps",
    note: "Web, Android, Win32",
    icon: Smartphone,
  },
] as const;

const tickerItems = [
  "Tech studio",
  "Founded by Eugene Boondock",
  "Product engineering",
  "AI systems",
  "MCP tooling",
  "Edenvale, South Africa",
  "12 shipped products",
  "4 npm packages",
  "Available for selected work",
] as const;

const EMAIL = "loyiso.eugene.moketsi@gmail.com";

export default function Home() {
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const contactVisualRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [heroNearViewport, setHeroNearViewport] = useState(false);
  const [contactNearViewport, setContactNearViewport] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const colorQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const savedTheme = window.localStorage.getItem("boondock-theme");
    const resolvedTheme = resolveThemePreference(
      savedTheme,
      colorQuery.matches,
    );

    setTheme(resolvedTheme);
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;

    const syncSystemTheme = (event: MediaQueryListEvent) => {
      const currentSavedTheme = window.localStorage.getItem("boondock-theme");
      if (currentSavedTheme === "light" || currentSavedTheme === "dark") {
        return;
      }

      const nextTheme = resolveThemePreference(null, event.matches);
      setTheme(nextTheme);
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
    };

    colorQuery.addEventListener("change", syncSystemTheme);
    return () => colorQuery.removeEventListener("change", syncSystemTheme);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const syncMotionPreference = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === heroVisualRef.current) {
            setHeroNearViewport((wasMounted) =>
              retainVisualAfterFirstEntry(wasMounted, entry.isIntersecting),
            );
          }
          if (entry.target === contactVisualRef.current) {
            setContactNearViewport((wasMounted) =>
              retainVisualAfterFirstEntry(wasMounted, entry.isIntersecting),
            );
          }
        }
      },
      { rootMargin: "320px 0px" },
    );

    if (heroVisualRef.current) observer.observe(heroVisualRef.current);
    if (contactVisualRef.current) observer.observe(contactVisualRef.current);
    motionQuery.addEventListener("change", syncMotionPreference);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll(`.${styles.reveal}`);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            entry.target.setAttribute("data-visible", "true");
        }
      },
      { threshold: 0.1 },
    );
    for (const target of targets) {
      const bounds = target.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.95 && bounds.bottom > 0) {
        target.setAttribute("data-visible", "true");
      } else {
        observer.observe(target);
      }
    }
    return () => observer.disconnect();
  }, []);

  const dateLabel = new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date())
    .toUpperCase();

  return (
    <ClippyAssistant>
      <main className={styles.page}>
        <header className={styles.nav}>
          <a
            href="#top"
            className={styles.navBrand}
            aria-label="Boondock Labs home"
          >
            <Image src="/boondock-mark.png" alt="" width={30} height={30} />
            <span>Boondock Labs</span>
          </a>
          <nav className={styles.navLinks} aria-label="Primary navigation">
            <a href="#work">Work</a>
            <a href="#packages">Packages</a>
            <a href="#github">GitHub</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className={styles.navActions}>
            <button
              type="button"
              className={styles.themeToggle}
              aria-label={`Switch to ${getNextTheme(theme)} mode`}
              aria-pressed={theme === "light"}
              onClick={() => {
                const nextTheme = getNextTheme(theme);
                setTheme(nextTheme);
                window.localStorage.setItem("boondock-theme", nextTheme);
                document.documentElement.dataset.theme = nextTheme;
                document.documentElement.style.colorScheme = nextTheme;
              }}
            >
              <Sun size={16} data-theme-icon="light" aria-hidden="true" />
              <Moon size={16} data-theme-icon="dark" aria-hidden="true" />
            </button>
            <a href="#contact" className={styles.navCta}>
              Start a project <ArrowUpRight size={13} />
            </a>
          </div>
        </header>

        <section id="top" className={styles.hero}>
          <div
            ref={heroVisualRef}
            className={styles.heroField}
            aria-hidden="true"
          >
            <Image
              src="/hero-poster.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className={styles.heroPoster}
            />
            {shouldMountAnimatedVisual(
              heroNearViewport,
              prefersReducedMotion,
            ) && <AtTheHorizon />}
          </div>
          <div className={styles.heroVeil} aria-hidden="true" />
          <div className={`${styles.frame} ${styles.heroInner}`}>
            <div className={styles.heroKicker}>
              <span>{dateLabel}</span>
              <em>Tech studio, founded by Eugene Boondock</em>
              <span className={styles.statusDot}>
                <i /> Available for selected work
              </span>
            </div>
            <h1 className={styles.heroTitle}>
              <span>Boondock</span>
              <span>Labs</span>
            </h1>
            <div className={styles.heroLede}>
              <p>
                A South African tech studio that designs, builds and ships{" "}
                <strong>software that gets used</strong>: web products, APIs, AI
                systems, MCP servers and native tools.
              </p>
              <div className={styles.heroActions}>
                <a href="#work" className={styles.buttonPrimary}>
                  View the work <ArrowRight size={15} />
                </a>
                <a href="#contact" className={styles.buttonGhost}>
                  Start a project <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.ticker} aria-hidden="true">
          <div className={styles.tickerTrack}>
            {[0, 1].map((copy) => (
              <span key={copy}>
                {tickerItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <section id="work" className={styles.workSection}>
          <div className={styles.frame}>
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.eyebrow}>Selected work</p>
                <h2>Products the studio has shipped.</h2>
              </div>
              <p>
                Twelve products across fintech, retail data, hospitality,
                community, AI readiness and developer tooling, built end to end.
              </p>
            </div>
            <div className={styles.workGrid}>
              {projects.map((project) => (
                <article
                  key={project.name}
                  className={`${styles.projectCard} ${styles.reveal}`}
                >
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.projectMedia}
                    aria-label={`Visit ${project.name}`}
                  >
                    <Image
                      src={project.image}
                      alt={`${project.name} product preview`}
                      fill
                      sizes="(max-width: 860px) 100vw, 50vw"
                    />
                    <span>
                      <ArrowUpRight size={18} />
                    </span>
                  </a>
                  <div className={styles.projectBody}>
                    <div className={styles.projectTopline}>
                      <span>{project.index}</span>
                      <small>{project.stack}</small>
                    </div>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div className={styles.projectWhy}>
                      <strong>Why I built it</strong>
                      <p>{project.why}</p>
                    </div>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.textLink}
                    >
                      Visit project <ArrowUpRight size={13} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="packages" className={styles.packagesSection}>
          <div className={styles.frame}>
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.eyebrow}>Published packages</p>
                <h2>Code other developers can use.</h2>
              </div>
              <p>Four npm packages for Earth2, Morphed and HubSpot.</p>
            </div>
            <div className={`${styles.packageList} ${styles.reveal}`}>
              {packages.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                  <Package size={17} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </section>

        <GitHubActivity />

        <section id="about" className={styles.aboutSection}>
          <div className={styles.frame}>
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.eyebrow}>About the studio</p>
                <h2>Built in the boondocks. Shipped everywhere.</h2>
              </div>
            </div>
            <div className={`${styles.aboutGrid} ${styles.reveal}`}>
              <div className={styles.aboutCopy}>
                <p>
                  <em>Boondock Labs</em> is a tech studio in Edenvale, South
                  Africa, founded and run by <em>Eugene Boondock</em>, a
                  full-stack developer who also builds dashboards, APIs,
                  customer portals and MCP servers at Morphed.io.
                </p>
                <p>
                  The studio’s work covers grocery prices, restaurant menus, CRM
                  operations, Earth2 data, community products and a native
                  Windows editor, all built end to end, from the first schema to
                  the deploy.
                </p>
              </div>
              <div className={styles.capabilityList}>
                {capabilities.map(({ label, note, icon: Icon }) => (
                  <div key={label}>
                    <Icon size={20} strokeWidth={1.5} />
                    <span>{label}</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer id="contact" className={styles.contactSection}>
          <div
            ref={contactVisualRef}
            className={styles.contactField}
            aria-hidden="true"
          >
            {shouldMountAnimatedVisual(
              contactNearViewport,
              prefersReducedMotion,
            ) && <ConnectivityGraph mode={theme} hue={-160} saturation={0.7} />}
          </div>
          <div className={styles.contactVeil} aria-hidden="true" />
          <div className={`${styles.frame} ${styles.contactInner}`}>
            <div>
              <p className={styles.eyebrow}>Contact</p>
              <h2>Tell us what you’re building.</h2>
            </div>
            <ContactForm />
            <div className={styles.contactRow}>
              <div className={styles.contactMeta}>
                <span>
                  <Mail size={15} /> {EMAIL}
                </span>
                <span>
                  <MapPin size={15} /> Edenvale, Gauteng, South Africa
                </span>
                <a
                  href="https://github.com/EugeneBoondock"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={15} /> @EugeneBoondock
                </a>
              </div>
              <a
                href="/Eugene_Loyiso_Mzimakhwe_CV_updated.pdf"
                target="_blank"
                rel="noreferrer"
                className={styles.buttonGhost}
              >
                Founder CV <Download size={15} />
              </a>
            </div>
          </div>
          <div className={styles.frame}>
            <div className={styles.footerLine}>
              <span>Boondock Labs</span>
              <span>© {new Date().getFullYear()} Boondock Labs</span>
              <a href="#contact">
                Contact <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </ClippyAssistant>
  );
}
