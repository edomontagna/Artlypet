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
    <section id="pricing" className="py-28 lg:py-36 relative" style={{ backgroundColor: "var(--bg)" }} aria-labelledby="pricing-heading">
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="sec-label mb-4"
          >
            {t("pricing.label", "Pricing")}
          </motion.p>
          <motion.h2
            id="pricing-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl lg:text-5xl font-light mb-5"
            style={{ color: "var(--text)" }}
          >
            {t("pricing.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto text-lg font-light"
            style={{ color: "var(--muted)" }}
          >
            {t("pricing.subtitle")}
          </motion.p>
        </div>

        {/* Plans grid with visible border gaps */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto"
          style={{ gap: "1.5px", backgroundColor: "var(--border)" }}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative flex flex-col"
              style={{
                backgroundColor: plan.popular ? "var(--accent)" : "var(--bg)",
              }}
            >
              {/* Popular bar at top */}
              {plan.popular && (
                <div
                  className="h-[3px] w-full"
                  style={{ backgroundColor: "var(--text)" }}
                />
              )}

              <div className="flex flex-col h-full p-8 lg:p-10">
                {/* Popular label */}
                {plan.popular && (
                  <p
                    className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-6"
                    style={{ color: "var(--bg)" }}
                  >
                    {t("pricing.popular")}
                  </p>
                )}

                {/* Plan header */}
                <div className="mb-8">
                  <p
                    className="text-[11px] tracking-[0.18em] uppercase mb-2"
                    style={{ color: plan.popular ? "rgba(255,255,255,0.5)" : "var(--muted)" }}
                  >
                    {plan.desc}
                  </p>
                  <h3
                    className="font-serif text-2xl font-light mb-6"
                    style={{ color: plan.popular ? "var(--bg)" : "var(--text)" }}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-serif text-5xl lg:text-6xl font-light tracking-tight"
                      style={{ color: plan.popular ? "var(--bg)" : "var(--text)" }}
                    >
                      &euro;{plan.price}
                    </span>
                  </div>
                  {plan.priceSuffix && (
                    <p
                      className="text-sm mt-2"
                      style={{ color: plan.popular ? "rgba(255,255,255,0.4)" : "var(--muted)" }}
                    >
                      {plan.priceSuffix}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div
                  className="h-px mb-8"
                  style={{ backgroundColor: plan.popular ? "rgba(255,255,255,0.15)" : "var(--border)" }}
                />

                {/* Features */}
                <ul className="space-y-4 flex-1" role="list">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: plan.popular ? "rgba(255,255,255,0.7)" : "var(--muted)" }}
                    >
                      <Check
                        className="h-4 w-4 mt-0.5 shrink-0"
                        style={{ color: plan.popular ? "var(--bg)" : "var(--accent)" }}
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA Button — square, no gradient */}
                <Button
                  asChild
                  className="mt-10 w-full h-12 font-semibold tracking-wide rounded-none transition-all duration-300"
                  style={{
                    backgroundColor: plan.popular ? "var(--bg)" : "transparent",
                    color: plan.popular ? "var(--accent)" : "var(--text)",
                    border: plan.popular ? "none" : "1.5px solid var(--border)",
                    borderRadius: 0,
                  }}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link to={plan.ctaLink}>{plan.cta}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
