import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Menu, X } from "lucide-react";

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
  }, [theme]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b"
          : "border-b border-transparent"
      }`}
      style={{
        background: scrolled ? "var(--surface)" : "transparent",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center" aria-label="Artlypet home">
          <span className="font-serif text-2xl font-light tracking-tight" style={{ color: "var(--text)" }}>
            Artly<span className="logo-accent">Pet</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <a
            href="#gallery"
            className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase transition-colors duration-300"
            style={{ color: "var(--muted)" }}
          >
            {t("nav.gallery")}
          </a>
          <a
            href="#pricing"
            className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase transition-colors duration-300"
            style={{ color: "var(--muted)" }}
          >
            {t("nav.pricing")}
          </a>
          <a
            href="#faq"
            className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase transition-colors duration-300"
            style={{ color: "var(--muted)" }}
          >
            {t("nav.faq")}
          </a>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center border transition-colors duration-300"
            style={{
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            <span className="text-sm">{theme === "light" ? "\u263D" : "\u2600"}</span>
          </button>

          <LanguageSwitcher />

          <Button variant="ghost" asChild className="text-[0.72rem] tracking-[0.14em] uppercase font-semibold">
            <Link to="/login">{t("nav.signIn")}</Link>
          </Button>

          <Link to="/signup" className="btn-editorial">
            {t("nav.getStarted")}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          style={{ color: "var(--text)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-6 py-6 space-y-1"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <a
            href="#gallery"
            className="block text-[0.72rem] font-semibold tracking-[0.18em] uppercase py-3"
            style={{ color: "var(--muted)" }}
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.gallery")}
          </a>
          <a
            href="#pricing"
            className="block text-[0.72rem] font-semibold tracking-[0.18em] uppercase py-3"
            style={{ color: "var(--muted)" }}
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.pricing")}
          </a>
          <a
            href="#faq"
            className="block text-[0.72rem] font-semibold tracking-[0.18em] uppercase py-3"
            style={{ color: "var(--muted)" }}
            onClick={() => setMobileOpen(false)}
          >
            {t("nav.faq")}
          </a>
          <div className="flex items-center justify-between pt-4 pb-2">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center border"
              style={{
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            >
              <span className="text-sm">{theme === "light" ? "\u263D" : "\u2600"}</span>
            </button>
          </div>
          <div className="flex flex-col gap-3 pt-3">
            <Link
              to="/login"
              className="btn-editorial btn-outline-editorial w-full text-center"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              to="/signup"
              className="btn-editorial w-full text-center"
            >
              {t("nav.getStarted")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
