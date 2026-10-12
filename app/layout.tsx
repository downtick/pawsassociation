import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityToggle from "@/components/AccessibilityToggle";
import IconSprite from "@/components/IconSprite";
import Analytics from "@/components/Analytics";
import { SITE } from "@/lib/siteConfig";
import { A11Y_BOOT } from "@/components/a11yBoot";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Find petting zoos, pony rides & animal attractions`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "The Professional Association of Wildlife & Sports: a national directory of petting zoos, pony rides, beer burros, and mobile farms. Search by attraction type, state, and city — free, with requests going straight to the operator. Operators: join for $149 a year.",
  keywords: [
    "petting zoo near me",
    "pony rides for parties",
    "beer burro rental",
    "mobile farm for events",
    "animal attraction directory",
    "amusement operator association",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} | Find petting zoos, pony rides & animal attractions`,
    description:
      "A national directory of animal attractions and amusement operators — free to search, with requests going straight to the operator.",
    url: SITE.url,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: "Find petting zoos, pony rides, beer burros, and mobile farms near you.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className="h-full">
      <head>
        <script dangerouslySetInnerHTML={{ __html: A11Y_BOOT }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* One sprite for the whole document; <Icon /> references its symbols. */}
        <IconSprite />
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main" className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <AccessibilityToggle />
        <Analytics />
      </body>
    </html>
  );
}
