import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStyles } from "@/hooks/useStyles";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const StylesGallery = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: styles, isLoading } = useStyles();

  const handleStyleClick = (styleName: string) => {
    navigate(`/generate?style=${encodeURIComponent(styleName)}`);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Palette className="h-4 w-4" />
              {t("stylesGallery.badge", "Curated Collection")}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t("stylesGallery.title", "Discover Our Art Styles")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "stylesGallery.subtitle",
                "Explore our curated collection of world-class artistic styles. Each one is crafted to bring out the unique personality of your pet."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-24 px-6 lg:px-8">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {styles?.map((style, index) => (
                <motion.div
                  key={style.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => handleStyleClick(style.name)}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 w-full text-left"
                  >
                    {style.preview_url ? (
                      <img
                        src={style.preview_url}
                        alt={style.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-serif text-2xl font-bold text-white mb-2">
                        {style.name}
                      </h3>
                      {style.description && (
                        <p className="text-white/80 text-sm line-clamp-2 mb-4">
                          {style.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-white/90 text-sm font-medium sm:opacity-70 sm:group-hover:opacity-100 transition-opacity duration-300">
                        {t("stylesGallery.tryStyle", "Try this style")}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mt-16"
          >
            <Button
              onClick={() => navigate("/signup")}
              className="rounded-full h-12 px-8 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t("stylesGallery.cta", "Start Creating for Free")}
            </Button>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
};

export default StylesGallery;
