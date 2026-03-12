"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { STYLE_IMAGES } from "@/lib/images";

const styles = [
  { id: "watercolor", name: "Watercolor", description: "Soft, fluid colors perfect for gentle pets." },
  { id: "oil-painting", name: "Oil Painting", description: "Rich textures and deep colors for a classic look." },
  { id: "renaissance", name: "Renaissance", description: "Noble and majestic portraits from the 16th century." },
  { id: "pop-art", name: "Pop Art", description: "Vibrant, bold, and modern colors." },
  { id: "art-nouveau", name: "Art Nouveau", description: "Elegant curves and natural forms." },
  { id: "impressionist", name: "Impressionist", description: "Capturing the light and feeling of the moment." },
];

export function StylesSection() {
  return (
    <section id="styles" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Explore Our <span className="text-primary italic">Art Styles</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              From classic oil paintings to vibrant pop art, our AI masters every brushstroke to create a unique masterpiece of your pet or family.
            </p>
          </div>
          <Link href="/styles">
            <Button variant="outline" className="rounded-full group shrink-0">
              View all styles
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {styles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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
  );
}
