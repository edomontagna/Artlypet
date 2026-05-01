import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Building2,
  Palette,
  BarChart3,
  Headphones,
  Printer,
  Infinity as InfinityIcon,
  ImageIcon,
  Upload,
  Sparkles,
  TrendingUp,
  Check,
  Plus,
  Send,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SEOHead } from "@/components/SEOHead";
import { BUSINESS_PRICE_MONTHLY } from "@/lib/constants";
import { CONTACT } from "@/lib/site-config";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trackLead } from "@/hooks/useAnalytics";
import { MagneticButton } from "@/components/ui/magnetic-button";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  businessName: z.string().min(2, "Business name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease },
};

const BusinessPlan = () => {
  const { t } = useTranslation();
  const [portraitsPerMonth, setPortraitsPerMonth] = useState(50);

  const averagePrice = 20;
  const revenue = portraitsPerMonth * averagePrice;
  const netProfit = revenue - BUSINESS_PRICE_MONTHLY;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    const subject = `Early Access — ${data.businessName}`;
    const body = `Name: ${data.name}\nBusiness: ${data.businessName}\nEmail: ${data.email}\n\n${data.message || ""}`;
    const mailto = `mailto:${CONTACT.business}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");
    trackLead("business_form");
    toast.success(t("business.formSuccess", "Thanks. We'll get back to you within one working day."));
    reset();
  };

  // Steps — phrased as the eventual flow once white-label launches
  const steps = [
    { icon: Building2, titleKey: "business.step1Title", descKey: "business.step1Desc",
      titleFallback: "We set up your branded portal", descFallback: "Your logo, your colours, an embedded portal you can share via link or QR." },
    { icon: Upload, titleKey: "business.step2Title", descKey: "business.step2Desc",
      titleFallback: "Customers upload pet photos", descFallback: "Mobile-first, no app install. Two clicks, one upload." },
    { icon: Sparkles, titleKey: "business.step3Title", descKey: "business.step3Desc",
      titleFallback: "AI delivers in under 60 seconds", descFallback: "12 painting styles, HD downloads, optional canvas print fulfilment." },
    { icon: TrendingUp, titleKey: "business.step4Title", descKey: "business.step4Desc",
      titleFallback: "You set your own price", descFallback: "Charge €15–€30. Keep 100% of the margin above the flat subscription." },
  ];

  // Features — split honestly between live and roadmap so the page doesn't lie.
  const features = [
    { icon: ImageIcon, titleKey: "business.featStyles", titleFallback: "All 12 painting styles",
      descKey: "business.featStylesDesc", descFallback: "Renaissance, Watercolor, Pop Art, Oil, Art Nouveau, Impressionist, plus six more.", status: "live" },
    { icon: InfinityIcon, titleKey: "business.featUnlimited", titleFallback: "Unlimited generations",
      descKey: "business.featUnlimitedDesc", descFallback: "No per-image fees. One flat monthly cost.", status: "live" },
    { icon: Printer, titleKey: "business.featPrints", titleFallback: "Print fulfilment",
      descKey: "business.featPrintsDesc", descFallback: "Canvas prints shipped across the EU. Discounted for partners.", status: "live" },
    { icon: Palette, titleKey: "business.featWhiteLabel", titleFallback: "White-label branding",
      descKey: "business.featWhiteLabelDesc", descFallback: "Your logo, colour palette and (optional) custom subdomain.", status: "early-access" },
    { icon: BarChart3, titleKey: "business.featAnalytics", titleFallback: "Partner analytics",
      descKey: "business.featAnalyticsDesc", descFallback: "Generations, revenue and engagement metrics in real time.", status: "early-access" },
    { icon: Headphones, titleKey: "business.featSupport", titleFallback: "Priority support",
      descKey: "business.featSupportDesc", descFallback: "Direct chat with the team. Response within one working day.", status: "live" },
  ] as const;

  const faqs = [
    { qKey: "business.faq1Q", q: "How is this different from the consumer product I see on the homepage?", aKey: "business.faq1A", a: "The consumer product is the proof. The B2B layer adds branding, partner-side analytics, and a simpler way for your customers to pay through your channel. We're rolling it out to a small early-access cohort first." },
    { qKey: "business.faq2Q", q: "Can I really set my own price per portrait?", aKey: "business.faq2A", a: "Yes. The €200/month is a flat platform fee. Whatever you charge end-customers above that — typically €15–€30 — is yours." },
    { qKey: "business.faq3Q", q: "Is there a contract or commitment?", aKey: "business.faq3A", a: "No. Month-to-month, cancel anytime, 14-day free trial when we onboard you." },
    { qKey: "business.faq4Q", q: "What about GDPR and data?", aKey: "business.faq4A", a: "EU-hosted infrastructure. Customer photos are auto-deleted after 30 days. Audit logs on every sensitive operation." },
    { qKey: "business.faq5Q", q: "When will white-label launch?", aKey: "business.faq5A", a: "Early access starts with a hand-picked first cohort. Submit the form below and we'll let you know when your slot opens." },
  ];

  const included = [
    { key: "business.incPortal",       label: "Branded portal (early-access cohort first)" },
    { key: "business.incGenerations",  label: "Unlimited AI generations" },
    { key: "business.incHd",           label: "Full HD downloads" },
    { key: "business.incStyles",       label: "All 12 painting styles" },
    { key: "business.incAnalytics",    label: "Analytics dashboard (in build)" },
    { key: "business.incSupport",      label: "Priority email & chat support" },
    { key: "business.incPrints",       label: "Discounted print fulfilment" },
    { key: "business.incOnboarding",   label: "Hands-on onboarding" },
    { key: "business.incUpdates",      label: "New styles & features included" },
  ];

  return (
    <div className="app-ui min-h-[100dvh] bg-background">
      <SEOHead
        title="Artlypet for Business — early access for pet shops, vets and toelettature"
        description="Add an AI pet portrait service to your pet business under your own brand. Flat €200/month, unlimited generations, optional canvas print fulfilment. Early access cohort opening now."
        canonical="/business"
      />

      {/* Header */}
      <header className="sticky top-0 z-30 h-16 glass-refraction border-b border-border/60">
        <div className="container mx-auto h-full flex items-center px-5 lg:px-8">
          <Link
            to="/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors btn-press mr-3"
            aria-label={t("nav.home", "Home")}
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <Link to="/" className="font-serif text-xl font-bold text-foreground">Artlypet</Link>
          <div className="ml-auto">
            <Link to="#contact" className="rounded-full" tabIndex={-1}>
              <MagneticButton
                className="rounded-full h-10 px-5 text-sm font-semibold bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors"
                strength={0.28}
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span>{t("business.headerCta", "Apply")}</span>
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
              </MagneticButton>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO — asymmetric, honest "early access" positioning */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.16), transparent 70%)" }}
        />
        <div className="container relative px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1.5 mb-7">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-primary animate-breath" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/80">
                  {t("business.badge", "Early access · pet shops, vets, toelettature")}
                </span>
              </div>

              <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-[4.5rem] tracking-tightest leading-[1.02] text-foreground">
                {t("business.heroTitle", "Sell AI pet portraits ")}
                <span className="text-accent-em italic">{t("business.heroTitleAccent", "under your own brand.")}</span>
              </h1>

              <p className="mt-6 max-w-[58ch] text-lg lg:text-xl text-muted-foreground leading-relaxed">
                {t(
                  "business.heroSubtitle",
                  "We handle the AI, the prints, the EU shipping. You handle the customer relationship and keep the margin. Flat €200/month, no per-image fees, no contract.",
                )}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
                <a href="#contact" className="rounded-full" tabIndex={-1}>
                  <MagneticButton
                    className="shimmer-btn rounded-full h-14 px-8 text-base font-semibold shadow-tinted"
                    strength={0.30}
                  >
                    <span>{t("business.heroCtaPrimary", "Apply for early access")}</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                  </MagneticButton>
                </a>
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-full h-14 px-7 text-base font-medium border border-border hover:border-primary hover:text-primary transition-colors btn-press"
                >
                  <span>{t("business.heroCtaSecondary", "See the maths")}</span>
                </a>
              </div>
            </div>

            {/* Right side — concrete proof tiles */}
            <div className="lg:col-span-4">
              <dl className="bento-card-lg p-7 grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">{t("business.statFee", "Flat fee")}</dt>
                  <dd className="mt-1 font-mono tabular text-3xl font-bold text-foreground">€{BUSINESS_PRICE_MONTHLY}<span className="text-sm text-muted-foreground">/mo</span></dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">{t("business.statBreak", "Break-even")}</dt>
                  <dd className="mt-1 font-mono tabular text-3xl font-bold text-foreground">10<span className="text-sm text-muted-foreground"> sales</span></dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">{t("business.statTrial", "Trial")}</dt>
                  <dd className="mt-1 font-mono tabular text-3xl font-bold text-foreground">14<span className="text-sm text-muted-foreground"> days</span></dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">{t("business.statSetup", "Setup")}</dt>
                  <dd className="mt-1 font-mono tabular text-3xl font-bold text-foreground">48<span className="text-sm text-muted-foreground">h</span></dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM/SOLUTION — left aligned */}
      <section className="py-20 bg-cream/40">
        <div className="container px-5 lg:px-10">
          <motion.div {...fadeUp} className="max-w-3xl">
            <span className="sec-label">{t("business.problemLabel", "Why this works")}</span>
            <h2 className="mt-4 font-serif font-bold text-3xl md:text-4xl lg:text-5xl tracking-tightest leading-[1.05] text-foreground">
              {t("business.problemTitle", "Pet owners spend €1,200+ per year on their animals. Most of that money never touches your shop.")}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-[60ch]">
              {t("business.problemDesc", "AI portraits are the upsell that fits any counter, any vet visit, any e-commerce checkout. Digital, instant, deeply personal — and the customer keeps something they share on social, which is free marketing for you.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS — 2-col zig-zag, anti-3-card */}
      <section className="py-24 lg:py-32">
        <div className="container px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <motion.div {...fadeUp} className="lg:col-span-5">
              <span className="sec-label">{t("business.howItWorksLabel", "The flow")}</span>
              <h2 className="mt-4 font-serif font-bold text-3xl md:text-4xl lg:text-5xl tracking-tightest leading-[1.05] text-foreground">
                {t("business.howItWorksTitle", "How it works for your business.")}
              </h2>
            </motion.div>
            <motion.p {...fadeUp} className="lg:col-span-6 lg:col-start-7 self-end text-base text-muted-foreground leading-relaxed">
              {t("business.howItWorksSubtitle", "Four steps. The first three are live today. The branded portal step is in the early-access cohort we're opening now.")}
            </motion.p>
          </div>

          <ol className="space-y-16 lg:space-y-20 max-w-5xl mx-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isReversed = i % 2 === 1;
              return (
                <motion.li
                  key={i}
                  {...fadeUp}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                  <div className={`lg:col-span-5 ${isReversed ? "lg:col-start-8" : "lg:col-start-1"}`}>
                    <div className="bento-card p-8 lg:p-10 flex flex-col items-start">
                      <div className="font-mono tabular text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-4">
                        {t("business.stepLabel", "Step {{num}}", { num: i + 1 })}
                      </div>
                      <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/12 text-primary">
                        <Icon className="h-6 w-6" strokeWidth={1.75} />
                      </div>
                    </div>
                  </div>
                  <div className={`lg:col-span-6 ${isReversed ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-7"}`}>
                    <h3 className="font-serif text-2xl lg:text-3xl font-bold text-foreground tracking-tight leading-tight mb-3">
                      {t(step.titleKey, step.titleFallback)}
                    </h3>
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

      {/* CALCULATOR */}
      <section id="calculator" className="py-20 bg-cream/40">
        <div className="container px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <motion.div {...fadeUp} className="lg:col-span-6">
              <span className="sec-label">{t("business.calcLabel", "The maths")}</span>
              <h2 className="mt-4 font-serif font-bold text-3xl md:text-4xl lg:text-5xl tracking-tightest leading-[1.05] text-foreground">
                {t("business.calcTitle", "What you'd actually take home.")}
              </h2>
            </motion.div>
            <motion.p {...fadeUp} className="lg:col-span-5 lg:col-start-8 self-end text-base text-muted-foreground leading-relaxed">
              {t("business.calcSubtitle", "Realistic monthly volumes for an independent pet business. Move the slider.")}
            </motion.p>
          </div>

          <motion.div {...fadeUp} className="bento-card-lg p-8 lg:p-12 max-w-4xl mx-auto">
            <div className="mb-9">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-semibold text-foreground">
                  {t("business.calcPortraitsLabel", "Portraits sold per month")}
                </Label>
                <span className="font-mono tabular text-3xl font-bold text-primary">{portraitsPerMonth}</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={portraitsPerMonth}
                onChange={(e) => setPortraitsPerMonth(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between font-mono tabular text-xs text-muted-foreground mt-2">
                <span>10</span>
                <span>55</span>
                <span>100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border bg-muted/30 rounded-2xl">
              <div className="p-6 text-center">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-2">{t("business.calcRevenue", "Monthly revenue")}</p>
                <p className="font-mono tabular text-3xl font-bold text-foreground">€{revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{portraitsPerMonth} × €{averagePrice}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-2">{t("business.calcSubscription", "Subscription")}</p>
                <p className="font-mono tabular text-3xl font-bold text-muted-foreground">−€{BUSINESS_PRICE_MONTHLY}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("business.calcFlatFee", "Flat monthly fee")}</p>
              </div>
              <div className="p-6 text-center bg-primary/8">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-primary mb-2">{t("business.calcProfit", "Net profit")}</p>
                <p className={`font-mono tabular text-3xl font-bold ${netProfit >= 0 ? "text-primary" : "text-destructive"}`}>
                  {netProfit >= 0 ? `€${netProfit.toLocaleString()}` : `−€${Math.abs(netProfit).toLocaleString()}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{t("business.calcPerMonth", "per month")}</p>
              </div>
            </div>

            {netProfit > 0 && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                {t("business.calcAnnual", "≈ €{{annual}} per year of pure margin", { annual: (netProfit * 12).toLocaleString() })}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* FEATURES — Bento with status pills (live vs early-access) */}
      <section className="py-24 lg:py-32">
        <div className="container px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <motion.div {...fadeUp} className="lg:col-span-7">
              <span className="sec-label">{t("business.featuresLabel", "What's included")}</span>
              <h2 className="mt-4 font-serif font-bold text-3xl md:text-4xl lg:text-5xl tracking-tightest leading-[1.05] text-foreground">
                {t("business.featuresTitle", "What you actually get.")}
              </h2>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-[55ch]">
                {t("business.featuresHonesty", "We label everything by status — what's live today versus what's rolling out to the early-access cohort. No marketing fiction.")}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              const isEA = feat.status === "early-access";
              return (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.06, duration: 0.55, ease }}
                  className="bento-card p-7 card-hover"
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase ${
                      isEA
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isEA ? "bg-amber-500" : "bg-primary animate-breath"}`} />
                      {isEA ? t("business.statusEA", "Early access") : t("business.statusLive", "Live")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">
                    {t(feat.titleKey, feat.titleFallback)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(feat.descKey, feat.descFallback)}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 bg-cream/40">
        <div className="container px-5 lg:px-10">
          <motion.div
            {...fadeUp}
            className="bento-card-lg p-8 lg:p-12 max-w-4xl mx-auto relative overflow-hidden"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full opacity-40 blur-3xl"
              style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent 70%)" }}
            />
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <span className="sec-label">{t("business.pricingLabel", "Pricing")}</span>
                <h2 className="mt-4 font-serif font-bold text-3xl lg:text-4xl tracking-tight leading-[1.05] text-foreground">
                  {t("business.pricingTitle", "One plan. Everything in.")}
                </h2>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-serif font-bold text-foreground text-6xl lg:text-7xl tracking-tightest">€{BUSINESS_PRICE_MONTHLY}</span>
                  <span className="text-base text-muted-foreground">/ {t("business.month", "month")}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("business.pricingSubtitle", "No contract. Cancel anytime. 14-day free trial when you join the early-access cohort.")}
                </p>
                <a href="#contact" className="rounded-full mt-7 inline-block" tabIndex={-1}>
                  <MagneticButton
                    className="shimmer-btn rounded-full h-13 px-8 text-base font-semibold shadow-tinted"
                    strength={0.30}
                  >
                    <span>{t("business.pricingCta", "Apply for early access")}</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                  </MagneticButton>
                </a>
              </div>
              <ul className="lg:col-span-7 space-y-3">
                {included.map((item) => (
                  <li key={item.key} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/12 shrink-0">
                      <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                    </span>
                    <span className="text-foreground/85 leading-relaxed">{t(item.key, item.label)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-32">
        <div className="container px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            <motion.div {...fadeUp} className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <span className="sec-label">{t("business.faqLabel", "Questions")}</span>
                <h2 className="mt-4 font-serif font-bold text-3xl lg:text-4xl tracking-tightest leading-[1.05] text-foreground">
                  {t("business.faqTitle", "Asked & answered.")}
                </h2>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="lg:col-span-8"
            >
              <Accordion type="single" collapsible className="w-full divide-y divide-border">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
                    }}
                  >
                    <AccordionItem value={`bf-${i}`} className="border-0">
                      <AccordionTrigger className="group text-left text-base lg:text-lg font-semibold text-foreground hover:no-underline py-6 transition-colors duration-200 data-[state=open]:text-primary [&>svg]:hidden">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <span className="font-mono tabular text-xs font-semibold text-muted-foreground pt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                          <span className="flex-1">{t(faq.qKey, faq.q)}</span>
                          <span className="ml-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border group-hover:border-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:border-primary transition-all duration-300">
                            <Plus className="h-3.5 w-3.5 transition-transform duration-400 group-data-[state=open]:rotate-45" strokeWidth={2} />
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pl-10 pr-12 text-base">
                        {t(faq.aKey, faq.a)}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM — honest waitlist */}
      <section id="contact" className="py-20 bg-cream/40">
        <div className="container px-5 lg:px-10">
          <div className="max-w-2xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-10">
              <span className="sec-label">{t("business.ctaLabel", "Apply")}</span>
              <h2 className="mt-4 font-serif font-bold text-3xl md:text-4xl tracking-tightest leading-tight text-foreground">
                {t("business.ctaTitle", "Join the early-access cohort.")}
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                {t("business.ctaSubtitle", "We're hand-picking the first partners. Tell us about your business and we'll reply within one working day.")}
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="bento-card-lg p-8 lg:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      {t("business.formName", "Your name")}
                    </Label>
                    <Input
                      id="name"
                      placeholder={t("business.formNamePlaceholder", "Maria Bianchi")}
                      className="rounded-xl h-12 border-border bg-card focus-visible:ring-primary/30 focus-visible:border-primary"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      {t("business.formBusiness", "Business name")}
                    </Label>
                    <Input
                      id="businessName"
                      placeholder={t("business.formBusinessPlaceholder", "Animaland Verona")}
                      className="rounded-xl h-12 border-border bg-card focus-visible:ring-primary/30 focus-visible:border-primary"
                      {...register("businessName")}
                    />
                    {errors.businessName && <p className="text-xs text-destructive">{errors.businessName.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    {t("business.formEmail", "Business email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@business.com"
                    className="rounded-xl h-12 border-border bg-card focus-visible:ring-primary/30 focus-visible:border-primary"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    {t("business.formMessage", "Message")} <span className="font-normal normal-case tracking-normal text-muted-foreground/70">— {t("common.optional", "optional")}</span>
                  </Label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder={t("business.formMessagePlaceholder", "Type of business, expected volume, anything else we should know.")}
                    className="flex w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary disabled:opacity-50 resize-none"
                    {...register("message")}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full h-13 px-6 text-sm font-semibold bg-foreground text-background hover:bg-primary hover:text-primary-foreground disabled:opacity-50 transition-colors btn-press"
                >
                  <Send className="h-4 w-4" strokeWidth={2} />
                  <span>{t("business.formSubmit", "Apply for early access")}</span>
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  {t("business.formDisclaimer", "We reply within one working day. No automatic onboarding — every cohort partner is reviewed.")}
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="h-12" />
    </div>
  );
};

export default BusinessPlan;
