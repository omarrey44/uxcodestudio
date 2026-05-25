import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import WarpStars from "@/components/WarpStars";

const Services  = dynamic(() => import("@/components/Services"),  { ssr: false });
const Process   = dynamic(() => import("@/components/Process"),   { ssr: false });
const Pricing   = dynamic(() => import("@/components/Pricing"),   { ssr: false });
const FAQ       = dynamic(() => import("@/components/FAQ"),       { ssr: false });
const FinalCTA  = dynamic(() => import("@/components/FinalCTA"),  { ssr: false });
const Footer    = dynamic(() => import("@/components/Footer"),    { ssr: false });

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
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
