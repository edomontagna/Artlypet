'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Upload, Palette, Wand2, Download, ArrowDown } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Photo',
    description: 'Drop your pet photo, portrait, or two photos for mix mode. High quality photos work best.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Palette,
    title: 'Choose Your Style',
    description: 'Browse 12+ artistic styles from classic Renaissance to bold Cyberpunk. Each creates a unique masterpiece.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Wand2,
    title: 'AI Creates Your Art',
    description: 'Our AI transforms your photo into stunning artwork in seconds, preserving every detail and expression.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Download,
    title: 'Download or Print',
    description: 'Get your digital masterpiece in HD or 4K, or order a museum-quality print delivered to your door.',
    color: 'from-amber-500 to-orange-500',
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-violet-950/5 to-black" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            How It{' '}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Four simple steps from photo to masterpiece
          </p>
        </motion.div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 * index, duration: 0.6 }}
                  className="relative flex items-center gap-6 sm:gap-8 p-6 sm:p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 group"
                >
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-500`}
                  >
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </motion.div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.2 * index + 0.3 }}
                    className="flex justify-center py-2"
                  >
                    <ArrowDown className="w-5 h-5 text-violet-500/30" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
