# Architecture Decision Log — Artlypet

## ADR-001: AI Provider — Gemini 3.1 Flash Image Preview
**Date**: 2026-02-27
**Decision**: Use Gemini API (gemini-3.1-flash-image-preview) for portrait generation
**Rationale**: Cost-effective, fast, supports image input+output, 2K resolution
**Alternatives considered**: DALL-E 3, Stable Diffusion, Midjourney API

## ADR-002: Payments — Stripe Checkout
**Date**: 2026-02-27
**Decision**: Stripe Checkout Sessions (not Elements)
**Rationale**: Minimal frontend code, PCI compliant out-of-box, handles EU payment methods
**Alternatives considered**: Stripe Elements, Paddle, Lemon Squeezy

## ADR-003: i18n — react-i18next
**Date**: 2026-02-27
**Decision**: react-i18next with JSON locale files
**Rationale**: Industry standard, supports lazy loading, browser language detection
**Alternatives considered**: FormatJS/react-intl, custom solution

## ADR-004: State Management — React Query + Context
**Date**: 2026-02-27
**Decision**: React Query for server state, React Context for auth
**Rationale**: Already in the project, handles caching/refetching well, no Redux needed
**Alternatives considered**: Zustand, Redux Toolkit

## ADR-005: Toast System — Sonner Only
**Date**: 2026-02-27
**Decision**: Remove shadcn Toaster, keep only Sonner
**Rationale**: Avoid duplicate toast systems, Sonner has better UX and animations
