import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import JsonLd from "../../components/JsonLd";
import { ArrowRight, Download } from "../../components/icons";
import profile from "../../data/profile.json";
import { breadcrumbSchema, faqSchema, graph } from "../../lib/schema";
import { pageMetadata } from "../../lib/seo";
import { absoluteUrl, ids, site } from "../../lib/site";
import portrait from "../../public/subhadeep-datta.jpg";

export const metadata = pageMetadata({
  title: "About Subhadeep Datta — CTO, Full Stack Engineer & Systems Architect",
  absoluteTitle: true,
  description:
    "Who is Subhadeep Datta? Co-Founder & CTO of Hirerkey, Consulting CTO at Noisiv Consulting and former Technology Lead at Qid. Biography, career timeline, skills, certifications and how to get in touch.",
  path: "/about",
  type: "profile",
  keywords: ["Subhadeep Datta", "who is Subhadeep Datta", "Subhadeep Datta biography", "Subhadeep Datta CTO"],
});

const faq = [
  {
    q: "Who is Subhadeep Datta?",
    a: "Subhadeep Datta is a Full Stack Engineer and CTO based in New Delhi, India. He is the Co-Founder & CTO of Hirerkey, an AI-native Human Capital Management platform based in Dubai, and the Consulting CTO at Noisiv Consulting. He previously led technology at Qid, a digital identity and check-in platform.",
  },
  {
    q: "What does Subhadeep Datta work on?",
    a: "He designs and builds backend and distributed systems — high-throughput APIs, Kafka and Redis messaging pipelines, database performance, and AI/LLM features such as retrieval-augmented generation (RAG). He also leads engineering teams and sets technical strategy.",
  },
  {
    q: "Which companies has Subhadeep Datta worked with?",
    a: "Hirerkey (Co-Founder & CTO, 2025–present), Noisiv Consulting (Consulting CTO since 2023, Partner Technology Manager 2021–2023), Qid (Technology Lead, 2021–2024) and Videtorrium (Software Engineer, 2020–2021).",
  },
  {
    q: "What technologies does Subhadeep Datta use?",
    a: "Primarily Java, Node.js, Python and Go on the backend; React, Next.js and Flutter on the frontend; MongoDB, PostgreSQL, Redis and Kafka for data; and AWS, Docker, Kubernetes and Terraform for infrastructure, along with LLMs, RAG and vector databases.",
  },
  {
    q: "Where did Subhadeep Datta study?",
    a: "He holds a Bachelor of Science in Information Technology from Jamia Hamdard, New Delhi, and completed Harvard's CS50.",
  },
  {
    q: "How can I contact Subhadeep Datta?",
    a: `Email ${site.email}, connect on LinkedIn, or use the contact page on subhadeep-datta.dev. He is open to advisory, fractional CTO and architecture engagements.`,
  },
];

const values = [
  {
    title: "Measure, then optimize",
    body: "Every performance win I've shipped started with a profiler or a slow-query log, not a hunch. Numbers first, opinions second.",
  },
  {
    title: "Boring technology, sharp execution",
    body: "Postgres, Redis and Kafka will outlive most frameworks. I pick proven tools and spend the innovation budget on the product.",
  },
  {
    title: "Design for the failure case",
    body: "Networks drop, queues back up, and third-party APIs time out. Systems should degrade gracefully, not fall over.",
  },
  {
    title: "Teams scale systems",
    body: "Architecture is a people problem too. Clear ownership, good reviews and written decisions are what let a codebase grow.",
  },
];

export default function AboutPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          {
            "@type": "ProfilePage",
            "@id": absoluteUrl("/about#profilepage"),
            url: absoluteUrl("/about"),
            name: `About ${site.name}`,
            isPartOf: { "@id": ids.website },
            mainEntity: { "@id": ids.person },
            about: { "@id": ids.person },
            primaryImageOfPage: absoluteUrl(site.avatar),
            dateModified: new Date().toISOString().slice(0, 10),
          },
          breadcrumbSchema(crumbs),
          faqSchema(faq),
        )}
      />
      <div className="container">
        <header className="page-header">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-3">
            About <span className="serif">Subhadeep Datta</span>
          </h1>
          <p className="lede">
            Engineer, CTO and writer. I&apos;ve spent the last six years building backends that stay up when traffic
            doesn&apos;t behave, and helping teams ship them.
          </p>
        </header>

        <section className="about-intro" aria-label="Biography">
          <div className="prose">
            <p>
              I&apos;m Subhadeep Datta, a Full Stack Engineer and CTO based in {site.location}. Today I&apos;m the{" "}
              <strong>Co-Founder &amp; CTO of Hirerkey</strong>, an AI-native Human Capital Management platform based in
              Dubai, where I lead technical strategy and built the core platform on Java, Python, Node.js, MongoDB and
              Kafka. Alongside that I&apos;m the <strong>Consulting CTO at Noisiv Consulting</strong>, designing backend
              systems that serve millions of API requests a day at 99.9% uptime.
            </p>
            <p>
              Before that I was the <strong>Technology Lead at Qid</strong>, where I led a team of five engineers
              building a secure digital check-in platform integrated with India Stack. It processed over 100,000
              verifications in its first six months, often in places with unreliable connectivity, which taught me more
              about offline-first design and caching than any textbook. My first role was as a software engineer at{" "}
              <strong>Videtorrium</strong>, shipping React and Node.js features for a student hiring platform.
            </p>
            <p>
              The work I enjoy most sits where performance meets product: cutting database response times by 60% through
              schema redesign, building a Kafka and Redis pipeline that moves 75,000+ messages per second at sub-50ms
              latency, or wiring LLMs and RAG pipelines into workflows that people actually use.
            </p>
            <p>
              I write on this site to document what works in production, and what doesn&apos;t. If you&apos;re
              working on something hard, <Link href="/contact">I&apos;d like to hear about it</Link>.
            </p>
            <div className="row mt-3">
              <Link className="btn btn-primary" href="/blog">
                Read my writing <ArrowRight className="arrow" />
              </Link>
              <a className="btn btn-ghost" href={site.resume}>
                <Download /> Download résumé
              </a>
            </div>
          </div>

          <aside className="facts" aria-label="Quick facts">
            <Image
              src={portrait}
              alt="Subhadeep Datta"
              sizes="(max-width: 900px) 420px, 340px"
              placeholder="blur"
              priority
            />
            <dl>
              <div>
                <dt>Name</dt>
                <dd>Subhadeep Datta</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>Co-Founder &amp; CTO, Hirerkey</dd>
              </div>
              <div>
                <dt>Also</dt>
                <dd>Consulting CTO, Noisiv Consulting</dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>{site.location}</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Distributed systems, backend performance, AI/LLMs</dd>
              </div>
              <div>
                <dt>Education</dt>
                <dd>B.Sc. IT, Jamia Hamdard</dd>
              </div>
              <div>
                <dt>Elsewhere</dt>
                <dd>
                  <a href={site.socials.linkedin} rel="me noopener" target="_blank">
                    LinkedIn
                  </a>{" "}
                  ·{" "}
                  <a href={site.socials.github} rel="me noopener" target="_blank">
                    GitHub
                  </a>{" "}
                  ·{" "}
                  <a href={site.socials.x} rel="me noopener" target="_blank">
                    X
                  </a>
                </dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="section" aria-labelledby="career-heading">
          <div className="section-head">
            <div>
              <span className="eyebrow">Career</span>
              <h2 id="career-heading" className="section-title">
                Timeline
              </h2>
            </div>
          </div>
          <ol className="timeline">
            {profile.experience.map((e) => (
              <li key={`${e.company}-${e.role}`}>
                <div className="period">{e.period}</div>
                <div>
                  <h3>
                    {e.role} ·{" "}
                    {e.url ? (
                      <a className="org" href={e.url} target="_blank" rel="noopener">
                        {e.company}
                      </a>
                    ) : (
                      <span className="org">{e.company}</span>
                    )}
                  </h3>
                  <p>{e.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="values-heading">
          <div className="section-head">
            <div>
              <span className="eyebrow">Principles</span>
              <h2 id="values-heading" className="section-title">
                How I <span className="serif">work</span>
              </h2>
            </div>
          </div>
          <div className="values">
            {values.map((v, i) => (
              <div className="card value" key={v.title}>
                <span className="num">0{i + 1}</span>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="certs-heading">
          <div className="section-head">
            <div>
              <span className="eyebrow">Learning</span>
              <h2 id="certs-heading" className="section-title">
                Certifications &amp; programs
              </h2>
            </div>
          </div>
          <ul className="cert-list">
            {profile.awards.map((a) => (
              <li key={a.title}>
                <div>
                  <b>{a.title}</b>
                  <span>{a.issuer}</span>
                </div>
                <span className="yr">{a.year}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="faq container-narrow" style={{ paddingInline: 0 }} aria-labelledby="faq-heading">
          <h2 id="faq-heading">Frequently asked questions</h2>
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
      </div>
    </>
  );
}
