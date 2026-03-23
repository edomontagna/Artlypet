import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sophie M.",
    location: "Berlin, DE",
    text: "I couldn't believe how realistic the oil painting style looked. My golden retriever looks like a true aristocrat!",
    rating: 5,
    initials: "SM",
  },
  {
    name: "Marco R.",
    location: "Milano, IT",
    text: "Ho regalato un ritratto pop art del mio gatto alla mia ragazza. Era entusiasta! Qualita' incredibile.",
    rating: 5,
    initials: "MR",
  },
  {
    name: "Claire D.",
    location: "Paris, FR",
    text: "The watercolor style is absolutely gorgeous. I ordered a canvas print and it looks museum-worthy on my wall.",
    rating: 5,
    initials: "CD",
  },
];

const TestimonialsSection = () => {
  const { t } = useTranslation();

  return (
    <section
      className="sec-on-surface py-28 lg:py-36 relative"
      style={{ backgroundColor: "var(--surface)" }}
      aria-labelledby="testimonials-heading"
    >
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="sec-label mb-4"
          >
            Testimonials
          </motion.p>
          <motion.h2
            id="testimonials-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl lg:text-5xl font-light"
            style={{ color: "var(--text)" }}
          >
            {t("testimonials.title")}
          </motion.h2>
        </div>

        {/* Grid with border gaps */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto"
          style={{ gap: "1.5px", backgroundColor: "var(--border)" }}
        >
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group relative"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <div className="relative p-8 lg:p-10">
                {/* Card-bar on left */}
                <div
                  className="card-bar absolute left-0 top-0 w-[3px] transition-all duration-500 ease-out h-0 group-hover:h-full"
                  style={{ backgroundColor: "var(--accent)" }}
                />

                {/* Stars */}
                <div className="flex gap-0.5 mb-6">
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-3 w-3"
                      style={{ fill: "var(--accent)", color: "var(--accent)" }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="font-serif text-lg font-light italic leading-relaxed mb-8"
                  style={{ color: "var(--text)" }}
                >
                  &ldquo;{item.text}&rdquo;
                </p>

                {/* Attribution */}
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text)", fontFamily: "var(--font-sans, Jost, sans-serif)" }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--muted)", fontFamily: "var(--font-sans, Jost, sans-serif)" }}
                  >
                    {item.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
