import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section
      className="min-h-screen flex items-center"
      style={{ background: "var(--bg)" }}
    >
      <div className="container px-6 lg:px-8 py-32 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <span className="hero-tag mb-8 block">{t("hero.badge")}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.05] mb-8"
              style={{ color: "var(--text)" }}
            >
              {t("hero.title").split(",").map((part, i) =>
                i === 0 ? (
                  <span key={i}>{part},<br /></span>
                ) : (
                  <em key={i} className="text-accent-em">{part}</em>
                )
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="text-lg leading-relaxed max-w-lg mb-12"
              style={{ color: "var(--muted)" }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link to="/generate" className="btn-editorial inline-flex items-center gap-2 group">
                {t("hero.cta")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a href="#gallery" className="btn-editorial btn-outline-editorial">
                {t("hero.viewGallery")}
              </a>
            </motion.div>
          </div>

          {/* Right — Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="img-box" style={{ aspectRatio: "4/5" }}>
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: "var(--surface2)" }}
              >
                <span
                  className="font-serif text-6xl font-light select-none"
                  style={{ color: "var(--accent)", opacity: 0.2 }}
                >
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
