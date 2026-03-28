import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
  ChevronDown,
  ChevronUp,
  Send,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SEOHead } from "@/components/SEOHead";
import { BUSINESS_PRICE_MONTHLY } from "@/lib/constants";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  businessName: z.string().min(2, "Business name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const BusinessPlan = () => {
  const { t } = useTranslation();
  const [portraitsPerMonth, setPortraitsPerMonth] = useState(50);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    toast.success(t("business.formSuccess", "Thank you! We'll be in touch within 24 hours."));
    const mailto = `mailto:business@artlypet.com?subject=${encodeURIComponent(`B2B Inquiry from ${data.businessName}`)}&body=${encodeURIComponent(`Name: ${data.name}\nBusiness: ${data.businessName}\nEmail: ${data.email}\n\n${data.message || ""}`)}`;
    window.open(mailto, "_blank");
    reset();
  };

  const steps = [
    {
      icon: Building2,
      title: t("business.step1Title", "We set up your branded portal"),
      desc: t("business.step1Desc", "Custom domain, your logo, your colors. Fully white-labeled in 48 hours."),
    },
    {
      icon: Upload,
      title: t("business.step2Title", "Your customers upload pet photos"),
      desc: t("business.step2Desc", "Simple, mobile-friendly upload flow embedded in your website or app."),
    },
    {
      icon: Sparkles,
      title: t("business.step3Title", "AI creates stunning portraits instantly"),
      desc: t("business.step3Desc", "12 art styles, HD quality, generated in under 60 seconds."),
    },
    {
      icon: TrendingUp,
      title: t("business.step4Title", "You earn on every portrait sold"),
      desc: t("business.step4Desc", "Set your own prices. Keep 100% of the margin above our flat subscription."),
    },
  ];

  const features = [
    { icon: Palette, title: t("business.featWhiteLabel", "White-Label Branding"), desc: t("business.featWhiteLabelDesc", "Your logo, colors, and domain. Customers see only your brand.") },
    { icon: InfinityIcon, title: t("business.featUnlimited", "Unlimited Generations"), desc: t("business.featUnlimitedDesc", "No per-image fees. Generate as many portraits as you want.") },
    { icon: ImageIcon, title: t("business.featStyles", "All 12 Art Styles"), desc: t("business.featStylesDesc", "Renaissance, Pop Art, Watercolor, and more. Every style included.") },
    { icon: Printer, title: t("business.featPrints", "Print Fulfillment"), desc: t("business.featPrintsDesc", "Canvas and framed prints shipped directly to your customers.") },
    { icon: BarChart3, title: t("business.featAnalytics", "Analytics Dashboard"), desc: t("business.featAnalyticsDesc", "Track generations, revenue, and customer engagement in real time.") },
    { icon: Headphones, title: t("business.featSupport", "Priority Support"), desc: t("business.featSupportDesc", "Dedicated account manager and technical support within 4 hours.") },
  ];

  const faqs = [
    {
      q: t("business.faq1Q", "How long does it take to set up our branded portal?"),
      a: t("business.faq1A", "We typically have your white-label portal live within 48 hours of signing up. We handle the technical setup while you provide your branding assets."),
    },
    {
      q: t("business.faq2Q", "Can we set our own pricing for portraits?"),
      a: t("business.faq2A", "Absolutely. You have full control over pricing. Most partners charge between €15-€30 per portrait and keep 100% of the margin."),
    },
    {
      q: t("business.faq3Q", "Is there a minimum commitment period?"),
      a: t("business.faq3A", "No long-term contracts. The subscription is month-to-month and you can cancel anytime. We offer a 14-day free trial to get started."),
    },
    {
      q: t("business.faq4Q", "Do you offer API integration for our existing platform?"),
      a: t("business.faq4A", "Yes. Our REST API allows you to integrate portrait generation directly into your existing website, app, or e-commerce platform."),
    },
    {
      q: t("business.faq5Q", "What about GDPR and data privacy?"),
      a: t("business.faq5A", "We are fully GDPR compliant. All data is processed in the EU, and customer photos are automatically deleted after 30 days unless otherwise specified."),
    },
  ];

  const included = [
    t("business.incPortal", "Branded web portal"),
    t("business.incGenerations", "Unlimited AI generations"),
    t("business.incHd", "Full HD downloads"),
    t("business.incStyles", "All 12 art styles"),
    t("business.incApi", "REST API access"),
    t("business.incAnalytics", "Analytics dashboard"),
    t("business.incSupport", "Priority email & chat support"),
    t("business.incPrints", "Discounted print fulfillment"),
    t("business.incOnboarding", "Dedicated onboarding"),
    t("business.incUpdates", "New styles & features included"),
  ];

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="AI Pet Portraits for Business | White-Label Solution | Artlypet"
        description="Add AI pet portraits to your pet business. White-label solution with unlimited generations, 12 art styles, and full branding control. Start your free trial."
        canonical="/business"
      />
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center px-4 lg:px-8 bg-card">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <Link to="/" className="font-serif text-xl font-bold text-primary ml-2">Artlypet</Link>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 lg:px-8 max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Building2 className="h-4 w-4" />
            {t("business.badge", "For Pet Businesses")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
          >
            {t("business.heroTitle", "Transform Your Pet Business with AI Portraits")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed mb-8"
          >
            {t("business.heroSubtitle", "Add a new revenue stream to your pet shop, vet clinic, or e-commerce store. Offer AI-generated pet portraits under your own brand and earn on every sale.")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="rounded-full px-10 h-13 text-base shadow-xl" asChild>
              <a href="#contact">
                {t("business.heroCtaPrimary", "Start Your Free Trial")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 h-13 text-base" asChild>
              <a href="#calculator">
                {t("business.heroCtaSecondary", "See Your Revenue Potential")}
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 lg:px-8 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("business.problemTitle", "Your customers love their pets. Give them a way to celebrate that love.")}
            </h2>
            <p className="text-lg text-muted-foreground font-sans leading-relaxed">
              {t("business.problemDesc", "Pet owners are spending more than ever on their furry companions. AI pet portraits are the perfect upsell: digital, instant, and deeply personal. No inventory, no shipping headaches, pure margin.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("business.howItWorksTitle", "How It Works for Your Business")}
            </h2>
            <p className="text-muted-foreground text-lg font-sans">
              {t("business.howItWorksSubtitle", "Four simple steps to start earning")}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="rounded-2xl p-6 h-full border-border hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-primary mb-2">
                    {t("business.stepLabel", "Step {{num}}", { num: i + 1 })}
                  </p>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-sans">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Calculator */}
      <section id="calculator" className="py-20 bg-muted/30">
        <div className="container px-4 lg:px-8 max-w-3xl">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("business.calcTitle", "Revenue Calculator")}
            </h2>
            <p className="text-muted-foreground text-lg font-sans">
              {t("business.calcSubtitle", "See how much you could earn with AI pet portraits")}
            </p>
          </motion.div>
          <motion.div {...fadeUp}>
            <Card className="rounded-2xl p-8 border-border shadow-md">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-medium text-foreground">
                    {t("business.calcPortraitsLabel", "Portraits sold per month")}
                  </Label>
                  <span className="font-serif text-2xl font-bold text-primary">{portraitsPerMonth}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={portraitsPerMonth}
                  onChange={(e) => setPortraitsPerMonth(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10</span>
                  <span>100</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{t("business.calcRevenue", "Monthly Revenue")}</p>
                  <p className="font-serif text-2xl font-bold text-foreground">{"\u20AC"}{revenue}</p>
                  <p className="text-xs text-muted-foreground">{portraitsPerMonth} x {"\u20AC"}{averagePrice}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{t("business.calcSubscription", "Subscription")}</p>
                  <p className="font-serif text-2xl font-bold text-muted-foreground">{"\u2212\u20AC"}{BUSINESS_PRICE_MONTHLY}</p>
                  <p className="text-xs text-muted-foreground">{t("business.calcFlatFee", "Flat monthly fee")}</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-4 text-center">
                  <p className="text-xs text-primary mb-1">{t("business.calcProfit", "Net Profit")}</p>
                  <p className={`font-serif text-2xl font-bold ${netProfit >= 0 ? "text-primary" : "text-destructive"}`}>
                    {netProfit >= 0 ? `\u20AC${netProfit}` : `\u2212\u20AC${Math.abs(netProfit)}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{t("business.calcPerMonth", "per month")}</p>
                </div>
              </div>

              {netProfit > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {t("business.calcAnnual", "That's €{{annual}} per year in pure profit", { annual: netProfit * 12 })}
                </p>
              )}
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("business.featuresTitle", "Everything You Need to Succeed")}
            </h2>
            <p className="text-muted-foreground text-lg font-sans">
              {t("business.featuresSubtitle", "A complete platform, not just an API")}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Card className="rounded-2xl p-6 h-full border-border hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground font-sans">{feat.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 lg:px-8 max-w-3xl">
          <motion.div {...fadeUp}>
            <Card className="rounded-2xl p-10 border-border shadow-lg text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                {t("business.pricingTitle", "Simple, Transparent Pricing")}
              </h2>
              <p className="text-muted-foreground mb-8 font-sans">
                {t("business.pricingSubtitle", "One plan. Everything included. No hidden fees.")}
              </p>
              <div className="flex items-baseline justify-center gap-1 mb-8">
                <span className="font-serif text-6xl font-bold text-foreground">{"\u20AC"}{BUSINESS_PRICE_MONTHLY}</span>
                <span className="text-lg text-muted-foreground">/ {t("business.month", "month")}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-md mx-auto mb-8">
                {included.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={2.5} />
                    <span className="text-sm text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="rounded-full px-10 h-13 text-base shadow-xl" asChild>
                <a href="#contact">
                  {t("business.pricingCta", "Start Your 14-Day Free Trial")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="container px-4 lg:px-8 max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <p className="text-sm text-primary font-medium uppercase tracking-wider mb-4">
              {t("business.socialProofLabel", "Trusted by pet businesses")}
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-10">
              {t("business.socialProofTitle", "Trusted by Pet Businesses Across Europe")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: t("business.testimonial1", "We added AI portraits as an upsell and it now accounts for 15% of our monthly revenue. Setup was incredibly easy."),
                  name: t("business.testimonial1Name", "Marco R."),
                  role: t("business.testimonial1Role", "Pet Shop Owner, Milan"),
                },
                {
                  quote: t("business.testimonial2", "Our clients love getting a portrait of their pet after each vet visit. It's become our signature touch."),
                  name: t("business.testimonial2Name", "Dr. Anna K."),
                  role: t("business.testimonial2Role", "Veterinary Clinic, Berlin"),
                },
                {
                  quote: t("business.testimonial3", "The white-label integration was seamless. Our customers don't even know it's a third-party service."),
                  name: t("business.testimonial3Name", "Sophie L."),
                  role: t("business.testimonial3Role", "Pet E-Commerce, Paris"),
                },
              ].map((test, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="rounded-2xl p-6 h-full border-border text-left">
                    <p className="text-sm text-muted-foreground font-sans italic mb-4">"{test.quote}"</p>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{test.name}</p>
                      <p className="text-xs text-muted-foreground">{test.role}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 lg:px-8 max-w-3xl">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              {t("business.faqTitle", "Frequently Asked Questions")}
            </h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="rounded-2xl border-border overflow-hidden cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex items-center justify-between p-5">
                    <h3 className="font-serif text-base font-semibold text-foreground pr-4">{faq.q}</h3>
                    {openFaq === i ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-muted-foreground font-sans leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form CTA */}
      <section id="contact" className="py-20">
        <div className="container px-4 lg:px-8 max-w-2xl">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("business.ctaTitle", "Start Your Free Trial")}
            </h2>
            <p className="text-muted-foreground text-lg font-sans">
              {t("business.ctaSubtitle", "Fill out the form and we'll have your branded portal ready within 48 hours.")}
            </p>
          </motion.div>
          <motion.div {...fadeUp}>
            <Card className="rounded-2xl p-8 border-border shadow-md">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("business.formName", "Your Name")}</Label>
                    <Input
                      id="name"
                      placeholder={t("business.formNamePlaceholder", "John Smith")}
                      className="rounded-lg"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">{t("business.formBusiness", "Business Name")}</Label>
                    <Input
                      id="businessName"
                      placeholder={t("business.formBusinessPlaceholder", "Happy Paws Pet Shop")}
                      className="rounded-lg"
                      {...register("businessName")}
                    />
                    {errors.businessName && <p className="text-xs text-destructive">{errors.businessName.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("business.formEmail", "Business Email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("business.formEmailPlaceholder", "you@business.com")}
                    className="rounded-lg"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t("business.formMessage", "Message (optional)")}</Label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder={t("business.formMessagePlaceholder", "Tell us about your business and what you're looking for...")}
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    {...register("message")}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full rounded-full h-13 text-base shadow-xl"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {t("business.formSubmit", "Start Your Free Trial")}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {t("business.formDisclaimer", "No credit card required. 14-day free trial. Cancel anytime.")}
                </p>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-16" />
    </div>
  );
};

export default BusinessPlan;
