import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Upload, History, Settings, Crown, Sparkles, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useCreditBalance } from "@/hooks/useCredits";
import { useGenerations, useInfiniteGenerations } from "@/hooks/useGenerations";
import { CreditPurchaseModal } from "@/components/CreditPurchaseModal";
import { OnboardingModal } from "@/components/OnboardingModal";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getServedImage, purchaseHdImage } from "@/services/generations";
import { deleteAccount } from "@/services/account";
import { useTranslation } from "react-i18next";
import { PREMIUM_PRICE } from "@/lib/constants";
import { trackPurchase } from "@/hooks/useAnalytics";
import { PortraitLightbox } from "@/components/PortraitLightbox";
import { safeGetItem, safeSetItem } from "@/lib/storage";
import { DashboardTab } from "@/components/dashboard/DashboardTab";
import { HistoryTab } from "@/components/dashboard/HistoryTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const VALID_TABS = ["dashboard", "history", "settings"] as const;
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
  const queryClient = useQueryClient();
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

  // Payment success confetti
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success" || params.get("hd_unlock") === "success") {
      import("canvas-confetti").then((confetti) => {
        confetti.default({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ["#d4956a", "#c17d52", "#e8b896"] });
      }).catch(() => { /* confetti is decorative, safe to ignore */ });
      trackPurchase(PREMIUM_PRICE, "premium");
      safeSetItem("credits-updated", Date.now().toString());
    }
    if (params.get("payment") === "cancelled") {
      toast.error(t("dashboard.paymentCancelled", "Payment was cancelled. No charges were made."));
    }
  }, [t]);

  // Auto-open upgrade modal from URL params
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
    try {
      const { url } = await purchaseHdImage(generationId);
      if (url) window.location.href = url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start HD unlock");
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
      toast.error("Failed to download image");
    }
  };

  const tabs = [
    { id: "dashboard" as const, label: t("dashboard.tabDashboard", "Dashboard"), icon: Upload },
    { id: "history" as const, label: t("dashboard.tabHistory", "History"), icon: History },
    { id: "settings" as const, label: t("dashboard.tabSettings", "Settings"), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to content
      </a>

      {/* Left sidebar */}
      <aside className="hidden lg:flex w-56 bg-card border-r border-border flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="font-serif text-xl font-bold text-primary">Artlypet</Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left w-full ${
                activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              {displayName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium truncate text-foreground">{displayName}</p>
                {isPremium && <Crown className="h-3 w-3 text-primary flex-shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground rounded-lg hover:bg-muted" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            {t("dashboard.signOut", "Sign Out")}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8">
          <h1 className="font-serif text-xl font-bold text-primary lg:hidden">Artlypet</h1>
          <div className="flex items-center gap-3 ml-auto">
            {isPremium && (
              <span className="rounded-full bg-primary/10 text-primary px-3 py-1 flex items-center gap-1 text-xs font-medium">
                <Crown className="h-3.5 w-3.5" /> Premium
              </span>
            )}
            <div className="flex items-center gap-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">
                {creditsLoading ? <Skeleton className="h-4 w-8 inline-block" /> : creditBalance ?? 0} {t("dashboard.credits", "credits")}
              </span>
            </div>
            <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/30 text-primary hover:bg-primary/5" asChild>
              <Link to="/generate">
                <ImageIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("dashboard.createPortrait", "Create Portrait")}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sign out" className="lg:hidden rounded-full">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div id="main-content" className="flex-1 p-6 lg:p-10 overflow-auto">
          {hasError && (
            <div role="alert" className="mb-6 rounded-xl bg-destructive/10 border border-destructive/30 p-4 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-destructive flex-shrink-0" />
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

        {/* Mobile bottom nav */}
        <nav className="lg:hidden border-t border-border bg-card flex" aria-label="Dashboard navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 font-medium transition-colors ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          ))}
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
