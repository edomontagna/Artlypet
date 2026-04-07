import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Eye, AlertCircle, Download, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getSignedUrl } from "@/services/storage";

interface PortraitCardProps {
  generation: {
    id: string;
    status: string;
    storage_path: string | null;
    is_hd_unlocked: boolean;
    created_at: string;
    styles: { name: string } | null;
    [key: string]: unknown;
  };
  index: number;
  isPremium: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: () => void;
  variant?: "grid" | "history";
}

const PortraitThumbnail = ({ storagePath, alt }: { storagePath: string; alt: string }) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    getSignedUrl("generated-images", storagePath, 3600)
      .then((u) => { if (!cancelled) setUrl(u); })
      .catch(() => { if (!cancelled) setUrl(null); });
    return () => { cancelled = true; };
  }, [storagePath]);
  if (!url) return <Skeleton className="w-full h-full" />;
  return <img src={url} alt={alt} className="w-full h-full object-cover" loading="lazy" />;
};

const getRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const PortraitCard = ({
  generation: gen,
  index,
  isPremium,
  isFavorite,
  onToggleFavorite,
  onClick,
  variant = "grid",
}: PortraitCardProps) => {
  const { t } = useTranslation();
  const isHistory = variant === "history";
  const aspectClass = isHistory ? "aspect-[4/5]" : "aspect-square";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.5), duration: 0.4 }}
      className={`rounded-2xl bg-card border border-border shadow-sm overflow-hidden cursor-pointer card-hover group ${
        gen.status === "failed" ? "border-l-4 border-l-destructive" : ""
      }`}
      onClick={onClick}
    >
      <div className={`${aspectClass} relative`}>
        {gen.storage_path ? (
          <PortraitThumbnail storagePath={gen.storage_path} alt={gen.styles?.name || "Portrait"} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/50">
            {gen.status === "failed" ? (
              <AlertCircle className="h-8 w-8 text-destructive" />
            ) : (
              <Skeleton className="w-full h-full" />
            )}
          </div>
        )}

        {/* Favorite heart */}
        {gen.status === "completed" && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(gen.id); }}
            className="absolute top-2 left-2 z-10 h-7 w-7 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label={isFavorite ? t("dashboard.unfavorite", "Remove from favorites") : t("dashboard.favorite", "Add to favorites")}
          >
            <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
          </button>
        )}

        {/* HD badge or Preview lock */}
        {gen.status === "completed" && (
          <div className="absolute top-2 right-2">
            {isPremium || gen.is_hd_unlocked ? (
              <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">HD</span>
            ) : (
              <span className="text-[10px] font-medium bg-black/60 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Eye className="h-2.5 w-2.5" /> Preview
              </span>
            )}
          </div>
        )}

        {/* AI-Generated disclosure (EU AI Act) */}
        {gen.status === "completed" && (
          <span className="absolute bottom-2 left-2 z-10 text-[9px] font-medium bg-black/50 text-white/80 px-1.5 py-0.5 rounded backdrop-blur-sm">
            {t("aiGenerated", "AI-Generated")}
          </span>
        )}

        {/* Hover overlay with actions */}
        {gen.status === "completed" && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors portrait-actions flex items-center justify-center gap-2">
            <span className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
              <Download className="h-4 w-4 text-foreground" />
            </span>
            <span className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
              <Share2 className="h-4 w-4 text-foreground" />
            </span>
          </div>
        )}

        {/* Style name overlay */}
        {gen.status === "completed" && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-medium text-white truncate">{gen.styles?.name || "Portrait"}</p>
              {gen.generation_type === "mix" && (
                <span className="text-[9px] bg-white/20 text-white px-1 py-0.5 rounded">Mix</span>
              )}
            </div>
            <p className="text-[10px] text-white/70 mt-0.5">{getRelativeTime(gen.created_at)}</p>
          </div>
        )}

        {/* Failed generation */}
        {gen.status === "failed" && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-destructive/10 to-transparent">
            <p className="text-xs text-destructive font-medium">{t("dashboard.failedRefunded", "Failed — credits refunded")}</p>
            <Button size="sm" variant="link" className="text-xs h-auto p-0 text-primary mt-1" asChild>
              <Link to="/generate">{t("dashboard.retryGenerate", "Retry")}</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Info section for history variant */}
      {isHistory && (
        <div className="p-3">
          <p className="text-sm font-medium truncate">{gen.styles?.name || "Portrait"}</p>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              gen.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
              gen.status === "failed" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
              "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}>
              {gen.status}
            </span>
            <span className="text-xs text-muted-foreground">{getRelativeTime(gen.created_at)}</span>
          </div>
          {gen.status === "failed" && (
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-muted-foreground">{t("dashboard.failedRefunded", "Failed — credits refunded")}</span>
              <Button size="sm" variant="link" className="text-xs h-auto p-0 text-primary" asChild>
                <Link to="/generate">{t("dashboard.retryGenerate", "Retry")}</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
