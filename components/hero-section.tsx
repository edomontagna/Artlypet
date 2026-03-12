"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { HERO_IMAGE } from "@/lib/images";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Premium AI Portraits</span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              Turn your loved ones into <span className="text-primary italic">masterpieces</span>.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Transform photos of your pets and family into museum-quality art. Choose from Renaissance, Watercolor, Oil Painting, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create">
                <Button size="lg" className="rounded-full text-base px-8 h-14 group w-full sm:w-auto">
                  Create your portrait
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/styles">
                <Button size="lg" variant="outline" className="rounded-full text-base px-8 h-14 w-full sm:w-auto">
                  View Gallery
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Get 3 free credits when you sign up today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={HERO_IMAGE}
                alt="Beautiful pet portrait"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="font-serif text-2xl font-medium">Your pet, reimagined</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
