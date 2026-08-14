"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  BrainCircuit,
  Database,
  Download,
  Github,
  Mail,
  MapPin,
  Network,
  Package,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import GitHubActivity from "./GitHubActivity";
import LabMotionScene from "./LabMotionScene";
import OilLogoMotion from "./OilLogoMotion";
import styles from "./portfolio.module.css";

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
  { label: "Product engineering", icon: Braces },
  { label: "AI systems", icon: BrainCircuit },
  { label: "Backend APIs", icon: Database },
  { label: "MCP tooling", icon: Network },
  { label: "Cross-platform apps", icon: Smartphone },
] as const;

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll(`.${styles.reveal}`);
    const showVisible = () => {
      for (const target of targets) {
        const bounds = target.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0) {
          target.setAttribute("data-visible", "true");
        }
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            entry.target.setAttribute("data-visible", "true");
        }
      },
      { threshold: 0.12 },
    );
    for (const target of targets) observer.observe(target);
    showVisible();
    window.addEventListener("scroll", showVisible, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", showVisible);
    };
  }, []);

  const dateLabel = new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
    .format(new Date())
    .toUpperCase();

  return (
    <main className={styles.page}>
      <div
        className={styles.progress}
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      <header className={styles.navbar}>
        <a
          href="#top"
          className={styles.navBrand}
          aria-label="Boondock Labs home"
        >
          <Image src="/boondock-mark.png" alt="" width={34} height={34} />
          <span>Boondock Labs</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#lab">Lab</a>
          <a href="#github">GitHub</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#contact">Contact</a>
        </nav>
        <a
          href="mailto:loyiso.eugene.moketsi@gmail.com"
          className={styles.navCta}
        >
          Start a project <ArrowUpRight size={14} />
        </a>
      </header>

      <section id="top" className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{dateLabel}</p>
          <h1>
            Boondock
            <span>Labs</span>
          </h1>
          <p className={styles.owner}>Eugene Loyiso Mzimakhwe</p>
          <p className={styles.positioning}>
            Full-stack developer.
            <br />
            Product builder. MCP server author.
          </p>
          <div className={styles.heroMeta}>
            <span>
              <MapPin size={15} /> Edenvale, South Africa
            </span>
            <span>
              <i /> Available for selected work
            </span>
          </div>
          <div className={styles.heroActions}>
            <a href="#work" className={styles.primaryButton}>
              View all work <ArrowRight size={17} />
            </a>
            <a
              href="mailto:loyiso.eugene.moketsi@gmail.com"
              className={styles.secondaryButton}
            >
              Start a project <ArrowRight size={17} />
            </a>
          </div>
        </div>

        <div className={styles.logoStage}>
          <div className={styles.signalField} aria-hidden="true" />
          <OilLogoMotion className={styles.oilLogo} />
          <p>Move to inspect the signal.</p>
        </div>

        <a href="#work" className={styles.scrollCue}>
          Scroll <ArrowDown size={15} />
        </a>
      </section>

      <section className={styles.founderSection}>
        <div className={styles.sectionFrame}>
          <div className={`${styles.founderGrid} ${styles.reveal}`}>
            <div className={styles.founderImage}>
              <Image
                src="/founder-eugene-editorial.png"
                alt="Eugene Loyiso Mzimakhwe, founder of Boondock Labs"
                fill
                sizes="(max-width: 760px) 100vw, 42vw"
                priority
              />
            </div>
            <div className={styles.founderCopy}>
              <p className={styles.eyebrow}>Eugene Loyiso Mzimakhwe</p>
              <h2>I design and ship software.</h2>
              <p>
                I’m a full-stack developer in Edenvale. At Morphed.io I work on
                dashboards, APIs, customer portals, reporting jobs and MCP
                servers for business data.
              </p>
              <p>
                I also run Boondock Labs. The work below covers grocery prices,
                restaurant menus, CRM operations, Earth2 data, community
                products and a native Windows editor.
              </p>
              <a href="#work" className={styles.textLink}>
                Browse the work <ArrowDown size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="lab" className={styles.labSection}>
        <div className={styles.sectionFrame}>
          <div className={styles.labIntro}>
            <div>
              <p className={styles.eyebrow}>Inside the lab</p>
              <h2>This is where the work gets tested.</h2>
            </div>
            <div className={styles.labIntroAside}>
              <Image
                src="/boondock-mark.png"
                alt=""
                width={104}
                height={104}
                aria-hidden="true"
              />
              <p>
                API traces, broken builds, test runs, database changes and
                hardware side projects. Inspect the evidence, fix the problem,
                ship the result.
              </p>
            </div>
          </div>

          <div className={`${styles.reveal} ${styles.labHeroScene}`}>
            <LabMotionScene />
            <div className={styles.labSceneCaption}>
              <span>01 / The workbench</span>
              <p>
                Scroll through the bench. The scene moves frame by frame using
                the same Oil Motion approach as the logo.
              </p>
            </div>
          </div>

          <div className={styles.labStudies}>
            <article className={styles.reveal}>
              <div className={styles.labStudyImage}>
                <Image
                  src="/lab/signal-inspection.png"
                  alt="An oscilloscope connected to an open circuit board"
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </div>
              <div className={styles.labStudyCopy}>
                <span>02 / Signal check</span>
                <h3>Find the fault.</h3>
                <p>
                  A scope, probes and an open board. Start with the evidence.
                </p>
              </div>
            </article>

            <article className={styles.reveal}>
              <div className={styles.labStudyImage}>
                <Image
                  src="/lab/server-assembly.png"
                  alt="A robotic arm assembling a circuit board beside a server rack"
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </div>
              <div className={styles.labStudyCopy}>
                <span>03 / Build station</span>
                <h3>Make the next version.</h3>
                <p>
                  Servers, scripts and repeatable tools turn a fix into a
                  release.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="work" className={styles.workSection}>
        <div className={styles.sectionFrame}>
          <div className={styles.sectionIntro}>
            <div>
              <p className={styles.eyebrow}>All work</p>
              <h2>Products I’ve built or helped build.</h2>
            </div>
            <p>
              The nine products named on my CV are here, plus PathNote and
              Bikode. Four published developer packages follow below.
            </p>
          </div>

          <div className={styles.projectList}>
            {projects.map((project) => (
              <article
                key={project.name}
                className={`${styles.projectCard} ${styles.reveal}`}
              >
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.projectImage}
                  aria-label={`Visit ${project.name}`}
                >
                  <Image
                    src={project.image}
                    alt={`${project.name} product preview`}
                    fill
                    sizes="(max-width: 760px) 100vw, 58vw"
                  />
                  <span>
                    <ArrowUpRight size={20} />
                  </span>
                </a>
                <div className={styles.projectCardBody}>
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
                    Visit project <ArrowUpRight size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.packageArchive}>
            <div className={styles.packageHeader}>
              <div>
                <p className={styles.eyebrow}>Published packages</p>
                <h3>Code other developers can use.</h3>
              </div>
              <p>Four npm packages for Earth2, Morphed and HubSpot.</p>
            </div>
            <div className={styles.packageList}>
              {packages.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.packageNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Package size={18} strokeWidth={1.5} />
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                  <ArrowUpRight size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <GitHubActivity />

      <section id="capabilities" className={styles.capabilitiesSection}>
        <div className={styles.sectionFrame}>
          <div className={styles.capabilitiesHeader}>
            <div>
              <p className={styles.eyebrow}>What I do</p>
              <h2>Web products, APIs and developer tools.</h2>
            </div>
            <p>
              Frontend, backend, data, AI features and the release work needed
              to put a product online.
            </p>
          </div>
          <div className={styles.capabilityGrid}>
            {capabilities.map(({ label, icon: Icon }) => (
              <div key={label}>
                <Icon size={24} strokeWidth={1.5} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className={styles.contactSection}>
        <div className={styles.contactGrid}>
          <div>
            <p className={styles.eyebrow}>Contact</p>
            <h2>Tell me what you’re building.</h2>
          </div>
          <div className={styles.contactDetails}>
            <a href="mailto:loyiso.eugene.moketsi@gmail.com">
              <Mail size={17} /> loyiso.eugene.moketsi@gmail.com
            </a>
            <span>
              <MapPin size={17} /> Edenvale, Gauteng, South Africa
            </span>
            <a
              href="https://github.com/EugeneBoondock"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={17} /> @EugeneBoondock
            </a>
          </div>
          <div className={styles.contactActions}>
            <a
              href="mailto:loyiso.eugene.moketsi@gmail.com"
              className={styles.contactPrimary}
            >
              Start a project <ArrowRight size={17} />
            </a>
            <a
              href="/Eugene_Loyiso_Mzimakhwe_CV_updated.pdf"
              target="_blank"
              rel="noreferrer"
              className={styles.contactSecondary}
            >
              Download CV <Download size={17} />
            </a>
          </div>
        </div>
        <div className={styles.footerLine}>
          <span>Boondock Labs</span>
          <span>© {new Date().getFullYear()} Eugene Loyiso Mzimakhwe</span>
          <a href="mailto:loyiso.eugene.moketsi@gmail.com">
            Contact <ArrowUpRight size={13} />
          </a>
        </div>
      </footer>
    </main>
  );
}
