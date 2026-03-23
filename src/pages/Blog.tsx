import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Blog = () => {
  const { t } = useTranslation();

  const articles = [
    {
      title: t("blog.article1Title", "10 Best Pet Portrait Gift Ideas for 2026"),
      excerpt: t(
        "blog.article1Excerpt",
        "Looking for the perfect gift for a pet lover? From AI-generated portraits to custom canvas prints, here are our top picks for unique and memorable pet gifts."
      ),
      date: "2026-03-15",
      category: t("blog.categoryGifts", "Gift Ideas"),
      image: "/placeholder.svg",
    },
    {
      title: t("blog.article2Title", "Royal Pet Portraits: A Fascinating History"),
      excerpt: t(
        "blog.article2Excerpt",
        "From Renaissance court painters to modern AI, the tradition of creating regal pet portraits spans centuries. Discover the rich history behind this beloved art form."
      ),
      date: "2026-03-08",
      category: t("blog.categoryHistory", "Art History"),
      image: "/placeholder.svg",
    },
    {
      title: t("blog.article3Title", "How to Photograph Your Pet for the Perfect Portrait"),
      excerpt: t(
        "blog.article3Excerpt",
        "The quality of your AI portrait starts with the photo. Learn our top tips for capturing the perfect shot of your furry friend."
      ),
      date: "2026-02-28",
      category: t("blog.categoryTips", "Tips & Tricks"),
      image: "/placeholder.svg",
    },
    {
      title: t("blog.article4Title", "Watercolour vs Oil: Choosing the Right Style for Your Pet"),
      excerpt: t(
        "blog.article4Excerpt",
        "Each art style brings a unique feel to your pet portrait. We break down the differences to help you choose the perfect style."
      ),
      date: "2026-02-20",
      category: t("blog.categoryStyles", "Art Styles"),
      image: "/placeholder.svg",
    },
    {
      title: t("blog.article5Title", "Why Pet Portraits Make the Perfect Home Decor"),
      excerpt: t(
        "blog.article5Excerpt",
        "Interior designers agree: personalised pet art adds character and warmth to any room. Here's how to incorporate pet portraits into your home."
      ),
      date: "2026-02-12",
      category: t("blog.categoryDecor", "Home Decor"),
      image: "/placeholder.svg",
    },
    {
      title: t("blog.article6Title", "The Technology Behind AI Pet Portraits"),
      excerpt: t(
        "blog.article6Excerpt",
        "Curious about how AI transforms your photo into art? We explain the technology powering Artlypet in simple, non-technical terms."
      ),
      date: "2026-02-05",
      category: t("blog.categoryTech", "Technology"),
      image: "/placeholder.svg",
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div {...fadeInUp}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t("blog.title", "The Artlypet Blog")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "blog.subtitle",
                "Tips, inspiration, and stories about pet portraits, art styles, and the magic of AI."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="pb-8 px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeInUp}>
            <a
              href="#"
              className="group block bg-muted/30 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-6xl opacity-50">🎨</span>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
                    {articles[0].category}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {articles[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-4">{articles[0].excerpt}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(articles[0].date)}
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-12 px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(1).map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <a
                  href="#"
                  className="group block bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border h-full"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <span className="text-4xl opacity-40">🐾</span>
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                      {article.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-foreground mt-2 mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(article.date)}
                      </span>
                      <span className="text-primary text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {t("blog.readMore", "Read")}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-6 lg:px-8 bg-primary/5">
        <div className="container mx-auto text-center max-w-2xl">
          <motion.div {...fadeInUp}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("blog.ctaTitle", "Stay Inspired")}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t("blog.ctaDesc", "New articles, style updates, and pet portrait tips delivered to your inbox.")}
            </p>
            <p className="text-sm text-muted-foreground italic">
              {t("blog.ctaComingSoon", "Newsletter coming soon. Follow us on social media for updates!")}
            </p>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
};

export default Blog;
