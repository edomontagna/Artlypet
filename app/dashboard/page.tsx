"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Image as ImageIcon,
  Palette,
  Copy,
  Check,
  Share2,
  Download,
  Truck,
  Sparkles,
  ArrowRight,
  Gift,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [copied, setCopied] = React.useState(false);

  // Placeholder data — will connect to Supabase
  const user = {
    name: "User",
    credits: 3,
    subscription: "free" as const,
    referralCode: "ARTLY-X7K2",
    totalPortraits: 0,
    referrals: { invited: 0, converted: 0, creditsEarned: 0 },
  };

  const portraits: Array<{
    id: string;
    style: string;
    mode: string;
    status: string;
    date: string;
    thumbnail: string;
  }> = [];

  const printOrders: Array<{
    id: string;
    size: string;
    status: string;
    date: string;
    tracking?: string;
  }> = [];

  function copyReferral() {
    navigator.clipboard.writeText(`https://artlypet.com/?ref=${user.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600",
    generating: "bg-blue-500/10 text-blue-600",
    completed: "bg-green-500/10 text-green-600",
    failed: "bg-red-500/10 text-red-600",
    processing: "bg-blue-500/10 text-blue-600",
    shipped: "bg-purple-500/10 text-purple-600",
    delivered: "bg-green-500/10 text-green-600",
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8 py-12 flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">Manage your portraits, referrals, and orders.</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user.totalPortraits}</p>
                <p className="text-sm text-muted-foreground">Portraits created</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user.credits}</p>
                <p className="text-sm text-muted-foreground">Credits remaining</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Palette className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold capitalize">{user.subscription}</p>
                <p className="text-sm text-muted-foreground">Current plan</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="portraits" className="space-y-8">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="portraits">My Portraits</TabsTrigger>
            <TabsTrigger value="referral">Referral</TabsTrigger>
            <TabsTrigger value="orders">Print Orders</TabsTrigger>
          </TabsList>

          {/* Portraits Tab */}
          <TabsContent value="portraits">
            {portraits.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2">No portraits yet</h3>
                <p className="text-muted-foreground mb-8">
                  Create your first AI portrait and it will appear here.
                </p>
                <Link href="/create">
                  <Button size="lg" className="rounded-full px-8">
                    Create your first portrait
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {portraits.map((p) => (
                  <Card key={p.id} className="overflow-hidden group cursor-pointer">
                    <div className="relative aspect-[4/5] bg-muted">
                      <Badge className={`absolute top-2 right-2 z-10 ${statusColors[p.status]}`}>
                        {p.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <p className="font-medium text-sm">{p.style}</p>
                      <p className="text-xs text-muted-foreground">{p.date}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold mb-2">Invite friends, earn credits</h3>
                    <p className="text-muted-foreground text-sm">
                      Share your referral link. You both get a bonus credit when they create their first portrait.
                    </p>
                  </div>

                  {/* Referral link */}
                  <div className="flex items-center gap-2 mb-8">
                    <div className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm font-mono truncate">
                      artlypet.com/?ref={user.referralCode}
                    </div>
                    <Button onClick={copyReferral} variant="outline" className="rounded-xl shrink-0">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" className="rounded-xl shrink-0">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold">{user.referrals.invited}</p>
                      <p className="text-xs text-muted-foreground">Friends invited</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold">{user.referrals.converted}</p>
                      <p className="text-xs text-muted-foreground">Converted</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold">{user.referrals.creditsEarned}</p>
                      <p className="text-xs text-muted-foreground">Credits earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            {printOrders.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2">No orders yet</h3>
                <p className="text-muted-foreground">
                  Order a print of your portrait and track it here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {printOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{order.size} Print</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={statusColors[order.status]}>{order.status}</Badge>
                        {order.tracking && (
                          <a href={order.tracking} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">Track</Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
