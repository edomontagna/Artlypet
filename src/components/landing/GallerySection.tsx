import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useStyles } from "@/hooks/useStyles";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurImage } from "@/components/BlurImage";

const fallbackStyles = [
  { id: "1", name: "Renaissance",   description: "Noble bearing, dramatic chiaroscuro",     preview_url: "/images/renaissance.webp" },
  { id: "2", name: "Watercolor",    description: "Soft pigment washes, paper grain",        preview_url: "/images/watercolor.webp" },
  { id: "3", name: "Pop Art",       description: "Flat colour, halftone weight",            preview_url: "/images/pop-art.webp" },
  { id: "4", name: "Art Nouveau",   description: "Sinuous line, ornament",                  preview_url: "/images/art-nouveau.webp" },
  { id: "5", name: "Impressionist", description: "Dappled light, broken stroke",            preview_url: "/images/impressionist.webp" },
  { id: "6", name: "Oil Painting",  description: "Rich texture, gilded undertones",         preview_url: "/images/oil-painting.jpg" },
];

const ease = [0.16, 1, 0.3, 1] as const;

// Asymmetric Bento layout — 12 col grid, 3 row tracks on desktop.
// Pattern (ascii):  [ 1   1  | 2 ]
//                   [ 1   1  | 3 ]
//                   [ 4 | 5  | 6 ]
const cellClassFor = (i: number): string => {
  switch (i) {
    case 0: return "lg:col-span-7 lg:row-span-2 aspect-[5/4] lg:aspect-auto";
    case 1: return "lg:col-span-5 aspect-[4/3] lg:aspect-[5/4]";
    case 2: return "lg:col-span-5 aspect-[4/3] lg:aspect-[5/4]";
    case 3: return "lg:col-span-4 aspect-[4/5]";
    case 4: return "lg:col-span-4 aspect-[4/5]";
    case 5: return "lg:col-span-4 aspect-[4/5]";
    default: return "lg:col-span-4 aspect-[4/5]";
  }
};

// Cursor-aware tilt — uses requestAnimationFrame, no React state per skill rules
const tiltRafMap = new WeakMap<HTMLDivElement, number>();
const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
  const target = e.currentTarget;
  const cx = e.clientX, cy = e.clientY;
  const prev = tiltRafMap.get(target);
  if (prev) cancelAnimationFrame(prev);
  tiltRafMap.set(target, requestAnimationFrame(() => {
    const r = target.getBoundingClientRect();
    const x = (cx - r.left) / r.width - 0.5;
    const y = (cy - r.top) / r.height - 0.5;
    target.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.015)`;
  }));
};
const handleTiltReset = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.transform = "perspective(900px) rotateY(0) rotateX(0) scale(1)";
};

const GallerySection = memo(() => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const navigate = useNavigate();
  const { data: dbStyles, isLoading } = useStyles();
  const styles = (dbStyles && dbStyles.length > 0 ? dbStyles : fallbackStyles).slice(0, 6);

  return (
    <section
      id="gallery"
      className="relative py-24 lg:py-36 bg-background overflow-hidden"
      aria-labelledby="gallery-heading"
    >
      <div className="container relative px-6 lg:px-10">
        {/* Header — split: title left, kicker right (anti-center) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease }}
            className="lg:col-span-7"
          >
            <span className="sec-label">{t("gallery.label", "The collection")}</span>
            <h2
              id="gallery-heading"
              className="mt-4 font-serif font-bold text-4xl md:text-5xl lg:text-6xl tracking-tightest leading-[1.02] text-foreground"
            >
              {t("gallery.title", "Twelve styles. One pet. ")}
              <span className="text-accent-em italic">{t("gallery.titleAccent", "infinite portraits.")}</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="lg:col-span-4 lg:col-start-9 self-end"
          >
            <p className="text-base text-muted-foreground leading-relaxed max-w-[40ch]">
              {t("gallery.subtitle", "Each style is a hand-tuned prompt with characteristic palette, brush logic, and composition rules. No two portraits land the same.")}
            </p>
          </motion.div>
        </div>

        {/* Bento grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 auto-rows-[280px] gap-5 lg:gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className={`rounded-[1.75rem] ${cellClassFor(i)}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 auto-rows-[280px] lg:auto-rows-[260px] gap-5 lg:gap-6">
            {styles.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.6, ease }}
                onClick={() => navigate(session ? "/generate" : "/signup")}
                onKeyDown={(e) => { if (e.key === "Enter") navigate(session ? "/generate" : "/signup"); }}
                onMouseMove={handleTilt}
                onMouseLeave={handleTiltReset}
                role="link"
                tabIndex={0}
                style={{ transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}
                className={`group relative overflow-hidden rounded-[1.75rem] cursor-pointer bento-card ${cellClassFor(i)}`}
              >
                {item.preview_url ? (
                  <BlurImage
                    src={item.preview_url}
                    alt={`${item.name} pet portrait — Artlypet`}
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted" />
                )}

                {/* Subtle bottom gradient — just enough to anchor the text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

                {/* Top-right index pill */}
                <div className="absolute top-4 right-4 glass-refraction rounded-full px-2.5 py-1">
                  <span className="font-mono tabular text-[11px] font-semibold text-foreground">
                    {String(i + 1).padStart(2, "0")} / {String(styles.length).padStart(2, "0")}
                  </span>
                </div>

                {/* Bottom — name + description + CTA arrow */}
                <div className="absolute inset-x-5 bottom-5 z-10">
                  <div className={`font-serif font-bold text-white leading-tight ${i === 0 ? "text-3xl lg:text-4xl" : "text-xl lg:text-2xl"}`}>
                    {t(`gallery.style${i + 1}Name`, item.name)}
                  </div>
                  {item.description && (
                    <p className={`mt-1.5 text-white/85 leading-snug ${i === 0 ? "text-sm lg:text-base max-w-[40ch]" : "text-xs lg:text-sm"}`}>
                      {t(`gallery.style${i + 1}Desc`, item.description)}
                    </p>
                  )}
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium text-white opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span>{t("gallery.tryCta", "Create this look")}</span>
                    <ArrowUpRight className="h-3 w-3" strokeWidth={2.25} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer — link to all styles, asymmetric */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground">
            {t("gallery.allStylesHint", "These are 6 of 12. Six more are waiting inside.")}
          </p>
          <Link
            to="/styles"
            className="group inline-flex items-center gap-2 rounded-full border border-border hover:border-primary px-5 py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors btn-press"
          >
            <span>{t("gallery.viewAll", "Browse all 12 styles")}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.25} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

GallerySection.displayName = "GallerySection";

export default GallerySection;
