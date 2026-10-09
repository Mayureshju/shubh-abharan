## Why

The header, mobile menu and footer all link to `/about`, and it 404s. `/contact` resolves but is a single stack — eyebrow, heading, one photograph, a placeholder email and a three-field form — with no room for the channels customers actually use (phone, WhatsApp, Instagram). Both pages need composing to the same editorial standard as the homepage, without inventing a story, a material, or a contact fact the business has not supplied.

## What Changes

- `/about` is a new route composed from the brand record and photographs already on disk: masthead with the brand name, story, materials, and the four supplied reasons as a numbered list.
- Every About fact the business has not supplied — story, founding year, place of business, metals, stones, place of manufacture — renders as a marked placeholder from a `lib/brand.ts` field, never as invented copy.
- The unused homepage `Detail` band moves to About as its materials section. Its copy is cut to what the photograph shows; the "made rather than cast" sentence is removed.
- `/contact` becomes a split masthead (ink panel with channels beside a photograph) above a form section.
- The brand record gains `story`, `contactPhone`, `contactWhatsapp` and `social`. Phone, WhatsApp and social rows render only once supplied.
- The contact form gains an enquiry topic, an optional order number, inline validation, and a status line that always tells the truth about what happened. Submit still composes `mailto:` and never posts.
- The footer gains a Follow column once social links are supplied.

## Capabilities

### New Capabilities

- `storefront/about`: The About page, its placeholder behaviour for unsupplied brand facts, and its photography-only copy rule.

### Modified Capabilities

- `storefront/contact`: Adds phone, WhatsApp and social channels as supplied-only fields, and an enquiry topic, order number and inline validation to the mailto form.

## Impact

**Code**

- `app/(storefront)/about/page.tsx` (new), `app/(storefront)/contact/page.tsx`
- `components/about/Detail.tsx` (moved from `components/home/`), `components/contact/ContactForm.tsx`
- `components/home/plates.ts` — two recropped About frames, corrected detail alt
- `components/nav/SiteFooter.tsx` — Follow column
- `lib/brand.ts`, `BRAND-INPUTS.md`, `DESIGN-SYSTEM.md`
- `app/(storefront)/specimen/page.tsx` — topic option and field error states

**Dependencies**

None.

**Not in scope**

Opening hours, a map, a mail endpoint, filling any brand field, `/search`, a journal index.
