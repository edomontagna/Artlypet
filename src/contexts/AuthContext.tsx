import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import * as authService from "@/services/auth";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => ReturnType<typeof authService.signInWithPassword>;
  signUp: (email: string, password: string, displayName: string, referralCode?: string) => ReturnType<typeof authService.signUpWithEmail>;
  signInWithGoogle: () => ReturnType<typeof authService.signInWithGoogle>;
  signOut: () => ReturnType<typeof authService.signOut>;
  resetPassword: (email: string) => ReturnType<typeof authService.resetPassword>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const userInitiatedSignOutRef = useRef(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        setLoading(false);

        if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
          // Show toast only for unexpected sign-outs (e.g. token expiry)
          if (!userInitiatedSignOutRef.current) {
            toast.error("Your session has expired. Please sign in again.");
          }
          userInitiatedSignOutRef.current = false;
        }

        if (event === "TOKEN_REFRESHED" && !s) {
          // Token refresh failed — session is gone
          setSession(null);
          setUser(null);
          toast.error("Your session has expired. Please sign in again.");
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn: authService.signInWithPassword,
    signUp: authService.signUpWithEmail,
    signInWithGoogle: authService.signInWithGoogle,
    signOut: () => {
      userInitiatedSignOutRef.current = true;
      return authService.signOut();
    },
    resetPassword: authService.resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
