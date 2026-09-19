# Jewelry Ecommerce — Claude Code Project Rules

## Product goal
Build a premium, editorial jewelry ecommerce experience that feels art-directed and human-made, not like a generic AI-generated storefront.

The visual language should communicate craftsmanship, material quality, confidence, and restraint. Design decisions must be specific to jewelry: macro product photography, tactile materials, fine typography, whitespace, editorial composition, and deliberate motion.

## Non-negotiable anti-AI-slop rules
- Do not use generic SaaS layouts for an ecommerce brand.
- Do not use purple/blue gradients, excessive glassmorphism, floating neon blobs, or arbitrary glowing borders.
- Avoid Inter/Roboto/Arial/system-font defaults unless the existing brand explicitly uses them.
- Avoid making every card rounded, every button pill-shaped, or every section centered.
- Avoid excessive badges, icon rows, decorative statistics, fake testimonials, or filler sections.
- Do not invent brand claims, product materials, certifications, reviews, prices, or policies.
- Do not use placeholder copy such as "Elevate your style", "Discover luxury", or similar generic AI marketing language unless the brand actually requires it.
- Prefer asymmetry, editorial grids, varied scale, strong typography, and intentional whitespace.
- Use real product imagery when available. Never hide weak content behind heavy visual effects.

## Design behavior
- Start from a defined visual system before implementing large page sections.
- Every animation must have a purpose: reveal, focus, continuity, feedback, or spatial orientation.
- Prefer CSS transitions for small interactions and Motion for React for orchestrated UI motion. Use GSAP only when a timeline or scroll interaction truly benefits from it.
- Respect `prefers-reduced-motion` and provide non-animated equivalents.
- Avoid scroll hijacking. Smooth scrolling must never block normal browser behavior, keyboard navigation, or accessibility.
- Never animate layout properties unnecessarily. Prefer transforms and opacity.

## Engineering
- Prefer Next.js + TypeScript when starting from scratch unless the repository already establishes another stack.
- Use the repository's existing styling system when one exists. Do not introduce a second styling system without a concrete reason.
- Build reusable components around real product/domain concepts, not arbitrary wrapper components.
- Keep components readable and local. Do not over-abstract early.
- Use semantic HTML and accessible controls.
- Product, cart, search, filtering, wishlist, and checkout behavior must remain usable without animation.

## Quality gates
Before declaring a feature done:
1. Verify desktop and mobile layouts.
2. Verify keyboard navigation for interactive UI.
3. Verify reduced-motion behavior.
4. Verify images have meaningful alt text or are marked decorative when appropriate.
5. Verify no console errors, hydration errors, or obvious layout shifts.
6. Run the project's lint/typecheck/test/build commands when available.
7. Review the implementation against the OpenSpec change artifacts; do not silently expand scope.

## OpenSpec discipline
- Use OpenSpec for meaningful feature work.
- Do not skip planning just because the UI is visual.
- Review proposal/spec/design/tasks before implementation.
- Implement only what the active change requires.
- Use verification before archive when the project enables the verify workflow.
- Keep the specs as the durable description of behavior and constraints.
