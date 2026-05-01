import { memo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { MagneticButton } from "@/components/ui/magnetic-button";

const ease = [0.16, 1, 0.3, 1] as const;

// Italian-first FAQ. Falls back to existing i18n keys if translations exist.
const faqs = [
  { qKey: "faq.q1", q: "Quanto ci mette davvero?", aKey: "faq.aq1", a: "In media 45-60 secondi. Se l'AI è sotto pressione può salire a 1-2 minuti, ma il credito viene rimborsato se qualcosa non va." },
  { qKey: "faq.q2", q: "Le mie foto vengono usate per addestrare AI?", aKey: "faq.aq2", a: "No. Le tue foto restano private, hostate in EU, cancellate automaticamente dopo 30 giorni. Niente uso secondario." },
  { qKey: "faq.q3", q: "Cosa succede se il ritratto non mi piace?", aKey: "faq.aq3", a: "Cambi stile e ne fai un altro. Se l'AI sbaglia tecnicamente (es. non genera) il credito è rimborsato in automatico." },
  { qKey: "faq.q4", q: "Posso stamparlo in grande formato?", aKey: "faq.aq4", a: "Sì. Output a 2K, perfetto per stampe fino a 60×80cm su tela. Il tuo telefono lo regge come sfondo, una parete pure." },
  { qKey: "faq.q5", q: "Spedite anche fuori Italia?", aKey: "faq.aq5", a: "In tutta l'Unione Europea, in 48-72h. Fuori UE per ora no, ci stiamo lavorando." },
  { qKey: "faq.q6", q: "I crediti scadono?", aKey: "faq.aq6", a: "I crediti Premium no, mai. I 3 crediti gratis dell'iscrizione restano disponibili finché non li usi." },
  { qKey: "faq.q7", q: "Funziona anche con gatti, cavalli, conigli?", aKey: "faq.aq7", a: "Sì. Cane, gatto, cavallo, coniglio, uccello — l'AI riconosce la maggior parte degli animali domestici. Se sei in dubbio, una foto e provi: il primo è gratis." },
];

const FAQSection = memo(() => {
  const { t } = useTranslation();

  return (
    <section
      id="faq"
      className="relative py-24 lg:py-36 bg-background overflow-hidden"
      aria-labelledby="faq-heading"
    >
      <div className="container relative px-5 lg:px-10">
        {/* Asymmetric: sticky title left, accordion right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <span className="font-mono tabular text-[11px] font-semibold tracking-[0.18em] uppercase text-primary">
                · Domande
              </span>
              <motion.h2
                id="faq-heading"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease }}
                className="mt-4 font-bold tracking-tightest leading-[1.02] text-foreground"
                style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                Le risposte, <span className="text-primary italic">prima che le chiedi.</span>
              </motion.h2>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-[36ch]">
                Se manca qualcosa, scrivici. Rispondiamo nella giornata lavorativa.
              </p>
              <Link
                to="/contact"
                className="hidden lg:inline-flex mt-7 group items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <span>Scrivi alla squadra</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.25} />
              </Link>
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            className="lg:col-span-8"
          >
            <Accordion type="single" collapsible className="w-full divide-y divide-border">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
                  }}
                >
                  <AccordionItem value={`faq-${i}`} className="border-0">
                    <AccordionTrigger className="group text-left text-base lg:text-lg font-semibold text-foreground hover:no-underline py-7 transition-colors duration-200 data-[state=open]:text-primary [&>svg]:hidden">
                      <div className="flex items-start gap-5 flex-1 min-w-0">
                        <span className="font-mono tabular text-xs font-semibold text-muted-foreground pt-1.5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">{t(faq.qKey, faq.q)}</span>
                        <span className="ml-3 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border group-hover:border-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:border-primary transition-all duration-300">
                          <Plus className="h-4 w-4 transition-transform duration-400 group-data-[state=open]:rotate-45" strokeWidth={2} />
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-7 pl-12 pr-12 text-base">
                      {t(faq.aKey, faq.a)}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
        >
          <div className="lg:col-span-8 lg:col-start-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Link to="/signup" className="rounded-full" tabIndex={-1}>
              <MagneticButton
                className="h-14 px-9 rounded-full text-base font-semibold bg-primary text-primary-foreground shadow-tinted btn-press"
                strength={0.30}
              >
                <span>Crea il ritratto</span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
              </MagneticButton>
            </Link>
            <p className="text-sm text-muted-foreground lg:hidden">
              Domande? <Link to="/contact" className="text-primary hover:underline">Scrivici</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Schema FAQ for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((faq) => ({
              "@type": "Question",
              "name": t(faq.qKey, faq.q),
              "acceptedAnswer": { "@type": "Answer", "text": t(faq.aKey, faq.a) },
            })),
          }),
        }}
      />
    </section>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;
