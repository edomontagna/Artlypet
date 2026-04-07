import { lazy, Suspense, useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CookieBanner } from "@/components/CookieBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getConsent } from "@/components/CookieBanner";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import i18n from "@/i18n";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Generate = lazy(() => import("./pages/Generate"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Demo = lazy(() => import("./pages/Demo"));
const BusinessPlan = lazy(() => import("./pages/BusinessPlan"));
const StylesGallery = lazy(() => import("./pages/StylesGallery"));
const StyleDetail = lazy(() => import("./pages/StyleDetail"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrintQuality = lazy(() => import("./pages/PrintQuality"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const SharePortrait = lazy(() => import("./pages/SharePortrait"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 minute — reduces unnecessary refetches
    },
  },
});

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    const consent = getConsent();
    if (!consent) return;
    if (consent.analytics && window.gtag) {
      window.gtag("event", "page_view", { page_path: location.pathname });
    }
    if (consent.marketing && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/business" element={<BusinessPlan />} />
          <Route path="/styles" element={<StylesGallery />} />
          <Route path="/styles/:slug" element={<StyleDetail />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/prints" element={<PrintQuality />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/share/:generationId" element={<SharePortrait />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generate"
            element={
              <ProtectedRoute>
                <Generate />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

const App = () => {
  useAnalytics();

  // Sync document lang attribute with i18n language changes
  useEffect(() => {
    const updateLang = (lng: string) => {
      document.documentElement.lang = lng.substring(0, 2);
    };
    updateLang(i18n.language || "en");
    i18n.on("languageChanged", updateLang);
    return () => {
      i18n.off("languageChanged", updateLang);
    };
  }, []);

  return (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <MotionConfig reducedMotion="user">
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <CookieBanner />
              <Suspense fallback={<PageLoader />}>
                <AnimatedRoutes />
              </Suspense>
            </BrowserRouter>
          </MotionConfig>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
  );
};

export default App;
