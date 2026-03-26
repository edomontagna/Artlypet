import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

const schema = z.object({
  email: z.string().email(i18n.t("validation.invalidEmail", "Please enter a valid email address")),
});

type FormData = z.infer<typeof schema>;

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
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl bg-card p-8 shadow-md border border-border/50">
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
            {t("auth.resetPassword", "Reset Password")}
          </CardTitle>
          <CardDescription className="font-sans text-sm text-muted-foreground">
            {sent
              ? t("auth.checkResetEmail", "Check your email for a reset link")
              : t("auth.resetDesc", "Enter your email and we'll send you a reset link")}
          </CardDescription>
        </CardHeader>
        {sent ? (
          <CardContent className="text-center pb-8 p-0">
            <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-sm font-sans text-muted-foreground">
              {t("auth.resetSent", "If an account exists with that email, a reset link has been sent. Check your inbox.")}
            </p>
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 p-0">
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
              </CardContent>
              <CardFooter className="flex flex-col gap-4 p-0 pt-6">
                <Button
                  type="submit"
                  className="rounded-full h-12 w-full bg-primary text-primary-foreground font-sans text-sm shadow-md hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading && <span role="status" aria-label="Loading"><Loader2 className="mr-2 h-4 w-4 animate-spin" /></span>}
                  {t("auth.sendResetLink", "Send Reset Link")}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
        <div className="pt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-sans inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            {t("auth.backToSignIn", "Back to Sign In")}
          </Link>
        </div>
      </Card>
      </div>

      {/* Right — Showcase (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-background dark:from-primary/20 dark:via-primary/10 dark:to-card">
        <div className="absolute inset-0 bg-noise" />
        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="aspect-[4/5] rounded-3xl shadow-2xl overflow-hidden mb-8">
            <img
              src="/images/watercolor.webp"
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

export default ForgotPassword;
