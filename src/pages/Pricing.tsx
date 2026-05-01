import { useTranslation } from "react-i18next";
import { SEOHead } from "@/components/SEOHead";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";

const Pricing = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[100dvh] bg-background">
      <SEOHead
        title={t("pricing.pageTitle", "Pricing — Artlypet")}
        description={t("pricing.pageDesc", "Simple, transparent pricing. Start free with 3 portraits, upgrade to Premium for full HD and no watermarks.")}
        canonical="/pricing"
      />
      <Navbar />
      <main>
        <PricingSection />
        <FAQSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Pricing;
