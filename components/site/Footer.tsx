import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { CHURCH } from "@/lib/site";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/sermons", label: "Sermons" },
  { href: "/daily-word", label: "Daily Word" },
  { href: "/visit", label: "Visit Us" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Footer() {
  return (
    <footer className="mt-auto bg-midnight-950 text-midnight-100">
      <div className="stained-glass-band h-1 w-full opacity-70" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl font-semibold tracking-wide text-cream-50">
            AGAPE LIFE MINISTRY
          </p>
          <p className="mt-2 text-gold-300">{CHURCH.tagline}</p>
          <p className="mt-4 text-sm text-midnight-200">{CHURCH.pastor}</p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
            <span>
              {CHURCH.serviceDay}
              <br />
              {CHURCH.serviceTime}
            </span>
          </p>
          <p className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
            <span>
              {CHURCH.addressLine1}, {CHURCH.addressLine2}
              <br />
              {CHURCH.city}, {CHURCH.stateFull} {CHURCH.zip}
            </span>
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded px-1 py-1 hover:text-gold-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="rounded px-1 py-1 hover:text-gold-300">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/admin/login"
                className="rounded px-1 py-1 text-midnight-200 hover:text-gold-300"
              >
                Admin Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-midnight-800 py-4 text-center text-xs text-midnight-200">
        © {new Date().getFullYear()} {CHURCH.name}. All rights reserved.
      </div>
    </footer>
  );
}
