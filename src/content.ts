export type Mood = "neutral" | "happy" | "wink" | "surprised" | "angry" | "sleepy";

export type Project = {
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  image: string;
  alt: string;
  /** Public URL of the live site, if deployed. */
  live?: string;
  /** Public source code repository, if any. */
  code?: string;
};

export const content = {
  name: "Godfrey",
  role: "Designer & developer",
  description: "A portfolio of thoughtful digital experiences, design, and development.",
  tagline: "I turn big ideas into thoughtful digital experiences.",
  location: "Available worldwide",
  about:
    "I’m a multidisciplinary creative who loves making useful things feel unforgettable. From the first sketch to the final interaction, I bring design and technology together to make the complex feel simple, human, and full of character.",
  services: [
    {
      number: "01",
      title: "Digital design",
      description: "Clear, characterful interfaces shaped around real people and real needs.",
      tags: ["Web design", "Art direction", "Prototyping"]
    },
    {
      number: "02",
      title: "Web development",
      description: "Fast, accessible websites with the details and interactions worth noticing.",
      tags: ["Creative development", "React", "Accessibility"]
    },
    {
      number: "03",
      title: "Brand identity",
      description: "Distinctive visual systems that tell your story everywhere it appears.",
      tags: ["Identity", "Visual systems", "Guidelines"]
    },
    {
      number: "04",
      title: "Digital experiences",
      description: "Thoughtful motion and playful moments that make a product feel alive.",
      tags: ["Motion", "Interaction", "Experiments"]
    }
  ],
  projects: [
    {
      title: "THRIFT_GALLERY",
      category: "E-commerce · Full-stack",
      year: "2026",
      description:
        "An online store for a women’s fashion brand in Uyo. Shoppers browse curated thrift and new pieces, “try the look” on mannequin outfits and check out, while the owner runs orders, stock and reviews from a private dashboard that removes photo backgrounds automatically.",
      tags: ["Node.js", "JavaScript", "REST API", "Vercel"],
      image: "/projects/thriftgallery.webp",
      alt: "THRIFT_GALLERY home page with the headline “Make every day a main-character moment” beside a smiling model holding a shopping bag",
      live: "https://thriftgallery.vercel.app"
    },
    {
      title: "Udo-Aka Foundation",
      category: "Non-profit website · Design & build",
      year: "2026",
      description:
        "A multi-page website for a foundation supporting children, youths and families in rural Nigeria, covering its programmes, trustees, the founder’s story and a donation flow with Paystack payments.",
      tags: ["HTML", "CSS", "JavaScript", "PHP", "Paystack"],
      image: "/projects/udoaka-foundation.webp",
      alt: "Udo-Aka Foundation home page with the headline “Empowering people, transforming communities” over a photo of schoolchildren",
      live: "https://udoakafoundation.org"
    },
    {
      title: "CareLink",
      category: "Web app · Student wellbeing",
      year: "2026",
      description:
        "A university counselling system. Students book sessions and talk to an AI support chat with crisis escalation and counsellor takeover. Session notes are encrypted, and every staff access is audited.",
      tags: ["Python", "Django", "PostgreSQL", "Encryption", "AI"],
      image: "/projects/carelink.webp",
      alt: "CareLink counsellor dashboard listing upcoming availability, a confirmed session and open cases",
      code: "https://github.com/Fre-Do-sudo/Care-link"
    },
    {
      title: "SIWES Monitor",
      category: "Web app · Final year project",
      year: "2026",
      description:
        "A management and monitoring system for student industrial training. Students submit weekly logbooks, supervisors approve or request revisions, and coordinators see which placements have fallen behind.",
      tags: ["Python", "Django", "SQLite", "Role-based access"],
      image: "/projects/siwes-monitor.webp",
      alt: "SIWES Monitor coordinator dashboard showing placement counts, an overdue-log warning and a table of student placements"
    },
    {
      title: "Laque Atelier",
      category: "Concept website · Creative development",
      year: "2026",
      description:
        "A concept site for a nail studio. A glossy, real-time liquid blob follows the cursor, and picking a shade re-tints the whole page.",
      tags: ["Canvas", "JavaScript", "Motion", "CSS"],
      image: "/projects/laque.webp",
      alt: "Laque Atelier hero with the words “Wear it wet.” beside a glossy red lacquer blob on black"
    },
    {
      title: "FOLIO",
      category: "Concept store · Interaction design",
      year: "2026",
      description:
        "A “shop the look” wardrobe concept. Each outfit is a card you can drag to flip over, revealing the individual pieces, sizes and a full-look bundle price.",
      tags: ["JavaScript", "3D CSS", "UI design"],
      image: "/projects/folio.webp",
      alt: "FOLIO store showing the look “Sunday in blue” on a mannequin with its pieces and prices listed"
    },
    {
      title: "Godfrey’s Trift Collection",
      category: "E-commerce · Full-stack",
      year: "2026",
      description:
        "A fashion storefront with Paystack checkout verified on the server and a password-protected editor where the owner manages products, prices and photos.",
      tags: ["Python", "SQLite", "Paystack", "HTML/CSS"],
      image: "/projects/godfreys-trift-collection.webp",
      alt: "Godfrey’s Trift Collection home page with the headline “Wear the moment.” next to a fashion photo"
    },
    {
      title: "Godfrey’s Collection",
      category: "Product showcase · Web design",
      year: "2026",
      description:
        "A bold product page for everyday essentials, with a hanger carousel for browsing colours, size selection and pricing in naira.",
      tags: ["HTML", "CSS", "JavaScript"],
      image: "/projects/godfreys-collection.webp",
      alt: "Godfrey’s Collection page with a crimson T-shirt on a hanger and the headline “Wear confidence, define your style.”"
    }
  ] as Project[],
  skills: [
    "Creative direction",
    "Product design",
    "React",
    "TypeScript",
    "Figma",
    "Motion design",
    "Design systems",
    "Accessibility"
  ],
  email: "udoakagodfrey@gmail.com",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "WhatsApp", href: "https://wa.me/2348076425605" },
    { label: "GitHub", href: "https://github.com/Fre-Do-sudo" }
  ],
  bubbleMessages: {
    happy: "Good things happen when we make things.",
    wink: "Psst… have a good project in mind?",
    surprised: "Oh! You found the fun part.",
    angry: "Pixel-perfect? I prefer pixel-happy.",
    sleepy: "Dreaming up something good…",
    neutral: "Hey there. Thanks for stopping by."
  } satisfies Record<Mood, string>
};
