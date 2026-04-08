import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Mail, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackLead } from "@/hooks/useAnalytics";

const NewsletterSection = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers" as string)
        .insert({ email: trimmed, source: "website" });

      if (error) {
        if (error.code === "23505") {
          toast.info(t("newsletter.alreadySubscribed", "You're already subscribed!"));
        } else {
          throw error;
        }
      } else {
        toast.success(t("newsletter.success", "You're in! Check your inbox for a welcome surprise."));
        trackLead("newsletter");
      }
      setEmail("");
    } catch {
      toast.error(t("newsletter.error", "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-gold/5">
      <div className="container px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t("newsletter.title", "Stay in the Loop")}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            {t("newsletter.subtitle", "Get exclusive tips, new styles, and special offers. Plus 100 bonus credits on your first purchase.")}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder", "Enter your email")}
              className="h-12 rounded-full px-5 flex-1"
              required
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-full px-6 font-medium shimmer-btn text-primary-foreground gap-2"
            >
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t("newsletter.cta", "Subscribe")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            {t("newsletter.consent", "No spam. Unsubscribe anytime.")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
