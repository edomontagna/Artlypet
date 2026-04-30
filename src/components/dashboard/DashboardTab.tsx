import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  Crown,
  ImageIcon,
  Gift,
  Copy,
  Printer,
  Flame,
  ArrowUpRight,
  Coins,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CREDIT_COST_SINGLE, CREDIT_COST_MIX } from "@/lib/constants";
import { PortraitCard } from "./PortraitCard";
import { EmptyGallery } from "./EmptyGallery";
import { QuickActions } from "./QuickActions";
import { MagneticButton } from "@/components/ui/magnetic-button";

interface DashboardTabProps {
  displayName: string;
  profile: { referral_code?: string | null; plan_type?: string; created_at?: string; [key: string]: unknown } | null | undefined;
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

const ease = [0.16, 1, 0.3, 1] as const;

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
  navigate: _navigate,
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl space-y-6 lg:space-y-7"
    >
      {/* GREETING — left aligned, anti-center */}
      <div>
        <span className="sec-label">{t("dashboard.kicker", "Studio overview")}</span>
        <h2 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tightest leading-tight text-foreground">
          {greetings[greetingKey]}, <span className="text-primary">{displayName}</span>
        </h2>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed">
          {t("dashboard.createBeautiful", "Let's create something beautiful today.")}
        </p>
      </div>

      {/* HERO BENTO ROW — 12 col, asymmetric: credit (7) + create CTA (5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Credit balance card — large */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5, ease }}
          className="lg:col-span-7 bento-card-lg p-7 lg:p-9 relative overflow-hidden"
        >
          {/* Subtle warm radial in corner */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent 70%)" }}
          />

          <div className="relative flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Coins className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                {t("dashboard.creditBalance", "Credit balance")}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              {creditsLoading ? (
                <Skeleton className="h-14 w-32" />
              ) : (
                <span className="font-mono tabular text-6xl lg:text-7xl font-bold text-foreground tracking-tightest leading-none">
                  {creditBalance ?? 0}
                </span>
              )}
              <span className="text-sm text-muted-foreground">{t("dashboard.credits", "credits")}</span>
            </div>

            <p className="text-sm text-muted-foreground">
              {t("dashboard.creditCosts", "Single: {{single}} credits · Mix: {{mix}} credits", { single: CREDIT_COST_SINGLE, mix: CREDIT_COST_MIX })}
            </p>

            {!isPremium && (
              <div className="mt-6 pt-5 border-t border-border flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setCreditModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-4 h-9 text-xs font-semibold transition-colors btn-press"
                >
                  <Crown className="h-3 w-3" strokeWidth={2} />
                  <span>{t("dashboard.goPremium", "Go Premium — €15")}</span>
                </button>
                <span className="text-xs text-muted-foreground">{t("dashboard.premiumPitch", "1500 credits + HD + discounted prints")}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Create CTA card — pill of glory */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease }}
          className="lg:col-span-5 bento-card-lg p-7 lg:p-9 flex flex-col justify-between relative overflow-hidden bg-foreground text-background"
        >
          {/* Decorative breath dot */}
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-primary animate-breath" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-background/60">
              {t("dashboard.studioReady", "Studio ready")}
            </span>
          </div>

          <h3 className="font-serif text-2xl lg:text-3xl font-bold tracking-tight leading-tight mb-2">
            {t("dashboard.createNewPortraitTitle", "Make a new portrait.")}
          </h3>
          <p className="text-sm text-background/70 mb-6">
            {t("dashboard.createNewPortraitSub", "Pick a photo, pick a style. Done in about a minute.")}
          </p>

          <Link to="/generate" className="rounded-full self-start" tabIndex={-1}>
            <MagneticButton
              className="rounded-full h-12 px-7 text-sm font-semibold bg-primary text-primary-foreground shadow-tinted btn-press"
              strength={0.32}
            >
              <Sparkles className="h-4 w-4" strokeWidth={2} />
              <span>{t("dashboard.createNewPortrait", "Open the studio")}</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
            </MagneticButton>
          </Link>
        </motion.div>
      </div>

      {/* STATS ROW — anti-card-overuse: divide-x within one card, not 3 separate cards */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease }}
        className="bento-card divide-y sm:divide-y-0 sm:divide-x divide-border grid grid-cols-1 sm:grid-cols-3"
      >
        <div className="p-6 lg:p-7">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              {t("dashboard.totalPortraits", "Portraits")}
            </span>
          </div>
          {generationsLoading ? (
            <Skeleton className="h-9 w-16" />
          ) : (
            <div className="font-mono tabular text-4xl font-bold text-foreground tracking-tightest leading-none">
              {completedCount}
            </div>
          )}
        </div>

        <div className="p-6 lg:p-7">
          <div className="flex items-center gap-2 mb-3">
            <Flame className={`h-3.5 w-3.5 ${streak > 0 ? "text-orange-500" : "text-muted-foreground/60"}`} strokeWidth={2} />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              {t("dashboard.streak", "Streak")}
            </span>
          </div>
          {generationsLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : streak > 0 ? (
            <div className="flex items-baseline gap-1.5">
              <span className={`font-mono tabular text-4xl font-bold tracking-tightest leading-none ${streak > 0 ? "text-foreground streak-glow" : "text-foreground"}`}>
                {streak}
              </span>
              <span className="text-sm text-muted-foreground">{t("dashboard.days", "days")}</span>
            </div>
          ) : (
            <div className="text-base font-medium text-muted-foreground">
              {t("dashboard.streakStart", "Start today")}
            </div>
          )}
        </div>

        <div className="p-6 lg:p-7">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              {t("dashboard.plan", "Plan")}
            </span>
          </div>
          <div className={`text-2xl font-bold tracking-tight leading-none ${isPremium ? "text-primary" : "text-foreground"}`}>
            {isPremium ? "Premium" : t("dashboard.freePlan", "Free")}
          </div>
          {isPremium && (
            <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
              {t("dashboard.premiumPerks", "All HD · No watermarks · Discount prints")}
            </p>
          )}
        </div>
      </motion.div>

      {/* QUICK ACTIONS */}
      <QuickActions
        hasPortraits={hasPortraits}
        referralCode={profile?.referral_code ?? undefined}
      />

      {/* REFERRAL — asymmetric pill, anti-card */}
      {profile?.referral_code && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease }}
          className="rounded-[1.75rem] border border-dashed border-border px-6 py-5 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/12">
              <Gift className="h-4 w-4 text-primary" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{t("dashboard.shareTheLove", "Share the love")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("referral.desc", "Share your link. Both you and your friend get 150 bonus credits.")}</p>
            </div>
          </div>
          <button
            onClick={() => {
              const link = `${window.location.origin}/signup?ref=${encodeURIComponent(profile.referral_code!)}`;
              navigator.clipboard.writeText(link);
              toast.success(t("referral.copied", "Referral link copied."));
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border hover:border-primary/40 hover:bg-muted/40 px-4 h-9 text-xs font-semibold text-foreground transition-colors btn-press"
          >
            <Copy className="h-3 w-3" strokeWidth={2} />
            <span>{t("referral.copyLink", "Copy link")}</span>
          </button>
        </motion.div>
      )}

      {/* RECENT PORTRAITS */}
      {generationsLoading ? (
        <div>
          <h3 className="text-base font-semibold text-foreground mb-4">{t("dashboard.recentPortraits", "Recent portraits")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
          </div>
        </div>
      ) : generations && generations.length > 0 ? (
        <div>
          <div className="flex items-end justify-between mb-5">
            <div>
              <span className="sec-label">{t("dashboard.recentLabel", "Recent")}</span>
              <h3 className="mt-2 text-2xl font-bold text-foreground tracking-tight">
                {t("dashboard.recentPortraits", "Recent portraits")}
              </h3>
            </div>
            {generations.length > 6 && (
              <button
                onClick={() => setActiveTab("history")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <span>{t("dashboard.viewAll", "View all")}</span>
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
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
        </div>
      ) : (
        <EmptyGallery />
      )}

      {/* PRINT CROSS-SELL */}
      {completedCount >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease }}
          className="bento-card p-6 lg:p-7 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12">
              <Printer className="h-5 w-5 text-primary" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{t("dashboard.printTitle", "Your portraits on museum-quality canvas")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("dashboard.printCtaDesc", "From €59.90 — shipped across the EU.")}</p>
            </div>
          </div>
          <Link
            to="/prints"
            className="group inline-flex items-center gap-2 rounded-full border border-border hover:border-primary/40 hover:bg-muted/40 px-4 h-10 text-sm font-medium text-foreground transition-colors btn-press"
          >
            <span>{t("dashboard.printCtaBtn", "View prints")}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.25} />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};
