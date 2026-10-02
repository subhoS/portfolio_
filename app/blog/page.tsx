import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Rss } from "../../components/icons";
import JsonLd from "../../components/JsonLd";
import { PostCard, PostRow } from "../../components/PostCard";
import { getAllPosts, getAllTags } from "../../lib/posts";
import { breadcrumbSchema, graph } from "../../lib/schema";
import { pageMetadata } from "../../lib/seo";
import { absoluteUrl, ids, site } from "../../lib/site";

export const metadata = pageMetadata({
  title: "Writing on System Design, Backend & AI Engineering",
  description:
    "Articles by Subhadeep Datta on system design, Node.js, Kafka, Redis, PostgreSQL, Docker, RAG, LLMs and engineering leadership, from real production work.",
  path: "/blog",
  keywords: [
    "Subhadeep Datta blog",
    "system design articles",
    "backend engineering blog",
    "software architecture",
  ],
});

export default async function BlogIndex() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
  const featured = posts.filter((p) => p.featured).slice(0, 3);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Writing", path: "/blog" },
  ];

  const byYear = new Map<string, typeof posts>();
  for (const p of posts) {
    const y = p.date.slice(0, 4);
    byYear.set(y, [...(byYear.get(y) ?? []), p]);
  }

  return (
    <>
      <JsonLd
        data={graph(
          {
            "@type": "Blog",
            "@id": absoluteUrl("/blog#blog"),
            url: absoluteUrl("/blog"),
            name: `${site.name} — Writing`,
            description:
              "Engineering articles on system design, backend performance, distributed systems and AI.",
            author: { "@id": ids.person },
            publisher: { "@id": ids.person },
            inLanguage: "en",
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: absoluteUrl(`/blog/${p.slug}`),
              datePublished: p.date,
              author: { "@id": ids.person },
            })),
          },
          breadcrumbSchema(crumbs),
        )}
      />
      <div className="container">
        <header className="page-header">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-3">
            Writing on systems <span className="serif">that scale</span>
          </h1>
          <p className="lede">
            {posts.length} in-depth articles on system design, backend
            performance, distributed systems, AI engineering and engineering
            leadership. No fluff, just what I&apos;ve learned shipping
            production software.
          </p>
          <div className="row mt-3">
            <a className="btn btn-ghost" href="/rss.xml">
              <Rss /> Subscribe via RSS
            </a>
          </div>
        </header>

        {featured.length > 0 && (
          <section
            aria-labelledby="featured-heading"
            className="section-tight"
            style={{ paddingTop: 0 }}
          >
            <h2 id="featured-heading" className="sr-only">
              Featured articles
            </h2>
            <div className="grid-3">
              {featured.map((p, i) => (
                <PostCard key={p.slug} post={p} feature={i === 0} />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="topics-heading" className="section-tight">
          <h2 id="topics-heading" className="eyebrow">
            Browse by topic
          </h2>
          <div className="tag-cloud mt-2">
            {tags.map((t) => (
              <Link key={t.slug} href={`/blog/tag/${t.slug}`} className="chip">
                {t.tag} <span className="count">{t.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {[...byYear.entries()].map(([year, list]) => (
          <section
            key={year}
            aria-labelledby={`y-${year}`}
            className="section-tight"
          >
            <h2
              id={`y-${year}`}
              className="section-title"
              style={{ marginBottom: 12 }}
            >
              {year}
            </h2>
            <ul className="post-list">
              {list.map((p) => (
                <li key={p.slug}>
                  <PostRow post={p} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
