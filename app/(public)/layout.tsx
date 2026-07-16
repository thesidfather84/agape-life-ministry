import type { ReactNode } from "react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import AnnouncementBanner from "@/components/site/AnnouncementBanner";

// Refresh public content every 5 minutes so the pastor's updates appear
// quickly while pages stay fast and cache-friendly.
export const revalidate = 300;

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-gold-400 focus:px-4 focus:py-2 focus:font-semibold focus:text-midnight-950"
      >
        Skip to main content
      </a>
      <AnnouncementBanner />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
