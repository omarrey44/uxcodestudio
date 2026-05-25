import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WarpStars from "@/components/WarpStars";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

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
