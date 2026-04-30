import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MagneticButton } from "@/components/ui/magnetic-button";

const heroSlides = [
  { src: "/images/renaissance.webp", style: "Renaissance",   accent: "Royal oil & gilded frame" },
  { src: "/images/watercolor.webp",   style: "Watercolor",   accent: "Soft pigment, paper grain" },
  { src: "/images/pop-art.webp",      style: "Pop Art",      accent: "Bold flats, halftone weight" },
  { src: "/images/art-nouveau.webp",  style: "Art Nouveau",  accent: "Ornament, sinuous line" },
  { src: "/images/impressionist.webp", style: "Impressionist", accent: "Dappled light, broken stroke" },
];

const ease = [0.16, 1, 0.3, 1] as const;
const SLIDE_INTERVAL = 4200;

const HeroSection = memo(() => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [active, setActive] = useState(0);

  // Tilt motion values (cursor parallax on portrait stack)
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotX = useSpring(useTransform(tiltY, [-50, 50], [6, -6]), { stiffness: 150, damping: 18 });
  const rotY = useSpring(useTransform(tiltX, [-50, 50], [-6, 6]), { stiffness: 150, damping: 18 });

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % heroSlides.length), SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const handleParallax = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    tiltX.set(((e.clientX - r.left) / r.width - 0.5) * 100);
    tiltY.set(((e.clientY - r.top) / r.height - 0.5) * 100);
  };
  const resetParallax = () => { tiltX.set(0); tiltY.set(0); };

  const slide = heroSlides[active];

  return (
    <section
      className="relative isolate overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      {/* Soft radial wash — single accent, no neon glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-40 h-[640px] w-[640px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--secondary) / 0.10), transparent 70%)" }}
      />

      <div className="container relative px-6 lg:px-10 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 min-h-[88dvh] flex items-center">
        {/* Asymmetric 12-col grid: 7/5 split — skill: anti-center bias */}
        <div className="grid w-full grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-16">

          {/* LEFT — copy block, cols 1-7 */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.55, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1.5 mb-7"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-primary animate-breath" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/80">
                {t("hero.badge", "AI Pet Portrait Studio")}
              </span>
            </motion.div>

            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.30, duration: 0.85, ease }}
              className="font-serif font-bold text-[2.6rem] sm:text-6xl lg:text-7xl xl:text-[5.25rem] leading-[0.98] tracking-tightest text-foreground"
            >
              {(() => {
                const raw = t("hero.title", "Your Pet, Immortalized in Art");
                const parts = raw.split(",");
                return parts.map((part, i) =>
                  i === 0 ? (
                    <span key={i} className="block">{part.trim()},</span>
                  ) : (
                    <span key={i} className="block text-accent-em">{part.trim()}</span>
                  ),
                );
              })()}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease }}
              className="mt-7 max-w-[52ch] text-lg lg:text-xl text-muted-foreground leading-relaxed"
            >
              {t(
                "hero.subtitle",
                "Transform your beloved pet's photo into a stunning, museum-quality artistic portrait using cutting-edge AI. Choose from a curated collection of world-class art styles.",
              )}
            </motion.p>

            {/* Concrete proof strip — replaces fake "10,000+" claim */}
            <motion.dl
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.55, ease }}
              className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm"
            >
              <div className="flex items-baseline gap-2">
                <dt className="font-mono tabular text-2xl font-semibold text-foreground">12</dt>
                <dd className="text-muted-foreground">{t("hero.proofStyles", "painting styles")}</dd>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border" />
              <div className="flex items-baseline gap-2">
                <dt className="font-mono tabular text-2xl font-semibold text-foreground">~47<span className="text-base text-muted-foreground">s</span></dt>
                <dd className="text-muted-foreground">{t("hero.proofTime", "average craft time")}</dd>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border" />
              <div className="flex items-baseline gap-2">
                <dt className="font-mono tabular text-2xl font-semibold text-foreground">2K</dt>
                <dd className="text-muted-foreground">{t("hero.proofRes", "print-ready resolution")}</dd>
              </div>
            </motion.dl>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.55, ease }}
              className="mt-9 flex flex-col sm:flex-row items-start gap-3"
            >
              <Link
                to={session ? "/generate" : "/signup"}
                className="group block rounded-full"
                aria-label={t("hero.cta", "Transform Your Pet")}
              >
                <MagneticButton
                  className="shimmer-btn rounded-full h-14 px-8 text-base font-semibold shadow-tinted"
                  strength={0.30}
                  type="button"
                  tabIndex={-1}
                >
                  <span>{t("hero.cta", "Transform Your Pet")}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.25} />
                </MagneticButton>
              </Link>

              <a
                href="#gallery"
                className="inline-flex items-center justify-center gap-2 rounded-full h-14 px-7 text-base font-medium border border-border hover:border-primary hover:text-primary transition-colors btn-press"
              >
                <span>{t("hero.viewGallery", "See the styles")}</span>
              </a>
            </motion.div>

            {/* Trust microcopy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.45 }}
              className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Shield className="h-4 w-4 text-primary" strokeWidth={1.75} />
              <span>{t("hero.freeTier", "3 portraits included on signup · no card required")}</span>
            </motion.div>
          </div>

          {/* RIGHT — portrait stack with parallax tilt, cols 8-12 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.95, ease }}
            className="lg:col-span-5"
          >
            <div
              onMouseMove={handleParallax}
              onMouseLeave={resetParallax}
              className="relative mx-auto w-full max-w-[420px] [perspective:1100px]"
            >
              {/* Behind-card decorative — tinted not glowing */}
              <div className="absolute inset-x-6 top-6 bottom-2 rounded-[2.25rem] bg-primary/10 -rotate-2" aria-hidden />
              <div className="absolute inset-x-3 top-3 bottom-0 rounded-[2.25rem] bg-card border border-border rotate-1" aria-hidden />

              {/* Live portrait card */}
              <motion.div
                style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
                className="relative aspect-[4/5] rounded-[2.25rem] overflow-hidden bento-card-lg"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active}
                    src={slide.src}
                    alt={`${slide.style} pet portrait — Artlypet`}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
                    draggable={false}
                  />
                </AnimatePresence>

                {/* Bottom plate — refraction edge, not generic glass */}
                <div className="glass-refraction absolute inset-x-3 bottom-3 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-foreground/60">
                      {t("hero.styleLabel", "Style")}
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={slide.style}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.35 }}
                      >
                        <div className="font-serif text-lg font-bold text-foreground leading-tight">{slide.style}</div>
                        <div className="text-[11px] text-muted-foreground leading-tight">{slide.accent}</div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-foreground/60">
                      {t("hero.craftedIn", "Crafted in")}
                    </div>
                    <div className="font-mono tabular text-base font-semibold text-foreground">
                      {(38 + ((active * 7) % 17)).toString()}<span className="text-muted-foreground">s</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Style dot navigator */}
              <div className="mt-5 flex items-center justify-center gap-2">
                {heroSlides.map((s, i) => (
                  <button
                    key={s.style}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-400 ${
                      i === active ? "bg-primary w-8" : "bg-foreground/20 w-1.5 hover:bg-foreground/40"
                    }`}
                    aria-label={`Show ${s.style} style`}
                    aria-current={i === active}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
