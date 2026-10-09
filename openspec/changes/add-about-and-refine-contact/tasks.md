## 1. Brand record and photography

- [x] 1.1 Add `story`, `contactPhone`, `contactWhatsapp` and `social` to `lib/brand.ts`, unsupplied
- [x] 1.2 Add the four fields and the About frames (recropped Hero 3, Collection 2, Detail) to `BRAND-INPUTS.md`
- [x] 1.3 Add `ABOUT_PLATE` and `STORY_PLATE` to `components/home/plates.ts`; correct `DETAIL_PLATE.alt` and the merchandise record that reuses it

## 2. About

- [x] 2.1 Move `components/home/Detail.tsx` to `components/about/Detail.tsx`; visible-only copy, materials list with placeholders, policies only when supplied
- [x] 2.2 Add `/about`: masthead, story, materials, reasons list

## 3. Contact

- [x] 3.1 Rewrite `ContactForm`: topic, CSS-revealed order number, inline validation, hydration-gated submit, persistent status line
- [x] 3.2 Recompose `/contact`: split masthead with supplied-only channels, form section with the email-supplied note
- [x] 3.3 Add the Follow column to `SiteFooter` when social links are supplied
- [x] 3.4 Add the topic option and field error states to `/specimen`

## 4. Verify

- [x] 4.1 Update `DESIGN-SYSTEM.md` routes table
- [x] 4.2 `openspec validate add-about-and-refine-contact --strict`, `npm run check`, `npm run build`
- [x] 4.3 Browser pass at 1440, 1024, 768, 390: layout, keyboard, reduced motion, form states, console
