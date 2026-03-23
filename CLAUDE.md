# Artlypet — AI Pet Portraits

## Stack
- **Frontend**: Vite 5 + React 18 + TypeScript 5
- **UI**: Tailwind CSS 3 + shadcn/ui (Radix primitives)
- **State/Data**: React Query (TanStack Query v5) + React Context
- **Forms**: react-hook-form + Zod validation
- **i18n**: react-i18next (EN, IT, DE, FR, ES)
- **Animation**: Framer Motion
- **Backend**: Supabase (Auth, PostgreSQL, Storage, Edge Functions)
- **Payments**: Stripe Checkout
- **AI**: Gemini API (gemini-3.1-flash-image-preview)
- **Analytics**: GA4 + Meta Pixel

## Commands
```bash
npm run dev        # Dev server on :8080
npm run build      # Production build
npm run lint       # ESLint
npm run test       # Vitest (run once)
npm run test:watch # Vitest (watch mode)
npm run preview    # Preview production build
```

## Project Structure
```
src/
  components/
    landing/      # Landing page sections
    ui/           # shadcn/ui components (DO NOT edit manually)
  contexts/       # React context providers (AuthContext)
  hooks/          # Custom React hooks (useProfile, useCredits, etc.)
  i18n/           # i18next config + locale JSON files
  integrations/   # Supabase client + generated types
  lib/            # Utilities (cn())
  pages/          # Route-level components
  services/       # Data access layer (wraps Supabase calls)
supabase/
  functions/      # Edge Functions (Deno)
  migrations/     # SQL migrations
docs/             # Architecture docs
public/           # Static assets
```

## Key Conventions
- **Imports**: Use `@/` alias for `src/`
- **Styling**: Tailwind utility classes; brand tokens: `gold`, `navy`, `cream`
- **Fonts**: Playfair Display (serif headings), Inter (sans body)
- **Components**: Functional components, no class components
- **State**: React Query for server state, Context for auth/global state
- **Forms**: Always use react-hook-form + Zod schemas
- **i18n**: All user-visible text must use `t()` from react-i18next
- **Services**: All Supabase calls go through `src/services/` layer
- **Error handling**: React Query error states + ErrorBoundary
- **Toast**: Use Sonner only (not shadcn Toaster)

## Database
- 8 tables: profiles, styles, image_originals, generated_images, credit_transactions, print_orders, user_roles, audit_log
- RLS enabled on all tables
- Edge Functions use service_role key for privileged operations

## Pricing
- Starter: 2 credits / €4.99
- Bundle: 10 credits / €14.99 (popular)
- Collection: 20 credits / €24.99

## Environment Variables
```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_GA_MEASUREMENT_ID=
VITE_META_PIXEL_ID=
VITE_STRIPE_PUBLISHABLE_KEY=
```

## Edge Function Secrets (Supabase Dashboard)
```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
GEMINI_API_KEY
SUPABASE_SERVICE_ROLE_KEY
```
