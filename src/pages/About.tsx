import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Heart, Sparkles, Globe, Palette, ArrowUpRight } from "lucide-react";
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

const About = () => {
  const { t } = useTranslation();

  const values = [
    { icon: Heart,     titleKey: "about.value1Title", titleFallback: "Pet love",         descKey: "about.value1Desc", descFallback: "Every pet is family. Family deserves a piece worth framing." },
    { icon: Sparkles,  titleKey: "about.value2Title", titleFallback: "AI excellence",    descKey: "about.value2Desc", descFallback: "Built on Google Gemini 3.1, fine-tuned with hand-written prompts per style." },
    { icon: Palette,   titleKey: "about.value3Title", titleFallback: "Artistic quality", descKey: "about.value3Desc", descFallback: "Every style is curated by hand. No template farm output." },
    { icon: Globe,     titleKey: "about.value4Title", titleFallback: "EU-first",         descKey: "about.value4Desc", descFallback: "Servers in the EU, GDPR-clean, prints shipped across the union." },
  ];

  // Honest, verifiable stats only — no inflated "10,000+ users" claims.
  const stats = [
    { valueKey: "about.stat1Value", value: "12",  unit: "",     label: t("about.stat1Label", "Hand-tuned painting styles") },
    { valueKey: "about.stat2Value", value: "5",   unit: "",     label: t("about.stat2Label", "Languages out of the box") },
    { valueKey: "about.stat3Value", value: "47",  unit: "s",    label: t("about.stat3Label", "Average generation time") },
    { valueKey: "about.stat4Value", value: "2K",  unit: "",     label: t("about.stat4Label", "Print-ready resolution") },
  ];

  return (
    <main className="app-ui min-h-[100dvh] bg-background">
      <SEOHead
        title="About Artlypet — museum-quality AI pet portraits"
        description="The team behind Artlypet, the AI pet portrait studio. EU-hosted, GDPR-clean, twelve hand-tuned painting styles, optional canvas print fulfilment."
        canonical="/about"
      />
      <Navbar />

      {/* HERO — left aligned, anti-center */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent 70%)" }}
        />
        <div className="container relative px-5 lg:px-10">
          <motion.div {...fadeUp} className="max-w-3xl">
            <span className="sec-label">{t("about.kicker", "About us")}</span>
            <h1 className="mt-4 font-serif font-bold text-4xl md:text-5xl lg:text-[4.25rem] tracking-tightest leading-[1.02] text-foreground">
              {t("about.title", "We make pets look like ")}
              <span className="text-accent-em italic">{t("about.titleAccent", "museum pieces.")}</span>
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-[58ch]">
              {t(
                "about.subtitle",
                "Artlypet is a small, EU-based studio building the AI pet portrait service we wanted ourselves: instant, beautiful, no subscription trap, and prints that actually look good on a wall.",
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* MISSION — split column */}
      <section className="py-20 bg-cream/40">
        <div className="container px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <motion.div {...fadeUp} className="lg:col-span-5">
              <span className="sec-label">{t("about.missionLabel", "Mission")}</span>
              <h2 className="mt-4 font-serif font-bold text-3xl md:text-4xl lg:text-5xl tracking-tightest leading-[1.05] text-foreground">
                {t("about.missionTitle", "Why this exists.")}
              </h2>
            </motion.div>
            <motion.div {...fadeUp} className="lg:col-span-7 self-end">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t(
                  "about.missionDesc",
                  "Pet owners spend more on their animals every year, but the keepsake market is stuck on plastic mugs and fridge magnets. AI changed what's possible — instant, museum-grade portraits at a fair price. We're not the first to try this, but we're the first one in Europe that's hand-tuning every style, hosting in-region, and shipping prints that you'd actually frame.",
                )}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES — Bento 2-col */}
      <section className="py-20 lg:py-28">
        <div className="container px-5 lg:px-10">
          <motion.div {...fadeUp} className="mb-12 max-w-2xl">
            <span className="sec-label">{t("about.valuesLabel", "Values")}</span>
            <h2 className="mt-4 font-serif font-bold text-3xl md:text-4xl lg:text-5xl tracking-tightest leading-[1.05] text-foreground">
              {t("about.valuesTitle", "What we hold to.")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 max-w-5xl">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.07, duration: 0.55, ease }}
                  className="bento-card p-7 lg:p-8 card-hover"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary mb-5">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">
                    {t(value.titleKey, value.titleFallback)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(value.descKey, value.descFallback)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS — divide-x, mono numerals (skill: cockpit mode for technical numbers) */}
      <section className="py-20 bg-cream/40">
        <div className="container px-5 lg:px-10">
          <motion.div
            {...fadeUp}
            className="bento-card divide-y sm:divide-y-0 sm:divide-x divide-border grid grid-cols-2 sm:grid-cols-4 max-w-5xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="p-6 lg:p-8 text-center">
                <div className="font-mono tabular text-4xl lg:text-5xl font-bold text-foreground tracking-tightest leading-none">
                  {stat.value}
                  {stat.unit && <span className="text-base text-muted-foreground font-normal">{stat.unit}</span>}
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-tight">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="py-20 lg:py-28">
        <div className="container px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 max-w-5xl mx-auto">
            <motion.div {...fadeUp} className="lg:col-span-5">
              <span className="sec-label">{t("about.techLabel", "Under the hood")}</span>
              <h2 className="mt-4 font-serif font-bold text-3xl md:text-4xl tracking-tightest leading-[1.05] text-foreground">
                {t("about.techTitle", "What's running this.")}
              </h2>
            </motion.div>
            <motion.div {...fadeUp} className="lg:col-span-7 self-end">
              <ul className="space-y-3 text-base text-muted-foreground leading-relaxed">
                <li><span className="text-foreground font-semibold">Google Gemini 3.1 Flash Image Preview</span> — the AI model that paints your pet.</li>
                <li><span className="text-foreground font-semibold">Supabase</span> — EU-hosted Postgres, storage, auth, edge functions.</li>
                <li><span className="text-foreground font-semibold">Stripe</span> — payments, EU methods (card, Apple Pay, Google Pay, SEPA).</li>
                <li><span className="text-foreground font-semibold">Vite + React + Tailwind</span> — the studio you're using right now.</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-cream/40">
        <div className="container px-5 lg:px-10">
          <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-end">
            <div className="lg:col-span-7">
              <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl tracking-tightest leading-[1.05] text-foreground">
                {t("about.ctaTitle", "Make one for your pet.")}
              </h2>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {t("about.ctaDesc", "Free signup includes 3 portraits. No card required.")}
              </p>
            </div>
            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <Link to="/signup" className="rounded-full" tabIndex={-1}>
                <MagneticButton
                  className="shimmer-btn rounded-full h-14 px-8 text-base font-semibold shadow-tinted"
                  strength={0.30}
                >
                  <span>{t("about.ctaButton", "Get started")}</span>
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

export default About;
