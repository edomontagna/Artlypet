import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const PressSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-10 lg:py-14 bg-muted/30 border-y border-border">
      <div className="container px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
            {t("press.title", "Trusted by pet lovers across Europe")}
          </p>
          <div className="flex items-center justify-center gap-8 lg:gap-16 flex-wrap opacity-40">
            {["Product Hunt", "TechCrunch", "The Verge", "Wired", "Forbes"].map((name) => (
              <span key={name} className="font-serif text-lg lg:text-xl font-bold text-foreground whitespace-nowrap">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PressSection;
