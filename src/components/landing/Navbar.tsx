import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
          <a
            href="#gallery"
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            {t("nav.gallery")}
          </a>
          <a
            href="#pricing"
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            {t("nav.pricing")}
          </a>
          <a
            href="#faq"
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            {t("nav.faq")}
          </a>
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

          <Button asChild className="rounded-full h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/signup">{t("nav.getStarted")}</Link>
          </Button>
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
          <a
            href="#gallery"
            className="block text-sm text-muted-foreground hover:text-primary py-3 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.gallery")}
          </a>
          <a
            href="#pricing"
            className="block text-sm text-muted-foreground hover:text-primary py-3 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.pricing")}
          </a>
          <a
            href="#faq"
            className="block text-sm text-muted-foreground hover:text-primary py-3 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.faq")}
          </a>
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
