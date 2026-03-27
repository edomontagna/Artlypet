export interface BlogPost {
  slug: string;
  titleKey: string;
  excerptKey: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-ai-pet-portrait-apps-2026",
    titleKey: "blog.post1Title",
    excerptKey: "blog.post1Excerpt",
    category: "Guide",
    readTime: "5 min",
    date: "2026-03-20",
    image: "/images/renaissance.webp",
  },
  {
    slug: "pet-portrait-gift-ideas",
    titleKey: "blog.post2Title",
    excerptKey: "blog.post2Excerpt",
    category: "Inspiration",
    readTime: "4 min",
    date: "2026-03-15",
    image: "/images/oil-painting.jpg",
  },
  {
    slug: "how-ai-creates-pet-portraits",
    titleKey: "blog.post3Title",
    excerptKey: "blog.post3Excerpt",
    category: "Technology",
    readTime: "6 min",
    date: "2026-03-10",
    image: "/images/watercolor.webp",
  },
  {
    slug: "oil-painting-vs-watercolor-pet-portraits",
    titleKey: "blog.post4Title",
    excerptKey: "blog.post4Excerpt",
    category: "Styles",
    readTime: "4 min",
    date: "2026-03-05",
    image: "/images/impressionist.webp",
  },
  {
    slug: "canvas-print-guide-pet-portraits",
    titleKey: "blog.post5Title",
    excerptKey: "blog.post5Excerpt",
    category: "Prints",
    readTime: "5 min",
    date: "2026-02-28",
    image: "/images/pop-art.webp",
  },
  {
    slug: "pet-photography-tips-ai-portraits",
    titleKey: "blog.post6Title",
    excerptKey: "blog.post6Excerpt",
    category: "Tips",
    readTime: "3 min",
    date: "2026-02-20",
    image: "/images/art-nouveau.webp",
  },
  {
    slug: "why-pet-owners-love-artlypet",
    titleKey: "blog.post7Title",
    excerptKey: "blog.post7Excerpt",
    category: "Stories",
    readTime: "4 min",
    date: "2026-02-15",
    image: "/images/renaissance.webp",
  },
];
