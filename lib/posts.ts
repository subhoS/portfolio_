import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Element, Root } from "hast";
import { toString as hastToString } from "hast-util-to-string";
import { cache } from "react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { SKIP, visit } from "unist-util-visit";

const postsDir = path.join(process.cwd(), "content", "blog");

export type Faq = { q: string; a: string };
export type Heading = { id: string; text: string; depth: 2 | 3 };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  tags: string[];
  keywords: string[];
  category: string;
  featured: boolean;
  readingTime: number;
  wordCount: number;
  faq: Faq[];
};

export type Post = PostMeta & { html: string; headings: Heading[] };

const toArray = (v: unknown): string[] => {
  if (Array.isArray(v))
    return v
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);
  if (typeof v === "string")
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
};

export const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const countWords = (text: string) =>
  text
    .replace(/[#>*_`|[\]()-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

/** Prose words, plus code weighted at half since readers skim it. */
function wordCountOf(markdown: string) {
  const code = (markdown.match(/```[\s\S]*?```/g) || []).join(" ");
  return (
    countWords(markdown.replace(/```[\s\S]*?```/g, " ")) +
    Math.round(countWords(code) / 2)
  );
}

function parseMeta(
  slug: string,
  raw: string,
): { meta: PostMeta; body: string } {
  const { data, content } = matter(raw);
  const words = wordCountOf(content);
  const date = String(data.date || "");
  return {
    body: content,
    meta: {
      slug,
      title: String(data.title || slug),
      description: String(data.description || data.excerpt || ""),
      date,
      updated: String(data.updated || date),
      tags: toArray(data.tags),
      keywords: toArray(data.keywords),
      category: String(data.category || toArray(data.tags)[0] || "Engineering"),
      featured: Boolean(data.featured),
      readingTime: Math.max(1, Math.round(words / 230)),
      wordCount: words,
      faq: Array.isArray(data.faq) ? (data.faq as Faq[]) : [],
    },
  };
}

/** Collects h2/h3 headings (after rehype-slug assigned ids) for the table of contents. */
function rehypeCollectHeadings(out: Heading[]) {
  return () => (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (
        (node.tagName === "h2" || node.tagName === "h3") &&
        node.properties?.id
      ) {
        out.push({
          id: String(node.properties.id),
          text: hastToString(node).trim(),
          depth: node.tagName === "h2" ? 2 : 3,
        });
      }
    });
  };
}

/** Lazy-load offscreen images and open external links safely. */
function rehypeEnhanceElements() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "img") {
        node.properties = {
          ...node.properties,
          loading: "lazy",
          decoding: "async",
        };
      }
      if (node.tagName === "a") {
        const href = String(node.properties?.href || "");
        if (/^https?:\/\//.test(href)) {
          node.properties = {
            ...node.properties,
            target: "_blank",
            rel: ["noopener", "noreferrer"],
          };
        }
      }
      if (node.tagName === "table") {
        // Wrap tables so they scroll horizontally on small screens.
        const table: Element = { ...node };
        node.tagName = "div";
        node.properties = { className: ["table-wrap"] };
        node.children = [table];
        return SKIP;
      }
    });
  };
}

async function renderMarkdown(markdown: string) {
  const headings: Heading[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeCollectHeadings(headings))
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: {
        className: ["heading-anchor"],
        ariaHidden: "true",
        tabIndex: -1,
      },
      content: { type: "text", value: "#" },
    })
    .use(rehypePrettyCode, {
      theme: { light: "github-light", dark: "github-dark-dimmed" },
      keepBackground: false,
      defaultLang: "plaintext",
    })
    .use(rehypeEnhanceElements)
    .use(rehypeStringify)
    .process(markdown);
  return { html: String(file), headings };
}

export const getPostSlugs = cache(async (): Promise<string[]> => {
  try {
    const files = await fs.readdir(postsDir);
    return files
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
});

export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  const slugs = await getPostSlugs();
  const metas = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await fs.readFile(path.join(postsDir, `${slug}.md`), "utf8");
      return parseMeta(slug, raw).meta;
    }),
  );
  return metas.sort(
    (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
  );
});

export const getPostBySlug = cache(
  async (slug: string): Promise<Post | null> => {
    const raw = await fs
      .readFile(path.join(postsDir, `${slug}.md`), "utf8")
      .catch(() => null);
    if (raw === null) return null;
    const { meta, body } = parseMeta(slug, raw);
    // Rendering errors are real bugs: let them fail the build instead of silently 404ing.
    const { html, headings } = await renderMarkdown(body);
    return { ...meta, html, headings };
  },
);

/** A post's topics: its category plus its tags, de-duplicated by slug. */
export function topicsOf(post: PostMeta) {
  const seen = new Map<string, string>();
  for (const t of [post.category, ...post.tags])
    if (!seen.has(tagSlug(t))) seen.set(tagSlug(t), t);
  return [...seen.values()];
}

export const getAllTags = cache(async () => {
  const posts = await getAllPosts();
  const counts = new Map<
    string,
    { tag: string; slug: string; count: number }
  >();
  for (const p of posts) {
    for (const tag of topicsOf(p)) {
      const slug = tagSlug(tag);
      const entry = counts.get(slug) ?? { tag, slug, count: 0 };
      entry.count += 1;
      counts.set(slug, entry);
    }
  }
  return [...counts.values()].sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  );
});

export async function getPostsByTag(slug: string) {
  const posts = await getAllPosts();
  return posts.filter((p) => topicsOf(p).some((t) => tagSlug(t) === slug));
}

/** Related posts ranked by shared tags, then recency. */
export async function getRelatedPosts(post: PostMeta, limit = 3) {
  const posts = await getAllPosts();
  const mine = new Set(post.tags.map(tagSlug));
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score: p.tags.filter((t) => mine.has(tagSlug(t))).length,
    }))
    .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
    .slice(0, limit)
    .map(({ p }) => p);
}

export function formatDate(date: string, month: "long" | "short" = "long") {
  if (!date) return "";
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "numeric",
    timeZone: "UTC",
  });
}
