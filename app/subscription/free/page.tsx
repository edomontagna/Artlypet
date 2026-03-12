"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function FreeSubscriptionPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    // If not logged in, redirect to login page
    if (!session) {
      router.push("/auth");
    }
  }, [session, router]);

  const handleActivate = () => {
    setLoading(true);
    // Simulate Free plan activation
    // In production, this will call your backend to activate subscription
    localStorage.setItem("subscription", "free");
    localStorage.setItem("credits", "3");

    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 1500);
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Free Plan</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Activate your <span className="text-primary italic">Free plan</span>
            </h1>
            <p className="text-muted-foreground">
              Get 3 free credits per month to create amazing portraits.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background rounded-3xl p-8 sm:p-12 shadow-lg border border-border/50"
          >
            <div className="text-center mb-8">
              <div className="text-6xl font-bold mb-2">$0</div>
              <span className="text-lg text-muted-foreground">/mese</span>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-secondary" />
                </div>
                <span>3 free credits per month</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-secondary" />
                </div>
                <span>Standard resolution (720x1080)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-secondary" />
                </div>
                <span>Access to all basic styles</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-secondary" />
                </div>
                <span>No credit card required</span>
              </li>
            </ul>

            <Button
              size="lg"
              className="w-full rounded-full h-14 text-base"
              disabled={loading}
              onClick={handleActivate}
            >
              {loading ? "Activating..." : "Activate Free Plan"}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-6 bg-muted/30 rounded-2xl text-center"
          >
            <p className="text-sm text-muted-foreground">
              Want to create more portraits in high resolution?
            </p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => router.push("/subscription/pro")}
            >
              Discover Premium plan →
            </Button>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
