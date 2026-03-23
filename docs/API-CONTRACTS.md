# API Contracts — Artlypet Edge Functions

## POST /functions/v1/create-checkout-session
**Auth**: Bearer token (Supabase JWT)
```typescript
// Request
{ package_id: "starter" | "bundle" | "collection" }

// Response 200
{ url: string } // Stripe Checkout URL

// Response 401
{ error: "Unauthorized" }

// Response 400
{ error: "Invalid package_id" }
```

## POST /functions/v1/stripe-webhook
**Auth**: Stripe signature header
```typescript
// Headers
{ "stripe-signature": string }

// Body: Raw Stripe event payload

// Response 200
{ received: true }

// Response 400
{ error: "Invalid signature" | "Webhook handler failed" }
```

## POST /functions/v1/generate-portrait
**Auth**: Bearer token (Supabase JWT)
```typescript
// Request
{ original_id: string, style_id: string }

// Response 200
{ generation_id: string, status: "pending" }

// Response 402
{ error: "Insufficient credits" }

// Response 401
{ error: "Unauthorized" }
```

## GET /functions/v1/check-generation-status?id={generation_id}
**Auth**: Bearer token (Supabase JWT)
```typescript
// Response 200
{
  id: string,
  status: "pending" | "processing" | "completed" | "failed",
  storage_path?: string,
  error_message?: string
}
```

## POST /functions/v1/create-print-order
**Auth**: Bearer token (Supabase JWT)
```typescript
// Request
{ generated_image_id: string }

// Response 200
{ url: string } // Stripe Checkout URL for print order

// Response 401
{ error: "Unauthorized" }
```
