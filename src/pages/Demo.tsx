import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Upload, History, Settings, Crown, Sparkles, Download, ImageIcon, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEMO_USER = {
  displayName: "Alex Demo",
  email: "alex@demo.artlypet.com",
  creditBalance: 7,
};

const DEMO_GENERATIONS = [
  { id: "1", status: "completed" as const, storage_path: "/images/oil-painting.jpg", style: "Oil Painting", created_at: "2026-02-25T10:00:00Z" },
  { id: "2", status: "completed" as const, storage_path: "/images/watercolor.webp", style: "Watercolor", created_at: "2026-02-24T14:30:00Z" },
  { id: "3", status: "completed" as const, storage_path: "/images/pop-art.webp", style: "Pop Art", created_at: "2026-02-23T09:15:00Z" },
  { id: "4", status: "completed" as const, storage_path: "/images/renaissance.webp", style: "Renaissance", created_at: "2026-02-22T16:45:00Z" },
  { id: "5", status: "completed" as const, storage_path: "/images/art-nouveau.webp", style: "Art Nouveau", created_at: "2026-02-21T11:20:00Z" },
  { id: "6", status: "completed" as const, storage_path: "/images/impressionist.webp", style: "Impressionist", created_at: "2026-02-20T08:00:00Z" },
];

const Demo = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"dashboard" | "history" | "settings">("dashboard");

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: Upload },
    { id: "history" as const, label: "History", icon: History },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Demo banner */}
      <div className="fixed top-0 inset-x-0 z-50 bg-primary text-primary-foreground text-center text-xs py-1.5 font-medium">
        Demo Mode — This is a preview with sample data.{" "}
        <Link to="/signup" className="underline">Create a real account</Link>
      </div>

      {/* Left sidebar */}
      <aside className="hidden lg:flex w-56 border-r border-border flex-col mt-7">
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
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{DEMO_USER.displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{DEMO_USER.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" asChild>
            <Link to="/">
              <LogOut className="h-4 w-4" />
              Exit Demo
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col mt-7">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-8">
          <h1 className="font-serif text-xl font-bold text-gradient-gold lg:hidden">Artlypet</h1>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">{DEMO_USER.creditBalance} credits</span>
            </div>
            <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/30 text-primary hover:bg-primary/5" asChild>
              <Link to="/signup">
                <Crown className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Create Portrait</span>
              </Link>
            </Button>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 p-6 lg:p-10 overflow-auto">
          {activeTab === "dashboard" && (
            <div className="max-w-4xl">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                Welcome, {DEMO_USER.displayName}
              </h2>
              <p className="text-muted-foreground mb-8">Create your next pet masterpiece</p>

              {/* Credits card */}
              <div className="p-6 rounded-xl bg-card border border-border shadow-luxury mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Credit Balance</p>
                    <p className="font-serif text-4xl font-bold text-foreground">{DEMO_USER.creditBalance}</p>
                  </div>
                  <Button className="rounded-full" asChild>
                    <Link to="/signup">Buy Credits</Link>
                  </Button>
                </div>
              </div>

              {/* Recent generations */}
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Recent Portraits</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {DEMO_GENERATIONS.map((gen) => (
                    <div key={gen.id} className="aspect-square rounded-xl bg-card border border-border overflow-hidden relative group">
                      <img
                        src={gen.storage_path}
                        alt={`${gen.style} portrait`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" variant="secondary" className="rounded-full gap-1">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="max-w-4xl">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">History</h2>
              <p className="text-muted-foreground mb-8">All your generated portraits</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {DEMO_GENERATIONS.map((gen) => (
                  <div key={gen.id} className="rounded-xl bg-card border border-border overflow-hidden">
                    <div className="aspect-square relative group">
                      <img src={gen.storage_path} alt={gen.style} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{gen.style}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
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
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Settings</h2>
              <p className="text-muted-foreground mb-8">Manage your account</p>
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-card border border-border space-y-4">
                  <h3 className="font-serif text-lg font-semibold">Profile</h3>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{DEMO_USER.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{DEMO_USER.displayName}</p>
                      <Button size="sm" variant="ghost">Edit</Button>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-destructive/30 space-y-4">
                  <h3 className="font-serif text-lg font-semibold text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm" disabled>
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden border-t border-border flex mb-[72px]" aria-label="Dashboard navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Sticky CTA bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{t("demo.ctaTitle", "Ready to create your own?")}</p>
          <p className="text-xs text-muted-foreground">{t("demo.ctaSub", "3 free portraits, no card needed")}</p>
        </div>
        <Button asChild className="rounded-full shimmer-btn btn-press text-primary-foreground">
          <Link to="/signup">
            {t("nav.getStarted", "Get Started")} <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Demo;
