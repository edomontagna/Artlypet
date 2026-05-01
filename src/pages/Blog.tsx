import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import { SEOHead } from "@/components/SEOHead";
import { blogPosts } from "@/data/blogPosts";
import { BlurImage } from "@/components/BlurImage";

const Blog = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[100dvh] bg-background">
      <SEOHead
        title="Pet Portrait Inspiration & Tips | Artlypet Blog"
        description="Discover guides, tips, and inspiration for AI pet portraits. Learn how to take the perfect pet photo, choose art styles, and create stunning pet masterpieces."
        canonical="/blog"
      />
      <Navbar />
      <main className="container px-6 lg:px-8 py-16 lg:py-24 max-w-5xl">
        <div className="text-center mb-12">
          <span className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-xs font-medium mb-4">
            {t("blog.label", "Blog")}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("blog.title", "Pet Portrait Inspiration & Tips")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t("blog.subtitle", "Guides, ideas, and stories from the world of AI pet art")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <BlurImage
                    src={post.image}
                    alt={t(post.titleKey)}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-[10px] font-medium">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h2 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {t(post.titleKey)}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {t(post.excerptKey)}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default Blog;
