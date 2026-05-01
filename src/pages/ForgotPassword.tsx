import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import { AuthShowcase } from "@/components/auth/AuthShowcase";

const schema = z.object({
  email: z.string().email(i18n.t("validation.invalidEmail", "Please enter a valid email address")),
});
type FormData = z.infer<typeof schema>;

const mapResetError = (msg: string, t: (k: string, f: string) => string): string => {
  if (msg.includes("rate") || msg.includes("Rate")) return t("auth.errors.tooManyRequests", "Too many requests. Please wait a moment and try again.");
  return t("auth.errors.generic", "Something went wrong. Please try again later.");
};

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    const { error } = await resetPassword(values.email);
    if (error) toast.error(mapResetError(error.message, t));
    else setSent(true);
    setLoading(false);
  };

  return (
    <div className="app-ui min-h-[100dvh] flex bg-background">
      <div className="flex-1 flex flex-col px-5 sm:px-8 py-8 lg:py-10">
        <header className="flex items-center justify-between max-w-md w-full mx-auto">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>{t("auth.backToSignIn", "Torna al login")}</span>
          </Link>
          <span className="font-serif text-lg font-bold text-foreground">Artlypet</span>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <span className="sec-label">{t("auth.resetKicker", "Account recovery")}</span>
              <h1 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tightest leading-tight text-foreground">
                {sent ? t("auth.checkResetEmail", "Check your inbox") : t("auth.resetPassword", "Reset your password")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {sent
                  ? t("auth.resetSent", "If an account exists with that email, a reset link is on its way.")
                  : t("auth.resetDesc", "Enter your email and we'll send you a link to set a new password.")}
              </p>
            </div>

            {sent ? (
              <div className="bento-card p-8 flex flex-col items-center text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/12 mb-5">
                  <Mail className="h-6 w-6 text-primary" strokeWidth={1.75} />
                </div>
                <p className="text-sm text-muted-foreground mb-6 max-w-[36ch] leading-relaxed">
                  {t("auth.resetSentDetail", "The link expires in 1 hour. Don't see it? Check your spam folder.")}
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>{t("auth.backToSignIn", "Torna al login")}</span>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                          {t("auth.email", "Email")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="rounded-xl h-12 border-border bg-card focus-visible:ring-primary/30 focus-visible:border-primary"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full h-13 px-6 text-sm font-semibold bg-foreground text-background hover:bg-primary hover:text-primary-foreground disabled:opacity-50 transition-colors btn-press"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      <span>{t("auth.sendResetLink", "Send reset link")}</span>
                      {!loading && <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />}
                    </button>
                  </div>
                </form>
              </Form>
            )}

            <div className="mt-7 pt-6 border-t border-border">
              <p className="text-sm text-center text-muted-foreground">
                {t("auth.rememberedIt", "Remembered it?")}{" "}
                <Link to="/login" className="font-semibold text-foreground hover:text-primary transition-colors">
                  {t("auth.signIn", "Sign in")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <AuthShowcase pillText={t("auth.resetPill", "Recupero veloce")} />
    </div>
  );
};

export default ForgotPassword;
