import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStyles } from "@/hooks/useStyles";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/SEOHead";
import { Sparkles, Star, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const SITE_URL = "https://artlypet.com";

const styleDescriptions: Record<string, { descKey: string; tagsKey: string }> = {
  "oil-painting": { descKey: "styleDetail.oilDesc", tagsKey: "styleDetail.oilTags" },
  "watercolor": { descKey: "styleDetail.watercolorDesc", tagsKey: "styleDetail.watercolorTags" },
  "pop-art": { descKey: "styleDetail.popArtDesc", tagsKey: "styleDetail.popArtTags" },
  "renaissance": { descKey: "styleDetail.renaissanceDesc", tagsKey: "styleDetail.renaissanceTags" },
  "art-nouveau": { descKey: "styleDetail.artNouveauDesc", tagsKey: "styleDetail.artNouveauTags" },
  "impressionist": { descKey: "styleDetail.impressionistDesc", tagsKey: "styleDetail.impressionistTags" },
};

const StyleDetail = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const { data: styles, isLoading } = useStyles();

  const style = styles?.find(
    (s) => s.name.toLowerCase().replace(/\s+/g, "-") === slug
  );

  const otherStyles = styles?.filter((s) => s.id !== style?.id).slice(0, 4);
  const meta = slug ? styleDescriptions[slug] : undefined;

  const styleDescription = style
    ? meta
      ? t(meta.descKey, style.description || "")
      : (style.description || t("styleDetail.defaultDesc", "Transform your pet into a stunning masterpiece with this unique art style."))
    : "";

  // BreadcrumbList structured data
  useEffect(() => {
    if (!style || !slug) return;

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: t("nav.styles", "Styles"),
          item: `${SITE_URL}/styles`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: style.name,
          item: `${SITE_URL}/styles/${slug}`,
        },
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [style, slug, t]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-6 lg:px-8 py-16 max-w-5xl">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <Skeleton className="aspect-[4/3] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
            {t("styleDetail.notFound", "Style Not Found")}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t("styleDetail.notFoundDesc", "This art style doesn't exist or has been removed.")}
          </p>
          <Button asChild className="rounded-full">
            <Link to="/styles">{t("styleDetail.browseAll", "Browse All Styles")}</Link>
          </Button>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${style.name} Pet Portraits | Artlypet`}
        description={styleDescription}
        canonical={`/styles/${slug}`}
        ogImage={style.preview_url || undefined}
      />
      <Navbar />
      <main className="container px-6 lg:px-8 py-16 lg:py-24 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8" aria-label="Breadcrumb">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.home", "Home")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <Link to="/styles" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.styles", "Styles")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="text-foreground font-medium">{style.name}</span>
        </nav>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-xs font-medium mb-4">
              {t("styleDetail.artStyle", "Art Style")}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              {style.name}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {meta
                ? t(meta.descKey, style.description || "")
                : (style.description || t("styleDetail.defaultDesc", "Transform your pet into a stunning masterpiece with this unique art style."))}
            </p>
            {meta && (
              <div className="flex flex-wrap gap-2 mb-8">
                {t(meta.tagsKey, "Classic, Elegant, Timeless").split(",").map((tag, i) => (
                  <span key={i} className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="shimmer-btn btn-press rounded-full h-12 px-8 text-base font-medium text-primary-foreground shadow-md">
                <Link to={session ? "/generate" : "/signup"}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t("styleDetail.tryCta", "Create with {{style}}", { style: style.name })}
                </Link>
              </Button>
              <Button variant="outline" asChild className="rounded-full h-12 px-8 text-base">
                <Link to="/styles">
                  {t("styleDetail.browseAll", "Browse All Styles")}
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            {style.preview_url ? (
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={style.preview_url}
                  alt={`${style.name} pet portrait example`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/5] rounded-2xl bg-primary/10" />
            )}
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Star, titleKey: "styleDetail.feat1Title", descKey: "styleDetail.feat1Desc" },
            { icon: Sparkles, titleKey: "styleDetail.feat2Title", descKey: "styleDetail.feat2Desc" },
            { icon: ArrowRight, titleKey: "styleDetail.feat3Title", descKey: "styleDetail.feat3Desc" },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="rounded-2xl bg-card border border-border p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feat.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                {t(feat.titleKey)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(feat.descKey)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Other styles */}
        {otherStyles && otherStyles.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              {t("styleDetail.otherStyles", "Explore Other Styles")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherStyles.map((s) => (
                <Link
                  key={s.id}
                  to={`/styles/${s.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {s.preview_url ? (
                    <img
                      src={s.preview_url}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 inset-x-3 font-serif text-sm font-bold text-white">
                    {s.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <FooterSection />
    </div>
  );
};

export default StyleDetail;
