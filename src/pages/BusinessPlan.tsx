import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Palette, BarChart3, Shield, Headphones, Globe, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BUSINESS_PRICE_MONTHLY } from "@/lib/constants";

const features = [
  { icon: Palette, titleKey: "business.featureWhiteLabel", descKey: "business.featureWhiteLabelDesc" },
  { icon: Globe, titleKey: "business.featureCustomDomain", descKey: "business.featureCustomDomainDesc" },
  { icon: BarChart3, titleKey: "business.featureAnalytics", descKey: "business.featureAnalyticsDesc" },
  { icon: Shield, titleKey: "business.featureApi", descKey: "business.featureApiDesc" },
  { icon: Headphones, titleKey: "business.featureSupport", descKey: "business.featureSupportDesc" },
  { icon: Building2, titleKey: "business.featureUnlimited", descKey: "business.featureUnlimitedDesc" },
];

const BusinessPlan = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center px-4 lg:px-8">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <Link to="/" className="font-serif text-xl font-bold text-gradient-gold ml-2">Artlypet</Link>
      </header>

      <div className="container px-4 lg:px-8 py-16 max-w-4xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Building2 className="h-4 w-4" />
            {t("business.comingSoon", "Coming Soon")}
          </span>
          <h1 className="font-serif text-display-sm font-light text-foreground mb-4">
            {t("business.title", "Artlypet for Business")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            {t("business.subtitle", "Give your customers the magic of AI pet portraits. White-label our platform with your brand for pet shops, veterinary clinics, and pet brands.")}
          </p>
        </motion.div>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-16 p-8 rounded-2xl bg-card border border-border shadow-luxury"
        >
          <p className="text-sm text-muted-foreground mb-2">{t("business.startingAt", "Starting at")}</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="font-serif text-6xl font-light text-foreground">€{BUSINESS_PRICE_MONTHLY}</span>
            <span className="text-lg text-muted-foreground">/ {t("pricing.month", "month")}</span>
          </div>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, i) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                {t(feature.titleKey, feature.titleKey.split(".").pop())}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(feature.descKey, "")}
              </p>
            </motion.div>
          ))}
        </div>

        {/* What's included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-2xl bg-card border border-border mb-16"
        >
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
            {t("business.whatsIncluded", "What's Included")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              t("business.includeWhiteLabel", "White-label web portal"),
              t("business.includeUnlimited", "Unlimited AI generations"),
              t("business.includeHd", "All images in full HD"),
              t("business.includeBranding", "Your logo and colors"),
              t("business.includeApi", "REST API access"),
              t("business.includeAnalytics", "Usage analytics"),
              t("business.includeSupport", "Priority email support"),
              t("business.includePrints", "Discounted canvas prints"),
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-gold shrink-0" strokeWidth={2.5} />
                <span className="text-sm text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
            {t("business.ctaTitle", "Interested?")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t("business.ctaDesc", "Get in touch and we'll set up your white-label platform.")}
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full px-10 h-12 text-base shadow-luxury"
          >
            <a href="mailto:business@artlypet.com">
              {t("business.ctaButton", "Contact Us — business@artlypet.com")}
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessPlan;
