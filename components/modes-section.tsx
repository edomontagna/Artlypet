"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Cat, User, Users } from "lucide-react";

const modes = [
  {
    id: "pets",
    title: "Pets",
    icon: Cat,
    description: "Immortalize your furry friends in stunning artistic styles. From dogs and cats to birds and reptiles.",
    image: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/74ad56f081a14c09ad9f743df9f8b9d5.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773049728&Signature=mNNBc3UvkQm61hUnNnwv2YQd1tQ=",
  },
  {
    id: "humans",
    title: "Humans",
    icon: User,
    description: "Turn your own photos or pictures of loved ones into timeless masterpieces fit for a gallery.",
    image: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/c5df8f822f8b6cac055bb1cb6552d753.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773049728&Signature=Q2sK5KG/xXOcyUqpiF+55jD7sh8=",
  },
  {
    id: "mix",
    title: "Mix (Pet + Human)",
    icon: Users,
    description: "Upload a photo of you and a photo of your pet. Our AI will seamlessly blend them into one beautiful portrait.",
    image: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/d444e4afd00e06beaf827e0d4c17a731.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773056375&Signature=dbn4sBOvkOv2GKMGAaDTgzmgvFA=",
  },
];

export function ModesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Three ways to <span className="text-primary italic">create</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether it&apos;s just your pet, just you, or both of you together. We&apos;ve got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-xl overflow-hidden mb-6 bg-muted shadow-lg">
                <Image
                  src={mode.image}
                  alt={mode.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <mode.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-white">{mode.title}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{mode.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
