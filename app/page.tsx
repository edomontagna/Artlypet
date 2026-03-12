"use client";

import { HeroSection } from "@/components/hero-section";
import { ModesSection } from "@/components/modes-section";
import { StylesSection } from "@/components/styles-section";
import { HowItWorks } from "@/components/how-it-works";
import { PricingTeaser } from "@/components/pricing-teaser";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ModesSection />
      <StylesSection />
      <HowItWorks />
      <PricingTeaser />
      <Footer />
    </div>
  );
}
