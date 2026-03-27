import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const ExitIntentPopup = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed or user is logged in
    if (localStorage.getItem("artlypet_exit_dismissed")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
        // Only show once per session
        document.removeEventListener("mouseout", handleMouseLeave);
      }
    };

    // Delay activation by 5 seconds to avoid showing immediately
    const timer = setTimeout(() => {
      document.addEventListener("mouseout", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("artlypet_exit_dismissed", "true");
  };

  return (
    <Dialog open={show} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
      <DialogContent className="sm:max-w-md rounded-2xl text-center p-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
          {t("exitIntent.title", "Wait — Don't Miss Out!")}
        </h3>
        <p className="text-muted-foreground mb-6">
          {t("exitIntent.desc", "Get 3 free AI pet portraits. No credit card needed. Your pet deserves a masterpiece!")}
        </p>
        <Button asChild className="w-full shimmer-btn btn-press rounded-full h-12 text-base font-medium text-primary-foreground shadow-md mb-3">
          <Link to="/signup" onClick={handleDismiss}>
            {t("exitIntent.cta", "Claim Your Free Portraits")}
          </Link>
        </Button>
        <button
          onClick={handleDismiss}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("exitIntent.dismiss", "No thanks, I'll pass")}
        </button>
      </DialogContent>
    </Dialog>
  );
};
