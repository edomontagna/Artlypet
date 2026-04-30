import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SEOHead } from "@/components/SEOHead";
import { Loader2, Shield, Lock, Eye, EyeOff, ArrowUpRight, ArrowLeft, Gift } from "lucide-react";
import { trackCompleteRegistration } from "@/hooks/useAnalytics";
import { safeGetItem, safeSetItem } from "@/lib/storage";
import { safeRedirect } from "@/lib/redirect";
import { AuthShowcase } from "@/components/auth/AuthShowcase";

const mapAuthError = (message: string, t: (key: string, fallback: string) => string): string => {
  if (message.includes("Invalid login credentials"))
    return t("auth.errors.invalidCredentials", "Invalid email or password. Please check your credentials and try again.");
  if (message.includes("Email not confirmed"))
    return t("auth.errors.emailNotConfirmed", "Your email has not been confirmed yet. Please check your inbox for the confirmation link.");
  if (message.includes("User already registered"))
    return t("auth.errors.userAlreadyRegistered", "An account with this email already exists. Please sign in instead.");
  return t("auth.errors.generic", "Something went wrong. Please try again later.");
};

const createSchema = (t: (key: string, fallback: string) => string) =>
  z.object({
    displayName: z.string().min(2, t("validation.nameMinChars", "Name must be at least 2 characters")).max(50).trim(),
    email: z.string().email(t("validation.invalidEmail", "Please enter a valid email address")),
    password: z.string().min(10, t("validation.passwordMinChars", "Password must be at least 10 characters")),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: t("validation.termsRequired", "You must accept the Terms of Service and Privacy Policy") }),
    }),
  });

type FormData = z.infer<ReturnType<typeof createSchema>>;

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 10) score += 25;
  if (password.length >= 14) score += 15;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 20;
  if (/[^a-zA-Z\d]/.test(password)) score += 20;
  return Math.min(score, 100);
};

const getStrengthLabel = (score: number, t: (key: string, fallback: string) => string) => {
  if (score < 30) return t("auth.weak", "Weak");
  if (score < 60) return t("auth.fair", "Fair");
  if (score < 80) return t("auth.good", "Good");
  return t("auth.strong", "Strong");
};

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Signup = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading, signUp, signInWithGoogle } = useAuth();

  // Already-authenticated → bounce to validated redirect
  useEffect(() => {
    if (!authLoading && user) {
      const target = safeRedirect(searchParams.get("redirect"), "/dashboard");
      navigate(target, { replace: true });
    }
  }, [user, authLoading, navigate, searchParams]);

  const [hasReferral, setHasReferral] = useState(false);
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && /^[A-Za-z0-9_-]{4,32}$/.test(ref)) safeSetItem("artlypet_ref", ref);
    if (ref || safeGetItem("artlypet_ref")) setHasReferral(true);
  }, [searchParams]);

  const schema = createSchema(t);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", email: "", password: "", termsAccepted: false as unknown as true },
  });

  const password = form.watch("password");
  const strength = getPasswordStrength(password || "");

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    const refCode = safeGetItem("artlypet_ref") || undefined;
    const { error } = await signUp(values.email, values.password, values.displayName, refCode);
    if (error) {
      toast.error(mapAuthError(error.message, t));
    } else {
      const queryRedirect = searchParams.get("redirect");
      if (queryRedirect) {
        const validated = safeRedirect(queryRedirect, "/dashboard");
        if (validated !== "/dashboard") safeSetItem("artlypet_redirect", validated);
      }
      toast.success(t("auth.checkEmailConfirmation", "Check your email for a confirmation link to complete your registration."));
      trackCompleteRegistration("email");
      const target = queryRedirect ? `/login?redirect=${encodeURIComponent(safeRedirect(queryRedirect, "/dashboard"))}` : "/login";
      navigate(target);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(mapAuthError(error.message, t));
      setGoogleLoading(false);
    } else {
      trackCompleteRegistration("google");
    }
  };

  return (
    <div className="app-ui min-h-[100dvh] flex bg-background">
      <SEOHead
        title="Create your account — Artlypet"
        description="Create your free Artlypet account and get 3 AI pet portraits free."
        canonical="/signup"
      />

      {/* LEFT — Form */}
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

            {hasReferral && (
              <div className="mb-7 inline-flex items-center gap-2.5 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm text-foreground">
                <Gift className="h-4 w-4 text-primary" strokeWidth={1.75} />
                <span className="font-medium">{t("auth.referralBanner", "You've been invited! Sign up and get 150 bonus credits")}</span>
              </div>
            )}

            <div className="mb-8">
              <span className="sec-label">{t("auth.signupKicker", "Free signup")}</span>
              <h1 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tightest leading-tight text-foreground">
                {t("auth.createAccount", "Create your account")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t("auth.createAccountDesc", "3 portraits included — no card required.")}
              </p>
            </div>

            <button
              onClick={handleGoogleSignUp}
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
                  name="displayName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                        {t("auth.displayName", "Display name")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("auth.yourName", "Your name")}
                          className="rounded-xl h-12 border-border bg-card focus-visible:ring-primary/30 focus-visible:border-primary"
                          autoComplete="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
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
                      <FormLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                        {t("auth.password", "Password")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.minChars", "Min 10 characters")}
                            className="rounded-xl h-12 border-border bg-card focus-visible:ring-primary/30 focus-visible:border-primary pr-11"
                            autoComplete="new-password"
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
                      {password && password.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">{t("auth.passwordStrength", "Password strength")}</span>
                            <span className={`font-mono tabular font-semibold ${strength >= 80 ? "text-primary" : "text-muted-foreground"}`}>
                              {getStrengthLabel(strength, t)}
                            </span>
                          </div>
                          <div className="rounded-full h-1 bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-400 rounded-full"
                              style={{ width: `${strength}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-2.5">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value as unknown as boolean}
                            onChange={field.onChange}
                            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
                          />
                        </FormControl>
                        <FormLabel className="text-sm text-muted-foreground leading-snug cursor-pointer font-normal">
                          {t("auth.agreeTerms", "I agree to the <termsLink>Terms of Service</termsLink> and <privacyLink>Privacy Policy</privacyLink>")
                            .split(/<termsLink>|<\/termsLink>|<privacyLink>|<\/privacyLink>/)
                            .map((part, i) => {
                              if (i === 1) return <Link key="terms" to="/terms" className="text-primary hover:underline">{part}</Link>;
                              if (i === 3) return <Link key="privacy" to="/privacy" className="text-primary hover:underline">{part}</Link>;
                              return part;
                            })}
                        </FormLabel>
                      </div>
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
                    <span>{t("auth.createBtn", "Create account")}</span>
                    {!loading && <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />}
                  </button>
                </div>
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
                {t("auth.hasAccount", "Already have an account?")}{" "}
                <Link to="/login" className="font-semibold text-foreground hover:text-primary transition-colors">
                  {t("auth.signIn", "Sign in")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Showcase */}
      <AuthShowcase pillText={t("auth.signupPill", "3 free portraits, no card")} />
    </div>
  );
};

export default Signup;
