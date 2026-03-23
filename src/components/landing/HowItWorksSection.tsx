import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Upload, Palette, Download } from "lucide-react";

const steps = [
  { icon: Upload, titleKey: "howItWorks.step1Title", descKey: "howItWorks.step1Desc" },
  { icon: Palette, titleKey: "howItWorks.step2Title", descKey: "howItWorks.step2Desc" },
  { icon: Download, titleKey: "howItWorks.step3Title", descKey: "howItWorks.step3Desc" },
];

const ease = [0.16, 1, 0.3, 1];

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-background">
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                <div className="w-20 h-20 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-300 flex items-center justify-center mx-auto mb-6">
                  <Icon className="h-8 w-8 text-secondary" />
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-xl text-foreground mb-3">
                  {t(step.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {t(step.descKey)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
