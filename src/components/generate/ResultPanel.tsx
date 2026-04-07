import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Lock, Crown, Printer, AlertCircle, ArrowRight, Star, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SharePanel } from "@/components/SharePanel";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { PRINT_PRICE_FREE, PRINT_PRICE_PREMIUM } from "@/lib/constants";

interface ResultPanelProps {
  resultUrl: string;
  resultMode: "hd" | "watermarked";
  previewUrl: string | null;
  isPremium: boolean;
  generationId: string | null;
  selectedStyleName: string | undefined;
  downloadFileName: string;
  onUnlockHd: () => void;
  onTryDifferentStyle: () => void;
  onCreateAnother: () => void;
  onShowPurchaseModal: () => void;
  onConfettiReady: () => void;
}

export const ResultPanel = ({
  resultUrl, resultMode, previewUrl, isPremium, generationId,
  selectedStyleName, downloadFileName, onUnlockHd, onTryDifferentStyle,
  onCreateAnother, onShowPurchaseModal, onConfettiReady,
}: ResultPanelProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
      onAnimationComplete={onConfettiReady}
    >
      {/* Success header */}
      <div className="text-center">
        <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-primary" />
          </div>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
          {t("generate.celebrationTitle", "Your masterpiece is ready!")}
        </motion.h2>
        <p className="text-muted-foreground">{t("generate.portraitReadyDesc", "Here's your masterpiece. Choose what to do next.")}</p>
      </div>

      {/* Before / After */}
      <motion.div initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }} animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
        {previewUrl ? (
          <div className="max-w-xl mx-auto"><BeforeAfterSlider beforeUrl={previewUrl} afterUrl={resultUrl} /></div>
        ) : (
          <div className="max-w-xl mx-auto rounded-2xl overflow-hidden shadow-xl border-2 border-primary relative">
            <img src={resultUrl} alt="Generated portrait" className="w-full" />
            {resultMode === "watermarked" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="rotate-[-30deg] opacity-25">
                  {[0, 1, 2].map((i) => (
                    <p key={i} className="text-white font-serif text-3xl font-bold tracking-widest mb-12 select-none" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                      Artlypet &nbsp; Artlypet
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Watermark explainer */}
      {resultMode === "watermarked" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-xl mx-auto">
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 px-5 py-4">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-1">{t("generate.watermarkTitle", "This is a free preview with watermark")}</p>
              <p className="text-xs text-amber-700 dark:text-amber-300/80">{t("generate.watermarkDesc", "Unlock HD to get the full-quality image without watermark — perfect for printing and sharing.")}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Share */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="max-w-xl mx-auto text-center space-y-3">
        <h3 className="font-serif text-lg font-semibold text-foreground">{t("generate.shareHeading", "Share your masterpiece!")}</h3>
        <SharePanel imageUrl={resultUrl} generationId={generationId ?? undefined} />
        <p className="text-xs text-muted-foreground">{t("generate.shareIncentive", "Share and earn 50 bonus credits")}</p>
      </motion.div>

      {/* Action cards */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <h3 className="font-serif text-xl font-bold text-foreground text-center">{t("generate.whatNext", "What would you like to do?")}</h3>

        {/* HD Unlock */}
        {resultMode === "watermarked" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="rounded-2xl border-2 border-primary bg-primary/5 p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Download className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif text-lg font-bold text-foreground mb-1">{t("generate.unlockHdTitle", "Download in Full HD")}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{t("generate.unlockHdDesc", "Remove the watermark and get your portrait in stunning 2K resolution, perfect for printing and sharing.")}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button onClick={onUnlockHd} size="lg" className="rounded-full gap-2 shadow-lg h-12 px-8 text-base">
                      <Lock className="h-4 w-4" />{t("generate.unlockHdBtn", "Unlock HD — €4.90")}
                    </Button>
                    <span className="text-xs text-muted-foreground">{t("generate.oneTimePayment", "One-time payment")}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Go Premium */}
        {!isPremium && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="rounded-xl bg-muted/50 p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t("generate.premiumAlt", "Or save with Premium")}</p>
                  <p className="text-xs text-muted-foreground">{t("generate.premiumSaving", "5 HD images would cost €24.50 — Premium is just €15!")}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full gap-1.5 text-primary hover:bg-primary/5" onClick={onShowPurchaseModal}>
                <Crown className="h-3.5 w-3.5" />{t("generate.premiumBtn", "Go Premium — €15")}<ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Canvas Print */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Printer className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-lg font-bold text-foreground mb-1">{t("generate.printTitle", "Print on Canvas")}</h4>
                <p className="text-sm text-muted-foreground mb-1">{t("generate.printDesc2", "Museum-quality canvas print, shipped directly to your door. Perfect as a gift or wall decoration.")}</p>
                {resultMode === "watermarked" && (
                  <p className="text-xs text-muted-foreground mb-2 italic">{t("generate.printRequiresHd", "Requires HD unlock or Premium plan")}</p>
                )}
                <Button variant="outline" asChild size="lg" className="rounded-full gap-2 h-12 px-8 text-base">
                  <Link to="/prints">
                    <Printer className="h-4 w-4" />
                    {t("generate.printBtn", "Order Canvas — {{price}}", { price: isPremium ? `€${PRINT_PRICE_PREMIUM.toFixed(2)}` : `€${PRINT_PRICE_FREE.toFixed(2)}` })}
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Download HD */}
        {resultMode === "hd" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="rounded-2xl border-2 border-primary bg-primary/5 p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Download className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif text-lg font-bold text-foreground mb-1">{t("generate.downloadTitle", "Download Your Portrait")}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{t("generate.downloadDesc", "Full 2K HD resolution, no watermark. Ready to print or share.")}</p>
                  <Button asChild size="lg" className="rounded-full gap-2 shadow-lg h-12 px-8 text-base">
                    <a href={resultUrl} target="_blank" rel="noopener noreferrer" download={downloadFileName}>
                      <Download className="h-4 w-4" />{t("generate.downloadHd", "Download HD")}
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Download preview */}
        {resultMode === "watermarked" && (
          <div className="text-center">
            <Button variant="ghost" asChild className="rounded-full gap-2 text-muted-foreground text-sm">
              <a href={resultUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-3 w-3" />{t("generate.downloadPreview", "View watermarked preview")}
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Create another */}
      <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
        <Button variant="outline" className="rounded-full gap-2" onClick={onTryDifferentStyle}>
          <Star className="h-4 w-4" />{t("generate.tryDifferentStyle", "Try Different Style")}
        </Button>
        <Button variant="outline" className="rounded-full gap-2" onClick={onCreateAnother}>
          <ImageIcon className="h-4 w-4" />{t("generate.createAnother", "Create Another Portrait")}
        </Button>
      </div>
    </motion.div>
  );
};
