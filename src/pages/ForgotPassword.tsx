import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <Card
        className="w-full max-w-md border"
        style={{
          borderRadius: 0,
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "none",
        }}
      >
        <CardHeader className="text-center pb-6">
          <Link
            to="/"
            className="mx-auto mb-4 inline-block"
            style={{ textDecoration: "none" }}
          >
            <span
              className="font-serif"
              style={{ fontSize: "1.75rem", fontWeight: 300, color: "var(--text)", letterSpacing: "0.04em" }}
            >
              Artly
            </span>
            <span className="logo-accent" style={{ fontSize: "1.75rem", fontWeight: 300, color: "var(--accent)" }}>
              Pet
            </span>
          </Link>
          <CardTitle
            className="font-serif"
            style={{ fontSize: "1.5rem", fontWeight: 300, color: "var(--text)", letterSpacing: "0.02em" }}
          >
            Reset Password
          </CardTitle>
          <CardDescription
            className="font-sans"
            style={{ color: "var(--muted)", fontSize: "0.875rem" }}
          >
            {sent
              ? "Check your email for a reset link"
              : "Enter your email and we'll send you a reset link"}
          </CardDescription>
        </CardHeader>
        {sent ? (
          <CardContent className="text-center pb-8">
            <Mail className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--accent)" }} />
            <p className="text-sm font-sans" style={{ color: "var(--muted)" }}>
              If an account exists with that email, you'll receive a password reset link shortly.
            </p>
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="font-sans uppercase tracking-widest text-xs"
                        style={{ color: "var(--muted)" }}
                      >
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="font-sans"
                          style={{
                            borderRadius: 0,
                            borderColor: "var(--border)",
                            background: "transparent",
                            color: "var(--text)",
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="btn-editorial w-full uppercase tracking-widest text-xs font-sans"
                  disabled={loading}
                  style={{
                    borderRadius: 0,
                    background: "var(--accent)",
                    color: "var(--bg)",
                    height: "2.75rem",
                    boxShadow: "none",
                  }}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
        <div className="px-6 pb-6 text-center">
          <Link
            to="/login"
            className="text-sm font-sans inline-flex items-center gap-1"
            style={{ color: "var(--muted)" }}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
