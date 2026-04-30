import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { resendConfirmationEmail } from "@/services/auth";
import { toast } from "sonner";
import { SEOHead } from "@/components/SEOHead";
import { Loader2, Shield, Lock, Eye, EyeOff, ArrowUpRight, ArrowLeft } from "lucide-react";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { safeRedirect } from "@/lib/redirect";
import { safeGetItem, safeRemoveItem } from "@/lib/storage";

const mapAuthError = (message: string, t: (key: string, fallback: string) => string): string => {
  if (message.includes("Invalid login credentials"))
    return t("auth.errors.invalidCredentials", "Invalid email or password. Please check your credentials and try again.");
  if (message.includes("Email not confirmed"))
    return t("auth.errors.emailNotConfirmed", "Your email has not been confirmed yet. Please check your inbox for the confirmation link.");
  if (message.includes("User already registered"))
    return t("auth.errors.userAlreadyRegistered", "An account with this email already exists. Please sign in instead.");
  return t("auth.errors.generic", "Something went wrong. Please try again later.");
};

const schema = z.object({
  email: z.string().email(i18n.t("validation.invalidEmail", "Please enter a valid email address")),
  password: z.string().min(1, i18n.t("validation.passwordRequired", "Password is required")),
});

type FormData = z.infer<typeof schema>;

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Login = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading, signIn, signInWithGoogle } = useAuth();

  // Already-authenticated users → bounce to dashboard (or validated redirect)
  useEffect(() => {
    if (!authLoading && user) {
      const target = safeRedirect(searchParams.get("redirect"), "/dashboard");
      navigate(target, { replace: true });
    }
  }, [user, authLoading, navigate, searchParams]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const handleResendConfirmation = async () => {
    const email = form.getValues("email");
    if (!email) return;
    setResending(true);
    const { error } = await resendConfirmationEmail(email);
    if (error) toast.error(t("auth.resendError", "Failed to resend confirmation email. Please try again."));
    else toast.success(t("auth.resendSuccess", "Confirmation email sent! Please check your inbox."));
    setResending(false);
  };

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    setEmailNotConfirmed(false);
    const { error } = await signIn(values.email, values.password);
    if (error) {
      if (error.message.includes("Email not confirmed")) setEmailNotConfirmed(true);
      toast.error(mapAuthError(error.message, t));
    } else {
      const queryRedirect = searchParams.get("redirect");
      const storedRedirect = safeGetItem("artlypet_redirect");
      const target = safeRedirect(queryRedirect ?? storedRedirect, "/dashboard");
      if (storedRedirect) safeRemoveItem("artlypet_redirect");
      navigate(target);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(mapAuthError(error.message, t));
      setGoogleLoading(false);
    }
  };

  return (
    <div className="app-ui min-h-[100dvh] flex bg-background">
      <SEOHead
        title="Sign in — Artlypet"
        description="Sign in to your Artlypet account to create AI pet portraits."
        canonical="/login"
      />

      {/* LEFT — Form (flex 1, max-width on inner) */}
      <div className="flex-1 flex flex-col px-5 sm:px-8 py-8 lg:py-10">
        <header className="flex items-center justify-between max-w-md w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>{t("auth.backHome", "Back home")}</span>
          </Link>
          <span className="font-serif text-lg font-bold text-foreground">Artlypet</span>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-9">
              <span className="sec-label">{t("auth.welcomeKicker", "Welcome back")}</span>
              <h1 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tightest leading-tight text-foreground">
                {t("auth.welcomeBack", "Sign in to your studio")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t("auth.signInDesc", "Pick up where you left off — your portraits are waiting.")}
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full inline-flex items-center justify-center gap-3 rounded-full h-12 border border-border hover:border-primary/40 hover:bg-muted/40 px-5 text-sm font-medium text-foreground transition-colors btn-press disabled:opacity-50"
            >
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              <span>{t("auth.continueWithGoogle", "Continue with Google")}</span>
            </button>

            <div className="relative my-6 flex items-center">
              <div className="flex-1 h-px bg-border" />
              <span className="px-4 text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">{t("auth.or", "or")}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                          {t("auth.password", "Password")}
                        </FormLabel>
                        <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                          {t("auth.forgotPassword", "Forgot password?")}
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.enterPassword", "Enter your password")}
                            className="rounded-xl h-12 border-border bg-card focus-visible:ring-primary/30 focus-visible:border-primary pr-11"
                            autoComplete="current-password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showPassword ? t("auth.hidePassword", "Hide password") : t("auth.showPassword", "Show password")}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
                          </button>
                        </div>
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
                    <span>{t("auth.signIn", "Sign in")}</span>
                    {!loading && <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />}
                  </button>
                </div>

                {emailNotConfirmed && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resending}
                    className="text-sm text-primary hover:underline disabled:opacity-50 mx-auto block"
                  >
                    {resending ? t("auth.resending", "Sending…") : t("auth.resendConfirmation", "Resend confirmation email")}
                  </button>
                )}
              </form>
            </Form>

            <div className="mt-7 pt-6 border-t border-border space-y-4">
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-3 w-3" strokeWidth={1.75} /> {t("auth.secureLogin", "Encrypted")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3 w-3" strokeWidth={1.75} /> {t("auth.dataProtected", "GDPR-clean")}
                </span>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                {t("auth.noAccount", "Don't have an account?")}{" "}
                <Link to="/signup" className="font-semibold text-foreground hover:text-primary transition-colors">
                  {t("auth.signUp", "Sign up")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Showcase (lg+) */}
      <AuthShowcase pillText={t("auth.welcomeKicker", "Welcome back")} />
    </div>
  );
};

export default Login;
