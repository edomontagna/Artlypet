import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const STYLES = [
  { image: "/images/renaissance.webp", nameKey: "Renaissance" },
  { image: "/images/oil-painting.jpg", nameKey: "Oil Painting" },
  { image: "/images/watercolor.webp", nameKey: "Watercolor" },
  { image: "/images/pop-art.webp", nameKey: "Pop Art" },
  { image: "/images/art-nouveau.webp", nameKey: "Art Nouveau" },
];

const VideoSection = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % STYLES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-background overflow-hidden">
      <div className="container px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-xs font-medium mb-4"
          >
            {t("video.label", "See It in Action")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            {t("video.title", "From Photo to Masterpiece")}
          </motion.h2>
        </div>

        {/* Portrait card carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-end gap-3 md:gap-5 max-w-4xl mx-auto"
        >
          {STYLES.map((style, i) => {
            const isActive = i === active;
            return (
              <button
                key={style.nameKey}
                onClick={() => setActive(i)}
                className={`relative flex-shrink-0 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive
                    ? "w-48 md:w-64 lg:w-72 aspect-[3/4] z-10 shadow-2xl ring-2 ring-primary/30"
                    : "w-20 md:w-28 lg:w-36 aspect-[3/4] opacity-60 hover:opacity-80 grayscale-[30%]"
                }`}
                aria-label={`${t("video.showStyle", "Show style")} ${style.nameKey}`}
              >
                <img
                  src={style.image}
                  alt={`${style.nameKey} pet portrait`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
                {/* Gradient + label only on active */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                    >
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div>
                          <span className="text-white/70 text-[10px] font-medium uppercase tracking-wider">
                            {t("video.styleLabel", "Art Style")}
                          </span>
                          <p className="font-serif text-lg md:text-xl font-bold text-white leading-tight">
                            {style.nameKey}
                          </p>
                        </div>
                        <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full hidden md:inline-block">
                          {t("video.aiGenerated", "AI-Generated")}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </motion.div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {STYLES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
              }`}
              aria-label={`Style ${i + 1}`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <Button asChild className="shimmer-btn btn-press rounded-full h-12 px-10 text-base font-medium text-primary-foreground shadow-md">
            <Link to="/signup">
              <Sparkles className="mr-2 h-4 w-4" />
              {t("video.cta", "Try It Free")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
