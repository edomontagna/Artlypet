# Requirements — Artlypet

## Authentication
- [x] Email/password signup with email verification
- [ ] Google OAuth
- [ ] Password reset flow
- [ ] Auth callback page
- [ ] 2 free credits on registration

## Landing Page
- [x] Hero section with CTA
- [x] Gallery with art styles
- [x] Pricing section
- [x] Print shop section
- [x] FAQ section
- [x] Footer
- [ ] How It Works section (3 steps)
- [ ] Testimonials section
- [ ] Language switcher (EN/IT/DE/FR/ES)

## Dashboard
- [x] Basic layout with tabs
- [ ] Left sidebar (standard UX)
- [ ] Real credit balance from DB
- [ ] Generation history with pagination
- [ ] Settings: edit profile, change password, delete account
- [ ] Credit purchase modal (Stripe)

## Portrait Generation
- [x] Photo upload UI
- [x] Style selection UI
- [ ] Styles fetched from DB (not hardcoded)
- [ ] Real drag & drop upload
- [ ] AI generation via Gemini API
- [ ] Polling for generation status
- [ ] Download + share buttons

## Payments
- [ ] Stripe checkout session creation
- [ ] Webhook handling for credit fulfillment
- [ ] 3 pricing tiers: €4.99/€14.99/€24.99

## Print Orders
- [ ] Stripe checkout for physical prints
- [ ] Order tracking page

## Internationalization
- [ ] react-i18next setup
- [ ] 5 languages: EN, IT, DE, FR, ES
- [ ] All user-facing text translated

## Security & Legal
- [ ] RLS policies hardened (no client credit manipulation)
- [ ] Privacy Policy page
- [ ] Terms of Service page
- [ ] Cookie banner (GDPR)
- [ ] Account deletion (right to be forgotten)

## Analytics
- [ ] GA4 integration
- [ ] Meta Pixel integration
- [ ] SEO: structured data, sitemap, meta tags

## Performance
- [ ] Code splitting (React.lazy)
- [ ] Image lazy loading
- [ ] Lighthouse > 90
