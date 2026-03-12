"use client";

import * as React from "react";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [processing, setProcessing] = React.useState(true);

  useEffect(() => {
    const activatePremium = async () => {
      // Aggiorna l'abbonamento dell'utente a Pro
      localStorage.setItem("subscription", "pro");
      localStorage.setItem("credits", "30");

      setProcessing(false);
    };

    // In produzione, verificheresti la sessione con Stripe API
    // Per ora, simuliamo l'attivazione
    setTimeout(activatePremium, 1000);
  }, []);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoCreate = () => {
    router.push("/create");
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto text-center"
        >
          {processing ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary/10 rounded-3xl p-8 sm:p-16"
            >
              <div className="w-16 h-16 mx-auto mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full border-4 border-primary/30 rounded-full border-t-primary"
                />
              </div>
              <h2 className="font-serif text-2xl font-semibold mb-4">
                Attivazione del piano in corso...
              </h2>
              <p className="text-muted-foreground">
                Non chiudere questa pagina.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12"
              >
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Check className="w-12 h-12 text-primary" />
                  </motion.div>
                </div>

                <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                  Pagamento <span className="text-primary italic">completato!</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-2">
                  Congratulazioni! Il tuo piano Premium è ora attivo.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-background rounded-3xl p-8 sm:p-12 shadow-lg border border-border/50"
              >
                <h3 className="font-serif text-2xl font-semibold mb-6 text-foreground">
                  Il tuo piano Premium include:
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">30 Crediti Premium</p>
                      <p className="text-sm text-muted-foreground">Crediti illimitati per creare ritratti</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">4K Ultra-HD Resolution</p>
                      <p className="text-sm text-muted-foreground">Risoluzione massima per stampe di qualità</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Stili Premium + Mix Mode</p>
                      <p className="text-sm text-muted-foreground">Accesso a stili esclusivi e modalità mix</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Diritti Commerciali</p>
                      <p className="text-sm text-muted-foreground">Uso commerciale senza limitazioni</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1 rounded-full h-14 text-base"
                    onClick={handleGoHome}
                  >
                    <Home className="mr-2 w-4 h-4" />
                    Torna alla Home
                  </Button>

                  <Button
                    size="lg"
                    className="flex-1 rounded-full h-14 text-base bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleGoCreate}
                  >
                    Crea il tuo primo ritratto
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
