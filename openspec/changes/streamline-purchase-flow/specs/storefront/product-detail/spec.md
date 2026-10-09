## Purpose

Defines the product detail page: how a customer inspects a piece, chooses a size, checks delivery to their pincode, and moves to purchase without leaving the page unexpectedly.

## ADDED Requirements

### Requirement: The gallery presents every image in one square frame

The product detail page SHALL present the product's images in declared order in one square frame. A customer SHALL be able to move between images by swiping on touch devices and by thumbnail controls on every device. Thumbnails SHALL render only when the product has two or more images. Each thumbnail SHALL be a keyboard-operable control with an accessible name and a non-colour indication of the current image.

#### Scenario: A product with three images renders

- **WHEN** a product with three images opens
- **THEN** the first image shows in a square frame
- **AND** three thumbnails are present, with the first marked current

#### Scenario: A customer selects a thumbnail

- **WHEN** a customer activates the second thumbnail by pointer or keyboard
- **THEN** the second image shows in the frame and its thumbnail is marked current

#### Scenario: A product with one image renders

- **WHEN** a product with one image opens
- **THEN** no thumbnail controls render

### Requirement: Customers can magnify and enlarge the product image

On devices with a fine pointer that supports hover, the main image SHALL show a round magnifier at about 2.5× while the pointer is over it. The magnifier SHALL be decorative to assistive technology. The accessible image remains the gallery image.

Every device SHALL offer a full-screen view of the current image. It SHALL show the image at its declared aspect ratio rather than the square gallery crop, fitted to the viewport. It SHALL allow moving to the previous and next image, close on Escape, and return focus to the control that opened it. A labelled control SHALL open it, and on any device so SHALL activating the main image.

#### Scenario: A desktop customer hovers the main image

- **WHEN** a mouse pointer rests over the main image
- **THEN** a round magnified view of the area under the pointer is visible

#### Scenario: A keyboard customer enlarges the image

- **WHEN** a keyboard user activates "View larger"
- **THEN** the full-screen view opens with focus inside it
- **AND** arrow keys move between images
- **AND** Escape closes it and returns focus to "View larger"

#### Scenario: A phone customer enlarges the image

- **WHEN** a customer taps the main image on a phone
- **THEN** the full-screen view opens and the image can be pinch-zoomed

### Requirement: The product page offers Buy now, Add to bag, and wishlist without detours

The product detail page SHALL offer:

- **Buy now** — the view's one primary action.
- **Add to bag** — a quiet action.
- **Save to wishlist** — an inline action.

When the product declares sizes, the customer SHALL choose one before buying. A sold-out or unavailable size SHALL NOT be selectable, and SHALL be marked by a non-colour cue as well as by its state. Every size control SHALL show a visible focus indicator.

- **Buy now** SHALL ensure the chosen variant is in the bag without increasing an existing line's quantity, then go to checkout.
- **Add to bag** SHALL add the variant and open the bag drawer on the same page.
- **Save to wishlist** SHALL save the piece without navigating, and SHALL then show that it is saved, with a link to the wishlist.

#### Scenario: A customer buys now

- **WHEN** a customer chooses a size and activates Buy now
- **THEN** checkout opens with that variant in the bag

#### Scenario: Buy now with the piece already in the bag

- **WHEN** the chosen variant is already in the bag at quantity 1 and the customer activates Buy now
- **THEN** checkout opens with that line still at quantity 1

#### Scenario: A customer adds to the bag

- **WHEN** a customer activates Add to bag
- **THEN** the bag updates immediately and the bag drawer opens on the product page

#### Scenario: A size is sold out

- **WHEN** one of a product's sizes is sold out
- **THEN** that size cannot be selected
- **AND** it is marked sold out by text styling, not colour alone

### Requirement: The product page checks delivery to a pincode

The product detail page SHALL let a customer enter a six-digit pincode and learn whether the store delivers there. The result SHALL come only from the store's configured delivery data: either the served place and its delivery charge for this piece (or that delivery is free), or that the pincode is not served. The page MUST NOT state a delivery time or any policy the business has not supplied. A checked pincode SHALL carry into checkout as the receiver pincode.

#### Scenario: A served pincode is checked

- **WHEN** a customer checks a pincode the store serves
- **THEN** the page names the served place and states the delivery charge or that delivery is free

#### Scenario: An unserved pincode is checked

- **WHEN** a customer checks a pincode the store does not serve
- **THEN** the page states that the pincode is not served
- **AND** no delivery charge is shown

#### Scenario: A malformed pincode is entered

- **WHEN** a customer submits fewer than six digits
- **THEN** the page asks for a six-digit pincode and does not query delivery

### Requirement: The purchase actions stay within reach on phones

At mobile widths, the price and the purchase actions SHALL stay fixed at the bottom of the viewport while the product page scrolls. Page content SHALL NOT be hidden behind them at the end of the page.

#### Scenario: A phone customer scrolls the gallery

- **WHEN** a customer on a 390px viewport scrolls anywhere on a product page
- **THEN** Buy now and Add to bag remain visible at the bottom of the viewport
- **AND** the last content of the page can still be scrolled into view above them
