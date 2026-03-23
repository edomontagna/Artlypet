import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <header className="h-16 border-b border-border flex items-center px-4 lg:px-8">
      <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        <span className="font-serif text-xl font-bold text-gradient-gold">Artlypet</span>
      </Link>
    </header>
    <main className="container max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

      <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground">
        <p><strong>Last updated:</strong> February 2026</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">1. Service Description</h2>
        <p>Artlypet provides AI-powered pet portrait generation. You upload a photo of your pet, choose an artistic style, and our AI creates a digital portrait. Optional physical prints are available for delivery within the EU.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">2. Credits & Payments</h2>
        <p>Portraits are generated using credits. Credits are purchased in packages and do not expire. Each portrait generation costs 1 credit. Payments are processed securely by Stripe. All prices include applicable taxes. Refunds are available within 14 days of purchase if credits have not been used.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">3. Content Ownership</h2>
        <p>You retain ownership of photos you upload. Generated portraits are licensed to you for personal and commercial use. You grant Artlypet a limited license to process your uploaded images for the purpose of generating portraits.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">4. Acceptable Use</h2>
        <p>You agree not to: upload images you don't have rights to, use the service for illegal purposes, attempt to reverse-engineer the AI models, or resell the service without authorization.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">5. Data Retention</h2>
        <p>Uploaded photos and generated portraits are stored for 30 days, after which they are automatically deleted. You can download your portraits at any time during this period.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">6. Limitation of Liability</h2>
        <p>Artlypet is provided "as is". We strive for the highest quality but cannot guarantee that every AI-generated portrait will meet your expectations. If a generation fails, the credit used will be automatically refunded.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">7. Account Termination</h2>
        <p>You may delete your account at any time through your dashboard settings. We may suspend accounts that violate these terms.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">8. Governing Law</h2>
        <p>These terms are governed by EU law. Any disputes will be resolved in the courts of the service provider's jurisdiction within the EU.</p>

        <h2 className="font-serif text-2xl font-semibold text-foreground mt-8">9. Contact</h2>
        <p>For questions about these terms: legal@artlypet.com</p>
      </div>
    </main>
  </div>
);

export default Terms;
