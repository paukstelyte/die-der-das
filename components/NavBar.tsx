"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/rules", label: "The Rules" },
  { href: "/cards", label: "Manage cards" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-black/15 bg-[var(--paper)]">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 font-semibold tracking-tight text-zinc-950"
        >
          <span className="flex h-7 w-7 items-center justify-center bg-[var(--accent)] text-xs font-bold transition-transform group-hover:-rotate-6">d·d·d</span>
          <span>die·der·das</span>
        </Link>
        <ul className="flex items-center gap-1">
          {LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-600 hover:bg-black/5"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
