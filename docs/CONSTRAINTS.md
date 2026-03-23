# Constraints — Artlypet

## Infrastructure
- **Hosting**: Supabase (free tier initially, upgrade as needed)
- **CDN**: Supabase Storage for images
- **Edge Functions**: Deno runtime (Supabase Edge Functions)
- **No server**: Fully serverless architecture

## Budget
- Minimize external service costs
- Stripe test mode until launch
- Gemini API: pay-per-use (flash model for cost efficiency)
- Supabase: free tier supports 50,000 monthly active users

## Browser Support
- Chrome 90+, Firefox 90+, Safari 15+, Edge 90+
- Mobile: iOS Safari 15+, Chrome Android 90+
- No IE11 support

## Performance Targets
- Lighthouse Performance: > 90
- Lighthouse Accessibility: > 90
- Lighthouse Best Practices: > 90
- Lighthouse SEO: > 90
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s

## Legal
- GDPR compliant (EU-based users)
- Cookie consent required
- Right to deletion
- Data retention: generated images expire after 30 days

## Image Constraints
- Upload: max 10MB, image/* mime types only
- Output: 2K resolution from Gemini API
- Storage: Supabase Storage with 30-day expiry
