import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Users, Star, Globe, Image, Shield, Lock, ThumbsUp } from "lucide-react";

const PressSection = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Image,
      value: "10,000+",
      label: t("press.statPortraits", "Portraits Created"),
    },
    {
      icon: Star,
      value: "4.9/5",
      label: t("press.statRating", "Average Rating"),
    },
    {
      icon: Users,
      value: "5,000+",
      label: t("press.statUsers", "Happy Pet Owners"),
    },
    {
      icon: Globe,
      value: "25+",
      label: t("press.statCountries", "Countries"),
    },
  ];

  return (
    <section className="py-10 lg:py-14 bg-muted/30 border-y border-border">
      <div className="container px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-8">
            {t("press.title", "Trusted by Pet Owners Worldwide")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <stat.icon className="h-5 w-5 text-primary mb-1" />
                <span className="font-serif text-2xl lg:text-3xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
          >
            {[
              { icon: Shield, label: t("press.gdpr", "GDPR Compliant") },
              { icon: Lock, label: t("press.ssl", "SSL Encrypted") },
              { icon: ThumbsUp, label: t("press.satisfaction", "100% Satisfaction") },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 bg-background rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border">
                <Icon className="h-3 w-3 text-primary" />
                {label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PressSection;
