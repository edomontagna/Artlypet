import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LowCreditsNudgeProps {
  creditBalance: number;
  creditCost: number;
  onUpgrade: () => void;
}

export const LowCreditsNudge = ({ creditBalance, creditCost, onUpgrade }: LowCreditsNudgeProps) => {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  const shouldShow = !dismissed && creditBalance > 0 && creditBalance <= creditCost * 2;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              {t("lowCredits.title", "Running low!")}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {t("lowCredits.message", "Only {{credits}} credits left. Go Premium for 1500 credits + HD downloads.", {
                credits: creditBalance,
              })}
            </p>
          </div>
          <Button
            size="sm"
            onClick={onUpgrade}
            className="rounded-full h-8 px-4 text-xs font-semibold gap-1.5 flex-shrink-0"
          >
            <Crown className="h-3.5 w-3.5" />
            {t("lowCredits.cta", "Go Premium — €15")}
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-amber-400 hover:text-amber-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
