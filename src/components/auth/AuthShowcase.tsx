import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const tiles = [
  { src: "/images/renaissance.webp",  style: "Renaissance",   accent: "Royal oil" },
  { src: "/images/watercolor.webp",   style: "Watercolor",    accent: "Soft pigment" },
  { src: "/images/pop-art.webp",      style: "Pop Art",       accent: "Flat colour" },
  { src: "/images/art-nouveau.webp",  style: "Art Nouveau",   accent: "Sinuous line" },
  { src: "/images/impressionist.webp", style: "Impressionist", accent: "Broken stroke" },
  { src: "/images/oil-painting.jpg",  style: "Oil Painting",  accent: "Rich texture" },
];

type Props = {
  /** Optional micro-pill above the headline (e.g. "3 Free Portraits", "Welcome back"). */
  pillText?: string;
};

/**
 * AuthShowcase — right-side decorative panel for Login/Signup/ForgotPassword.
 * - Asymmetric mosaic of 6 portraits, slowly auto-rotating.
 * - Ambient gold radial wash, no neon glow.
 * - Removes the "Rated 4.9/5 by 2,000+" claim that wasn't backed by real data.
 */
export const AuthShowcase = ({ pillText }: Props) => {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % tiles.length), 3600);
    return () => clearInterval(id);
  }, []);

  const tile = tiles[active];

  return (
    <aside className="relative hidden lg:flex flex-1 items-center justify-center overflow-hidden bg-cream/40 dark:bg-card border-l border-border">
      {/* Ambient warm wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--secondary) / 0.10), transparent 70%)" }}
      />

      <div className="relative z-10 max-w-md w-full px-10 xl:px-14">
        {pillText && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1.5 mb-7">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-primary animate-breath" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/80">
              {pillText}
            </span>
          </div>
        )}

        <h3 className="font-serif text-3xl xl:text-4xl font-bold tracking-tightest leading-[1.05] text-foreground mb-4">
          {t("auth.showcaseTitle", "Your pet, ")}
          <span className="text-accent-em italic">{t("auth.showcaseTitleAccent", "in twelve painting styles.")}</span>
        </h3>
        <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-[36ch]">
          {t("auth.showcaseDesc", "Upload a photo, pick a style, get a print-ready portrait in about a minute.")}
        </p>

        {/* Mosaic — 1 large featured + 3 stacked thumbs to the right */}
        <div className="grid grid-cols-4 grid-rows-3 gap-3 aspect-[4/5]">
          {/* Featured tile (3x3) */}
          <div className="col-span-3 row-span-3 relative rounded-[1.75rem] overflow-hidden bento-card-lg">
            <AnimatePresence mode="wait">
              <motion.img
                key={tile.src}
                src={tile.src}
                alt={`${tile.style} pet portrait sample`}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                draggable={false}
              />
            </AnimatePresence>
            <div className="glass-refraction absolute inset-x-3 bottom-3 rounded-2xl px-3 py-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tile.style}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-foreground/60">
                    {tile.accent}
                  </div>
                  <div className="font-serif text-base font-bold text-foreground leading-tight">{tile.style}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Side stack — next 3 styles */}
          {[1, 2, 3].map((offset) => {
            const tt = tiles[(active + offset) % tiles.length];
            return (
              <motion.div
                key={offset}
                layout
                className="col-span-1 row-span-1 rounded-xl overflow-hidden bento-card"
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <img
                  src={tt.src}
                  alt={`${tt.style} sample`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
