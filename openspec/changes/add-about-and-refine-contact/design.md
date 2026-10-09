## Context

See proposal.md. The brand record supplies a name, a wordmark, mood-board lines and four reasons. Founding year, place of business, voice, materials, policies, contact email and address are all `null`. BRAND-INPUTS.md forbids filling any of them by guesswork, and the copy rule in `design-system/visual-language` requires every sentence to carry a measurable fact or a photographable noun.

No unused photography exists: `hero.jpg` and `collection.jpg` are byte-identical copies of `hero-worn.jpg` and `collection-v2.jpg`, and every other frame except `detail.jpg` is on the homepage. About therefore recrops the two least prominent slider frames — Hero 3 (seated, 4/5) and Collection 2 (5/4) — and takes over `detail.jpg`. `components/home/Detail.tsx` is unused since `clone-shubha-moodboard` removed the Detail band from the homepage.

## Goals / Non-Goals

**Goals:**

- An About page that is fully composed today and becomes finished copy the moment the business fills `lib/brand.ts` — no component edits.
- A contact page that offers every channel the business supplies and nothing it has not.
- A form that validates inline and never claims a message was sent.

**Non-Goals:**

- Writing a brand story, a founding date, or a materials list.
- Opening hours, a map, an appointment offer.
- A mail endpoint or message storage.

## Decisions

### Decision 1 — Structural facts placehold; optional channels omit

About's story, founding year, place and materials are the page's subject, so an unsupplied value renders `[FIELD]` the way the homepage hero does. Phone, WhatsApp, social and address are optional affordances, so they omit themselves, as `SiteFooter` does with policy links. Email stays a placeholder, as the existing contact requirement demands.

Rejected: omitting the story section until supplied. The page would render a masthead and a list, and nothing on screen would say what is missing.

### Decision 2 — Detail moves to About as Materials

The Detail band is the only section built to carry materials and policy facts, and the homepage spec forbids it there. It moves to `components/about/` with its heading changed to Materials. Its first sentence is rewritten to name only what is visible — a beaded gold border, a domed red cabochon, lilac silk. "Garnet", "closed by hand" and "made rather than cast" are claims about a generated photograph and are removed, along with the same words in `DETAIL_PLATE.alt` and the merchandise record that reuses the frame.

### Decision 3 — No closing section on About

Every candidate closing line and photograph is already the homepage's closing or the footer's statement, and the footer links Shop and Contact one screen below. The page ends on the reasons list and the footer's own `breath`.

Rejected: a campaign-overlay closer. It would repeat `Statement` verbatim.

### Decision 4 — Section variation

About: masthead (4/5 frame, five columns) → story (5/4 frame, seven columns) → materials (ink) → reasons (paper, no image). Each join changes image scale or surface. Joins are `tight`, `normal`, `normal`, then the footer's `breath`. `display` is spent once, on the brand name.

Contact: split masthead (ink + photograph) → form (paper). Join `tight`, then `breath`. The heading is `title`, matching every other non-home route.

### Decision 5 — Channels are text links

Phone, WhatsApp and social render as labelled `inline` links. The icon budget is at ten of twelve, and brand glyphs for WhatsApp or Instagram would be a second icon source. `tel:` keeps a leading `+`; `wa.me` takes digits only, so the WhatsApp field is recorded in international format.

### Decision 6 — The form is honest before and after script

A form with no `action` submits as GET, which would put the message in the URL and server logs. Submit is disabled until the client has hydrated (`useSyncExternalStore`, which needs no effect). The status line is always in the DOM so screen readers announce its change, and it says either that a mail composition is opening to the supplied address or that nothing was sent. The "sending opens your email app" note renders only when an email is supplied.

Validation reads the browser's own constraint messages into inline errors. There is no error colour in the palette; an invalid field is marked by a 2px border and a caption line, not by colour alone.

### Decision 7 — Order number is CSS-revealed

The order number field shows when the "An order" topic is checked, through `:has()` on the form. No state. It is included in the composed mail only for that topic.

## Risks / Trade-offs

- An About page full of placeholders looks unfinished. That is the intended state until the business supplies its story; BRAND-INPUTS.md is the checklist.
- `:has()` is unsupported in browsers older than 2023; there the order number field stays hidden and the message body still carries the order reference if typed into the message.

## Migration

None. New fields default to `null` / empty.
