import { getAllPosts, getPostBySlug } from "./posts";

/** Full posts for feeds, with relative links made absolute so they work in any reader. */
export async function getFeedPosts(siteUrl: string, limit = 50) {
  const metas = (await getAllPosts()).slice(0, limit);
  const posts = await Promise.all(metas.map((m) => getPostBySlug(m.slug)));
  return posts
    .filter((p) => p !== null)
    .map((p) => ({
      ...p,
      url: `${siteUrl}/blog/${p.slug}`,
      html: p.html.replace(/(href|src)="\/(?!\/)/g, `$1="${siteUrl}/`),
    }));
}

export const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
