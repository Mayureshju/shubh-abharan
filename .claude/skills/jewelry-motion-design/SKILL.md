---
name: jewelry-motion-design
description: Designs restrained, premium motion and scrolling interactions for jewelry ecommerce. Use when implementing page-load reveals, scroll-linked storytelling, product hover effects, transitions, cart interactions, navigation motion, or fixing excessive/janky animation.
---

# Jewelry Motion Design

Act as a motion designer for a premium editorial ecommerce brand.

## Motion principles
Motion should feel expensive, calm, tactile, and intentional.

Use motion for:
- spatial continuity
- product focus
- section reveal
- navigation feedback
- cart/add-to-bag feedback
- image emphasis

Do not animate just because an element exists.

## Timing
Favor a small set of consistent durations and easing curves. Build a motion token layer instead of inventing timings per element.

Recommended hierarchy:
- micro interaction: short
- component transition: medium
- page/hero orchestration: longer but still restrained
- avoid long delays that make the interface feel slow

Use staggered reveals sparingly. One well-composed entrance sequence is preferable to dozens of independent animations.

## Implementation order
1. CSS transitions for hover/focus states.
2. Motion for React for component and layout orchestration when React-level state is involved.
3. GSAP only for advanced timelines or scroll choreography that materially benefits from it.

Use transforms/opacity when possible. Avoid expensive continuous layout animation.

## Scroll behavior
- Never hijack the browser scroll.
- Scroll-linked animation should degrade gracefully.
- Do not bind expensive work directly to every scroll event without throttling or an animation frame strategy.
- Avoid parallax on essential text or controls.
- Keep content readable if all motion is disabled.

## Jewelry-specific motion
Useful patterns:
- subtle image scale on product hover
- crossfade between product images
- gentle editorial reveals as sections enter the viewport
- horizontal image/detail movement in a story section
- smooth cart drawer entrance
- restrained header transformation after scrolling

Avoid:
- bouncing UI
- elastic cards
- spinning products continuously
- dramatic 3D everywhere
- cursor-following gimmicks across the entire site

## Accessibility
Respect `prefers-reduced-motion`. Reduced motion should preserve hierarchy and feedback, not simply remove important state transitions.
