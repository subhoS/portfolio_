import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsPath = path.join(process.cwd(), "content", "blog");

// Convert markdown tables to HTML
function convertMarkdownTablesToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  let result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this is a table header line
    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      lines[i + 1].includes("---")
    ) {
      const headerCells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell);
      const separatorLine = lines[i + 1];

      // Build table HTML
      let tableHtml = "<table>\n<thead>\n<tr>\n";
      headerCells.forEach((cell) => {
        tableHtml += `<th>${cell}</th>\n`;
      });
      tableHtml += "</tr>\n</thead>\n<tbody>\n";

      // Process table rows
      i += 2;
      while (
        i < lines.length &&
        lines[i].includes("|") &&
        !lines[i].includes("---")
      ) {
        const rowCells = lines[i]
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell);

        tableHtml += "<tr>\n";
        rowCells.forEach((cell) => {
          tableHtml += `<td>${cell}</td>\n`;
        });
        tableHtml += "</tr>\n";
        i++;
      }

      tableHtml += "</tbody>\n</table>";
      result.push(tableHtml);
      continue;
    }

    result.push(line);
    i++;
  }

  return result.join("\n");
}

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

  // Convert markdown tables to HTML first
  const contentWithHtmlTables = convertMarkdownTablesToHtml(content);

  const processed = await remark().use(html).process(contentWithHtmlTables);
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
