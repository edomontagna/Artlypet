import { memo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { MagneticButton } from "@/components/ui/magnetic-button";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];

const ease = [0.16, 1, 0.3, 1] as const;

const FAQSection = memo(() => {
  const { t } = useTranslation();

  return (
    <section
      id="faq"
      className="relative py-24 lg:py-36 bg-background overflow-hidden"
      aria-labelledby="faq-heading"
    >
      <div className="container relative px-6 lg:px-10">
        {/* Asymmetric layout — title left, accordion right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* LEFT — sticky title block */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease }}
              >
                <span className="sec-label">{t("faq.label", "Questions")}</span>
                <h2
                  id="faq-heading"
                  className="mt-4 font-serif font-bold text-4xl md:text-5xl lg:text-[3.5rem] tracking-tightest leading-[1.02] text-foreground"
                >
                  {t("faq.title", "Asked & ")}
                  <span className="text-accent-em italic">{t("faq.titleAccent", "answered.")}</span>
                </h2>
                <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-[36ch]">
                  {t("faq.subtitle", "If something's missing, the team replies inside the working day.")}
                </p>

                <div className="mt-8 hidden lg:block">
                  <Link to="/contact" className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                    <span>{t("faq.contactLink", "Email the team")}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.25} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT — accordion */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="lg:col-span-8"
          >
            <Accordion type="single" collapsible className="w-full divide-y divide-border">
              {faqKeys.map((key, i) => (
                <motion.div
                  key={key}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
                  }}
                >
                  <AccordionItem value={`faq-${i}`} className="border-0">
                    <AccordionTrigger
                      className="group text-left font-serif text-lg lg:text-xl font-bold text-foreground hover:no-underline py-7 transition-colors duration-200 data-[state=open]:text-primary [&>svg]:hidden"
                    >
                      <div className="flex items-start gap-5 flex-1 min-w-0">
                        <span className="font-mono tabular text-xs font-semibold text-muted-foreground pt-1.5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">{t(`faq.${key}`)}</span>
                        <span className="ml-4 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border group-hover:border-primary group-hover:text-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:border-primary transition-all duration-300">
                          <Plus className="h-4 w-4 transition-transform duration-400 group-data-[state=open]:rotate-45" strokeWidth={2} />
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent
                      className="text-muted-foreground leading-relaxed pb-7 pl-12 pr-12 text-base"
                    >
                      {t(`faq.a${key.slice(1)}`)}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>

        {/* CTA + mobile contact link */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
        >
          <div className="lg:col-span-8 lg:col-start-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Link to="/signup" className="rounded-full" tabIndex={-1}>
              <MagneticButton
                className="shimmer-btn rounded-full h-14 px-8 text-base font-semibold shadow-tinted"
                strength={0.30}
              >
                <span>{t("faq.cta", "Create your portrait")}</span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
              </MagneticButton>
            </Link>
            <p className="text-sm text-muted-foreground lg:hidden">
              {t("faq.contact", "Still have questions?")}{" "}
              <Link to="/contact" className="text-primary hover:underline">{t("faq.contactLink", "Contact us")}</Link>
            </p>
          </div>
        </motion.div>
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
                "text": t(`faq.a${key.slice(1)}`),
              },
            })),
          }),
        }}
      />
    </section>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;
