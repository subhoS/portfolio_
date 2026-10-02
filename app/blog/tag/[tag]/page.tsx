import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import JsonLd from "../../../../components/JsonLd";
import { PostRow } from "../../../../components/PostCard";
import { getAllTags, getPostsByTag } from "../../../../lib/posts";
import { breadcrumbSchema, graph } from "../../../../lib/schema";
import { pageMetadata } from "../../../../lib/seo";
import { absoluteUrl, ids } from "../../../../lib/site";

type Props = { params: Promise<{ tag: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllTags()).map((t) => ({ tag: t.slug }));
}

async function load(slug: string) {
  const tags = await getAllTags();
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) return null;
  return { tag, tags, posts: await getPostsByTag(slug) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load((await params).tag);
  if (!data) return {};
  const { tag, posts } = data;
  const meta = pageMetadata({
    title: `${tag.tag} Articles`,
    description: `${posts.length} ${posts.length === 1 ? "article" : "articles"} about ${tag.tag} by Subhadeep Datta: ${posts
      .slice(0, 3)
      .map((p) => p.title)
      .join("; ")}.`.slice(0, 300),
    path: `/blog/tag/${tag.slug}`,
  });
  // Single-article topics are thin pages: keep them crawlable but out of the index.
  return posts.length < 2 ? { ...meta, robots: { index: false, follow: true } } : meta;
}

export default async function TagPage({ params }: Props) {
  const data = await load((await params).tag);
  if (!data) notFound();
  const { tag, tags, posts } = data;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Writing", path: "/blog" },
    { name: tag.tag, path: `/blog/tag/${tag.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          {
            "@type": "CollectionPage",
            url: absoluteUrl(`/blog/tag/${tag.slug}`),
            name: `${tag.tag} articles by Subhadeep Datta`,
            isPartOf: { "@id": ids.website },
            author: { "@id": ids.person },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: posts.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: absoluteUrl(`/blog/${p.slug}`),
                name: p.title,
              })),
            },
          },
          breadcrumbSchema(crumbs),
        )}
      />
      <div className="container">
        <header className="page-header">
          <Breadcrumbs items={crumbs} />
          <span className="eyebrow mt-3" style={{ display: "flex" }}>
            Topic
          </span>
          <h1>
            {tag.tag} <span className="serif">articles</span>
          </h1>
          <p className="lede">
            {posts.length} {posts.length === 1 ? "article" : "articles"} about {tag.tag}, written from hands-on
            experience building and scaling production systems.
          </p>
        </header>

        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <PostRow post={p} headingLevel={2} />
            </li>
          ))}
        </ul>

        <section aria-labelledby="other-topics" className="section-tight">
          <h2 id="other-topics" className="eyebrow">
            Other topics
          </h2>
          <div className="tag-cloud mt-2">
            {tags
              .filter((t) => t.slug !== tag.slug)
              .map((t) => (
                <Link key={t.slug} href={`/blog/tag/${t.slug}`} className="chip">
                  {t.tag} <span className="count">{t.count}</span>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
