import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Upload,
  Palette,
  Sparkles,
  Download,
  Check,
  X,
  Camera,
  Sun,
  Focus,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import { SEOHead } from "@/components/SEOHead";
import { MagneticButton } from "@/components/ui/magnetic-button";

const ease = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65, ease },
};

const HowItWorksPage = () => {
  const { t } = useTranslation();

  const photoTips = [
    { icon: Sun,    titleKey: "howItWorksPage.tipLight",  titleFallback: "Good lighting", descKey: "howItWorksPage.tipLightDesc",  descFallback: "Natural daylight wins. Avoid harsh shadows or direct flash." },
    { icon: Focus,  titleKey: "howItWorksPage.tipFocus",  titleFallback: "Sharp focus",   descKey: "howItWorksPage.tipFocusDesc",  descFallback: "The pet's face needs to be tack-sharp. Blur kills the detail." },
    { icon: Camera, titleKey: "howItWorksPage.tipAngle",  titleFallback: "Eye level",     descKey: "howItWorksPage.tipAngleDesc",  descFallback: "Front-facing, eye-level or slightly above. Reads as a portrait." },
  ];

  const dos = [
    t("howItWorksPage.do1", "Well-lit, high-resolution photo"),
    t("howItWorksPage.do2", "Pet looking towards the camera"),
    t("howItWorksPage.do3", "Simple or clean background"),
    t("howItWorksPage.do4", "JPG or PNG, under 10 MB"),
  ];
  const donts = [
    t("howItWorksPage.dont1", "Blurry, dark or pixelated photos"),
    t("howItWorksPage.dont2", "Multiple pets in one shot"),
    t("howItWorksPage.dont3", "Pet facing away from camera"),
    t("howItWorksPage.dont4", "Heavy filters already applied"),
  ];

  const popularStyles = [
    { nameKey: "howItWorksPage.styleRoyal",      nameFallback: "Renaissance",    descKey: "howItWorksPage.styleRoyalDesc",      descFallback: "Royal oil, gilded frame, baroque drama." },
    { nameKey: "howItWorksPage.styleWatercolor", nameFallback: "Watercolour",    descKey: "howItWorksPage.styleWatercolourDesc", descFallback: "Soft pigment washes, paper grain." },
    { nameKey: "howItWorksPage.styleOil",        nameFallback: "Oil painting",   descKey: "howItWorksPage.styleOilDesc",        descFallback: "Rich texture, warm undertones." },
    { nameKey: "howItWorksPage.stylePopArt",     nameFallback: "Pop Art",        descKey: "howItWorksPage.stylePopArtDesc",     descFallback: "Flat colour, halftone weight." },
  ];

  const steps = [
    { num: "01", icon: Upload,   titleKey: "howItWorksPage.step1Title", titleFallback: "Upload your photo",   descKey: "howItWorksPage.step1Desc", descFallback: "Drag-and-drop or pick from your library. Most phone shots from the past year work great.", time: "10s" },
    { num: "02", icon: Palette,  titleKey: "howItWorksPage.step2Title", titleFallback: "Choose your style",   descKey: "howItWorksPage.step2Desc", descFallback: "Twelve hand-tuned styles. Each has a distinct palette, brush logic and composition.", time: "5s" },
    { num: "03", icon: Sparkles, titleKey: "howItWorksPage.step3Title", titleFallback: "AI paints the portrait", descKey: "howItWorksPage.step3Desc", descFallback: "Google Gemini generates a 2K portrait. Watermarked preview for free, HD on unlock.", time: "~30s" },
    { num: "04", icon: Download, titleKey: "howItWorksPage.step4Title", titleFallback: "Download or print",   descKey: "howItWorksPage.step4Desc", descFallback: "Full-resolution download, share link, or order a museum-grade canvas shipped EU-wide.", time: "Instant" },
  ];

  return (
    <main className="app-ui min-h-[100dvh] bg-background">
      <SEOHead
        title="How Artlypet works — three minutes from photo to museum-grade portrait"
        description="See exactly how Artlypet turns a pet photo into an artistic portrait. Photo tips, art-style guide, AI specs, and how to print on canvas."
        canonical="/how-it-works"
      />
      <Navbar />

      {/* HERO */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-20 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.16), transparent 70%)" }}
        />
        <div className="container relative px-5 lg:px-10">
          <motion.div {...fadeUp} className="max-w-3xl">
            <span className="sec-label">{t("howItWorksPage.kicker", "How it works")}</span>
            <h1 className="mt-4 font-serif font-bold text-4xl md:text-5xl lg:text-[4rem] tracking-tightest leading-[1.02] text-foreground">
              {t("howItWorksPage.title", "Photo in, portrait out. ")}
              <span className="text-accent-em italic">{t("howItWorksPage.titleAccent", "About a minute.")}</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-[58ch]">
              {t("howItWorksPage.subtitle", "Four steps end-to-end, plus a quick guide on which photos work best so you don't waste a credit.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* STEPS — vertical timeline (anti-3-card) */}
      <section className="py-20 bg-cream/40">
        <div className="container px-5 lg:px-10">
          <ol className="space-y-14 lg:space-y-16 max-w-5xl mx-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isReversed = i % 2 === 1;
              return (
                <motion.li
                  key={step.num}
                  {...fadeUp}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                  <div className={`lg:col-span-5 ${isReversed ? "lg:col-start-8" : ""}`}>
                    <div className="bento-card-lg p-8 lg:p-10 flex flex-col items-start">
                      <span className="font-mono tabular text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-4">
                        {t("howItWorksPage.stepLabel", "Step {{num}}", { num: i + 1 })}
                      </span>
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary mb-5">
                        <Icon className="h-6 w-6" strokeWidth={1.75} />
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inset-0 rounded-full bg-primary animate-breath" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                        </span>
                        <span className="font-mono tabular text-xs font-semibold text-foreground">{step.time}</span>
                      </span>
                    </div>
                  </div>
                  <div className={`lg:col-span-6 ${isReversed ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-7"}`}>
                    <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground tracking-tight leading-tight mb-3">
                      {t(step.titleKey, step.titleFallback)}
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed max-w-[48ch]">
                      {t(step.descKey, step.descFallback)}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* PHOTO TIPS — Bento */}
      <section className="py-20 lg:py-28">
        <div className="container px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 max-w-6xl mx-auto">
            <motion.div {...fadeUp} className="lg:col-span-7">
              <span className="sec-label">{t("howItWorksPage.photoLabel", "What to upload")}</span>
              <h2 className="mt-4 font-serif font-bold text-3xl md:text-4xl lg:text-5xl tracking-tightest leading-[1.05] text-foreground">
                {t("howItWorksPage.photoTitle", "The photo decides the result.")}
              </h2>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-[55ch]">
                {t("howItWorksPage.photoSub", "Three signals matter most: light, focus, angle. Get those right and any of the twelve styles hit.")}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
            {/* Photo tips column */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {photoTips.map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.07, duration: 0.5, ease }}
                    className="bento-card p-5 card-hover"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary mb-3">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <div className="text-sm font-bold text-foreground tracking-tight">
                      {t(tip.titleKey, tip.titleFallback)}
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {t(tip.descKey, tip.descFallback)}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Do / Don't divide */}
            <motion.div
              {...fadeUp}
              className="lg:col-span-5 bento-card divide-y divide-border"
            >
              <div className="p-6">
                <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-primary mb-3 inline-flex items-center gap-1.5">
                  <Check className="h-3 w-3" strokeWidth={3} /> {t("howItWorksPage.do", "Do")}
                </div>
                <ul className="space-y-2">
                  {dos.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed">
                      <Check className="h-3.5 w-3.5 mt-1 text-primary shrink-0" strokeWidth={2.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6">
                <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-destructive mb-3 inline-flex items-center gap-1.5">
                  <X className="h-3 w-3" strokeWidth={3} /> {t("howItWorksPage.dont", "Don't")}
                </div>
                <ul className="space-y-2">
                  {donts.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                      <X className="h-3.5 w-3.5 mt-1 text-destructive shrink-0" strokeWidth={2.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* POPULAR STYLES — light teaser, link to /styles */}
      <section className="py-20 bg-cream/40">
        <div className="container px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
            <motion.div {...fadeUp} className="lg:col-span-7">
              <span className="sec-label">{t("howItWorksPage.stylesLabel", "Pick a style")}</span>
              <h2 className="mt-4 font-serif font-bold text-3xl md:text-4xl lg:text-5xl tracking-tightest leading-[1.05] text-foreground">
                {t("howItWorksPage.stylesTitle", "Four of the twelve.")}
              </h2>
            </motion.div>
            <motion.p {...fadeUp} className="lg:col-span-5 self-end text-base text-muted-foreground leading-relaxed">
              {t("howItWorksPage.stylesSub", "These are the four most popular openings. The other eight are inside.")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {popularStyles.map((style, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.5, ease }}
                className="bento-card p-6 card-hover"
              >
                <h3 className="text-lg font-bold text-foreground tracking-tight mb-1.5">
                  {t(style.nameKey, style.nameFallback)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(style.descKey, style.descFallback)}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/styles"
              className="inline-flex items-center gap-2 rounded-full border border-border hover:border-primary px-5 py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors btn-press"
            >
              <span>{t("howItWorksPage.viewAll", "Browse all 12 styles")}</span>
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container px-5 lg:px-10">
          <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-end">
            <div className="lg:col-span-7">
              <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl tracking-tightest leading-[1.05] text-foreground">
                {t("howItWorksPage.ctaTitle", "Ready when you are.")}
              </h2>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {t("howItWorksPage.ctaDesc", "Free signup includes 3 portraits. No card needed.")}
              </p>
            </div>
            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <Link to="/signup" className="rounded-full" tabIndex={-1}>
                <MagneticButton
                  className="shimmer-btn rounded-full h-14 px-8 text-base font-semibold shadow-tinted"
                  strength={0.30}
                >
                  <span>{t("howItWorksPage.ctaButton", "Make your first portrait")}</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                </MagneticButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
};

export default HowItWorksPage;
