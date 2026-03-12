"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const pref = localStorage.getItem("cookie-consent");
    if (!pref) setVisible(true);
  }, []);

  function accept(choice: "all" | "essential") {
    localStorage.setItem("cookie-consent", choice);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border bg-background/95 backdrop-blur-md shadow-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium mb-1">We use cookies</p>
                <p className="text-xs text-muted-foreground">
                  We use cookies to improve your experience and analyze site traffic.{" "}
                  <Link href="/legal" className="underline hover:text-primary">
                    Learn more
                  </Link>
                </p>
                {/* Iubenda widget placeholder */}
                <div id="iubenda-cookie-widget" />
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => accept("essential")}
                >
                  Essential only
                </Button>
                <Button
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => accept("all")}
                >
                  Accept all
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
