import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Crown, Check, Sparkles, Image as ImageIcon, Printer } from "lucide-react";
import { PREMIUM_CREDITS, PREMIUM_PRICE, CREDIT_COST_SINGLE, CREDIT_COST_MIX, PRINT_PRICE_PREMIUM, HD_UNLOCK_PRICE } from "@/lib/constants";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditPurchaseModal = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handlePurchasePremium = async () => {
    setLoading(true);
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
      <DialogContent className="sm:max-w-md">
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
            <p className="text-sm text-muted-foreground mt-1">
              {t("pricing.creditsInfo", "= {{single}} single or {{mix}} mixed portraits", {
                single: Math.floor(PREMIUM_CREDITS / CREDIT_COST_SINGLE),
                mix: Math.floor(PREMIUM_CREDITS / CREDIT_COST_MIX),
              })}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Comparison */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg space-y-1">
            <p className="font-medium text-foreground">{t("pricing.vsFreePlan", "vs. Free Plan:")}</p>
            <p>• {t("pricing.freeWatermark", "Free = watermarked low-res previews")}</p>
            <p>• {t("pricing.freeHdPrice", "HD unlock per image: €{{price}}", { price: HD_UNLOCK_PRICE.toFixed(2) })}</p>
            <p>• {t("pricing.freePrintPrice", "Canvas prints: €79.90")}</p>
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className="w-full rounded-full h-12 text-base shadow-luxury gap-2"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
