import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import WarpStars from "@/components/WarpStars";
import { es, buildFaqJsonLd } from "@/lib/i18nData";

const Services  = dynamic(() => import("@/components/Services"));
const Process   = dynamic(() => import("@/components/Process"));
const Pricing   = dynamic(() => import("@/components/Pricing"));
const FAQ       = dynamic(() => import("@/components/FAQ"));
const FinalCTA  = dynamic(() => import("@/components/FinalCTA"));
const Footer    = dynamic(() => import("@/components/Footer"));

const BASE_URL = "https://uxcodestudio.com";

export const metadata: Metadata = {
  title: { absolute: "UXCODESTUDIO — Diseño y Desarrollo Web | Los Angeles" },
  description:
    "Estudio de diseño y desarrollo web en Los Ángeles. Creamos landing pages, sitios web, aplicaciones web, plataformas SaaS y apps móviles. Entrega rápida, tecnología moderna.",
  keywords: [
    "diseño web Los Angeles",
    "diseño web Downey CA",
    "desarrollo de sitios web",
    "diseño de landing page",
    "landing pages Los Angeles",
    "sitios web económicos para negocios pequeños",
    "diseñador web bilingüe español inglés",
    "sitios web",
    "páginas web",
    "webs",
    "desarrollo de aplicaciones web",
    "SaaS",
    "desarrollo de tiendas en línea",
    "desarrollo de aplicaciones móviles",
    "diseñador Next.js",
    "desarrollador React",
    "diseño UI/UX",
    "UXCODESTUDIO",
  ],
  authors: [{ name: "UXCODESTUDIO", url: BASE_URL }],
  creator: "UXCODESTUDIO",
  publisher: "UXCODESTUDIO",
  alternates: {
    canonical: `${BASE_URL}/es`,
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
    url: `${BASE_URL}/es`,
    siteName: "UXCODESTUDIO",
    title: "UXCODESTUDIO — Diseño y Desarrollo Web",
    description:
      "Landing pages, sitios web, aplicaciones web, plataformas SaaS y apps móviles. Construido rápido con Next.js, React y Tailwind.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UXCODESTUDIO — Diseño y Desarrollo Web",
      },
    ],
    locale: "es_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "UXCODESTUDIO — Diseño y Desarrollo Web",
    description: "Landing pages, sitios web, aplicaciones web y plataformas SaaS. Construido rápido.",
    images: ["/og-image.png"],
    creator: "@uxcodestudio",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function HomePageEs() {
  return (
    <main className="studio-site relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqJsonLd(es.faq.items, `${BASE_URL}/es`)),
        }}
      />
      <WarpStars />
      <Hero />
      <Services />
      <Process />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
