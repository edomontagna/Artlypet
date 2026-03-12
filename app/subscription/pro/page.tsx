"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { useSession } from "next-auth/react";

export default function ProSubscriptionPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);

  const handlePurchase = async () => {
    if (!session?.user?.email) {
      alert("Please log in first");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await response.json();

      if (data.sessionId) {
        // Redirect to Stripe Checkout
        const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error("Stripe redirect error:", error);
          alert("Error redirecting to Stripe");
        }
      } else {
        alert("Error creating checkout");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium">Premium Plan</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Upgrade to <span className="text-primary italic">Premium</span>
            </h1>
            <p className="text-muted-foreground">
              30 credits and 4K Ultra-HD. One-time purchase, no monthly subscription.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary text-primary-foreground rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8">
              <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="text-6xl font-bold mb-2">$15</div>
              <span className="text-lg text-primary-foreground/80">/una tantum</span>
            </div>

            <ul className="space-y-4 mb-10 text-primary-foreground">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span>30 credits (one-time)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span>4K Ultra-HD resolution</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span>Premium styles & Mix mode</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span>Commercial usage rights</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span>One-time purchase, no renewal</span>
              </li>
            </ul>

            <Button
              size="lg"
              className="w-full rounded-full h-14 text-base bg-white text-primary hover:bg-white/90"
              disabled={loading}
              onClick={handlePurchase}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Purchase Now
                  <Sparkles className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>

            <p className="mt-4 text-sm text-center text-primary-foreground/70">
              Secure payment with Stripe. Credit card or PayPal.
            </p>

            <div className="mt-6 p-4 bg-white/10 rounded-xl border border border-white/20">
              <p className="text-xs text-primary-foreground/80">
                Powered by Stripe | Secure payment with SSL encryption
              </p>
            </div>
          </motion.div>

          {!session && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-muted/30 rounded-2xl text-center"
            >
              <p className="text-sm text-muted-foreground mb-4">
                You need to be logged in to purchase the Premium plan
              </p>
              <Button
                variant="link"
                onClick={() => window.location.href = "/auth"}
              >
                Log in →
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
