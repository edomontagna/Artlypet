import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStyles } from "@/hooks/useStyles";

export const EmptyGallery = () => {
  const { t } = useTranslation();
  const { data: styles } = useStyles();
  const previewStyles = styles?.slice(0, 3) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16 lg:py-20 border border-dashed border-border rounded-2xl bg-card/50 relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center relative z-10"
      >
        <PawPrint className="h-9 w-9 text-primary" />
      </motion.div>

      <h3 className="font-serif text-2xl font-semibold text-foreground mb-3 relative z-10">
        {t("dashboard.emptyTitle2", "Your masterpiece gallery awaits")}
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto px-4 relative z-10">
        {t("dashboard.emptyDesc2", "Upload your first pet photo and we'll transform it into stunning art — it only takes 60 seconds")}
      </p>

      {/* Style previews as social proof */}
      {previewStyles.length > 0 && (
        <div className="flex items-center justify-center gap-3 mb-8 relative z-10">
          {previewStyles.map((style) => (
            <div key={style.id} className="w-16 h-16 rounded-xl overflow-hidden border-2 border-border/50 shadow-sm">
              {style.preview_url ? (
                <img src={style.preview_url} alt={style.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/5" />
              )}
            </div>
          ))}
          <p className="text-xs text-muted-foreground ml-1">
            {t("dashboard.emptyStylesHint", "20+ styles available")}
          </p>
        </div>
      )}

      <Button className="shimmer-btn btn-press rounded-full h-14 px-10 text-base font-medium text-primary-foreground shadow-glow relative z-10" asChild>
        <Link to="/generate">{t("dashboard.emptyBtn", "Create Your First Portrait")}</Link>
      </Button>

      <div className="mt-4 flex items-center justify-center gap-4 relative z-10">
        <Link to="/styles" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          {t("dashboard.browseStyles", "Browse Styles")}
        </Link>
        <span className="text-muted-foreground/30">·</span>
        <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          {t("nav.howItWorks", "How It Works")}
        </Link>
      </div>
    </motion.div>
  );
};
