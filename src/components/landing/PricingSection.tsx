import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Shield } from "lucide-react";
import { SIGNUP_CREDITS, PREMIUM_PRICE, PREMIUM_CREDITS, CREDIT_COST_SINGLE, CREDIT_COST_MIX, PRINT_PRICE_FREE, PRINT_PRICE_PREMIUM } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { CreditPurchaseModal } from "@/components/CreditPurchaseModal";

const PricingSection = memo(() => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const isPremium = profile?.plan_type === "premium" || profile?.plan_type === "business";
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

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
        t("pricing.features.printFree", "Canvas prints available"),
      ],
      cta: user
        ? (isPremium ? t("pricing.startCreating", "Start Creating") : t("pricing.getStartedFree", "Get Started Free"))
        : t("pricing.getStartedFree", "Get Started Free"),
      ctaLink: user ? (isPremium ? "/generate" : "#") : "/signup",
      planKey: "free",
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
        t("pricing.features.fullHd", "Full HD downloads, no watermark"),
        t("pricing.features.discountedPrints", "Discounted canvas prints"),
        t("pricing.features.noExpiry", "Credits never expire"),
      ],
      cta: user && isPremium ? t("pricing.startCreating", "Start Creating") : t("pricing.goPremium", "Go Premium"),
      ctaLink: user ? (isPremium ? "/generate" : "#") : "/signup",
      planKey: "premium",
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-background" aria-labelledby="pricing-heading">
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
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

        {/* Value banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 bg-primary/10 text-primary rounded-full px-5 py-2 mx-auto w-fit text-sm font-medium mb-8"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t("pricing.valueBanner", "One-time payment — No subscription, no hidden fees")}
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative flex flex-col rounded-2xl p-6 sm:p-8 ${
                plan.popular
                  ? "bg-primary text-primary-foreground shadow-2xl lg:scale-105 relative z-10 ring-2 ring-primary/30 ring-offset-4 ring-offset-background"
                  : "bg-background border border-border/50 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              }`}
            >
              {/* Popular badge with percentage */}
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-primary rounded-full px-4 py-1 text-xs font-semibold shadow-md whitespace-nowrap">
                  {t("pricing.popular", "Most Popular")}
                </span>
              )}


              {/* Plan header */}
              <div className="mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                  plan.popular ? "bg-primary-foreground/20" : "bg-secondary/10"
                }`}>
                  <plan.icon className={`h-5 w-5 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <p className={`text-sm mb-1 ${plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {plan.desc}
                </p>
                <h3 className={`font-serif text-2xl font-bold tracking-tight mb-4 ${
                  plan.popular ? "text-primary-foreground" : "text-foreground"
                }`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className={`font-serif text-5xl font-bold tracking-tight ${
                    plan.popular ? "text-primary-foreground" : "text-foreground"
                  }`}>
                    &euro;{plan.price}
                  </span>
                </div>
                {plan.priceSuffix && (
                  <p className={`text-sm mt-1 ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {plan.priceSuffix}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className={`h-px mb-6 ${plan.popular ? "bg-primary-foreground/20" : "bg-border"}`} />

              {/* Features */}
              <ul className="space-y-3 flex-1" role="list">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-3 text-sm ${
                      plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    <Check
                      className={`h-4 w-4 mt-0.5 shrink-0 ${
                        plan.popular ? "text-primary-foreground" : "text-secondary"
                      }`}
                      strokeWidth={2.5}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {user && plan.ctaLink === "#" ? (
                <Button
                  className={`mt-8 w-full h-12 rounded-full font-medium transition-all duration-300 btn-press ${
                    plan.popular
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => setPurchaseModalOpen(true)}
                >
                  {plan.cta}
                </Button>
              ) : (
                <Button
                  asChild
                  className={`mt-8 w-full h-12 rounded-full font-medium transition-all duration-300 btn-press ${
                    plan.popular
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link to={plan.ctaLink}>{plan.cta}</Link>
                </Button>
              )}
              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs">
                <Shield className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className={plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}>
                  {t("pricing.guarantee", "30-day money-back guarantee")}
                </span>
              </div>
              {plan.popular && (
                <p className="text-center text-[11px] mt-3 text-primary-foreground/80 italic">
                  &ldquo;{t("pricing.testimonial", "Best €15 I ever spent!")}&rdquo; — Sarah, Berlin
                </p>
              )}
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          {t("pricing.vatIncluded", "All prices include VAT where applicable.")}
        </p>
      </div>
      {user && (
        <CreditPurchaseModal open={purchaseModalOpen} onOpenChange={setPurchaseModalOpen} />
      )}
    </section>
  );
});

PricingSection.displayName = "PricingSection";

export default PricingSection;
