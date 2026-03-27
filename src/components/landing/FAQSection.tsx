import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];

const FAQSection = () => {
  const { t } = useTranslation();

  return (
    <section
      id="faq"
      className="py-16 lg:py-24 bg-background"
      aria-labelledby="faq-heading"
    >
      <div className="container px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-medium mb-4"
          >
            {t("faq.label", "Support")}
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

        <div className="text-center mt-16">
          <Button asChild className="shimmer-btn btn-press rounded-full h-12 px-8 text-base font-medium text-primary-foreground shadow-md">
            <Link to="/signup">{t("faq.cta", "Create Your Portrait")}</Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("faq.contact", "Still have questions?")}{" "}
            <Link to="/contact" className="text-primary hover:underline">{t("faq.contactLink", "Contact us")}</Link>
          </p>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqKeys.map((key) => ({
              "@type": "Question",
              "name": t(`faq.${key}`),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": t(`faq.a${key.slice(1)}`)
              }
            }))
          })
        }}
      />
    </section>
  );
};

export default FAQSection;
