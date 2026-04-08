import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Clock, Calendar, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurImage } from "@/components/BlurImage";
import { SEOHead } from "@/components/SEOHead";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import DOMPurify from "dompurify";
import { blogPosts } from "@/data/blogPosts";

const SITE_URL = "https://artlypet.com";

const BlogPost = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);
  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const postTitle = post ? t(post.titleKey) : "";
  const postExcerpt = post ? t(post.excerptKey) : "";
  const postImage = post ? `${SITE_URL}${post.image}` : undefined;

  // BlogPosting + BreadcrumbList structured data
  useEffect(() => {
    if (!post) return;

    const blogPostingSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: postTitle,
      description: postExcerpt,
      image: postImage,
      datePublished: post.date,
      author: { "@type": "Organization", name: "Artlypet" },
      publisher: { "@type": "Organization", name: "Artlypet" },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${SITE_URL}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: postTitle,
          item: `${SITE_URL}/blog/${post.slug}`,
        },
      ],
    };

    const blogScript = document.createElement("script");
    blogScript.type = "application/ld+json";
    blogScript.textContent = JSON.stringify(blogPostingSchema);
    document.head.appendChild(blogScript);

    const breadcrumbScript = document.createElement("script");
    breadcrumbScript.type = "application/ld+json";
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.head.removeChild(blogScript);
      document.head.removeChild(breadcrumbScript);
    };
  }, [post, postTitle, postExcerpt, postImage]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">{t("blog.notFound", "Article Not Found")}</h1>
          <Button asChild className="rounded-full">
            <Link to="/blog">{t("blog.backToList", "Back to Blog")}</Link>
          </Button>
        </div>
        <FooterSection />
      </div>
    );
  }

  // Get the article content sections from i18n
  const contentKey = `blog.${post.slug.replace(/-/g, "_")}_content`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${postTitle} | Artlypet Blog`}
        description={postExcerpt}
        canonical={`/blog/${post.slug}`}
        ogImage={postImage}
        ogType="article"
      />
      <Navbar />
      <article className="container px-6 lg:px-8 py-16 lg:py-24 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8" aria-label="Breadcrumb">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.home", "Home")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("blog.label", "Blog")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="text-foreground font-medium truncate">{t(post.titleKey)}</span>
        </nav>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(post.date).toLocaleDateString()}
            </div>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {t(post.titleKey)}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            {t(post.excerptKey)}
          </p>
        </motion.div>

        {/* Hero image */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="aspect-[2/1] rounded-2xl overflow-hidden shadow-lg mb-12">
            <BlurImage src={post.image} alt={t(post.titleKey)} className="w-full h-full" />
          </div>
        </motion.div>

        {/* Article content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(contentKey, "")) }}
        />

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
            {t("blog.ctaTitle", "Ready to Create Your Pet's Portrait?")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t("blog.ctaDesc", "Join 10,000+ pet owners. 3 free portraits, no credit card needed.")}
          </p>
          <Button asChild className="shimmer-btn btn-press rounded-full h-12 px-8 text-base font-medium text-primary-foreground shadow-md">
            <Link to="/signup">
              <Sparkles className="mr-2 h-4 w-4" />
              {t("blog.ctaBtn", "Start Free")}
            </Link>
          </Button>
        </div>

        {/* Related posts */}
        {otherPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              {t("blog.relatedPosts", "Keep Reading")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {otherPosts.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="group rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <BlurImage
                      src={p.image}
                      alt={t(p.titleKey)}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {t(p.titleKey)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
      <FooterSection />
    </div>
  );
};

export default BlogPost;
