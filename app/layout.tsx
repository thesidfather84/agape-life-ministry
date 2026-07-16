import type { Metadata, Viewport } from "next";
import { Geist, Lora } from "next/font/google";
import "./globals.css";
import { CHURCH, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${CHURCH.name} | ${CHURCH.serviceTime} | New Orleans, LA`,
    template: `%s | ${CHURCH.name}`,
  },
  description: `${CHURCH.name} is a welcoming church in New Orleans East led by ${CHURCH.pastor}. Sunday worship every Sunday at 9:00 AM CST at ${CHURCH.addressLine1}, ${CHURCH.addressLine2}, New Orleans, LA ${CHURCH.zip}. Everyone is welcome.`,
  applicationName: CHURCH.name,
  keywords: [
    "Agape Life Ministry",
    "church New Orleans",
    "New Orleans East church",
    "Sunday worship New Orleans",
    "Arthur Warning",
    "agape love",
  ],
  openGraph: {
    type: "website",
    siteName: CHURCH.name,
    title: `${CHURCH.name} — Experience the Unconditional Love of God`,
    description: `Sunday worship every Sunday at 9:00 AM CST. ${CHURCH.addressLine1}, ${CHURCH.addressLine2}, New Orleans, LA ${CHURCH.zip}. Everyone is welcome.`,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `${CHURCH.name} — Experience the Unconditional Love of God`,
    description:
      "Sunday worship every Sunday at 9:00 AM CST in New Orleans, LA. Everyone is welcome.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d1633",
  width: "device-width",
  initialScale: 1,
};

const churchJsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: CHURCH.name,
  url: SITE_URL,
  founder: {
    "@type": "Person",
    name: "Arthur Warning",
    jobTitle: "Founder / Pastor",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: `${CHURCH.addressLine1}, ${CHURCH.addressLine2}`,
    addressLocality: CHURCH.city,
    addressRegion: CHURCH.state,
    postalCode: CHURCH.zip,
    addressCountry: "US",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "https://schema.org/Sunday",
    opens: "09:00",
  },
  event: {
    "@type": "Event",
    name: "Sunday Worship Service",
    description: "Weekly worship service. Everyone is welcome.",
    eventSchedule: {
      "@type": "Schedule",
      byDay: "https://schema.org/Sunday",
      startTime: "09:00:00",
      scheduleTimezone: "America/Chicago",
    },
    location: {
      "@type": "PlaceOfWorship",
      name: CHURCH.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${CHURCH.addressLine1}, ${CHURCH.addressLine2}`,
        addressLocality: CHURCH.city,
        addressRegion: CHURCH.state,
        postalCode: CHURCH.zip,
        addressCountry: "US",
      },
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
