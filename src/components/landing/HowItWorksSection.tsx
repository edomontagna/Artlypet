import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Upload, Palette, Download } from "lucide-react";

const steps = [
  { icon: Upload, titleKey: "howItWorks.step1Title", descKey: "howItWorks.step1Desc", num: "01" },
  { icon: Palette, titleKey: "howItWorks.step2Title", descKey: "howItWorks.step2Desc", num: "02" },
  { icon: Download, titleKey: "howItWorks.step3Title", descKey: "howItWorks.step3Desc", num: "03" },
];

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section className="sec-on-surface py-28 lg:py-36 relative">
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="sec-label mb-4"
          >
            The Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-light"
            style={{ color: "var(--text)" }}
          >
            {t("howItWorks.title").split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <em key={i} className="text-accent-em">{word}</em>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </motion.h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="relative px-8 py-10 group"
              style={{
                borderRight: i < steps.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              {/* Step number */}
              <div className="step-number mb-4">{step.num}</div>

              {/* Title */}
              <h3
                className="font-serif text-2xl font-light mb-3"
                style={{ color: "var(--text)" }}
              >
                {t(step.titleKey)}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                {t(step.descKey)}
              </p>

              {/* Hover bar */}
              <div className="step-bar group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
