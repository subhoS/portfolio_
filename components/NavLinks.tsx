"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "../lib/site";

export default function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() || "/";
  return (
    <>
      {nav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
