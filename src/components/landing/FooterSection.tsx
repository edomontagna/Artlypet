import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
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
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">{t("footer.ctaTitle", "Ready to Transform Your Pet?")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("footer.ctaDesc", "Create stunning AI portraits of your pet in seconds. Free to start.")}</p>
            <Button asChild className="btn-press rounded-full h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/signup">
                {t("nav.getStarted", "Get Started")} <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
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
        <div className="mt-12 pt-6 border-t border-border text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Artlypet.{" "}
            {t("footer.allRights", "All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
