"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/daily-word", label: "Daily Word" },
  { href: "/visit", label: "Visit Us" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-midnight-100 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex flex-col leading-tight"
          onClick={() => setOpen(false)}
        >
          <span className="font-serif text-lg font-semibold tracking-wide text-midnight-900 sm:text-xl">
            AGAPE LIFE MINISTRY
          </span>
          <span className="text-xs tracking-widest text-royal-600 uppercase">
            Sharing God&apos;s unconditional love
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-royal-100 text-royal-800"
                  : "text-midnight-800 hover:bg-midnight-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/visit"
            className="ml-3 rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-midnight-950 shadow-sm transition-colors hover:bg-gold-300"
          >
            Plan Your Visit
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-midnight-900 hover:bg-midnight-50 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-midnight-100 bg-cream-50 px-4 pt-2 pb-5 lg:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3.5 text-base font-medium ${
                    pathname === link.href
                      ? "bg-royal-100 text-royal-800"
                      : "text-midnight-900 hover:bg-midnight-50"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/visit"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-xl bg-gold-400 px-4 py-3.5 text-center text-base font-semibold text-midnight-950 hover:bg-gold-300"
          >
            Plan Your Visit
          </Link>
        </nav>
      )}
    </header>
  );
}
