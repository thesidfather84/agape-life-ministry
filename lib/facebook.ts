/**
 * Safe handling of pastor-pasted Facebook Reel links.
 *
 * Only URLs on Facebook's own domains are accepted, and embeds are
 * only derived for URL shapes Facebook's video plugin can resolve.
 * Short share links (facebook.com/share/r/…, fb.watch/…) are valid
 * sermon links but can't be embedded reliably, so those sermons show
 * a clean "Watch on Facebook" card instead of a broken player.
 */

const ALLOWED_HOSTS = new Set([
  "facebook.com",
  "www.facebook.com",
  "m.facebook.com",
  "web.facebook.com",
  "fb.watch",
]);

export interface FacebookUrlResult {
  ok: boolean;
  /** Cleaned canonical URL (https, no tracking params kept as-is otherwise). */
  url?: string;
  /** Facebook video-plugin embed URL when the link shape supports it. */
  embedUrl?: string | null;
  error?: string;
}

/** Validate a pasted link and derive a safe embed URL when possible. */
export function parseFacebookUrl(raw: string): FacebookUrlResult {
  const input = raw.trim();
  if (!input) return { ok: false, error: "Please paste the Facebook link." };

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  } catch {
    return { ok: false, error: "That doesn't look like a valid link." };
  }

  const host = url.hostname.toLowerCase();
  if (!ALLOWED_HOSTS.has(host)) {
    return {
      ok: false,
      error:
        "Please paste a Facebook link (facebook.com or fb.watch). Other websites can't be used here.",
    };
  }

  // Force https and drop any credentials/ports someone might sneak in.
  const clean = `https://${host}${url.pathname}${url.search}`;

  const path = url.pathname;
  const isReel = /^\/reel\/[\w.-]+/.test(path);
  const isVideoPage =
    /^\/[\w.-]+\/videos\/[\w.-]+/.test(path) ||
    (path.startsWith("/watch") && url.searchParams.has("v"));
  const isShareLink =
    /^\/share\/r\//.test(path) || /^\/share\/v\//.test(path) || host === "fb.watch";

  if (!isReel && !isVideoPage && !isShareLink && !path.startsWith("/watch")) {
    return {
      ok: false,
      error:
        "That Facebook link doesn't look like a Reel or video. Open the Reel, tap Share, then Copy Link, and paste that here.",
    };
  }

  // Facebook's public video plugin resolves direct reel/video URLs.
  // Redirect-style share links are stored but not embedded.
  let embedUrl: string | null = null;
  if (isReel || isVideoPage) {
    const canonical = `https://www.facebook.com${path}${isVideoPage && url.searchParams.has("v") ? `?v=${encodeURIComponent(url.searchParams.get("v") ?? "")}` : ""}`;
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(canonical)}&show_text=false&width=560`;
  }

  return { ok: true, url: clean, embedUrl };
}

/** True only for the embed URLs this site generates itself. */
export function isSafeEmbedUrl(embedUrl: string): boolean {
  try {
    const url = new URL(embedUrl);
    return (
      url.protocol === "https:" &&
      url.hostname === "www.facebook.com" &&
      url.pathname === "/plugins/video.php"
    );
  } catch {
    return false;
  }
}
