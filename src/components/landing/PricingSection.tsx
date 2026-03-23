import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Building2 } from "lucide-react";
import { SIGNUP_CREDITS, PREMIUM_PRICE, PREMIUM_CREDITS, CREDIT_COST_SINGLE, CREDIT_COST_MIX, PRINT_PRICE_FREE, PRINT_PRICE_PREMIUM, BUSINESS_PRICE_MONTHLY } from "@/lib/constants";

const PricingSection = () => {
  const { t } = useTranslation();

  const plans = [
    {
      name: t("pricing.free", "Free"),
      desc: t("pricing.freeDesc", "Start creating today"),
      price: "0",
      priceSuffix: "",
      icon: Sparkles,
      features: [
        t("pricing.features.freeCredits", "{{credits}} free credits on signup", { credits: SIGNUP_CREDITS }),
        t("pricing.features.allStyles", "Access to all art styles"),
        t("pricing.features.singleCost", "Single portrait: {{cost}} credits", { cost: CREDIT_COST_SINGLE }),
        t("pricing.features.mixCost", "Mix portrait: {{cost}} credits", { cost: CREDIT_COST_MIX }),
        t("pricing.features.watermarked", "Watermarked low-res downloads"),
        t("pricing.features.hdPerImage", "HD unlock: €4.90/image"),
        t("pricing.features.printFree", "Canvas prints: €{{price}}", { price: PRINT_PRICE_FREE.toFixed(2) }),
      ],
      cta: t("pricing.getStartedFree", "Get Started Free"),
      ctaLink: "/signup",
      popular: false,
    },
    {
      name: t("pricing.premium", "Premium"),
      desc: t("pricing.premiumDesc", "Full HD, no watermarks"),
      price: String(PREMIUM_PRICE),
      priceSuffix: t("pricing.oneTime", "one-time"),
      icon: Crown,
      features: [
        t("pricing.features.premiumCredits", "{{credits}} credits included", { credits: PREMIUM_CREDITS }),
        t("pricing.features.allStyles", "Access to all art styles"),
        t("pricing.features.singleCost", "Single portrait: {{cost}} credits", { cost: CREDIT_COST_SINGLE }),
        t("pricing.features.mixCost", "Mix portrait: {{cost}} credits", { cost: CREDIT_COST_MIX }),
        t("pricing.features.fullHd", "Full HD downloads, no watermark"),
        t("pricing.features.discountedPrints", "Canvas prints: €{{price}}", { price: PRINT_PRICE_PREMIUM.toFixed(2) }),
        t("pricing.features.noExpiry", "Credits never expire"),
      ],
      cta: t("pricing.goPremium", "Go Premium"),
      ctaLink: "/signup",
      popular: true,
    },
    {
      name: t("pricing.business", "Business"),
      desc: t("pricing.businessDesc", "White-label for businesses"),
      price: String(BUSINESS_PRICE_MONTHLY),
      priceSuffix: "/ " + t("pricing.month", "month"),
      icon: Building2,
      features: [
        t("pricing.features.whiteLabel", "White-label platform"),
        t("pricing.features.customBranding", "Custom branding"),
        t("pricing.features.unlimitedCredits", "Unlimited credits"),
        t("pricing.features.apiAccess", "API access"),
        t("pricing.features.dedicatedSupport", "Dedicated support"),
        t("pricing.features.analytics", "Analytics dashboard"),
      ],
      cta: t("pricing.contactUs", "Contact Us"),
      ctaLink: "/business",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-background" aria-labelledby="pricing-heading">
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-medium mb-4"
          >
            {t("pricing.label", "Pricing")}
          </motion.span>
          <motion.h2
            id="pricing-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-5"
          >
            {t("pricing.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto text-lg text-muted-foreground"
          >
            {t("pricing.subtitle")}
          </motion.p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className={`relative flex flex-col rounded-3xl p-8 sm:p-12 ${
                plan.popular
                  ? "bg-primary text-white shadow-xl"
                  : "bg-background border border-border/50 shadow-sm"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary rounded-full px-4 py-1 text-xs font-semibold shadow-md">
                  {t("pricing.popular")}
                </span>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                  plan.popular ? "bg-white/20" : "bg-secondary/10"
                }`}>
                  <plan.icon className={`h-5 w-5 ${plan.popular ? "text-white" : "text-primary"}`} />
                </div>
                <p className={`text-sm mb-1 ${plan.popular ? "text-white/70" : "text-muted-foreground"}`}>
                  {plan.desc}
                </p>
                <h3 className={`font-serif text-2xl font-bold tracking-tight mb-4 ${
                  plan.popular ? "text-white" : "text-foreground"
                }`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`font-serif text-5xl font-bold tracking-tight ${
                    plan.popular ? "text-white" : "text-foreground"
                  }`}>
                    &euro;{plan.price}
                  </span>
                </div>
                {plan.priceSuffix && (
                  <p className={`text-sm mt-1 ${plan.popular ? "text-white/50" : "text-muted-foreground"}`}>
                    {plan.priceSuffix}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className={`h-px mb-8 ${plan.popular ? "bg-white/20" : "bg-border"}`} />

              {/* Features */}
              <ul className="space-y-4 flex-1" role="list">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-3 text-sm ${
                      plan.popular ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    <Check
                      className={`h-4 w-4 mt-0.5 shrink-0 ${
                        plan.popular ? "text-white" : "text-secondary"
                      }`}
                      strokeWidth={2.5}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                asChild
                className={`mt-10 w-full h-12 rounded-full font-medium transition-all duration-300 ${
                  plan.popular
                    ? "bg-white text-primary hover:bg-white/90"
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                <Link to={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
