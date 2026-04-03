import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const testimonialMeta = [
  { name: "Sophie M.", location: "Berlin, DE", rating: 5, initials: "SM", key: "t1" },
  { name: "Marco R.", location: "Milano, IT", rating: 5, initials: "MR", key: "t2" },
  { name: "Claire D.", location: "Paris, FR", rating: 5, initials: "CD", key: "t3" },
  { name: "David K.", location: "London, UK", rating: 4, initials: "DK", key: "t4" },
  { name: "Chiara R.", location: "Roma, Italia", rating: 5, initials: "CR", key: "t5" },
  { name: "Ana P.", location: "Barcelona, ES", rating: 4, initials: "AP", key: "t6" },
];

const useVisibleCount = () => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setCount(3);
      else if (window.innerWidth >= 768) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
};

const TestimonialsSection = memo(() => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const visibleCount = useVisibleCount();
  const total = testimonialMeta.length;

  // For infinite loop, clone items: [last few] + [all items] + [first few]
  const cloneCount = visibleCount;
  const extendedItems = [
    ...testimonialMeta.slice(-cloneCount),
    ...testimonialMeta,
    ...testimonialMeta.slice(0, cloneCount),
  ];

  // The "real" index 0 maps to position cloneCount in the extended array
  const trackIndex = current + cloneCount;
  const cardWidthPercent = 100 / visibleCount;
  const translateX = trackIndex * cardWidthPercent;

  const next = useCallback(() => {
    setCurrent((prev) => prev + 1);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => prev - 1);
  }, []);

  // Handle infinite loop reset (snap without transition when we hit a clone zone)
  useEffect(() => {
    if (current >= total) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
    if (current < 0) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(total - 1);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [current, total]);

  // Re-enable transition after a snap reset
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Auto-scroll
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [paused, next]);

  // Normalize current for dot indicator
  const normalizedCurrent = ((current % total) + total) % total;

  return (
    <section
      className="py-16 lg:py-24 bg-muted/30"
      aria-labelledby="testimonials-heading"
    >
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-medium mb-4"
          >
            {t("testimonials.label", "Testimonials")}
          </motion.span>
          <motion.h2
            id="testimonials-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
          >
            {t("testimonials.title")}
          </motion.h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">4.9/5</span>
            <span className="text-sm text-muted-foreground">
              — {t("testimonials.joinCount", "Join 10,000+ happy customers who transformed their pets")}
            </span>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="overflow-hidden max-w-5xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className={`flex ${isTransitioning ? "transition-transform duration-500 ease-out" : ""}`}
            style={{ transform: `translateX(-${translateX}%)` }}
          >
            {extendedItems.map((item, i) => (
              <div
                key={`${item.key}-${i}`}
                className="flex-shrink-0 px-3"
                style={{ width: `${cardWidthPercent}%` }}
              >
                <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm h-full">
                  {/* Stars */}
                  <div
                    className="flex gap-0.5 mb-5"
                    role="img"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-3.5 w-3.5 ${
                          j < item.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="font-serif text-xl italic text-foreground leading-relaxed mb-8">
                    &ldquo;{t(`testimonials.${item.key}`)}&rdquo;
                  </p>

                  {/* Verified badge */}
                  <div className="flex items-center gap-1 mb-4">
                    <ShieldCheck className="h-3 w-3 text-green-600 dark:text-green-400" />
                    <span className="text-[10px] font-medium text-green-600 dark:text-green-400">
                      {t("testimonials.verified", "Verified Buyer")}
                    </span>
                  </div>

                  {/* Attribution */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {item.initials}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium font-sans text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs font-sans text-muted-foreground">
                        {item.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow buttons + dot indicators */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
            onClick={prev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-1.5">
            {testimonialMeta.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === normalizedCurrent
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
            onClick={next}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16"
        >
          <Button
            asChild
            className="shimmer-btn btn-press rounded-full h-12 px-8 text-base font-medium text-primary-foreground shadow-md"
          >
            <Link to="/signup">
              {t("testimonials.cta", "Join 10,000+ Happy Pet Owners")}
            </Link>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("testimonials.ctaSub", "Start free, no card needed")}
          </p>
        </motion.div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";

export default TestimonialsSection;
