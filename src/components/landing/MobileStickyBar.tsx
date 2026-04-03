import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sparkles } from "lucide-react";

export const MobileStickyBar = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setShow(false);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Show after hero section (~600px), hide near pricing section
      const pricingEl = document.getElementById("pricing");
      const pricingTop = pricingEl?.getBoundingClientRect().top ?? Infinity;
      const pricingVisible = pricingTop < window.innerHeight && pricingTop > 0;

      setShow(scrollY > 600 && !pricingVisible);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border px-4 py-3 flex items-center justify-between gap-3"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs line-through text-muted-foreground">€29</span>
              <span className="text-sm font-bold text-foreground">€15</span>
              <span className="text-[10px] text-muted-foreground">{t("pricing.oneTime", "one-time")}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{t("mobileCta.subtitle", "Free to start")}</p>
          </div>
          <Button className="shimmer-btn btn-press rounded-full h-10 px-5 text-sm font-medium text-primary-foreground shadow-glow gap-1.5" asChild>
            <Link to="/signup">
              <Sparkles className="h-3.5 w-3.5" />
              {t("mobileCta.title", "Transform Your Pet")}
            </Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
