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
  const formattedCount = hasRealCount ? portraitCount.toLocaleString("it-IT") : null;

  return (
    <section
      className="relative min-h-[100dvh] w-full overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      {/* FULL-BLEED Renaissance portrait — the hero */}
      <div className="absolute inset-0">
        <img
          src="/images/renaissance.webp"
          alt="Ritratto Renaissance di un cane — Artlypet"
          className="h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          draggable={false}
        />

        {/* Strong directional gradient — guarantees text readability bottom-left */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--background) / 0.55) 0%, hsl(var(--background) / 0.10) 18%, transparent 38%, transparent 50%, hsl(var(--background) / 0.55) 70%, hsl(var(--background) / 0.95) 100%)",
          }}
        />

        {/* Bottom-left local "spotlight" — extra dark wash exactly under the copy block */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 50% at 25% 92%, hsl(var(--background) / 0.85) 0%, hsl(var(--background) / 0.45) 50%, transparent 80%)",
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        {/* Spacer for navbar (its height varies based on PromoBanner) */}
        <div className="h-16 lg:h-[72px] flex-shrink-0" aria-hidden />

        {/* Top-right floating "now showing" pill */}
        <div className="px-5 lg:px-10 mt-4 flex justify-end">
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

        <div className="flex-1" />

        {/* MAIN CONTENT — bottom-left, Goiko style */}
        <div className="container px-5 lg:px-10 pb-12 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-y-10 gap-x-10">

            {/* COPY — cols 1-8 (more breathing room than before) */}
            <div className="lg:col-span-8">
              <motion.h1
                id="hero-heading"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.85, ease }}
                className="font-bold tracking-tightest leading-[0.96] text-foreground"
                style={{
                  fontFamily: "'Cabinet Grotesk', system-ui, sans-serif",
                  textWrap: "balance" as React.CSSProperties["textWrap"],
                  fontSize: "clamp(2.5rem, 7vw, 5.25rem)",
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

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="mt-4 text-sm text-foreground/60"
              >
                3 ritratti gratis quando ti iscrivi. Niente carta di credito.
              </motion.p>
            </div>

            {/* STATS — cols 9-12. Layout adapts to whether real DB count exists. */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.95, duration: 0.8, ease }}
              className="lg:col-span-4 lg:col-start-9 lg:self-end"
            >
              <div className="rounded-2xl backdrop-blur-md bg-foreground/8 border border-foreground/15 p-5">
                {hasRealCount ? (
                  <>
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
                      <StatCell value="12" label="stili" />
                      <StatCell value="~60" suffix="s" label={"tempo\nmedio"} />
                      <StatCell value="48" suffix="h" label={"stampa\nin Italia"} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-foreground/55 mb-4">
                      In numeri
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <StatCell value="12" label="stili" big />
                      <StatCell value="~60" suffix="s" label={"tempo\nmedio"} big />
                      <StatCell value="48" suffix="h" label={"stampa\nin Italia"} big />
                    </div>
                  </>
                )}
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </section>
  );
});

const StatCell = ({
  value,
  suffix,
  label,
  big,
}: {
  value: string;
  suffix?: string;
  label: string;
  big?: boolean;
}) => (
  <div>
    <div className={`font-mono tabular font-semibold text-foreground leading-none ${big ? "text-2xl" : "text-lg"}`}>
      {value}
      {suffix && <span className="text-xs text-foreground/55 font-normal">{suffix}</span>}
    </div>
    <div className="text-[10px] text-foreground/55 mt-1.5 leading-tight whitespace-pre-line">{label}</div>
  </div>
);

HeroSection.displayName = "HeroSection";

export default HeroSection;
