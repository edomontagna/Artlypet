import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { usePortraitCount } from "@/hooks/usePortraitCount";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Goiko-style hero: full-bleed Renaissance portrait as the protagonist.
 * The portrait IS the message. Text is a narrow caption at the bottom-left.
 * Italian voice — warm, intimate, slightly cheeky, never corporate.
 * Renaissance is the recurring "Kevin Bacon" of Artlypet — appears here, in gallery hero, in auth.
 */
const HeroSection = memo(() => {
  const { session } = useAuth();
  const { data: portraitCount } = usePortraitCount();

  // Format real DB count or fall back to a credible placeholder while loading
  const formattedCount = portraitCount && portraitCount > 0
    ? portraitCount.toLocaleString("it-IT")
    : "—";

  return (
    <section
      className="relative min-h-[100dvh] w-full overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      {/* FULL-BLEED PORTRAIT — Renaissance is the protagonist */}
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/renaissance.webp" />
          <img
            src="/images/renaissance.webp"
            alt="Ritratto Renaissance di un cane — Artlypet"
            className="h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            draggable={false}
          />
        </picture>

        {/* Dual gradient overlay — top fades to background for nav, bottom for text */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--background) / 0.55) 0%, hsl(var(--background) / 0.10) 18%, transparent 38%, transparent 50%, hsl(var(--background) / 0.40) 70%, hsl(var(--background) / 0.92) 92%, hsl(var(--background)) 100%)",
          }}
        />

        {/* Subtle warm vignette around edges */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 50%, transparent 50%, hsl(var(--background) / 0.4) 100%)",
          }}
        />
      </div>

      {/* CONTENT — bottom-aligned, like Goiko hero */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        {/* Spacer for navbar */}
        <div className="h-16 lg:h-[72px] flex-shrink-0" aria-hidden />

        {/* Top-right floating "label" pill — like Goiko featured product tag */}
        <div className="px-5 lg:px-10 mt-3 flex justify-end">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full backdrop-blur-md bg-foreground/10 border border-foreground/15 px-3 py-1.5 text-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-primary animate-breath" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-mono tabular text-[10px] font-semibold tracking-[0.18em] uppercase">
              Stile in mostra · Renaissance
            </span>
          </motion.div>
        </div>

        {/* Spacer pushes text toward bottom */}
        <div className="flex-1" />

        {/* MAIN CONTENT BLOCK — bottom-left, Goiko style */}
        <div className="container px-5 lg:px-10 pb-10 lg:pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-8 lg:gap-12">

            {/* Left — copy + CTAs (cols 1-7) */}
            <div className="lg:col-span-7">
              {/* Headline — huge bold display */}
              <motion.h1
                id="hero-heading"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.85, ease }}
                className="text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tightest leading-[0.96] text-foreground"
                style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif" }}
              >
                <span className="block">Il tuo cane</span>
                <span className="block">è già un re.</span>
                <span className="block text-primary mt-1 lg:mt-2">In 60 secondi, diventa un quadro.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7, ease }}
                className="mt-6 max-w-[52ch] text-base sm:text-lg lg:text-xl text-foreground/85 leading-relaxed"
              >
                Renaissance, watercolor, oil. <span className="font-semibold text-foreground">12 stili</span> dipinti dall'AI. Stampati su tela e spediti in 48h, in tutta Italia.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.6, ease }}
                className="mt-7 lg:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              >
                <Link
                  to={session ? "/generate" : "/signup"}
                  className="rounded-full"
                  tabIndex={-1}
                  aria-label="Crea il ritratto"
                >
                  <MagneticButton
                    className="w-full sm:w-auto h-14 px-9 rounded-full text-base font-semibold bg-primary text-primary-foreground shadow-tinted btn-press"
                    strength={0.32}
                  >
                    <span>Crea il ritratto</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                  </MagneticButton>
                </Link>

                <a
                  href="#gallery"
                  className="inline-flex items-center justify-center gap-2 rounded-full h-14 px-7 text-base font-medium border border-foreground/25 text-foreground hover:bg-foreground/10 hover:border-foreground/40 backdrop-blur-sm transition-colors btn-press"
                >
                  <span>Vedi gli stili</span>
                </a>
              </motion.div>

              {/* Microtrust */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="mt-4 text-sm text-foreground/60"
              >
                3 ritratti gratis quando ti iscrivi. Niente carta di credito.
              </motion.p>
            </div>

            {/* Right — stats column (cols 8-12) */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.95, duration: 0.8, ease }}
              className="lg:col-span-4 lg:col-start-9"
            >
              <div className="rounded-2xl backdrop-blur-md bg-foreground/5 border border-foreground/15 p-5 lg:p-6">
                <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-foreground/55 mb-3">
                  Live
                </div>

                <div className="flex items-baseline gap-2">
                  <div className="font-mono tabular text-3xl lg:text-4xl font-bold text-foreground tracking-tightest leading-none">
                    {formattedCount}
                  </div>
                  <div className="text-sm text-foreground/70">ritratti</div>
                </div>
                <div className="text-xs text-foreground/55 mt-1">creati su Artlypet</div>

                <div className="mt-5 pt-5 border-t border-foreground/15 grid grid-cols-3 gap-3">
                  <div>
                    <div className="font-mono tabular text-lg font-semibold text-foreground leading-none">12</div>
                    <div className="text-[10px] text-foreground/55 mt-1.5 leading-tight">stili</div>
                  </div>
                  <div>
                    <div className="font-mono tabular text-lg font-semibold text-foreground leading-none">~60<span className="text-xs text-foreground/55">s</span></div>
                    <div className="text-[10px] text-foreground/55 mt-1.5 leading-tight">tempo<br />medio</div>
                  </div>
                  <div>
                    <div className="font-mono tabular text-lg font-semibold text-foreground leading-none">48<span className="text-xs text-foreground/55">h</span></div>
                    <div className="text-[10px] text-foreground/55 mt-1.5 leading-tight">stampa<br />in Italia</div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>

      {/* Scroll indicator — subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 hidden lg:block"
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-foreground/40 to-transparent" />
      </motion.div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
