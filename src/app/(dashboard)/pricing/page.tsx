'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight, Zap, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PRICING_PLANS, PRINT_PRODUCTS } from '@/config/pricing';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const planIcons = {
  free: Star,
  starter: Zap,
  pro: Sparkles,
  premium: Crown,
};

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="default" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Simple, Transparent{' '}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
            Start free with 3 creations per month. Upgrade for more credits, 4K resolution, and premium styles.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setBillingInterval('month')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                billingInterval === 'month'
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                billingInterval === 'year'
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              Yearly
              <Badge variant="success" className="ml-2 text-[10px]">Save 20%</Badge>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PRICING_PLANS.map((plan, index) => {
            const Icon = planIcons[plan.tier];
            const yearlyPrice = plan.price * 0.8;
            const displayPrice = billingInterval === 'year' ? yearlyPrice : plan.price;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-violet-600 to-pink-600 border-0 text-white shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card
                  className={cn(
                    'h-full flex flex-col transition-all duration-300 hover:border-violet-500/30',
                    plan.popular && 'border-violet-500/30 bg-violet-500/5 shadow-2xl shadow-violet-500/10'
                  )}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        plan.popular
                          ? 'bg-gradient-to-br from-violet-600 to-pink-600'
                          : 'bg-white/10'
                      )}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle>{plan.name}</CardTitle>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-black text-white">
                        {displayPrice === 0 ? 'Free' : formatPrice(displayPrice)}
                      </span>
                      {displayPrice > 0 && (
                        <span className="text-gray-500 mb-1">/{billingInterval === 'year' ? 'mo' : 'mo'}</span>
                      )}
                    </div>
                    {billingInterval === 'year' && plan.price > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="line-through">{formatPrice(plan.price)}</span>/mo billed annually
                      </p>
                    )}
                    <p className="text-sm text-violet-400 font-medium mt-2">
                      {plan.credits} creations/month
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.popular ? 'default' : 'secondary'}
                      className="w-full"
                    >
                      {plan.price === 0 ? 'Get Started Free' : 'Subscribe'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Print Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">
              Museum-Quality{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Prints
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Turn your AI masterpiece into a physical work of art. Archival inks on premium materials, shipped worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRINT_PRODUCTS.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="h-full hover:border-amber-500/20 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-gray-400">{product.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {product.sizes.map((size) => (
                        <div
                          key={size.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">{size.label}</p>
                            <p className="text-xs text-gray-500">{size.dimensions}</p>
                          </div>
                          <span className="text-sm font-bold text-amber-400">
                            {formatPrice(size.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
