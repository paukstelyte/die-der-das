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
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-semibold text-zinc-900 dark:text-zinc-50"
        >
          der·die·das
        </Link>
        <ul className="flex gap-1">
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
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
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
