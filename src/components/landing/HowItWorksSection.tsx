import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Upload, Palette, Download, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MagneticButton } from "@/components/ui/magnetic-button";

const steps = [
  {
    icon: Upload,
    titleKey: "howItWorks.step1Title",
    descKey: "howItWorks.step1Desc",
    time: "10s",
    num: "01",
    visual: "/images/oil-painting.jpg",
    visualLabel: "Original photo",
  },
  {
    icon: Palette,
    titleKey: "howItWorks.step2Title",
    descKey: "howItWorks.step2Desc",
    time: "5s",
    num: "02",
    visual: "/images/art-nouveau.webp",
    visualLabel: "Style: Art Nouveau",
  },
  {
    icon: Download,
    titleKey: "howItWorks.step3Title",
    descKey: "howItWorks.step3Desc",
    time: "~30s",
    num: "03",
    visual: "/images/renaissance.webp",
    visualLabel: "Final 2K portrait",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

const HowItWorksSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll progress drives the SVG path-draw between steps
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 30%"],
  });
  const pathProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.5 });
  const pathLength = useTransform(pathProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-36 bg-cream/40 overflow-hidden">
      {/* Subtle vertical band — left rail anchor */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block" />

      <div className="container relative px-6 lg:px-10">
        {/* Header — left-aligned, anti-center bias */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 lg:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="lg:col-span-5"
          >
            <span className="sec-label">{t("howItWorks.label", "The process")}</span>
            <h2 className="mt-4 font-serif font-bold text-4xl md:text-5xl lg:text-6xl tracking-tightest leading-[1.02] text-foreground">
              {(() => {
                const raw = t("howItWorks.title", "How It Works");
                const words = raw.split(" ");
                return words.map((w, i, arr) =>
                  i === arr.length - 1
                    ? <span key={i} className="text-accent-em italic">{w}</span>
                    : <span key={i}>{w} </span>,
                );
              })()}
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="lg:col-span-6 lg:col-start-7 self-end text-lg text-muted-foreground leading-relaxed max-w-[55ch]"
          >
            {t("howItWorks.subtitle", "Three precise steps. No setup, no skills required. Your portrait is print-ready before the kettle boils.")}
          </motion.p>
        </div>

        {/* Steps — zig-zag 2-col, with scroll-drawn vertical path on desktop */}
        <div className="relative max-w-6xl mx-auto">
          {/* SVG scroll path — draws as user scrolls. Hidden on mobile. */}
          <svg
            aria-hidden
            className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-12 bottom-12 w-2 h-[calc(100%-6rem)]"
            viewBox="0 0 4 1000"
            preserveAspectRatio="none"
          >
            <line x1="2" y1="0" x2="2" y2="1000" stroke="hsl(var(--border))" strokeWidth="1.5" />
            <motion.line
              x1="2" y1="0" x2="2" y2="1000"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          <ol className="space-y-24 lg:space-y-32">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isReversed = i % 2 === 1;
              return (
                <motion.li
                  key={step.num}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.7, ease }}
                  className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
                >
                  {/* Visual (image) */}
                  <div className={`lg:col-span-5 ${isReversed ? "lg:col-start-8" : "lg:col-start-1"}`}>
                    <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-[2rem] overflow-hidden bento-card group">
                      <img
                        src={step.visual}
                        alt={step.visualLabel}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      {/* Step badge — over the image, top-left */}
                      <div className="absolute top-5 left-5 glass-refraction rounded-full px-3 py-1.5 flex items-center gap-2">
                        <span className="font-mono tabular text-xs font-semibold text-foreground">{step.num}</span>
                        <span className="h-3 w-px bg-border" />
                        <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                          {step.visualLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Copy */}
                  <div className={`lg:col-span-6 ${isReversed ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-7"}`}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="inline-flex items-center justify-center h-11 w-11 rounded-2xl bg-primary/12 text-primary">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inset-0 rounded-full bg-primary animate-breath" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                        </span>
                        <span className="font-mono tabular text-xs font-semibold text-foreground">{step.time}</span>
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-3xl lg:text-4xl tracking-tight text-foreground leading-[1.1] mb-4">
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-[48ch]">
                      {t(step.descKey)}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* CTA — left-aligned, not centered (anti-center bias) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
        >
          <div className="lg:col-span-7 lg:col-start-3 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Link to="/signup" className="rounded-full" tabIndex={-1}>
              <MagneticButton
                className="shimmer-btn rounded-full h-14 px-8 text-base font-semibold shadow-tinted"
                strength={0.30}
              >
                <span>{t("howItWorks.cta", "Start creating — it's free")}</span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
              </MagneticButton>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("howItWorks.ctaSub", "Ready in under 1 minute · No card needed")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
