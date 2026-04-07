import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { safeGetItem, safeSetItem } from "@/lib/storage";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const { t } = useTranslation();
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleHashNavigation = useCallback((hash: string) => {
    if (location.pathname === "/") {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.pathname, navigate]);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = safeGetItem("artlypet-theme");
      // Respect "system" setting from dashboard Settings tab
      if (stored === "system" || !stored) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return stored as "light" | "dark";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        setShowCta(window.scrollY > 600);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { window.removeEventListener("scroll", handleScroll); cancelAnimationFrame(rafId); };
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    safeSetItem("artlypet-theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const navLinkClass = (path: string) =>
    `text-sm transition-colors duration-300 ${
      location.pathname === path
        ? "text-primary font-semibold"
        : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <>
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="ArtlyPet home">
          <img src="/icons/icon.svg" alt="" className="h-8 w-8 rounded-lg" aria-hidden="true" />
          <span className="font-serif text-2xl font-bold text-primary">
            ArtlyPet
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/styles" className={navLinkClass("/styles")}>
            {t("nav.styles", "Styles")}
          </Link>
          <Link to="/how-it-works" className={navLinkClass("/how-it-works")}>
            {t("nav.howItWorks", "How It Works")}
          </Link>
          <button
            onClick={() => handleHashNavigation("pricing")}
            className={navLinkClass("")}
          >
            {t("nav.pricing")}
          </button>
          <button
            onClick={() => handleHashNavigation("faq")}
            className={navLinkClass("")}
          >
            {t("nav.faq", "FAQ")}
          </button>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" asChild className="rounded-full h-11 px-6 text-sm font-medium border-border hover:border-primary hover:text-primary">
            <Link to="/login">{t("nav.signIn")}</Link>
          </Button>

          <AnimatePresence mode="wait">
            {showCta && !session ? (
              <motion.div key="sticky-cta" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Button className="rounded-full shimmer-btn btn-press text-primary-foreground" size="sm" asChild>
                  <Link to="/signup">{t("nav.getStarted", "Get Started")}</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div key="default-cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button asChild className="rounded-full h-11 px-6 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link to="/signup">{t("nav.getStarted")}</Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg px-6 py-6 space-y-1">
          <Link
            to="/styles"
            className={`block py-3 ${navLinkClass("/styles")}`}
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.styles", "Styles")}
          </Link>
          <Link
            to="/how-it-works"
            className={`block py-3 ${navLinkClass("/how-it-works")}`}
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.howItWorks", "How It Works")}
          </Link>
          <button
            onClick={() => { handleHashNavigation("pricing"); setMobileOpen(false); }}
            className={`block py-3 w-full text-left ${navLinkClass("")}`}
          >
            {t("nav.pricing")}
          </button>
          <div className="flex flex-col gap-3 pt-3">
            <Button variant="outline" asChild className="rounded-full h-12 w-full text-sm font-medium border-border">
              <Link to="/login">{t("nav.signIn")}</Link>
            </Button>
            <Button asChild className="rounded-full h-12 w-full text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/signup">{t("nav.getStarted")}</Link>
            </Button>
          </div>
          <div className="border-t border-border mt-3 pt-4 flex items-center justify-between">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </motion.nav>
    </>
  );
};

export default Navbar;
