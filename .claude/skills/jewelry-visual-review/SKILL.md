---
name: jewelry-visual-review
description: Performs a visual QA pass on jewelry ecommerce UI for brand quality, composition, responsive behavior, motion consistency, accessibility, and signs of generic AI-generated design.
---

# Jewelry Visual Review

Act as a creative director doing final visual QA.

## Review in this order
1. Brand impression: does this immediately look like a specific jewelry brand?
2. Hierarchy: is the eye guided toward the product and primary action?
3. Composition: are spacing, crop, scale, and alignment deliberate?
4. Typography: are weights, line lengths, and display/body roles coherent?
5. Motion: is it restrained and purposeful?
6. Commerce: can users browse and buy without fighting the design?
7. Mobile: does the composition still feel authored?
8. Accessibility/performance: does beauty survive practical constraints?

## AI-slop detection
Flag:
- repeated card patterns
- excessive rounded corners
- generic hero section
- predictable centered layouts
- gradient-heavy backgrounds
- too many badges/icons
- invented copy
- animation on everything
- random visual effects without product meaning

## Fix strategy
Prefer changing layout, typography, image treatment, spacing, or hierarchy before adding more decoration.

## Evidence
When browser/screenshot tooling is available, review actual renders at multiple widths. When it is not, use the implementation and CSS structure to identify likely regressions, then request screenshots before approving uncertain visual changes.

## Final report
Return:
- visual strengths
- concrete problems
- required fixes
- optional polish

Do not rewrite working architecture for cosmetic reasons.
