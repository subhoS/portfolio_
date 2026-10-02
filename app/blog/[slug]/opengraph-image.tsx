import { ogSize, renderOg, siteHost } from "../../../lib/og";
import { getPostBySlug, getPostSlugs } from "../../../lib/posts";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Article by Subhadeep Datta";

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return renderOg({
    eyebrow: `${post?.category ?? "Writing"} · ${post?.readingTime ?? 5} min read`,
    title: post?.title ?? "Writing by Subhadeep Datta",
    footer: `${siteHost}/blog`,
  });
}
