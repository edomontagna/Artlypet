import { memo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Frame, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PrintShopSection = memo(() => {
  const { t } = useTranslation();

  const features = [
    { icon: Frame, titleKey: "printShop.quality", descKey: "printShop.qualityDesc" },
    { icon: Truck, titleKey: "printShop.shipping", descKey: "printShop.shippingDesc" },
    { icon: ShieldCheck, titleKey: "printShop.secure", descKey: "printShop.secureDesc" },
  ];

  return (
    <section
      id="prints"
      className="py-16 lg:py-24 bg-muted/30"
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
                className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-5"
              >
                {t("printShop.title")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg font-sans text-muted-foreground leading-relaxed mb-6"
              >
                {t("printShop.subtitle")}
              </motion.p>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}
                </div>
                <span className="text-sm text-muted-foreground">{t("printShop.delivered", "5,000+ prints delivered across Europe")}</span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  size="lg"
                  asChild
                  className="shimmer-btn btn-press rounded-full px-8 h-12 font-medium text-primary-foreground shadow-md group"
                >
                  <Link to="/signup">
                    {t("printShop.cta")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t("printShop.shippingInfo", "Ships in 7-10 days · Free shipping over €50")}
                </p>
                <p className="mt-1 text-sm text-primary font-medium">
                  {t("printShop.giftCta", "Perfect as a gift for any pet lover")}
                </p>
              </motion.div>

              {/* Size cards */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3"
              >
                {[
                  { size: "30×40cm", label: t("printShop.sizeSmall", "Desk") },
                  { size: "50×70cm", label: t("printShop.sizeMedium", "Wall") },
                  { size: "70×100cm", label: t("printShop.sizeLarge", "Statement") },
                ].map((s) => (
                  <div key={s.size} className="rounded-xl bg-card border border-border p-3 text-center">
                    <p className="text-sm font-medium text-foreground">{s.size}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
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
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  className="flex items-start gap-5 rounded-2xl bg-card p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
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
});

PrintShopSection.displayName = "PrintShopSection";

export default PrintShopSection;
