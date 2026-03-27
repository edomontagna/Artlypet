import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Palette, Download, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { icon: Upload, titleKey: "onboarding.step1Title", descKey: "onboarding.step1Desc", color: "bg-primary" },
  { icon: Palette, titleKey: "onboarding.step2Title", descKey: "onboarding.step2Desc", color: "bg-secondary" },
  { icon: Download, titleKey: "onboarding.step3Title", descKey: "onboarding.step3Desc", color: "bg-primary" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingModal = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("artlypet_onboarded", "true");
      onOpenChange(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("artlypet_onboarded", "true");
    onOpenChange(false);
  };

  const current = steps[step];
  const Icon = current.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
        <div className="p-8 text-center">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-primary" : "w-2 bg-muted"
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
              transition={{ duration: 0.2 }}
            >
              {/* Icon */}
              <div className={`w-20 h-20 rounded-full ${current.color}/10 flex items-center justify-center mx-auto mb-6`}>
                <Icon className={`h-10 w-10 text-primary`} />
              </div>

              {/* Content */}
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                {t(current.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {t(current.descKey)}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("onboarding.skip", "Skip")}
            </button>
            <Button onClick={handleNext} className="rounded-full gap-2 px-6">
              {step < steps.length - 1 ? (
                <>
                  {t("onboarding.next", "Next")}
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t("onboarding.start", "Start Creating!")}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
