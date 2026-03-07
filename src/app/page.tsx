import { HeroSection } from '@/components/landing/HeroSection';
import { StylesShowcase } from '@/components/landing/StylesShowcase';
import { ModesSection } from '@/components/landing/ModesSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { CTASection } from '@/components/landing/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ModesSection />
      <StylesShowcase />
      <HowItWorks />
      <CTASection />
    </>
  );
}
