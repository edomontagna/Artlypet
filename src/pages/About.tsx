import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Heart, Sparkles, Globe, Palette } from "lucide-react";
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

const About = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: t("about.value1Title", "Pet Love"),
      desc: t("about.value1Desc", "We believe every pet deserves to be immortalised in art. Your companion is family, and family deserves a masterpiece."),
    },
    {
      icon: Sparkles,
      title: t("about.value2Title", "AI Excellence"),
      desc: t("about.value2Desc", "Powered by cutting-edge AI from Google Gemini, we blend technology with artistry to create portraits that truly capture your pet's personality."),
    },
    {
      icon: Palette,
      title: t("about.value3Title", "Artistic Quality"),
      desc: t("about.value3Desc", "Every style in our collection is carefully curated to produce museum-quality results that you'll be proud to display."),
    },
    {
      icon: Globe,
      title: t("about.value4Title", "Accessible to All"),
      desc: t("about.value4Desc", "Available in 5 languages with EU-wide shipping. We're making pet art accessible to everyone, everywhere."),
    },
  ];

  const stats = [
    {
      value: t("about.stat1Value", "10,000+"),
      label: t("about.stat1Label", "Portraits Created"),
    },
    {
      value: t("about.stat2Value", "5"),
      label: t("about.stat2Label", "Languages Supported"),
    },
    {
      value: t("about.stat3Value", "12"),
      label: t("about.stat3Label", "Art Styles"),
    },
    {
      value: t("about.stat4Value", "30s"),
      label: t("about.stat4Label", "Average Generation Time"),
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="About Artlypet | Premium AI Pet Art Creator"
        description="Learn about Artlypet, the AI-powered pet portrait platform. Powered by Google Gemini AI, we create stunning art from your pet photos in 12+ styles."
        canonical="/about"
      />
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div {...fadeInUp}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t("about.title", "About Artlypet")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "about.subtitle",
                "We're on a mission to celebrate the bond between pets and their owners through the power of art and artificial intelligence."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("about.missionTitle", "Our Mission")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {t(
                "about.missionDesc",
                "Artlypet was born from a simple idea: every pet is a work of art waiting to be revealed. We combine the latest in generative AI with curated artistic styles to transform your favourite pet photos into stunning portraits. Whether it's a regal oil painting or a playful pop art piece, we help you see your companion in a whole new light."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.valuesTitle", "What We Stand For")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background rounded-3xl p-8 shadow-sm border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 lg:px-8 bg-primary/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeInUp}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <p className="font-serif text-3xl md:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div {...fadeInUp}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("about.techTitle", "Powered by Cutting-Edge AI")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
              {t(
                "about.techDesc",
                "We use Google's Gemini AI to generate your portraits. This state-of-the-art model understands both the anatomy of your pet and the nuances of each art style, producing results that feel hand-crafted rather than machine-generated."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto text-center max-w-2xl">
          <motion.div {...fadeInUp}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.ctaTitle", "Join Thousands of Pet Owners")}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t("about.ctaDesc", "Create a portrait of your pet today and see what the buzz is all about.")}
            </p>
            <Button
              onClick={() => navigate("/signup")}
              className="rounded-full h-12 px-8 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t("about.ctaButton", "Get Started for Free")}
            </Button>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
};

export default About;
