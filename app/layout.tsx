import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Syne, Barlow } from "next/font/google";
import "./globals.css";
import "./studio.css";
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
    "web design Downey CA",
    "web development studio",
    "landing page design",
    "landing pages Los Angeles",
    "affordable websites for small business",
    "bilingual web design English Spanish",
    "diseño web en español",
    "websites",
    "webpages",
    "webs",
    "web app development",
    "SaaS",
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
    languages: {
      "en-US": BASE_URL,
      "es": `${BASE_URL}/es`,
      "x-default": BASE_URL,
    },
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const htmlLang = pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";

  return (
    <html lang={htmlLang} translate="no" className={`${inter.variable} ${syne.variable} ${barlow.variable}`}>
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
              "@graph": [
                {
                  "@type": "ProfessionalService",
                  "@id": "https://uxcodestudio.com/#business",
                  name: "UXCODESTUDIO",
                  url: "https://uxcodestudio.com",
                  email: "info@uxcodestudio.com",
                  image: "https://uxcodestudio.com/og-image.png",
                  description: "Web design and development studio specializing in landing pages, websites, web apps, SaaS platforms and mobile apps. Bilingual service in English and Spanish.",
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
                  knowsLanguage: ["en", "es"],
                  sameAs: [
                    "https://github.com/omarrey44",
                  ],
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Web Design & Development Services",
                    itemListElement: [
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Landing Page" }, price: "150", priceCurrency: "USD", description: "One professional page focused on a single service, offer, or campaign. Starting price." },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Website" }, price: "400", priceCurrency: "USD", description: "Multi-page professional website with services, about, and contact sections. Starting price." },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Online Store" }, price: "400", priceCurrency: "USD", description: "E-commerce website with product catalog, cart, and secure checkout. Starting price." },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Booking & Contact Page" }, price: "100", priceCurrency: "USD", description: "Simple page for contact, quotes, and appointment scheduling. Starting price." },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Website Updates" }, price: "350", priceCurrency: "USD", description: "Redesign and refresh of an existing website. Starting price." },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hosting Management" }, price: "11.99", priceCurrency: "USD", description: "Managed hosting with domain, SSL, and monitoring. Monthly." },
                      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobile Apps & Custom Projects" }, description: "Mobile apps, advanced web applications, and custom integrations. Custom quote." },
                    ],
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://uxcodestudio.com/#website",
                  url: "https://uxcodestudio.com",
                  name: "UXCODESTUDIO",
                  publisher: { "@id": "https://uxcodestudio.com/#business" },
                  inLanguage: ["en", "es"],
                },
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
