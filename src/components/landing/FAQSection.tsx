import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];

const FAQSection = () => {
  const { t } = useTranslation();

  return (
    <section
      id="faq"
      className="py-28 lg:py-36 relative"
      style={{ background: "var(--bg)" }}
      aria-labelledby="faq-heading"
    >
      <div className="container px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="sec-label"
          >
            Support
          </motion.p>
          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl font-light"
            style={{ color: "var(--text)" }}
          >
            {t("faq.title")}
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqKeys.map((key, i) => (
              <AccordionItem
                key={key}
                value={`faq-${i}`}
                className="border-0 border-b px-0"
                style={{ borderColor: "var(--border)" }}
              >
                <AccordionTrigger
                  className="text-left font-serif text-base md:text-lg font-normal hover:no-underline py-6 transition-colors duration-300 data-[state=open]:text-[var(--accent)]"
                  style={{ color: "var(--text)", borderRadius: 0 }}
                >
                  {t(`faq.${key}`)}
                </AccordionTrigger>
                <AccordionContent
                  className="font-sans text-sm leading-relaxed pb-6"
                  style={{ color: "var(--muted)" }}
                >
                  {t(`faq.a${key.slice(1)}`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
