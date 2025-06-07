
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import Layout from "@/components/layout/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="bg-white">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </div>
    </Layout>
  );
}
