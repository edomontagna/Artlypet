"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { data: session } = useSession();
  const [credits, setCredits] = React.useState<number>(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    // Load credits from localStorage
    const savedCredits = localStorage.getItem("credits");
    if (savedCredits) {
      setCredits(parseInt(savedCredits, 10));
    }
  }, []);

  // Update credits when session changes (login)
  React.useEffect(() => {
    if (session) {
      const savedCredits = localStorage.getItem("credits");
      const savedSub = localStorage.getItem("subscription");

      // If no saved credits/subscription and has Free plan, assign default credits
      if (!savedCredits && !savedSub) {
        localStorage.setItem("credits", "3");
        localStorage.setItem("subscription", "free");
        setCredits(3);
      } else if (savedCredits) {
        setCredits(parseInt(savedCredits, 10));
      }
    }
  }, [session]);

  const handleLogout = async () => {
    // Clear localStorage on logout (including registered users)
    localStorage.removeItem("subscription");
    localStorage.removeItem("credits");
    localStorage.removeItem("registeredUsers");
    await signOut();
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        isScrolled
          ? "border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">
              ArtlyPet
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              How it Works
            </Link>
            <Link
              href="/#styles"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Styles
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <MobileMenu />
          <div className="hidden md:flex gap-2">
            {session ? (
              <>
                <span className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  Hello, {session.user?.name}
                  {credits > 0 && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      {credits} credits
                    </span>
                  )}
                </span>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="rounded-full"
                >
                  Log out
                </Button>
                <Link href="/create">
                  <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Create Portrait
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" className="rounded-full">Log in</Button>
                </Link>
                <Link href="/create">
                  <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
