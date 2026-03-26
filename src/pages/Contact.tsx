import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Mail, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { trackLead } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.enum(["general", "support", "business", "press"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Contact = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: "general",
    },
  });

  const onSubmit = (data: ContactForm) => {
    const mailtoLink = `mailto:info@artlypet.com?subject=${encodeURIComponent(
      data.subject + ": " + data.name
    )}&body=${encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
    )}`;
    window.open(mailtoLink, "_blank");
    trackLead("contact_form");
    toast.success(t("contact.success", "Opening your email client... Please send the email to complete your message."));
    reset();
  };

  const faqs = [
    {
      q: t("contact.faq1Q", "How long does it take to generate a portrait?"),
      a: t("contact.faq1A", "Most portraits are generated in 30-60 seconds. If there's high demand, it may take a little longer."),
    },
    {
      q: t("contact.faq2Q", "Can I get a refund if I'm not happy?"),
      a: t("contact.faq2A", "If a generation fails, your credit is automatically refunded. For other issues, please contact our support team."),
    },
    {
      q: t("contact.faq3Q", "Do you ship canvas prints outside the EU?"),
      a: t("contact.faq3A", "Currently, we ship canvas prints across the EU. We're working on expanding to other regions soon."),
    },
    {
      q: t("contact.faq4Q", "Can I use my portrait commercially?"),
      a: t("contact.faq4A", "Yes, you own the generated portrait and can use it for personal or commercial purposes."),
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div {...fadeInUp}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t("contact.title", "Get in Touch")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("contact.subtitle", "Have a question, suggestion, or just want to say hello? We'd love to hear from you.")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24 px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div {...fadeInUp}>
              <div className="bg-background rounded-3xl p-8 shadow-md border border-border">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  {t("contact.formTitle", "Send us a message")}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("contact.name", "Name")}
                    </label>
                    <Input
                      {...register("name")}
                      placeholder={t("contact.namePlaceholder", "Your name")}
                      className="rounded-lg"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("contact.email", "Email")}
                    </label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder={t("contact.emailPlaceholder", "you@example.com")}
                      className="rounded-lg"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("contact.subject", "Subject")}
                    </label>
                    <Select
                      defaultValue="general"
                      onValueChange={(value) =>
                        setValue("subject", value as ContactForm["subject"])
                      }
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">
                          {t("contact.subjectGeneral", "General Inquiry")}
                        </SelectItem>
                        <SelectItem value="support">
                          {t("contact.subjectSupport", "Support")}
                        </SelectItem>
                        <SelectItem value="business">
                          {t("contact.subjectBusiness", "Business")}
                        </SelectItem>
                        <SelectItem value="press">
                          {t("contact.subjectPress", "Press")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("contact.message", "Message")}
                    </label>
                    <Textarea
                      {...register("message")}
                      placeholder={t("contact.messagePlaceholder", "How can we help?")}
                      rows={5}
                      className="rounded-lg resize-none"
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full h-12 w-full text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {t("contact.send", "Send Message")}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {t("contact.mailtoNote", "This will open your default email app to send the message.")}
                  </p>
                </form>
              </div>
            </motion.div>

            {/* Info + FAQ */}
            <div className="space-y-8">
              {/* Contact info */}
              <motion.div {...fadeInUp}>
                <div className="bg-primary/5 rounded-3xl p-8">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    {t("contact.infoTitle", "Contact Information")}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {t("contact.emailLabel", "Email")}
                        </p>
                        <a
                          href="mailto:info@artlypet.com"
                          className="text-primary hover:underline"
                        >
                          info@artlypet.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {t("contact.responseTime", "Response Time")}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {t("contact.responseTimeDesc", "We typically respond within 24 hours")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mini FAQ */}
              <motion.div {...fadeInUp}>
                <div className="bg-background rounded-3xl p-8 shadow-sm border border-border">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    {t("contact.faqTitle", "Quick Answers")}
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-sm text-left font-medium">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
};

export default Contact;
