import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import WarpStars from "@/components/WarpStars";
import { en, buildFaqJsonLd } from "@/lib/i18nData";

const Services  = dynamic(() => import("@/components/Services"));
const Process   = dynamic(() => import("@/components/Process"));
const Pricing   = dynamic(() => import("@/components/Pricing"));
const FAQ       = dynamic(() => import("@/components/FAQ"));
const FinalCTA  = dynamic(() => import("@/components/FinalCTA"));
const Footer    = dynamic(() => import("@/components/Footer"));

export default function HomePage() {
  return (
    <main className="studio-site relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqJsonLd(en.faq.items, "https://uxcodestudio.com")),
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
