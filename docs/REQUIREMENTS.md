# Requirements — Artlypet

## Authentication
- [x] Email/password signup with email verification
- [x] Google OAuth
- [x] Password reset flow
- [x] Auth callback page
- [x] 300 free credits on registration (signup_bonus)

## Landing Page
- [x] Hero section with CTA
- [x] Gallery with 12 art styles
- [x] Pricing section (Free / Premium €15 / Business €200)
- [x] Print shop section
- [x] FAQ section
- [x] Footer with language switcher
- [x] How It Works section (3 steps)
- [x] Testimonials section
- [x] Language switcher (EN/IT/DE/FR/ES)
- [x] Dark/light theme toggle

## Dashboard
- [x] Left sidebar with navigation
- [x] Real credit balance from DB (10s polling)
- [x] Plan badge (Free / Premium)
- [x] Generation history with HD/SD indicators
- [x] Settings: edit profile, delete account
- [x] Credit purchase modal → Premium upgrade
- [x] HD unlock per image (€4.90)
- [x] Download with serve-image (quality-aware)

## Portrait Generation
- [x] Photo upload with drag & drop
- [x] Style selection from DB (12 styles)
- [x] Generation type: Single (100 credits) / Mix (150 credits)
- [x] AI generation via Gemini Nano Banana 2
- [x] Polling for generation status (3s interval)
- [x] Watermarked preview for free users
- [x] HD unlock CTA for free users
- [x] Download + share buttons
- [x] Credit refund on generation failure

## Payments (Stripe)
- [x] Premium checkout session (€15)
- [x] HD image unlock checkout (€4.90)
- [x] Webhook handling for credit + plan fulfillment
- [x] Print order checkout (€79.90 / €59.90)
- [x] Idempotency checks on all webhooks
- [ ] Stripe configuration (keys pending)

## Print Orders
- [x] Stripe checkout for physical prints
- [x] Dynamic pricing (free vs premium tier)
- [x] HD requirement check before printing
- [ ] Order tracking page (planned)
- [ ] Shipping notifications (planned)

## Business (B2B)
- [x] Business plan page (/business)
- [x] Pricing card on landing page
- [ ] White-label admin dashboard (planned)
- [ ] API access for partners (planned)
- [ ] Custom branding system (planned)

## Internationalization
- [x] react-i18next setup with language detector
- [x] 5 languages: EN, IT, DE, FR, ES
- [x] All user-facing text translated
- [x] Language switcher on navbar + footer

## Security & Legal
- [x] RLS policies on all tables
- [x] Credit balance protected from client manipulation
- [x] Plan type protected from client manipulation
- [x] Stripe webhook signature verification
- [x] Privacy Policy page (GDPR)
- [x] Terms of Service page
- [x] Cookie banner (GDPR)
- [x] Account deletion (right to be forgotten)
- [x] Audit logging on all sensitive operations

## SEO & Analytics
- [x] Structured data (Organization, Product, FAQ)
- [x] Open Graph + Twitter Card meta tags
- [x] Sitemap + robots.txt
- [x] Canonical URL
- [ ] GA4 integration (placeholder ready)
- [ ] Meta Pixel integration (placeholder ready)
- [ ] hreflang tags for multi-language

## Performance
- [x] Code splitting (React.lazy on all pages)
- [x] Image lazy loading
- [x] React Query caching + polling
- [x] Vite manual chunks (vendor, query, ui, motion, i18n)
- [ ] Lighthouse audit (target > 90)

## PLANNED FEATURES (Roadmap)
- [ ] Referral program (give 10%, get 10%)
- [ ] Social sharing with pre-written messages
- [ ] Gift mode (buy portrait as gift with message)
- [ ] Weekly portrait contest / giveaway
- [ ] Pet memorial mode (special styles)
- [ ] Multi-pet group portrait
- [ ] Before/after comparison slider
- [ ] User gallery (public profile with portraits)
- [ ] Mobile app (React Native)
- [ ] Rate limiting on Edge Functions
- [ ] Sentry error tracking
- [ ] Email notifications (generation complete, order shipped)
