import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Menu, X, Sun, Moon, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { safeGetItem, safeSetItem } from "@/lib/storage";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { BrandMark } from "@/components/ui/brand-mark";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const ease = [0.16, 1, 0.3, 1] as const;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleHashNavigation = useCallback(
    (hash: string) => {
      if (location.pathname === "/") {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    },
    [location.pathname, navigate],
  );

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    // Source of truth = the class set by the index.html bootstrap script
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    safeSetItem("artlypet-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, [theme]);

  // Active route -> primary, otherwise muted with subtle dock-style scale on hover
  const navLinkClass = (path: string) =>
    `relative inline-flex items-center text-sm transition-all duration-300 origin-center hover:scale-[1.04] ${
      location.pathname === path
        ? "text-foreground font-semibold"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <>
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-refraction border-b border-border/60"
            : "bg-transparent border-b border-transparent"
        }`}
        role="navigation"
        aria-label={t("nav.aria", "Main navigation")}
      >
        <div className="container mx-auto flex items-center justify-between h-16 lg:h-[72px] px-6 lg:px-10">
          {/* Logo — SVG inline so it reads on any theme */}
          <Link to="/" aria-label="Artlypet home">
            <BrandMark />
          </Link>

          {/* Desktop nav — dock-style with subtle scale on hover */}
          <div className="hidden md:flex items-center gap-9">
            <Link to="/styles" className={navLinkClass("/styles")}>
              {t("nav.styles", "Stili")}
            </Link>
            <Link to="/how-it-works" className={navLinkClass("/how-it-works")}>
              {t("nav.howItWorks", "Come funziona")}
            </Link>
            <button onClick={() => handleHashNavigation("pricing")} className={navLinkClass("")}>
              {t("nav.pricing", "Prezzi")}
            </button>
            <Link to="/business" className={navLinkClass("/business")}>
              {t("nav.business", "Per aziende")}
            </Link>
            <button onClick={() => handleHashNavigation("faq")} className={navLinkClass("")}>
              {t("nav.faq", "FAQ")}
            </button>
          </div>

          {/* Right cluster */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all btn-press"
              aria-label={theme === "light" ? t("nav.darkMode", "Switch to dark") : t("nav.lightMode", "Switch to light")}
            >
              {theme === "light" ? <Moon className="h-4 w-4" strokeWidth={1.75} /> : <Sun className="h-4 w-4" strokeWidth={1.75} />}
            </button>

            {!session && (
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3">
                {t("nav.signIn", "Sign in")}
              </Link>
            )}

            <Link to={session ? "/generate" : "/signup"} className="rounded-full" tabIndex={-1}>
              <MagneticButton
                className="rounded-full h-10 px-5 text-sm font-semibold bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors"
                strength={0.28}
              >
                <span>{session ? t("nav.openStudio", "Open studio") : t("nav.getStarted", "Get started")}</span>
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
              </MagneticButton>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors btn-press"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("nav.closeMenu", "Close menu") : t("nav.openMenu", "Open menu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Gold scroll progress strip — always at the very bottom edge */}
        <ScrollProgress />

        {/* Mobile sheet */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-6 py-6"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                className="flex flex-col gap-1"
              >
                {[
                  { to: "/styles", label: t("nav.styles", "Styles") },
                  { to: "/how-it-works", label: t("nav.howItWorks", "How it works") },
                  { to: "/business", label: t("nav.business", "For business") },
                ].map((link) => (
                  <motion.div
                    key={link.to}
                    variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-3.5 text-base font-medium text-foreground border-b border-border/40"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                    </Link>
                  </motion.div>
                ))}
                <motion.button
                  variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
                  onClick={() => {
                    handleHashNavigation("pricing");
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-between py-3.5 text-base font-medium text-foreground border-b border-border/40 w-full text-left"
                >
                  <span>{t("nav.pricing", "Pricing")}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                </motion.button>
                <motion.button
                  variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
                  onClick={() => {
                    handleHashNavigation("faq");
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-between py-3.5 text-base font-medium text-foreground border-b border-border/40 w-full text-left"
                >
                  <span>{t("nav.faq", "FAQ")}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                </motion.button>
              </motion.div>

              <div className="mt-6 flex flex-col gap-2.5">
                {!session && (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center rounded-full h-12 border border-border text-sm font-medium text-foreground btn-press"
                  >
                    {t("nav.signIn", "Sign in")}
                  </Link>
                )}
                <Link
                  to={session ? "/generate" : "/signup"}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full h-12 bg-foreground text-background text-sm font-semibold btn-press"
                >
                  <span>{session ? t("nav.openStudio", "Open studio") : t("nav.getStarted", "Get started")}</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                </Link>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <LanguageSwitcher />
                <button
                  onClick={toggleTheme}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
