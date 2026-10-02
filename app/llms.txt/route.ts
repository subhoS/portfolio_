import profile from "../../data/profile.json";
import { getAllPosts } from "../../lib/posts";
import { site } from "../../lib/site";

export const dynamic = "force-static";

/** llms.txt (https://llmstxt.org): a plain-text map of the site for AI assistants and answer engines. */
export async function GET() {
  const posts = await getAllPosts();
  const body = `# ${site.name}

> ${site.description}

${site.name} is based in ${site.location}. Contact: ${site.email}. Profiles: LinkedIn ${site.socials.linkedin} · GitHub ${site.socials.github} · X ${site.socials.x}

## Career
${profile.experience.map((e) => `- ${e.role}, ${e.company} (${e.period}): ${e.summary}`).join("\n")}

## Education
- ${profile.education.degree}, ${profile.education.institution}

## Pages
- [About Subhadeep Datta](${site.url}/about): biography, career timeline, skills, certifications and FAQ
- [Work & case studies](${site.url}/projects): Hirerkey, Noisiv Consulting, Qid, Sounf, Videtorrium
- [Writing](${site.url}/blog): all articles
- [Contact](${site.url}/contact)

## Articles
${posts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}): ${p.description}`).join("\n")}

## Feeds
- [RSS](${site.url}/rss.xml)
- [JSON Feed](${site.url}/feed.json)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
