import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Upload, History, Settings, Crown, Sparkles, Download, AlertCircle, Lock, Image as ImageIcon } from "lucide-react";
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
import { useTranslation } from "react-i18next";
import { CREDIT_COST_SINGLE, CREDIT_COST_MIX } from "@/lib/constants";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"dashboard" | "history" | "settings">("dashboard");
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: creditBalance, isLoading: creditsLoading } = useCreditBalance();
  const { data: generations, isLoading: generationsLoading } = useGenerations();
  const updateProfile = useUpdateProfile();

  const [editName, setEditName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);

  const isPremium = profile?.plan_type === "premium" || profile?.plan_type === "business";

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
      toast.error("Failed to update name");
    } else {
      toast.success("Name updated");
      setEditingName(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.")) return;
    await supabase.from("audit_log").insert({
      user_id: user?.id,
      event_type: "account_deleted" as const,
      metadata: { requested_at: new Date().toISOString() },
    });
    await signOut();
    toast.success("Account deletion requested. Your data will be removed shortly.");
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
      <aside className="hidden lg:flex w-56 border-r border-border flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="font-serif text-xl font-bold text-gradient-gold">Artlypet</Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left w-full ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
                <p className="text-sm font-medium truncate">{displayName}</p>
                {isPremium && <Crown className="h-3 w-3 text-primary flex-shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            {t("dashboard.signOut", "Sign Out")}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-8">
          <h1 className="font-serif text-xl font-bold text-gradient-gold lg:hidden">Artlypet</h1>
          <div className="flex items-center gap-3 ml-auto">
            {isPremium && (
              <span className="flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                <Crown className="h-3 w-3" /> Premium
              </span>
            )}
            <div className="flex items-center gap-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {creditsLoading ? <Skeleton className="h-4 w-8 inline-block" /> : creditBalance ?? 0} {t("dashboard.credits", "credits")}
              </span>
            </div>
            <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/30 text-primary hover:bg-primary/5" asChild>
              <Link to="/generate">
                <ImageIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("dashboard.createPortrait", "Create Portrait")}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sign out" className="lg:hidden">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 overflow-auto">
          {activeTab === "dashboard" && (
            <div className="max-w-4xl">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                {t("dashboard.welcome", "Welcome")}, {displayName}
              </h2>
              <p className="text-muted-foreground mb-8">{t("dashboard.subtitle", "Create your next pet masterpiece")}</p>

              {/* Plan + Credits card */}
              <div className="p-6 rounded-xl bg-card border border-border shadow-luxury mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-muted-foreground">{t("dashboard.creditBalance", "Credit Balance")}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
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
                    <Button className="rounded-full gap-2" onClick={() => setCreditModalOpen(true)}>
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

              {/* Recent generations */}
              {generationsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
                </div>
              ) : generations && generations.length > 0 ? (
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-4">{t("dashboard.recentPortraits", "Recent Portraits")}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {generations.slice(0, 6).map((gen) => (
                      <div key={gen.id} className="aspect-square rounded-xl bg-card border border-border overflow-hidden relative group">
                        {gen.storage_path ? (
                          <img
                            src={gen.storage_path}
                            alt="Generated portrait"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
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
                        {/* Hover overlay */}
                        {gen.status === "completed" && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="sm" variant="secondary" className="rounded-full gap-1" onClick={() => handleDownload(gen)}>
                              <Download className="h-3 w-3" />
                              {t("dashboard.download", "Download")}
                            </Button>
                            {!isPremium && !gen.is_hd_unlocked && (
                              <Button size="sm" className="rounded-full gap-1" onClick={() => handleUnlockHd(gen.id)}>
                                <Lock className="h-3 w-3" />
                                HD €4.90
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-border rounded-xl bg-card/50">
                  <Upload className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{t("dashboard.noPortraits", "No portraits yet")}</h3>
                  <p className="text-muted-foreground mb-6">{t("dashboard.noPortraitsDesc", "Upload a photo to get started")}</p>
                  <Button className="rounded-full" asChild>
                    <Link to="/generate">{t("dashboard.uploadPhoto", "Upload Photo")}</Link>
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="max-w-4xl">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">{t("dashboard.tabHistory", "History")}</h2>
              <p className="text-muted-foreground mb-8">{t("dashboard.historyDesc", "All your generated portraits")}</p>
              {generationsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
                </div>
              ) : generations && generations.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {generations.map((gen) => (
                    <div key={gen.id} className="rounded-xl bg-card border border-border overflow-hidden">
                      <div className="aspect-square relative group">
                        {gen.storage_path ? (
                          <img src={gen.storage_path} alt="Portrait" className="w-full h-full object-cover" loading="lazy" />
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
                        {gen.status === "completed" && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="sm" variant="secondary" className="rounded-full gap-1" onClick={() => handleDownload(gen)}>
                              <Download className="h-3 w-3" />
                            </Button>
                            {!isPremium && !gen.is_hd_unlocked && (
                              <Button size="sm" className="rounded-full gap-1" onClick={() => handleUnlockHd(gen.id)}>
                                <Lock className="h-3 w-3" /> HD
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium truncate">{(gen as Record<string, { name?: string }>).styles?.name || "Portrait"}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            gen.status === "completed" ? "bg-green-100 text-green-700" :
                            gen.status === "failed" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {gen.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(gen.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-border rounded-xl bg-card/50">
                  <History className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{t("dashboard.noHistory", "No history yet")}</h3>
                  <p className="text-muted-foreground">{t("dashboard.noHistoryDesc", "Your generated portraits will appear here")}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">{t("dashboard.tabSettings", "Settings")}</h2>
              <p className="text-muted-foreground mb-8">{t("dashboard.settingsDesc", "Manage your account")}</p>
              <div className="space-y-6">
                {/* Plan info */}
                <div className="p-6 rounded-xl bg-card border border-border space-y-4">
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
                      <Button size="sm" className="rounded-full gap-2" onClick={() => setCreditModalOpen(true)}>
                        <Crown className="h-3.5 w-3.5" />
                        {t("dashboard.upgrade", "Upgrade")}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Profile */}
                <div className="p-6 rounded-xl bg-card border border-border space-y-4">
                  <h3 className="font-serif text-lg font-semibold">{t("dashboard.profile", "Profile")}</h3>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("dashboard.displayName", "Display Name")}</Label>
                    {editingName ? (
                      <div className="flex gap-2">
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your name" />
                        <Button size="sm" onClick={handleSaveName} disabled={updateProfile.isPending}>
                          {t("dashboard.save", "Save")}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingName(false)}>
                          {t("dashboard.cancel", "Cancel")}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{profileLoading ? <Skeleton className="h-4 w-24" /> : displayName}</p>
                        <Button
                          size="sm"
                          variant="ghost"
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
                <div className="p-6 rounded-xl border border-destructive/30 space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-destructive">{t("dashboard.dangerZone", "Danger Zone")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.deleteWarning", "Permanently delete your account and all associated data. This action cannot be undone.")}
                  </p>
                  <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                    {t("dashboard.deleteAccount", "Delete Account")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden border-t border-border flex" aria-label="Dashboard navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <CreditPurchaseModal open={creditModalOpen} onOpenChange={setCreditModalOpen} />
    </div>
  );
};

export default Dashboard;
