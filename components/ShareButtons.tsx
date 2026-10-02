import { site } from "../lib/site";
import CopyLink from "./CopyLink";
import { HackerNews, LinkedIn, Reddit, X } from "./icons";

export default function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const handle = site.twitter.replace("@", "");
  const links = [
    {
      label: "Share on X",
      href: `https://x.com/intent/post?text=${t}&url=${u}&via=${handle}`,
      Icon: X,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      Icon: LinkedIn,
    },
    {
      label: "Submit to Hacker News",
      href: `https://news.ycombinator.com/submitlink?u=${u}&t=${t}`,
      Icon: HackerNews,
    },
    {
      label: "Share on Reddit",
      href: `https://www.reddit.com/submit?url=${u}&title=${t}`,
      Icon: Reddit,
    },
  ];
  return (
    <div className="share">
      <span className="label">Found this useful? Share it:</span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          className="icon-btn"
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon />
        </a>
      ))}
      <CopyLink url={url} />
    </div>
  );
}
