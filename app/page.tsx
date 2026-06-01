import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import WarpStars from "@/components/WarpStars";

const Services  = dynamic(() => import("@/components/Services"));
const Process   = dynamic(() => import("@/components/Process"));
const Pricing   = dynamic(() => import("@/components/Pricing"));
const FAQ       = dynamic(() => import("@/components/FAQ"));
const FinalCTA  = dynamic(() => import("@/components/FinalCTA"));
const Footer    = dynamic(() => import("@/components/Footer"));

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <WarpStars />
      <Hero />
      <Services />
      <Process />
      <Pricing />
      <FinalCTA />
      <FAQ />
      <Footer />
    </main>
  );
}
