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
  {
    name: "David K.",
    location: "London, UK",
    text: "I never expected AI art to capture my cat's personality so perfectly. The oil painting style is incredible.",
    rating: 5,
    initials: "DK",
  },
  {
    name: "Chiara R.",
    location: "Roma, Italia",
    text: "Ho regalato un ritratto rinascimentale del mio labrador a mia madre. Ha pianto dalla gioia!",
    rating: 5,
    initials: "CR",
  },
  {
    name: "Ana P.",
    location: "Barcelona, España",
    text: "El estilo Art Nouveau transformó la foto de mi gato en una verdadera obra de arte. Increíble calidad.",
    rating: 5,
    initials: "AP",
  },
];

const TestimonialsSection = () => {
  const { t } = useTranslation();

  return (
    <section
      className="py-28 lg:py-36 bg-muted/30"
      aria-labelledby="testimonials-heading"
    >
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
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
              {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
            </div>
            <span className="text-sm font-medium text-foreground">4.9/5</span>
            <span className="text-sm text-muted-foreground">— {t("testimonials.count", "2,000+ happy pet owners")}</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 max-w-5xl mx-auto">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="bg-card rounded-2xl p-8 lg:p-10 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5" role="img" aria-label={`${item.rating} out of 5 stars`}>
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="font-serif text-xl italic text-foreground leading-relaxed mb-8">
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Attribution */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{item.initials}</span>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
