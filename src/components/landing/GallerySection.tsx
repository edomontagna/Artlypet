import { memo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useStyles } from "@/hooks/useStyles";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurImage } from "@/components/BlurImage";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

const fallbackStyles = [
  { id: "1", name: "Oil Painting", description: "Rich textures & golden tones", preview_url: "/images/oil-painting.jpg" },
  { id: "2", name: "Watercolor", description: "Soft washes & gentle blending", preview_url: "/images/watercolor.webp" },
  { id: "3", name: "Pop Art", description: "Bold colors & graphic energy", preview_url: "/images/pop-art.webp" },
  { id: "4", name: "Renaissance", description: "Noble bearing & dramatic light", preview_url: "/images/renaissance.webp" },
  { id: "5", name: "Art Nouveau", description: "Flowing lines & organic forms", preview_url: "/images/art-nouveau.webp" },
  { id: "6", name: "Impressionist", description: "Dappled light & visible strokes", preview_url: "/images/impressionist.webp" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const tiltRafMap = new WeakMap<HTMLDivElement, number>();
const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
  const target = e.currentTarget;
  const clientX = e.clientX;
  const clientY = e.clientY;
  const prev = tiltRafMap.get(target);
  if (prev) cancelAnimationFrame(prev);
  tiltRafMap.set(target, requestAnimationFrame(() => {
    const rect = target.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    target.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  }));
};
const handleTiltReset = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
};

const GallerySection = memo(() => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const navigate = useNavigate();
  const { data: dbStyles, isLoading } = useStyles();
  const styles = dbStyles && dbStyles.length > 0 ? dbStyles : fallbackStyles;

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-background" aria-labelledby="gallery-heading">
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-medium mb-4">
              {t("gallery.label", "The Collection")}
            </span>
          </motion.div>
          <motion.h2
            id="gallery-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, ease }}
            className="font-serif font-bold text-4xl md:text-5xl tracking-tight text-foreground mb-5"
          >
            {t("gallery.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed"
          >
            {t("gallery.subtitle")}
          </motion.p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 max-w-5xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 max-w-5xl mx-auto">
            {styles.slice(0, 6).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.7, ease }}
                className="aspect-[3/4] rounded-2xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                role="link"
                tabIndex={0}
                onClick={() => navigate(session ? "/generate" : "/signup")}
                onKeyDown={(e) => { if (e.key === "Enter") navigate(session ? "/generate" : "/signup"); }}
                onMouseMove={handleTilt}
                onMouseLeave={handleTiltReset}
                style={{ transition: 'transform 0.3s ease-out' }}
              >
                {/* Badges */}
                {i === 0 && (
                  <span className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    {t("gallery.forGifts", "Perfect for Gifts")}
                  </span>
                )}
                {i === 1 && (
                  <span className="absolute top-3 left-3 z-10 bg-card/90 text-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm">
                    {t("gallery.romantic", "Dreamy & Romantic")}
                  </span>
                )}
                {i === 4 && (
                  <span className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    {t("gallery.new", "New")}
                  </span>
                )}
                {/* Before & After badge on first 3 cards */}
                {i < 3 && (
                  <span className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-card/90 text-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm">
                    {t("gallery.transformationBadge", "Before & After")}
                  </span>
                )}

                {/* Image */}
                {item.preview_url ? (
                  <>
                    <BlurImage
                      src={item.preview_url}
                      alt={`${item.name} pet portrait`}
                      className="absolute inset-0 w-full h-full"
                    />
                    {/* Before/After hover effect on first 3 cards */}
                    {i < 3 && (
                      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ clipPath: "inset(0 50% 0 0)" }}>
                        <img
                          src={item.preview_url}
                          alt="Original"
                          className="absolute inset-0 w-full h-full object-cover grayscale brightness-110 contrast-90 saturate-50"
                          draggable={false}
                        />
                        <div className="absolute inset-y-0 left-1/2 w-px bg-white/80 z-10" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-secondary/10" />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Content at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                  <h3 className="font-serif font-bold text-xl text-white mb-1">
                    {t(`gallery.style${i + 1}Name`, item.name)}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-white/90 font-sans opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      {t(`gallery.style${i + 1}Desc`, item.description)}
                    </p>
                  )}
                  <span className="inline-block mt-2 text-sm font-semibold text-white hover:bg-black/20 rounded-full px-3 py-1 transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                    {t("gallery.tryCta", "Create this look — Free")} &rarr;
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Dedicated Before/After Slider showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="max-w-sm md:max-w-md mx-auto mt-16"
        >
          <BeforeAfterSlider
            beforeUrl="/images/oil-painting.jpg"
            afterUrl="/images/renaissance.webp"
          />
          <p className="text-center text-sm text-muted-foreground mt-3">
            {t("gallery.sliderCaption", "Drag to see the transformation")}
          </p>
        </motion.div>
      </div>
    </section>
  );
});

GallerySection.displayName = "GallerySection";

export default GallerySection;
