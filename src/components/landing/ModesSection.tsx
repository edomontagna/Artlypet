'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { PawPrint, User, Blend, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const modes = [
  {
    id: 'animals',
    icon: PawPrint,
    title: 'Pet Portraits',
    subtitle: 'For Your Beloved Companions',
    description:
      'Transform photos of your dogs, cats, birds, and more into stunning artistic portraits. From elegant Renaissance style to bold Pop Art.',
    color: 'from-violet-600 to-indigo-600',
    bgColor: 'from-violet-500/10 to-indigo-500/10',
    borderColor: 'border-violet-500/20 hover:border-violet-500/40',
    features: ['All art styles', '3 free per month', 'HD & 4K export', 'Print-ready quality'],
  },
  {
    id: 'humans',
    icon: User,
    title: 'Human Portraits',
    subtitle: 'For You & Your Loved Ones',
    description:
      'Create magnificent portraits of yourself, friends, or family. Perfect for gifts, social media, or wall art.',
    color: 'from-pink-600 to-rose-600',
    bgColor: 'from-pink-500/10 to-rose-500/10',
    borderColor: 'border-pink-500/20 hover:border-pink-500/40',
    features: ['Professional quality', 'Gift-ready results', 'Multiple sizes', 'Commercial license'],
  },
  {
    id: 'mix',
    icon: Blend,
    title: 'Creative Mix',
    subtitle: 'Humans & Animals Together',
    description:
      'Upload two photos and create a unique artistic composition blending humans and animals in one stunning masterpiece.',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-500/20 hover:border-amber-500/40',
    features: ['2 photos combined', 'Unique compositions', 'Artistic blending', 'All styles available'],
  },
];

export function ModesSection() {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Three Ways to{' '}
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Create Magic
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Whether it&apos;s your pet, yourself, or a creative combination &mdash; turn any photo into art.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {modes.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
                onMouseEnter={() => setHoveredMode(mode.id)}
                onMouseLeave={() => setHoveredMode(null)}
                className={`relative group rounded-3xl border ${mode.borderColor} bg-gradient-to-br ${mode.bgColor} backdrop-blur-xl p-8 transition-all duration-500 cursor-pointer overflow-hidden`}
              >
                {/* Glow effect */}
                <motion.div
                  animate={{
                    opacity: hoveredMode === mode.id ? 0.5 : 0,
                    scale: hoveredMode === mode.id ? 1 : 0.8,
                  }}
                  className={`absolute -inset-4 bg-gradient-to-r ${mode.color} rounded-3xl blur-2xl pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center shadow-lg mb-6`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-1">{mode.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{mode.subtitle}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {mode.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {mode.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href={`/generate?mode=${mode.id}`}>
                    <Button variant="secondary" className="w-full group/btn">
                      Try {mode.title}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
