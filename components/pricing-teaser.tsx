"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: 0,
    originalPrice: null,
    period: "forever",
    features: ["3 credits/month", "HD (1080 × 1527)", "Watermarked preview"],
    cta: "Start Free",
    href: "/auth",
    highlight: false,
  },
  {
    name: "Creator",
    price: 19,
    originalPrice: 39,
    period: "one-time",
    features: ["15 credits", "HD, no watermark", "All styles + Mix mode"],
    cta: "Get Creator",
    href: "/pricing",
    highlight: false,
  },
  {
    name: "Pro",
    price: 39,
    originalPrice: 79,
    period: "one-time",
    badge: "Most Popular",
    features: ["40 credits", "4K Ultra HD", "1 free print included"],
    cta: "Get Pro",
    href: "/pricing",
    highlight: true,
  },
];

export function PricingTeaser() {
  return (
    <section id="pricing" className="py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Simple Pricing</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Simple, <span className="text-primary italic">transparent</span> pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            One-time payment. No subscriptions. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 border-2 ${
                tier.highlight
                  ? "border-primary bg-primary/[0.03] shadow-xl shadow-primary/10"
                  : "border-border bg-background"
              }`}
            >
              {tier.badge && (
                <Badge variant="pro" className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1">
                  {tier.badge}
                </Badge>
              )}

              <h3 className="font-serif text-2xl font-bold mb-4">{tier.name}</h3>

              <div className="flex items-baseline gap-2 mb-6">
                {tier.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">${tier.originalPrice}</span>
                )}
                <span className="font-serif text-4xl font-bold">${tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={tier.href}>
                <Button
                  variant={tier.highlight ? "default" : "outline"}
                  className={`w-full rounded-full h-12 ${
                    tier.highlight ? "shadow-lg shadow-primary/25" : ""
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/pricing">
            <Button variant="ghost" className="rounded-full group">
              View full pricing & FAQ
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
