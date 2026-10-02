import profile from "../data/profile.json";
import type { Faq, PostMeta } from "./posts";
import { absoluteUrl, ids, site } from "./site";

type Json = Record<string, unknown>;

export const personSchema = (): Json => ({
  "@type": "Person",
  "@id": ids.person,
  name: site.name,
  givenName: "Subhadeep",
  familyName: "Datta",
  alternateName: ["Subho", "subhoS"],
  url: absoluteUrl("/"),
  image: {
    "@type": "ImageObject",
    url: absoluteUrl(site.avatar),
    width: 576,
    height: 576,
    caption: site.name,
  },
  email: `mailto:${site.email}`,
  jobTitle: "Co-Founder & CTO",
  description: site.bio,
  homeLocation: { "@type": "Place", name: site.location },
  address: {
    "@type": "PostalAddress",
    addressLocality: "New Delhi",
    addressCountry: "IN",
  },
  worksFor: [
    {
      "@type": "Organization",
      name: "Hirerkey",
      url: "https://www.hirerkey.com/",
    },
    {
      "@type": "Organization",
      name: "Noisiv Consulting",
      url: "https://noisivconsulting.com/",
    },
  ],
  hasOccupation: profile.experience.map((e) => ({
    "@type": "Occupation",
    name: e.role,
    description: `${e.role} at ${e.company} (${e.period}). ${e.summary}`,
    occupationLocation: { "@type": "Country", name: "India" },
  })),
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Jamia Hamdard",
    address: {
      "@type": "PostalAddress",
      addressLocality: "New Delhi",
      addressCountry: "IN",
    },
  },
  hasCredential: profile.awards.map((a) => ({
    "@type": "EducationalOccupationalCredential",
    name: a.title,
    credentialCategory: "certificate",
    recognizedBy: { "@type": "Organization", name: a.issuer },
  })),
  knowsAbout: [
    "System Design",
    "Distributed Systems",
    "Backend Engineering",
    "Full Stack Development",
    "Software Architecture",
    "Node.js",
    "Java",
    "Python",
    "Go",
    "React",
    "Next.js",
    "Apache Kafka",
    "Redis",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "Large Language Models",
    "Retrieval-Augmented Generation",
    "Model Context Protocol",
    "Technical Leadership",
    "Engineering Management",
  ],
  knowsLanguage: ["English"],
  sameAs: [
    site.socials.linkedin,
    site.socials.github,
    site.socials.x,
    "https://linkedin.com/in/subhadeep-datta-cto",
  ],
});

export const websiteSchema = (): Json => ({
  "@type": "WebSite",
  "@id": ids.website,
  url: absoluteUrl("/"),
  name: site.name,
  alternateName: ["Subhadeep Datta Portfolio", "subhadeepdatta.page"],
  description: site.description,
  inLanguage: "en",
  publisher: { "@id": ids.person },
  author: { "@id": ids.person },
});

export const graph = (...nodes: Json[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

export const breadcrumbSchema = (
  items: { name: string; path: string }[],
): Json => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const faqSchema = (faq: Faq[]): Json => ({
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const articleSchema = (post: PostMeta): Json => {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: {
      "@type": "ImageObject",
      url: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
      width: 1200,
      height: 630,
    },
    datePublished: `${post.date}T00:00:00+05:30`,
    dateModified: `${post.updated || post.date}T00:00:00+05:30`,
    author: {
      "@id": ids.person,
      "@type": "Person",
      name: site.name,
      url: absoluteUrl("/about"),
    },
    publisher: { "@id": ids.person },
    isPartOf: { "@id": ids.website },
    inLanguage: "en",
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTime}M`,
    articleSection: post.category,
    keywords: [...new Set([...post.keywords, ...post.tags])].join(", "),
    about: post.tags.map((t) => ({ "@type": "Thing", name: t })),
  };
};
