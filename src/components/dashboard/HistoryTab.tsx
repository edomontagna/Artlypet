import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Loader2, Sparkles, ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PortraitCard } from "./PortraitCard";

interface HistoryTabProps {
  allGenerations: Array<{
    id: string;
    status: string;
    storage_path: string | null;
    is_hd_unlocked: boolean;
    created_at: string;
    styles: { name: string } | null;
    [key: string]: unknown;
  }>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  infiniteLoading: boolean;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  openLightbox: (gen: HistoryTabProps["allGenerations"][number]) => void;
  isPremium: boolean;
}

export const HistoryTab = ({
  allGenerations,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  infiniteLoading,
  favorites,
  toggleFavorite,
  openLightbox,
  isPremium,
}: HistoryTabProps) => {
  const { t } = useTranslation();
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState<"all" | "completed" | "failed" | "favorites">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredGenerations = allGenerations.filter((gen) => {
    if (historyFilter === "favorites" && !favorites.includes(gen.id)) return false;
    if (historyFilter !== "all" && historyFilter !== "favorites" && gen.status !== historyFilter) return false;
    if (historySearch) {
      const styleName = (gen.styles?.name || "").toLowerCase();
      if (!styleName.includes(historySearch.toLowerCase())) return false;
    }
    return true;
  });

  const sortedGenerations = [...filteredGenerations].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const favCount = allGenerations.filter(g => favorites.includes(g.id)).length;

  const getEmptyMessage = () => {
    if (historyFilter === "favorites") return t("dashboard.noFavorites", "No favorites yet — tap the heart on any portrait to save it here");
    if (historyFilter === "failed") return t("dashboard.noFailed", "No failed generations — great news!");
    if (historySearch) return t("dashboard.noSearchResults", "No portraits match '{{search}}'", { search: historySearch });
    return t("dashboard.noResults", "No portraits match your filters");
  };

  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl"
    >
      <h2 className="font-serif text-3xl font-bold text-foreground mb-2">{t("dashboard.tabHistory", "History")}</h2>
      <p className="text-muted-foreground mb-8">{t("dashboard.historyDesc", "All your generated portraits")}</p>

      {infiniteLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />)}
        </div>
      ) : allGenerations.length > 0 ? (
        <>
          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <Input
                placeholder={t("dashboard.searchStyles", "Search by style...")}
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {(["all", "completed", "failed"] as const).map((status) => (
                <Button
                  key={status}
                  variant={historyFilter === status ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs whitespace-nowrap"
                  onClick={() => setHistoryFilter(status)}
                >
                  {status === "all" ? t("dashboard.filterAll", "All") :
                   status === "completed" ? t("dashboard.filterCompleted", "Completed") :
                   t("dashboard.filterFailed", "Failed")}
                </Button>
              ))}
              <Button
                variant={historyFilter === "favorites" ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs gap-1 whitespace-nowrap"
                onClick={() => setHistoryFilter(historyFilter === "favorites" ? "all" : "favorites")}
              >
                <Heart className="h-3 w-3" />
                {t("dashboard.filterFavorites", "Favorites")}
                {favCount > 0 && <span className="text-[10px] ml-0.5">({favCount})</span>}
              </Button>

              {/* Sort toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-xs gap-1 whitespace-nowrap text-muted-foreground"
                onClick={() => setSortOrder(s => s === "newest" ? "oldest" : "newest")}
              >
                {sortOrder === "newest" ? <ArrowDownAZ className="h-3 w-3" /> : <ArrowUpAZ className="h-3 w-3" />}
                {sortOrder === "newest" ? t("dashboard.sortNewest", "Newest") : t("dashboard.sortOldest", "Oldest")}
              </Button>
            </div>
          </div>

          {sortedGenerations.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedGenerations.map((gen, i) => (
                <PortraitCard
                  key={gen.id}
                  generation={gen}
                  index={i}
                  isPremium={isPremium}
                  isFavorite={favorites.includes(gen.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={() => openLightbox(gen)}
                  variant="history"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{getEmptyMessage()}</p>
            </div>
          )}

          {/* Load More */}
          {hasNextPage && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                className="rounded-full gap-2"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("dashboard.loading", "Loading...")}
                  </>
                ) : (
                  t("dashboard.loadMore", "Load More")
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/50">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">{t("dashboard.emptyTitle", "Your gallery is waiting")}</h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">{t("dashboard.emptyDesc", "Upload your first pet photo and watch the magic happen")}</p>
          <Button className="shimmer-btn btn-press rounded-full h-14 px-10 text-base font-medium text-primary-foreground shadow-md" asChild>
            <Link to="/generate">{t("dashboard.emptyBtn", "Create Your First Portrait")}</Link>
          </Button>
        </div>
      )}
    </motion.div>
  );
};
