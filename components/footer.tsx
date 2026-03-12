"use client";

import * as React from "react";
import Link from "next/link";
import { Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 py-16">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-3xl font-bold tracking-tight text-primary">
                ArtlyPet
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
              Transform photos of your pets and loved ones into museum-quality artistic portraits using advanced AI.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif text-xl font-semibold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/styles" className="text-muted-foreground hover:text-primary transition-colors">Styles</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/create" className="text-muted-foreground hover:text-primary transition-colors">Create Portrait</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-xl font-semibold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/legal" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><a href="mailto:support@artlypet.com" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/40 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} ArtlyPet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
