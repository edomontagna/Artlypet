import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Instagram, Twitter, Facebook } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { BrandMark } from "@/components/ui/brand-mark";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const socialLinks = [
  { Icon: Instagram, href: "https://instagram.com/artlypet", label: "Instagram" },
  { Icon: Twitter,   href: "https://x.com/artlypet",         label: "X (Twitter)" },
  { Icon: Facebook,  href: "https://facebook.com/artlypet",  label: "Facebook" },
  { Icon: TikTokIcon, href: "https://tiktok.com/@artlypet",  label: "TikTok" },
];

const FooterSection = () => {
  const { t } = useTranslation();

  const link = "text-sm text-muted-foreground hover:text-foreground transition-colors duration-200";

  // Marquee tape — 12 styles, repeated for seamless loop
  const styleTape = [
    "Renaissance", "Watercolor", "Pop Art", "Art Nouveau", "Impressionist", "Oil Painting",
    "Anime Hero", "Victorian Noble", "The General", "Minimalist Line", "Cyberpunk", "Cubist",
  ];

  return (
    <footer className="relative bg-navy text-navy-foreground overflow-hidden" role="contentinfo">
      {/* Kinetic marquee — 12 styles streaming horizontally */}
      <div className="border-b border-white/10 marquee-pause overflow-hidden py-7" aria-hidden>
        <div className="marquee-track gap-12 whitespace-nowrap">
          {[...styleTape, ...styleTape].map((s, i) => (
            <span
              key={i}
              className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-white/30 hover:text-primary transition-colors duration-300"
            >
              {s} <span className="text-primary/40 mx-3">·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container px-6 lg:px-10 py-20 lg:py-24">

        {/* Top — large CTA block, asymmetric */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end pb-16 lg:pb-20 border-b border-white/10">
          <div className="lg:col-span-8">
            <div className="font-mono tabular text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-4">
              {t("footer.kicker", "Ultima chiamata prima di scrollare su")}
            </div>
            <h3
              className="font-bold tracking-tightest leading-[1.02] text-white"
              style={{
                fontFamily: "'Cabinet Grotesk', system-ui, sans-serif",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
              }}
            >
              {t("footer.ctaTitle", "Il tuo cane, in cornice. ")}
              <span className="text-primary">{t("footer.ctaTitleAccent", "In meno di un minuto.")}</span>
            </h3>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Link to="/signup" className="rounded-full" tabIndex={-1}>
              <MagneticButton
                className="rounded-full h-14 px-8 text-base font-semibold bg-primary text-primary-foreground shadow-tinted btn-press"
                strength={0.32}
              >
                <span>{t("nav.getStarted", "Inizia gratis")}</span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
              </MagneticButton>
            </Link>
          </div>
        </div>

        {/* Mid — asymmetric link grid: brand 5/12 + columns 7/12 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 pt-16 lg:pt-20">

          {/* Brand block (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" aria-label="Artlypet home" className="text-white">
              <BrandMark />
            </Link>

            <p className="text-sm text-white/60 leading-relaxed max-w-[42ch]">
              {t(
                "footer.description",
                "Ritratti AI del tuo animale, in dodici stili di pittura dipinti a mano. Server in EU, GDPR-clean, pronti per la stampa su tela.",
              )}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-primary hover:border-primary/50 transition-colors btn-press"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="pt-2">
              <LanguageSwitcher variant="outline" />
            </div>
          </div>

          {/* Right — 3 stacked compact columns within 7/12 */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-5">
                {t("footer.product", "Prodotto")}
              </div>
              <nav className="flex flex-col gap-3.5">
                <Link to="/styles" className={link}>{t("nav.styles", "Stili")}</Link>
                <a href="/#pricing" className={link}>{t("nav.pricing", "Prezzi")}</a>
                <Link to="/prints" className={link}>{t("nav.prints", "Stampe su tela")}</Link>
                <Link to="/how-it-works" className={link}>{t("nav.howItWorks", "Come funziona")}</Link>
                <Link to="/business" className={link}>{t("footer.business", "Per aziende")}</Link>
              </nav>
            </div>

            <div>
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-5">
                {t("footer.company", "Azienda")}
              </div>
              <nav className="flex flex-col gap-3.5">
                <Link to="/about" className={link}>{t("nav.about", "Chi siamo")}</Link>
                <Link to="/contact" className={link}>{t("nav.contact", "Contatti")}</Link>
                <Link to="/blog" className={link}>{t("nav.blog", "Blog")}</Link>
              </nav>
            </div>

            <div>
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-5">
                {t("footer.legal", "Legale")}
              </div>
              <nav className="flex flex-col gap-3.5">
                <Link to="/privacy" className={link}>{t("footer.privacy", "Privacy")}</Link>
                <Link to="/terms" className={link}>{t("footer.terms", "Termini")}</Link>
                <Link to="/accessibility" className={link}>{t("footer.accessibility", "Accessibilità")}</Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/40 font-mono tabular">
            © {new Date().getFullYear()} Artlypet · {t("footer.allRights", "Tutti i diritti riservati.")}
          </p>
          <p className="text-xs text-white/40">
            {t("footer.locationLine", "Made in Italy · Server in EU · GDPR-clean")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
