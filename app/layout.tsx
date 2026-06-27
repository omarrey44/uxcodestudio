import type { Metadata } from "next";
import { Inter, Syne, Barlow } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-barlow",
  display: "swap",
});

const BASE_URL = "https://uxcodestudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "UXCODESTUDIO — Web Design & Development Studio | Los Angeles",
    template: "%s | UXCODESTUDIO",
  },
  description:
    "Professional web design and development studio in Los Angeles. We build landing pages, websites, web apps, SaaS platforms and mobile apps. Fast delivery, modern tech stack.",
  keywords: [
    "web design Los Angeles",
    "web development studio",
    "landing page design",
    "web app development",
    "SaaS development",
    "mobile app development",
    "Next.js developer",
    "React developer",
    "UI/UX design",
    "UXCODESTUDIO",
  ],
  authors: [{ name: "UXCODESTUDIO", url: BASE_URL }],
  creator: "UXCODESTUDIO",
  publisher: "UXCODESTUDIO",
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "UXCODESTUDIO",
    title: "UXCODESTUDIO — Web Design & Development Studio",
    description:
      "Landing pages, websites, web apps, SaaS platforms and mobile apps. Built fast with Next.js, React and Tailwind.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UXCODESTUDIO — Web Design & Development Studio",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "UXCODESTUDIO — Web Design & Development Studio",
    description:
      "Landing pages, websites, web apps and SaaS platforms. Built fast.",
    images: ["/og-image.png"],
    creator: "@uxcodestudio",
  },
  verification: {
    google: "",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="no" className={`${inter.variable} ${syne.variable} ${barlow.variable}`}>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="bg-background text-white antialiased noise">
        {/* Runs synchronously before React hydrates — prevents browser scroll restoration fighting Lenis */}
        <script dangerouslySetInnerHTML={{ __html: "if('scrollRestoration'in history){history.scrollRestoration='manual';}window.scrollTo(0,0);" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "UXCODESTUDIO",
              url: "https://uxcodestudio.com",
              email: "info@uxcodestudio.com",
              description: "Web design and development studio specializing in landing pages, websites, web apps, SaaS platforms and mobile apps.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Downey",
                addressRegion: "CA",
                postalCode: "90240",
                addressCountry: "US",
              },
              areaServed: ["US", "MX", "CA"],
              serviceType: ["Web Design", "Web Development", "Mobile App Development", "SaaS Development", "Landing Page Design"],
              priceRange: "$$",
              sameAs: [
                "https://github.com/omarrey44",
              ],
            }),
          }}
        />
        <PageLoader />
        <LanguageProvider>
          <SmoothScroll>
            <Navbar />
            {children}
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
