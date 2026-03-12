"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    originalPrice: null,
    period: "forever",
    description: "Try ArtlyPet with no commitment.",
    features: [
      "3 credits per month",
      "HD resolution (1080 × 1527)",
      "Watermarked preview",
      "Pets & Humans modes",
      "3 base art styles",
    ],
    cta: "Get Started Free",
    href: "/auth",
    highlight: false,
  },
  {
    id: "creator",
    name: "Creator",
    price: 19,
    originalPrice: 39,
    period: "one-time",
    description: "For pet lovers who want more.",
    features: [
      "15 credits (never expire)",
      "HD resolution (1080 × 1527)",
      "No watermark",
      "All modes including Mix",
      "All 6+ art styles",
      "Print ordering available",
    ],
    cta: "Get Creator Pack",
    href: "/subscription/pro",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 39,
    originalPrice: 79,
    period: "one-time",
    description: "The ultimate portrait experience.",
    badge: "Most Popular",
    features: [
      "40 credits (never expire)",
      "4K Ultra HD resolution",
      "No watermark",
      "All modes including Mix",
      "All styles + Exclusives",
      "1 free print included",
      "Priority generation",
      "Priority email support",
    ],
    cta: "Get Pro Pack",
    href: "/subscription/pro",
    highlight: true,
  },
];

const faqs = [
  {
    q: "Do credits expire?",
    a: "Free credits reset monthly (3 per month). Purchased credits (Creator and Pro packs) never expire — use them whenever you want.",
  },
  {
    q: "What's the difference between HD and 4K?",
    a: "HD portraits are 1080 × 1527 pixels, perfect for sharing online. 4K portraits are 3840 × 5427 pixels, ideal for large prints and canvases.",
  },
  {
    q: "Can I upgrade later?",
    a: "Absolutely! You can purchase a Creator or Pro pack at any time. Credits are added to your account instantly.",
  },
  {
    q: "How does the Mix mode work?",
    a: "Upload a photo of yourself and a photo of your pet separately. Our AI will seamlessly blend you both into one beautiful artistic portrait.",
  },
  {
    q: "What about physical prints?",
    a: "Creator and Pro users can order museum-quality prints on archival paper or canvas, shipped worldwide. Sizes range from 20×30cm to 50×70cm.",
  },
  {
    q: "Can I get a refund?",
    a: "If you're not satisfied with the quality of your portraits, contact our support team within 14 days for a full refund.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8 py-12 flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Simple Pricing</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
            Choose your <span className="text-primary italic">plan</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            One-time payment. No subscriptions. No hidden fees.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-24">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-3xl border-2 p-8 flex flex-col ${
                plan.highlight
                  ? "border-primary bg-primary/[0.03] shadow-xl shadow-primary/10 md:scale-[1.05]"
                  : "border-border"
              }`}
            >
              {plan.badge && (
                <Badge variant="pro" className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1">
                  {plan.badge}
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  {plan.originalPrice && (
                    <span className="text-2xl text-muted-foreground line-through">
                      ${plan.originalPrice}
                    </span>
                  )}
                  <span className="font-serif text-5xl font-bold">${plan.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.period}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  size="lg"
                  variant={plan.highlight ? "default" : "outline"}
                  className={`w-full rounded-full h-14 text-base ${
                    plan.highlight ? "shadow-lg shadow-primary/25" : ""
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
