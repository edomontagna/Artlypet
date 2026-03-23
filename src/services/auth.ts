import { supabase } from "@/integrations/supabase/client";

export const signInWithPassword = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signUpWithEmail = (
  email: string,
  password: string,
  displayName: string,
  referralCode?: string,
) =>
  supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        display_name: displayName,
        ...(referralCode ? { referral_code: referralCode } : {}),
      },
    },
  });

export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

export const signOut = () => supabase.auth.signOut();

export const resetPassword = (email: string) =>
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
  });

export const updatePassword = (newPassword: string) =>
  supabase.auth.updateUser({ password: newPassword });

export const getSession = () => supabase.auth.getSession();

export const resendConfirmationEmail = (email: string) =>
  supabase.auth.resend({ type: "signup", email });
