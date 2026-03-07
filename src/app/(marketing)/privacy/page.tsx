export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-invert prose-violet">
        <h1 className="text-4xl font-black text-white mb-8">Privacy Policy</h1>
        <p className="text-gray-400 mb-6">Last updated: March 2026</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
        <p className="text-gray-400 leading-relaxed">
          ArtlyPet (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services at artlypet.com.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Information We Collect</h2>
        <p className="text-gray-400 leading-relaxed">We collect information you provide directly:</p>
        <ul className="text-gray-400 space-y-2">
          <li>Account information (name, email, password)</li>
          <li>Photos you upload for AI processing</li>
          <li>Payment information (processed by Stripe)</li>
          <li>Shipping address for print orders</li>
          <li>Communication preferences</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. How We Use Your Information</h2>
        <ul className="text-gray-400 space-y-2">
          <li>To provide and maintain our AI portrait generation service</li>
          <li>To process your payments and fulfill print orders</li>
          <li>To send transactional emails (order confirmations, password resets)</li>
          <li>To send marketing communications (with your consent)</li>
          <li>To improve our services and develop new features</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Photo Processing & AI</h2>
        <p className="text-gray-400 leading-relaxed">
          Photos you upload are processed by our AI to generate artistic portraits. We do not use your photos to train our AI models. Photos are stored securely and you can delete them at any time from your account settings.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Data Sharing</h2>
        <p className="text-gray-400 leading-relaxed">
          We share your data only with trusted service providers necessary to operate our service: Supabase (database), Stripe (payments), Brevo (emails), and our print fulfillment partners. We never sell your personal data.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">6. Your Rights (GDPR, CCPA & Global)</h2>
        <p className="text-gray-400 leading-relaxed">
          You have the right to: access your data, correct inaccuracies, delete your data, port your data, opt out of marketing, and restrict processing. Contact us at privacy@artlypet.com to exercise these rights.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">7. Cookies</h2>
        <p className="text-gray-400 leading-relaxed">
          We use essential cookies for authentication and preferences, and analytics cookies with your consent. You can manage cookie preferences through our cookie banner powered by Iubenda.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">8. Data Security</h2>
        <p className="text-gray-400 leading-relaxed">
          We implement industry-standard security measures including encryption in transit and at rest, secure authentication, and regular security audits.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">9. Contact Us</h2>
        <p className="text-gray-400 leading-relaxed">
          For privacy-related questions, contact us at: privacy@artlypet.com
        </p>
      </div>
    </div>
  );
}
