import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortraitCount } from "@/hooks/usePortraitCount";

const heroImages = [
  { src: "/images/renaissance.webp", alt: "Renaissance pet portrait" },
  { src: "/images/watercolor.webp", alt: "Watercolor pet portrait" },
  { src: "/images/pop-art.webp", alt: "Pop Art pet portrait" },
  { src: "/images/art-nouveau.webp", alt: "Art Nouveau pet portrait" },
  { src: "/images/impressionist.webp", alt: "Impressionist pet portrait" },
];

const ease = [0.16, 1, 0.3, 1];

const HeroSection = () => {
  const { t } = useTranslation();
  const { data: portraitCount } = usePortraitCount();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-background overflow-hidden">
      {/* Decorative blur behind image */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-6 lg:px-8 pt-28 pb-40 lg:pt-40 lg:pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease }}
            >
              <span className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-xs font-medium mb-8">
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease }}
              className="font-serif font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.1] text-foreground mb-8"
            >
              {t("hero.title").split(",").map((part, i) =>
                i === 0 ? (
                  <span key={i}>{part},<br /></span>
                ) : (
                  <em key={i} className="italic text-primary">{part}</em>
                )
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease }}
              className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-md mb-14"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Button asChild className="shimmer-btn btn-press rounded-full h-14 px-8 text-base font-medium text-primary-foreground shadow-md">
                <Link to="/generate" className="inline-flex items-center gap-2 group">
                  {t("hero.cta")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="rounded-full h-14 px-8 text-base font-medium border-border hover:border-primary hover:text-primary">
                <a href="#gallery">
                  {t("hero.viewGallery")}
                </a>
              </Button>
            </motion.div>

            {/* Free tier mention */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5, ease }}
              className="mt-4 text-sm text-muted-foreground"
            >
              {t("hero.freeTier", "Start free — 300 credits, no card required")}
            </motion.p>

            {/* Social Proof Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6, ease }}
            >
              <div className="flex items-center gap-3 mt-6">
                <div className="flex -space-x-2">
                  {["S", "M", "A", "L", "R"].map((letter, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-primary/15 border-2 border-background flex items-center justify-center text-xs font-medium text-foreground">
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("hero.socialProof", "Loved by 10,000+ pet owners")}
                </p>
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6, ease }}
            >
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-foreground/70">
                <span className="flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> {t("hero.noSub", "No subscription")}</span>
                <span className="flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> {t("hero.cancelAnytime", "Cancel anytime")}</span>
                <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-primary" /> {t("hero.freeCredits", "300 free credits")}</span>
              </div>
            </motion.div>

            {/* Portrait counter — social proof */}
            {portraitCount == null ? (
              <div className="mt-10 flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-36 rounded" />
              </div>
            ) : portraitCount > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.6, ease }}
                className="mt-10 flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span>
                  <strong className="text-foreground font-semibold">{portraitCount.toLocaleString()}</strong>{" "}
                  {t("hero.portraitsCreated", "portraits created")}
                </span>
              </motion.div>
            ) : null}
          </div>

          {/* Right — Image Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden bg-secondary/10 relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={heroImages[currentImage].src}
                  alt={heroImages[currentImage].alt}
                  className="w-full h-full object-cover absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
