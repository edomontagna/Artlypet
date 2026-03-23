import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const FooterSection = () => {
  const { t } = useTranslation();

  return (
    <footer
      className="py-12 border-t border-border bg-background"
      role="contentinfo"
    >
      <div className="container px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Logo + Language */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="font-serif text-xl font-bold text-primary"
            >
              Artly<span className="text-foreground">Pet</span>
            </Link>
            <LanguageSwitcher variant="outline" />
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {t("footer.terms")}
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Artlypet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
