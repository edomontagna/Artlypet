"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const styles = [
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft, fluid colors perfect for gentle pets.",
    image: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/11df905c0481ee4777378ccda14e8d53.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=BUMdElojPVxh1Dc4Gdn3iJ6mHr0=",
  },
  {
    id: "oil-painting",
    name: "Oil Painting",
    description: "Rich textures and deep colors for a classic look.",
    image: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/2a252c27b54eaf33e353a9665ee4e67f.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=hPHHYMghU9ojsV5PP1o6qes8TCU=",
  },
  {
    id: "renaissance",
    name: "Renaissance",
    description: "Noble and majestic portraits from the 16th century.",
    image: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/be2b3b61eeed3ddcb6783df61f522ca5.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=ZrXoOfErc0aldP6y3LtczYbPwqY=",
  },
  {
    id: "pop-art",
    name: "Pop Art",
    description: "Vibrant, bold, and modern colors.",
    image: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/fb53e57b7f68e12383d396589c7954bb.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=gqadLtXxlNIwtC2Y9sMVw8e3vpk=",
  },
  {
    id: "art-nouveau",
    name: "Art Nouveau",
    description: "Elegant curves and natural forms.",
    image: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/f713ef32ea0d54e322f7e455282bf082.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=cEhnB7sNpQ7z/E3ZNzGw/AtAyWw=",
  },
  {
    id: "impressionist",
    name: "Impressionist",
    description: "Capturing the light and feeling of the moment.",
    image: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/3979c646714ab13e36bed746536f1659.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=0lD3Er/8+jFeJx7vQ5i5d5Gd5mY=",
  },
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
                  src={style.image}
                  alt={style.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
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
