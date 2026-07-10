import { DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import BackgroundFX from "@/components/BackgroundFX";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const siteUrl = "https://turfnext.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TurfNext — Every City. Every Sport. One App. | Coming Soon",
    template: "%s | TurfNext",
  },
  description:
    "TurfNext is launching soon. India's AI-powered sports platform for booking turfs, finding players, and joining tournaments. Register now as a player or list your venue.",
  keywords: [
    "TurfNext",
    "turf booking India",
    "sports app India",
    "book a turf",
    "find players",
    "sports tournaments",
    "list your turf",
    "football turf booking",
    "cricket ground booking",
  ],
  applicationName: "TurfNext",
  authors: [{ name: "TurfNext Technologies Pvt. Ltd." }],
  themeColor: "#0D0D0D",
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 72'%3E%3Cpolygon points='8,72 22,72 44,28 30,28' fill='%23C8FF00'/%3E%3Cpolygon points='28,72 40,72 62,28 50,28' fill='%23C8FF00' opacity='0.35'/%3E%3C/svg%3E",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "TurfNext",
    title: "TurfNext — Every City. Every Sport. One App. | Coming Soon",
    description:
      "India's AI-powered sports platform for booking turfs, finding players, and joining tournaments. Register now as a player or list your venue.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "TurfNext — Every City. Every Sport. One App. | Coming Soon",
    description:
      "India's AI-powered sports platform for booking turfs, finding players, and joining tournaments.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "TurfNext Technologies Pvt. Ltd.",
      url: siteUrl,
      sameAs: [
        "https://instagram.com",
        "https://linkedin.com",
        "https://twitter.com",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "TurfNext",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: "TurfNext",
      applicationCategory: "SportsApplication",
      operatingSystem: "iOS, Android, Web",
      description:
        "India's AI-powered sports platform for booking turfs, finding players, and joining tournaments.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body text-[15px] leading-[1.6] bg-bg text-ink min-h-screen overflow-x-hidden">
        <BackgroundFX />
        {children}
      </body>
    </html>
  );
}
