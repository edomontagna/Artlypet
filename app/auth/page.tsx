"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Type for saved users in localStorage
type StoredUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  name: string;
};

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = React.useState(true);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Load registered users from localStorage
      const storedUsers = localStorage.getItem("registeredUsers");
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];

      if (isLogin) {
        // Login: check if user exists
        const user = users.find((u) => u.email === email && u.password === password);

        if (!user) {
          setError("No account found. Please sign up!");
          setLoading(false);
          return;
        }

        // Login with NextAuth
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Email or password is invalid");
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        // Signup: check if email is already registered
        if (users.find((u) => u.email === email)) {
          setError("This email is already registered");
          setLoading(false);
          return;
        }

        // Validate password
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        // Save new user to localStorage
        const newUser: StoredUser = {
          firstName,
          lastName,
          email,
          password,
          name: `${firstName} ${lastName}`,
        };

        users.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(users));

        // Auto login after registration
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Error during registration");
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Welcome</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Start transforming your photos into works of art"
                : "Join ArtlyPet and start creating"}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Mario"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Rossi"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="mario.rossi@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Minimum 6 characters"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full h-14 text-base"
                disabled={loading}
              >
                  {loading
                  ? "Loading..."
                  : isLogin
                    ? "Sign in"
                    : "Sign up"}
                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="font-medium underline">
                  {isLogin ? "Sign up" : "Sign in"}
                </span>
              </button>
            </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 p-6 bg-muted/30 rounded-2xl"
          >
            <p className="text-sm text-muted-foreground">
              Demo: Registration saves account locally. In production, data will be saved to database.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
      </div>
      <Footer />
    </div>
  );
}
