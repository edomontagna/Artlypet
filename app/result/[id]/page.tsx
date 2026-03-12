"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WatermarkOverlay } from "@/components/watermark-overlay";
import { ShareButtons } from "@/components/share-buttons";
import { Download, Printer, ArrowRight, Lock, Sparkles } from "lucide-react";

export default function ResultPage() {
  const [revealed, setRevealed] = React.useState(false);

  // Placeholder — will connect to Supabase
  const portrait = {
    id: "demo",
    style: "Renaissance",
    mode: "pets",
    outputUrl: "https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/feb347d6-156c-4795-8e20-6e8adea7ed89/be2b3b61eeed3ddcb6783df61f522ca5.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1773050881&Signature=ZrXoOfErc0aldP6y3LtczYbPwqY=",
    isWatermarked: true,
    resolution: "hd" as string,
    date: new Date().toLocaleDateString(),
  };

  const isFreeTier = portrait.isWatermarked;

  React.useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Your masterpiece is ready</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {portrait.style} Portrait
            </h1>
          </motion.div>

          {/* Portrait with reveal animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-lg mx-auto mb-12"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              {/* Golden shimmer overlay during reveal */}
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{ opacity: revealed ? 0 : 0.8 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 z-20 bg-gradient-to-br from-amber-200/80 via-yellow-100/60 to-amber-300/80 backdrop-blur-xl"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-12 h-12 text-amber-600" />
                  </motion.div>
                </div>
              </motion.div>

              <Image
                src={portrait.outputUrl}
                alt={`${portrait.style} portrait`}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                priority
              />

              <WatermarkOverlay show={isFreeTier} />
            </div>

            {/* Frame shadow effect */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-3xl blur-2xl" />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: revealed ? 1 : 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge variant="secondary">{portrait.style}</Badge>
              <Badge variant="outline">{portrait.mode}</Badge>
              <Badge variant="outline">{portrait.resolution.toUpperCase()}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{portrait.date}</p>
          </motion.div>

          {/* Upgrade banner for free users */}
          {isFreeTier && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }}
              className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl p-6 mb-8 text-center"
            >
              <p className="font-medium mb-2">Want this portrait without watermark?</p>
              <p className="text-sm text-muted-foreground mb-4">
                Upgrade to Creator or Pro to download clean, high-resolution portraits.
              </p>
              <Link href="/pricing">
                <Button className="rounded-full">
                  View Plans <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Button size="lg" className="rounded-full px-8 h-14 gap-2" disabled={isFreeTier}>
              <Download className="w-5 h-5" />
              Download HD
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 gap-2"
              disabled={portrait.resolution !== "4k"}
            >
              {portrait.resolution !== "4k" && <Lock className="w-4 h-4" />}
              Download 4K
              {portrait.resolution !== "4k" && (
                <Badge variant="pro" className="ml-2 text-[10px]">PRO</Badge>
              )}
            </Button>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 gap-2">
                <Printer className="w-5 h-5" />
                Order Print
              </Button>
            </Link>
          </motion.div>

          {/* Share */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: revealed ? 1 : 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            <ShareButtons url={`https://artlypet.com/result/${portrait.id}`} title="Check out my AI pet portrait on ArtlyPet!" />
          </motion.div>

          {/* Create another */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: revealed ? 1 : 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Link href="/create">
              <Button variant="ghost" size="lg" className="rounded-full gap-2">
                Create another portrait <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
