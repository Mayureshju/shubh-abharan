## Why

The business supplied the final Shubh Abharan logo and launch poster. Both are
ivory, lilac and soft gold. The storefront still wears the earlier mood board's
royal green, deep brown and bright gold. The palette should follow the logo.

## What Changes

- **BREAKING.** `ink` becomes Aubergine `#372849` (the lilac's deep shade),
  `graphite` becomes Plum-grey, `graphite-inverse` becomes Lilac-mist, `paper`
  becomes Ivory, `gold` softens to the logo's `#C6A264`.
- New `lavender` (`#AE96DA`) fill token for the primary button and selected states.
- New `lilac` (`#6D5398`) text token, exposed through a surface-relative `accent`
  (lilac on paper, gold on ink). Eyebrows and legends move from `text-gold`,
  which failed 4.5:1 on paper, to `text-accent`.
- The lotus mark is recoloured lilac, and the admin sidebar moves to aubergine.
- Flat colour only. The gradient ban is unchanged.
- Photography is regenerated in the logo's world: lilac silk, ivory marble, lisianthus and
  gypsophila, soft daylight. The jewellery itself (gold kundan, emerald drops, pearls) is unchanged,
  so catalog materials stay true. Alt text, crop notes and styling phrases in product and journal
  copy are rewritten to describe the new frames.
- The hero overlay scrim is heavier below 768px (`ink/60`), where the portrait crop puts copy over
  pale drapery; the hero pager joins the ink surface so its controls resolve to light tokens.

## Capabilities

### Modified Capabilities

- `design-system/visual-language`: the colour system requirement.

## Out of scope

- The brand name spelling ("Shubh" in the logo, "Shubha" in code).
- Renaming the product "Emerald silk bridal set", whose name refers to the old styling.
- Re-seeding MongoDB. Product alt text and descriptions change in source only.
