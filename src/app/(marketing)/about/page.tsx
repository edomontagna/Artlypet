'use client';

import { motion } from 'framer-motion';
import { Heart, Palette, Zap, Globe, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const values = [
  {
    icon: Heart,
    title: 'Made for Pet Lovers',
    description: 'We understand the bond between you and your companions. Every feature is designed to celebrate that connection through art.',
  },
  {
    icon: Palette,
    title: 'Art Meets Technology',
    description: 'Our AI is trained to understand artistic styles at a deep level, creating results that rival hand-painted masterpieces.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'No waiting days for a commission. Get museum-quality portraits in seconds, ready to download or print.',
  },
  {
    icon: Globe,
    title: 'Worldwide Shipping',
    description: 'Premium prints shipped globally with archival inks on museum-grade materials. Built to last generations.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your photos are processed securely and never shared. Full GDPR, CCPA, and global privacy compliance.',
  },
  {
    icon: Sparkles,
    title: 'Always Improving',
    description: 'New styles, better quality, and more features added regularly. Your feedback shapes our roadmap.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Art That Captures{' '}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              the Soul
            </span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed mb-8">
            ArtlyPet was born from a simple belief: every pet, every person, every bond deserves to be immortalized in art. We use cutting-edge AI to transform your most precious photos into stunning artistic portraits that you&apos;ll treasure forever.
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-white text-center mb-16"
          >
            What Makes Us Different
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-black text-white mb-4">Ready to Create Something Beautiful?</h2>
          <p className="text-gray-400 mb-8">3 free creations every month, no credit card required.</p>
          <Link href="/register">
            <Button size="xl">
              <Sparkles className="w-5 h-5" />
              Start Creating Free
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
