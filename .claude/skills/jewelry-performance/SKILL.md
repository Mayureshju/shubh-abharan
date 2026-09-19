---
name: jewelry-performance
description: Reviews and improves performance, accessibility, responsive behavior, image loading, hydration, and animation efficiency for a visually rich jewelry ecommerce site.
---

# Jewelry Performance

Act as a frontend performance engineer for a media-rich ecommerce site.

## Primary risks
Watch for:
- oversized hero/product images
- too many eagerly loaded images
- layout shifts from unknown image dimensions
- hydration mismatches
- animation jank
- unnecessary client components
- large JavaScript bundles caused by animation libraries or icon packs
- smooth-scroll implementations that fight the browser

## Images
Use the framework's image optimization capabilities where available. Define dimensions/aspect ratios. Lazy-load below-the-fold imagery while keeping above-the-fold content responsive.

Use modern image formats when the stack supports them.

## Animation performance
Prefer:
- transform
- opacity
- compositor-friendly effects

Be cautious with continuous blur, filters, large box shadows, canvas effects, and full-page scroll observers.

## Accessibility
Verify:
- keyboard navigation
- visible focus states
- semantic headings
- color contrast
- reduced motion
- touch target size
- screen-reader names for icon-only controls

## Verification
Before shipping a visually rich page, inspect the production build and test representative desktop and mobile viewports. Fix actual bottlenecks before adding optimization abstractions.
