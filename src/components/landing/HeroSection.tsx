import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { usePortraitCount } from "@/hooks/usePortraitCount";

const ease = [0.16, 1, 0.3, 1] as const;

const HeroSection = memo(() => {
  const { session } = useAuth();
  const { data: portraitCount } = usePortraitCount();
  const hasRealCount = typeof portraitCount === "number" && portraitCount > 0;

  return (
    <section
      className="relative min-h-[100dvh] w-full overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      {/* FULL-BLEED Renaissance — the icon. object-position tuned to keep face centered without ear-clipping. */}
      <div className="absolute inset-0">
        <img
          src="/images/renaissance.webp"
          alt="Ritratto Renaissance di un cane — Artlypet"
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 30%" }}
          loading="eager"
          fetchPriority="high"
          draggable={false}
        />

        {/* Top wash for navbar legibility */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-44 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--background) / 0.75) 0%, hsl(var(--background) / 0.30) 60%, transparent 100%)",
          }}
        />

        {/* Bottom wash for content legibility */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, hsl(var(--background) / 0.50) 35%, hsl(var(--background) / 0.92) 75%, hsl(var(--background)) 100%)",
          }}
        />

        {/* Local spotlight under bottom-left text */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(70% 55% at 22% 90%, hsl(var(--background) / 0.55) 0%, hsl(var(--background) / 0.20) 50%, transparent 78%)",
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        {/* navbar spacer */}
        <div className="h-16 lg:h-[72px] flex-shrink-0" aria-hidden />

        {/* TOP-RIGHT pill — "Stile in mostra" */}
        <div className="px-5 lg:px-10 mt-4 flex justify-end">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full backdrop-blur-md bg-foreground/10 border border-foreground/20 px-3 py-1.5 text-foreground"
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

        <div className="flex-1" />

        {/* MAIN BLOCK */}
        <div className="container px-5 lg:px-10 pb-8 lg:pb-12">
          {/* Headline + sub + CTAs */}
          <div className="max-w-4xl">
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.85, ease }}
              className="font-bold tracking-tightest leading-[0.96] text-foreground"
              style={{
                fontFamily: "'Cabinet Grotesk', system-ui, sans-serif",
                fontSize: "clamp(2.5rem, 7.2vw, 5.5rem)",
                textWrap: "balance" as React.CSSProperties["textWrap"],
              }}
            >
              <span className="block">Il tuo cane è già un re.</span>
              <span className="block text-primary mt-1 lg:mt-1.5">In 60 secondi, in cornice.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7, ease }}
              className="mt-5 lg:mt-6 max-w-[54ch] text-base sm:text-lg lg:text-xl text-foreground/85 leading-relaxed"
            >
              Renaissance, watercolor, oil. <span className="font-semibold text-foreground">12 stili</span> dipinti dall'AI. Stampati su tela e spediti in 48h, in tutta Italia.
            </motion.p>

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
                  className="w-full sm:w-auto h-15 px-10 rounded-full text-base lg:text-[17px] font-semibold bg-primary text-primary-foreground shadow-tinted btn-press"
                  strength={0.32}
                >
                  <span>Crea il ritratto</span>
                  <ArrowUpRight className="h-4 w-4 lg:h-5 lg:w-5" strokeWidth={2.25} />
                </MagneticButton>
              </Link>

              <a
                href="#gallery"
                className="inline-flex items-center justify-center gap-2 rounded-full h-15 px-7 lg:px-8 text-base lg:text-[17px] font-medium border border-foreground/30 text-foreground hover:bg-foreground/10 hover:border-foreground/50 backdrop-blur-sm transition-colors btn-press"
              >
                <span>Vedi gli stili</span>
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="mt-4 text-sm text-foreground/65"
            >
              3 ritratti gratis quando ti iscrivi. Niente carta di credito.
            </motion.p>
          </div>
        </div>

        {/* HORIZONTAL STATS STRIP — full-width bottom, glass refraction, Goiko-style stat band */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7, ease }}
          className="border-t border-foreground/10 backdrop-blur-md bg-background/40"
        >
          <div className="container px-5 lg:px-10 py-4 lg:py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {/* Live counter — only shows real number when DB has data */}
              {hasRealCount ? (
                <StatCellHero
                  value={portraitCount.toLocaleString("it-IT")}
                  label="ritratti creati"
                  pulse
                />
              ) : (
                <StatCellHero value="12" label="stili dipinti a mano" />
              )}
              <StatCellHero value="~60" suffix="s" label="tempo medio" />
              <StatCellHero value="48" suffix="h" label="stampa & spedizione" />
              <StatCellHero value="EU" label="server & GDPR-clean" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

const StatCellHero = ({
  value,
  suffix,
  label,
  pulse,
}: {
  value: string;
  suffix?: string;
  label: string;
  pulse?: boolean;
}) => (
  <div className="flex items-baseline gap-2">
    {pulse && (
      <span className="relative flex h-1.5 w-1.5 mr-1 self-center">
        <span className="absolute inset-0 rounded-full bg-primary animate-breath" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
    )}
    <div className="font-mono tabular text-2xl lg:text-3xl font-bold text-foreground tracking-tightest leading-none">
      {value}
      {suffix && <span className="text-sm text-foreground/60 font-normal">{suffix}</span>}
    </div>
    <div className="text-xs text-foreground/65 leading-tight">{label}</div>
  </div>
);

HeroSection.displayName = "HeroSection";

export default HeroSection;
