import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { t } = useTranslation();
  const { session } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowCta(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const navLinkClass =
    "text-sm text-muted-foreground hover:text-primary transition-colors duration-200";

  return (
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
        <Link to="/" className="flex items-center" aria-label="ArtlyPet home">
          <span className="font-serif text-2xl font-bold text-primary">
            ArtlyPet
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={navLinkClass}>
            {t("nav.home", "Home")}
          </Link>
          <Link to="/styles" className={navLinkClass}>
            {t("nav.styles", "Styles")}
          </Link>
          <Link to="/how-it-works" className={navLinkClass}>
            {t("nav.howItWorks", "How It Works")}
          </Link>
          {isHome ? (
            <a href="#pricing" className={navLinkClass}>
              {t("nav.pricing")}
            </a>
          ) : (
            <Link to="/#pricing" className={navLinkClass}>
              {t("nav.pricing")}
            </Link>
          )}

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className={`${navLinkClass} flex items-center gap-1`}
            >
              {t("nav.more", "More")}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-background rounded-xl border border-border shadow-xl py-2 z-50">
                <Link
                  to="/about"
                  className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                  onClick={() => setMoreOpen(false)}
                >
                  {t("nav.about", "About")}
                </Link>
                <Link
                  to="/blog"
                  className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                  onClick={() => setMoreOpen(false)}
                >
                  {t("nav.blog", "Blog")}
                </Link>
                <Link
                  to="/prints"
                  className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                  onClick={() => setMoreOpen(false)}
                >
                  {t("nav.prints", "Prints")}
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                  onClick={() => setMoreOpen(false)}
                >
                  {t("nav.contact", "Contact")}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <LanguageSwitcher />

          <Button variant="outline" asChild className="rounded-full h-10 px-6 text-sm font-medium border-border hover:border-primary hover:text-primary">
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
                <Button asChild className="rounded-full h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground">
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
            to="/"
            className="block text-sm text-muted-foreground hover:text-primary py-3 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.home", "Home")}
          </Link>
          <Link
            to="/styles"
            className="block text-sm text-muted-foreground hover:text-primary py-3 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.styles", "Styles")}
          </Link>
          <Link
            to="/how-it-works"
            className="block text-sm text-muted-foreground hover:text-primary py-3 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.howItWorks", "How It Works")}
          </Link>
          {isHome ? (
            <a
              href="#pricing"
              className="block text-sm text-muted-foreground hover:text-primary py-3 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav.pricing")}
            </a>
          ) : (
            <Link
              to="/#pricing"
              className="block text-sm text-muted-foreground hover:text-primary py-3 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav.pricing")}
            </Link>
          )}
          <Link
            to="/about"
            className="block text-sm text-muted-foreground hover:text-primary py-3 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.about", "About")}
          </Link>
          <Link
            to="/blog"
            className="block text-sm text-muted-foreground hover:text-primary py-3 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.blog", "Blog")}
          </Link>
          <Link
            to="/prints"
            className="block text-sm text-muted-foreground hover:text-primary py-3 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.prints", "Prints")}
          </Link>
          <Link
            to="/contact"
            className="block text-sm text-muted-foreground hover:text-primary py-3 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.contact", "Contact")}
          </Link>
          <div className="flex items-center justify-between pt-4 pb-2">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex flex-col gap-3 pt-3">
            <Button variant="outline" asChild className="rounded-full h-12 w-full text-sm font-medium border-border">
              <Link to="/login">{t("nav.signIn")}</Link>
            </Button>
            <Button asChild className="rounded-full h-12 w-full text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/signup">{t("nav.getStarted")}</Link>
            </Button>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
