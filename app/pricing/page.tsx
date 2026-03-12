"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ChevronDown, Zap, Crown, Clock } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    originalPrice: 19,
    discount: "53% OFF",
    period: "one-time",
    urgency: null,
    description: "Perfect for trying premium quality.",
    credits: 5,
    features: [
      "5 portrait credits",
      "HD resolution (1080 × 1527)",
      "No watermark",
      "Pets & Humans modes",
      "All 6 base art styles",
      "Standard generation speed",
    ],
    notIncluded: [
      "Mix mode",
      "4K resolution",
      "Exclusive styles",
      "Print ordering",
    ],
    cta: "Get Starter",
    href: "/subscription/pro",
    highlight: false,
    icon: Zap,
  },
  {
    id: "creator",
    name: "Creator",
    price: 19,
    originalPrice: 39,
    discount: "51% OFF",
    period: "one-time",
    urgency: "74% of users choose this",
    description: "Best value for portrait lovers.",
    credits: 20,
    features: [
      "20 portrait credits",
      "HD resolution (1080 × 1527)",
      "No watermark",
      "All modes including Mix",
      "All 10+ art styles",
      "Fast generation speed",
      "Print ordering available",
      "Download in multiple formats",
    ],
    notIncluded: [
      "4K resolution",
      "Exclusive styles",
    ],
    cta: "Get Creator",
    href: "/subscription/pro",
    highlight: true,
    icon: Sparkles,
  },
  {
    id: "pro",
    name: "Pro",
    price: 39,
    originalPrice: 79,
    discount: "51% OFF",
    period: "one-time",
    urgency: null,
    description: "For those who demand the best.",
    credits: 50,
    features: [
      "50 portrait credits",
      "4K Ultra HD (3840 × 5427)",
      "No watermark",
      "All modes including Mix",
      "All styles + 4 Exclusives",
      "Priority generation (2x faster)",
      "1 free canvas print included",
      "Commercial usage rights",
      "Priority email support",
      "Download in multiple formats",
    ],
    notIncluded: [],
    cta: "Get Pro",
    href: "/subscription/pro",
    highlight: false,
    icon: Crown,
  },
];

const faqs = [
  {
    q: "Do credits expire?",
    a: "No! Purchased credits never expire. Use them whenever inspiration strikes. The only credits that reset are the 3 free monthly credits for unregistered users.",
  },
  {
    q: "What's the difference between HD and 4K?",
    a: "HD portraits are 1080 × 1527 pixels — great for social media and online sharing. 4K portraits are 3840 × 5427 pixels — perfect for large canvas prints and high-quality physical products that look stunning on your wall.",
  },
  {
    q: "Can I buy more credits later?",
    a: "Absolutely! You can purchase any pack at any time. Credits stack — if you buy Creator now and Pro later, all credits are added to your account.",
  },
  {
    q: "How does the Mix mode work?",
    a: "Upload a photo of yourself and a separate photo of your pet. Our AI seamlessly blends you both into one unified artistic portrait — like a Renaissance painting of you and your furry friend together.",
  },
  {
    q: "What about physical prints?",
    a: "Creator and Pro users can order museum-quality prints on archival paper or stretched canvas, shipped worldwide in 5-7 business days. Sizes from 20×30cm ($29) to 50×70cm with frame ($149). Pro users get 1 free canvas print.",
  },
  {
    q: "What if I'm not satisfied?",
    a: "We offer a 100% money-back guarantee within 14 days. If the AI portraits don't meet your expectations, contact support@artlypet.com for a full refund — no questions asked.",
  },
  {
    q: "Can I use the portraits commercially?",
    a: "Pro plan includes full commercial usage rights. You can use your portraits for merchandise, social media content, print-on-demand products, and more.",
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
          className="text-center max-w-3xl mx-auto mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Simple Pricing</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
            Create stunning <span className="text-primary italic">portraits</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            One-time payment. No subscriptions. No hidden fees.
          </p>
        </motion.div>

        {/* Urgency Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
            <Clock className="w-4 h-4" />
            Limited time offer — up to 53% off all packs
          </div>
        </motion.div>

        {/* Free Tier Callout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center mb-12"
        >
          <p className="text-muted-foreground">
            Want to try first?{" "}
            <Link href="/auth" className="text-primary font-medium underline underline-offset-4 hover:text-primary/80">
              Sign up free
            </Link>
            {" "}and get 3 watermarked portraits every month — no credit card required.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-24">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`relative rounded-3xl border-2 p-8 flex flex-col ${
                plan.highlight
                  ? "border-primary bg-primary/[0.03] shadow-2xl shadow-primary/10 md:scale-[1.05] md:-my-4"
                  : "border-border"
              }`}
            >
              {/* Discount Badge */}
              <div className="absolute -top-3 right-6">
                <Badge variant="destructive" className="bg-destructive text-white px-3 py-1 text-xs font-bold">
                  {plan.discount}
                </Badge>
              </div>

              {/* Popularity Badge */}
              {plan.urgency && (
                <Badge variant="pro" className="absolute -top-3 left-6 px-3 py-1">
                  {plan.urgency}
                </Badge>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  plan.highlight ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl font-bold">{plan.name}</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl text-muted-foreground line-through decoration-destructive/60 decoration-2">
                    ${plan.originalPrice}
                  </span>
                  <span className="font-serif text-5xl font-bold text-foreground">${plan.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.period} &middot; {plan.credits} portraits</p>
              </div>

              {/* Per portrait cost */}
              <p className="text-xs text-primary font-medium mb-6">
                That&apos;s just ${(plan.price / plan.credits).toFixed(2)} per portrait
              </p>

              <ul className="space-y-3 mb-6 flex-1">
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
                  className={`w-full rounded-full h-14 text-base font-semibold ${
                    plan.highlight ? "shadow-lg shadow-primary/25" : ""
                  }`}
                >
                  {plan.cta} — ${plan.price}
                </Button>
              </Link>

              {/* Money back guarantee */}
              <p className="text-xs text-muted-foreground text-center mt-4">
                100% money-back guarantee
              </p>
            </motion.div>
          ))}
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <p className="text-muted-foreground text-sm">
            Trusted by <span className="text-foreground font-semibold">2,000+</span> pet owners worldwide
          </p>
        </motion.div>

        {/* Comparison Table (Mobile friendly) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="font-serif text-3xl font-bold text-center mb-8">
            Compare Plans
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-3 font-medium text-muted-foreground">Feature</th>
                  <th className="text-center py-4 px-3 font-semibold">Free</th>
                  <th className="text-center py-4 px-3 font-semibold">Starter</th>
                  <th className="text-center py-4 px-3 font-semibold text-primary">Creator</th>
                  <th className="text-center py-4 px-3 font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Credits", "3/mo", "5", "20", "50"],
                  ["Resolution", "HD", "HD", "HD", "4K Ultra HD"],
                  ["Watermark", "Yes", "No", "No", "No"],
                  ["Mix Mode", "—", "—", "Yes", "Yes"],
                  ["Art Styles", "3", "6", "10+", "All + Exclusive"],
                  ["Generation Speed", "Standard", "Standard", "Fast", "Priority (2x)"],
                  ["Print Ordering", "—", "—", "Yes", "1 free + more"],
                  ["Commercial Rights", "—", "—", "—", "Yes"],
                  ["Support", "—", "Email", "Email", "Priority"],
                ].map(([feature, ...values], i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 px-3 text-muted-foreground">{feature}</td>
                    {values.map((val, j) => (
                      <td key={j} className={`py-3 px-3 text-center ${j === 2 ? "font-medium text-primary" : ""}`}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                  </motion.div>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
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
