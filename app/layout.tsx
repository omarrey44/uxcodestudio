import type { Metadata } from "next";
import { Inter, Syne, Barlow } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
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

export const metadata: Metadata = {
  title: "UXCODESTUDIO — Premium Digital Product Studio",
  description:
    "We design and engineer immersive websites, web apps and SaaS platforms for ambitious brands.",
  metadataBase: new URL("https://uxcodestudio.com"),
  openGraph: {
    title: "UXCODESTUDIO — Premium Digital Product Studio",
    description:
      "Award-winning websites, landing pages, web apps and SaaS platforms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} ${barlow.variable}`}>
      <body className="bg-background text-white antialiased noise">
        {/* Runs synchronously before React hydrates — prevents browser scroll restoration fighting Lenis */}
        <script dangerouslySetInnerHTML={{ __html: "if('scrollRestoration'in history){history.scrollRestoration='manual';}window.scrollTo(0,0);" }} />
        <PageLoader />
        <CustomCursor />
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
