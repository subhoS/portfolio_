import Image from "next/image";
import Link from "next/link";
import { site } from "../lib/site";
import avatar from "../public/subhadeep-datta.jpg";

export default function AuthorCard() {
  return (
    <aside className="author-card" aria-label="About the author">
      <Image src={avatar} alt={`${site.name}, author`} width={72} height={72} />
      <div>
        <div className="name">
          <Link href="/about">{site.name}</Link>
        </div>
        <div className="role">
          Co-Founder &amp; CTO, Hirerkey · Consulting CTO, Noisiv Consulting
        </div>
        <p>
          Subhadeep builds backend systems that handle millions of requests a
          day, and writes about what actually works in production: system
          design, performance, distributed systems and AI engineering.
        </p>
        <div className="links">
          <Link className="chip" href="/about">
            Full bio
          </Link>
          <a
            className="chip"
            href={site.socials.linkedin}
            rel="me noopener"
            target="_blank"
          >
            LinkedIn
          </a>
          <a
            className="chip"
            href={site.socials.x}
            rel="me noopener"
            target="_blank"
          >
            X / Twitter
          </a>
          <a
            className="chip"
            href={site.socials.github}
            rel="me noopener"
            target="_blank"
          >
            GitHub
          </a>
          <a className="chip" href="/rss.xml">
            RSS
          </a>
        </div>
      </div>
    </aside>
  );
}
