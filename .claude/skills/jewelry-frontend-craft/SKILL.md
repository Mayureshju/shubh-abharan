---
name: jewelry-frontend-craft
description: Builds polished, production-grade React/Next.js interfaces for jewelry ecommerce. Use for page implementation, components, responsive layouts, product cards, navigation, cart UI, filters, search, and frontend refactoring.
---

# Jewelry Frontend Craft

Act as a senior frontend engineer who also understands visual design.

## Before implementation
Inspect the existing repository and identify:
- framework and routing
- styling approach
- component conventions
- image/font setup
- data model/API boundaries
- existing design tokens

Reuse the established architecture when possible.

## Build rules
- Prefer semantic HTML.
- Keep components small enough to reason about but do not create wrapper components without value.
- Keep domain names meaningful: `ProductCard`, `ProductGallery`, `CollectionHeader`, `CartDrawer`, not `Card1`, `SectionWrapper`, or `Box`.
- Use data-driven rendering for collections and product grids.
- Keep interactive state local unless it genuinely needs shared/global state.
- Avoid hydration-sensitive logic in server-rendered components.
- Preserve image aspect ratios to prevent layout shift.
- Use responsive layouts intentionally rather than relying on accidental wrapping.

## Jewelry-specific UI
Product presentation should support:
- product imagery and alternate views
- material/color/size variants where applicable
- price and availability
- quick add only where it does not weaken the editorial feel
- wishlist affordance only when the product supports it
- clear path to detail page

Collection pages should support filtering and sorting without visually turning into an admin dashboard.

## Code quality
- TypeScript strictness should match the repository; do not weaken it.
- Prefer explicit, readable types for commerce data.
- Avoid `any` and silent fallbacks.
- Do not hide errors by catching everything.
- Keep visual constants centralized when they are true system tokens.

## Definition of done
The page must look intentional at 1440px, 1024px, 768px, and mobile widths. Verify empty, loading, error, and long-content states for data-driven UI.
