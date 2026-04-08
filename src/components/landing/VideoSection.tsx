import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BlurImage } from "@/components/BlurImage";

const DEMO_IMAGES = [
  { before: "/images/oil-painting.jpg", styleKey: "Oil Painting" },
  { before: "/images/watercolor.webp", styleKey: "Watercolor" },
  { before: "/images/renaissance.webp", styleKey: "Renaissance" },
  { before: "/images/pop-art.webp", styleKey: "Pop Art" },
];

const VideoSection = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DEMO_IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container px-6 lg:px-8">
        <div className="text-center mb-12">
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Before/After showcase slideshow */}
          <div className="aspect-[4/3] md:aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl bg-muted relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0 overflow-hidden"
              >
                <BlurImage
                  src={DEMO_IMAGES[activeIndex].before}
                  alt={`${DEMO_IMAGES[activeIndex].styleKey} pet portrait`}
                  className="absolute inset-0 w-full h-full"
                />
                {/* Overlay with style name */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <span className="text-white/70 text-xs font-medium uppercase tracking-wider">
                      {t("video.styleLabel", "Art Style")}
                    </span>
                    <p className="font-serif text-2xl font-bold text-white">
                      {DEMO_IMAGES[activeIndex].styleKey}
                    </p>
                  </div>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    {t("video.aiGenerated", "AI-Generated")}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {DEMO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "w-8 bg-white" : "w-3 bg-white/40"
                  }`}
                  aria-label={`${t("video.showStyle", "Show style")} ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

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
