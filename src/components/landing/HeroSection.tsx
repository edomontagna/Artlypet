import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { usePortraitCount } from "@/hooks/usePortraitCount";

const ease = [0.16, 1, 0.3, 1];

const HeroSection = () => {
  const { t } = useTranslation();
  const { data: portraitCount } = usePortraitCount();

  return (
    <section className="relative bg-background overflow-hidden">
      {/* Decorative blur behind image */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-6 lg:px-8 pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
              className="text-lg text-muted-foreground leading-relaxed max-w-lg mb-12"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Button asChild className="rounded-full h-14 px-8 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
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

            {/* Portrait counter — social proof */}
            {portraitCount != null && portraitCount > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6, ease }}
                className="mt-10 flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span>
                  <strong className="text-foreground font-semibold">{portraitCount.toLocaleString()}</strong>{" "}
                  {t("hero.portraitsCreated", "portraits created")}
                </span>
              </motion.div>
            )}
          </div>

          {/* Right — Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl shadow-2xl overflow-hidden bg-secondary/10">
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-serif text-6xl font-bold text-primary/20 select-none">
                  AP
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
