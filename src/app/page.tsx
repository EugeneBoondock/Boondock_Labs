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
    summary: "AI customer operations for modern teams.",
    outcome:
      "Chats, calls, invoices, payment promises, field visits, and consent share one customer record.",
    stack: "Next.js · TypeScript · Cloudflare D1",
    image: "/pactloop.webp",
    href: "https://pactloop.com",
  },
  {
    index: "02",
    name: "Morphed.io",
    summary: "Full-stack platform work from interface to custom APIs.",
    outcome:
      "Product architecture, backend systems, AI tooling, and a complete MCP server built from the ground up.",
    stack: "Next.js · Custom APIs · MCP",
    image: "/morphed.webp",
    href: "https://morphed.io",
  },
  {
    index: "03",
    name: "Earthie.world",
    summary: "A living Earth2 intelligence layer.",
    outcome:
      "Real-time market telemetry, interactive cartography, and an AI companion powered by seventeen APIs.",
    stack: "Next.js · Live data · Interactive maps",
    image: "/earthie-world.webp",
    href: "https://earthie.world",
  },
  {
    index: "04",
    name: "EntropySuite",
    summary: "Thirty-plus AI instruments in one fast product.",
    outcome:
      "A broad set of analysis, conversion, and experiment tools shaped into a clear, usable surface.",
    stack: "React · AI workflows · Product design",
    image: "/entropysuite.webp",
    href: "https://entropysuite.co.za",
  },
  {
    index: "05",
    name: "Bikode",
    summary: "A native Windows code editor built in C and Win32.",
    outcome:
      "AI-assisted, Git-ready, and plugin-capable desktop software built close to the metal.",
    stack: "C · Win32 · Editor engineering",
    image: "/bikode.webp",
    href: "https://bikode.co.za",
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
            Independent product engineer.
            <br />
            AI builder. Systems operator.
          </p>
          <div className={styles.heroMeta}>
            <span>
              <MapPin size={15} /> Edenvale, South Africa
            </span>
            <span>
              <i /> Available for new projects
            </span>
          </div>
          <div className={styles.heroActions}>
            <a href="#work" className={styles.primaryButton}>
              View selected work <ArrowRight size={17} />
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
              <p className={styles.eyebrow}>The person behind the systems</p>
              <h2>I build the kind of software I want to exist.</h2>
              <p>
                Boondock Labs is my independent product studio in Edenvale,
                South Africa. I take ambitious ideas from a rough brief to a
                working product, owning the interface, data, AI, and backend
                decisions along the way.
              </p>
              <p>
                I’m drawn to hard technical work and clear product thinking:
                unusual APIs, MCP servers, native Windows software, local
                payment rails, and products that need more than a polished front
                end.
              </p>
              <a href="#work" className={styles.textLink}>
                See what that looks like <ArrowDown size={15} />
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
              <h2>Software starts as an experiment.</h2>
            </div>
            <p>
              Boondock Labs treats product work like a working bench: inspect
              the signal, test the hard parts, and ship what survives contact
              with the real world.
            </p>
          </div>

          <div className={`${styles.reveal} ${styles.labHeroScene}`}>
            <LabMotionScene />
            <div className={styles.labSceneCaption}>
              <span>01 / Working bench</span>
              <p>
                A scroll-driven study of the tools, signals, and machines behind
                the work.
              </p>
            </div>
          </div>

          <div className={styles.labStudies}>
            <article className={styles.reveal}>
              <div className={styles.labStudyImage}>
                <Image
                  src="/lab/neural-apparatus.png"
                  alt="A brain-shaped neural computing apparatus with rust circuitry"
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </div>
              <div className={styles.labStudyCopy}>
                <span>02 / Neural apparatus</span>
                <h3>Machine reasoning, made physical.</h3>
                <p>
                  AI systems drawn as machinery: inspectable, deliberate, and
                  built to earn their place in the product.
                </p>
              </div>
            </article>

            <article className={styles.reveal}>
              <div className={styles.labStudyImage}>
                <Image
                  src="/lab/protocol-reactor.png"
                  alt="A glass protocol reactor linked to a matte-black server core"
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </div>
              <div className={styles.labStudyCopy}>
                <span>03 / Protocol reactor</span>
                <h3>Raw inputs become working systems.</h3>
                <p>
                  APIs, data, and product rules pass through one tested path
                  before they reach the interface.
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
              <p className={styles.eyebrow}>Selected work</p>
              <h2>Shipped systems, built to hold up.</h2>
            </div>
            <p>
              Product thinking, interface craft, backend depth, and AI systems
              brought together in working software.
            </p>
          </div>

          <div className={styles.projectList}>
            {projects.map((project) => (
              <article
                key={project.name}
                className={`${styles.projectRow} ${styles.reveal}`}
              >
                <p className={styles.projectIndex}>{project.index}</p>
                <div className={styles.projectCopy}>
                  <p className={styles.projectDomain}>{project.name}</p>
                  <h3>{project.summary}</h3>
                  <p>
                    <strong>Build</strong> {project.outcome}
                  </p>
                  <small>{project.stack}</small>
                </div>
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
              </article>
            ))}
          </div>
        </div>
      </section>

      <GitHubActivity />

      <section id="capabilities" className={styles.capabilitiesSection}>
        <div className={styles.sectionFrame}>
          <div className={styles.capabilitiesHeader}>
            <div>
              <p className={styles.eyebrow}>Capabilities</p>
              <h2>One studio. The whole product surface.</h2>
            </div>
            <p>
              From a rough brief to production software, with the hard parts
              kept visible and owned.
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
            <p className={styles.eyebrow}>Have a hard problem?</p>
            <h2>Let’s build something that holds up.</h2>
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
