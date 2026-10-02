import Breadcrumbs from "../../components/Breadcrumbs";
import ContactForm from "../../components/ContactForm";
import JsonLd from "../../components/JsonLd";
import { GitHub, LinkedIn, Mail, MapPin, X } from "../../components/icons";
import { breadcrumbSchema, graph } from "../../lib/schema";
import { pageMetadata } from "../../lib/seo";
import { absoluteUrl, ids, site } from "../../lib/site";

export const metadata = pageMetadata({
  title: "Contact Subhadeep Datta — Advisory, Fractional CTO & Architecture",
  absoluteTitle: true,
  description:
    "Get in touch with Subhadeep Datta for fractional CTO work, architecture and performance reviews, AI/RAG systems, speaking or collaboration. Email, LinkedIn, X and GitHub.",
  path: "/contact",
});

export default function ContactPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];
  const channels = [
    { label: "Email", value: site.email, href: `mailto:${site.email}`, Icon: Mail },
    { label: "LinkedIn", value: "subhadeep-datta-cto", href: site.socials.linkedin, Icon: LinkedIn },
    { label: "X / Twitter", value: site.twitter, href: site.socials.x, Icon: X },
    { label: "GitHub", value: "subhoS", href: site.socials.github, Icon: GitHub },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          {
            "@type": "ContactPage",
            url: absoluteUrl("/contact"),
            name: `Contact ${site.name}`,
            isPartOf: { "@id": ids.website },
            about: { "@id": ids.person },
          },
          breadcrumbSchema(crumbs),
        )}
      />
      <div className="container">
        <header className="page-header">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-3">
            Let&apos;s build <span className="serif">something solid</span>
          </h1>
          <p className="lede">
            Fractional CTO engagements, architecture and performance reviews, AI/RAG systems, or just a good engineering
            conversation. I read every message and usually reply within two working days.
          </p>
        </header>

        <div className="contact-grid">
          <ContactForm email={site.email} />
          <div className="contact-side">
            {channels.map(({ label, value, href, Icon }) => (
              <a
                key={label}
                href={href}
                className="card card-hover contact-item"
                {...(href.startsWith("http") && { target: "_blank", rel: "me noopener" })}
              >
                <span className="ic">
                  <Icon />
                </span>
                <span>
                  <b>{label}</b>
                  <span>{value}</span>
                </span>
              </a>
            ))}
            <div className="card contact-item">
              <span className="ic">
                <MapPin />
              </span>
              <span>
                <b>Based in</b>
                <span>{site.location} · working with teams worldwide</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
