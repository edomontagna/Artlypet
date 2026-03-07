'use client';

import { motion } from 'framer-motion';
import { Image, Sparkles, Download, ShoppingCart, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

const filters = ['All', 'Animals', 'Humans', 'Mix'];

export default function HistoryPage() {
  const { generations } = useStore();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? generations
    : generations.filter((g) => g.mode === activeFilter.toLowerCase());

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Your Creations</h1>
            <p className="text-gray-400">{generations.length} artworks created</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === f
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
              <Image className="w-10 h-10 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No artworks yet</h3>
            <p className="text-gray-500 mb-6">Start creating to build your gallery</p>
            <Button asChild>
              <a href="/generate">
                <Sparkles className="w-4 h-4" /> Create Your First Artwork
              </a>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((gen, index) => (
              <motion.div
                key={gen.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden hover:border-violet-500/30 transition-all duration-300">
                  <div className="aspect-[3/4] bg-gradient-to-br from-violet-950/50 to-pink-950/30 flex items-center justify-center relative overflow-hidden">
                    {gen.resultImageUrl ? (
                      <img src={gen.resultImageUrl} alt={gen.style} className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles className="w-8 h-8 text-violet-400/40" />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <Button size="icon" variant="secondary" className="w-9 h-9">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="w-9 h-9">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="w-9 h-9 hover:bg-red-500/20 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{gen.style}</span>
                      <Badge variant={gen.status === 'completed' ? 'success' : 'secondary'} className="text-[10px]">
                        {gen.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 capitalize">{gen.mode}</span>
                      <span className="text-xs text-gray-600">&bull;</span>
                      <span className="text-xs text-gray-500">{gen.resolution}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
