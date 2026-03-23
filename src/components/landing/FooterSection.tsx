import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const FooterSection = () => {
  const { t } = useTranslation();

  return (
    <footer
      className="border-t"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
      role="contentinfo"
    >
      <div className="container px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + Language */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="font-serif text-2xl font-light tracking-tight"
              style={{ color: "var(--text)" }}
            >
              Artly<span className="logo-accent">Pet</span>
            </Link>
            <LanguageSwitcher variant="outline" />
          </div>

          {/* Links + Copyright */}
          <div className="flex items-center gap-6 text-xs" style={{ color: "var(--muted)" }}>
            <Link
              to="/privacy"
              className="hover:underline underline-offset-4 transition-colors duration-200"
              style={{ color: "var(--muted)" }}
            >
              {t("footer.privacy")}
            </Link>
            <Link
              to="/terms"
              className="hover:underline underline-offset-4 transition-colors duration-200"
              style={{ color: "var(--muted)" }}
            >
              {t("footer.terms")}
            </Link>
            <span>&copy; {new Date().getFullYear()} Artlypet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
