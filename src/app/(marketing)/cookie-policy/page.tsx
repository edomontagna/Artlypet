export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-invert prose-violet">
        <h1 className="text-4xl font-black text-white mb-8">Cookie Policy</h1>
        <p className="text-gray-400 mb-6">Last updated: March 2026</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. What Are Cookies</h2>
        <p className="text-gray-400 leading-relaxed">
          Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience by remembering your preferences and login status.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Cookies We Use</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Essential Cookies</h3>
        <p className="text-gray-400 leading-relaxed">
          Required for the website to function. These include authentication cookies (Supabase session), CSRF protection, and cookie consent preferences.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Analytics Cookies</h3>
        <p className="text-gray-400 leading-relaxed">
          Help us understand how visitors use our website. We use privacy-respecting analytics to improve our service. These are only set with your consent.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-3">Marketing Cookies</h3>
        <p className="text-gray-400 leading-relaxed">
          Used to deliver relevant advertisements and track campaign performance. These are only set with your explicit consent.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Managing Cookies</h2>
        <p className="text-gray-400 leading-relaxed">
          You can manage your cookie preferences at any time through our cookie banner (powered by Iubenda) or through your browser settings. Note that disabling essential cookies may affect the functionality of our website.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Third-Party Cookies</h2>
        <ul className="text-gray-400 space-y-2">
          <li><strong className="text-white">Stripe</strong> &mdash; Payment processing (essential)</li>
          <li><strong className="text-white">Supabase</strong> &mdash; Authentication (essential)</li>
          <li><strong className="text-white">Iubenda</strong> &mdash; Cookie consent management (essential)</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Contact</h2>
        <p className="text-gray-400 leading-relaxed">
          For questions about our cookie practices, contact us at: privacy@artlypet.com
        </p>
      </div>
    </div>
  );
}
