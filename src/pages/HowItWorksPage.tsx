import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Upload,
  Palette,
  Sparkles,
  Download,
  CheckCircle,
  XCircle,
  Camera,
  Sun,
  Focus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import { SEOHead } from "@/components/SEOHead";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const HowItWorksPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const photoTips = [
    {
      icon: Sun,
      label: t("howItWorksPage.tipLight", "Good lighting"),
      desc: t("howItWorksPage.tipLightDesc", "Natural daylight works best. Avoid harsh shadows or flash."),
    },
    {
      icon: Focus,
      label: t("howItWorksPage.tipFocus", "Clear focus"),
      desc: t("howItWorksPage.tipFocusDesc", "Make sure your pet's face is sharp and in focus."),
    },
    {
      icon: Camera,
      label: t("howItWorksPage.tipAngle", "Good angle"),
      desc: t("howItWorksPage.tipAngleDesc", "Eye-level or slightly above. Front-facing shots work best."),
    },
  ];

  const dos = [
    t("howItWorksPage.do1", "Well-lit, clear photo of your pet"),
    t("howItWorksPage.do2", "Pet looking towards the camera"),
    t("howItWorksPage.do3", "Simple or uncluttered background"),
  ];

  const donts = [
    t("howItWorksPage.dont1", "Blurry or dark photos"),
    t("howItWorksPage.dont2", "Multiple pets in one photo"),
    t("howItWorksPage.dont3", "Pet facing away from camera"),
  ];

  const popularStyles = [
    {
      name: t("howItWorksPage.styleRoyal", "Royal Portrait"),
      desc: t("howItWorksPage.styleRoyalDesc", "Regal, majestic portraits inspired by Renaissance masters."),
    },
    {
      name: t("howItWorksPage.styleWatercolor", "Watercolour"),
      desc: t("howItWorksPage.styleWatercolourDesc", "Soft, flowing colours with delicate brush strokes."),
    },
    {
      name: t("howItWorksPage.styleOil", "Oil Painting"),
      desc: t("howItWorksPage.styleOilDesc", "Rich, textured portraits in the classic oil painting tradition."),
    },
    {
      name: t("howItWorksPage.stylePopArt", "Pop Art"),
      desc: t("howItWorksPage.stylePopArtDesc", "Bold, vibrant colours inspired by Warhol and Lichtenstein."),
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="How AI Pet Portraits Work | 3 Easy Steps | Artlypet"
        description="Create AI pet portraits in 3 easy steps: upload your pet's photo, choose an art style, and download your masterpiece. Learn tips for the best results."
        canonical="/how-it-works"
      />
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div {...fadeInUp}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t("howItWorksPage.title", "How It Works")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t(
                "howItWorksPage.subtitle",
                "From photo to masterpiece in three simple steps. Here's everything you need to know."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Step 1: Upload */}
      <section className="py-16 px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeInUp} className="flex flex-col lg:flex-row items-start gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  {t("howItWorksPage.step1Label", "Step 1")}
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("howItWorksPage.step1Title", "Upload Your Photo")}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t(
                  "howItWorksPage.step1Desc",
                  "Start by uploading a clear, well-lit photo of your pet. The better the photo, the more stunning the result."
                )}
              </p>

              {/* Photo tips */}
              <div className="grid gap-4">
                {photoTips.map((tip) => (
                  <div key={tip.label} className="flex items-start gap-4 bg-background rounded-2xl p-4 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <tip.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tip.label}</p>
                      <p className="text-sm text-muted-foreground">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Do / Don't */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-background rounded-2xl p-6 shadow-sm border border-green-200 dark:border-green-900">
                <h3 className="font-serif text-lg font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {t("howItWorksPage.do", "Do")}
                </h3>
                <ul className="space-y-3">
                  {dos.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-background rounded-2xl p-6 shadow-sm border border-red-200 dark:border-red-900">
                <h3 className="font-serif text-lg font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  {t("howItWorksPage.dont", "Don't")}
                </h3>
                <ul className="space-y-3">
                  {donts.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Step 2: Choose Style */}
      <section className="py-16 px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                {t("howItWorksPage.step2Label", "Step 2")}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("howItWorksPage.step2Title", "Choose Your Style")}
            </h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              {t(
                "howItWorksPage.step2Desc",
                "Browse our collection of 12 carefully curated art styles. From classical oil paintings to modern pop art, there's a style for every pet."
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularStyles.map((style, index) => (
                <motion.div
                  key={style.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-muted/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">{style.name}</h3>
                  <p className="text-sm text-muted-foreground">{style.desc}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              {t("howItWorksPage.moreStyles", "...and 8 more styles to explore!")}{" "}
              <a href="/styles" className="text-primary hover:underline">
                {t("howItWorksPage.viewAll", "View all styles")}
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Step 3: AI Creates */}
      <section className="py-16 px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                {t("howItWorksPage.step3Label", "Step 3")}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("howItWorksPage.step3Title", "AI Creates Your Portrait")}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              {t(
                "howItWorksPage.step3Desc",
                "Our cutting-edge AI analyses your photo and applies the chosen art style with remarkable precision. The result? A museum-quality portrait in 30 to 60 seconds."
              )}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: t("howItWorksPage.aiFeature1", "Lightning Fast"),
                  desc: t("howItWorksPage.aiFeature1Desc", "Your portrait is generated in 30-60 seconds using state-of-the-art AI."),
                },
                {
                  title: t("howItWorksPage.aiFeature2", "Museum Quality"),
                  desc: t("howItWorksPage.aiFeature2Desc", "2K resolution output suitable for printing on large canvases."),
                },
                {
                  title: t("howItWorksPage.aiFeature3", "Unique Every Time"),
                  desc: t("howItWorksPage.aiFeature3Desc", "Every portrait is one of a kind, just like your pet."),
                },
              ].map((feature) => (
                <div key={feature.title} className="bg-background rounded-2xl p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Step 4: Download */}
      <section className="py-16 px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                {t("howItWorksPage.step4Label", "Step 4")}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("howItWorksPage.step4Title", "Download, Print, or Gift")}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              {t(
                "howItWorksPage.step4Desc",
                "Once your portrait is ready, you have options. Download the digital file, order a museum-quality canvas print, or share it as the perfect gift."
              )}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: t("howItWorksPage.option1", "Digital Download"),
                  desc: t("howItWorksPage.option1Desc", "High-resolution file ready for social media, wallpapers, or printing at home."),
                },
                {
                  title: t("howItWorksPage.option2", "Canvas Print"),
                  desc: t("howItWorksPage.option2Desc", "Premium museum-quality canvas delivered to your door across the EU."),
                },
                {
                  title: t("howItWorksPage.option3", "Perfect Gift"),
                  desc: t("howItWorksPage.option3Desc", "A unique, personalised gift that any pet lover will treasure forever."),
                },
              ].map((option) => (
                <div key={option.title} className="bg-muted/30 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-primary/5">
        <div className="container mx-auto text-center max-w-2xl">
          <motion.div {...fadeInUp}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("howItWorksPage.ctaTitle", "Ready to Create?")}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t("howItWorksPage.ctaDesc", "Create your first portrait for free. No credit card required.")}
            </p>
            <Button
              onClick={() => navigate("/signup")}
              className="rounded-full h-12 px-8 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t("howItWorksPage.ctaButton", "Create Your First Portrait Free")}
            </Button>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
};

export default HowItWorksPage;
