import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Frame,
  Truck,
  Maximize2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const PrintQuality = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: Frame,
      title: t("prints.featureCanvas", "Museum-Quality Canvas"),
      desc: t(
        "prints.featureCanvasDesc",
        "Every print uses premium 380gsm poly-cotton blend canvas, the same material used in professional art galleries. The result is a rich, textured finish that brings your portrait to life."
      ),
    },
    {
      icon: Layers,
      title: t("prints.featureMaterials", "Premium Materials"),
      desc: t(
        "prints.featureMaterialsDesc",
        "We use archival-quality, fade-resistant inks rated to last 75+ years. Each canvas is stretched over a solid pine wood frame with gallery-wrap edges."
      ),
    },
    {
      icon: Truck,
      title: t("prints.featureShipping", "EU-Wide Shipping"),
      desc: t(
        "prints.featureShippingDesc",
        "Free insured shipping across the European Union. Every print is carefully packaged in protective wrapping to arrive in perfect condition."
      ),
    },
  ];

  const specs = [
    {
      label: t("prints.specResolution", "Resolution"),
      value: t("prints.specResolutionVal", "2K (2048 x 2048px) minimum"),
    },
    {
      label: t("prints.specCanvas", "Canvas Material"),
      value: t("prints.specCanvasVal", "380gsm poly-cotton blend"),
    },
    {
      label: t("prints.specInk", "Ink Type"),
      value: t("prints.specInkVal", "Archival pigment inks (75+ year fade resistance)"),
    },
    {
      label: t("prints.specFrame", "Frame"),
      value: t("prints.specFrameVal", "Solid pine wood, 2cm depth"),
    },
    {
      label: t("prints.specEdge", "Edge Finish"),
      value: t("prints.specEdgeVal", "Gallery-wrap (image continues around edges)"),
    },
    {
      label: t("prints.specDelivery", "Delivery"),
      value: t("prints.specDeliveryVal", "5-10 business days across the EU"),
    },
  ];

  const pricing = [
    {
      name: t("prints.pricePremium", "Premium Plan Holders"),
      price: t("prints.pricePremiumVal", "From €59.90"),
      desc: t("prints.pricePremiumDesc", "Discounted canvas prints for Premium members. Includes free shipping."),
      highlight: true,
    },
    {
      name: t("prints.priceStandard", "Standard / Free Plan"),
      price: t("prints.priceStandardVal", "From €79.90"),
      desc: t("prints.priceStandardDesc", "Museum-quality canvas prints available to all users. Includes free shipping."),
      highlight: false,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Frame className="h-4 w-4" />
              {t("prints.badge", "Canvas Prints")}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t("prints.title", "Museum-Quality Canvas Prints")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "prints.subtitle",
                "Turn your AI pet portrait into a stunning physical canvas that you can display on your wall for years to come."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background rounded-3xl p-8 shadow-sm border border-border text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-16 px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <motion.div {...fadeInUp}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
              {t("prints.specsTitle", "Technical Specifications")}
            </h2>
            <div className="bg-background rounded-3xl shadow-sm border border-border overflow-hidden">
              {specs.map((spec, index) => (
                <div
                  key={spec.label}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 ${
                    index < specs.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="font-medium text-foreground">{spec.label}</span>
                  <span className="text-muted-foreground text-sm mt-1 sm:mt-0">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeInUp}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
              {t("prints.pricingTitle", "Print Pricing")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pricing.map((tier) => (
                <div
                  key={tier.name}
                  className={`bg-background rounded-3xl p-8 shadow-sm border ${
                    tier.highlight
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border"
                  }`}
                >
                  {tier.highlight && (
                    <span className="inline-block bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full mb-4">
                      {t("prints.bestValue", "Best Value")}
                    </span>
                  )}
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                  <p className="font-serif text-3xl font-bold text-primary mb-3">{tier.price}</p>
                  <p className="text-muted-foreground text-sm">{tier.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Size options */}
      <section className="py-16 px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("prints.sizesTitle", "Available Sizes")}
            </h2>
            <p className="text-muted-foreground mb-10">
              {t("prints.sizesDesc", "Choose the perfect size for your space")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { size: "30 x 30 cm", label: t("prints.sizeSmall", "Small") },
                { size: "50 x 50 cm", label: t("prints.sizeMedium", "Medium") },
                { size: "70 x 70 cm", label: t("prints.sizeLarge", "Large") },
              ].map((item) => (
                <div key={item.size} className="bg-muted/30 rounded-2xl p-6 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Maximize2 className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-serif text-lg font-bold text-foreground">{item.size}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-primary/5">
        <div className="container mx-auto text-center max-w-2xl">
          <motion.div {...fadeInUp}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("prints.ctaTitle", "Create a Portrait to Print")}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t("prints.ctaDesc", "Start by generating your pet's portrait, then order a canvas print directly from your dashboard.")}
            </p>
            <Button
              onClick={() => navigate("/signup")}
              className="rounded-full h-12 px-8 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t("prints.ctaButton", "Get Started")}
            </Button>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
};

export default PrintQuality;
