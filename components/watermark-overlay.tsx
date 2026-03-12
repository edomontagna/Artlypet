"use client";

import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

interface WatermarkOverlayProps {
  show: boolean;
}

export function WatermarkOverlay({ show }: WatermarkOverlayProps) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {/* Diagonal repeating watermark */}
      <div className="absolute inset-0 flex items-center justify-center -rotate-45 scale-150">
        <div className="flex flex-col gap-12 opacity-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-16 whitespace-nowrap">
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j} className="text-white text-2xl font-serif font-bold select-none">
                  ArtlyPet
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom upgrade banner */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
        <div className="bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 pt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Watermarked preview</span>
            </div>
            <Link href="/pricing">
              <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/90">
                Remove watermark
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
