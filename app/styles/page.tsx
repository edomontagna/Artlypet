"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { STYLE_IMAGES, HERO_IMAGE } from "@/lib/images";

const styles = [
  { id: "watercolor", name: "Watercolor", description: "Soft, fluid colors perfect for gentle pets." },
  { id: "oil-painting", name: "Oil Painting", description: "Rich textures and deep colors for a classic look." },
  { id: "renaissance", name: "Renaissance", description: "Noble and majestic portraits from the 16th century." },
  { id: "pop-art", name: "Pop Art", description: "Vibrant, bold, and modern colors." },
  { id: "art-nouveau", name: "Art Nouveau", description: "Elegant curves and natural forms." },
  { id: "impressionist", name: "Impressionist", description: "Capturing the light and feeling of the moment." },
];

export default function StylesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              All Art <span className="text-primary italic">Styles</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our complete collection of AI-powered art styles. From classic to modern, find the perfect look for your pet or family portrait.
            </p>
          </div>

          {/* Featured Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto mb-16"
          >
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
              <Image
                src={HERO_IMAGE}
                alt="Featured Style"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="font-serif text-2xl font-medium mb-2">Featured Style</p>
                <p className="text-sm text-white/80">Our latest artistic creation, now available for you to try.</p>
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button variant="secondary" className="rounded-full bg-white/90 text-black hover:bg-white backdrop-blur-sm">
                  Try this style
                </Button>
              </div>
            </div>
          </motion.div>

          {/* All Styles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {styles.map((style, index) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] w-full max-w-sm mx-auto rounded-xl overflow-hidden mb-4 bg-muted shadow-lg">
                  <Image
                    src={STYLE_IMAGES[style.id]}
                    alt={style.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" className="rounded-full bg-white/90 text-black hover:bg-white backdrop-blur-sm">
                      Try this style
                    </Button>
                  </div>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-1">{style.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{style.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
