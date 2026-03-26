import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Crown, Check, Sparkles, Image as ImageIcon, Printer, Shield } from "lucide-react";
import { PREMIUM_CREDITS, PREMIUM_PRICE, CREDIT_COST_SINGLE, CREDIT_COST_MIX, PRINT_PRICE_PREMIUM, HD_UNLOCK_PRICE } from "@/lib/constants";
import { trackInitiateCheckout } from "@/hooks/useAnalytics";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditPurchaseModal = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handlePurchasePremium = async () => {
    setLoading(true);
    trackInitiateCheckout(PREMIUM_PRICE, "premium");
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { package_id: "premium" },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start checkout");
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      text: t("pricing.premiumFeature1", "{{credits}} credits included", { credits: PREMIUM_CREDITS }),
    },
    {
      icon: ImageIcon,
      text: t("pricing.premiumFeature2", "All images in full HD, no watermark"),
    },
    {
      icon: Printer,
      text: t("pricing.premiumFeature3", "Canvas prints at €{{price}}", { price: PRINT_PRICE_PREMIUM.toFixed(2) }),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            {t("pricing.goPremium", "Go Premium")}
          </DialogTitle>
          <DialogDescription>
            {t("pricing.premiumSubtitle", "Unlock the full Artlypet experience")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Price */}
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-serif text-5xl font-bold text-foreground">€{PREMIUM_PRICE}</span>
              <span className="text-sm text-muted-foreground">{t("pricing.oneTime", "one-time")}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("pricing.anchor", "That's just €0.30 per portrait")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("pricing.vatIncluded", "All prices include VAT where applicable.")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("pricing.creditsInfo", "= {{single}} single or {{mix}} mixed portraits", {
                single: Math.floor(PREMIUM_CREDITS / CREDIT_COST_SINGLE),
                mix: Math.floor(PREMIUM_CREDITS / CREDIT_COST_MIX),
              })}
            </p>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex -space-x-1.5">
              {["J","K","M","S"].map((l, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[9px] font-medium text-primary">{l}</div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{t("pricing.socialProof", "Join 5,000+ premium members")}</p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Comparison */}
          <div className="rounded-xl bg-muted p-4 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">{t("pricing.vsFreePlan", "vs. Free Plan:")}</p>
            <p>• {t("pricing.freeWatermark", "Free = watermarked low-res previews")}</p>
            <p>• {t("pricing.freeHdPrice", "HD unlock per image: €{{price}}", { price: HD_UNLOCK_PRICE.toFixed(2) })}</p>
            <p>• {t("pricing.freePrintPrice", "Canvas prints: €79.90")}</p>
          </div>

          {/* Guarantee */}
          <div className="flex items-center justify-center gap-2 mb-3 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{t("pricing.guaranteeBold", "30-day money-back guarantee")}</span>
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className={`w-full rounded-full h-12 bg-primary text-primary-foreground text-base shadow-md gap-2 hover:bg-primary/90 btn-press${!loading ? " shimmer-btn" : ""}`}
            onClick={handlePurchasePremium}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Crown className="h-5 w-5" />
                {t("pricing.upgradeCta", "Upgrade to Premium — €{{price}}", { price: PREMIUM_PRICE })}
              </>
            )}
          </Button>
          <button
            onClick={() => onOpenChange(false)}
            className="w-full text-center mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("pricing.continueFree", "Not ready? Continue with free plan →")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
