import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/SEOHead";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import { getShareData } from "@/services/generations";

const SITE_URL = "https://artlypet.com";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const SharePortrait = () => {
  const { generationId } = useParams<{ generationId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["share-portrait", generationId],
    queryFn: () => {
      if (!generationId) throw new Error("Missing generation ID");
      return getShareData(generationId);
    },
    enabled: !!generationId,
    staleTime: 300_000,
    retry: 1,
  });

  const styleName = data?.styleName || t("share.portrait", "Portrait");
  const ogTitle = t("share.ogTitle", "{{style}} Pet Portrait — Artlypet", { style: styleName });
  const ogDescription = t(
    "share.ogDescription",
    "Check out this amazing {{style}} pet portrait created with AI. Create your own pet masterpiece!",
    { style: styleName },
  );

  // For OG image, use the served image URL directly
  const ogImage = data?.imageUrl || `${SITE_URL}/images/og-cover.webp`;

  if (isError) {
    return (
      <>
        <SEOHead
          title={t("share.notFoundTitle", "Portrait Not Found — Artlypet")}
          description={t("share.notFoundDesc", "This portrait may have expired or been removed.")}
          canonical={`/share/${generationId || ""}`}
        />
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-cream/30 px-4">
          <motion.div className="text-center max-w-md space-y-6" {...fadeInUp}>
            <PawPrint className="h-16 w-16 text-gold/40 mx-auto" />
            <h1 className="font-serif text-2xl font-bold text-navy">
              {t("share.notFoundHeading", "Portrait not found")}
            </h1>
            <p className="text-muted-foreground">
              {t("share.notFoundBody", "This portrait may have expired or been removed. Why not create your own?")}
            </p>
            <Button
              size="lg"
              className="rounded-full bg-gold hover:bg-gold/90 text-navy font-semibold gap-2"
              onClick={() => navigate("/signup")}
            >
              <Sparkles className="h-4 w-4" />
              {t("share.createOwn", "Create Your Own")}
            </Button>
          </motion.div>
        </main>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={ogTitle}
        description={ogDescription}
        canonical={`/share/${generationId || ""}`}
        ogImage={ogImage}
      />
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-cream/40 via-background to-cream/20">
        {/* Hero section */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Style badge */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {isLoading ? (
                <Skeleton className="h-8 w-40 rounded-full" />
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold font-medium text-sm border border-gold/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  {styleName}
                </span>
              )}
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy text-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("share.heading", "A Pet Masterpiece")}
            </motion.h1>
            <motion.p
              className="text-center text-muted-foreground text-lg max-w-xl mx-auto mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t("share.subheading", "This stunning portrait was created with Artlypet AI. Your pet could be next!")}
            </motion.p>

            {/* Portrait display */}
            <motion.div
              className="relative max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-navy/10 border border-gold/10 bg-white aspect-square">
                {isLoading ? (
                  <Skeleton className="absolute inset-0" />
                ) : (
                  <img
                    src={data?.imageUrl}
                    alt={t("share.portraitAlt", "{{style}} pet portrait created with Artlypet AI", { style: styleName })}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                )}
                <span className="absolute bottom-3 left-3 text-[10px] font-medium bg-black/50 text-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {t("aiGenerated", "AI-Generated")}
                </span>
              </div>

              {/* Decorative frame corners */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-gold/30 rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-gold/30 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-gold/30 rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-gold/30 rounded-br-lg" />
            </motion.div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 px-4">
          <motion.div
            className="max-w-2xl mx-auto text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
              {t("share.ctaHeading", "Create your own pet portrait!")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t(
                "share.ctaBody",
                "Transform your pet into a masterpiece in seconds. Choose from 12+ art styles, powered by AI.",
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button
                size="lg"
                className="rounded-full bg-gold hover:bg-gold/90 text-navy font-semibold gap-2 px-8 text-base"
                onClick={() => navigate("/signup")}
              >
                <Sparkles className="h-4 w-4" />
                {t("share.ctaButton", "Create Your Pet Portrait")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full gap-2 px-6 border-gold/30 text-navy hover:bg-gold/5"
                onClick={() => navigate("/styles")}
              >
                {t("share.browseStyles", "Browse Art Styles")}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground/70">
              {t("share.freeToStart", "Free to start. No credit card required.")}
            </p>
          </motion.div>
        </section>
      </main>
      <FooterSection />
    </>
  );
};

export default SharePortrait;
