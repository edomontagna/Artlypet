import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Upload, History, Settings, Crown, Sparkles, Download, AlertCircle, Lock, Image as ImageIcon, Copy, Printer } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useCreditBalance } from "@/hooks/useCredits";
import { useGenerations } from "@/hooks/useGenerations";
import { CreditPurchaseModal } from "@/components/CreditPurchaseModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getServedImage, purchaseHdImage } from "@/services/generations";
import { getSignedUrl } from "@/services/storage";
import { useTranslation } from "react-i18next";
import { CREDIT_COST_SINGLE, CREDIT_COST_MIX } from "@/lib/constants";
import { PortraitLightbox } from "@/components/PortraitLightbox";

// Thumbnail component that loads signed URL from storage path
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

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"dashboard" | "history" | "settings">("dashboard");
  const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile();
  const { data: creditBalance, isLoading: creditsLoading, isError: creditsError } = useCreditBalance();
  const { data: generations, isLoading: generationsLoading, isError: generationsError } = useGenerations();
  const hasError = profileError || creditsError || generationsError;
  const updateProfile = useUpdateProfile();

  const [editName, setEditName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState<typeof generations extends (infer T)[] | undefined ? T | null : null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = (gen: NonNullable<typeof generations>[number]) => {
    setSelectedGeneration(gen);
    setLightboxOpen(true);
  };

  const isPremium = profile?.plan_type === "premium" || profile?.plan_type === "business";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success" || params.get("hd_unlock") === "success") {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#d4956a", "#c17d52", "#e8b896"],
        });
      });
    }
  }, []);

  // Auto-open upgrade modal from URL params
  useEffect(() => {
    if (searchParams.get("upgrade") === "true") {
      setCreditModalOpen(true);
    }
  }, [searchParams]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    const result = await updateProfile.mutateAsync({ display_name: editName.trim() });
    if (result.error) {
      toast.error(t("dashboard.nameUpdateFailed", "Failed to update name"));
    } else {
      toast.success(t("dashboard.nameUpdated", "Name updated"));
      setEditingName(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm(t("dashboard.confirmDelete", "Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted."))) return;
    await supabase.from("audit_log").insert({
      user_id: user?.id,
      event_type: "account_deleted" as const,
      metadata: { requested_at: new Date().toISOString() },
    });
    await signOut();
    toast.success(t("dashboard.deletionRequested", "Account deletion requested. Your data will be removed shortly."));
    navigate("/");
  };

  const handleUnlockHd = async (generationId: string) => {
    try {
      const { url } = await purchaseHdImage(generationId);
      if (url) window.location.href = url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start HD unlock");
    }
  };

  const handleDownload = async (gen: { id: string; storage_path?: string | null; is_hd_unlocked?: boolean }) => {
    if (!gen.storage_path) return;
    try {
      const data = await getServedImage(gen.id);
      if (data.url) {
        const a = document.createElement("a");
        a.href = data.url;
        a.download = `artlypet-portrait-${data.mode}.png`;
        a.click();
      }
    } catch {
      toast.error("Failed to download image");
    }
  };

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";

  const tabs = [
    { id: "dashboard" as const, label: t("dashboard.tabDashboard", "Dashboard"), icon: Upload },
    { id: "history" as const, label: t("dashboard.tabHistory", "History"), icon: History },
    { id: "settings" as const, label: t("dashboard.tabSettings", "Settings"), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
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
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                <Crown className="h-3 w-3" /> Premium
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

        <div className="flex-1 p-6 lg:p-10 overflow-auto">
          {hasError && (
            <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/30 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{t("dashboard.loadError", "Something went wrong loading your data. Please try refreshing the page.")}</p>
            </div>
          )}
          <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="max-w-4xl">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                {t("dashboard.welcome", "Welcome")}, {displayName}
              </h2>
              <p className="text-muted-foreground mb-8">{t("dashboard.subtitle", "Create your next pet masterpiece")}</p>

              {/* Plan + Credits card */}
              <div className="rounded-2xl bg-card border border-border shadow-md p-6 mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-muted-foreground">{t("dashboard.creditBalance", "Credit Balance")}</p>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        isPremium
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {isPremium ? "Premium" : t("dashboard.freePlan", "Free Plan")}
                      </span>
                    </div>
                    <p className="font-serif text-4xl font-bold text-foreground">
                      {creditsLoading ? <Skeleton className="h-10 w-16" /> : creditBalance ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("dashboard.creditCosts", "Single: {{single}} credits · Mix: {{mix}} credits", { single: CREDIT_COST_SINGLE, mix: CREDIT_COST_MIX })}
                    </p>
                  </div>
                  {!isPremium ? (
                    <Button className="rounded-full gap-2 shadow-md" onClick={() => setCreditModalOpen(true)}>
                      <Crown className="h-4 w-4" />
                      {t("dashboard.goPremium", "Go Premium — €15")}
                    </Button>
                  ) : (
                    <Button variant="outline" className="rounded-full" asChild>
                      <Link to="/generate">{t("dashboard.createPortrait", "Create Portrait")}</Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Referral card */}
              {profile?.referral_code && (
                <div className="rounded-2xl bg-card border border-border shadow-sm p-6 mb-8">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                        {t("referral.title", "Invite Friends, Earn Credits")}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("referral.desc", "Share your link. Both you and your friend get 150 bonus credits!")}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-full gap-2"
                      onClick={() => {
                        const link = `${window.location.origin}/signup?ref=${profile.referral_code}`;
                        navigator.clipboard.writeText(link);
                        toast.success(t("referral.copied", "Referral link copied!"));
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      {t("referral.copyLink", "Copy Link")}
                    </Button>
                  </div>
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    <div className="px-4 py-2 bg-primary/10 rounded-lg">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{t("referral.yourCode", "Your Code")}</p>
                      <p className="font-mono text-lg font-bold text-primary select-all">{profile.referral_code}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{t("referral.shareCta", "Share this code with friends to earn bonus credits!")}</p>
                  </div>
                  <div className="mt-3 p-3 bg-muted rounded-lg text-sm font-mono text-muted-foreground select-all">
                    {window.location.origin}/signup?ref={profile.referral_code}
                  </div>
                </div>
              )}

              {/* Recent generations */}
              {generationsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
                </div>
              ) : generations && generations.length > 0 ? (
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-4">{t("dashboard.recentPortraits", "Recent Portraits")}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {generations.slice(0, 6).map((gen, i) => (
                      <motion.div
                        key={gen.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        className="aspect-square rounded-2xl bg-card border border-border shadow-sm overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                        onClick={() => openLightbox(gen)}
                      >
                        {gen.storage_path ? (
                          <PortraitThumbnail storagePath={gen.storage_path} alt="Generated portrait" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {gen.status === "failed" ? (
                              <AlertCircle className="h-8 w-8 text-destructive" />
                            ) : (
                              <Skeleton className="w-full h-full" />
                            )}
                          </div>
                        )}
                        {/* HD badge or lock */}
                        {gen.status === "completed" && (
                          <div className="absolute top-2 right-2">
                            {isPremium || gen.is_hd_unlocked ? (
                              <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">HD</span>
                            ) : (
                              <span className="text-[10px] font-medium bg-black/60 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Lock className="h-2.5 w-2.5" /> SD
                              </span>
                            )}
                          </div>
                        )}
                        {gen.status === "completed" && (
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                            <p className="text-xs font-medium text-white truncate">{(gen as any)?.styles?.name || "Portrait"}</p>
                          </div>
                        )}
                        {/* Failed generation — actionable text */}
                        {gen.status === "failed" && (
                          <div className="absolute bottom-0 inset-x-0 p-2 text-center">
                            <p className="text-xs text-destructive font-medium">
                              {t("dashboard.failedRefunded", "Failed — credits refunded")}
                            </p>
                            <Button size="sm" variant="link" className="text-xs h-auto p-0 text-primary" asChild>
                              <Link to="/generate">{t("dashboard.retryGenerate", "Retry")}</Link>
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  {generations.length > 6 && (
                    <div className="text-center mt-6">
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setActiveTab("history")}
                      >
                        {t("dashboard.viewAll", "View all portraits")}
                      </Button>
                    </div>
                  )}
                </div>
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
          )}

          {activeTab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="max-w-4xl">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">{t("dashboard.tabHistory", "History")}</h2>
              <p className="text-muted-foreground mb-8">{t("dashboard.historyDesc", "All your generated portraits")}</p>
              {generationsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
                </div>
              ) : generations && generations.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {generations.map((gen, i) => (
                    <motion.div
                      key={gen.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                      onClick={() => openLightbox(gen)}
                    >
                      <div className="aspect-square relative group">
                        {gen.storage_path ? (
                          <PortraitThumbnail storagePath={gen.storage_path} alt="Portrait" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/50">
                            {gen.status === "failed" ? (
                              <AlertCircle className="h-6 w-6 text-destructive" />
                            ) : (
                              <Skeleton className="w-full h-full" />
                            )}
                          </div>
                        )}
                        {/* HD/Lock badge */}
                        {gen.status === "completed" && (
                          <div className="absolute top-2 right-2">
                            {isPremium || gen.is_hd_unlocked ? (
                              <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">HD</span>
                            ) : (
                              <span className="text-[10px] font-medium bg-black/60 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Lock className="h-2.5 w-2.5" /> SD
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium truncate">{(gen as Record<string, { name?: string }>).styles?.name || "Portrait"}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            gen.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                            gen.status === "failed" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}>
                            {gen.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(gen.created_at).toLocaleDateString()}
                          </span>
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
                    </motion.div>
                  ))}
                </div>
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
          )}

          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="max-w-2xl">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">{t("dashboard.tabSettings", "Settings")}</h2>
              <p className="text-muted-foreground mb-8">{t("dashboard.settingsDesc", "Manage your account")}</p>
              <div className="space-y-6">
                {/* Plan info */}
                <div className="rounded-2xl bg-card border border-border shadow-sm p-6 space-y-4">
                  <h3 className="font-serif text-lg font-semibold">{t("dashboard.plan", "Plan")}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {isPremium ? "Premium" : t("dashboard.freePlan", "Free Plan")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isPremium
                          ? t("dashboard.premiumDesc", "Full HD downloads, no watermark, discounted prints")
                          : t("dashboard.freeDesc", "Watermarked previews, HD unlock at €4.90/image")}
                      </p>
                    </div>
                    {!isPremium && (
                      <Button size="sm" className="rounded-full gap-2 shadow-sm" onClick={() => setCreditModalOpen(true)}>
                        <Crown className="h-3.5 w-3.5" />
                        {t("dashboard.upgrade", "Upgrade")}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Profile */}
                <div className="rounded-2xl bg-card border border-border shadow-sm p-6 space-y-4">
                  <h3 className="font-serif text-lg font-semibold">{t("dashboard.profile", "Profile")}</h3>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("dashboard.displayName", "Display Name")}</Label>
                    {editingName ? (
                      <div className="flex gap-2">
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your name" className="rounded-lg" />
                        <Button size="sm" className="rounded-full" onClick={handleSaveName} disabled={updateProfile.isPending}>
                          {t("dashboard.save", "Save")}
                        </Button>
                        <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setEditingName(false)}>
                          {t("dashboard.cancel", "Cancel")}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{profileLoading ? <Skeleton className="h-4 w-24" /> : displayName}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full"
                          onClick={() => {
                            setEditName(profile?.display_name || "");
                            setEditingName(true);
                          }}
                        >
                          {t("dashboard.edit", "Edit")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Danger zone */}
                <div className="rounded-2xl border border-destructive/30 p-6 space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-destructive">{t("dashboard.dangerZone", "Danger Zone")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.deleteWarning", "Permanently delete your account and all associated data. This action cannot be undone.")}
                  </p>
                  <Button variant="destructive" size="sm" className="rounded-full" onClick={handleDeleteAccount}>
                    {t("dashboard.deleteAccount", "Delete Account")}
                  </Button>
                </div>
              </div>
            </motion.div>
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
    </div>
  );
};

export default Dashboard;
