import Link from "next/link";
import { formatDate, type PostMeta, tagSlug } from "../lib/posts";
import { ArrowRight } from "./icons";

export function PostCard({ post, feature = false }: { post: PostMeta; feature?: boolean }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className={`card card-hover post-card${feature ? " post-card-feature" : ""}`}>
      {feature && (
        <span className="feature-mark" aria-hidden="true">
          &ldquo;
        </span>
      )}
      <div className="meta">
        <span className="chip chip-brand">{post.category}</span>
        <time dateTime={post.date}>{formatDate(post.date, "short")}</time>
        <span>· {post.readingTime} min read</span>
      </div>
      <h3>
        <Link href={href} className="card-link">
          {post.title}
        </Link>
      </h3>
      <p>{post.description}</p>
      <span className="read" aria-hidden="true">
        Read article <ArrowRight />
      </span>
    </article>
  );
}

export function PostRow({ post, headingLevel = 3 }: { post: PostMeta; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="post-row">
      <time dateTime={post.date}>{formatDate(post.date, "short")}</time>
      <div>
        <H>
          <Link href={`/blog/${post.slug}`} className="card-link">
            {post.title}
          </Link>
        </H>
        <p>{post.description}</p>
        <div className="tags">
          {post.tags.slice(0, 4).map((t) => (
            <Link key={t} href={`/blog/tag/${tagSlug(t)}`} className="chip">
              {t}
            </Link>
          ))}
        </div>
      </div>
      <span className="rt">{post.readingTime} min</span>
    </article>
  );
}
