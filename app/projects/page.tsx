import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import JsonLd from "../../components/JsonLd";
import { ArrowRight, ArrowUpRight, Check } from "../../components/icons";
import profile from "../../data/profile.json";
import { breadcrumbSchema, graph } from "../../lib/schema";
import { pageMetadata } from "../../lib/seo";
import { absoluteUrl, ids } from "../../lib/site";

export const metadata = pageMetadata({
  title: "Work & Case Studies — Hirerkey, Noisiv, Qid",
  description:
    "Selected work by Subhadeep Datta: Hirerkey's AI-native HR platform, Noisiv Consulting's high-throughput backends, Qid's digital identity gateway, Sounf and Videtorrium, with architecture, stack and measurable results.",
  path: "/projects",
  keywords: ["Subhadeep Datta projects", "Hirerkey", "Noisiv Consulting", "Qid", "oneqid", "case studies"],
});

export default function ProjectsPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/projects" },
  ];
  const projects = profile.projects;

  return (
    <>
      <JsonLd
        data={graph(
          {
            "@type": "CollectionPage",
            url: absoluteUrl("/projects"),
            name: "Work & case studies by Subhadeep Datta",
            isPartOf: { "@id": ids.website },
            about: { "@id": ids.person },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: projects.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "CreativeWork",
                  name: p.title,
                  description: p.description,
                  ...(p.href && { url: p.href }),
                  creator: { "@id": ids.person },
                  keywords: p.tech.join(", "),
                },
              })),
            },
          },
          breadcrumbSchema(crumbs),
        )}
      />
      <div className="container">
        <header className="page-header">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-3">
            Selected <span className="serif">work</span>
          </h1>
          <p className="lede">
            Platforms I&apos;ve architected, led or co-founded, from identity verification at national scale to
            AI-native HR software. Each one taught me something I now write about.
          </p>
        </header>

        <div className="grid-2">
          {projects.map((p) => (
            <article key={p.title} className="card card-hover project-card">
              <div className="top">
                <span className="mark" aria-hidden="true">
                  {p.title.charAt(0)}
                </span>
                {p.href && <ArrowUpRight className="ext" />}
              </div>
              <div>
                <div className="muted mono">
                  {p.role} · {p.period}
                </div>
                <h2 style={{ fontSize: 22, marginTop: 6, letterSpacing: "-0.02em" }}>
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noopener" className="card-link">
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                </h2>
              </div>
              <p>{p.description}</p>
              {p.highlights && (
                <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
                  {p.highlights.map((h) => (
                    <li key={h} className="row" style={{ alignItems: "start", flexWrap: "nowrap", gap: 10, fontSize: 15 }}>
                      <Check style={{ width: 18, height: 18, flex: "none", marginTop: 3, color: "var(--ok)" }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="tech">
                {p.tech.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <section className="section">
          <div className="cta-band">
            <h2>
              Want the deep dives? <span className="serif">I wrote them down.</span>
            </h2>
            <p>The lessons behind these systems (caching, queues, scaling Node.js, RAG) are written up in detail.</p>
            <div className="hero-ctas">
              <Link className="btn btn-primary" href="/blog">
                Read the articles <ArrowRight className="arrow" />
              </Link>
              <Link className="btn btn-ghost" href="/contact">
                Get in touch
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
