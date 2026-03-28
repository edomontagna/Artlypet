import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreationTheaterProps {
  previewUrl: string | null;
  styleName?: string;
  startTime: number;
  isComplete?: boolean;
}

const STAGES = [
  { threshold: 15, key: "analyzing" as const, fallback: "Analyzing your photo..." },
  { threshold: 35, key: "choosingElements" as const, fallback: "Choosing artistic elements..." },
  { threshold: 75, key: "painting" as const, fallback: "Painting your portrait..." },
  { threshold: 95, key: "finalDetails" as const, fallback: "Adding final details..." },
  { threshold: 100, key: "almostReady" as const, fallback: "Almost ready!" },
];

const getStageLabel = (progress: number, t: (key: string, fallback: string) => string) => {
  for (const stage of STAGES) {
    if (progress <= stage.threshold) {
      return t(`generate.theater.${stage.key}`, stage.fallback);
    }
  }
  return t("generate.theater.almostReady", "Almost ready!");
};

const getFunFacts = (t: (key: string, fallback: string) => string) => [
  t("creation.fact1", "Renaissance painters spent months on a single portrait. We need just 60 seconds."),
  t("creation.fact2", "Your portrait is being created with the same attention to detail as museum masterpieces."),
  t("creation.fact3", "Did you know? Pet portraits have been popular since Ancient Egypt."),
  t("creation.fact4", "Each portrait is unique — no two are ever the same."),
  t("creation.fact5", "Over 10,000 pet owners have transformed their pets into art."),
];

export const CreationTheater = ({ previewUrl, styleName, startTime, isComplete = false }: CreationTheaterProps) => {
  const { t } = useTranslation();
  const funFacts = getFunFacts(t);
  const [progress, setProgress] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(50);

  // Jump to 100% when generation completes
  useEffect(() => {
    if (isComplete) {
      setProgress(100);
    }
  }, [isComplete]);

  // Smooth progress bar over ~50 seconds
  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98;
        // Ease-out: fast at start, slows down near end
        const increment = Math.max(0.15, (100 - prev) / 120);
        return Math.min(98, prev + increment);
      });
    }, 300);
    return () => clearInterval(interval);
  }, [isComplete]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 50 - elapsed);
      setSecondsRemaining(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Fun facts carousel every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const stageLabel = getStageLabel(progress, t);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-12 py-12 flex flex-col items-center max-w-lg mx-auto"
    >
      {/* Preview image with shimmer */}
      {previewUrl && (
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-xl">
          <motion.img
            src={previewUrl}
            alt="Your pet"
            className="max-h-56 rounded-2xl object-contain"
            animate={{
              filter: [
                "brightness(1)",
                "brightness(1.08)",
                "brightness(1)",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Brush stroke overlay effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent rounded-2xl"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          />
        </div>
      )}

      {/* Stage label */}
      <h2 className="font-serif text-2xl font-bold text-foreground mb-1 text-center">
        {stageLabel}
      </h2>

      {styleName && (
        <p className="text-sm text-muted-foreground mb-6 text-center">
          {t("generate.theater.styleLabel", "Style: {{style}}", { style: styleName })}
        </p>
      )}

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2.5 mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Time remaining */}
      <p className="text-sm text-muted-foreground mb-8">
        {secondsRemaining > 0
          ? t("generate.theater.timeRemaining", "~{{seconds}} seconds remaining", { seconds: secondsRemaining })
          : t("generate.theater.anyMoment", "Any moment now...")}
      </p>

      {/* Fun facts carousel */}
      <div className="h-16 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-muted-foreground/80 text-center italic font-sans"
          >
            {funFacts[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Share while waiting */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground mb-2">{t("creation.shareExcitement", "Share your excitement while you wait!")}</p>
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400" asChild>
            <a href={`https://wa.me/?text=${encodeURIComponent(t("share.caption", "My pet just became a work of art! Create yours free") + " https://artlypet.com")}`} target="_blank" rel="noopener noreferrer" title="WhatsApp">
              <MessageCircle className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800" asChild>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(t("share.caption", "My pet just became a work of art! Create yours free"))}&url=${encodeURIComponent("https://artlypet.com")}`} target="_blank" rel="noopener noreferrer" title="X">
              <span className="text-sm font-bold">𝕏</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950" asChild>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://artlypet.com")}`} target="_blank" rel="noopener noreferrer" title="Facebook">
              <span className="text-sm font-bold">f</span>
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
