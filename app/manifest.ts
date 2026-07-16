import type { MetadataRoute } from "next";
import { CHURCH } from "@/lib/site";

/**
 * Web app manifest so members can add the church to their phone's
 * home screen like an app (no app store required).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: CHURCH.name,
    short_name: "Agape Life",
    description: `${CHURCH.name} — ${CHURCH.tagline} Sunday worship every Sunday at 9:00 AM CST in New Orleans, LA.`,
    start_url: "/",
    display: "standalone",
    background_color: "#0d1633",
    theme_color: "#0d1633",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
