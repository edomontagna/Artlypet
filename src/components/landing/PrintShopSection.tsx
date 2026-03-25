import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Frame } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PrintShopSection = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Frame, titleKey: "printShop.quality", descKey: "printShop.qualityDesc" },
    { icon: Truck, titleKey: "printShop.shipping", descKey: "printShop.shippingDesc" },
    { icon: ShieldCheck, titleKey: "printShop.secure", descKey: "printShop.secureDesc" },
  ];

  return (
    <section
      id="prints"
      className="py-28 lg:py-36 bg-muted/30"
      aria-labelledby="prints-heading"
    >
      <div className="container px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: Text content */}
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-medium mb-4"
              >
                {t("printShop.badge", "Physical Prints")}
              </motion.span>
              <motion.h2
                id="prints-heading"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
              >
                {t("printShop.title")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg font-sans text-muted-foreground leading-relaxed mb-10"
              >
                {t("printShop.subtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  size="lg"
                  asChild
                  className="rounded-full px-8 h-12 font-medium group"
                >
                  <Link to="/signup">
                    {t("printShop.cta")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right: Feature cards */}
            <div className="space-y-5">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.titleKey}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                  className="flex items-start gap-5 rounded-2xl bg-card p-6 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <feat.icon
                      className="h-5 w-5 text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                      {t(feat.titleKey)}
                    </h3>
                    <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                      {t(feat.descKey)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrintShopSection;
