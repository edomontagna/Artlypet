import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];

const FAQSection = () => {
  const { t } = useTranslation();

  return (
    <section
      id="faq"
      className="py-28 lg:py-36 bg-background"
      aria-labelledby="faq-heading"
    >
      <div className="container px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-medium mb-4"
          >
            Support
          </motion.span>
          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground"
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
                className="border-0 border-b border-border"
              >
                <AccordionTrigger
                  className="text-left font-serif text-lg font-semibold text-foreground hover:no-underline py-6 transition-colors duration-300 data-[state=open]:text-primary"
                >
                  {t(`faq.${key}`)}
                </AccordionTrigger>
                <AccordionContent
                  className="text-muted-foreground leading-relaxed pb-6"
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
