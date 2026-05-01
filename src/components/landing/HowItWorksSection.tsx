import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Upload, Palette, Download, ArrowUpRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MagneticButton } from "@/components/ui/magnetic-button";

const ease = [0.16, 1, 0.3, 1] as const;

const steps = [
  { num: "01", icon: Upload,   title: "Carichi una foto",          desc: "Anche dal telefono. Una qualsiasi.", time: "10s" },
  { num: "02", icon: Palette,  title: "Scegli uno stile",          desc: "Renaissance, oil, watercolor… 12.",  time: "5s"  },
  { num: "03", icon: Download, title: "Hai il tuo quadro",         desc: "Pronto da scaricare o stampare.",    time: "~45s" },
];

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 lg:py-36 bg-background overflow-hidden">
      <div className="container relative px-5 lg:px-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 lg:mb-16">
          <div className="lg:col-span-7">
            <span className="font-mono tabular text-[11px] font-semibold tracking-[0.18em] uppercase text-primary">
              · Come funziona
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease }}
              className="mt-4 font-bold tracking-tightest leading-[1.02] text-foreground"
              style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif", fontSize: "clamp(2rem, 5.5vw, 4.25rem)" }}
            >
              {t("howItWorks.title", "Tre mosse. Un capolavoro.")}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="lg:col-span-4 lg:col-start-9 self-end text-base text-muted-foreground leading-relaxed max-w-[42ch]"
          >
            Niente registri infiniti, niente modulo da compilare. Foto in, ritratto fuori. La parte difficile la fa l'AI.
          </motion.p>
        </div>

        {/* STEPS — horizontal flow with arrows between, anti-3-equal-card */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.08, duration: 0.55, ease }}
                  className="relative bg-card border border-border rounded-[1.75rem] p-7 lg:p-8 card-hover"
                >
                  <div className="flex items-start justify-between mb-7">
                    <span className="font-mono tabular text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                      Step {step.num}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inset-0 rounded-full bg-primary animate-breath" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>
                      <span className="font-mono tabular text-[10px] font-semibold text-foreground">{step.time}</span>
                    </span>
                  </div>

                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-5">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>

                  <h3
                    className="text-2xl lg:text-[1.6rem] font-bold text-foreground tracking-tight leading-tight mb-2"
                    style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Arrow between cards (desktop) */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 items-center justify-center rounded-full bg-background border border-border text-muted-foreground">
                      <ArrowRight className="h-3 w-3" strokeWidth={2} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <Link to="/signup" className="rounded-full" tabIndex={-1}>
            <MagneticButton
              className="h-14 px-9 rounded-full text-base font-semibold bg-primary text-primary-foreground shadow-tinted btn-press"
              strength={0.30}
            >
              <span>Inizia gratis</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
            </MagneticButton>
          </Link>
          <p className="text-sm text-muted-foreground">3 ritratti inclusi · Nessuna carta</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
