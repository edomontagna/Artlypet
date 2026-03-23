import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useStyles } from "@/hooks/useStyles";
import { Skeleton } from "@/components/ui/skeleton";

const fallbackStyles = [
  { id: "1", name: "Oil Painting", description: "Rich textures & golden tones", preview_url: "/images/oil-painting.jpg" },
  { id: "2", name: "Watercolor", description: "Soft washes & gentle blending", preview_url: "/images/watercolor.png" },
  { id: "3", name: "Pop Art", description: "Bold colors & graphic energy", preview_url: "/images/pop-art.png" },
  { id: "4", name: "Renaissance", description: "Noble bearing & dramatic light", preview_url: "/images/renaissance.png" },
  { id: "5", name: "Art Nouveau", description: "Flowing lines & organic forms", preview_url: "/images/art-nouveau.png" },
  { id: "6", name: "Impressionist", description: "Dappled light & visible strokes", preview_url: "/images/impressionist.png" },
];

const GallerySection = () => {
  const { t } = useTranslation();
  const { data: dbStyles, isLoading } = useStyles();
  const styles = dbStyles && dbStyles.length > 0 ? dbStyles : fallbackStyles;

  return (
    <section id="gallery" className="py-28 lg:py-36 relative" style={{ backgroundColor: "var(--bg)" }} aria-labelledby="gallery-heading">
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="sec-label mb-4"
          >
            The Collection
          </motion.p>
          <motion.h2
            id="gallery-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl lg:text-5xl font-light mb-5"
            style={{ color: "var(--text)" }}
          >
            {t("gallery.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xl text-lg font-light"
            style={{ color: "var(--muted)" }}
          >
            {t("gallery.subtitle")}
          </motion.p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
            style={{ gap: "1.5px", backgroundColor: "var(--border)" }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-none" style={{ backgroundColor: "var(--surface)" }} />
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
            style={{ gap: "1.5px", backgroundColor: "var(--border)" }}
          >
            {styles.slice(0, 6).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                className="group relative"
                style={{ backgroundColor: "var(--bg)" }}
              >
                {/* Card with bar */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  {/* Card-bar on left */}
                  <div
                    className="card-bar absolute left-0 top-0 w-[3px] z-20 transition-all duration-500 ease-out h-0 group-hover:h-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />

                  {/* Image */}
                  {item.preview_url ? (
                    <img
                      src={item.preview_url}
                      alt={`${item.name} pet portrait`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0" style={{ backgroundColor: "var(--surface2)" }} />
                  )}

                  {/* Corner accents */}
                  <div
                    className="absolute top-3 left-3 w-5 h-5 border-t border-l z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ borderColor: "var(--accent)" }}
                  />
                  <div
                    className="absolute bottom-3 right-3 w-5 h-5 border-b border-r z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ borderColor: "var(--accent)" }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10">
                    <h3
                      className="font-serif text-xl lg:text-2xl font-light text-white mb-1 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    >
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-light" style={{ fontFamily: "var(--font-sans, Jost, sans-serif)" }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
