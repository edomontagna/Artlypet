import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Download, Lock, Printer, Share2, Crown, X } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { SharePanel } from "@/components/SharePanel";
import { useState, useEffect } from "react";
import { getSignedUrl } from "@/services/storage";
import { HD_UNLOCK_PRICE, PREMIUM_PRICE, PRINT_PRICE_PREMIUM } from "@/lib/constants";
import { useStyles } from "@/hooks/useStyles";

interface PortraitLightboxProps {
  generation: {
    id: string;
    status: string;
    storage_path: string | null;
    is_hd_unlocked: boolean;
    generation_type: string;
    created_at: string;
    style_id?: string | null;
    styles?: { name: string } | null;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPremium: boolean;
  onUnlockHd: (id: string) => void;
  onDownload: (gen: { id: string; storage_path?: string | null; is_hd_unlocked?: boolean }) => void;
  onOpenUpgrade: () => void;
}

export const PortraitLightbox = ({ generation, open, onOpenChange, isPremium, onUnlockHd, onDownload, onOpenUpgrade }: PortraitLightboxProps) => {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const { data: styles } = useStyles();

  const isHd = isPremium || generation?.is_hd_unlocked;
  const styleName = (generation as Record<string, unknown>)?.styles
    ? ((generation as Record<string, unknown>).styles as { name: string }).name
    : t("lightbox.portrait", "Portrait");

  useEffect(() => {
    if (generation?.storage_path && open) {
      let cancelled = false;
      getSignedUrl("generated-images", generation.storage_path, 3600)
        .then(url => { if (!cancelled) setImageUrl(url); })
        .catch(() => { if (!cancelled) setImageUrl(null); });
      return () => { cancelled = true; };
    } else {
      setImageUrl(null);
    }
  }, [generation?.storage_path, open]);

  if (!generation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 gap-0 rounded-2xl overflow-hidden border-0 bg-card">
        {/* Close button */}
        <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px]">
          {/* Left — Image */}
          <div className="relative bg-muted/30 flex items-center justify-center p-6 lg:p-8 min-h-[300px] lg:min-h-[500px]">
            {imageUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative w-full max-w-md"
              >
                <img
                  src={imageUrl}
                  alt={styleName}
                  className="w-full rounded-2xl shadow-xl object-contain"
                />
                {/* Watermark overlay for SD */}
                {!isHd && (
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none">
                    <span className="text-white/20 font-serif text-4xl font-bold rotate-[-30deg] select-none">
                      Preview
                    </span>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="w-full max-w-md aspect-[4/5] rounded-2xl bg-muted animate-pulse" />
            )}
          </div>

          {/* Right — Info + Actions */}
          <div className="p-6 lg:p-8 flex flex-col border-t lg:border-t-0 lg:border-l border-border">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-serif text-xl font-bold text-foreground">{styleName}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isHd ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {isHd ? "HD" : t("lightbox.preview", "Preview")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{format(new Date(generation.created_at), "d MMM yyyy")}</span>
                <span>&middot;</span>
                <span>{generation.generation_type === "mix" ? t("lightbox.mix", "Mix Portrait") : t("lightbox.single", "Single Portrait")}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 flex-1">
              {/* Download */}
              <Button
                className="w-full justify-start gap-3 h-12 rounded-full btn-press"
                variant="outline"
                onClick={() => onDownload(generation)}
              >
                <Download className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium">{t("lightbox.download", "Download Portrait")}</p>
                  <p className="text-[10px] text-muted-foreground">{isHd ? t("lightbox.downloadHd", "Full HD Quality") : t("lightbox.downloadPreview", "Preview Quality")}</p>
                </div>
              </Button>

              {/* Unlock HD — only for non-premium, non-unlocked */}
              {!isPremium && !generation.is_hd_unlocked && (
                <Button
                  className="w-full justify-start gap-3 h-12 rounded-full shimmer-btn btn-press text-primary-foreground"
                  onClick={() => onUnlockHd(generation.id)}
                >
                  <Lock className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{t("lightbox.unlockHd", "Unlock Full HD — \u20AC{{price}}", { price: HD_UNLOCK_PRICE.toFixed(2) })}</p>
                    <p className="text-[10px] text-primary-foreground/70">{t("lightbox.unlockHdDesc", "Remove watermark, full resolution")}</p>
                  </div>
                </Button>
              )}

              {/* Order Print — always visible, different messaging based on HD status */}
              {(isPremium || generation.is_hd_unlocked) ? (
                <Button
                  className="w-full justify-start gap-3 h-12 rounded-full btn-press"
                  variant="outline"
                  asChild
                >
                  <a href="/prints">
                    <Printer className="h-4 w-4 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium">{t("lightbox.orderPrint", "Order Canvas Print")}</p>
                      <p className="text-[10px] text-muted-foreground">{t("lightbox.orderPrintFrom", "from \u20AC{{price}}", { price: PRINT_PRICE_PREMIUM })}</p>
                    </div>
                  </a>
                </Button>
              ) : (
                <Button
                  className="w-full justify-start gap-3 h-12 rounded-full btn-press"
                  variant="outline"
                  onClick={() => onUnlockHd(generation.id)}
                >
                  <Printer className="h-4 w-4 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-muted-foreground">{t("lightbox.orderPrint", "Order Canvas Print")}</p>
                    <p className="text-[10px] text-muted-foreground">{t("lightbox.printNeedsHd", "Unlock HD first to order prints")}</p>
                  </div>
                </Button>
              )}

              {/* Share toggle */}
              <Button
                className="w-full justify-start gap-3 h-12 rounded-full btn-press"
                variant="outline"
                onClick={() => setShowShare(!showShare)}
              >
                <Share2 className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">{t("lightbox.share", "Share Portrait")}</p>
              </Button>

              {showShare && imageUrl && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                  <div className="pt-2 pb-1">
                    <SharePanel imageUrl={imageUrl} styleName={styleName} />
                  </div>
                </motion.div>
              )}

              {/* Try other styles */}
              {styles && styles.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    {t("lightbox.tryOtherStyles", "Try in other styles")}
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {styles.filter(s => s.id !== generation?.style_id).slice(0, 4).map((style) => (
                      <Link
                        key={style.id}
                        to={`/generate`}
                        className="group relative aspect-square rounded-lg overflow-hidden"
                        onClick={() => onOpenChange(false)}
                      >
                        {style.preview_url ? (
                          <img src={style.preview_url} alt={style.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-primary/10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute bottom-1 inset-x-1 text-[10px] font-medium text-white text-center truncate">
                          {style.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* HD Comparison upsell for free users */}
            {!isPremium && !generation.is_hd_unlocked && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-20 rounded-lg bg-muted overflow-hidden relative">
                    {imageUrl && <img src={imageUrl} alt="Preview" className="w-full h-full object-cover blur-[2px] opacity-60" />}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{t("lightbox.hdCompare", "See the difference HD makes")}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("lightbox.hdClearDesc", "Crystal-clear, print-ready quality")}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Premium upsell banner for free users */}
            {!isPremium && (
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  onClick={onOpenUpgrade}
                  className="w-full rounded-xl bg-primary/5 border border-primary/20 p-4 text-left hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">{t("lightbox.premiumBanner", "Go Premium — \u20AC{{price}}", { price: PREMIUM_PRICE })}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("lightbox.premiumDesc", "50 portraits \u00B7 Full HD \u00B7 Prints from \u20AC{{price}}", { price: PRINT_PRICE_PREMIUM })}</p>
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
