import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { usePortraitCount } from "@/hooks/usePortraitCount";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const ease = [0.16, 1, 0.3, 1] as const;

// Char-by-char split text — Italian-aware (Array.from() splits unicode correctly).
// Stagger feels alive without being twee. Single play on mount.
const SplitText = ({
  text,
  delay = 0,
  className,
  charDelay = 0.025,
  reduce = false,
}: {
  text: string;
  delay?: number;
  className?: string;
  charDelay?: number;
  reduce?: boolean;
}) => {
  if (reduce) return <span className={className}>{text}</span>;
  const chars = Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          aria-hidden
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * charDelay,
            duration: 0.55,
            ease,
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
};

const HeroSection = memo(() => {
  const { session } = useAuth();
  const { data: portraitCount } = usePortraitCount();
  const hasRealCount = typeof portraitCount === "number" && portraitCount > 0;

  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // PARALLAX — image scrolls at 0.5x while user scrolls past hero.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "30%"]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.0, 1.08]);

  // CURSOR TILT 3D — image rotates slightly toward the cursor.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotX = useSpring(useTransform(tiltY, [-50, 50], [4, -4]), { stiffness: 150, damping: 20 });
  const rotY = useSpring(useTransform(tiltX, [-50, 50], [-4, 4]), { stiffness: 150, damping: 20 });

  const handleParallaxMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltX.set(((e.clientX - r.left) / r.width - 0.5) * 100);
    tiltY.set(((e.clientY - r.top) / r.height - 0.5) * 100);
  };
  const handleParallaxLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleParallaxMove}
      onMouseLeave={handleParallaxLeave}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      {/* PARALLAX + TILT layer */}
      <motion.div
        ref={portraitRef}
        className="absolute inset-0"
        style={{
          y: portraitY,
          scale: portraitScale,
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <img
          src="/images/renaissance.webp"
          alt="Ritratto Renaissance di un cane — Artlypet"
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 30%" }}
          loading="eager"
          fetchPriority="high"
          draggable={false}
        />
      </motion.div>

      {/* OVERLAYS — stacked above the parallaxing image so text stays readable */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top wash */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-44"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--background) / 0.75) 0%, hsl(var(--background) / 0.30) 60%, transparent 100%)",
          }}
        />
        {/* Bottom wash */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[58%]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, hsl(var(--background) / 0.55) 35%, hsl(var(--background) / 0.95) 78%, hsl(var(--background)) 100%)",
          }}
        />
        {/* Local spotlight under bottom-left text */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(72% 56% at 22% 90%, hsl(var(--background) / 0.55) 0%, hsl(var(--background) / 0.20) 50%, transparent 78%)",
          }}
        />
      </div>

      {/* CONTENT — pointer events restored on the actual content */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <div className="h-16 lg:h-[72px] flex-shrink-0" aria-hidden />

        {/* TOP-RIGHT pill */}
        <div className="px-5 lg:px-10 mt-4 flex justify-end">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease }}
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
          <div className="max-w-4xl">
            {/* Headline — char-by-char SplitText reveal */}
            <h1
              id="hero-heading"
              className="font-bold tracking-tightest leading-[0.96] text-foreground"
              style={{
                fontFamily: "'Cabinet Grotesk', system-ui, sans-serif",
                fontSize: "clamp(2.5rem, 7.2vw, 5.5rem)",
                textWrap: "balance" as React.CSSProperties["textWrap"],
              }}
            >
              <span className="block">
                <SplitText text="Il tuo cane è già un re." delay={0.25} reduce={!!reduceMotion} />
              </span>
              <span className="block text-primary mt-1 lg:mt-1.5">
                <SplitText text="In 60 secondi, in cornice." delay={1.05} reduce={!!reduceMotion} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.95, duration: 0.7, ease }}
              className="mt-5 lg:mt-6 max-w-[54ch] text-base sm:text-lg lg:text-xl text-foreground/85 leading-relaxed"
            >
              Renaissance, watercolor, oil. <span className="font-semibold text-foreground">12 stili</span> dipinti dall'AI. Stampati su tela e spediti in 48h, in tutta Italia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.15, duration: 0.6, ease }}
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
              transition={{ delay: 2.4, duration: 0.5 }}
              className="mt-4 text-sm text-foreground/65"
            >
              3 ritratti gratis quando ti iscrivi. Niente carta di credito.
            </motion.p>
          </div>
        </div>

        {/* HORIZONTAL STATS STRIP — counter-up on first view */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.7, ease }}
          className="border-t border-foreground/10 backdrop-blur-md bg-background/40"
        >
          <div className="container px-5 lg:px-10 py-4 lg:py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {hasRealCount ? (
                <StatCellCounter targetNumber={portraitCount!} label="ritratti creati" pulse />
              ) : (
                <StatCellCounter targetNumber={12} label="stili dipinti a mano" />
              )}
              <StatCellCounter targetNumber={60} prefix="~" suffix="s" label="tempo medio" />
              <StatCellCounter targetNumber={48} suffix="h" label="stampa & spedizione" />
              <StatCellStatic value="EU" label="server & GDPR-clean" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

const StatCellCounter = ({
  targetNumber,
  prefix,
  suffix,
  label,
  pulse,
}: {
  targetNumber: number;
  prefix?: string;
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
      {prefix}
      <AnimatedCounter
        to={targetNumber}
        format={(n) => n.toLocaleString("it-IT")}
        duration={1.4}
      />
      {suffix && <span className="text-sm text-foreground/60 font-normal">{suffix}</span>}
    </div>
    <div className="text-xs text-foreground/65 leading-tight">{label}</div>
  </div>
);

const StatCellStatic = ({ value, label }: { value: string; label: string }) => (
  <div className="flex items-baseline gap-2">
    <div className="font-mono tabular text-2xl lg:text-3xl font-bold text-foreground tracking-tightest leading-none">
      {value}
    </div>
    <div className="text-xs text-foreground/65 leading-tight">{label}</div>
  </div>
);

HeroSection.displayName = "HeroSection";

export default HeroSection;
