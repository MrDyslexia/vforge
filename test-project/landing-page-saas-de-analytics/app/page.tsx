import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeaturesGrid } from "@/components/features-grid";
import { StatsBar } from "@/components/stats-bar";
import { Testimonials } from "@/components/testimonials";
import { PricingTable } from "@/components/pricing-table";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <FeaturesGrid />
        <StatsBar />
        <Testimonials />
        <PricingTable />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
