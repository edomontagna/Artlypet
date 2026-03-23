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
      className="py-28 lg:py-36 relative"
      style={{ background: "var(--bg)" }}
      aria-labelledby="prints-heading"
    >
      <div className="container px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Text content */}
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="sec-label"
              >
                Physical Prints
              </motion.p>
              <motion.h2
                id="prints-heading"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-serif text-4xl md:text-5xl font-light mb-6"
                style={{ color: "var(--text)" }}
              >
                {t("printShop.title")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg font-sans leading-relaxed mb-10"
                style={{ color: "var(--muted)" }}
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
                  className="btn-editorial px-10 h-14 font-sans text-sm font-semibold tracking-wider uppercase group"
                  style={{
                    borderRadius: 0,
                    background: "var(--accent)",
                    color: "var(--bg)",
                    border: "none",
                  }}
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
                  className="relative flex items-start gap-5 p-6 border transition-all duration-300 overflow-hidden group"
                  style={{
                    borderRadius: 0,
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  {/* card-bar hover effect */}
                  <span
                    className="absolute left-0 top-0 h-full w-0 group-hover:w-1 transition-all duration-300"
                    style={{ background: "var(--accent)" }}
                  />
                  <div
                    className="w-12 h-12 border flex items-center justify-center shrink-0"
                    style={{
                      borderRadius: 0,
                      borderColor: "var(--border)",
                    }}
                  >
                    <feat.icon
                      className="h-5 w-5"
                      style={{ color: "var(--accent)" }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-serif text-lg font-normal mb-1"
                      style={{ color: "var(--text)" }}
                    >
                      {t(feat.titleKey)}
                    </h3>
                    <p
                      className="text-sm font-sans leading-relaxed"
                      style={{ color: "var(--muted)" }}
                    >
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
