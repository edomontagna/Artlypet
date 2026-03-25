import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Instagram } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";

const FooterSection = () => {
  const { t } = useTranslation();

  const linkClass =
    "text-sm text-muted-foreground hover:text-primary transition-colors duration-200";

  return (
    <footer
      className="py-20 border-t border-border bg-background"
      role="contentinfo"
    >
      <div className="container px-6 lg:px-8">
        <div className="mb-12 pb-12 border-b border-border">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">{t("footer.newsletterTitle", "Get Pet Art Tips & Exclusive Offers")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("footer.newsletterDesc", "Join 5,000+ pet lovers. No spam, unsubscribe anytime.")}</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder", "your@email.com")}
                className="flex-1 h-10 px-4 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" className="btn-press rounded-full h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground">
                {t("footer.subscribe", "Subscribe")}
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Logo + Description */}
          <div className="space-y-4">
            <Link
              to="/"
              className="font-serif text-xl font-bold text-primary"
            >
              Artly<span className="text-foreground">Pet</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "footer.description",
                "Luxury AI pet portraits crafted with cutting-edge technology and artistic excellence."
              )}
            </p>
            <LanguageSwitcher variant="outline" />
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="font-serif text-sm font-bold text-foreground mb-4">
              {t("footer.product", "Product")}
            </h3>
            <nav className="flex flex-col gap-3">
              <Link to="/styles" className={linkClass}>
                {t("nav.styles", "Styles")}
              </Link>
              <a href="/#pricing" className={linkClass}>
                {t("nav.pricing")}
              </a>
              <Link to="/prints" className={linkClass}>
                {t("nav.prints", "Prints")}
              </Link>
              <Link to="/signup" className={linkClass}>
                {t("footer.createPortrait", "Create Portrait")}
              </Link>
            </nav>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="font-serif text-sm font-bold text-foreground mb-4">
              {t("footer.company", "Company")}
            </h3>
            <nav className="flex flex-col gap-3">
              <Link to="/about" className={linkClass}>
                {t("nav.about", "About")}
              </Link>
              <Link to="/blog" className={linkClass}>
                {t("nav.blog", "Blog")}
              </Link>
              <Link to="/contact" className={linkClass}>
                {t("nav.contact", "Contact")}
              </Link>
              <Link to="/business" className={linkClass}>
                {t("footer.business", "Business")}
              </Link>
            </nav>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="font-serif text-sm font-bold text-foreground mb-4">
              {t("footer.legal", "Legal")}
            </h3>
            <nav className="flex flex-col gap-3">
              <Link to="/privacy" className={linkClass}>
                {t("footer.privacy")}
              </Link>
              <Link to="/terms" className={linkClass}>
                {t("footer.terms")}
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Artlypet.{" "}
            {t("footer.allRights", "All rights reserved.")}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.21 8.21 0 0 0 4.76 1.52V6.76a4.82 4.82 0 0 1-1-.07z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
