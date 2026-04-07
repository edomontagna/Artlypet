import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Palette, Download, Gift, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const steps = [
  { icon: Upload, titleKey: "onboarding.step1Title", descKey: "onboarding.step1Desc", color: "bg-primary" },
  { icon: Palette, titleKey: "onboarding.step2Title", descKey: "onboarding.step2Desc", color: "bg-secondary" },
  { icon: Download, titleKey: "onboarding.step3Title", descKey: "onboarding.step3Desc", color: "bg-primary" },
  { icon: Gift, titleKey: "onboarding.step4Title", descKey: "onboarding.step4Desc", color: "bg-secondary" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingModal = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("artlypet_onboarded", "true");
      onOpenChange(false);
      navigate("/generate");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("artlypet_onboarded", "true");
    onOpenChange(false);
  };

  const handleCopyReferral = () => {
    if (profile?.referral_code) {
      const link = `${window.location.origin}/signup?ref=${encodeURIComponent(profile.referral_code)}`;
      navigator.clipboard.writeText(link);
      toast.success(t("referral.copied", "Referral link copied!"));
    }
  };

  const current = steps[step];
  const Icon = current.icon;
  const isLastStep = step === steps.length - 1;
  const isReferralStep = step === 3;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">Welcome to Artlypet</DialogTitle>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-primary rounded-r-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <div className="p-8 text-center">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-primary" : i < step ? "w-2 bg-primary/40" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Icon with animation */}
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className={`w-20 h-20 rounded-full ${current.color}/10 flex items-center justify-center mx-auto mb-6`}
              >
                <Icon className="h-10 w-10 text-primary" />
              </motion.div>

              {/* Content */}
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                {t(current.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {t(current.descKey)}
              </p>

              {/* Referral copy button on step 4 */}
              {isReferralStep && profile?.referral_code && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2 mt-4"
                  onClick={handleCopyReferral}
                >
                  <Gift className="h-3.5 w-3.5" />
                  {t("referral.copyLink", "Copy Link")}
                </Button>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Step counter */}
          <p className="text-[10px] text-muted-foreground mt-6 mb-2">
            {step + 1} / {steps.length}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("onboarding.skip", "Skip")}
            </button>
            <Button onClick={handleNext} className="rounded-full gap-2 px-6 shimmer-btn btn-press text-primary-foreground">
              {isLastStep ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t("onboarding.start", "Start Creating!")}
                </>
              ) : (
                <>
                  {t("onboarding.next", "Next")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
