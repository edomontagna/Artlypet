import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const Blog = () => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="py-32 px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Pencil className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t("blog.comingSoon", "Blog Coming Soon")}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t("blog.comingSoonDesc", "We're working on pet portrait tips, art style guides, and inspiration. In the meantime, create your first portrait!")}
            </p>
            <Button asChild className="rounded-full h-12 px-8 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/signup">
                {t("nav.getStarted", "Get Started")} <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
};

export default Blog;
