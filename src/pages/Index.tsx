import Navbar from "@/components/landing/Navbar";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { SEOHead } from "@/components/SEOHead";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import GallerySection from "@/components/landing/GallerySection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PrintShopSection from "@/components/landing/PrintShopSection";
import FAQSection from "@/components/landing/FAQSection";
import FooterSection from "@/components/landing/FooterSection";
import { ActivityFeed } from "@/components/landing/ActivityFeed";
import { MobileStickyBar } from "@/components/landing/MobileStickyBar";

const Index = () => {
  return (
    <main className="min-h-screen pb-16 sm:pb-0">
      <SEOHead
        title="Artlypet — AI Pet Portraits | Transform Your Pet Into Art"
        description="Transform your pet's photo into stunning AI-generated art portraits. Choose from 12+ art styles including Renaissance, Pop Art, and Watercolor. Free to start."
        canonical="/"
      />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to content
      </a>
      <ExitIntentPopup />
      <Navbar />
      <div id="main-content" />
      <HeroSection />
      <HowItWorksSection />
      <GallerySection />
      <TestimonialsSection />
      <PricingSection />
      <PrintShopSection />
      <FAQSection />
      <FooterSection />
      <ActivityFeed />
      <MobileStickyBar />
    </main>
  );
};

export default Index;
