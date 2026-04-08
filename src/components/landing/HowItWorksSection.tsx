import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Upload, Palette, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  { icon: Upload, titleKey: "howItWorks.step1Title", descKey: "howItWorks.step1Desc", time: "10 sec", gradient: "from-primary/20 to-primary/5", num: "01" },
  { icon: Palette, titleKey: "howItWorks.step2Title", descKey: "howItWorks.step2Desc", time: "30 sec", gradient: "from-secondary/20 to-secondary/5", num: "02" },
  { icon: Download, titleKey: "howItWorks.step3Title", descKey: "howItWorks.step3Desc", time: "Instant", gradient: "from-primary/20 to-secondary/5", num: "03" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-medium mb-4">
              {t("howItWorks.label", "The Process")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, ease }}
            className="font-serif font-bold text-4xl md:text-5xl tracking-tight text-foreground mb-4"
          >
            {t("howItWorks.title").split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <em key={i} className="italic text-primary">{word}</em>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, ease }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t("howItWorks.subtitle", "Three simple steps to transform your pet into a masterpiece")}
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease }}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="relative bg-card rounded-2xl border border-border/50 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
                    {/* Step number */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {step.num}
                    </div>

                    {/* Icon */}
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-9 w-9 text-primary" />
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-bold text-xl text-foreground mb-3">
                      {t(step.titleKey)}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {t(step.descKey)}
                    </p>

                    {/* Time badge */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      {step.time}
                    </span>
                  </div>

                  {/* Arrow between cards (desktop, not on last) */}
                  {i < 2 && (
                    <div className="hidden md:flex absolute -right-6 top-24 z-10 w-12 h-12 items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-primary/40" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button asChild className="shimmer-btn btn-press rounded-full h-12 px-8 text-base font-medium text-primary-foreground shadow-md">
            <Link to="/signup">{t("howItWorks.cta", "Start Creating — It's Free")}</Link>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">{t("howItWorks.ctaSub", "Ready in under 1 minute · No card needed")}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
