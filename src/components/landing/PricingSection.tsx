import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Shield, ArrowUpRight } from "lucide-react";
import {
  SIGNUP_CREDITS,
  PREMIUM_PRICE,
  PREMIUM_CREDITS,
  CREDIT_COST_SINGLE,
  CREDIT_COST_MIX,
  PRINT_PRICE_FREE,
  PRINT_PRICE_PREMIUM,
} from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { CreditPurchaseModal } from "@/components/CreditPurchaseModal";
import { MagneticButton } from "@/components/ui/magnetic-button";

const ease = [0.16, 1, 0.3, 1] as const;

const PricingSection = memo(() => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const isPremium = profile?.plan_type === "premium" || profile?.plan_type === "business";
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const premiumFeatures = [
    `${PREMIUM_CREDITS} crediti — circa 15 ritratti`,
    "Full HD, niente filigrana",
    "Tutti i 12 stili dipinti a mano",
    `Stampe canvas a €${PRINT_PRICE_PREMIUM} (risparmi €${(PRINT_PRICE_FREE - PRINT_PRICE_PREMIUM).toFixed(2)})`,
    "I crediti non scadono mai",
  ];

  const freeFeatures = [
    `${SIGNUP_CREDITS} crediti all'iscrizione ≈ 3 ritratti`,
    `Singolo: ${CREDIT_COST_SINGLE} crediti`,
    `Tu + il tuo cane insieme: ${CREDIT_COST_MIX} crediti`,
    "Anteprime con filigrana",
  ];

  const premiumCtaLink = user ? (isPremium ? "/generate" : "#") : "/signup";
  const premiumCta = user && isPremium ? "Apri lo studio" : "Vai Premium";

  return (
    <section
      id="pricing"
      className="relative py-24 lg:py-36 bg-background overflow-hidden"
      aria-labelledby="pricing-heading"
    >
      {/* Warm wash behind premium card */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-32 left-1/4 h-[480px] w-[480px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.20), transparent 70%)" }}
      />

      <div className="container relative px-5 lg:px-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 lg:mb-16">
          <div className="lg:col-span-7">
            <span className="font-mono tabular text-[11px] font-semibold tracking-[0.18em] uppercase text-primary">
              · Prezzi
            </span>
            <motion.h2
              id="pricing-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease }}
              className="mt-4 font-bold tracking-tightest leading-[1.02] text-foreground"
              style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif", fontSize: "clamp(2rem, 5.5vw, 4.25rem)" }}
            >
              Un pagamento. <span className="text-primary">Per sempre.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="lg:col-span-4 lg:col-start-9 self-end text-base text-muted-foreground leading-relaxed max-w-[42ch]"
          >
            Niente abbonamenti, niente trappole. Provi gratis. Se ti piace, paghi una volta sola.
          </motion.p>
        </div>

        {/* Asymmetric pricing — Premium dominant 8 cols + Free secondary 4 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 max-w-6xl mx-auto">

          {/* PREMIUM */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className="lg:col-span-8 relative bg-card border border-primary/30 rounded-[2rem] overflow-hidden shadow-tinted"
          >
            {/* Top gold accent line */}
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            {/* Most chosen pill */}
            <div className="absolute top-5 right-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-primary-foreground animate-breath" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-primary-foreground" />
              </span>
              Il più scelto
            </div>

            <div className="p-8 lg:p-12">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-mono tabular text-[11px] font-semibold tracking-[0.18em] uppercase text-primary">Premium</span>
                <span className="text-xs font-mono text-muted-foreground">una volta sola</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-5">
                  <h3
                    className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-[1.05] mb-5"
                    style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif" }}
                  >
                    Tutti gli stili. HD. Niente filigrana.
                  </h3>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span
                      className="font-bold text-foreground text-6xl lg:text-7xl tracking-tightest leading-none"
                      style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif" }}
                    >
                      €{PREMIUM_PRICE}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Circa €1 a ritratto. Ti conviene rispetto a comprarli singoli.
                  </p>
                </div>

                <ul className="md:col-span-7 space-y-3" role="list">
                  {premiumFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 shrink-0">
                        <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-foreground/85 leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {user && premiumCtaLink === "#" ? (
                  <MagneticButton
                    onClick={() => setPurchaseModalOpen(true)}
                    className="h-14 px-9 rounded-full text-base font-semibold bg-primary text-primary-foreground shadow-tinted btn-press"
                    strength={0.30}
                  >
                    <span>{premiumCta}</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                  </MagneticButton>
                ) : (
                  <Link to={premiumCtaLink} className="rounded-full" tabIndex={-1}>
                    <MagneticButton
                      className="h-14 px-9 rounded-full text-base font-semibold bg-primary text-primary-foreground shadow-tinted btn-press"
                      strength={0.30}
                    >
                      <span>{premiumCta}</span>
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                    </MagneticButton>
                  </Link>
                )}
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  <span>Soddisfatti o rimborsati a 30 giorni</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FREE */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="lg:col-span-4 bg-card border border-border rounded-[2rem] flex flex-col p-8 lg:p-9"
          >
            <span className="font-mono tabular text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">Free</span>

            <h3
              className="mt-4 text-2xl lg:text-3xl font-bold text-foreground tracking-tight leading-tight mb-5"
              style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif" }}
            >
              Provi prima di decidere.
            </h3>

            <div className="flex items-baseline gap-1 mb-1">
              <span
                className="font-bold text-foreground text-5xl tracking-tightest leading-none"
                style={{ fontFamily: "'Cabinet Grotesk', system-ui, sans-serif" }}
              >
                €0
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-6">Niente carta richiesta</p>

            <div className="h-px bg-border mb-5" />

            <ul className="space-y-2.5 mb-7" role="list">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                  <Check className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" strokeWidth={2.5} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              to={user ? "/generate" : "/signup"}
              className="mt-auto group inline-flex items-center justify-center gap-2 rounded-full h-12 border border-border hover:border-primary px-6 text-sm font-semibold text-foreground hover:text-primary transition-colors btn-press"
            >
              <span>{user ? "Apri lo studio" : "Inizia gratis"}</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.25} />
            </Link>
          </motion.div>
        </div>

        {/* Print pricing band */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mt-8 max-w-6xl mx-auto rounded-[1.75rem] border border-dashed border-border px-6 sm:px-10 py-7 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10"
        >
          <div className="flex-1">
            <div className="font-mono tabular text-[11px] font-semibold tracking-[0.18em] uppercase text-primary mb-1.5">· Stampa su tela</div>
            <p className="text-foreground text-base leading-relaxed">
              Lo vuoi vero, sul muro? Tela museale, intelaiata a mano, spedita in 48h in tutta Italia.
            </p>
          </div>
          <div className="flex items-baseline gap-6">
            <div>
              <div className="font-mono tabular text-2xl font-semibold text-muted-foreground">€{PRINT_PRICE_FREE}</div>
              <div className="text-xs text-muted-foreground">Free</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <div className="font-mono tabular text-2xl font-semibold text-primary">€{PRINT_PRICE_PREMIUM}</div>
              <div className="text-xs text-muted-foreground">Premium</div>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Tutti i prezzi includono IVA dove applicabile.
        </p>
      </div>

      {user && (
        <CreditPurchaseModal open={purchaseModalOpen} onOpenChange={setPurchaseModalOpen} />
      )}
    </section>
  );
});

PricingSection.displayName = "PricingSection";

export default PricingSection;
