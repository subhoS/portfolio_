import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsPath = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  title: string;
  description?: string;
  excerpt?: string;
  date?: string;
  tags?: string[];
  keywords?: string[];
  author?: string;
  featured_image?: string;
  slug: string;
};

export async function getPostSlugs() {
  try {
    const files = await fs.readdir(postsPath);
    const slugs = files
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
    console.log("Found blog post slugs:", slugs);
    return slugs;
  } catch (e) {
    console.error("Error reading blog posts directory:", e);
    return [];
  }
}

// Calculate reading time based on word count
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsPath, `${slug}.md`);
  const raw = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();
  const readingTime = calculateReadingTime(content);

  const meta: PostMeta = {
    title: data.title || slug,
    description: data.description || data.excerpt || "",
    excerpt: data.excerpt || "",
    date: data.date || "",
    tags: data.tags || [],
    keywords: data.keywords?.split(",").map((k: string) => k.trim()) || [],
    author: data.author || "Subhadeep Datta",
    featured_image: data.featured_image || data.image || "",
    slug,
  };
  return { meta, contentHtml, readingTime };
}

export async function getAllPosts() {
  const slugs = await getPostSlugs();
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const fullPath = path.join(postsPath, `${slug}.md`);
      const raw = await fs.readFile(fullPath, "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        date: data.date || "",
      };
    })
  );
  // sort by date desc when possible
  return items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}
