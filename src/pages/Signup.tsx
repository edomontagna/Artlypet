import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

const schema = z.object({
  displayName: z.string().min(2, i18n.t("validation.nameMinChars", "Name must be at least 2 characters")),
  email: z.string().email(i18n.t("validation.invalidEmail", "Please enter a valid email address")),
  password: z.string().min(10, i18n.t("validation.passwordMinChars", "Password must be at least 10 characters")),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: i18n.t("validation.termsRequired", "You must accept the Terms of Service and Privacy Policy") }),
  }),
});

type FormData = z.infer<typeof schema>;

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

const Signup = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, signInWithGoogle } = useAuth();

  // Capture referral code from URL (?ref=ABC123) and persist in localStorage
  const [hasReferral, setHasReferral] = useState(false);
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) localStorage.setItem("artlypet_ref", ref);
    if (ref || localStorage.getItem("artlypet_ref")) setHasReferral(true);
  }, [searchParams]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", email: "", password: "", termsAccepted: false as unknown as true },
  });

  const password = form.watch("password");
  const strength = getPasswordStrength(password || "");

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    const refCode = localStorage.getItem("artlypet_ref") || undefined;
    const { error } = await signUp(values.email, values.password, values.displayName, refCode);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("auth.checkEmailConfirmation", "Check your email for a confirmation link to complete your registration."));
      navigate("/login");
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl bg-card p-8 shadow-md border border-border/50">
        {hasReferral && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-center text-sm text-green-800 font-medium">
            {"\uD83C\uDF89"} {t("auth.referralBanner", "You've been invited! Sign up and get 150 bonus credits")}
          </div>
        )}
        <CardHeader className="text-center pb-6 p-0 mb-6">
          <Link to="/" className="mx-auto mb-4 inline-block no-underline">
            <span className="font-serif text-2xl font-bold text-primary">
              Artly
            </span>
            <span className="font-serif text-2xl font-bold text-foreground">
              Pet
            </span>
          </Link>
          <CardTitle className="font-serif text-2xl font-bold text-foreground">
            {t("auth.createAccount", "Create Your Account")}
          </CardTitle>
          <CardDescription className="font-sans text-sm text-muted-foreground">
            {t("auth.createAccountDesc", "Start creating pet masterpieces")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 p-0">
          <Button
            variant="outline"
            className="w-full rounded-full h-12 border border-border hover:bg-muted font-sans text-sm"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {t("auth.continueWithGoogle", "Continue with Google")}
          </Button>

          <div className="relative">
            <Separator className="bg-border" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs font-sans text-muted-foreground">
              {t("auth.or", "or")}
            </span>
          </div>
        </CardContent>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 p-0 pt-2">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-sm text-muted-foreground">
                      {t("auth.displayName", "Display Name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("auth.yourName", "Your name")}
                        className="rounded-lg font-sans border-border bg-background focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-sm text-muted-foreground">
                      {t("auth.email", "Email")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="rounded-lg font-sans border-border bg-background focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-sm text-muted-foreground">
                      {t("auth.password", "Password")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("auth.minChars", "Min 10 characters")}
                        className="rounded-lg font-sans border-border bg-background focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {password && password.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-xs font-sans">
                          <span className="text-muted-foreground">{t("auth.passwordStrength", "Password strength")}</span>
                          <span className={strength >= 80 ? "text-primary" : "text-muted-foreground"}>
                            {getStrengthLabel(strength, t)}
                          </span>
                        </div>
                        <div className="rounded-full h-2 bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300 rounded-full"
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
                    <div className="flex items-start gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value as unknown as boolean}
                          onChange={field.onChange}
                          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormLabel className="font-sans text-sm text-muted-foreground leading-snug cursor-pointer">
                        {t("auth.agreeTerms", "I agree to the <termsLink>Terms of Service</termsLink> and <privacyLink>Privacy Policy</privacyLink>")
                          .split(/<termsLink>|<\/termsLink>|<privacyLink>|<\/privacyLink>/)
                          .map((part, i) => {
                            if (i === 1) return <Link key="terms" to="/terms" className="text-primary hover:underline">{part}</Link>;
                            if (i === 3) return <Link key="privacy" to="/privacy" className="text-primary hover:underline">{part}</Link>;
                            return part;
                          })}
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-0 pt-6">
              <Button
                type="submit"
                className="rounded-full h-12 w-full bg-primary text-primary-foreground font-sans text-sm shadow-md hover:bg-primary/90"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("auth.createBtn", "Create Account")}
              </Button>
              <p className="text-sm font-sans text-muted-foreground">
                {t("auth.hasAccount", "Already have an account?")}{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:underline"
                >
                  {t("auth.signIn", "Sign in")}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
      </div>

      {/* Right — Showcase (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 bg-noise" />
        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">300 Free Credits</span>
          </div>
          <div className="aspect-[4/5] rounded-3xl shadow-2xl overflow-hidden mb-8">
            <img
              src="/images/renaissance.webp"
              alt="AI pet portrait example"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{t("auth.showcaseTitle", "Transform Your Pet Into Art")}</h3>
          <p className="text-muted-foreground text-sm">{t("auth.showcaseDesc", "Join thousands of pet lovers creating stunning AI portraits")}</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
