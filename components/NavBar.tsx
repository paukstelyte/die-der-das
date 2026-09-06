"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/rules", label: "The Rules" },
  { href: "/cards", label: "Manage cards" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--line)] bg-[var(--paper)] print:hidden">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 font-semibold tracking-tight text-zinc-950 dark:text-zinc-100"
        >
          <span className="flex h-7 w-7 items-center justify-center bg-[var(--accent)] text-xs font-bold text-zinc-950 transition-transform group-hover:-rotate-6">d·d·d</span>
          <span>die·der·das</span>
        </Link>
        <div className="flex items-center gap-3">
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
                        ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "text-zinc-600 hover:bg-black/5 dark:text-zinc-400 dark:hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
