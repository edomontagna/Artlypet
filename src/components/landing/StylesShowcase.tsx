'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ART_STYLES } from '@/config/styles';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Lock } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Styles' },
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'experimental', label: 'Experimental' },
];

export function StylesShowcase() {
  const [activeCategory, setActiveCategory] = useState('all');
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const filteredStyles =
    activeCategory === 'all'
      ? ART_STYLES
      : ART_STYLES.filter((s) => s.category === activeCategory);

  return (
    <section id="styles" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-violet-950/5 to-black" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Art Styles
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Art Style
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From timeless Renaissance to bold Cyberpunk &mdash; find the perfect style to transform your photos into breathtaking art.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-violet-500/20 border border-violet-500/30 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Styles Grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredStyles.map((style, index) => (
            <motion.div
              key={style.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent cursor-pointer"
            >
              {/* Preview Image Placeholder */}
              <div className="aspect-[3/4] bg-gradient-to-br from-violet-950/50 to-pink-950/30 flex items-center justify-center relative overflow-hidden">
                {/* Animated gradient on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `linear-gradient(135deg, ${
                      style.category === 'classic'
                        ? 'rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2)'
                        : style.category === 'modern'
                        ? 'rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.2)'
                        : 'rgba(236, 72, 153, 0.3), rgba(245, 158, 11, 0.2)'
                    })`,
                  }}
                />
                <div className="text-center p-4 relative z-10">
                  <motion.div
                    whileHover={{ rotate: 180, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm"
                  >
                    <Sparkles className="w-6 h-6 text-violet-400" />
                  </motion.div>
                </div>

                {/* Premium badge */}
                {style.premium && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium backdrop-blur-sm">
                    <Lock className="w-3 h-3" />
                    Pro
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors mb-1">
                  {style.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 group-hover:text-gray-400 transition-colors">
                  {style.description}
                </p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-violet-500/50 transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
