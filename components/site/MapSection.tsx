"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, MapPin, Navigation } from "lucide-react";
import { CHURCH, FULL_ADDRESS, MAPS } from "@/lib/site";

/**
 * Click-to-load map facade: the Google Maps iframe is only fetched
 * after the visitor asks for it, keeping the initial page light on
 * slow cellular connections.
 */
export default function MapSection() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(FULL_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the address is visible on screen to copy manually.
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-cream-300 bg-white shadow-sm">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/7]">
        {mapLoaded ? (
          <iframe
            src={MAPS.embed}
            title={`Map showing ${CHURCH.name} at ${FULL_ADDRESS}`}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="hero-light absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-cream-50">
            <MapPin className="h-10 w-10 text-gold-400" aria-hidden />
            <p className="max-w-sm">
              <span className="block font-serif text-xl font-semibold">
                {CHURCH.addressLine1}, {CHURCH.addressLine2}
              </span>
              <span className="text-midnight-100">
                {CHURCH.city}, {CHURCH.state} {CHURCH.zip}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setMapLoaded(true)}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold-400 px-6 py-3 font-semibold text-midnight-950 transition-colors hover:bg-gold-300"
            >
              View Map
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 p-5">
        <a
          href={MAPS.open}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-midnight-50 px-5 py-2.5 text-sm font-semibold text-midnight-800 transition-colors hover:bg-midnight-100"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Open in Google Maps
        </a>
        <a
          href={MAPS.directions}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-royal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal-500"
        >
          <Navigation className="h-4 w-4" aria-hidden />
          Get Directions
        </a>
        <button
          type="button"
          onClick={copyAddress}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-midnight-50 px-5 py-2.5 text-sm font-semibold text-midnight-800 transition-colors hover:bg-midnight-100"
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Copy className="h-4 w-4" aria-hidden />
          )}
          {copied ? "Address Copied!" : "Copy Address"}
        </button>
      </div>
    </div>
  );
}
