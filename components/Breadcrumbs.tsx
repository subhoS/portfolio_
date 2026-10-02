import Link from "next/link";

export type Crumb = { name: string; path: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) =>
          i === items.length - 1 ? (
            <li key={item.path} aria-current="page">
              {item.name}
            </li>
          ) : (
            <li key={item.path}>
              <Link href={item.path}>{item.name}</Link>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
