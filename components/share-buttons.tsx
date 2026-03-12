"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const channels = [
    { name: "X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, color: "hover:bg-black hover:text-white", icon: "𝕏" },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: "hover:bg-blue-600 hover:text-white", icon: "f" },
    { name: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, color: "hover:bg-green-500 hover:text-white", icon: "W" },
    { name: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`, color: "hover:bg-red-600 hover:text-white", icon: "P" },
  ];

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={copy}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
      >
        {copied ? (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-primary">
            <Check className="w-4 h-4" /> Copied!
          </motion.span>
        ) : (
          <><Link2 className="w-4 h-4" /> Copy link</>
        )}
      </button>

      {channels.map((ch) => (
        <a
          key={ch.name}
          href={ch.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-10 h-10 rounded-full border border-border flex items-center justify-center text-sm font-bold transition-colors ${ch.color}`}
          title={`Share on ${ch.name}`}
        >
          {ch.icon}
        </a>
      ))}
    </div>
  );
}
