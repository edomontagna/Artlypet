import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container max-w-3xl px-6 lg:px-8 py-16 lg:py-24">
      <h1 className="font-serif text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <p><strong>Last updated:</strong> February 2026</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">1. Data We Collect</h2>
        <p>When you use Artlypet, we collect: your email address and display name (provided during registration), pet photos you upload for portrait generation, payment information (processed securely by Stripe — we never store card details), and usage data such as pages visited and features used.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">2. How We Use Your Data</h2>
        <p>We use your data to: provide the portrait generation service, process payments, send transactional emails (order confirmations, password resets), and improve our service through anonymized analytics.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">3. Data Retention</h2>
        <p>Uploaded photos and generated portraits are automatically deleted 30 days after creation. Account data is retained until you delete your account.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">4. Your Rights (GDPR)</h2>
        <p>As an EU-based service, you have the right to: access your personal data, correct inaccurate data, delete your account and all associated data (right to be forgotten), export your data, and withdraw consent at any time.</p>
        <p>To exercise these rights, use the account deletion feature in your dashboard settings or contact us at privacy@artlypet.com.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">5. Cookies</h2>
        <p>We use essential cookies for authentication and session management. Analytics cookies (Google Analytics, Meta Pixel) are only activated with your consent.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">6. Third-Party Services</h2>
        <p>We use: Supabase (hosting and database, EU region), Stripe (payment processing), Google Gemini API (AI portrait generation), Google Analytics and Meta Pixel (analytics, with consent).</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">7. Contact</h2>
        <p>For privacy inquiries: privacy@artlypet.com</p>
      </div>
    </main>
    <FooterSection />
  </div>
);

export default Privacy;
