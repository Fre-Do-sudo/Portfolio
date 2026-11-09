export type Mood = "neutral" | "happy" | "wink" | "surprised" | "angry" | "sleepy";

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
      title: "Forma Studio",
      category: "Brand identity · Digital",
      image: "/projects/forma.svg",
      alt: "Abstract coral and lavender shapes for the Forma Studio project",
      link: "#contact"
    },
    {
      title: "Goodside",
      category: "Product design · Development",
      image: "/projects/goodside.svg",
      alt: "Bright green editorial composition for the Goodside project",
      link: "#contact"
    },
    {
      title: "Common Ground",
      category: "Art direction · Campaign",
      image: "/projects/common-ground.svg",
      alt: "Blue and cream graphic landscape for the Common Ground project",
      link: "#contact"
    }
  ],
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
