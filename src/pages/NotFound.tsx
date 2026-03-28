import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Home, ImageIcon, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SEOHead } from "@/components/SEOHead";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { session } = useAuth();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SEOHead
        title="Page Not Found | Artlypet"
        description="The page you're looking for doesn't exist or has been moved. Return to Artlypet to create AI pet portraits."
        canonical={location.pathname}
      />
      <div className="text-center max-w-md">
        <h1 className="font-serif text-7xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
          {t("notFound.title", "Page Not Found")}
        </h2>
        <p className="text-muted-foreground mb-8">
          {t("notFound.desc", "The page you're looking for doesn't exist or has been moved.")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-full gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              {t("notFound.home", "Back to Home")}
            </Link>
          </Button>
          {session ? (
            <Button asChild variant="outline" className="rounded-full gap-2">
              <Link to="/generate">
                <ImageIcon className="h-4 w-4" />
                {t("notFound.create", "Create Portrait")}
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="rounded-full gap-2">
              <Link to="/signup">
                <UserPlus className="h-4 w-4" />
                {t("nav.getStarted", "Get Started")}
              </Link>
            </Button>
          )}
        </div>
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {t("notFound.looking", "Looking for something specific? Try these:")}
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            <Link to="/#pricing" className="text-sm text-primary hover:underline">{t("nav.pricing", "Pricing")}</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/#faq" className="text-sm text-primary hover:underline">{t("nav.faq", "FAQ")}</Link>
            <span className="text-muted-foreground">·</span>
            {!session && (
              <>
                <Link to="/login" className="text-sm text-primary hover:underline">{t("nav.signIn", "Sign In")}</Link>
                <span className="text-muted-foreground">·</span>
              </>
            )}
            <Link to="/contact" className="text-sm text-primary hover:underline">{t("nav.contact", "Contact")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
