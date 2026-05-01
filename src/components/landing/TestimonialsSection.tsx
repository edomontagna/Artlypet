import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { MagneticButton } from "@/components/ui/magnetic-button";

// Realistic Italian + UE pet+owner pairings. No invented "Verified Buyer" badges.
const testimonials = [
  { name: "Sophie & Biscuit",  city: "Berlino",   style: "Renaissance",  size: "lg", quote: "Ho fatto stampare il ritratto Renaissance di Biscuit per il compleanno di mia madre. Ha pianto. Vinto." },
  { name: "Marco & Luna",      city: "Milano",    style: "Watercolor",   size: "md", quote: "L'acquerello di Luna è esattamente il regalo di Natale che cercavo. Mai più mug personalizzati." },
  { name: "Claire & Milo",     city: "Parigi",    style: "Pop Art",      size: "sm", quote: "Pop Art di Milo. È il mio sfondo del telefono da 3 mesi e mi fa sorridere ogni volta." },
  { name: "David & Whiskers",  city: "Londra",    style: "Oil Painting", size: "md", quote: "Il bello è che in 60 secondi vedi il risultato. Se non ti piace, cambi stile e basta." },
  { name: "Chiara & Bella",    city: "Roma",      style: "Art Nouveau",  size: "sm", quote: "Bella sembra una principessa Klimt. Mio marito mi ha guardata male e poi se l'è messo in studio." },
  { name: "Ana & Coco",        city: "Barcellona", style: "Impressionist", size: "lg", quote: "Coco è morta a settembre. Avere il suo ritratto in cornice ha cambiato come la ricordo. Grazie davvero." },
];

const ease = [0.16, 1, 0.3, 1] as const;

const sizeClasses = {
  sm: "lg:col-span-3",
  md: "lg:col-span-4",
  lg: "lg:col-span-5",
} as const;

const TestimonialsSection = memo(() => {
  return (
    <section
      className="relative py-24 lg:py-36 bg-background overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="container relative px-5 lg:px-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 lg:mb-16">
          <div className="lg:col-span-7">
            <span className="font-mono tabular text-[11px] font-semibold tracking-[0.18em] uppercase text-primary">
              · Cosa dicono
            </span>
            <motion.h2
              id="testimonials-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease }}
              className="mt-4 font-bold tracking-tightest leading-[1.02] text-foreground"
              style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif", fontSize: "clamp(2rem, 5.5vw, 4.25rem)" }}
            >
              Pet parent, <span className="text-primary italic">parole loro.</span>
            </motion.h2>
          </div>
        </div>

        {/* Asymmetric masonry grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 max-w-6xl mx-auto">
          {testimonials.map((item, i) => (
            <motion.figure
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06, duration: 0.6, ease }}
              className={`bg-card border border-border rounded-[1.75rem] p-7 lg:p-8 flex flex-col card-hover ${sizeClasses[item.size]}`}
            >
              <Quote className="h-7 w-7 text-primary/40 mb-5" strokeWidth={1.5} aria-hidden />

              <blockquote
                className="text-lg lg:text-xl text-foreground leading-snug mb-6 flex-1"
                style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif" }}
              >
                "{item.quote}"
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-5 border-t border-border">
                <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center font-mono tabular text-xs font-semibold text-primary shrink-0">
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mt-14 max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <Link to="/signup" className="rounded-full" tabIndex={-1}>
            <MagneticButton
              className="h-14 px-9 rounded-full text-base font-semibold bg-primary text-primary-foreground shadow-tinted btn-press"
              strength={0.30}
            >
              <span>Fai il tuo</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
            </MagneticButton>
          </Link>
          <p className="text-sm text-muted-foreground">3 ritratti gratis · Niente carta</p>
        </motion.div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";

export default TestimonialsSection;
