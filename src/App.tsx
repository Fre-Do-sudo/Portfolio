import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity
} from "framer-motion";
import type { MotionStyle, MotionValue } from "framer-motion";
import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { content, type Mood } from "./content";

const moodOrder: Mood[] = ["neutral", "happy", "wink", "surprised", "angry", "sleepy"];

function useThemeSections() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-theme-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            document.documentElement.dataset.theme =
              (entry.target as HTMLElement).dataset.themeSection ?? "dark";
          }
        }
      },
      { rootMargin: "-49% 0px -49% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
}

function Loader() {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(reduceMotion ? 100 : 0);
  const [leaving, setLeaving] = useState(Boolean(reduceMotion));
  const [visible, setVisible] = useState(!reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setCount(100);
      setLeaving(true);
      return;
    }
    const started = performance.now();
    const counter = window.setInterval(() => {
      const progress = Math.min(100, Math.round(((performance.now() - started) / 1400) * 100));
      setCount(progress);
      if (progress === 100) {
        window.clearInterval(counter);
        window.setTimeout(() => setLeaving(true), 220);
      }
    }, 16);
    return () => window.clearInterval(counter);
  }, [reduceMotion]);

  if (!visible) return null;
  return (
    <motion.div
      className="loader"
      initial={false}
      animate={{ y: leaving ? "-100%" : "0%" }}
      transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (leaving) setVisible(false);
      }}
      aria-hidden="true"
    >
      <div className="loader-brand">PORTFOLIO<span>®</span></div>
      <div className="loader-count">{String(count).padStart(3, "0")}<small>%</small></div>
      <div className="loader-caption">Making something worth your time</div>
    </motion.div>
  );
}

function ScrollChrome() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const previousY = useRef(0);

  useEffect(() => {
    return scrollYProgress.on("change", () => {
      const y = window.scrollY;
      setVisible(y < 70 || y < previousY.current || y < 300);
      previousY.current = y;
    });
  }, [scrollYProgress]);

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <motion.header
        className="site-header"
        animate={{ y: visible ? 0 : -110, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <a className="wordmark" href="#home" aria-label={`${content.name}, home`}>
          {content.name.split(/\s+/).map((part) => part[0]).join("")}<span>.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <MagneticLink href="#contact" className="nav-contact">Let’s talk <span aria-hidden="true">↗</span></MagneticLink>
        </nav>
      </motion.header>
    </>
  );
}

function MagneticLink({
  href,
  className = "",
  children
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 16 });
  const springY = useSpring(y, { stiffness: 180, damping: 16 });
  const onMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.17);
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.17);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.a
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.a>
  );
}

function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [viewing, setViewing] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.5 });

  useEffect(() => {
    if (reduceMotion || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      setHovering(Boolean(target.closest("a, button, [data-cursor-view]")));
      setViewing(Boolean(target.closest("[data-cursor-view]")));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [reduceMotion, x, y]);

  if (!enabled) return null;
  return (
    <div className={`custom-cursor${hovering ? " is-hovering" : ""}${viewing ? " is-viewing" : ""}`} aria-hidden="true">
      <motion.span className="cursor-ring" style={{ x: ringX, y: ringY }} />
      <motion.span className="cursor-dot" style={{ x, y }} />
    </div>
  );
}

function Avatar() {
  const reduceMotion = useReducedMotion();
  const [available, setAvailable] = useState<Mood[]>(["neutral"]);
  const [mood, setMood] = useState<Mood>("neutral");
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const imageBase = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;
    Promise.all(
      moodOrder.map(async (candidate) => {
        if (candidate === "neutral") return candidate;
        try {
          const response = await fetch(`/avatar/${candidate}.png`, { method: "HEAD" });
          return response.ok ? candidate : null;
        } catch {
          return null;
        }
      })
    ).then((results) => {
      if (active) setAvailable(results.filter((item): item is Mood => item !== null));
    });
    return () => {
      active = false;
    };
  }, []);

  const advance = () => {
    setMood((current) => {
      const index = available.indexOf(current);
      return available[(index + 1) % available.length] ?? "neutral";
    });
  };

  useEffect(() => {
    if (!hovered || available.length < 2 || reduceMotion) return;
    const timer = window.setInterval(advance, 1100);
    return () => window.clearInterval(timer);
  }, [hovered, available, reduceMotion]);

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch" || reduceMotion || !imageBase.current) return;
    const bounds = imageBase.current.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    setTilt({ x: py * -13, y: px * 13 });
  };
  const onPointerLeave = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch") return;
    setHovered(false);
    setMood("neutral");
    setTilt({ x: 0, y: 0 });
  };
  return (
    <div className="avatar-wrap">
      <AnimatePresence mode="wait">
        {(hovered || mood !== "neutral") && (
          <motion.div
            key={mood}
            className="speech-bubble"
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            aria-live="polite"
          >
            {content.bubbleMessages[mood]}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        ref={imageBase}
        type="button"
        className="avatar-button"
        aria-label={`Portrait, currently ${mood}. Click to change expression.`}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") setHovered(true);
        }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onClick={() => {
          if (available.length > 1) advance();
        }}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <span className="avatar-glow" aria-hidden="true" />
        <span className="avatar-image-frame">
          <AnimatePresence initial={false}>
            <motion.img
              key={mood}
              src={`/avatar/${mood}.png`}
              alt={`Portrait of ${content.name} smiling in a creative workspace`}
              className="avatar-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              draggable="false"
              fetchPriority="high"
              onError={(event) => {
                if (mood !== "neutral") {
                  event.currentTarget.src = "/avatar/neutral.png";
                  setMood("neutral");
                }
              }}
            />
          </AnimatePresence>
        </span>
      </motion.button>
      <span className="avatar-caption">That’s me <span aria-hidden="true">↙</span></span>
    </div>
  );
}

function FloatingChip({
  label,
  index,
  mouseX,
  mouseY
}: {
  label: string;
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const x = useTransform(mouseX, (value) => value * (index % 2 ? -0.035 : 0.045));
  const y = useTransform(mouseY, (value) => value * (index % 2 ? 0.04 : -0.035));
  return (
    <motion.span
      className={`floating-chip chip-${index + 1}`}
      style={{ x, y }}
      animate={{ translateY: [0, -8, 0] }}
      transition={{ duration: 3.2 + index * 0.35, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
    >
      <span aria-hidden="true">✳</span> {label}
    </motion.span>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 55, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 55, damping: 18 });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.76], [1, 0]);
  const letterParts = content.name.split("").map((char, index) => ({ char, index }));

  return (
    <section
      id="home"
      ref={heroRef}
      className="hero-section"
      data-theme-section="dark"
      onPointerMove={(event) => {
        if (event.pointerType === "touch" || reduceMotion) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        mouseX.set(event.clientX - bounds.left - bounds.width / 2);
        mouseY.set(event.clientY - bounds.top - bounds.height / 2);
      }}
    >
      <div className="hero-orbit orbit-one" aria-hidden="true" />
      <div className="hero-orbit orbit-two" aria-hidden="true" />
      <motion.div className="hero-content" style={{ y: contentY, opacity: contentOpacity }}>
        <div className="hero-kicker"><span className="status-dot" /> {content.location}</div>
        <h1 className="hero-name" aria-label={content.name}>
          <span className="sr-only">{content.name}</span>
          <span className="hero-name-visual" aria-hidden="true">
            {letterParts.map(({ char, index }) => (
              <motion.span
                key={`${char}-${index}`}
                className={`hero-letter ${index % 2 === 0 ? "letter-filled" : "letter-outline"}`}
                initial={reduceMotion ? false : { y: "115%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.7, delay: reduceMotion ? 0 : 0.75 + index * 0.035, ease: [0.22, 1, 0.36, 1] }}
              >
                {char === " " ? "\u00a0" : char}
              </motion.span>
            ))}
          </span>
        </h1>
        <div className="hero-bottom">
          <p>{content.tagline}</p>
          <a className="scroll-cue" href="#about">Scroll to explore <span aria-hidden="true">↓</span></a>
        </div>
      </motion.div>

      <motion.div className="hero-portrait" style={{ y: contentY, opacity: contentOpacity }}>
        <motion.div style={{ x: useTransform(springX, (value) => value * 0.035), y: useTransform(springY, (value) => value * 0.04) }}>
          <Avatar />
        </motion.div>
      </motion.div>
      {content.skills.slice(0, 4).map((skill, index) => (
        <FloatingChip key={skill} label={skill} index={index} mouseX={springX} mouseY={springY} />
      ))}
      <div className="hero-index"><span>01</span> / 05</div>
    </section>
  );
}

function AboutWord({
  word,
  index,
  total,
  progress
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = 0.08 + (index / total) * 0.78;
  const end = start + 0.12;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return <motion.span className="about-word" style={{ opacity }}>{word} </motion.span>;
}

function SkillsMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const duration = useTransform(velocity, (value) => `${Math.max(4, 22 - Math.abs(value) / 80)}s`);
  const repeatedSkills = [...content.skills, ...content.skills];
  const marqueeStyle: MotionStyle & { "--marquee-duration": MotionValue<string> } = {
    "--marquee-duration": duration
  };
  return (
    <div className="marquee-viewport" ref={ref} aria-label={`Skills: ${content.skills.join(", ")}`}>
      <motion.div className="marquee-track" style={marqueeStyle}>
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy} aria-hidden={copy === 1}>
            {repeatedSkills.map((skill, index) => (
              <span className="marquee-item" key={`${copy}-${skill}-${index}`}>
                {skill}<span aria-hidden="true">✳</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.82", "end 0.42"] });
  const words = useMemo(() => content.about.split(/\s+/), []);
  return (
    <section id="about" ref={ref} className="about-section section-pad" data-theme-section="light">
      <div className="section-label"><span>01 — A LITTLE ABOUT ME</span><span>{content.role}</span></div>
      <div className="about-copy">
        <p aria-label={content.about}>
          {words.map((word, index) => (
            <AboutWord key={`${word}-${index}`} word={word} index={index} total={words.length} progress={scrollYProgress} />
          ))}
        </p>
      </div>
      <div className="about-note"><span className="note-star" aria-hidden="true">✳</span> Curiosity first. Always.</div>
      <SkillsMarquee />
    </section>
  );
}

function ServiceCard({
  item,
  index,
  progress
}: {
  item: (typeof content.services)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const scale = useTransform(progress, [index / 4, (index + 1) / 4], [1, 0.9]);
  const brightness = useTransform(progress, [index / 4, (index + 1) / 4], [1, 0.62]);
  return (
    <div className="service-sticky" style={{ zIndex: index + 1 }}>
      <motion.article className={`service-card service-card-${index + 1}`} style={{ scale, filter: useTransform(brightness, (value) => `brightness(${value})`) }}>
        <div className="service-card-top"><span>{item.number} / 04</span><span>✳</span></div>
        <div className="service-card-content">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <div className="service-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
        <span className="service-card-arrow" aria-hidden="true">↗</span>
      </motion.article>
    </div>
  );
}

function Services() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section id="services" ref={ref} className="services-section" data-theme-section="dark">
      <div className="section-pad services-intro">
        <div className="section-label"><span>02 — WHAT I DO</span><span>From first thought to final detail</span></div>
        <h2>Good work<br /><span>does more.</span></h2>
      </div>
      <div className="services-stack">
        {content.services.map((item, index) => <ServiceCard key={item.number} item={item} index={index} progress={scrollYProgress} />)}
      </div>
    </section>
  );
}

type Project = (typeof content.projects)[number];

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [25, -25]);
  const reduceMotion = useReducedMotion();
  return (
    <motion.button
      ref={ref}
      type="button"
      className="project-card"
      onClick={onOpen}
      data-cursor-view
      // The observed element must stay unclipped: a fully clipped target never reports an intersection.
      initial={reduceMotion ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.18 }}
      aria-label={`Open ${project.title}, ${project.category}`}
    >
      <motion.div
        className="project-reveal"
        variants={{
          hidden: { clipPath: "inset(0 0 100% 0 round 2px)", opacity: 0.6 },
          shown: { clipPath: "inset(0 0 0% 0 round 2px)", opacity: 1 }
        }}
        transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.76, 0, 0.24, 1], delay: (index % 2) * 0.1 }}
      >
        <div className="project-image-frame">
          <motion.img src={project.image} alt={project.alt} loading="lazy" decoding="async" style={{ y: imageY }} />
          <span className="project-shine" aria-hidden="true" />
          <span className="project-view" aria-hidden="true">View <span>↗</span></span>
          {project.live && <span className="project-badge"><span className="status-dot" /> Live</span>}
        </div>
        <div className="project-meta">
          <div>
            <h3>{project.title}</h3>
            <span>{project.category}</span>
          </div>
          <span className="project-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        </div>
      </motion.div>
    </motion.button>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!project) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="project-modal-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
        >
          <motion.div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(event) => event.stopPropagation()}
            initial={reduceMotion ? false : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <button ref={closeRef} type="button" className="project-modal-close" onClick={onClose} aria-label="Close project">✕</button>
            <div className="project-modal-image">
              <img src={project.image} alt={project.alt} />
            </div>
            <div className="project-modal-body">
              <div className="project-modal-kicker"><span>{project.category}</span><span>{project.year}</span></div>
              <h3 id="project-modal-title">{project.title}</h3>
              <p>{project.description}</p>
              <div className="service-tags project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="project-modal-actions">
                {project.live && (
                  <a className="project-action project-action-primary" href={project.live} target="_blank" rel="noreferrer">
                    Visit live site <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {project.code && (
                  <a className="project-action" href={project.code} target="_blank" rel="noreferrer">
                    View source code <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {!project.live && !project.code && (
                  <a className="project-action" href="#contact" onClick={onClose}>Ask me for a demo <span aria-hidden="true">↗</span></a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Work() {
  const [selected, setSelected] = useState<Project | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);
  const githubUrl = content.socials.find((social) => social.label === "GitHub")?.href;
  return (
    <section id="work" className="work-section section-pad" data-theme-section="light">
      <div className="section-label"><span>03 — MY WORK</span><span>{content.projects.length} projects and counting</span></div>
      <div className="work-heading">
        <h2>Things<br /><span>I’ve built.</span></h2>
        <p>Live sites, full-stack apps and design experiments. Tap any project to see it up close.</p>
      </div>
      <div className="projects-grid">
        {content.projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} onOpen={() => setSelected(project)} />
        ))}
      </div>
      {githubUrl && (
        <div className="work-more">
          <a href={githubUrl} className="work-more-link" target="_blank" rel="noreferrer">More on GitHub <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      )}
      <ProjectModal project={selected} onClose={closeModal} />
    </section>
  );
}

function Contact() {
  return (
    <footer id="contact" className="contact-section section-pad" data-theme-section="dark">
      <div className="section-label"><span>04 — THE NEXT PART</span><span>Have a good one in mind?</span></div>
      <div className="contact-content">
        <p>Let’s make<br />something <em>matter.</em></p>
        <MagneticLink href={`mailto:${content.email}`} className="contact-email">{content.email}<span aria-hidden="true">↗</span></MagneticLink>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {content.name}. Made with intention.</span>
        <div className="social-links">{content.socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label}<span className="sr-only"> (opens in a new tab)</span></a>)}</div>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}

function App() {
  useThemeSections();
  useEffect(() => {
    document.title = `${content.name} — ${content.role}`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = content.description;
  }, []);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Loader />
      <ScrollChrome />
      <CustomCursor />
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Work />
      </main>
      <Contact />
    </>
  );
}

export default App;
