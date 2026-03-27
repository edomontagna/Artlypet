import Navbar from "@/components/landing/Navbar";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import HeroSection from "@/components/landing/HeroSection";
import PressSection from "@/components/landing/PressSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import VideoSection from "@/components/landing/VideoSection";
import GallerySection from "@/components/landing/GallerySection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PrintShopSection from "@/components/landing/PrintShopSection";
import FAQSection from "@/components/landing/FAQSection";
import FooterSection from "@/components/landing/FooterSection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to content
      </a>
      <ExitIntentPopup />
      <Navbar />
      <div id="main-content" />
      <HeroSection />
      <PressSection />
      <HowItWorksSection />
      <VideoSection />
      <GallerySection />
      <TestimonialsSection />
      <PricingSection />
      <PrintShopSection />
      <FAQSection />
      <FooterSection />
    </main>
  );
};

export default Index;
