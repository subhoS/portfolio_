import Link from "next/link";
import { getAllPosts } from "../lib/posts";

export const metadata = { title: "Page not found", robots: { index: false } };

export default async function NotFound() {
  const posts = (await getAllPosts()).slice(0, 4);
  return (
    <div className="container not-found">
      <div className="code gradient-text">404</div>
      <h1 style={{ fontSize: 28 }}>This page took an unplanned outage.</h1>
      <p className="muted">
        It may have moved. Here are some places that are definitely up:
      </p>
      <div className="row" style={{ justifyContent: "center" }}>
        <Link className="btn btn-primary" href="/">
          Home
        </Link>
        <Link className="btn btn-ghost" href="/blog">
          Writing
        </Link>
        <Link className="btn btn-ghost" href="/about">
          About
        </Link>
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "grid",
          gap: 8,
          marginTop: 16,
        }}
      >
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              style={{ color: "var(--brand-ink)" }}
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
