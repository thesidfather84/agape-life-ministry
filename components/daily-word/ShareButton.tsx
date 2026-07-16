"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail, MessageCircle, Share2 } from "lucide-react";

/** Facebook "f" mark (lucide no longer ships brand icons). */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 21v-7h2.4l.45-3H13.5V9.05c0-.87.28-1.55 1.62-1.55h1.38V4.8c-.3-.04-1.3-.13-2.47-.13-2.44 0-4.03 1.49-4.03 4.22V11H7.5v3H10v7h3.5Z" />
    </svg>
  );
}

/**
 * Shares the Daily Word with the native share sheet when available
 * (most phones); otherwise opens a small menu with text message,
 * Facebook, email, and copy-link options.
 */
export default function ShareButton({
  title,
  text,
  path,
}: {
  title: string;
  text: string;
  path: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  function shareUrl(): string {
    return new URL(path, window.location.origin).toString();
  }

  async function handleShare() {
    const url = shareUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // User closed the share sheet — nothing to do.
        return;
      }
    }
    setMenuOpen((v) => !v);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable; leave the menu open so another option can be used.
    }
  }

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-midnight-50 px-5 py-2.5 text-sm font-semibold text-midnight-800 transition-colors hover:bg-midnight-100"
        aria-expanded={menuOpen}
      >
        <Share2 className="h-4 w-4" aria-hidden />
        Share
      </button>

      {menuOpen && (
        <div className="absolute bottom-full left-0 z-20 mb-2 w-56 rounded-2xl border border-midnight-100 bg-white p-2 shadow-lg">
          <a
            href={`sms:?&body=${encodeURIComponent(`${text} ${shareUrl()}`)}`}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-midnight-800 hover:bg-midnight-50"
          >
            <MessageCircle className="h-4 w-4 text-royal-600" aria-hidden />
            Text message
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-midnight-800 hover:bg-midnight-50"
          >
            <FacebookIcon className="h-4 w-4 text-royal-600" />
            Facebook
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${shareUrl()}`)}`}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-midnight-800 hover:bg-midnight-50"
          >
            <Mail className="h-4 w-4 text-royal-600" aria-hidden />
            Email
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-midnight-800 hover:bg-midnight-50"
          >
            {copied ? (
              <Check className="h-4 w-4 text-royal-600" aria-hidden />
            ) : (
              <Copy className="h-4 w-4 text-royal-600" aria-hidden />
            )}
            {copied ? "Link copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
