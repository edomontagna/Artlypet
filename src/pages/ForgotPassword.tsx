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
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
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
            Reset Password
          </CardTitle>
          <CardDescription className="font-sans text-sm text-muted-foreground">
            {sent
              ? "Check your email for a reset link"
              : "Enter your email and we'll send you a reset link"}
          </CardDescription>
        </CardHeader>
        {sent ? (
          <CardContent className="text-center pb-8 p-0">
            <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-sm font-sans text-muted-foreground">
              If an account exists with that email, you'll receive a password reset link shortly.
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
                        Email
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
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
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
            Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
