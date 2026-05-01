import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const supportingStyles = [
  { src: "/images/watercolor.webp",   name: "Watercolor" },
  { src: "/images/pop-art.webp",      name: "Pop Art" },
  { src: "/images/oil-painting.jpg",  name: "Oil Painting" },
  { src: "/images/art-nouveau.webp",  name: "Art Nouveau" },
  { src: "/images/impressionist.webp", name: "Impressionist" },
];

type Props = {
  pillText?: string;
};

/**
 * Auth showcase — Renaissance is the dominant frame (matches the brand-icon usage on landing),
 * 3 supporting style thumbs cycle on the right. Slow Ken Burns pan on the hero image.
 */
export const AuthShowcase = ({ pillText }: Props) => {
  const [activeOffset, setActiveOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveOffset((p) => (p + 1) % supportingStyles.length), 4200);
    return () => clearInterval(id);
  }, []);

  const thumbs = [
    supportingStyles[activeOffset % supportingStyles.length],
    supportingStyles[(activeOffset + 1) % supportingStyles.length],
    supportingStyles[(activeOffset + 2) % supportingStyles.length],
  ];

  return (
    <aside className="relative hidden lg:flex flex-1 items-center justify-center overflow-hidden bg-background border-l border-border">
      {/* Ambient warm wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent 70%)" }}
      />

      <div className="relative z-10 max-w-md w-full px-10 xl:px-14">
        {pillText && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1.5 mb-7">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-primary animate-breath" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="font-mono tabular text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/80">
              {pillText}
            </span>
          </div>
        )}

        <h3
          className="font-bold tracking-tightest leading-[1.04] text-foreground mb-4"
          style={{
            fontFamily: "'Cabinet Grotesk', system-ui, sans-serif",
            fontSize: "clamp(1.85rem, 2.6vw, 2.5rem)",
          }}
        >
          Il tuo cane, <span className="text-primary">in 12 facce.</span>
        </h3>
        <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-[36ch]">
          Carica una foto. Scegli uno stile. In meno di un minuto hai il ritratto pronto.
        </p>

        {/* Renaissance — dominant frame with subtle Ken Burns */}
        <div className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden bg-card border border-border shadow-tinted">
          <motion.img
            src="/images/renaissance.webp"
            alt="Esempio Renaissance — Artlypet"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 14, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            draggable={false}
          />
          {/* Bottom plate — refraction glass with style label */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)" }}
          />
          <div className="glass-refraction absolute inset-x-3 bottom-3 rounded-2xl px-3 py-2 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-foreground/65">
                Icona del brand
              </div>
              <div
                className="text-base font-bold text-foreground leading-tight"
                style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif" }}
              >
                Renaissance
              </div>
            </div>
            <span className="font-mono tabular text-[11px] font-semibold text-foreground/70">01 / 12</span>
          </div>
        </div>

        {/* Supporting thumbs */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {thumbs.map((t) => (
              <motion.div
                key={t.name + activeOffset}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
                className="aspect-square rounded-xl overflow-hidden bg-card border border-border"
                title={t.name}
              >
                <img src={t.src} alt={`${t.name} sample`} className="h-full w-full object-cover" draggable={false} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
};
