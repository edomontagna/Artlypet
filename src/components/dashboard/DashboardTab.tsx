import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Crown, ImageIcon, Gift, Copy, Printer, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CREDIT_COST_SINGLE, CREDIT_COST_MIX } from "@/lib/constants";
import { StatCard } from "./StatCard";
import { PortraitCard } from "./PortraitCard";
import { EmptyGallery } from "./EmptyGallery";
import { QuickActions } from "./QuickActions";

interface DashboardTabProps {
  displayName: string;
  profile: { referral_code?: string; plan_type?: string; created_at?: string } | null | undefined;
  creditBalance: number | null | undefined;
  creditsLoading: boolean;
  generations: Array<{
    id: string;
    status: string;
    storage_path: string | null;
    is_hd_unlocked: boolean;
    created_at: string;
    styles: { name: string } | null;
    [key: string]: unknown;
  }> | undefined;
  generationsLoading: boolean;
  isPremium: boolean;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  openLightbox: (gen: NonNullable<DashboardTabProps["generations"]>[number]) => void;
  setCreditModalOpen: (v: boolean) => void;
  setActiveTab: (tab: "dashboard" | "history" | "settings") => void;
  navigate: (path: string) => void;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "goodMorning";
  if (hour < 18) return "goodAfternoon";
  return "goodEvening";
};

const getStreak = (generations: DashboardTabProps["generations"]): number => {
  if (!generations || generations.length === 0) return 0;
  const completed = generations
    .filter(g => g.status === "completed")
    .map(g => new Date(g.created_at).toISOString().split("T")[0])
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => b.localeCompare(a));

  if (completed.length === 0) return 0;

  let streak = 1;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (completed[0] !== today && completed[0] !== yesterday) return 0;

  for (let i = 1; i < completed.length; i++) {
    const curr = new Date(completed[i - 1]);
    const prev = new Date(completed[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
};

export const DashboardTab = ({
  displayName,
  profile,
  creditBalance,
  creditsLoading,
  generations,
  generationsLoading,
  isPremium,
  favorites,
  toggleFavorite,
  openLightbox,
  setCreditModalOpen,
  setActiveTab,
  navigate,
}: DashboardTabProps) => {
  const { t } = useTranslation();
  const greetingKey = getGreeting();
  const completedCount = generations?.filter(g => g.status === "completed").length ?? 0;
  const streak = getStreak(generations);
  const hasPortraits = completedCount > 0;

  const greetings: Record<string, string> = {
    goodMorning: t("dashboard.goodMorning", "Good morning"),
    goodAfternoon: t("dashboard.goodAfternoon", "Good afternoon"),
    goodEvening: t("dashboard.goodEvening", "Good evening"),
  };

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl space-y-8"
    >
      {/* Welcome */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-1">
          {greetings[greetingKey]}, {displayName}
        </h2>
        <p className="text-muted-foreground">{t("dashboard.createBeautiful", "Let's create something beautiful today.")}</p>
      </div>

      {/* Hero Credit Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="rounded-2xl bg-gradient-to-r from-primary/5 via-card to-primary/5 border border-primary/15 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs text-muted-foreground mb-1">{t("dashboard.creditBalance", "Credit Balance")}</p>
          <p className="font-serif text-5xl font-bold text-foreground">
            {creditsLoading ? <Skeleton className="h-12 w-20" /> : creditBalance ?? 0}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("dashboard.creditCosts", "Single: {{single}} credits · Mix: {{mix}} credits", { single: CREDIT_COST_SINGLE, mix: CREDIT_COST_MIX })}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Button className="shimmer-btn btn-press rounded-full h-12 px-8 text-sm font-medium text-primary-foreground shadow-glow" asChild>
            <Link to="/generate">
              <Sparkles className="h-4 w-4 mr-2" />
              {t("dashboard.createNewPortrait", "Create New Portrait")}
            </Link>
          </Button>
          {!isPremium && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full gap-1.5 text-xs text-muted-foreground hover:text-primary"
              onClick={() => setCreditModalOpen(true)}
            >
              <Crown className="h-3 w-3" />
              {t("dashboard.goPremium", "Go Premium — €15")}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={<ImageIcon className="h-4 w-4 text-primary" />}
          label={t("dashboard.totalPortraits", "Portraits")}
          value={completedCount}
          loading={generationsLoading}
        />
        <StatCard
          icon={<Flame className={`h-4 w-4 ${streak > 0 ? "text-orange-500" : "text-primary"}`} />}
          label={t("dashboard.streak", "Streak")}
          value={
            <span className={streak > 0 ? "streak-glow" : ""}>
              {streak > 0 ? `${streak} ${t("dashboard.days", "days")}` : t("dashboard.streakStart", "Start today!")}
            </span>
          }
          loading={generationsLoading}
          variant={streak > 0 ? "primary" : "default"}
        />
        <StatCard
          icon={<Crown className="h-4 w-4 text-primary" />}
          label={t("dashboard.plan", "Plan")}
          value={isPremium ? "Premium" : t("dashboard.freePlan", "Free Plan")}
          subtitle={isPremium
            ? t("dashboard.premiumPerks", "All HD · No watermarks · Discount prints")
            : undefined}
          variant={isPremium ? "primary" : "default"}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions
        hasPortraits={hasPortraits}
        referralCode={profile?.referral_code}
      />

      {/* Referral Card - promoted */}
      {profile?.referral_code && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/15 p-5 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
            >
              <Gift className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t("dashboard.shareTheLove", "Share the love")}</p>
              <p className="text-xs text-muted-foreground">{t("referral.desc", "Share your link. Both you and your friend get 150 bonus credits!")}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-2 border-primary/30 hover:bg-primary/5"
            onClick={() => {
              const link = `${window.location.origin}/signup?ref=${encodeURIComponent(profile.referral_code!)}`;
              navigator.clipboard.writeText(link);
              toast.success(t("referral.copied", "Referral link copied!"));
            }}
          >
            <Copy className="h-3.5 w-3.5" />
            {t("referral.copyLink", "Copy Link")}
          </Button>
        </motion.div>
      )}

      {/* Recent Portraits */}
      {generationsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
        </div>
      ) : generations && generations.length > 0 ? (
        <div>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-4">{t("dashboard.recentPortraits", "Recent Portraits")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {generations.slice(0, 6).map((gen, i) => (
              <PortraitCard
                key={gen.id}
                generation={gen}
                index={i}
                isPremium={isPremium}
                isFavorite={favorites.includes(gen.id)}
                onToggleFavorite={toggleFavorite}
                onClick={() => openLightbox(gen)}
              />
            ))}
          </div>
          {generations.length > 6 && (
            <div className="text-center mt-6">
              <Button variant="outline" className="rounded-full" onClick={() => setActiveTab("history")}>
                {t("dashboard.viewAll", "View all portraits")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <EmptyGallery />
      )}

      {/* Print cross-sell */}
      {completedCount >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-card border border-border p-5 flex items-center justify-between flex-wrap gap-3 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-noise pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Printer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t("dashboard.printTitle", "Your portraits on museum-quality canvas")}</p>
              <p className="text-xs text-muted-foreground">{t("dashboard.printCtaDesc", "Museum-quality prints from €59.90 — shipped to your door")}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-full gap-2 relative z-10" asChild>
            <Link to="/prints">{t("dashboard.printCtaBtn", "View Prints")}</Link>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
