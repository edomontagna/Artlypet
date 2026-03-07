'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, CreditCard, Shield, Copy, Check, Bell, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { getReferralLink } from '@/lib/utils';

export default function SettingsPage() {
  const { user } = useStore();
  const [copied, setCopied] = useState(false);

  const copyReferralLink = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(getReferralLink(user.referralCode));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </motion.div>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-violet-400" />
                <div>
                  <CardTitle className="text-lg">Profile</CardTitle>
                  <CardDescription>Your personal information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                  <Input defaultValue={user?.fullName || ''} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                  <Input defaultValue={user?.email || ''} disabled className="opacity-60" />
                </div>
              </div>
              <Button size="sm">Save Changes</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-violet-400" />
                  <div>
                    <CardTitle className="text-lg">Subscription</CardTitle>
                    <CardDescription>Your current plan and billing</CardDescription>
                  </div>
                </div>
                <Badge variant={user?.subscriptionTier === 'free' ? 'secondary' : 'default'}>
                  {user?.subscriptionTier?.toUpperCase() || 'FREE'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                <div>
                  <p className="text-sm text-white font-medium">Credits remaining</p>
                  <p className="text-2xl font-bold text-violet-400">{user?.credits ?? 3}</p>
                </div>
                <Button asChild size="sm">
                  <a href="/pricing">Upgrade Plan</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Referral */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-pink-500/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-violet-400" />
                <div>
                  <CardTitle className="text-lg">Referral Program</CardTitle>
                  <CardDescription>Earn 2 credits for each friend who signs up</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Referral Code</label>
                <div className="flex gap-2">
                  <Input
                    value={user?.referralCode || 'AP-XXXXXX'}
                    readOnly
                    className="font-mono"
                  />
                  <Button variant="secondary" onClick={copyReferralLink}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                  <p className="text-2xl font-bold text-white">{user?.totalReferrals ?? 0}</p>
                  <p className="text-xs text-gray-500">Total Referrals</p>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                  <p className="text-2xl font-bold text-violet-400">{(user?.totalReferrals ?? 0) * 2}</p>
                  <p className="text-xs text-gray-500">Credits Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-violet-400" />
                <div>
                  <CardTitle className="text-lg">Privacy & Security</CardTitle>
                  <CardDescription>Manage your data and security settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="/privacy">
                  <ExternalLink className="w-4 h-4 mr-2" /> Privacy Policy
                </a>
              </Button>
              <Button variant="destructive" size="sm" className="w-full justify-start">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
