import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const Accessibility = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={t("accessibility.title", "Accessibility Statement")} description={t("accessibility.commitment", "Artlypet is committed to ensuring digital accessibility for people with disabilities.")} canonical="/accessibility" />
      <Navbar />
      <main className="container max-w-3xl px-4 py-16">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
          {t("accessibility.title", "Accessibility Statement")}
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {t("accessibility.commitment", "Artlypet is committed to ensuring digital accessibility for people with disabilities.")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("accessibility.standard", "We aim to conform to WCAG 2.1 Level AA standards.")}
          </p>

          <h2 className="font-serif text-2xl font-bold text-foreground mt-10">
            {t("accessibility.measures", "Accessibility Measures")}
          </h2>
          <p className="text-muted-foreground">
            {t("accessibility.measuresDesc", "We take the following measures to ensure accessibility:")}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>{t("accessibility.measure1", "Include accessibility as part of our development process")}</li>
            <li>{t("accessibility.measure2", "Provide continuous training on accessibility for our staff")}</li>
            <li>{t("accessibility.measure3", "Test with assistive technologies including screen readers")}</li>
          </ul>

          <h2 className="font-serif text-2xl font-bold text-foreground mt-10">
            {t("accessibility.feedback", "Feedback")}
          </h2>
          <p className="text-muted-foreground">
            {t("accessibility.feedbackDesc", "We welcome your feedback on the accessibility of Artlypet. Please let us know if you encounter any barriers.")}
          </p>
          <Link to="/contact" className="text-primary hover:underline font-medium">
            {t("accessibility.contactLink", "Contact us with accessibility feedback")}
          </Link>

          <h2 className="font-serif text-2xl font-bold text-foreground mt-10">
            {t("accessibility.assessment", "Assessment")}
          </h2>
          <p className="text-muted-foreground">
            {t("accessibility.assessmentDesc", "Artlypet performs regular self-assessments against WCAG 2.1 Level AA criteria.")}
          </p>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default Accessibility;
