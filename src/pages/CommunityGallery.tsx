import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { BlurImage } from "@/components/BlurImage";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const STYLES = ["All", "Oil Painting", "Watercolor", "Pop Art", "Renaissance", "Art Nouveau", "Impressionist"];

const GALLERY_ITEMS = [
  { id: "1", url: "/images/oil-painting.jpg", style: "Oil Painting" },
  { id: "2", url: "/images/watercolor.webp", style: "Watercolor" },
  { id: "3", url: "/images/pop-art.webp", style: "Pop Art" },
  { id: "4", url: "/images/renaissance.webp", style: "Renaissance" },
  { id: "5", url: "/images/art-nouveau.webp", style: "Art Nouveau" },
  { id: "6", url: "/images/impressionist.webp", style: "Impressionist" },
  { id: "7", url: "/images/oil-painting.jpg", style: "Oil Painting" },
  { id: "8", url: "/images/watercolor.webp", style: "Watercolor" },
  { id: "9", url: "/images/renaissance.webp", style: "Renaissance" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const CommunityGallery = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredItems = activeFilter === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.style === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t("communityGallery.title", "Community Gallery") + " — Artlypet"}
        description={t("communityGallery.subtitle", "Stunning pet portraits created by our community. Your pet could be next!")}
        canonical="/gallery"
      />
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container px-6 lg:px-8 text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-medium mb-4"
          >
            <Sparkles className="inline h-3 w-3 mr-1" />
            {t("communityGallery.title", "Community Gallery")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease }}
            className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            {t("communityGallery.title", "Community Gallery")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t("communityGallery.subtitle", "Stunning pet portraits created by our community. Your pet could be next!")}
          </motion.p>
        </section>

        {/* Filter tabs */}
        <section className="container px-6 lg:px-8 mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {STYLES.map((style) => (
              <button
                key={style}
                onClick={() => setActiveFilter(style)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === style
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {style === "All" ? t("communityGallery.filterAll", "All Styles") : style}
              </button>
            ))}
          </div>
        </section>

        {/* Gallery grid */}
        <section className="container px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">
              {t("communityGallery.empty", "No portraits yet. Be the first to create one!")}
            </p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-5xl mx-auto">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease }}
                  className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                >
                  <BlurImage
                    src={item.url}
                    alt={`${item.style} pet portrait`}
                    className="w-full aspect-[3/4]"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4">
                      <span className="text-white font-serif font-bold text-lg">{item.style}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="container px-6 lg:px-8 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h2 className="font-serif text-3xl font-bold text-foreground">
              {t("communityGallery.ctaTitle", "Create Your Own Masterpiece")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("communityGallery.ctaDesc", "Transform your pet into art in seconds. Free to start, no credit card needed.")}
            </p>
            <Button asChild className="shimmer-btn btn-press rounded-full h-12 px-8 text-base font-medium text-primary-foreground shadow-md">
              <Link to="/signup">
                <Sparkles className="mr-2 h-4 w-4" />
                {t("communityGallery.ctaButton", "Start Creating — It's Free")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default CommunityGallery;
