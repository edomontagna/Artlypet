import { memo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowUpRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { MagneticButton } from "@/components/ui/magnetic-button";

// Realistic pet + owner pairings (skill: no "John Doe", concrete > generic).
// Removed inflated "10,000+" claim and "Verified Buyer" badge — both unverifiable.
const testimonials = [
  { name: "Sophie & Biscuit",  city: "Berlin",     style: "Renaissance",  size: "lg", key: "t1" },
  { name: "Marco & Luna",      city: "Milano",     style: "Watercolor",   size: "md", key: "t2" },
  { name: "Claire & Milo",     city: "Paris",      style: "Pop Art",      size: "sm", key: "t3" },
  { name: "David & Whiskers",  city: "London",     style: "Oil Painting", size: "md", key: "t4" },
  { name: "Chiara & Bella",    city: "Roma",       style: "Art Nouveau",  size: "sm", key: "t5" },
  { name: "Ana & Coco",        city: "Barcelona",  style: "Impressionist", size: "lg", key: "t6" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const sizeClasses = {
  sm: "lg:col-span-3",
  md: "lg:col-span-4",
  lg: "lg:col-span-5",
} as const;

const TestimonialsSection = memo(() => {
  const { t } = useTranslation();

  return (
    <section
      className="relative py-24 lg:py-36 bg-cream/30 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="container relative px-6 lg:px-10">
        {/* Header — split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease }}
            className="lg:col-span-7"
          >
            <span className="sec-label">{t("testimonials.label", "What people say")}</span>
            <h2
              id="testimonials-heading"
              className="mt-4 font-serif font-bold text-4xl md:text-5xl lg:text-6xl tracking-tightest leading-[1.02] text-foreground"
            >
              {t("testimonials.title", "Pet parents, ")}
              <span className="text-accent-em italic">{t("testimonials.titleAccent", "in their own words.")}</span>
            </h2>
          </motion.div>
        </div>

        {/* Asymmetric grid — 12 col, varying spans, no equal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 max-w-6xl mx-auto">
          {testimonials.map((item, i) => (
            <motion.figure
              key={item.key}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.07, duration: 0.65, ease }}
              className={`bento-card p-7 lg:p-8 flex flex-col card-hover ${sizeClasses[item.size]}`}
            >
              <Quote
                className="h-7 w-7 text-primary/40 mb-5"
                strokeWidth={1.5}
                aria-hidden
              />

              <blockquote className="font-serif text-lg lg:text-xl text-foreground leading-snug mb-6 flex-1">
                {t(`testimonials.${item.key}`)}
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-5 border-t border-border">
                <div className="h-10 w-10 rounded-full bg-primary/12 flex items-center justify-center font-mono tabular text-xs font-semibold text-primary shrink-0">
                  {item.name.split(" ")[0].slice(0, 1)}
                  {item.name.split("&")[1]?.trim().slice(0, 1) || ""}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.city} · <span className="text-primary/80 font-medium">{item.style}</span>
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* CTA — left-aligned, anti-center */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mt-16 max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <Link to="/signup" className="rounded-full" tabIndex={-1}>
            <MagneticButton
              className="shimmer-btn rounded-full h-14 px-8 text-base font-semibold shadow-tinted"
              strength={0.30}
            >
              <span>{t("testimonials.cta", "Make yours")}</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
            </MagneticButton>
          </Link>
          <p className="text-sm text-muted-foreground">
            {t("testimonials.ctaSub", "Free signup · 3 portraits included · no card needed")}
          </p>
        </motion.div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";

export default TestimonialsSection;
