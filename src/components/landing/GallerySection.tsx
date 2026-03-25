import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useStyles } from "@/hooks/useStyles";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const fallbackStyles = [
  { id: "1", name: "Oil Painting", description: "Rich textures & golden tones", preview_url: "/images/oil-painting.jpg" },
  { id: "2", name: "Watercolor", description: "Soft washes & gentle blending", preview_url: "/images/watercolor.webp" },
  { id: "3", name: "Pop Art", description: "Bold colors & graphic energy", preview_url: "/images/pop-art.webp" },
  { id: "4", name: "Renaissance", description: "Noble bearing & dramatic light", preview_url: "/images/renaissance.webp" },
  { id: "5", name: "Art Nouveau", description: "Flowing lines & organic forms", preview_url: "/images/art-nouveau.webp" },
  { id: "6", name: "Impressionist", description: "Dappled light & visible strokes", preview_url: "/images/impressionist.webp" },
];

const ease = [0.16, 1, 0.3, 1];

const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  e.currentTarget.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
};
const handleTiltReset = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
};

const GallerySection = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const { data: dbStyles, isLoading } = useStyles();
  const styles = dbStyles && dbStyles.length > 0 ? dbStyles : fallbackStyles;

  return (
    <section id="gallery" className="py-28 lg:py-40 bg-background" aria-labelledby="gallery-heading">
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-xs font-medium mb-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 max-w-6xl mx-auto">
            {styles.slice(0, 6).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.7, ease }}
                className="aspect-[3/4] rounded-3xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500"
                onMouseMove={handleTilt}
                onMouseLeave={handleTiltReset}
                style={{ transition: 'transform 0.3s ease-out' }}
              >
                {/* Badges */}
                {i === 0 && (
                  <span className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    {t("gallery.popular", "Most Popular")}
                  </span>
                )}
                {i === 4 && (
                  <span className="absolute top-3 left-3 z-10 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    {t("gallery.new", "New")}
                  </span>
                )}

                {/* Image */}
                {item.preview_url ? (
                  <img
                    src={item.preview_url}
                    alt={`${item.name} pet portrait`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-secondary/10" />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Content at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                  <h3 className="font-serif font-bold text-xl text-white mb-1">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-white/70 font-sans opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      {item.description}
                    </p>
                  )}
                  <Link
                    to={session ? "/generate" : "/signup"}
                    className="inline-block mt-2 text-xs font-medium text-white/90 hover:text-white transition-colors duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    {t("gallery.tryStyle", "Try this style")} &rarr;
                  </Link>
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
