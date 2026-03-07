'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const floatingImages = [
  { style: 'Renaissance', rotation: -12, x: -30, y: 20, delay: 0 },
  { style: 'Watercolor', rotation: 8, x: 20, y: -10, delay: 0.2 },
  { style: 'Pop Art', rotation: -5, x: -15, y: 30, delay: 0.4 },
  { style: 'Oil Painting', rotation: 15, x: 25, y: -20, delay: 0.1 },
  { style: 'Impressionist', rotation: -8, x: -20, y: -5, delay: 0.3 },
  { style: 'Art Nouveau', rotation: 10, x: 30, y: 15, delay: 0.5 },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black" />
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>3 Free Creations Every Month</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-6"
          >
            <span className="text-white">Transform Photos</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Into Masterpieces
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Turn your pets, portraits, or creative mixes into stunning AI-powered art.
            Choose from Renaissance to Pop Art &mdash; museum-quality results in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/register">
              <Button size="xl" className="group">
                Start Creating Free
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Button>
            </Link>
            <Link href="/#styles">
              <Button variant="secondary" size="xl">
                Explore Styles
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2">4.9/5 Rating</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-700" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              <span>50,000+ portraits created</span>
            </div>
          </motion.div>

          {/* Floating Preview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 relative"
          >
            <div className="relative max-w-4xl mx-auto">
              {/* Main showcase card */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900 to-black shadow-2xl shadow-violet-500/10">
                <div className="aspect-[16/9] bg-gradient-to-br from-violet-950/50 to-pink-950/50 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 p-8 w-full max-w-3xl">
                    {floatingImages.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8, rotate: img.rotation }}
                        animate={{ opacity: 1, scale: 1, rotate: img.rotation }}
                        transition={{ delay: 1.2 + img.delay, duration: 0.5 }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                        className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 overflow-hidden backdrop-blur-sm flex flex-col items-center justify-center p-4 cursor-pointer group"
                      >
                        <div className="w-full flex-1 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 mb-3 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-violet-400/50 group-hover:text-violet-400 transition-colors" />
                        </div>
                        <span className="text-xs text-gray-500 group-hover:text-violet-300 transition-colors font-medium">
                          {img.style}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-violet-500/20 via-transparent to-pink-500/20 pointer-events-none" />
              </div>

              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-6 -right-6 w-12 h-12 rounded-full border border-violet-500/20 flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-violet-500" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full border border-pink-500/20 flex items-center justify-center"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
