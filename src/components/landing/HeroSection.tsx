import { useState, useEffect, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortraitCount } from "@/hooks/usePortraitCount";
import { useAuth } from "@/contexts/AuthContext";

const useCountUp = (target: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [started, target, duration]);

  return { count, start: useCallback(() => setStarted(true), []) };
};

const heroImages = [
  { src: "/images/renaissance.webp", alt: "Renaissance", style: "Renaissance" },
  { src: "/images/watercolor.webp", alt: "Watercolor", style: "Watercolor" },
  { src: "/images/pop-art.webp", alt: "Pop Art", style: "Pop Art" },
  { src: "/images/art-nouveau.webp", alt: "Art Nouveau", style: "Art Nouveau" },
  { src: "/images/impressionist.webp", alt: "Impressionist", style: "Impressionist" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const PortraitCounter = ({ count: targetCount, t }: { count: number; t: (key: string, defaultValue: string) => string }) => {
  const { count: animatedCount, start: startCount } = useCountUp(targetCount, 2500);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.6 }}
      className="mt-10 flex items-center gap-2 text-sm text-muted-foreground"
      onViewportEnter={() => startCount()}
      viewport={{ once: true }}
    >
      <Sparkles className="h-4 w-4 text-primary" />
      <span>
        <strong className="text-foreground font-semibold">{animatedCount.toLocaleString()}+</strong>{" "}
        {t("hero.portraitsCreated", "portraits created")}
      </span>
    </motion.div>
  );
};

const HeroSection = memo(() => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const { data: portraitCount } = usePortraitCount();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-background overflow-hidden">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-6 lg:px-8 pt-10 pb-10 sm:pt-16 sm:pb-20 lg:pt-28 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease }}
            >
              <span className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-medium mb-4">
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease }}
              className="font-serif font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-foreground mb-8"
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
              className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-md mb-8"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Button asChild className="shimmer-btn btn-press rounded-full h-12 px-8 text-base font-medium text-primary-foreground shadow-md">
                <Link to={session ? "/generate" : "/signup"} className="inline-flex items-center gap-2 group">
                  {t("hero.cta")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="rounded-full h-12 px-8 text-base font-medium border-border hover:border-primary hover:text-primary">
                <a href="#gallery">
                  {t("hero.viewGallery")}
                </a>
              </Button>
            </motion.div>

            {/* Trust pill + free tier */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5, ease }}
              className="mt-3 flex flex-col gap-2"
            >
              <span className="inline-flex items-center gap-1.5 bg-primary/5 border border-primary/15 rounded-full px-3 py-1.5 text-xs font-medium text-primary w-fit">
                <Shield className="h-3.5 w-3.5" />
                {t("pricing.guaranteeBold", "30-day money-back guarantee")}
              </span>
              <p className="text-sm text-muted-foreground">
                {t("hero.freeTier", "Start free — 3 portraits included, no card required")}
              </p>
            </motion.div>

            {/* Social Proof Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6, ease }}
            >
              <div className="flex items-center gap-3 mt-6">
                <div className="flex -space-x-2">
                  {["S", "M", "A", "L", "R"].map((letter, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium text-foreground">
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
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-primary" /> {t("hero.noSub", "No subscription")}</span>
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-primary" /> {t("hero.cancelAnytime", "Cancel anytime")}</span>
                <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-primary" /> {t("hero.freeCredits", "3 free portraits")}</span>
              </div>
            </motion.div>

            {/* Portrait counter */}
            {portraitCount == null ? (
              <div className="mt-10 flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-36 rounded" />
              </div>
            ) : portraitCount > 0 ? (
              <PortraitCounter count={portraitCount} t={t} />
            ) : null}
          </div>

          {/* Right — Portrait Slideshow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl shadow-2xl overflow-hidden bg-secondary/10 relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={heroImages[currentImage].src}
                  alt={heroImages[currentImage].alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                />
              </AnimatePresence>

              {/* Style label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="bg-black/50 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {heroImages[currentImage].style}
                </span>
                <span className="bg-primary/80 text-primary-foreground text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {t("aiGenerated", "AI-Generated")}
                </span>
              </div>
            </div>

            {/* Style dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {heroImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === currentImage ? "bg-primary w-6" : "bg-muted-foreground/30 w-2.5"
                  }`}
                  aria-label={img.alt}
                />
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">
              {heroImages[currentImage].style} — {t("hero.slideCaption", "AI portrait style")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
