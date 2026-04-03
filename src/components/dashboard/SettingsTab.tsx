import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Loader2, Sun, Moon, Monitor, Globe, Shield, FileText, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useCreditTransactions } from "@/hooks/useCredits";

interface SettingsTabProps {
  profile: {
    display_name?: string | null;
    plan_type?: string;
    created_at?: string;
    [key: string]: unknown;
  } | null | undefined;
  profileLoading: boolean;
  user: { email?: string } | null;
  isPremium: boolean;
  displayName: string;
  updateProfile: {
    mutateAsync: (data: { display_name: string }) => Promise<{ error?: unknown }>;
    isPending: boolean;
  };
  setCreditModalOpen: (v: boolean) => void;
  onDeleteAccount: () => void;
  deletingAccount: boolean;
}

export const SettingsTab = ({
  profile,
  profileLoading,
  user,
  isPremium,
  displayName,
  updateProfile,
  setCreditModalOpen,
  onDeleteAccount,
  deletingAccount,
}: SettingsTabProps) => {
  const { t, i18n } = useTranslation();
  const [editName, setEditName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(() => {
    const stored = localStorage.getItem("artlypet-theme");
    if (stored === "dark" || stored === "light") return stored;
    return "system";
  });

  const { data: transactions } = useCreditTransactions();

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

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    setThemeState(newTheme);
    localStorage.setItem("artlypet-theme", newTheme);
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "it", label: "Italiano" },
    { code: "de", label: "Deutsch" },
    { code: "fr", label: "Fran\u00e7ais" },
    { code: "es", label: "Espa\u00f1ol" },
  ];

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="max-w-3xl"
    >
      <h2 className="font-serif text-3xl font-bold text-foreground mb-2">{t("dashboard.tabSettings", "Settings")}</h2>
      <p className="text-muted-foreground mb-8">{t("dashboard.settingsDesc", "Manage your account")}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          {/* Plan info */}
          <div className="rounded-2xl bg-card border border-border shadow-sm p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold flex items-center gap-2">
              {isPremium && <Crown className="h-4 w-4 text-primary" />}
              {t("dashboard.plan", "Plan")}
            </h3>
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
                    onClick={() => { setEditName(profile?.display_name || ""); setEditingName(true); }}
                  >
                    {t("dashboard.edit", "Edit")}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="rounded-2xl bg-card border border-border shadow-sm p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold">{t("settings.preferences", "Preferences")}</h3>

            {/* Theme */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Sun className="h-3.5 w-3.5" />
                {t("settings.theme", "Theme")}
              </Label>
              <div className="flex gap-2">
                {([
                  { value: "light" as const, icon: <Sun className="h-3.5 w-3.5" />, label: t("settings.themeLight", "Light") },
                  { value: "dark" as const, icon: <Moon className="h-3.5 w-3.5" />, label: t("settings.themeDark", "Dark") },
                  { value: "system" as const, icon: <Monitor className="h-3.5 w-3.5" />, label: t("settings.themeSystem", "System") },
                ]).map(({ value, icon, label }) => (
                  <Button
                    key={value}
                    variant={theme === value ? "default" : "outline"}
                    size="sm"
                    className="rounded-full gap-1.5 text-xs"
                    onClick={() => applyTheme(value)}
                  >
                    {icon}
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                {t("settings.language", "Language")}
              </Label>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={i18n.language === lang.code ? "default" : "outline"}
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => i18n.changeLanguage(lang.code)}
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* Credit History */}
          <div className="rounded-2xl bg-card border border-border shadow-sm p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              {t("settings.creditHistory", "Credit History")}
            </h3>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transactions.slice(0, 10).map((tx: { id: string; type: string; amount: number; created_at: string }) => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium capitalize">{tx.type.replace(/_/g, " ")}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-sm font-semibold ${tx.amount > 0 ? "text-green-600 dark:text-green-400" : "text-foreground"}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("settings.noTransactions", "No transactions yet")}</p>
            )}
          </div>

          {/* Data & Privacy */}
          <div className="rounded-2xl bg-card border border-border shadow-sm p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {t("settings.dataPrivacy", "Data & Privacy")}
            </h3>
            <div className="space-y-2">
              <Link to="/privacy" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <FileText className="h-3.5 w-3.5" />
                {t("footer.privacy", "Privacy Policy")}
              </Link>
              <Link to="/terms" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <FileText className="h-3.5 w-3.5" />
                {t("footer.terms", "Terms of Service")}
              </Link>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-destructive/30 p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-destructive">{t("dashboard.dangerZone", "Danger Zone")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.deleteWarning", "Permanently delete your account and all associated data. This action cannot be undone.")}
            </p>
            <Button variant="destructive" size="sm" className="rounded-full" onClick={onDeleteAccount} disabled={deletingAccount}>
              {deletingAccount && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {deletingAccount ? t("dashboard.deletingAccount", "Deleting...") : t("dashboard.deleteAccount", "Delete Account")}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
