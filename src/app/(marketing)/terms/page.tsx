export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-invert prose-violet">
        <h1 className="text-4xl font-black text-white mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-6">Last updated: March 2026</p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-400 leading-relaxed">
          By accessing or using ArtlyPet (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Service Description</h2>
        <p className="text-gray-400 leading-relaxed">
          ArtlyPet provides AI-powered artistic portrait generation for pets, humans, and creative mixes. Users can upload photos and receive AI-generated artwork in various artistic styles, with options for digital download and physical print orders.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. User Accounts</h2>
        <ul className="text-gray-400 space-y-2">
          <li>You must be at least 18 years old to create an account</li>
          <li>You are responsible for maintaining the security of your account</li>
          <li>You must provide accurate and complete registration information</li>
          <li>One account per person; accounts are non-transferable</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Credits & Subscriptions</h2>
        <ul className="text-gray-400 space-y-2">
          <li>Free accounts receive 3 credits per month, resetting on the 1st</li>
          <li>Paid subscriptions provide additional credits as specified in the plan</li>
          <li>Unused credits do not roll over to the next billing period</li>
          <li>Subscriptions auto-renew unless canceled before the renewal date</li>
          <li>Refunds are handled on a case-by-case basis</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Content Ownership</h2>
        <p className="text-gray-400 leading-relaxed">
          You retain ownership of photos you upload. AI-generated artwork created through the Service is yours to use. Free plan exports include a watermark; paid plans provide watermark-free exports. Pro and Premium plans include a commercial use license.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">6. Acceptable Use</h2>
        <p className="text-gray-400 leading-relaxed">You agree not to:</p>
        <ul className="text-gray-400 space-y-2">
          <li>Upload content that is illegal, harmful, or violates third-party rights</li>
          <li>Use the Service to generate inappropriate, offensive, or NSFW content</li>
          <li>Attempt to reverse-engineer our AI systems</li>
          <li>Share, resell, or redistribute your account credentials</li>
          <li>Use automated systems to access the Service without permission</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">7. Print Orders</h2>
        <p className="text-gray-400 leading-relaxed">
          Physical print orders are fulfilled by our printing partners. Shipping times vary by destination. We offer free returns for damaged or defective prints. Colors may vary slightly from digital previews due to printing processes.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">8. Referral Program</h2>
        <p className="text-gray-400 leading-relaxed">
          Users earn 2 credits for each new user who signs up using their referral link. Referral credits are non-transferable and cannot be exchanged for cash. We reserve the right to modify or terminate the referral program at any time.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">9. Limitation of Liability</h2>
        <p className="text-gray-400 leading-relaxed">
          ArtlyPet is provided &ldquo;as is&rdquo; without warranty of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">10. Contact</h2>
        <p className="text-gray-400 leading-relaxed">
          For questions about these Terms, contact us at: legal@artlypet.com
        </p>
      </div>
    </div>
  );
}
