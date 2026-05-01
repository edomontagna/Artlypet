import Navbar from "@/components/landing/Navbar";
import { SEOHead } from "@/components/SEOHead";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import GallerySection from "@/components/landing/GallerySection";
import PrintShopSection from "@/components/landing/PrintShopSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import NewsletterSection from "@/components/landing/NewsletterSection";
import FooterSection from "@/components/landing/FooterSection";
import { PromoBanner } from "@/components/PromoBanner";
import { ActivityFeed } from "@/components/landing/ActivityFeed";
import { MobileStickyBar } from "@/components/landing/MobileStickyBar";
import { CursorSpotlight } from "@/components/ui/cursor-spotlight";

const Index = () => {
  return (
    /*
      Landing always renders dark (Goiko-style cinematic gallery), regardless of
      the user's app-wide theme toggle. Marketing pages reward visual drama;
      app pages (Dashboard/Generate/Auth) follow the user's preference.
      The `dark` class on this wrapper scopes the dark CSS vars locally.
    */
    <main className="dark min-h-[100dvh] bg-background text-foreground">
      <SEOHead
        title="Artlypet — Ritratti AI del tuo cane | In 60 secondi, in cornice"
        description="Trasforma una foto in un ritratto artistico del tuo cane. 12 stili dipinti dall'AI. Stampa su tela e spedizione in 48h, in tutta Italia. 3 ritratti gratis all'iscrizione."
        canonical="/"
      />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to content
      </a>
      <PromoBanner />
      <Navbar />
      <div id="main-content" />
      <HeroSection />
      <HowItWorksSection />
      <GallerySection />
      <PrintShopSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <NewsletterSection />
      <FooterSection />
      <ActivityFeed />
      <MobileStickyBar />
      <CursorSpotlight />
    </main>
  );
};

export default Index;
