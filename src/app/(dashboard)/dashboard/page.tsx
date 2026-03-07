'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Image, CreditCard, Users, ArrowRight, Plus, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { FREE_CREDITS_PER_MONTH } from '@/config/pricing';

export default function DashboardPage() {
  const { user, generations } = useStore();

  const stats = [
    {
      label: 'Credits Remaining',
      value: user?.credits ?? FREE_CREDITS_PER_MONTH,
      icon: Sparkles,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/10',
    },
    {
      label: 'Artworks Created',
      value: generations.length,
      icon: Image,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      label: 'Current Plan',
      value: user?.subscriptionTier === 'free' ? 'Free' : user?.subscriptionTier ?? 'Free',
      icon: CreditCard,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Referrals',
      value: user?.totalReferrals ?? 0,
      icon: Users,
      color: 'from-emerald-500 to-cyan-500',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-400">Ready to create your next masterpiece?</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Link href="/generate">
            <div className="relative group rounded-2xl overflow-hidden border border-violet-500/20 hover:border-violet-500/40 transition-all duration-500 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-pink-600/10 group-hover:from-violet-600/20 group-hover:to-pink-600/20 transition-all duration-500" />
              <div className="relative p-6 sm:p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Create New Artwork</h3>
                    <p className="text-sm text-gray-400">
                      Upload a photo and choose your art style
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-violet-400 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 2) }}
              >
                <Card className="hover:border-white/20 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-0.5">
                      {typeof stat.value === 'string'
                        ? stat.value.charAt(0).toUpperCase() + stat.value.slice(1)
                        : stat.value}
                    </div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Creations & Quick Links */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Creations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Creations</CardTitle>
                <Link href="/history">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {generations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                      <Image className="w-8 h-8 text-violet-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">No artworks yet</h3>
                    <p className="text-sm text-gray-500 mb-4">Create your first AI-powered masterpiece</p>
                    <Link href="/generate">
                      <Button size="sm">
                        <Sparkles className="w-4 h-4" />
                        Create Now
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {generations.slice(0, 6).map((gen) => (
                      <div
                        key={gen.id}
                        className="aspect-[3/4] rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden group cursor-pointer hover:border-violet-500/30 transition-all"
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center p-3">
                          <Sparkles className="w-6 h-6 text-violet-400/50 mb-2" />
                          <span className="text-xs text-gray-500">{gen.style}</span>
                          <Badge variant="secondary" className="mt-2 text-[10px]">
                            {gen.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Referral Card */}
            <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-pink-500/5">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Invite Friends</h3>
                    <p className="text-xs text-gray-500">Earn 2 credits per referral</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/30 border border-white/5 mb-3">
                  <p className="text-xs text-gray-400 mb-1">Your referral code:</p>
                  <p className="text-sm font-mono font-bold text-violet-300">
                    {user?.referralCode || 'AP-XXXXXX'}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/?ref=${user?.referralCode || ''}`
                  );
                }}>
                  Copy Referral Link
                </Button>
              </CardContent>
            </Card>

            {/* Upgrade CTA */}
            {(!user?.subscriptionTier || user.subscriptionTier === 'free') && (
              <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                <CardContent className="p-5">
                  <Badge variant="premium" className="mb-3">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Upgrade
                  </Badge>
                  <h3 className="text-sm font-bold text-white mb-1">Unlock 4K & More</h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Get premium styles, 4K exports, and up to 150 credits/month.
                  </p>
                  <Link href="/pricing">
                    <Button size="sm" className="w-full">
                      View Plans <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Credit Reset Info */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500">Credits reset monthly</span>
                </div>
                <p className="text-xs text-gray-600">
                  Free credits reset on the 1st of each month. Paid plan credits are added to your balance.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
