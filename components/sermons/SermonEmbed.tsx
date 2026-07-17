"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/**
 * Click-to-load Facebook video embed. Nothing autoplays and no
 * Facebook scripts load until the visitor asks to watch — and if the
 * Reel can't be embedded, the card still offers "Watch on Facebook".
 */
export default function SermonEmbed({
  embedUrl,
  title,
}: {
  embedUrl: string;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="relative aspect-[9/16] max-h-[32rem] w-full overflow-hidden rounded-2xl bg-midnight-950">
        <iframe
          src={embedUrl}
          title={`Sermon video: ${title}`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          allow="encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="hero-light group relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl text-cream-50"
      aria-label={`Play sermon video: ${title}`}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-midnight-950 transition-transform group-hover:scale-105">
        <Play className="ml-1 h-7 w-7" aria-hidden />
      </span>
      <span className="px-6 text-sm font-semibold">Tap to load the video</span>
    </button>
  );
}
