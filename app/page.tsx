import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "../components/icons";
import JsonLd from "../components/JsonLd";
import { PostCard } from "../components/PostCard";
import profile from "../data/profile.json";
import { getAllPosts, getAllTags } from "../lib/posts";
import { graph } from "../lib/schema";
import { pageMetadata } from "../lib/seo";
import { absoluteUrl, ids, site } from "../lib/site";
import portrait from "../public/subhadeep-datta.jpg";

export const metadata = pageMetadata({
  title: "Subhadeep Datta — Full Stack Engineer & CTO",
  absoluteTitle: true,
  description: site.description,
  path: "/",
  type: "profile",
});

const companies = [
  { name: "Hirerkey", url: "https://www.hirerkey.com/" },
  { name: "Noisiv Consulting", url: "https://noisivconsulting.com/" },
  { name: "Qid", url: "https://oneqid.com/" },
  { name: "Videtorrium", url: "https://www.videtorrium.com/" },
];

const stats = [
  { value: "6+", label: "Years building production systems" },
  { value: "75K", label: "Messages / second through Kafka & Redis" },
  { value: "99.9%", label: "Uptime on systems I've architected" },
  { value: "20+", label: "Client teams advised across countries" },
];

const skillGroups = [
  { title: "Backend & APIs", items: profile.skills.backend },
  { title: "Data & Messaging", items: profile.skills.databases },
  { title: "Cloud & DevOps", items: profile.skills.cloudDevOps },
  { title: "AI & LLMs", items: profile.skills.aiMl },
  {
    title: "Frontend & Mobile",
    items: [...profile.skills.frontend, "Android", "iOS"],
  },
  {
    title: "Leadership",
    items: [...profile.skills.systemDesign, ...profile.skills.professional],
  },
];

export default async function Home() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
  const featured = posts.filter((p) => p.featured);
  const showcase = [...featured, ...posts.filter((p) => !p.featured)].slice(
    0,
    6,
  );

  return (
    <>
      <JsonLd
        data={graph({
          "@type": "ProfilePage",
          "@id": absoluteUrl("/#profilepage"),
          url: absoluteUrl("/"),
          name: `${site.name} — Full Stack Engineer & CTO`,
          isPartOf: { "@id": ids.website },
          mainEntity: { "@id": ids.person },
          about: { "@id": ids.person },
          primaryImageOfPage: absoluteUrl(site.avatar),
          inLanguage: "en",
        })}
      />

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="hero-badge">
              <span className="status-dot" aria-hidden="true" />
              Open to advisory, fractional CTO &amp; architecture work
            </span>
            <h1>
              Subhadeep Datta
              <span className="serif gradient-text">
                builds systems that scale.
              </span>
            </h1>
            <p className="hero-lede">
              I&apos;m a <strong>Full Stack Engineer and CTO</strong> based in{" "}
              {site.location}. Co-Founder &amp; CTO at <strong>Hirerkey</strong>
              , Consulting CTO at <strong>Noisiv Consulting</strong>, and former
              Technology Lead at <strong>Qid</strong>. I design backends that
              handle millions of requests a day, and I write about how to build
              them.
            </p>
            <div className="hero-ctas">
              <Link className="btn btn-primary" href="/blog">
                Read my writing <ArrowRight className="arrow" />
              </Link>
              <Link className="btn btn-ghost" href="/contact">
                Work with me
              </Link>
              <a className="btn btn-ghost" href={site.resume}>
                <Download /> Résumé
              </a>
            </div>
          </div>
          <div className="hero-portrait">
            <div className="frame">
              <Image
                src={portrait}
                alt="Portrait of Subhadeep Datta, Full Stack Engineer and CTO"
                priority
                sizes="(max-width: 900px) 132px, 360px"
                placeholder="blur"
              />
            </div>
            <div className="portrait-tag">
              <span className="tag-icon">CTO</span>
              <div>
                <b>Hirerkey</b>
                <span>AI-native HCM platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="companies" aria-label="Companies">
        <div className="container">
          <span className="label">Built at</span>
          <ul>
            {companies.map((c) => (
              <li key={c.name}>
                <a href={c.url} target="_blank" rel="noopener">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-label="Impact in numbers">
        <div className="container">
          <div className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{ paddingTop: 0 }}
        aria-labelledby="writing-heading"
      >
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Writing</span>
              <h2 id="writing-heading" className="section-title">
                Field notes from <span className="serif">production</span>
              </h2>
              <p className="section-lede">
                Deep dives on system design, performance and AI engineering,
                written from systems I&apos;ve actually built and debugged.
              </p>
            </div>
            <Link className="btn btn-ghost" href="/blog">
              All {posts.length} articles <ArrowRight className="arrow" />
            </Link>
          </div>
          <div className="grid-3">
            {showcase.map((p, i) => (
              <PostCard key={p.slug} post={p} feature={i === 0} />
            ))}
          </div>
          <nav className="tag-cloud mt-4" aria-label="Topics">
            {tags
              .filter((t) => t.count >= 2)
              .slice(0, 12)
              .map((t) => (
                <Link
                  key={t.slug}
                  href={`/blog/tag/${t.slug}`}
                  className="chip"
                >
                  {t.tag} <span className="count">{t.count}</span>
                </Link>
              ))}
          </nav>
        </div>
      </section>

      <section
        className="section"
        style={{ paddingTop: 0 }}
        aria-labelledby="work-heading"
      >
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Experience</span>
              <h2 id="work-heading" className="section-title">
                Where I&apos;ve <span className="serif">built</span>
              </h2>
            </div>
            <Link className="btn btn-ghost" href="/projects">
              Case studies <ArrowRight className="arrow" />
            </Link>
          </div>
          <ol className="timeline">
            {profile.experience.map((e) => (
              <li key={`${e.company}-${e.role}`}>
                <div className="period">{e.period}</div>
                <div>
                  <h3>
                    {e.role} · <span className="org">{e.company}</span>
                  </h3>
                  <p>{e.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="section"
        style={{ paddingTop: 0 }}
        aria-labelledby="stack-heading"
      >
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Toolbox</span>
              <h2 id="stack-heading" className="section-title">
                What I <span className="serif">work with</span>
              </h2>
            </div>
          </div>
          <div className="skills-grid">
            {skillGroups.map((g, i) => (
              <div className="skill-group" key={g.title}>
                <h3>
                  <span>0{i + 1}</span>
                  {g.title}
                </h3>
                <ul>
                  {[...new Set(g.items)].map((s) => (
                    <li key={s} className="chip">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <span className="eyebrow" style={{ color: "#a9a3c2" }}>
              Let&apos;s talk
            </span>
            <h2 className="mt-2">
              Scaling something hard?{" "}
              <span className="serif">I&apos;d love to hear about it.</span>
            </h2>
            <p>
              Architecture reviews, fractional CTO engagements, performance
              firefighting, or AI/RAG systems that need to work in production.
            </p>
            <div className="hero-ctas">
              <Link className="btn btn-primary" href="/contact">
                Start a conversation <ArrowRight className="arrow" />
              </Link>
              <a
                className="btn btn-ghost"
                href={site.socials.linkedin}
                target="_blank"
                rel="me noopener"
              >
                Connect on LinkedIn <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
