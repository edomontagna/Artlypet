import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Upload, Palette, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  { icon: Upload, titleKey: "howItWorks.step1Title", descKey: "howItWorks.step1Desc", time: "10 sec" },
  { icon: Palette, titleKey: "howItWorks.step2Title", descKey: "howItWorks.step2Desc", time: "30 sec" },
  { icon: Download, titleKey: "howItWorks.step3Title", descKey: "howItWorks.step3Desc", time: "Instant" },
];

const ease = [0.16, 1, 0.3, 1];

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-xs font-medium mb-4">
              {t("howItWorks.label", "The Process")}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, ease }}
            className="font-serif font-bold text-4xl md:text-5xl tracking-tight text-foreground"
          >
            {t("howItWorks.title").split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <em key={i} className="italic text-primary">{word}</em>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </motion.h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease }}
                className="group text-center"
              >
                {/* Icon circle */}
                <div className="w-24 h-24 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-300 flex items-center justify-center mx-auto mb-6">
                  <Icon className="h-10 w-10 text-secondary" />
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-2xl text-foreground mb-3">
                  {t(step.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {t(step.descKey)}
                </p>
                <span className="inline-block mt-2 text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1">{step.time}</span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16"
        >
          <Button asChild className="shimmer-btn btn-press rounded-full h-12 px-10 text-base font-medium text-primary-foreground shadow-md">
            <Link to="/signup">{t("howItWorks.cta", "Start Creating — It's Free")}</Link>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">{t("howItWorks.ctaSub", "Ready in under 1 minute · No card needed")}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
