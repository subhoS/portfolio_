import profile from "../data/profile.json";

const rawUrl =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  profile.site.url ||
  "https://www.subhadeepdatta.page";

export const site = {
  url: rawUrl.replace(/\/+$/, ""),
  name: profile.name,
  shortName: profile.displayName,
  title: `${profile.name} — ${profile.title}`,
  tagline: "Full Stack Engineer & CTO building systems that scale",
  description:
    "Subhadeep Datta is a Full Stack Engineer and CTO: Co-Founder of Hirerkey, Consulting CTO at Noisiv Consulting, writing on system design, scale and AI.",
  bio: "Subhadeep Datta is a Full Stack Engineer and CTO — Co-Founder & CTO of Hirerkey, Consulting CTO at Noisiv Consulting, and former Technology Lead at Qid. He writes about system design, backend performance, distributed systems and AI/LLM engineering.",
  locale: "en_US",
  twitter: profile.site.twitter,
  email: profile.contact.email,
  avatar: profile.avatar,
  resume: profile.resume,
  jobTitle: profile.title,
  location: profile.location,
  socials: {
    github: profile.socials.github,
    linkedin: profile.socials.linkedin,
    x: profile.socials.x,
  },
} as const;

export const absoluteUrl = (path = "/") =>
  `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

/** Stable @id values so every JSON-LD block points to the same entities. */
export const ids = {
  person: absoluteUrl("/#person"),
  website: absoluteUrl("/#website"),
};

export const nav = [
  { label: "Work", href: "/projects" },
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
