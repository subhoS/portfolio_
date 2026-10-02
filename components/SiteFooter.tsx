import Link from "next/link";
import { getAllPosts } from "../lib/posts";
import { site } from "../lib/site";
import { GitHub, LinkedIn, Mail, Rss, X } from "./icons";
import Logo from "./Logo";

export default async function SiteFooter() {
  const latest = (await getAllPosts()).slice(0, 4);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link href="/" className="brand">
              <Logo id="sd-footer" size={36} />
              <span>
                Subhadeep <span className="serif">Datta</span>
              </span>
            </Link>
            <p>
              Full Stack Engineer &amp; CTO based in {site.location}. Co-Founder
              &amp; CTO at Hirerkey, Consulting CTO at Noisiv Consulting.
              Writing about systems that scale.
            </p>
            <div className="footer-socials">
              <a
                className="icon-btn"
                href={site.socials.github}
                aria-label="GitHub"
                rel="me noopener"
                target="_blank"
              >
                <GitHub />
              </a>
              <a
                className="icon-btn"
                href={site.socials.linkedin}
                aria-label="LinkedIn"
                rel="me noopener"
                target="_blank"
              >
                <LinkedIn />
              </a>
              <a
                className="icon-btn"
                href={site.socials.x}
                aria-label="X (Twitter)"
                rel="me noopener"
                target="_blank"
              >
                <X />
              </a>
              <a
                className="icon-btn"
                href={`mailto:${site.email}`}
                aria-label="Email"
              >
                <Mail />
              </a>
              <a className="icon-btn" href="/rss.xml" aria-label="RSS feed">
                <Rss />
              </a>
            </div>
          </div>
          <nav aria-labelledby="footer-site">
            <h2 id="footer-site">Site</h2>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/projects">Work</Link>
              </li>
              <li>
                <Link href="/blog">Writing</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
          <nav aria-labelledby="footer-latest">
            <h2 id="footer-latest">Latest writing</h2>
            <ul>
              {latest.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`}>{p.title.split(":")[0]}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="footer-more">
            <h2 id="footer-more">Elsewhere</h2>
            <ul>
              <li>
                <a
                  href={site.socials.linkedin}
                  rel="me noopener"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={site.socials.github} rel="me noopener" target="_blank">
                  GitHub
                </a>
              </li>
              <li>
                <a href={site.socials.x} rel="me noopener" target="_blank">
                  X / Twitter
                </a>
              </li>
              <li>
                <a href={site.resume}>Résumé (PDF)</a>
              </li>
              <li>
                <a href="/rss.xml">RSS feed</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          Subhadeep Datta
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span>Built with Next.js · Hosted on Vercel</span>
        </div>
      </div>
    </footer>
  );
}
