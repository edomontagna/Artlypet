import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VideoSection = () => {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);

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
          {playing ? (
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Artlypet Demo"
              />
            </div>
          ) : (
            <div
              className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 relative cursor-pointer group"
              onClick={() => setPlaying(true)}
            >
              {/* Decorative content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-8 w-8 ml-1" />
                  </div>
                  <p className="font-serif text-xl font-semibold text-foreground">
                    {t("video.watchDemo", "Watch the Transformation")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("video.duration", "30 seconds")}
                  </p>
                </div>
              </div>
            </div>
          )}
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
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
