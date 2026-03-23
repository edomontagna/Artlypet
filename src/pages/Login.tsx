import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    const { error } = await signIn(values.email, values.password);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
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
            Welcome Back
          </CardTitle>
          <CardDescription
            className="font-sans"
            style={{ color: "var(--muted)", fontSize: "0.875rem" }}
          >
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full uppercase tracking-widest text-xs font-sans"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            style={{
              borderRadius: 0,
              borderColor: "var(--border)",
              background: "transparent",
              color: "var(--text)",
              height: "2.75rem",
            }}
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
            Continue with Google
          </Button>

          <div className="relative">
            <Separator style={{ background: "var(--border)" }} />
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs font-sans uppercase tracking-widest"
              style={{ background: "var(--surface)", color: "var(--muted)" }}
            >
              or
            </span>
          </div>
        </CardContent>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-0">
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel
                        className="font-sans uppercase tracking-widest text-xs"
                        style={{ color: "var(--muted)" }}
                      >
                        Password
                      </FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-xs font-sans"
                        style={{ color: "var(--accent)" }}
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
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
                Sign In
              </Button>
              <p className="text-sm font-sans" style={{ color: "var(--muted)" }}>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
