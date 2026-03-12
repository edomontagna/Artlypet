"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useSession, signOut } from "next-auth/react";

export function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();

  const links = [
    { href: "/", label: "Home" },
    { href: "/#how-it-works", label: "How it Works" },
    { href: "/#styles", label: "Styles" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="relative z-50 p-2 text-foreground"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-[80%] max-w-sm bg-background border-l border-border shadow-2xl"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-10">
                  <span className="font-serif text-xl font-bold text-primary">ArtlyPet</span>
                  <button onClick={() => setOpen(false)} className="p-2" aria-label="Close menu">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 flex-1">
                  {links.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block py-3 px-4 rounded-xl text-lg font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  {session && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                        className="block py-3 px-4 rounded-xl text-lg font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                  )}
                </nav>

                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>

                  {session ? (
                    <div className="space-y-3">
                      <p className="px-4 text-sm text-muted-foreground">
                        Signed in as {session.user?.name}
                      </p>
                      <Button
                        variant="ghost"
                        className="w-full rounded-full"
                        onClick={() => { signOut(); setOpen(false); }}
                      >
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/auth" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full rounded-full">Log in</Button>
                      </Link>
                      <Link href="/create" onClick={() => setOpen(false)}>
                        <Button className="w-full rounded-full">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Create Portrait
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
