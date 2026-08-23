"use client";

import { AtTheHorizon } from "@designcodeio/threeui/components/AtTheHorizon";
import { ConnectivityGraph } from "@designcodeio/threeui/components/ConnectivityGraph";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  BrainCircuit,
  Database,
  Download,
  FlaskConical,
  Github,
  Mail,
  MapPin,
  Network,
  Package,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import ClippyAssistant from "./ClippyAssistant";
import ContactForm from "./ContactForm";
import GitHubActivity from "./GitHubActivity";
import styles from "./home.module.css";

const projects = [
  {
    index: "01",
    name: "PactLoop",
    description:
      "One customer record for chats, calls, invoices, payment promises, field visits and consent, with country packs for South Africa, Nigeria, Kenya and Ghana.",
    stack: "Next.js / TypeScript / Cloudflare D1",
    image: "/pactloop.webp",
    href: "https://pactloop.com",
  },
  {
    index: "02",
    name: "Centralbrain",
    description:
      "An agent-first business workspace for company AI tools, controlled automation and day-to-day operations.",
    stack: "Next.js / MCP / Business software",
    image: "/centralbrain.webp",
    href: "https://centralbrain.io",
  },
  {
    index: "03",
    name: "Platedom",
    description:
      "Restaurant software that produces menus, food-service copy and branded visual output in minutes.",
    stack: "Generative AI / Firebase / Hospitality",
    image: "/platedom.webp",
    href: "https://platedom.com",
  },
  {
    index: "04",
    name: "Morphed.io",
    description:
      "Observability software with live dashboards, reports, customer portals and MCP tools for business data.",
    stack: "Next.js / HubSpot / MCP",
    image: "/morphed.webp",
    href: "https://morphed.io",
  },
  {
    index: "05",
    name: "Earthie.world",
    description:
      "Community tools, market data, maps and API access for Earth2 users, backed by more than seventeen data sources.",
    stack: "Next.js / Maps / Live data",
    image: "/earthie-world.webp",
    href: "https://earthie.world",
  },
  {
    index: "06",
    name: "Trolley Scout",
    description:
      "A South African grocery price-comparison app with a verifiable source behind every special, shipped on web and Android.",
    stack: "Web / Android / Retail data",
    image: "/trolleyscout.webp",
    href: "https://trolleyscout.co.za",
  },
  {
    index: "07",
    name: "MessageCFO",
    description:
      "WhatsApp invoicing, expense tracking and client records for small businesses.",
    stack: "WhatsApp / PostgreSQL / Fintech",
    image: "/messagecfo.webp",
    href: "https://messagecfo.com",
  },
  {
    index: "08",
    name: "EntropySuite",
    description:
      "More than thirty AI tools for analysis, file conversion and everyday tasks in one product.",
    stack: "React / AI tools / File processing",
    image: "/entropysuite.webp",
    href: "https://entropysuite.co.za",
  },
  {
    index: "09",
    name: "KinSpace",
    description:
      "A private community for people living with chronic and mental health conditions.",
    stack: "React / Community / Support",
    image: "/kinspace.webp",
    href: "https://www.kinspace.co.za",
  },
  {
    index: "10",
    name: "PathNote",
    description:
      "Location-aware audio walks generated from live maps and the route around the listener.",
    stack: "Geolocation / Audio / Maps",
    image: "/pathnote.webp",
    href: "https://www.pathnote.co.za",
  },
  {
    index: "11",
    name: "Bikode",
    description:
      "A native Windows code editor written in C and Win32, with Git, plugins and AI features.",
    stack: "C / Win32 / Desktop",
    image: "/bikode.webp",
    href: "https://bikode.co.za",
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
    icon: BrainCircuit,
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
  "11 shipped products",
  "4 npm packages",
  "Available for selected work",
] as const;

const EMAIL = "loyiso.eugene.moketsi@gmail.com";

export default function Home() {
  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
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
            <span className={styles.brandMark} aria-hidden="true">
              <FlaskConical size={14} strokeWidth={1.8} />
            </span>
            <span>Boondock Labs</span>
          </a>
          <nav className={styles.navLinks} aria-label="Primary navigation">
            <a href="#work">Work</a>
            <a href="#packages">Packages</a>
            <a href="#github">GitHub</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <a href="#contact" className={styles.navCta}>
            Start a project <ArrowUpRight size={13} />
          </a>
        </header>

        <section id="top" className={styles.hero}>
          <div className={styles.heroField} aria-hidden="true">
            <AtTheHorizon />
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
                Eleven products across fintech, retail data, hospitality,
                community and developer tooling, built end to end.
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
          <div className={styles.contactField} aria-hidden="true">
            <ConnectivityGraph mode="dark" hue={-160} saturation={0.7} />
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
