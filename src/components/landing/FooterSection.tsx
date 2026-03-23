import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Instagram } from "lucide-react";
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
            <div className="flex items-center gap-3">
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
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.21 8.21 0 0 0 4.76 1.52V6.76a4.82 4.82 0 0 1-1-.07z" />
                </svg>
              </a>
            </div>
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
