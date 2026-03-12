"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Upload, Wand2, Printer } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "1. Upload your photo",
    description: "Choose a clear photo of your pet, yourself, or both for a mix. The better the lighting, the better the result.",
  },
  {
    icon: Wand2,
    title: "2. Choose a style",
    description: "Select from our curated list of artistic styles. Our AI will analyze your photo and apply the style perfectly.",
  },
  {
    icon: Printer,
    title: "3. Download or Print",
    description: "Get your high-resolution digital file instantly, or order a premium canvas print delivered to your door.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            How it <span className="text-primary italic">works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Creating a masterpiece is simple. We handle the complex AI processing, you just enjoy the result.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-8 group-hover:bg-secondary/20 transition-colors duration-300">
                <step.icon className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
