import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check, Shield, ArrowUpRight } from "lucide-react";
import {
  SIGNUP_CREDITS,
  PREMIUM_PRICE,
  PREMIUM_CREDITS,
  CREDIT_COST_SINGLE,
  CREDIT_COST_MIX,
  PRINT_PRICE_FREE,
  PRINT_PRICE_PREMIUM,
} from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { CreditPurchaseModal } from "@/components/CreditPurchaseModal";
import { MagneticButton } from "@/components/ui/magnetic-button";

const ease = [0.16, 1, 0.3, 1] as const;

const PricingSection = memo(() => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const isPremium = profile?.plan_type === "premium" || profile?.plan_type === "business";
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const premiumFeatures = [
    t("pricing.features.premiumCredits", "{{credits}} credits — about 15 portraits", { credits: PREMIUM_CREDITS }),
    t("pricing.features.fullHd", "Full HD downloads, no watermark"),
    t("pricing.features.allStyles", "All 12 painting styles included"),
    t("pricing.features.discountedPrints", "Canvas prints at €{{p}} (saving €{{save}})", {
      p: PRINT_PRICE_PREMIUM,
      save: (PRINT_PRICE_FREE - PRINT_PRICE_PREMIUM).toFixed(2),
    }),
    t("pricing.features.noExpiry", "Credits never expire"),
  ];

  const freeFeatures = [
    t("pricing.features.freeCredits", "{{credits}} credits on signup ≈ 3 portraits", { credits: SIGNUP_CREDITS }),
    t("pricing.features.singleCost", "Single portrait: {{cost}} credits", { cost: CREDIT_COST_SINGLE }),
    t("pricing.features.mixCost", "You + pet portrait: {{cost}} credits", { cost: CREDIT_COST_MIX }),
    t("pricing.features.watermark", "Watermarked previews"),
  ];

  const premiumCtaLink = user ? (isPremium ? "/generate" : "#") : "/signup";
  const premiumCta = user && isPremium
    ? t("pricing.startCreating", "Start Creating")
    : t("pricing.goPremium", "Go Premium");

  return (
    <section
      id="pricing"
      className="relative py-24 lg:py-36 bg-background overflow-hidden"
      aria-labelledby="pricing-heading"
    >
      {/* Soft warm wash behind the Premium card */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-32 left-1/4 h-[480px] w-[480px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.16), transparent 70%)" }}
      />

      <div className="container relative px-6 lg:px-10">
        {/* Header — left-aligned, the kicker is on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease }}
            className="lg:col-span-7"
          >
            <span className="sec-label">{t("pricing.label", "Pricing")}</span>
            <h2
              id="pricing-heading"
              className="mt-4 font-serif font-bold text-4xl md:text-5xl lg:text-6xl tracking-tightest leading-[1.02] text-foreground"
            >
              {t("pricing.title", "Pay once. Keep the portraits ")}
              <span className="text-accent-em italic">{t("pricing.titleAccent", "forever.")}</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="lg:col-span-4 lg:col-start-9 self-end"
          >
            <p className="text-base text-muted-foreground leading-relaxed max-w-[40ch]">
              {t("pricing.subtitle", "No subscription. No hidden charges. Try free, upgrade once if you love it.")}
            </p>
          </motion.div>
        </div>

        {/* Asymmetric pricing — Premium dominant (8 cols), Free secondary (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 max-w-6xl mx-auto">

          {/* PREMIUM — large, spotlight border, gold tint */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className="lg:col-span-8 relative spotlight-border bento-card-lg overflow-hidden"
          >
            {/* Top-right pill — popular */}
            <div className="absolute top-6 right-6 z-10 inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-primary animate-breath" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {t("pricing.popular", "Most chosen")}
            </div>

            <div className="p-8 lg:p-12 relative">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="sec-label">{t("pricing.premium", "Premium")}</span>
                <span className="text-xs font-mono text-muted-foreground">{t("pricing.oneTime", "one-time")}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Left: price + headline */}
                <div className="md:col-span-5">
                  <h3 className="font-serif text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-[1.05] mb-4">
                    {t("pricing.premiumDesc", "Full HD, no watermark, every style.")}
                  </h3>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="font-serif font-bold text-foreground text-6xl lg:text-7xl tracking-tightest">
                      €{PREMIUM_PRICE}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("pricing.premiumPerPortrait", "Roughly €1 per portrait — works out cheaper than buying singles.")}
                  </p>
                </div>

                {/* Right: features */}
                <ul className="md:col-span-7 space-y-3" role="list">
                  {premiumFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 shrink-0">
                        <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-foreground/80 leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {user && premiumCtaLink === "#" ? (
                  <MagneticButton
                    onClick={() => setPurchaseModalOpen(true)}
                    className="shimmer-btn rounded-full h-14 px-8 text-base font-semibold shadow-tinted"
                    strength={0.30}
                  >
                    <span>{premiumCta}</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                  </MagneticButton>
                ) : (
                  <Link to={premiumCtaLink} className="rounded-full" tabIndex={-1}>
                    <MagneticButton
                      className="shimmer-btn rounded-full h-14 px-8 text-base font-semibold shadow-tinted"
                      strength={0.30}
                    >
                      <span>{premiumCta}</span>
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                    </MagneticButton>
                  </Link>
                )}
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  <span>{t("pricing.guarantee", "30-day money-back guarantee")}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FREE — narrow column, restrained */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="lg:col-span-4 bento-card flex flex-col p-7 lg:p-8"
          >
            <div className="flex items-baseline gap-3 mb-4">
              <span className="sec-label">{t("pricing.free", "Free")}</span>
            </div>

            <h3 className="font-serif text-2xl lg:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4">
              {t("pricing.freeDesc", "Try before you commit.")}
            </h3>

            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-serif font-bold text-foreground text-5xl tracking-tightest">€0</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              {t("pricing.freeNoCard", "No card required")}
            </p>

            <div className="h-px bg-border mb-5" />

            <ul className="space-y-2.5 mb-7" role="list">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                  <Check className="h-3.5 w-3.5 mt-0.5 text-secondary shrink-0" strokeWidth={2.5} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              to={user ? "/generate" : "/signup"}
              className="mt-auto group inline-flex items-center justify-center gap-2 rounded-full h-12 border border-border hover:border-primary px-6 text-sm font-medium text-foreground hover:text-primary transition-colors btn-press"
            >
              <span>{user ? t("pricing.startCreating", "Start creating") : t("pricing.getStartedFree", "Get started free")}</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.25} />
            </Link>
          </motion.div>
        </div>

        {/* Print pricing band — separate revenue stream, transparent up-front */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mt-10 max-w-6xl mx-auto rounded-[1.75rem] border border-dashed border-border px-6 sm:px-10 py-7 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10"
        >
          <div className="flex-1">
            <div className="sec-label mb-1.5">{t("pricing.printsLabel", "Printed on canvas")}</div>
            <p className="text-foreground text-base leading-relaxed">
              {t(
                "pricing.printsCopy",
                "Want a real one on the wall? Museum-grade canvas, hand-stretched, shipped across the EU.",
              )}
            </p>
          </div>
          <div className="flex items-baseline gap-6">
            <div>
              <div className="font-mono tabular text-2xl font-semibold text-foreground">€{PRINT_PRICE_FREE}</div>
              <div className="text-xs text-muted-foreground">{t("pricing.freeTier", "Free tier")}</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <div className="font-mono tabular text-2xl font-semibold text-primary">€{PRINT_PRICE_PREMIUM}</div>
              <div className="text-xs text-muted-foreground">{t("pricing.premiumTier", "Premium tier")}</div>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-8">
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
