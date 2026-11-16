import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { PillarDetails } from "@/components/home/PillarDetails";
import { Testimonials } from "@/components/home/Testimonials";
import { CTA } from "@/components/home/CTA";
import { Modalidades } from "@/components/home/Modalidades";
import { FAQ } from "@/components/home/FAQ";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <PillarDetails />
        <Testimonials />
        <CTA />
        <Modalidades />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
