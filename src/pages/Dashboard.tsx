import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Upload, History, Settings, Crown, Coins, ImageIcon, AlertCircle, ArrowUpRight, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useCreditBalance } from "@/hooks/useCredits";
import { useGenerations, useInfiniteGenerations } from "@/hooks/useGenerations";
import { CreditPurchaseModal } from "@/components/CreditPurchaseModal";
import { OnboardingModal } from "@/components/OnboardingModal";
import { toast } from "sonner";
import { getServedImage, purchaseHdImage } from "@/services/generations";
import { deleteAccount } from "@/services/account";
import { useTranslation } from "react-i18next";
import { PREMIUM_PRICE, HD_UNLOCK_PRICE } from "@/lib/constants";
import { trackPurchase, trackInitiateCheckout } from "@/hooks/useAnalytics";
import { PortraitLightbox } from "@/components/PortraitLightbox";
import { safeGetItem, safeSetItem } from "@/lib/storage";
import { DashboardTab } from "@/components/dashboard/DashboardTab";
import { HistoryTab } from "@/components/dashboard/HistoryTab";
import { OrdersTab } from "@/components/dashboard/OrdersTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { BrandMark } from "@/components/ui/brand-mark";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const VALID_TABS = ["dashboard", "history", "orders", "settings"] as const;
  type TabId = typeof VALID_TABS[number];
  const tabParam = searchParams.get("tab");
  const activeTab: TabId = VALID_TABS.includes(tabParam as TabId) ? (tabParam as TabId) : "dashboard";

  const setActiveTab = (tab: TabId) => {
    setSelectedGeneration(null);
    setLightboxOpen(false);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (tab === "dashboard") next.delete("tab");
      else next.set("tab", tab);
      return next;
    }, { replace: true });
  };

  const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile();
  const { data: creditBalance, isLoading: creditsLoading, isError: creditsError } = useCreditBalance();
  const { data: generations, isLoading: generationsLoading, isError: generationsError } = useGenerations();
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: infiniteLoading,
    isError: infiniteError,
  } = useInfiniteGenerations();
  const allGenerations = infiniteData?.pages.flat() ?? [];
  const hasError = profileError || creditsError || generationsError || infiniteError;
  const updateProfile = useUpdateProfile();

  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !safeGetItem("artlypet_onboarded"));
  const [selectedGeneration, setSelectedGeneration] = useState<NonNullable<typeof generations>[number] | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(safeGetItem("artlypet_favorites") || "[]"); } catch { return []; }
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      safeSetItem("artlypet_favorites", JSON.stringify(next));
      return next;
    });
  };

  const openLightbox = (gen: { id: string; status: string; storage_path: string | null; is_hd_unlocked: boolean; created_at: string; styles: { name: string } | null; [key: string]: unknown }) => {
    setSelectedGeneration(gen as NonNullable<typeof generations>[number]);
    setLightboxOpen(true);
  };

  const isPremium = profile?.plan_type === "premium" || profile?.plan_type === "business";
  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";

  // Payment success confetti + analytics — distinguishes Premium vs HD unlock so the funnel is accurate
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isPremiumSuccess = params.get("payment") === "success";
    const isHdSuccess = params.get("hd_unlock") === "success";
    if (isPremiumSuccess || isHdSuccess) {
      import("canvas-confetti").then((confetti) => {
        confetti.default({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ["#d4956a", "#c17d52", "#e8b896"] });
      }).catch(() => { /* confetti is decorative, safe to ignore */ });
      if (isPremiumSuccess) trackPurchase(PREMIUM_PRICE, "premium");
      if (isHdSuccess) trackPurchase(HD_UNLOCK_PRICE, "hd_unlock");
      safeSetItem("credits-updated", Date.now().toString());
    }
    if (params.get("payment") === "cancelled") {
      toast.error(t("dashboard.paymentCancelled", "Payment was cancelled. No charges were made."));
    }
  }, [t]);

  useEffect(() => {
    if (searchParams.get("upgrade") === "true") setCreditModalOpen(true);
  }, [searchParams]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!confirm(t("dashboard.confirmDelete", "Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted."))) return;
    setDeletingAccount(true);
    try {
      await deleteAccount();
      await signOut();
      toast.success(t("dashboard.accountDeleted", "Your account and all associated data have been permanently deleted."));
      navigate("/");
    } catch (err) {
      console.error("Account deletion failed:", err);
      toast.error(t("dashboard.deletionFailed", "Failed to delete account. Please try again or contact support."));
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleUnlockHd = async (generationId: string) => {
    trackInitiateCheckout(HD_UNLOCK_PRICE, "hd_unlock");
    try {
      const { url } = await purchaseHdImage(generationId);
      if (url) window.location.href = url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("dashboard.hdUnlockFailed", "Failed to start HD unlock"));
    }
  };

  const handleDownload = async (gen: { id: string; storage_path?: string | null }) => {
    if (!gen.storage_path) return;
    try {
      const data = await getServedImage(gen.id);
      if (data.url) {
        const a = document.createElement("a");
        a.href = data.url;
        a.download = `artlypet-portrait-${data.mode}.png`;
        a.click();
        setTimeout(() => a.remove(), 100);
      }
    } catch {
      toast.error(t("dashboard.downloadFailed", "Failed to download image"));
    }
  };

  const tabs = [
    { id: "dashboard" as const, label: t("dashboard.tabDashboard", "Dashboard"), icon: Upload },
    { id: "history" as const, label: t("dashboard.tabHistory", "History"), icon: History },
    { id: "orders" as const, label: t("dashboard.tabOrders", "Orders"), icon: Package },
    { id: "settings" as const, label: t("dashboard.tabSettings", "Settings"), icon: Settings },
  ];

  return (
    <div className="app-ui min-h-[100dvh] bg-cream/30 dark:bg-background flex">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to content
      </a>

      {/* LEFT SIDEBAR — navy, refined */}
      <aside className="hidden lg:flex w-60 bg-sidebar text-sidebar-foreground flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/" aria-label="Artlypet home" className="text-sidebar-foreground">
            <BrandMark />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1" aria-label="Dashboard navigation">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active rail */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-sidebar-primary" aria-hidden />
                )}
                <tab.icon className="h-4 w-4" strokeWidth={1.75} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Credit pill — sidebar bottom */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="rounded-2xl bg-sidebar-accent/50 border border-sidebar-border px-4 py-3.5">
            <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-sidebar-foreground/50 mb-1">
              {t("dashboard.creditBalance", "Credit balance")}
            </div>
            <div className="flex items-baseline gap-1.5">
              <Coins className="h-3.5 w-3.5 text-sidebar-primary self-center" strokeWidth={2} />
              <span className="font-mono tabular text-2xl font-semibold text-sidebar-foreground">
                {creditsLoading ? <Skeleton className="h-5 w-10 inline-block align-middle" /> : creditBalance ?? 0}
              </span>
            </div>
            {!isPremium && (
              <button
                onClick={() => setCreditModalOpen(true)}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-full h-8 bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold btn-press"
              >
                <Crown className="h-3 w-3" strokeWidth={2} />
                <span>{t("dashboard.goPremiumShort", "Go Premium")}</span>
              </button>
            )}
          </div>

          {/* Account row */}
          <div className="flex items-center gap-2.5 px-1">
            <div className="h-9 w-9 rounded-full bg-sidebar-primary/15 text-sidebar-primary flex items-center justify-center font-mono tabular text-xs font-bold flex-shrink-0">
              {displayName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold truncate text-sidebar-foreground">{displayName}</p>
                {isPremium && <Crown className="h-3 w-3 text-sidebar-primary flex-shrink-0" strokeWidth={2} />}
              </div>
              <p className="text-[11px] text-sidebar-foreground/50 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              aria-label={t("dashboard.signOut", "Sign out")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header — glass refraction sticky */}
        <header className="sticky top-0 z-30 h-16 lg:h-[68px] glass-refraction border-b border-border/60">
          <div className="h-full flex items-center justify-between px-5 lg:px-10">
            <h1 className="font-serif text-lg font-bold text-foreground lg:hidden">Artlypet</h1>

            <div className="flex items-center gap-2.5 ml-auto">
              {isPremium && (
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary/12 text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
                  <Crown className="h-3 w-3" strokeWidth={2} /> {t("dashboard.premium", "Premium")}
                </span>
              )}

              {/* Credit pill — mobile only (desktop has it in sidebar) */}
              <div className="lg:hidden inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1.5">
                <Coins className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                <span className="font-mono tabular text-sm font-semibold text-foreground">
                  {creditsLoading ? <Skeleton className="h-3.5 w-6 inline-block align-middle" /> : creditBalance ?? 0}
                </span>
              </div>

              <Link to="/generate" className="rounded-full" tabIndex={-1}>
                <MagneticButton
                  className="rounded-full h-10 px-5 text-sm font-semibold bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors"
                  strength={0.28}
                >
                  <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} />
                  <span className="hidden sm:inline">{t("dashboard.createPortrait", "Create portrait")}</span>
                  <span className="sm:hidden">{t("dashboard.create", "Create")}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                </MagneticButton>
              </Link>

              <button
                onClick={handleLogout}
                aria-label={t("dashboard.signOut", "Sign out")}
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </header>

        <div id="main-content" className="flex-1 px-5 lg:px-10 py-7 lg:py-10 overflow-auto pb-20 lg:pb-10">
          {hasError && (
            <div role="alert" className="mb-7 rounded-2xl bg-destructive/10 border border-destructive/30 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" strokeWidth={1.75} />
              <p className="text-sm text-destructive">{t("dashboard.loadError", "Something went wrong loading your data. Please try refreshing the page.")}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <DashboardTab
                displayName={displayName}
                profile={profile}
                creditBalance={creditBalance}
                creditsLoading={creditsLoading}
                generations={generations}
                generationsLoading={generationsLoading}
                isPremium={isPremium}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                openLightbox={openLightbox}
                setCreditModalOpen={setCreditModalOpen}
                setActiveTab={setActiveTab}
                navigate={navigate}
              />
            )}
            {activeTab === "history" && (
              <HistoryTab
                allGenerations={allGenerations}
                fetchNextPage={fetchNextPage}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                infiniteLoading={infiniteLoading}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                openLightbox={openLightbox}
                isPremium={isPremium}
              />
            )}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "settings" && (
              <SettingsTab
                profile={profile}
                profileLoading={profileLoading}
                user={user}
                isPremium={isPremium}
                displayName={displayName}
                updateProfile={updateProfile}
                setCreditModalOpen={setCreditModalOpen}
                onDeleteAccount={handleDeleteAccount}
                deletingAccount={deletingAccount}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Mobile bottom nav — fixed, glass refraction */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 glass-refraction border-t border-border/60 flex" aria-label="Dashboard navigation">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <tab.icon className="h-5 w-5" strokeWidth={1.75} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <PortraitLightbox
        generation={selectedGeneration}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        isPremium={isPremium}
        onUnlockHd={handleUnlockHd}
        onDownload={handleDownload}
        onOpenUpgrade={() => setCreditModalOpen(true)}
      />
      <CreditPurchaseModal open={creditModalOpen} onOpenChange={setCreditModalOpen} />
      <OnboardingModal open={showOnboarding} onOpenChange={setShowOnboarding} />
    </div>
  );
};

export default Dashboard;
