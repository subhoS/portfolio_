import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthorCard from "../../../components/AuthorCard";
import Breadcrumbs from "../../../components/Breadcrumbs";
import JsonLd from "../../../components/JsonLd";
import { PostCard } from "../../../components/PostCard";
import ShareButtons from "../../../components/ShareButtons";
import Toc from "../../../components/Toc";
import { formatDate, getAllPosts, getPostBySlug, getPostSlugs, getRelatedPosts, tagSlug } from "../../../lib/posts";
import { articleSchema, breadcrumbSchema, faqSchema, graph } from "../../../lib/schema";
import { pageMetadata } from "../../../lib/seo";
import { absoluteUrl, site } from "../../../lib/site";
import avatar from "../../../public/subhadeep-datta.jpg";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: [...post.keywords, ...post.tags],
    type: "article",
    article: {
      publishedTime: `${post.date}T00:00:00+05:30`,
      modifiedTime: `${post.updated}T00:00:00+05:30`,
      tags: post.tags,
    },
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [all, related] = await Promise.all([getAllPosts(), getRelatedPosts(post, 3)]);
  const idx = all.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx < all.length - 1 ? all[idx + 1] : null;

  const url = absoluteUrl(`/blog/${post.slug}`);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Writing", path: "/blog" },
    { name: post.category, path: `/blog/tag/${tagSlug(post.category)}` },
    { name: post.title, path: `/blog/${post.slug}` },
  ];
  const headings = post.headings.filter((h) => h.depth === 2 || post.headings.length < 14);
  const updated = post.updated && post.updated !== post.date;

  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      <JsonLd
        data={graph(
          articleSchema(post),
          breadcrumbSchema(crumbs),
          ...(post.faq.length ? [faqSchema(post.faq)] : []),
        )}
      />
      <div className="container">
        <header className="article-header" style={{ maxWidth: 860 }}>
          <Breadcrumbs items={crumbs} />
          <h1>{post.title}</h1>
          <p className="lede">{post.description}</p>
          <div className="byline">
            <Image src={avatar} alt={site.name} width={44} height={44} priority />
            <div>
              <div className="who">
                <Link href="/about" rel="author">
                  {site.name}
                </Link>
              </div>
              <div className="byline-facts">
                <span>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </span>
                {updated && (
                  <span>
                    Updated <time dateTime={post.updated}>{formatDate(post.updated, "short")}</time>
                  </span>
                )}
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </div>
        </header>

        <div className="article-layout">
          <div>
            {headings.length > 2 && (
              <details className="toc-mobile">
                <summary>In this article</summary>
                <ol>
                  {headings
                    .filter((h) => h.depth === 2)
                    .map((h) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`}>{h.text}</a>
                      </li>
                    ))}
                </ol>
              </details>
            )}

            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, build-time rendered markdown from the repo */}
            <article className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

            {post.faq.length > 0 && (
              <section className="faq" aria-labelledby="faq-heading">
                <h2 id="faq-heading">Frequently asked questions</h2>
                {post.faq.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </section>
            )}

            <div className="row mt-4">
              {post.tags.map((t) => (
                <Link key={t} href={`/blog/tag/${tagSlug(t)}`} className="chip">
                  #{t}
                </Link>
              ))}
            </div>

            <ShareButtons url={url} title={post.title} />
            <AuthorCard />

            {(older || newer) && (
              <nav className="post-nav" aria-label="More articles">
                {older && (
                  <Link href={`/blog/${older.slug}`} rel="prev">
                    <div className="dir">← Previous</div>
                    <div className="t">{older.title}</div>
                  </Link>
                )}
                {newer && (
                  <Link href={`/blog/${newer.slug}`} rel="next" className="next">
                    <div className="dir">Next →</div>
                    <div className="t">{newer.title}</div>
                  </Link>
                )}
              </nav>
            )}
          </div>

          {headings.length > 2 && <Toc headings={headings} />}
        </div>
      </div>

      {related.length > 0 && (
        <section className="section" aria-labelledby="related-heading">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Keep reading</span>
                <h2 id="related-heading" className="section-title">
                  Related <span className="serif">articles</span>
                </h2>
              </div>
              <Link className="btn btn-ghost" href="/blog">
                All writing
              </Link>
            </div>
            <div className="grid-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
